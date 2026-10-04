// Regression tests for scripts/check-perf.mjs — the performance budget's teeth.
//
// Run with: node --test scripts/
//
// Why this file exists: a gate whose failure modes were proven once by hand decays into a gate
// that cannot fail, and CI then manufactures confidence instead of evidence. Every case below
// drives the real script against a crafted dist in a temp directory, so an edit that makes the
// checker vacuous — or that makes it cry wolf on an unchanged tree — fails this suite.
//
// The mutations named in the last group are the ones that must each turn the checker RED. They
// are what makes "the checker can fail" a property of the shipped script rather than of this
// file: if a future edit makes one of them pass silently, this suite goes red with it.
import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname, basename } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { gzipSync } from "node:zlib";

const HERE = dirname(fileURLToPath(import.meta.url));
const CHECKER = join(HERE, "check-perf.mjs");

const scratch = () => mkdtempSync(join(tmpdir(), "perf-test-"));

// Gzip size is what the checker measures, so fixtures are sized in the same unit. The filler is
// INCOMPRESSIBLE RANDOM BYTES, and that detail is load-bearing twice over:
//
//   - repeated filler ("aaaa…") compresses to almost nothing, so a "grow until gzipped size is big
//     enough" loop has to double the string ~20 times and re-gzip it each round;
//   - hex TEXT is 4 bits per character, so it still compresses ~2:1 and the loop above has to run
//     tens of thousands of times, re-gzipping the whole growing buffer each pass. That made this
//     one test take 24 s. Random bytes are incompressible, so one allocation lands on target.
//
// The generator is xorshift32 (full-period state, no LCG's correlated low bits) so fixtures are
// byte-identical across runs and machines: a size-sensitive assertion must not be flaky for
// reasons that have nothing to do with the checker.
function padded(targetGzip) {
  let seed = (0x2f6e2b1 ^ targetGzip) >>> 0 || 1;
  const next32 = () => {
    seed ^= seed << 13; seed >>>= 0;
    seed ^= seed >>> 17;
    seed ^= seed << 5; seed >>>= 0;
    return seed >>> 0;
  };
  const size = targetGzip + 64;
  const bytes = Buffer.allocUnsafe(size);
  for (let i = 0; i < size; i += 4) bytes.writeUInt32LE(next32(), i);
  // Overwrite any tail left by the 4-byte stride with deterministic bytes of its own.
  for (let i = size - (size % 4); i < size; i++) bytes[i] = next32() & 0xff;
  let body = bytes;
  while (gzipSync(body, { level: 9 }).length < targetGzip) {
    const extra = Buffer.allocUnsafe(4096);
    for (let i = 0; i < extra.length; i += 4) extra.writeUInt32LE(next32(), i);
    body = Buffer.concat([body, extra]);
  }
  return body;
}

const PAGE = (refs = "") => `<!doctype html>
<html lang="en-AU">
  <head>
    <title>t</title>
    <link rel="stylesheet" href="/assets/site.css">
    <script type="module" src="/assets/app.js"></script>
    ${refs}
  </head>
  <body><h1>Title</h1><img src="/assets/hero.png" alt="Hero"></body>
</html>
`;

// A dist with the three referenced assets present, so a clean run has something to measure.
function dist(overrides = {}, { withHtml = true } = {}) {
  const root = scratch();
  mkdirSync(join(root, "assets"), { recursive: true });
  writeFileSync(join(root, "assets", "app.js"), padded(4000));
  writeFileSync(join(root, "assets", "site.css"), padded(2000));
  writeFileSync(join(root, "assets", "hero.png"), padded(500));
  if (withHtml) writeFileSync(join(root, "index.html"), PAGE(overrides.refs ?? ""));
  for (const [name, content] of Object.entries(overrides.files ?? {})) {
    mkdirSync(dirname(join(root, name)), { recursive: true });
    writeFileSync(join(root, name), content);
  }
  return root;
}

function budget(entries, root = scratch()) {
  const path = join(root, "baseline.json");
  writeFileSync(path, JSON.stringify(entries));
  return path;
}

function run(distDir, { site = "site", baselinePath, args = [] } = {}) {
  const result = spawnSync(process.execPath, [CHECKER, ...args, `${site}=${distDir}`], {
    encoding: "utf8",
    env: { ...process.env, PERF_BASELINE: baselinePath ?? join(scratch(), "absent.json") },
  });
  return { status: result.status, out: `${result.stdout}${result.stderr}` };
}

// The canonical budget for the fixture dist, measured by the checker itself.
//
// This has to be MEASURED, not hard-coded. The ratchet deliberately fails a budget looser than
// reality, so a hand-written "obviously big enough" budget would make every positive case read
// loose and the suite would be asserting the wrong thing. Deriving it from the same script means
// the positive cases mean exactly "measured == budget", and a test that tightens or loosens one
// metric is a test about THAT metric.
let CANONICAL = null;
function canonical(distDir = dist(), site = "site") {
  if (!CANONICAL) {
    const path = join(scratch(), "seed.json");
    const seeded = run(distDir, { site, baselinePath: path, args: ["--update-baseline"] });
    assert.equal(seeded.status, 0, seeded.out);
    CANONICAL = JSON.parse(readFileSync(path, "utf8"))[site];
  }
  return CANONICAL;
}

// A canonical budget with one metric replaced, for the tests that target a single metric.
const withMetric = (metric, value) => ({ site: { ...canonical(), [metric]: value } });
const MEASURED = { site: canonical() };

// A budget measured on THIS exact tree. Needed whenever a case adds real shipped bytes (extra
// markup, an inline island): re-measuring keeps the assertion about the metric under test
// instead of about a total that legitimately grew.
function budgetFor(tree, site = "site") {
  const path = join(scratch(), "on-this-tree.json");
  const seeded = run(tree, { site, baselinePath: path, args: ["--update-baseline"] });
  assert.equal(seeded.status, 0, seeded.out);
  return { site: JSON.parse(readFileSync(path, "utf8"))[site] };
}

// The measured value of one metric from a run, whatever the run's verdict.
//
// The summary line uses SHORT labels (js=, css=, largest=, total=) while the ledger keys are long
// (max-page-js, largest-asset, total-gzip). Reading one with the other's name yields a silent
// no-match, and a test that asserts on a regex it never matched is worse than no test — so the
// mapping lives here, in one place, rather than being guessed at each call site.
const METRIC_LABELS = {
  "max-page-js": "js",
  "max-page-css": "css",
  "max-page-fonts": "fonts",
  "max-page-images": "images",
  "largest-asset": "largest",
  "total-gzip": "total",
  "unresolved-assets": "unresolved",
};

const metricOf = (tree, metric) => {
  const label = METRIC_LABELS[metric] ?? metric;
  const out = run(tree).out;
  const match = new RegExp(`\\b${label}=(\\d+)`).exec(out);
  assert.ok(match, `${metric} (label ${label}) was not reported for this tree:\n${out}`);
  return Number(match[1]);
};

test("positive: a clean dist passes with an explicit PERF-OK marker", () => {
  const { status, out } = run(dist(), { baselinePath: budget(MEASURED) });
  assert.equal(status, 0, out);
  assert.match(out, /^PERF-OK sites=1/m);
  assert.match(out, /PERF-BASELINE ok/);
});

test("negative: a page over its JS budget fails and names the metric", () => {
  const { status, out } = run(dist(), { baselinePath: budget(withMetric("max-page-js", 100)) });
  assert.equal(status, 1, out);
  assert.match(out, /PERF-FAIL site: max-page-js \d+>100/);
  assert.match(out, /OVER BUDGET max-page-js/);
});

test("negative: total site weight over budget fails", () => {
  const { status, out } = run(dist(), { baselinePath: budget(withMetric("total-gzip", 100)) });
  assert.equal(status, 1, out);
  assert.match(out, /total-gzip \d+>100/);
});

test("negative: a budget looser than reality fails so the numbers cannot be padded", () => {
  const { status, out } = run(dist(), {
    baselinePath: budget(withMetric("largest-asset", canonical()["largest-asset"] * 2)),
  });
  assert.equal(status, 1, out);
  assert.match(out, /budget is loose for largest-asset/);
  assert.match(out, /LOOSE BUDGET largest-asset/);
});

test("budget: the band is two-sided and no metric can be two defects at once", () => {
  // The contract, pinned edge by edge:
  //   value > budget x 1.05   OVER   heavier than the budget allows
  //   value < budget x 0.95   LOOSE  the site got lighter and the budget is stale
  //   inside the band         ok
  //
  // Two separate defects are pinned here. First, the first cut tested `value < cap` and
  // `value > cap * headroom` as two INDEPENDENT conditions, so the band between them satisfied
  // both: a budget raised by 1% printed OVER and LOOSE on adjacent lines. Second, that version
  // was ONE-SIDED — it could not notice a site getting LIGHTER, which leaves a budget padded
  // forever, the exact decay a ratchet exists to prevent.
  const measured = canonical()["largest-asset"];

  // Seeded state: exactly at the measurement.
  assert.equal(run(dist(), { baselinePath: budget(MEASURED) }).status, 0);

  // Both edges INSIDE the band: ok. This is what absorbs the platform spread.
  const heavier = withMetric("largest-asset", Math.floor(measured * 1.04));
  const { status: heavyStatus, out: heavyOut } = run(dist(), { baselinePath: budget(heavier) });
  assert.equal(heavyStatus, 0, `a measurement inside +5% must pass:\n${heavyOut}`);

  const lighter = withMetric("largest-asset", Math.ceil(measured * 0.96));
  const { status: lightStatus, out: lightOut } = run(dist(), { baselinePath: budget(lighter) });
  assert.equal(lightStatus, 0, `a measurement inside -5% must pass:\n${lightOut}`);

  // Beyond the top: OVER, and specifically not also LOOSE.
  const heavy = withMetric("largest-asset", Math.floor(measured * 0.8));
  const { status: overStatus, out: overOut } = run(dist(), { baselinePath: budget(heavy) });
  assert.equal(overStatus, 1, overOut);
  assert.match(overOut, /OVER BUDGET largest-asset/);
  assert.ok(!/LOOSE BUDGET/.test(overOut), `must not read as both:\n${overOut}`);

  // Beyond the bottom: LOOSE, and specifically not also OVER. This is the direction the old
  // one-sided rule could not see at all.
  const paddedUp = withMetric("largest-asset", Math.ceil(measured * 1.3));
  const { status: padStatus, out: padOut } = run(dist(), { baselinePath: budget(paddedUp) });
  assert.equal(padStatus, 1, padOut);
  assert.match(padOut, /LOOSE BUDGET largest-asset/);
  assert.ok(!/OVER BUDGET/.test(padOut), `must not read as both:\n${padOut}`);
});

test("regression: the real det.io CI failure passes under the 5% band", () => {
  // PR #39's first CI run is what sized the tolerance, so it is a fixture rather than a story.
  // sharp/libvips encoded a different og.png on the Linux runner: largest-asset 43503 (Windows)
  // vs 44484 (Linux), +2.2550%, and the two-sided-adjacent total moved +0.12%. Under the old
  // exact/one-sided comparison the gate went RED on all four sites on an unchanged tree.
  // The Windows-measured budget, 43503, seeing the Linux measurement of 44484.
  const budgetFromWindows = 43503;
  const linuxMeasurement = 44484;
  const out = hypotheticalVerdict(budgetFromWindows, linuxMeasurement);
  assert.equal(out, "ok", `+2.255% must sit inside the band, got ${out}`);
  // And the same rule must still reject a regression of the same magnitude in the other
  // direction, or the band is doing nothing.
  assert.equal(hypotheticalVerdict(budgetFromWindows, 43503 * 1.5), "over");
  assert.equal(hypotheticalVerdict(budgetFromWindows, 43503 * 0.5), "loose");
});

// The tolerance the gate actually ships with, asserted rather than assumed.
//
// This exists because the fixture below is deliberately coarse: it pins the *shape* of the band
// (+2.26% in, 1.5x out, 0.5x out) and not its width, so the suite passed unchanged at 0.05 and at
// 0.06 alike. Nothing in the tests therefore held the shipped number in place — PERF_TOLERANCE
// could be widened to 50% and, apart from two incidental failures, the "budget" gate would have
// stopped meaning anything while still reporting green. This single assertion is the tie between
// the measured Windows-vs-Linux spread in the header table and the constant the gate uses.
//
// 0.05 is the sized value: the worst observed platform spread is +2.2550% (det.io largest-asset,
// sharp/libvips emitting a different og.png on Linux), and the band is roughly double that. Change
// it only with a fresh measurement, and update the header table in check-perf.mjs in the same
// commit, because a wider band is a weaker budget.
test("the shipped band is the sized +/-5%, not a value that drifted", () => {
  const src = readFileSync(CHECKER, "utf8");
  const m = src.match(/const PERF_TOLERANCE = ([0-9.]+);/);
  assert.ok(m, "PERF_TOLERANCE must stay a plain numeric const in check-perf.mjs");
  assert.equal(
    Number(m[1]),
    0.05,
    "PERF_TOLERANCE changed. The band is sized from the measured platform spread; re-measure " +
      "and update the header table in check-perf.mjs in the same commit.",
  );
});

// The verdict rule, mirrored from check-perf.mjs. The mirroring is deliberate: this asserts the
// CONTRACT as a pure function, so a change to the script that breaks the contract is caught here
// even if the script's own tests were rewritten to match it.
//
// The tolerance is NOT re-typed here. It is read out of the checker's own source, because a
// hand-copied 0.05 is a second source of truth: widen PERF_TOLERANCE in the gate and this helper
// would keep asserting the old band, so the suite could pass while the shipped gate did something
// else — the tests would be asserting a rule that no longer exists. Reading the constant keeps the
// contract assertion honest about the band the gate actually applies.
const PERF_TOLERANCE = readSourceConstant(CHECKER, "PERF_TOLERANCE");

// Pull `const <NAME> = <number>;` out of a source file. Asserts on the shape, so a refactor that
// turns the constant into something else fails loudly here rather than silently falling back to a
// stale literal baked into this file.
function readSourceConstant(file, name) {
  const src = readFileSync(file, "utf8");
  const m = src.match(new RegExp(`const ${name} = ([0-9.]+);`));
  assert.ok(m, `${name} must stay a plain numeric const in ${basename(file)}`);
  return Number(m[1]);
}

function hypotheticalVerdict(cap, value) {
  const tolerance = PERF_TOLERANCE;
  const ceiling = Math.floor(cap * (1 + tolerance));
  const floor = Math.ceil(cap * (1 - tolerance));
  if (value > ceiling) return "over";
  if (value < floor) return "loose";
  return "ok";
}

test("negative: unresolved-assets catches a local asset reference with no file behind it", () => {
  const broken = dist({ refs: '<script type="module" src="/assets/gone.js"></script>' });
  const { status, out } = run(broken, { baselinePath: budget(MEASURED) });
  assert.equal(status, 1, out);
  assert.match(out, /unresolved-assets 1>0/);
  assert.match(out, /UNRESOLVED index\.html :: <script src="\/assets\/gone\.js">/);
});

test("negative: a missing stylesheet reference is unresolved, not silently skipped", () => {
  const broken = dist({ refs: '<link rel="stylesheet" href="/assets/nope.css">' });
  const { status, out } = run(broken, { baselinePath: budget(MEASURED) });
  assert.equal(status, 1, out);
  assert.match(out, /unresolved-assets 1>0/);
});

test("negative: a missing image src is unresolved", () => {
  const root = dist();
  writeFileSync(join(root, "index.html"), PAGE().replace("/assets/hero.png", "/assets/absent.png"));
  const { status, out } = run(root, { baselinePath: budget(MEASURED) });
  assert.equal(status, 1, out);
  assert.match(out, /unresolved-assets 1>0/);
  assert.match(out, /<img src="\/assets\/absent\.png">/);
});

test("false positive: external and inline-URL references are not this build's weight", () => {
  const external = dist({
    refs: `<script type="module" src="https://cdn.example.com/x.js"></script>
           <link rel="stylesheet" href="//fonts.example.com/f.css">
           <img src="data:image/gif;base64,R0lGOD" alt="dot">`,
  });
  // The extra markup is itself real shipped weight, so the budget is measured on this tree. What
  // must not change is the verdict on the REFERENCES: none is a dangling local asset, so
  // unresolved stays 0 and the run passes rather than reporting three phantom 404s.
  const { status, out } = run(external, { baselinePath: budget(budgetFor(external)) });
  assert.equal(status, 0, out);
  assert.match(out, /unresolved=0/);
});

test("false positive: a JSON-LD block is data, not executable JavaScript", () => {
  // Charging structured data to the JS budget would make a richer schema a reason to fail the
  // gate — the exact pressure that makes teams delete their schema. identity.org.au and
  // docs.virtengine.com both ship JSON-LD.
  const rich = dist({ refs: `<script type="application/ld+json">${"x".repeat(5000)}</script>` });
  assert.equal(
    metricOf(rich, "max-page-js"),
    metricOf(dist(), "max-page-js"),
    "a 5 KB schema must not change the page JS budget",
  );
});

test("false positive: inline module script counts toward the page, and that is real weight", () => {
  const inline = dist({ refs: `<script type="module">${"y".repeat(3000)}</script>` });
  assert.ok(
    metricOf(inline, "max-page-js") > metricOf(dist(), "max-page-js"),
    "inline executable script must raise the page's JS",
  );
});

test("false positive: a source map is not a byte the reader downloads", () => {
  const root = dist();
  writeFileSync(join(root, "assets", "app.js.map"), padded(90000));
  const { status, out } = run(root, { baselinePath: budget(MEASURED) });
  assert.equal(status, 0, out);
  // 90 KB of source map would dominate every other metric if it were counted, so the largest
  // asset must still be the bundle itself and the site total must be unchanged by it.
  // NB: the summary line labels this `largest=`, not `largest-asset=` — the label is the short
  // form, the metric key is the long one, and a test that guesses the wrong one silently
  // asserts nothing.
  assert.match(out, /largest=\d+\(assets\/app\.js\)/);
  assert.ok(
    !/largest=9\d{4}/.test(out),
    `a source map must never be the largest asset:\n${out}`,
  );
  // The map IS in the dist (files=5 proves the walk saw it) but is excluded from the weight.
  assert.match(out, /files=5/);
  assert.equal(
    metricOf(root, "total-gzip"),
    canonical()["total-gzip"],
    "a source map must not add to the site's shipped weight",
  );
});

// ---------------------------------------------------------------------------
// max-page-fonts / max-page-images: the two per-page metrics added after the
// gate shipped. Each case below drives the real script, so an edit that turns
// either metric into a decorative zero fails this group rather than shipping.
// ---------------------------------------------------------------------------

test("positive: the two new metrics are present in the ledger and are measured, not zero", () => {
  // The anti-vacuity case. A metric added to METRICS and to the ledger but never
  // computed would satisfy check-static.mjs and pass CI forever while pricing
  // nothing, which is the failure this suite exists to make impossible.
  assert.ok("max-page-fonts" in canonical(), "max-page-fonts must be a ledger key");
  assert.ok("max-page-images" in canonical(), "max-page-images must be a ledger key");
  const { out } = run(dist());
  assert.match(out, /\bfonts=\d+\(/, `the summary must report fonts=:\n${out}`);
  assert.match(out, /\bimages=\d+\(/, `the summary must report images=:\n${out}`);
});

test("negative: a page over its image budget fails and names the metric", () => {
  const root = dist();
  // The fixture page already references assets/hero.png, so the baseline carries
  // whatever that costs; add a second image that is deliberately enormous.
  writeFileSync(join(root, "assets", "huge.png"), padded(120000));
  writeFileSync(
    join(root, "index.html"),
    PAGE(`<link rel="stylesheet" href="/assets/site.css">
    <img src="/assets/huge.png" alt="Huge">`),
  );
  const tight = budget(withMetric("max-page-images", 600));
  const { status, out } = run(root, { baselinePath: tight });
  assert.equal(status, 1, out);
  // The summary line lists EVERY metric that is over, comma-separated after the site name, so
  // the metric has to be matched inside the list rather than immediately after `site:` -- which is
  // what a naive anchor would do, and it would pass for the wrong reason on a tree with one fault.
  assert.match(out, /PERF-FAIL site:.*max-page-images \d+>600/);
});

test("negative: a page over its font budget fails and names the metric", () => {
  const root = dist();
  writeFileSync(join(root, "assets", "fat.woff2"), padded(70000));
  // Astro emits asset URLs site-absolute, so the fixture must too -- resolving
  // the font relative to the stylesheet's own directory would find nothing and
  // quietly measure 0.
  writeFileSync(
    join(root, "assets", "site.css"),
    `@font-face{font-family:F;src:url(/assets/fat.woff2) format("woff2")}`,
  );
  const tight = budget(withMetric("max-page-fonts", 500));
  const { status, out } = run(root, { baselinePath: tight });
  assert.equal(status, 1, out);
  assert.match(out, /PERF-FAIL site:.*max-page-fonts \d+>500/);
});

test("positive: a font only the CSS references still counts toward the page", () => {
  // This is the case the metric exists for. Nothing in the HTML names the font
  // file -- it is reached only through an @font-face url() -- which is exactly
  // how @fontsource ships and how a multi-family stack stays invisible to a gate
  // that only reads tags.
  const bare = dist();
  const withFont = dist();
  writeFileSync(join(withFont, "assets", "fat.woff2"), padded(70000));
  writeFileSync(
    join(withFont, "assets", "site.css"),
    `@font-face{font-family:F;src:url(/assets/fat.woff2) format("woff2")}`,
  );
  const before = metricOf(bare, "max-page-fonts");
  const after = metricOf(withFont, "max-page-fonts");
  assert.ok(after > before, `@font-face weight must raise the page's fonts (${before} -> ${after})`);
  // And it must not be double-counted into JavaScript: the stylesheet's own
  // bytes are page CSS, the font it pulls is page FONT.
  assert.equal(
    metricOf(withFont, "max-page-js"),
    metricOf(bare, "max-page-js"),
    "a @font-face url must not be charged to the JavaScript budget",
  );
});

test("positive: one image named by several srcset densities is charged once", () => {
  // A srcset is one download chosen by viewport width. Charging every candidate
  // would report 3x the weight the reader actually pays and train everyone to
  // ignore the number.
  const root = dist();
  writeFileSync(
    join(root, "index.html"),
    `<!doctype html><html lang="en-AU"><head><title>t</title>
    <link rel="stylesheet" href="/assets/site.css">
    </head><body><h1>Title</h1>
    <img src="/assets/hero.png" alt="Hero"
      srcset="/assets/hero.png 400w, /assets/hero.png 800w, /assets/hero.png 1200w">
    </body></html>`,
  );
  assert.equal(
    metricOf(root, "max-page-images"),
    metricOf(dist(), "max-page-images"),
    "the same file in three srcset densities is one download, not three",
  );
});

test("false positive: an image URL in CSS is page weight only once per page", () => {
  const root = dist();
  writeFileSync(join(root, "assets", "hero.png"), padded(500));
  writeFileSync(
    join(root, "assets", "site.css"),
    `.a{background:url(/assets/hero.png)}.b{background:url(/assets/hero.png)}`,
  );
  assert.equal(
    metricOf(root, "max-page-images"),
    metricOf(dist(), "max-page-images"),
    "two rules naming one image must not bill the reader twice",
  );
});

test("mutation: removing the @font-face scan must turn the checker RED", () => {
  // If the CSS-scanning loop were deleted, the font cases above would go quiet and
  // the budget would admit any font weight forever. Deleting the loop has to turn
  // this suite red, which is what makes the coverage a property of the script.
  const stripped = join(scratch(), "stripped-perf.mjs");
  const original = readFileSync(CHECKER, "utf8");
  const src = original.replace(
    /for \(const sheet of pageStylesheets\) \{[\s\S]*?\n    \}\n/,
    "",
  );
  assert.notEqual(src, original, "the mutation must actually remove the @font-face loop");
  writeFileSync(stripped, src);
  const root = dist();
  writeFileSync(join(root, "assets", "fat.woff2"), padded(70000));
  writeFileSync(
    join(root, "assets", "site.css"),
    `@font-face{font-family:F;src:url(/assets/fat.woff2) format("woff2")}`,
  );
  const before = run(root).out;
  const after = spawnSync(process.execPath, [stripped, `site=${root}`], {
    encoding: "utf8",
    env: { ...process.env, PERF_BASELINE: join(scratch(), "absent.json") },
  });
  const afterOut = `${after.stdout}${after.stderr}`;
  assert.match(before, /OVER BUDGET max-page-fonts: \d+ > 0/, `the shipped checker must charge the font:\n${before}`);
  assert.ok(
    !/OVER BUDGET max-page-fonts/.test(afterOut),
    "with the @font-face scan removed the font budget must stop charging -- which is why this test exists",
  );
});

test("mutation: removing the image charging must turn the checker RED", () => {
  // Empty the charge() body rather than redeclaring it -- a second `const charge`
  // is a SyntaxError and `() => {}` drops its parameter, so either version dies
  // before it measures anything and the test would assert nothing.
  const stripped = join(scratch(), "stripped-images.mjs");
  const original = readFileSync(CHECKER, "utf8");
  const src = original.replace(
    /const charge = \(abs\) => \{[\s\S]*?\n    \};/,
    "const charge = () => {};",
  );
  assert.notEqual(src, original, "the mutation must actually empty the charge() body");
  writeFileSync(stripped, src);
  const result = spawnSync(process.execPath, [stripped, `site=${dist()}`], {
    encoding: "utf8",
    env: { ...process.env, PERF_BASELINE: join(scratch(), "absent.json") },
  });
  const mutated = `${result.stdout}${result.stderr}`;
  // Polarity, stated explicitly because it is the whole point of this test: the
  // SHIPPED checker must charge the page's <img>, and the MUTATED one must stop
  // doing so -- which is why the image budget's coverage is a property of the
  // script rather than of this file. With the charge() body gone the metric
  // reads a cheerful zero and no budget can catch it again.
  assert.match(run(dist()).out, /images=[1-9]\d*\(/, "the shipped checker must charge images");
  assert.match(mutated, /images=0\(\)/, `the mutation must zero the image metric:\n${mutated}`);
  assert.ok(
    !/OVER BUDGET max-page-images/.test(mutated),
    "with charge() emptied the image budget must stop charging -- which is why this test exists",
  );
});

test("vacuous: a dist with no HTML hard-fails instead of passing", () => {
  const { status, out } = run(dist({}, { withHtml: false }), { baselinePath: budget(MEASURED) });
  assert.equal(status, 1, out);
  assert.match(out, /no HTML in dist/);
});

test("empty: a missing dist directory hard-fails", () => {
  const { status, out } = run(join(scratch(), "nope"), { baselinePath: budget(MEASURED) });
  assert.equal(status, 1, out);
  assert.match(out, /dist directory does not exist/);
});

test("vacuous: HTML with no resolvable asset reference hard-fails", () => {
  // This is the mutation that matters most. If the resolver silently stops resolving, every
  // per-page number reads a cheerful 0 and the site looks the FASTEST it has ever been.
  const root = scratch();
  writeFileSync(join(root, "index.html"), "<!doctype html><html><body>no assets at all</body></html>");
  const { status, out } = run(root, { baselinePath: budget(MEASURED) });
  assert.equal(status, 1, out);
  assert.match(out, /resolved no asset references/);
});

test("vacuous: a dist whose every reference dangles hard-fails", () => {
  const root = scratch();
  writeFileSync(join(root, "index.html"), PAGE());
  const { status, out } = run(root, { baselinePath: budget(MEASURED) });
  assert.equal(status, 1, out);
  assert.match(out, /resolved no asset files/);
});

test("budget: a site with no baseline entry is held to zero on every metric", () => {
  const { status, out } = run(dist(), { baselinePath: budget({ other: {} }) });
  assert.equal(status, 1, out);
  assert.match(out, /PERF-FAIL site: max-page-js/);
});

test("per-site run: checking one site does not trip on the other sites' baseline entries", () => {
  // CI runs this once per site (matrix job), so the ledger legitimately lists sites that are
  // not part of this run. Stale entries are caught repo-side by check-static.mjs instead.
  const entries = { site: MEASURED.site, "some-other-site": { "total-gzip": 1 } };
  const { status, out } = run(dist(), { baselinePath: budget(entries) });
  assert.equal(status, 0, out);
  assert.match(out, /^PERF-OK/m);
});

test("update-baseline: writes the measured ledger", () => {
  const path = budget({});
  const { status, out } = run(dist(), { baselinePath: path, args: ["--update-baseline"] });
  assert.equal(status, 0, out);
  assert.match(out, /PERF-BASELINE updated/);
  const written = JSON.parse(readFileSync(path, "utf8"));
  assert.deepEqual(
    Object.keys(written.site).sort(),
    [
      "largest-asset",
      "max-page-css",
      "max-page-fonts",
      "max-page-images",
      "max-page-js",
      "total-gzip",
      "unresolved-assets",
    ],
  );
  assert.equal(written.site["unresolved-assets"], 0);
  assert.ok(written.site["max-page-js"] > 0);
  // The fixture page carries an <img>, so the image metric must be written as a
  // real number rather than a structural zero.
  assert.ok(written.site["max-page-images"] > 0);
});

test("update-baseline: refuses to write when a site could not be measured", () => {
  const path = budget(MEASURED);
  const missing = join(scratch(), "gone");
  const { status, out } = run(missing, { baselinePath: path, args: ["--update-baseline"] });
  assert.equal(status, 1, out);
  assert.match(out, /refusing to update baseline/);
  const kept = JSON.parse(readFileSync(path, "utf8"));
  assert.deepEqual(kept, MEASURED, "the ledger must survive a failed run");
});

// The defect this pins: --update-baseline built the written ledger from the sites on the COMMAND
// LINE alone, so re-seeding one site turned a four-site ledger into a one-site ledger and deleted
// the other three budgets wholesale — while the log still read "updated ... for <site>", which
// reads like a targeted edit. It is the same class as a check that passes while checking nothing:
// the tool reported a scoped success and performed a global deletion.
//
// Two claims are kept apart on purpose. The FIRST is the measurement — the three other sites
// survive. The SECOND is that the log stops lying: it must name what it carried over, so a future
// regression that deletes a site cannot be read as an ordinary re-seed. A fix that deleted the
// sites but kept the old wording would pass a key-count-only assertion, so the wording is pinned
// too.
test("update-baseline: re-seeding one site keeps the other sites' budgets", () => {
  const ledger = {
    // The named site carries a DELIBERATELY WRONG budget, so "was it re-measured?" is decidable:
    // a run that copied the old numbers through would leave total-gzip at 1. This is the guard
    // against a merge so eager it keeps everything and re-seeds nothing.
    site: { ...canonical(), "total-gzip": 1 },
    "virtengine.com": { ...canonical(), "total-gzip": 20606691, "largest-asset": 1395883 },
    "docs.virtengine.com": { ...canonical(), "total-gzip": 2608275, "largest-asset": 72249 },
    "identity.org.au": { ...canonical(), "total-gzip": 4462981, "largest-asset": 1240030 },
  };
  const path = budget(ledger);

  const { status, out } = run(dist(), { baselinePath: path, args: ["--update-baseline"] });
  assert.equal(status, 0, out);

  const written = JSON.parse(readFileSync(path, "utf8"));
  assert.deepEqual(
    Object.keys(written).sort(),
    Object.keys(ledger).sort(),
    `the ledger lost entries: ${Object.keys(ledger).sort()} -> ${Object.keys(written).sort()}`,
  );
  // Byte-for-byte, not just "still present": a merge that zeroed or re-measured the untouched
  // sites would still satisfy a key-count check, and would re-gate every production site.
  for (const site of ["virtengine.com", "docs.virtengine.com", "identity.org.au"]) {
    assert.deepEqual(written[site], ledger[site], `${site} budget must be carried through untouched`);
  }
  assert.deepEqual(
    written.site,
    canonical(),
    "the named site must be re-measured, not carried over from the old ledger",
  );

  // The log must describe what actually happened.
  assert.match(out, /carried over 3 unmeasured site\(s\): /, out);
  assert.match(out, /carried over\)/, out);
});

// A site the operator did NOT name must never be silently deleted, even in the corner case where
// the named site could not be measured. Pins the refusal path against a merge that writes anyway.
//
// A guard that fires AFTER the write is a report, not a guard.
//
// The first version of the drop check read the file back and compared, which looks like the
// stronger check because it observes the real file. It is not: the write has already happened by
// then. Reverting `merged` to a replace made that version print "dropped 3 site(s)" and exit 1
// with the ledger on disk already reduced to ['det.io'] -- the check named the victims after
// destroying them, and the operator's only recovery was the same re-seed-by-hand that was the
// original hazard.
//
// This test pins the ORDERING, which is the whole point: when the merge would drop a site, the
// run must fail AND the file must be byte-identical to what it was before. Asserting only the exit
// code is what let the broken version pass a review.
test("update-baseline: refusing to drop a site leaves the file untouched, not merely reported", () => {
  const ledger = {
    site: { ...canonical(), "total-gzip": 1 },
    "virtengine.com": { ...canonical(), "total-gzip": 20606691 },
    "det.io": { ...canonical(), "total-gzip": 1030258 },
  };
  const path = budget(ledger);
  const before = readFileSync(path, "utf8");

  // Run the checker with a copy of its source whose merge is reverted to a REPLACE. Building the
  // mutant from the unmutated module by path (never by importing it) keeps the harness from
  // serving a cached module and quietly testing the original.
  const source = readFileSync(CHECKER, "utf8");
  const anchor = "const merged = { ...baseline };";
  assert.ok(source.includes(anchor), "the merge anchor moved; update this mutant");
  const mutantDir = join(scratch(), "mutant");
  mkdirSync(mutantDir, { recursive: true });
  const mutantPath = join(mutantDir, "check-perf.mjs");
  writeFileSync(mutantPath, source.replace(anchor, "const merged = {};"));

  const result = spawnSync(process.execPath, [mutantPath, "--update-baseline", `site=${dist()}`], {
    encoding: "utf8",
    env: { ...process.env, PERF_BASELINE: path },
  });
  const out = `${result.stdout}${result.stderr}`;

  assert.equal(result.status, 1, `a replace-merge must be refused:\n${out}`);
  assert.match(out, /would drop 2 site\(s\)/, out);
  // The load-bearing assertion: nothing was destroyed on the way to the error.
  assert.equal(
    readFileSync(path, "utf8"),
    before,
    "the ledger must be byte-identical after a refused update -- a guard that fires after the write reports the damage it already caused",
  );
});

test("update-baseline: a failed measurement leaves every other site's budget intact", () => {
  const ledger = {
    site: canonical(),
    "virtengine.com": { ...canonical(), "total-gzip": 20606691 },
    "det.io": { ...canonical(), "total-gzip": 1030258 },
  };
  const path = budget(ledger);
  const { status, out } = run(join(scratch(), "not-built"), { baselinePath: path, args: ["--update-baseline"] });
  assert.equal(status, 1, out);
  assert.deepEqual(JSON.parse(readFileSync(path, "utf8")), ledger, "no site may be dropped by a failed run");
});

test("the repo's own baseline matches the checker's metric set", () => {
  const real = JSON.parse(readFileSync(join(HERE, "perf-baseline.json"), "utf8"));
  const metrics = [
    "max-page-js",
    "max-page-css",
    "max-page-fonts",
    "max-page-images",
    "largest-asset",
    "total-gzip",
    "unresolved-assets",
  ];
  assert.ok(Object.keys(real).length > 0, "the ledger must not be empty");
  for (const [site, budget_] of Object.entries(real)) {
    assert.deepEqual(Object.keys(budget_).sort(), [...metrics].sort(), `${site} budget keys drifted`);
    for (const [metric, value] of Object.entries(budget_)) {
      assert.equal(typeof value, "number", `${site}.${metric} must be a number`);
      assert.ok(value >= 0, `${site}.${metric} must not be negative`);
    }
    assert.equal(budget_["unresolved-assets"], 0, `${site} must ship zero dangling references`);
  }
});

test("every site under sites/ has a perf budget entry", () => {
  // The repo-level half of the contract: check-static.mjs owns the wiring, this pins the ledger
  // so a new site cannot land with no budget at all.
  const real = JSON.parse(readFileSync(join(HERE, "perf-baseline.json"), "utf8"));
  for (const site of ["virtengine.com", "docs.virtengine.com", "det.io", "identity.org.au"]) {
    assert.ok(real[site], `perf-baseline.json has no entry for ${site}`);
  }
});

// --- the mutations this suite exists to catch -------------------------------------------
// Each of these is a plausible "simplification" that would silently turn the gate off. The
// assertions below are the reason the gate is believed.

test("mutation: raising every budget by 3x must turn the checker RED", () => {
  // If a budget edit alone could turn this suite green on a heavier tree, the ratchet is not a
  // ratchet. Here the tree is UNCHANGED and only the ledger moves, so a correct checker is loose
  // and a checker that trusts the ledger blindly would pass.
  const inflated = {
    site: Object.fromEntries(
      Object.entries(MEASURED.site).map(([k, v]) => [k, v === 0 ? 0 : Math.ceil(v * 3)]),
    ),
  };
  const { status, out } = run(dist(), { baselinePath: budget(inflated) });
  assert.equal(status, 1, out);
  assert.match(out, /budget is loose for/);
});

test("mutation: stripping the unresolved-asset resolver must turn the checker RED", () => {
  // The resolver is the only thing in this repo that can see a dangling asset URL. If it is
  // removed, a dist with a 404-ing script must stop failing — so this asserts the opposite.
  const broken = dist({ refs: '<script type="module" src="/assets/gone.js"></script>' });
  const caught = run(broken, { baselinePath: budget(MEASURED) });
  assert.equal(caught.status, 1, caught.out);
  // And the same broken dist must stay caught when the only other metric is impossible to trip.
  const onlyUnresolved = { site: { "unresolved-assets": 0 } };
  const isolated = run(broken, { baselinePath: budget(onlyUnresolved) });
  assert.equal(isolated.status, 1, isolated.out);
  assert.match(isolated.out, /unresolved-assets 1>0/);
});

test("mutation: an empty dist must turn the checker RED, not pass on a zero measurement", () => {
  const root = scratch();
  writeFileSync(join(root, "index.html"), "<!doctype html><html><body></body></html>");
  const generous = { site: { ...canonical(), "max-page-js": 0, "max-page-css": 0, "total-gzip": 0 } };
  const { status, out } = run(root, { baselinePath: budget(generous) });
  assert.equal(status, 1, out);
  assert.match(out, /resolved no asset references/);
});
