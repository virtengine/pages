// Regression tests for scripts/check-a11y.mjs — the accessibility budget's teeth.
//
// Run with: node --test scripts/
//
// Why this file exists: a gate whose failure modes were proven once by hand decays into a gate
// that cannot fail, and CI then manufactures confidence instead of evidence. Every case below
// drives the real script against a crafted dist in a temp directory, so an edit that makes the
// checker vacuous, or that makes it cry wolf on correct markup, fails the suite.
import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const HERE = dirname(fileURLToPath(import.meta.url));
const CHECKER = join(HERE, "check-a11y.mjs");

const scratch = () => mkdtempSync(join(tmpdir(), "a11y-test-"));

// A well-formed page: lang present, alt present, unique ids, headings in order.
const GOOD = `<!doctype html>
<html lang="en-AU">
  <head><title>t</title></head>
  <body>
    <h1>Title</h1>
    <h2>Section</h2>
    <img src="/a.png" alt="A">
    <div id="one"></div>
    <a href="#one">jump</a>
  </body>
</html>
`;

function dist(files, root = scratch()) {
  for (const [name, html] of Object.entries(files)) {
    const full = join(root, name);
    mkdirSync(dirname(full), { recursive: true });
    writeFileSync(full, html);
  }
  return root;
}

function baseline(entries, root = scratch()) {
  const path = join(root, "baseline.json");
  writeFileSync(path, JSON.stringify(entries));
  return path;
}

function run(distDir, { site = "site", baselinePath, args = [] } = {}) {
  const result = spawnSync(process.execPath, [CHECKER, ...args, `${site}=${distDir}`], {
    encoding: "utf8",
    env: { ...process.env, A11Y_BASELINE: baselinePath ?? join(scratch(), "absent.json") },
  });
  return { status: result.status, out: `${result.stdout}${result.stderr}` };
}

test("positive: a correct page passes with an explicit OK marker", () => {
  const { status, out } = run(dist({ "index.html": GOOD }), { baselinePath: baseline({}) });
  assert.equal(status, 0, out);
  assert.match(out, /^A11Y-OK sites=1/m);
  assert.match(out, /img-missing-alt=0\/0/);
});

test("negative: img without alt fails and names the rule", () => {
  const page = GOOD.replace('<img src="/a.png" alt="A">', '<img src="/a.png">');
  const { status, out } = run(dist({ "index.html": page }), { baselinePath: baseline({}) });
  assert.equal(status, 1, out);
  assert.match(out, /A11Y-FAIL site: img-missing-alt 1>0/);
  assert.match(out, /OVER BUDGET img-missing-alt/);
});

test("false positive: a bare `alt` attribute is decorative, not missing", () => {
  // Astro minifies alt="" to a valueless `alt`; treating that as missing flagged 294 images
  // on virtengine.com that a browser reads as decorative. This is the regression guard.
  const page = GOOD.replace('<img src="/a.png" alt="A">', '<img src="/a.png" alt aria-hidden="true">');
  const { status, out } = run(dist({ "index.html": page }), { baselinePath: baseline({}) });
  assert.equal(status, 0, out);
  assert.match(out, /^A11Y-OK/m);
});

test("negative: duplicate id fails", () => {
  const page = GOOD.replace('<a href="#one">jump</a>', '<div id="one"></div>');
  const { status, out } = run(dist({ "index.html": page }), { baselinePath: baseline({}) });
  assert.equal(status, 1, out);
  assert.match(out, /duplicate-id 1>0/);
  assert.match(out, /#one appears 2 times/);
});

test("negative: duplicate id spread across two documents does not fail", () => {
  const { status, out } = run(
    dist({ "a.html": GOOD, "b.html": GOOD }),
    { baselinePath: baseline({}) },
  );
  assert.equal(status, 0, out);
});

test("negative: html without lang fails, including a missing <html> element", () => {
  const noLang = GOOD.replace('<html lang="en-AU">', "<html>");
  const first = run(dist({ "index.html": noLang }), { baselinePath: baseline({}) });
  assert.equal(first.status, 1, first.out);
  assert.match(first.out, /document-missing-lang 1>0/);

  const noHtml = run(dist({ "index.html": "<body><h1>hi</h1></body>" }), { baselinePath: baseline({}) });
  assert.equal(noHtml.status, 1, noHtml.out);
  assert.match(noHtml.out, /no <html> element/);
});

test("false positive: a meta-refresh redirect stub is not a page", () => {
  // identity.org.au/governance.html is an Astro redirect stub: no <html>, no lang, no headings.
  const stub = `<!doctype html><title>Redirecting</title><meta http-equiv="refresh" content="0;url=/x"><body><a href="/x">moved</a></body>`;
  const { status, out } = run(dist({ "governance.html": stub }), { baselinePath: baseline({}) });
  assert.equal(status, 0, out);
  assert.match(out, /redirects=1/);
});

test("negative: skipped heading level fails", () => {
  const page = GOOD.replace("<h2>Section</h2>", "<h3>Section</h3>");
  const { status, out } = run(dist({ "index.html": page }), { baselinePath: baseline({}) });
  assert.equal(status, 1, out);
  assert.match(out, /heading-level-skip 1>0/);
  assert.match(out, /h1 -> h3/);
});

test("vacuous: a dist with no HTML hard-fails instead of passing", () => {
  const root = scratch();
  mkdirSync(join(root, "assets"), { recursive: true });
  writeFileSync(join(root, "assets", "app.js"), "console.log(1)");
  const { status, out } = run(root, { baselinePath: baseline({}) });
  assert.equal(status, 1, out);
  assert.match(out, /no HTML in dist/);
});

test("empty: a missing dist directory hard-fails", () => {
  const { status, out } = run(join(scratch(), "nope"), { baselinePath: baseline({}) });
  assert.equal(status, 1, out);
  assert.match(out, /dist directory does not exist/);
});

test("vacuous: an HTML file with no tags at all hard-fails", () => {
  const { status, out } = run(dist({ "index.html": "not html" }), { baselinePath: baseline({}) });
  assert.equal(status, 1, out);
  assert.match(out, /inspected no elements/);
});

test("budget: a baseline that is looser than reality fails so it cannot be padded", () => {
  const entries = { site: { "img-missing-alt": 0, "document-missing-lang": 0, "duplicate-id": 0, "heading-level-skip": 3 } };
  const { status, out } = run(dist({ "index.html": GOOD }), { baselinePath: baseline(entries) });
  assert.equal(status, 1, out);
  assert.match(out, /baseline is loose for heading-level-skip 0<3/);
});

test("budget: violations equal to the baseline pass (the ratchet holds a known deficit)", () => {
  const page = GOOD.replace("<h2>Section</h2>", "<h3>Section</h3>");
  const entries = { site: { "img-missing-alt": 0, "document-missing-lang": 0, "duplicate-id": 0, "heading-level-skip": 1 } };
  const { status, out } = run(dist({ "index.html": page }), { baselinePath: baseline(entries) });
  assert.equal(status, 0, out);
  assert.match(out, /A11Y-BASELINE ok/);
});

test("budget: a site with no baseline entry is held to zero violations", () => {
  const page = GOOD.replace('<img src="/a.png" alt="A">', '<img src="/a.png">');
  const { status, out } = run(dist({ "index.html": page }), { baselinePath: baseline({ other: {} }) });
  assert.equal(status, 1, out);
  assert.match(out, /img-missing-alt 1>0/);
});

test("per-site run: checking one site does not trip on the other sites' baseline entries", () => {
  // CI runs this once per site (matrix job), so the ledger legitimately lists sites that are
  // not part of this run. Stale entries are caught repo-side by check-static.mjs instead.
  const entries = {
    site: {},
    "some-other-site": { "img-missing-alt": 4, "document-missing-lang": 0, "duplicate-id": 0, "heading-level-skip": 9 },
  };
  const { status, out } = run(dist({ "index.html": GOOD }), { baselinePath: baseline(entries) });
  assert.equal(status, 0, out);
  assert.match(out, /^A11Y-OK/m);
});

test("update-baseline: writes the measured ledger", () => {
  const page = GOOD.replace("<h2>Section</h2>", "<h3>Section</h3>");
  const path = baseline({});
  const { status, out } = run(dist({ "index.html": page }), { baselinePath: path, args: ["--update-baseline"] });
  assert.equal(status, 0, out);
  assert.match(out, /A11Y-BASELINE updated/);
  const written = JSON.parse(readFileSync(path, "utf8"));
  assert.deepEqual(written.site, { "img-missing-alt": 0, "document-missing-lang": 0, "duplicate-id": 0, "heading-level-skip": 1 });
});

test("update-baseline: refuses to write when a site could not be measured", () => {
  const path = baseline({ site: { "img-missing-alt": 0, "document-missing-lang": 0, "duplicate-id": 0, "heading-level-skip": 7 } });
  const missing = join(scratch(), "gone");
  const { status, out } = run(missing, { baselinePath: path, args: ["--update-baseline"] });
  assert.equal(status, 1, out);
  assert.match(out, /refusing to update baseline/);
  const kept = JSON.parse(readFileSync(path, "utf8"));
  assert.equal(kept.site["heading-level-skip"], 7, "baseline must survive a failed run");
});

test("the repo's own baseline matches the checker's rule set", () => {
  const real = JSON.parse(readFileSync(join(HERE, "a11y-baseline.json"), "utf8"));
  const rules = ["img-missing-alt", "document-missing-lang", "duplicate-id", "heading-level-skip"];
  for (const [site, budget] of Object.entries(real)) {
    assert.deepEqual(Object.keys(budget).sort(), [...rules].sort(), `${site} budget keys drifted`);
  }
});
