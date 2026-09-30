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
import { join, dirname } from "node:path";
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

test("budget: the three bands are disjoint, and no metric can be two defects at once", () => {
  // The contract, pinned edge by edge:
  //   value >  ceiling        OVER   heavier than the budget allows
  //   cap < value <= ceiling  OK     the 2% allowance absorbing measurement jitter
  //   value <= cap            LOOSE  the budget is padded
  //
  // This test is the regression guard for the first cut, which tested `value < cap` and
  // `value > cap * headroom` as two independent conditions. The band [cap, cap x headroom]
  // satisfied BOTH, so a budget raised by 1% printed OVER and LOOSE on adjacent lines.
  const measured = canonical()["largest-asset"];

  // Seeded state: exactly at the measurement.
  assert.equal(run(dist(), { baselinePath: budget(MEASURED) }).status, 0);

  // Just inside the allowance: ok. This is the band that must exist, or every zlib bump is a
  // red build on a tree that got no heavier.
  const nudged = withMetric("largest-asset", measured - Math.floor(measured / 200));
  const { status: nudgeStatus, out: nudgeOut } = run(dist(), { baselinePath: budget(nudged) });
  assert.equal(nudgeStatus, 0, `a budget inside the 2% allowance must pass:\n${nudgeOut}`);

  // Padded by 1%: LOOSE, and specifically not also OVER.
  const paddedUp = withMetric("largest-asset", measured + Math.ceil(measured / 200));
  const { status: padStatus, out: padOut } = run(dist(), { baselinePath: budget(paddedUp) });
  assert.equal(padStatus, 1, padOut);
  assert.match(padOut, /budget is loose for largest-asset/);
  assert.ok(
    !/OVER BUDGET/.test(padOut),
    `a padded budget must not also read as over budget:\n${padOut}`,
  );

  // Beyond the allowance: OVER, and specifically not also LOOSE.
  const heavy = withMetric("largest-asset", Math.floor(measured / 2));
  const { status: heavyStatus, out: heavyOut } = run(dist(), { baselinePath: budget(heavy) });
  assert.equal(heavyStatus, 1, heavyOut);
  assert.match(heavyOut, /OVER BUDGET largest-asset/);
  assert.ok(
    !/LOOSE BUDGET/.test(heavyOut),
    `an over-budget site must not also read as a loose budget:\n${heavyOut}`,
  );
});

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
    ["largest-asset", "max-page-css", "max-page-js", "total-gzip", "unresolved-assets"],
  );
  assert.equal(written.site["unresolved-assets"], 0);
  assert.ok(written.site["max-page-js"] > 0);
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

test("the repo's own baseline matches the checker's metric set", () => {
  const real = JSON.parse(readFileSync(join(HERE, "perf-baseline.json"), "utf8"));
  const metrics = ["max-page-js", "max-page-css", "largest-asset", "total-gzip", "unresolved-assets"];
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
