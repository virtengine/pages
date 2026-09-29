// Regression tests for the sites' audit:seo gate (sites/*/scripts/audit-seo-meta.mjs).
//
// Run with: node --test scripts/*.test.mjs
//
// Why this file exists: all four sites shipped this script and no workflow ran it — and it could
// not have failed anyway, because it only ever printed counts (no thresholds, no exit code, no
// marker). These cases pin the gate that replaced that report: missing and duplicated titles and
// descriptions fail, an input with nothing to check fails, and a noindex page (an Astro redirect
// stub) is not mistaken for a duplicate or a missing description.
import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, writeFileSync, readdirSync, readFileSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const HERE = dirname(fileURLToPath(import.meta.url));
const SITES = join(HERE, "..", "sites");

const scratch = () => mkdtempSync(join(tmpdir(), "seo-test-"));

// The checker takes a site directory and reads `<site>/dist`.
function site(files, root = scratch()) {
  for (const [name, html] of Object.entries(files)) {
    const full = join(root, "dist", name);
    mkdirSync(dirname(full), { recursive: true });
    writeFileSync(full, html);
  }
  return root;
}

function run(checker, ...args) {
  const result = spawnSync(process.execPath, [checker, ...args], { encoding: "utf8" });
  return { status: result.status, out: `${result.stdout}${result.stderr}` };
}

const declared = readdirSync(SITES, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .filter((s) => {
    const pkg = JSON.parse(readFileSync(join(SITES, s, "package.json"), "utf8"));
    return Boolean(pkg.scripts?.["audit:seo"]);
  })
  .sort();

test("declaration: every site declaring audit:seo ships the checker it calls", () => {
  assert.ok(declared.length > 0, "no site declares audit:seo — the CI step would be vacuous");
  for (const s of declared) {
    const checker = join(SITES, s, "scripts", "audit-seo-meta.mjs");
    assert.ok(existsSync(checker), `${s} declares audit:seo but ${checker} does not exist`);
  }
});

// Sites ship copies of one checker; keep them identical so a fix lands everywhere at once.
test("declaration: the sites' copies of the gate have not drifted apart", () => {
  const bodies = declared.map((s) => ({
    site: s,
    body: readFileSync(join(SITES, s, "scripts", "audit-seo-meta.mjs"), "utf8"),
  }));
  for (const { site: s, body } of bodies.slice(1)) {
    assert.equal(body, bodies[0].body, `${s} and ${bodies[0].site} copies of the gate differ`);
  }
});

const page = (title, desc, { noindex = false } = {}) =>
  `<!doctype html><html><head>` +
  (title === null ? "" : `<title>${title}</title>`) +
  (desc === null ? "" : `<meta name="description" content="${desc}">`) +
  (noindex ? '<meta name="robots" content="noindex">' : "") +
  `</head><body>page</body></html>`;

for (const s of declared) {
  const checker = join(SITES, s, "scripts", "audit-seo-meta.mjs");

  test(`${s}: positive — distinct titles and descriptions pass with the SEO-OK marker`, () => {
    const root = site({
      "index.html": page("Home", "The home page description."),
      "about.html": page("About", "The about page description."),
    });
    const { status, out } = run(checker, root);
    assert.equal(status, 0, out);
    assert.match(out, /^SEO-OK /m);
    assert.match(out, /indexable=2 /);
  });

  test(`${s}: negative — a duplicated title fails and names one of the pages`, () => {
    const root = site({
      "index.html": page("Same title", "The home page description."),
      "about.html": page("Same title", "The about page description."),
    });
    const { status, out } = run(checker, root);
    assert.equal(status, 1, out);
    assert.match(out, /SEO-FAIL .*1 title\(s\) shared by several indexable pages/);
    assert.match(out, /dupTitle "Same title" x2/);
  });

  test(`${s}: negative — a duplicated description fails`, () => {
    const root = site({
      "index.html": page("Home", "Shared description."),
      "about.html": page("About", "Shared description."),
    });
    const { status, out } = run(checker, root);
    assert.equal(status, 1, out);
    assert.match(out, /SEO-FAIL .*1 description\(s\) shared by several indexable pages/);
  });

  test(`${s}: negative — a missing meta description fails and names the page`, () => {
    const root = site({
      "index.html": page("Home", "The home page description."),
      "about.html": page("About", null),
    });
    const { status, out } = run(checker, root);
    assert.equal(status, 1, out);
    assert.match(out, /noDesc: about\.html/);
    assert.match(out, /SEO-FAIL .*1 indexable page\(s\) without a meta description/);
  });

  test(`${s}: negative — a missing title fails`, () => {
    const { status, out } = run(checker, site({ "about.html": page(null, "A description.") }));
    assert.equal(status, 1, out);
    assert.match(out, /noTitle: about\.html/);
    assert.match(out, /SEO-FAIL .*1 indexable page\(s\) without a <title>/);
  });

  test(`${s}: false positive — a noindex page is not an SEO surface`, () => {
    // identity.org.au/governance.html is an Astro redirect stub: noindex, no description, and it
    // borrows the title of the page it redirects to. Flagging that is crying wolf on correct
    // markup, which is how a gate gets muted.
    const stub = `<!doctype html><title>Redirecting to: /about/who-runs-it</title>` +
      `<meta http-equiv="refresh" content="0;url=/about/who-runs-it">` +
      `<meta name="robots" content="noindex">`;
    const root = site({
      "index.html": page("Home", "The home page description."),
      "governance.html": stub,
      "about.html": page("About", "The about page description."),
    });
    const { status, out } = run(checker, root);
    assert.equal(status, 0, out);
    assert.match(out, /^SEO-OK .*indexable=2 noindex=1/m);
  });

  test(`${s}: vacuous — a dist with no HTML fails instead of passing quietly`, () => {
    const root = scratch();
    mkdirSync(join(root, "dist", "assets"), { recursive: true });
    writeFileSync(join(root, "dist", "assets", "app.js"), "console.log(1)");
    const { status, out } = run(checker, root);
    assert.equal(status, 1, out);
    assert.match(out, /SEO-FAIL .*no HTML in dist — checker did nothing/);
  });

  test(`${s}: vacuous — a dist with no indexable page fails instead of passing quietly`, () => {
    const { status, out } = run(checker, site({ "404.html": page("Not found", null, { noindex: true }) }));
    assert.equal(status, 1, out);
    assert.match(out, /not one indexable — nothing to audit/);
  });

  test(`${s}: empty — a missing dist directory fails with a marker, not a stack trace`, () => {
    const { status, out } = run(checker, join(scratch(), "nope"));
    assert.equal(status, 1, out);
    assert.match(out, /SEO-FAIL .*dist directory does not exist/);
  });

  test(`${s}: usage — no site argument is a usage error, not a silent pass`, () => {
    const { status, out } = run(checker);
    assert.equal(status, 2, out);
    assert.match(out, /usage: node scripts\/audit-seo-meta\.mjs/);
  });

  test(`${s}: multiple sites — one failing site fails the whole run`, () => {
    const good = site({ "index.html": page("Home", "The home page description.") });
    const bad = site({ "index.html": page("Home", "The home page description."), "about.html": page("About", null) });
    const { status, out } = run(checker, good, bad);
    assert.equal(status, 1, out);
    assert.match(out, /^SEO-OK /m);
    assert.match(out, /SEO-FAIL .*without a meta description/);
  });
}
