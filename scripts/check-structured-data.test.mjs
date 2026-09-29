// Regression tests for the sites' check:schema checker (sites/*/scripts/check-structured-data.mjs).
//
// Run with: node --test scripts/*.test.mjs
//
// Why this file exists: all four sites shipped this checker and no workflow ran it, so nothing
// noticed that it exited 0 against an empty dist (`pages_checked: 0`, `errors: 0`) — a checker
// that reports success while checking nothing. These cases pin the teeth: a real dist passes with
// a marker, a planted JSON-LD defect fails and names it, and an input with nothing to check fails
// instead of passing quietly. They also run against every site's copy of the checker, because the
// four copies (byte-identical today) are the ones CI actually executes.
import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, writeFileSync, readdirSync, readFileSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const HERE = dirname(fileURLToPath(import.meta.url));
const SITES = join(HERE, "..", "sites");

const scratch = () => mkdtempSync(join(tmpdir(), "schema-test-"));

function dist(files, root = scratch()) {
  for (const [name, html] of Object.entries(files)) {
    const full = join(root, name);
    mkdirSync(dirname(full), { recursive: true });
    writeFileSync(full, html);
  }
  return root;
}

function run(checker, ...args) {
  const result = spawnSync(process.execPath, [checker, ...args], { encoding: "utf8" });
  return { status: result.status, out: `${result.stdout}${result.stderr}` };
}

// Sites that declare check:schema — the CI step runs the site-local checker it points at.
const declared = readdirSync(SITES, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .filter((site) => {
    const pkg = JSON.parse(readFileSync(join(SITES, site, "package.json"), "utf8"));
    return Boolean(pkg.scripts?.["check:schema"]);
  })
  .sort();

test("declaration: every site declaring check:schema ships the checker it calls", () => {
  assert.ok(declared.length > 0, "no site declares check:schema — the CI step would be vacuous");
  for (const site of declared) {
    const checker = join(SITES, site, "scripts", "check-structured-data.mjs");
    assert.ok(existsSync(checker), `${site} declares check:schema but ${checker} does not exist`);
  }
});

// Sites ship copies of one checker; keep them identical so a fix lands everywhere at once.
test("declaration: the sites' copies of the checker have not drifted apart", () => {
  const bodies = declared.map((site) => ({
    site,
    body: readFileSync(join(SITES, site, "scripts", "check-structured-data.mjs"), "utf8"),
  }));
  for (const { site, body } of bodies.slice(1)) {
    assert.equal(body, bodies[0].body, `${site} and ${bodies[0].site} copies of the checker differ`);
  }
});

const page = (jsonLd, extra = "") =>
  `<!doctype html><html><head><title>t</title>` +
  `<script type="application/ld+json">${jsonLd}</script></head><body><p>t</p>${extra}</body></html>`;

const VALID = JSON.stringify({
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": "https://example.com/#webpage",
      name: "Example",
      url: "https://example.com/",
    },
  ],
});

for (const site of declared) {
  const checker = join(SITES, site, "scripts", "check-structured-data.mjs");

  test(`${site}: positive — a healthy page passes with the STRUCTURED-OK marker`, () => {
    const { status, out } = run(checker, dist({ "index.html": page(VALID) }));
    assert.equal(status, 0, out);
    assert.match(out, /^STRUCTURED-OK /m);
    assert.match(out, /pages=1/);
  });

  test(`${site}: negative — a page missing a required property fails and names it`, () => {
    const broken = JSON.stringify({
      "@context": "https://schema.org",
      "@graph": [{ "@type": "WebPage", "@id": "https://example.com/#webpage", name: "Example" }],
    });
    const { status, out } = run(checker, dist({ "index.html": page(broken) }));
    assert.equal(status, 1, out);
    assert.match(out, /STRUCTURED-FAIL/);
    assert.match(out, /index\.html: WebPage is missing required property "url"/);
  });

  test(`${site}: negative — an unresolved local @id reference fails`, () => {
    const broken = JSON.stringify({
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebPage",
          "@id": "https://example.com/#webpage",
          name: "Example",
          url: "https://example.com/",
          isPartOf: { "@id": "#missing" },
        },
      ],
    });
    const { status, out } = run(checker, dist({ "index.html": page(broken) }));
    assert.equal(status, 1, out);
    assert.match(out, /unresolved local @id reference "#missing"/);
  });

  test(`${site}: vacuous — a dist with no HTML fails instead of passing quietly`, () => {
    const root = scratch();
    mkdirSync(join(root, "assets"), { recursive: true });
    writeFileSync(join(root, "assets", "app.js"), "console.log(1)");
    const { status, out } = run(checker, root);
    assert.equal(status, 1, out);
    assert.match(out, /STRUCTURED-FAIL/);
    assert.match(out, /no HTML in dist — checker did nothing/);
  });

  test(`${site}: vacuous — pages that carry no JSON-LD at all fail instead of passing quietly`, () => {
    const { status, out } = run(
      checker,
      dist({ "index.html": "<!doctype html><html><head><title>t</title></head><body>t</body></html>" }),
    );
    assert.equal(status, 1, out);
    assert.match(out, /no page carried JSON-LD — checker did nothing/);
  });

  test(`${site}: vacuous — a dist of redirect stubs only fails instead of passing quietly`, () => {
    const stub = `<!doctype html><title>Redirecting</title><meta http-equiv="refresh" content="0;url=/x">`;
    const { status, out } = run(checker, dist({ "moved.html": stub }));
    assert.equal(status, 1, out);
    assert.match(out, /no page carried JSON-LD — checker did nothing/);
  });

  test(`${site}: empty — a missing dist directory fails with a marker, not a stack trace`, () => {
    const { status, out } = run(checker, join(scratch(), "nope"));
    assert.equal(status, 1, out);
    assert.match(out, /STRUCTURED-FAIL .*dist directory does not exist/);
  });

  test(`${site}: false positive — an escaped JSON-LD sample is not markup`, () => {
    // Documentation legitimately prints the tag inside a code block; escaped samples are text,
    // not structured data, and must not be parsed (or counted) as a JSON-LD block.
    const escaped =
      "&lt;script type=\"application/ld+json\"&gt;" +
      '{"@context": "https://schema.org", oops not json}' +
      "&lt;/script&gt;";
    const { status, out } = run(
      checker,
      dist({
        "index.html": page(VALID, `<pre><code>${escaped}</code></pre>`),
        "other.html": `<html><body><pre><code>${escaped}</code></pre></body></html>`,
      }),
    );
    assert.equal(status, 0, out);
    assert.match(out, /^STRUCTURED-OK /m);
    assert.match(out, /pages=1 /);
  });
}
