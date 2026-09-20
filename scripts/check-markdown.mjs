// Markdown-for-Agents negotiation checker (build gate tooling).
//
// Usage: node scripts/check-markdown.mjs <dist-dir> [<dist-dir> ...]
//
// For every built HTML page it runs that site's own
// functions/_middleware.js `onRequest` with `Accept: text/markdown` and
// asserts the negotiation contract:
//
//   * status preserved, Content-Type becomes text/markdown
//   * Vary gains Accept, ETag/Last-Modified are dropped, cache headers kept
//   * x-markdown-tokens present and numeric
//   * YAML frontmatter present, page h1 text present in the body
//   * no chrome tag residue (</header>, </footer>, </nav>, …)
//   * page JSON-LD preserved as a fenced ```json block when the source has it
//
// It also asserts the negative paths: plain browser requests and `*/*` get
// byte-identical HTML, and static-asset paths pass through untouched.
//
// A checker that exits 0 while checking nothing is worse than no checker, so
// this script hard-fails when a dist has no HTML, when a site has no
// middleware, or when any assertion fails — and prints a MARKDOWN-OK marker
// that CI asserts on.
import { readdirSync, readFileSync, existsSync } from "node:fs";
import { join, resolve, relative, basename, dirname, sep } from "node:path";
import { pathToFileURL } from "node:url";

const distRoots = process.argv.slice(2).map((p) => resolve(p));
if (distRoots.length === 0) {
  console.error("usage: node scripts/check-markdown.mjs <dist-dir> [<dist-dir> ...]");
  process.exit(2);
}

// Closing tags that must never survive conversion. Pre-scanned: no built page
// contains these as escaped code samples, so any occurrence is a real leak.
const CHROME_TAGS = ["</header>", "</footer>", "</nav>", "</script>", "</style>", "</form>", "</button>", "</svg>"];

let failures = 0;
let converted = 0;
let passthrough = 0;
const ratios = [];

const fail = (msg) => {
  failures++;
  console.error(`MARKDOWN-FAIL ${msg}`);
};

function collectHtml(dir, out = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) collectHtml(full, out);
    else if (entry.isFile() && entry.name.endsWith(".html")) out.push(full);
  }
  return out;
}

function decodeBasic(s) {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/[\t\n\r ]+/g, " ")
    .trim();
}

function firstH1(html) {
  const m = /<h1\b[^>]*>([\s\S]*?)<\/h1\s*>/i.exec(html);
  if (!m) return "";
  return decodeBasic(m[1].replace(/<br\s*\/?>/gi, " ").replace(/<[^>]+>/g, ""));
}

/** Strip Markdown formatting so prose assertions match rendered text. */
function plainText(md) {
  return md
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/[*_~#>`]/g, "")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/![[]/g, "")
    .replace(/[\t\n\r ]+/g, " ")
    .trim();
}

/** Fenced code may legitimately show tags — scan only prose for chrome. */
function proseOnly(md) {
  return md.replace(/```[\s\S]*?```/g, " ");
}

function hasJsonLd(html) {
  return /<script\b[^>]*\btype\s*=\s*("|')application\/ld\+json\1/i.test(html);
}

function fakeContext(url, accept, html, contentType = "text/html; charset=utf-8") {
  return {
    request: new Request(url, { headers: { accept } }),
    next: async () =>
      new Response(html, {
        status: 200,
        headers: {
          "content-type": contentType,
          vary: "Accept-Encoding",
          etag: '"deadbeef"',
          "last-modified": "Sun, 20 Sep 2026 00:00:00 GMT",
          "cache-control": "public, max-age=60",
        },
      }),
    env: {},
    params: {},
    data: {},
  };
}

for (const distRoot of distRoots) {
  const siteDir = dirname(distRoot);
  const host = basename(siteDir);
  const middlewarePath = join(siteDir, "functions", "_middleware.js");
  if (!existsSync(middlewarePath)) {
    fail(`${distRoot}: missing sibling functions/_middleware.js`);
    continue;
  }
  let onRequest;
  try {
    ({ onRequest } = await import(pathToFileURL(middlewarePath).href));
  } catch (err) {
    fail(`${distRoot}: cannot import middleware: ${String(err)}`);
    continue;
  }
  if (typeof onRequest !== "function") {
    fail(`${distRoot}: middleware does not export onRequest`);
    continue;
  }
  const files = collectHtml(distRoot);
  if (files.length === 0) {
    fail(`${distRoot}: no HTML files — nothing checked`);
    continue;
  }

  for (const file of files) {
    const rel = relative(distRoot, file).split(sep).join("/");
    const route = rel === "index.html" ? "/" : `/${rel.replace(/\/index\.html$/, "/").replace(/\.html$/, "")}`;
    const pageUrl = `https://${host}${route}`;
    const html = readFileSync(file, "utf8");
    const tag = `${host}${route}`;

    let res;
    try {
      res = await onRequest(fakeContext(pageUrl, "text/markdown", html));
    } catch (err) {
      fail(`${tag}: middleware threw: ${String(err)}`);
      continue;
    }
    const ct = res.headers.get("content-type") ?? "";
    // Degenerate stubs (e.g. meta-refresh redirect pages) fall back to HTML
    // by design — assert the passthrough instead of conversion.
    if (html.length < 1500) {
      const body = await res.text();
      if (ct.includes("text/markdown") || body !== html) fail(`${tag}: tiny page was not passed through as HTML`);
      else passthrough++;
      continue;
    }
    if (res.status !== 200) fail(`${tag}: status ${res.status}, want 200`);
    if (!ct.includes("text/markdown")) {
      fail(`${tag}: content-type ${ct}, want text/markdown`);
      continue;
    }
    const vary = res.headers.get("vary") ?? "";
    if (!/accept/i.test(vary)) fail(`${tag}: vary ${vary || "(none)"} missing Accept`);
    const tokens = res.headers.get("x-markdown-tokens") ?? "";
    if (!/^[1-9][0-9]*$/.test(tokens)) fail(`${tag}: x-markdown-tokens ${tokens || "(none)"} not a positive integer`);
    if (res.headers.get("etag") !== null) fail(`${tag}: etag not stripped`);
    if (res.headers.get("last-modified") !== null) fail(`${tag}: last-modified not stripped`);
    if (res.headers.get("cache-control") !== "public, max-age=60") fail(`${tag}: cache-control not preserved`);
    const md = await res.text();
    if (!md.startsWith("---\ntitle:")) fail(`${tag}: missing YAML frontmatter title`);
    if (md.length <= 200 || md.length >= html.length * 2) {
      fail(`${tag}: suspicious size html=${html.length} md=${md.length}`);
    }
    const h1 = firstH1(html);
    if (h1 && !plainText(md).includes(h1)) fail(`${tag}: h1 text missing from markdown: ${h1.slice(0, 80)}`);
    const prose = proseOnly(md);
    for (const chrome of CHROME_TAGS) {
      if (prose.includes(chrome)) fail(`${tag}: chrome residue ${chrome}`);
    }
    if (hasJsonLd(html) && !md.includes("```json")) fail(`${tag}: JSON-LD not preserved`);
    converted++;
    ratios.push(md.length / html.length);

    // Negative paths on a sample of pages (every 25th keeps the run fast).
    if (converted % 25 === 1) {
      const plain = await onRequest(fakeContext(pageUrl, "text/html,application/xhtml+xml", html));
      const plainBody = await plain.text();
      if ((plain.headers.get("content-type") ?? "").includes("text/markdown") || plainBody !== html) {
        fail(`${tag}: browser request was not byte-identical HTML`);
      }
      const star = await onRequest(fakeContext(pageUrl, "*/*", html));
      if (((await star.text()) !== html)) fail(`${tag}: */* request was converted`);
      const asset = await onRequest(
        fakeContext(`https://${host}/og.png`, "text/markdown", "PNGDATA", "image/png"),
      );
      if ((asset.headers.get("content-type") ?? "") !== "image/png") fail(`${tag}: asset path was converted`);
      passthrough += 3;
    }
  }
}

if (converted === 0) {
  fail("no pages converted — nothing checked");
} else {
  ratios.sort((a, b) => a - b);
  const median = ratios[Math.floor(ratios.length / 2)];
  console.log(
    `markdown pages converted: ${converted}, passthrough probes: ${passthrough}, median md/html ratio: ${median.toFixed(3)}`,
  );
}

if (failures > 0) {
  console.error(`MARKDOWN-FAIL ${failures} failure(s)`);
  process.exit(1);
}
console.log("MARKDOWN-OK");
