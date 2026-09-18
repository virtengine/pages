// Regression tests for scripts/check-links.mjs — the link checker's teeth.
//
// Run with: node --test scripts/
//
// These five cases were originally proven by hand against crafted dists and pasted into a PR
// comment. Proof in a comment rots: nothing stopped a later edit from making the checker exit 0
// while checking nothing, which is the exact failure mode it was written to prevent. Landing
// them here makes the checker's teeth a regression-tested property.
import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const HERE = dirname(fileURLToPath(import.meta.url));
const CHECKER = join(HERE, "check-links.mjs");

function dist(files, root = mkdtempSync(join(tmpdir(), "linkcheck-test-"))) {
  for (const [name, html] of Object.entries(files)) {
    const full = join(root, name);
    mkdirSync(dirname(full), { recursive: true });
    writeFileSync(full, html);
  }
  return root;
}

function run(...distDirs) {
  const result = spawnSync(process.execPath, [CHECKER, ...distDirs], { encoding: "utf8" });
  return { status: result.status, out: `${result.stdout}${result.stderr}` };
}

test("A: dead internal link fails and names the link", () => {
  const root = dist({ "index.html": `<a href="/missing">gone</a><a href="/there.html">ok</a>`, "there.html": "ok" });
  const { status, out } = run(root);
  assert.equal(status, 1, out);
  assert.match(out, /LINKCHECK-FAIL/);
  assert.match(out, /DEAD: index\.html -> \/missing/);
  assert.match(out, /dead=1/);
});

test("B: a dist with no internal references fails (checker did nothing)", () => {
  const root = dist({ "index.html": `<a href="https://example.com">out</a>` });
  const { status, out } = run(root);
  assert.equal(status, 1, out);
  assert.match(out, /no internal references found — checker did nothing/);
});

test("C: a dist with no HTML fails", () => {
  const root = mkdtempSync(join(tmpdir(), "linkcheck-test-"));
  mkdirSync(join(root, "assets"), { recursive: true });
  writeFileSync(join(root, "assets", "app.js"), "0");
  const { status, out } = run(root);
  assert.equal(status, 1, out);
  assert.match(out, /no HTML in dist/);
});

test("D: a healthy dist passes with the LINKCHECK-OK marker", () => {
  const root = dist({
    "index.html": `<a href="/there.html">ok</a><a href="/there.html#part">frag</a><a href="#top">self</a><img src="/logo.svg" alt="logo">`,
    "there.html": `<div id="part">here</div><div id="top">top</div>`,
    "logo.svg": "<svg/>",
  });
  const { status, out } = run(root);
  assert.equal(status, 0, out);
  assert.match(out, /^LINKCHECK-OK/m);
  assert.match(out, /refs=3/);
  assert.match(out, /fragments=1/);
});

test("E: an escaped code sample is not a link (tag-aware, no false positive)", () => {
  const root = dist({
    "index.html": `&lt;a href="ghost"&gt; href="configuration.xsl"<a href="/there.html">ok</a>`,
    "there.html": "ok",
  });
  const { status, out } = run(root);
  assert.equal(status, 0, out);
  assert.match(out, /^LINKCHECK-OK/m);
  assert.doesNotMatch(out, /DEAD/);
});

test("fragment: a #fragment that matches no id fails", () => {
  const root = dist({ "index.html": `<a href="/there.html#nope">x</a>`, "there.html": `<div id="yes"></div>` });
  const { status, out } = run(root);
  assert.equal(status, 1, out);
  assert.match(out, /missing_fragments=1/);
  assert.match(out, /MISSING_FRAGMENT/);
});

test("empty: a missing dist directory fails", () => {
  const { status, out } = run(join(mkdtempSync(join(tmpdir(), "linkcheck-test-")), "nope"));
  assert.equal(status, 1, out);
  assert.match(out, /dist directory does not exist/);
});

test("multiple dists: one bad dist fails the whole run", () => {
  const good = dist({ "index.html": `<a href="/there.html">ok</a>`, "there.html": "ok" });
  const bad = dist({ "index.html": `<a href="/missing">gone</a>` });
  const { status, out } = run(good, bad);
  assert.equal(status, 1, out);
  assert.match(out, /^LINKCHECK-OK/m);
  assert.match(out, /dead=1/);
});
