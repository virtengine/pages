// Regression tests for scripts/check-design.mjs - the anti-slop gate's teeth.
//
// Run with: node --test scripts/
//
// Why this file exists: the same argument as check-a11y.test.mjs. A design gate
// that cannot fail is a comment, and DESIGN-DIRECTION §7 asked for all twelve
// rules to be lintable. Each case drives the real script against a crafted tree
// in a temp directory, so an edit that loosens a rule (or tightens it into
// crying wolf on a valid plate, foil, or hard shadow) fails this suite.
import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const HERE = dirname(fileURLToPath(import.meta.url));
const CHECKER = join(HERE, "check-design.mjs");

/** Build <root>/sites/demo/... and run the checker against it. */
function run(files) {
  const root = mkdtempSync(join(tmpdir(), "design-test-"));
  for (const [name, body] of Object.entries(files)) {
    const full = join(root, "sites", "demo", name);
    mkdirSync(dirname(full), { recursive: true });
    writeFileSync(full, body);
  }
  const result = spawnSync(process.execPath, [CHECKER, root], {
    encoding: "utf8",
    env: { ...process.env, CHECK_DESIGN_SITES: "sites/demo" },
  });
  return { status: result.status, out: `${result.stdout}${result.stderr}` };
}

const CLEAN = {
  "src/pages/index.astro": `<h1>Sentence case heading</h1>
<style>
  .card { background: var(--color-paper); box-shadow: 3px 3px 0 var(--color-ink); }
  .dot { border-radius: 999px; }
  @media (prefers-reduced-motion: no-preference) {
    .flow { animation: travel 2s linear infinite; }
  }
</style>`,
};

test("1: a clean tree passes and says which sites it checked", () => {
  const { status, out } = run(CLEAN);
  assert.equal(status, 0, out);
  assert.match(out, /^check-design: OK \(sites\/demo\)/m);
});

test("2: backdrop blur fails", () => {
  const { status, out } = run({ "src/styles/a.css": `.nav { backdrop-filter: blur(8px); }` });
  assert.equal(status, 1, out);
  assert.match(out, /blur/);
});

test("3: gradient outside the foil allowlist fails, .foil passes", () => {
  const bad = run({ "src/styles/a.css": `.hero { background: radial-gradient(#000, transparent); }` });
  assert.equal(bad.status, 1, bad.out);
  assert.match(bad.out, /gradient/);
  const good = run({ "src/styles/a.css": `.foil { background: linear-gradient(115deg, #fff, transparent); }` });
  assert.equal(good.status, 0, good.out);
});

test("4: a font outside the allowlist fails", () => {
  const { status, out } = run({ "src/styles/a.css": `.t { font-family: "Space Grotesk", sans-serif; }` });
  assert.equal(status, 1, out);
  assert.match(out, /font/);
});

test("5: a soft shadow fails, a hard offset passes", () => {
  const bad = run({ "src/styles/a.css": `.card { box-shadow: 0 4px 12px rgb(0 0 0 / .2); }` });
  assert.equal(bad.status, 1, bad.out);
  assert.match(bad.out, /shadow/);
  const good = run({ "src/styles/a.css": `.card { box-shadow: 5px 5px 0 var(--color-ink); }` });
  assert.equal(good.status, 0, good.out);
});

test("6: rounded card fails the radius rule, a pill passes", () => {
  const bad = run({ "src/styles/a.css": `.card { border-radius: 24px; }` });
  assert.equal(bad.status, 1, bad.out);
  assert.match(bad.out, /radius/);
  const good = run({ "src/styles/a.css": `.chip { border-radius: 999px; }` });
  assert.equal(good.status, 0, good.out);
});

test("7: a loop without a reduced-motion gate fails, gated passes", () => {
  const bad = run({ "src/styles/a.css": `.flow { animation: travel 2s linear infinite; }` });
  assert.equal(bad.status, 1, bad.out);
  assert.match(bad.out, /loop/);
  const good = run({
    "src/styles/a.css": `@media (prefers-reduced-motion: no-preference) {
  .flow { animation: travel 2s linear infinite; }
}`,
  });
  assert.equal(good.status, 0, good.out);
});

test("8: uppercase display headings, crushed tracking and marquee fail", () => {
  const upper = run({ "src/styles/a.css": `h2 { text-transform: uppercase; }` });
  assert.equal(upper.status, 1, upper.out);
  assert.match(upper.out, /uppercase-display/);

  const tracked = run({ "src/styles/a.css": `h1 { letter-spacing: -0.06em; }` });
  assert.equal(tracked.status, 1, tracked.out);
  assert.match(tracked.out, /crushed-tracking/);

  const marquee = run({ "src/pages/index.astro": `<div role="marquee">ticker</div>` });
  assert.equal(marquee.status, 1, marquee.out);
  assert.match(marquee.out, /marquee/);
});

test("9: emoji in markup fails", () => {
  const { status, out } = run({ "src/pages/index.astro": `<p>Ship it 🚀</p>` });
  assert.equal(status, 1, out);
  assert.match(out, /emoji/);
});

test("10: Amendment B site rules still fire when pointed at det.io", () => {
  // The site-specific rules key off the path, so exercise them with a temp tree
  // that uses the real name rather than trusting the shipped files stay clean.
  const root = mkdtempJoin("design-det-");
  writeFileSync(join(root, "sites", "det.io", "src", "styles", "cream.css"), `.x { background: #f5f0e2; }`);
  const result = spawnSync(process.execPath, [CHECKER, root], {
    encoding: "utf8",
    env: { ...process.env, CHECK_DESIGN_SITES: "sites/det.io" },
  });
  assert.equal(result.status, 1, `${result.stdout}${result.stderr}`);
  assert.match(`${result.stdout}${result.stderr}`, /cream/);
});

function mkdtempJoin(prefix) {
  const root = mkdtempSync(join(tmpdir(), prefix));
  mkdirSync(join(root, "sites", "det.io", "src", "styles"), { recursive: true });
  return root;
}
