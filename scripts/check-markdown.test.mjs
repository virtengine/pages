// Unit tests for the Markdown-for-Agents edge middleware.
// Run: node --test scripts/check-markdown.test.mjs
// Every test asserts concrete output, so a converter regression fails loudly.
import test from "node:test";
import assert from "node:assert/strict";
import {
  onRequest,
  convertHtmlToMarkdown,
  estimateTokens,
} from "../sites/virtengine.com/functions/_middleware.js";
import { onRequest as onRequestIdentity } from "../sites/identity.org.au/functions/_middleware.js";
import { onRequest as onRequestDet } from "../sites/det.io/functions/_middleware.js";

const PAGE = "https://example.com/guide";

function ctx(url, html, { accept = "text/markdown", status = 200, contentType = "text/html; charset=utf-8", extra = {} } = {}) {
  return {
    request: new Request(url, { headers: { accept } }),
    next: async () => new Response(html, { status, headers: { "content-type": contentType, ...extra } }),
    env: {},
    params: {},
    data: {},
  };
}

function doc({ head = "", body = "" }) {
  return `<!doctype html><html><head>${head}</head><body>${body}</body></html>`;
}

test("converts a page: headers, frontmatter, chrome stripped", async () => {
  const html = doc({
    head: '<meta name="title" content="Meta Title"><meta property="og:title" content="OG Title"><meta name="description" content="Desc here."><meta property="og:image" content="https://example.com/og.png">',
    body: '<header><nav><a href="/">Home</a></nav></header><main><h1>Hello</h1><p>Body copy with enough substance to clear the safety floor.</p><p>A second paragraph for good measure and realistic length.</p></main><footer>Footer noise</footer><script>var x = 1;</script>',
  });
  const res = await onRequest(ctx(`${PAGE}`, html));
  assert.equal(res.status, 200);
  assert.match(res.headers.get("content-type") ?? "", /text\/markdown/);
  assert.match(res.headers.get("vary") ?? "", /accept/i);
  assert.match(res.headers.get("x-markdown-tokens") ?? "", /^[1-9][0-9]*$/);
  const md = await res.text();
  assert.ok(md.startsWith('---\ntitle: "Meta Title"'), "meta title wins over og:title");
  assert.ok(md.includes('description: "Desc here."'));
  assert.ok(md.includes('image: "https://example.com/og.png"'));
  assert.ok(md.includes("# Hello"));
  assert.ok(md.includes("Body copy with enough substance"));
  assert.ok(!md.includes("Footer noise"), "footer stripped");
  assert.ok(!md.includes("Home"), "nav stripped");
  assert.ok(!md.includes("var x"), "script stripped");
});

test("frontmatter falls back to og tags and omits when absent", () => {
  const md = convertHtmlToMarkdown(
    doc({
      head: '<meta property="og:title" content="OG Title"><meta property="og:description" content="OG desc">',
      body: "<main><h1>T</h1></main>",
    }),
    PAGE,
  );
  assert.ok(md.includes('title: "OG Title"'));
  assert.ok(md.includes('description: "OG desc"'));
  const bare = convertHtmlToMarkdown(doc({ body: "<main><h1>T</h1></main>" }), PAGE);
  assert.ok(!bare.startsWith("---"), "no frontmatter without meta");
  assert.ok(bare.includes("# T"));
});

test("renders nested lists with indentation and numbering", () => {
  const md = convertHtmlToMarkdown(
    doc({
      body: "<main><ul><li>one<ul><li>nested</li></ul></li><li>two</li></ul><ol><li>first</li><li>second</li></ol></main>",
    }),
    PAGE,
  );
  for (const line of ["- one", "  - nested", "- two", "1. first", "2. second"]) {
    assert.ok(md.includes(line), `missing list line: ${line}\n${md}`);
  }
});

test("renders tables with header separator and escaped pipes", () => {
  const md = convertHtmlToMarkdown(
    doc({
      body: "<main><table><thead><tr><th>Name</th><th>Role</th></tr></thead><tbody><tr><td>Ada</td><td>Eng | Ops</td></tr></tbody></table></main>",
    }),
    PAGE,
  );
  assert.ok(md.includes("| Name | Role |"));
  assert.ok(md.includes("| --- | --- |"));
  assert.ok(md.includes("| Ada | Eng \\| Ops |"));
});

test("expands details/summary accordions", () => {
  const md = convertHtmlToMarkdown(
    doc({ body: "<main><details><summary>Question?</summary><p>Answer here.</p></details></main>" }),
    PAGE,
  );
  assert.ok(md.includes("**Question?**"));
  assert.ok(md.includes("Answer here."));
});

test("preserves pre indentation verbatim inside fences", () => {
  const md = convertHtmlToMarkdown(
    doc({ body: "<main><pre><code>line1\n    indented\nline3</code></pre></main>" }),
    PAGE,
  );
  assert.ok(md.includes("```\nline1\n    indented\nline3\n```"), `fence mangled:\n${md}`);
});

test("decodes entities and absolutizes links", () => {
  const md = convertHtmlToMarkdown(
    doc({
      body: '<main><p>A &amp; B &#39;C&#39;</p><p><a href="/foo">Foo</a> <a href="https://x.io/y?a=1&amp;b=2">X</a> <a>none</a> <a href="#frag">Frag</a></p></main>',
    }),
    `${PAGE}/sub`,
  );
  assert.ok(md.includes("A & B 'C'"));
  assert.ok(md.includes("[Foo](https://example.com/foo)"));
  assert.ok(md.includes("[X](https://x.io/y?a=1&b=2)"));
  assert.ok(md.includes("none") && !md.includes("[none]"));
  assert.ok(md.includes("[Frag](https://example.com/guide/sub#frag)"));
});

test("keeps alt-text images, drops decorative ones", () => {
  const md = convertHtmlToMarkdown(
    doc({ body: '<main><p><img src="/i/a.webp" alt="A photo"><img src="/i/b.webp" alt=""></p></main>' }),
    PAGE,
  );
  assert.ok(md.includes("![A photo](https://example.com/i/a.webp)"));
  assert.ok(!md.includes("/i/b.webp"));
});

test("appends JSON-LD blocks, concatenated, raw on invalid JSON", () => {
  const md = convertHtmlToMarkdown(
    doc({
      head: '<script type="application/ld+json">{"@type":"A"}</script><script type="application/ld+json">{oops</script>',
      body: "<main><h1>T</h1></main>",
    }),
    PAGE,
  );
  assert.ok(md.includes("```json"));
  assert.ok(md.includes('"@type": "A"'));
  assert.ok(md.includes("{oops"));
});

test("falls back to HTML on degenerate output", async () => {
  const html = doc({ body: "<main><p>hi</p></main>" });
  const res = await onRequest(ctx(PAGE, html));
  assert.match(res.headers.get("content-type") ?? "", /text\/html/);
  assert.equal(await res.text(), html);
});

test("passes through non-HTML, non-200, non-GET, and asset paths", async () => {
  const img = await onRequest(ctx(`${PAGE}/og.png`, "PNGDATA", { contentType: "image/png" }));
  assert.equal(img.headers.get("content-type"), "image/png");

  const missing = await onRequest(
    ctx(PAGE, "<main><h1>gone</h1></main>", { status: 404 }),
  );
  assert.equal(missing.status, 404);

  const posted = await onRequest({
    request: new Request(PAGE, { method: "POST", headers: { accept: "text/markdown" } }),
    next: async () => new Response("<main><h1>T</h1></main>", { headers: { "content-type": "text/html" } }),
    env: {},
    params: {},
    data: {},
  });
  assert.match(posted.headers.get("content-type") ?? "", /text\/html/);

  const css = await onRequest(ctx(`${PAGE}/site.css`, "a{}", { contentType: "text/css" }));
  assert.equal(css.headers.get("content-type"), "text/css");
});

test("browser and */* requests get byte-identical HTML", async () => {
  const html = doc({ body: "<main><h1>T</h1><p>Copy.</p></main>" });
  for (const accept of ["text/html,application/xhtml+xml", "*/*"]) {
    const res = await onRequest(ctx(PAGE, html, { accept }));
    assert.match(res.headers.get("content-type") ?? "", /text\/html/);
    assert.equal(await res.text(), html);
  }
});

test("accept matching is exact token, case-insensitive", async () => {
  const html = doc({
    head: '<meta name="description" content="A description long enough to matter for the fixture at hand.">',
    body: "<main><h1>Long enough body copy to clear the degenerate floor by a wide margin here.</h1><p>More copy follows in this paragraph to make sure the resulting markdown comfortably exceeds any safety floor.</p></main>",
  });
  const upper = await onRequest(ctx(PAGE, html, { accept: "TEXT/MARKDOWN" }));
  assert.match(upper.headers.get("content-type") ?? "", /text\/markdown/);
  const qualified = await onRequest(ctx(PAGE, html, { accept: "text/html, text/markdown;q=0.9" }));
  assert.match(qualified.headers.get("content-type") ?? "", /text\/markdown/);
  const wildcard = await onRequest(ctx(PAGE, html, { accept: "text/*" }));
  assert.match(wildcard.headers.get("content-type") ?? "", /text\/html/);
});

test("merges Vary, strips validator headers, keeps cache headers", async () => {
  const html = doc({
    head: '<meta name="description" content="A description long enough to matter for the fixture at hand.">',
    body: "<main><h1>Long enough body copy to clear the degenerate floor by a wide margin here.</h1><p>More copy follows in this paragraph to make sure the resulting markdown comfortably exceeds any safety floor.</p></main>",
  });
  const res = await onRequest(
    ctx(PAGE, html, {
      extra: { vary: "Accept-Encoding", etag: '"x"', "last-modified": "Sun, 20 Sep 2026 00:00:00 GMT", "cache-control": "public, max-age=60" },
    }),
  );
  const vary = res.headers.get("vary") ?? "";
  assert.ok(/accept-encoding/i.test(vary) && /accept(,|$)/i.test(vary), `vary not merged: ${vary}`);
  assert.equal(res.headers.get("etag"), null);
  assert.equal(res.headers.get("last-modified"), null);
  assert.equal(res.headers.get("cache-control"), "public, max-age=60");
});

test("estimateTokens scales with input", () => {
  assert.equal(estimateTokens("abcd"), 1);
  assert.ok(estimateTokens("x".repeat(400)) === 100);
  assert.ok(estimateTokens("") >= 1);
});

test("all three site copies convert identically", async () => {
  const html = doc({
    head: '<meta property="og:title" content="Sync check"><meta name="description" content="Same everywhere.">',
    body: "<main><h1>Sync</h1><ul><li>a<ul><li>b</li></ul></li></ul><table><tr><th>k</th></tr><tr><td>v</td></tr></table></main>",
  });
  const bodies = [];
  for (const fn of [onRequest, onRequestIdentity, onRequestDet]) {
    const res = await fn(ctx("https://example.com/sync", html));
    bodies.push(await res.text());
  }
  assert.equal(bodies[1], bodies[0], "identity.org.au copy diverged");
  assert.equal(bodies[2], bodies[0], "det.io copy diverged");
});
