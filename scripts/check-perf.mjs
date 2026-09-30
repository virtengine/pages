// Performance budget for the four built sites (build gate tooling).
//
// Usage: node scripts/check-perf.mjs [--update-baseline] <site>=<dist-dir> [<site>=<dist-dir> ...]
//
// Zero dependencies on purpose, and measured STATICALLY from the built dist: Lighthouse and
// bundle analysers need a browser, a network and a warm cache, so in CI they are slow, flaky
// and dependent on a machine's core count. Everything below is a property of the bytes the
// build already emitted, so the number is the same on a laptop and on a runner.
//
// What is measured, per site:
//
//   max-page-js        worst single page's shipped JavaScript, gzipped: every local <script
//                      src> asset it pulls in, plus any inline <script> bodies
//   max-page-css       the same for stylesheets: local <link rel=stylesheet> plus inline <style>
//   largest-asset      the single largest emitted file, gzipped (source maps excluded — nobody
//                      downloads them, so budgeting for them would drown out every real signal)
//   total-gzip         every emitted byte in dist, gzipped
//   unresolved-assets  local asset references in the HTML that do NOT exist in dist — a 404 that
//                      no other gate in this repo can see, since check-links only walks hrefs
//
// The gate is a RATCHET, exactly like scripts/check-a11y.mjs: scripts/perf-baseline.json records
// the measured value per site, and a metric fails unless the site measures within PERF_HEADROOM
// of its budget:
//
//   value >  budget x 1.02        OVER   the site got heavier than the budget allows
//   value <  budget               LOOSE  the budget is padded above what the site needs
//   budget <= value <= budget x 1.02        OK — the allowance absorbing measurement jitter
//
// A budget can therefore only be fixed by making the site lighter, never by widening the number.
// Use --update-baseline to re-measure after a fix, and commit the smaller numbers with it.
//
// ONE deliberate difference from the a11y ratchet: bytes are compared with a HEADROOM allowance
// rather than for exact equality. zlib is pinned in the toolchain, not in this script, so a zlib
// minor release can move a gzipped size by a fraction of a percent, and an exact-equality gate
// would go red on a tree that got no heavier. The allowance exists ONLY to absorb that jitter —
// it can neither excuse a regression nor license a padded budget, which is the whole of its job.
//
// A checker that exits 0 while checking nothing is worse than no checker, so this script
// hard-fails on a missing dist, on a dist with no HTML, on an HTML tree in which it resolved no
// asset reference at all, and when it inspected nothing — and prints a PERF-OK marker that CI
// asserts on with a grep, so a checker that stops measuring fails the build instead of passing.
import { readdirSync, readFileSync, writeFileSync, existsSync, statSync } from "node:fs";
import { join, resolve, relative, dirname, basename, posix } from "node:path";
import { fileURLToPath } from "node:url";
import { gzipSync } from "node:zlib";

const HERE = dirname(fileURLToPath(import.meta.url));
// PERF_BASELINE is a test seam only: the regression suite points other runs at a scratch ledger
// so it never rewrites the real one. CI sets nothing and gets scripts/perf-baseline.json.
const BASELINE_PATH = process.env.PERF_BASELINE ?? join(HERE, "perf-baseline.json");

// A budget may sit this far above the measured bytes. Small on purpose: see the header note.
const PERF_HEADROOM = 1.02;

// A budget is checked against every metric the checker can measure, in this order. Keeping the
// list explicit (rather than diffing against a live measurement) is what makes
// "the repo's own baseline still matches the checker's metric set" testable.
const METRICS = [
  "max-page-js",
  "max-page-css",
  "largest-asset",
  "total-gzip",
  "unresolved-assets",
];

// Extensions that are downloaded by a browser and are therefore weight the reader pays for.
const ASSET_EXT = new Set([
  ".js", ".mjs", ".css", ".svg", ".png", ".jpg", ".jpeg", ".gif", ".webp", ".avif", ".ico",
  ".woff", ".woff2", ".ttf", ".otf", ".eot", ".mp4", ".webm", ".mp3", ".wasm", ".json", ".xml",
  ".txt", ".webmanifest", ".pdf",
]);

// Never budgeted: a source map is a debugging artifact, not a byte the reader downloads.
const EXCLUDED_FROM_ASSET = new Set([".map"]);

const args = process.argv.slice(2);
const updateBaseline = args.includes("--update-baseline");
const targets = args.filter((a) => !a.startsWith("--"));

if (targets.length === 0) {
  console.error(
    "usage: node scripts/check-perf.mjs [--update-baseline] <site>=<dist-dir> [<site>=<dist-dir> ...]",
  );
  process.exit(2);
}

const TAG = /<([a-zA-Z][a-zA-Z0-9:-]*)((?:"[^"]*"|'[^']*'|[^>"'])*)>/g;
const ATTR = /([a-zA-Z_:][-a-zA-Z0-9_:.]*)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+)))?/g;
const strip = (html) =>
  html
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<script\b[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[\s\S]*?<\/style>/gi, " ");

const rel = (p) => p.replace(/\\/g, "/");

function attrsOf(raw) {
  const out = new Map();
  for (const m of raw.matchAll(ATTR)) {
    out.set(m[1].toLowerCase(), m[2] ?? m[3] ?? m[4] ?? "");
  }
  return out;
}

// The gzip size of one file, computed once and reused: the same bundle is referenced by many
// pages and re-gzipping it per page would be both slow and a chance for the numbers to disagree.
const gzipCache = new Map();
function gzipSize(abs) {
  if (gzipCache.has(abs)) return gzipCache.get(abs);
  const size = gzipSync(readFileSync(abs), { level: 9 }).length;
  gzipCache.set(abs, size);
  return size;
}

const isExternal = (url) =>
  !url ||
  url.startsWith("//") ||
  url.startsWith("data:") ||
  url.startsWith("mailto:") ||
  url.startsWith("tel:") ||
  url.startsWith("javascript:") ||
  url.startsWith("#") ||
  /^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(url);

// A local reference is only weight the reader pays for if the browser would fetch it as a file.
function isAssetRef(url) {
  if (isExternal(url)) return false;
  const clean = url.split("#")[0].split("?")[0];
  if (!clean) return false;
  const ext = posix.extname(clean).toLowerCase();
  return ASSET_EXT.has(ext) && !EXCLUDED_FROM_ASSET.has(ext);
}

// Resolve a page-relative or root-relative URL against the dist root the way a static host does.
function resolveRef(dist, url) {
  const clean = url.split("#")[0].split("?")[0];
  const decoded = (() => {
    try {
      return decodeURIComponent(clean);
    } catch {
      return clean;
    }
  })();
  const abs = decoded.startsWith("/")
    ? join(dist, decoded.slice(1))
    : resolve(dist, decoded);
  // A reference that climbs out of dist is not a file this build can serve.
  if (!abs.startsWith(dist)) return null;
  return abs;
}

function walkFiles(dir, files = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) walkFiles(full, files);
    else if (entry.isFile()) files.push(full);
  }
  return files;
}

function readBaseline() {
  if (!existsSync(BASELINE_PATH)) return {};
  try {
    return JSON.parse(readFileSync(BASELINE_PATH, "utf8"));
  } catch (err) {
    console.error(`PERF-FAIL ${rel(BASELINE_PATH)}: invalid JSON — ${err.message}`);
    process.exit(1);
  }
}

const baseline = readBaseline();
const measured = {};
const unmeasurable = [];
const overBudget = [];
const looseBudget = [];
let docsTotal = 0;
let assetsTotal = 0;
let refsTotal = 0;

for (const target of targets) {
  const eq = target.indexOf("=");
  const dist = resolve(eq === -1 ? target : target.slice(eq + 1));
  const site = eq === -1 ? basename(dirname(dist)) : target.slice(0, eq);

  if (!existsSync(dist) || !statSync(dist).isDirectory()) {
    console.error(`PERF-FAIL ${site}: dist directory does not exist (${rel(dist)})`);
    unmeasurable.push(site);
    continue;
  }

  const allFiles = walkFiles(dist);
  const htmlFiles = allFiles.filter((f) => f.endsWith(".html"));

  if (htmlFiles.length === 0) {
    console.error(`PERF-FAIL ${site}: no HTML in dist — build output is empty`);
    unmeasurable.push(site);
    continue;
  }

  // Site-wide: total gzipped weight and the single heaviest downloadable file.
  const shipped = allFiles.filter(
    (f) => !EXCLUDED_FROM_ASSET.has(posix.extname(f).toLowerCase()),
  );
  let totalGzip = 0;
  let largest = 0;
  let largestFile = "";
  for (const file of shipped) {
    const size = gzipSize(file);
    totalGzip += size;
    if (size > largest) {
      largest = size;
      largestFile = relative(dist, file).replace(/\\/g, "/");
    }
  }

  // Per page: the weight one navigation actually costs.
  let maxPageJs = 0;
  let maxPageJsPage = "";
  let maxPageCss = 0;
  let maxPageCssPage = "";
  let refs = 0;
  let assets = 0;
  const unresolved = [];

  for (const file of htmlFiles) {
    const html = readFileSync(file, "utf8");
    const page = relative(dist, file).replace(/\\/g, "/");
    const clean = strip(html);
    let pageJs = 0;
    let pageCss = 0;

    for (const m of html.matchAll(/<script\b((?:"[^"]*"|'[^']*'|[^>"'])*)>([\s\S]*?)<\/script>/gi)) {
      const attrs = attrsOf(m[1]);
      const type = (attrs.get("type") ?? "").toLowerCase();
      // A JSON-LD block is data for a crawler, and a `type` the browser does not execute is not
      // JavaScript — neither is weight the reader's CPU pays, and budgeting it as JS would make
      // a rich schema a reason to fail the gate.
      if (type && !/^(module|text\/javascript|application\/javascript|text\/jsx|application\/ecmascript)$/.test(type)) {
        continue;
      }
      const src = attrs.get("src");
      if (isAssetRef(src)) {
        const abs = resolveRef(dist, src);
        refs++;
        if (abs && existsSync(abs)) {
          pageJs += gzipSize(abs);
          assets++;
          continue;
        }
        unresolved.push(`${page} :: <script src="${src}">`);
        continue;
      }
      if (src !== undefined && isExternal(src)) continue; // fetched, but not this build's weight
      // No src at all: an inline script, whose bytes ship inside the page itself. This must be
      // counted — an inline island is one of the commonest ways a page gets heavy without a
      // single new file appearing in dist.
      if (m[2].trim()) {
        pageJs += gzipSync(Buffer.from(m[2], "utf8"), { level: 9 }).length;
        refs++;
      }
    }

    for (const m of clean.matchAll(TAG)) {
      const tag = m[1].toLowerCase();
      const attrs = attrsOf(m[2]);

      if (tag === "link") {
        const rels = (attrs.get("rel") ?? "").toLowerCase().split(/\s+/).filter(Boolean);
        const href = attrs.get("href");
        if (!href || !rels.length) continue;
        const wanted =
          rels.includes("stylesheet") || rels.includes("preload") ||
          rels.includes("modulepreload") || rels.includes("prefetch") ||
          rels.includes("icon");
        if (!wanted) continue;
        if (!isAssetRef(href)) continue;
        const abs = resolveRef(dist, href);
        refs++;
        if (!abs || !existsSync(abs)) {
          unresolved.push(`${page} :: <link rel="${rels.join(" ")}" href="${href}">`);
          continue;
        }
        assets++;
        if (rels.includes("stylesheet")) pageCss += gzipSize(abs);
        else if (rels.includes("icon")) { /* an icon is weight, but not page CSS or JS */ }
        else pageJs += gzipSize(abs);
        continue;
      }

      // Images, media and fonts are weight the reader downloads too. They are counted in the
      // per-page totals only through the site-wide metrics, so a heavy hero image shows up in
      // largest-asset / total-gzip rather than being charged to the JavaScript budget.
      if (tag === "img" || tag === "source" || tag === "audio" || tag === "video") {
        for (const name of ["src", "poster", "data-src"]) {
          const value = attrs.get(name);
          if (!isAssetRef(value)) continue;
          const abs = resolveRef(dist, value);
          refs++;
          if (abs && existsSync(abs)) assets++;
          else unresolved.push(`${page} :: <${tag} ${name}="${value}">`);
        }
        for (const name of ["srcset", "data-srcset"]) {
          const value = attrs.get(name);
          if (!value) continue;
          for (const candidate of value.split(",")) {
            const url = candidate.trim().split(/\s+/)[0];
            if (!isAssetRef(url)) continue;
            const abs = resolveRef(dist, url);
            refs++;
            if (abs && existsSync(abs)) assets++;
            else unresolved.push(`${page} :: <${tag} ${name}="${url}">`);
          }
        }
      }
    }

    if (pageJs > maxPageJs) {
      maxPageJs = pageJs;
      maxPageJsPage = page;
    }
    if (pageCss > maxPageCss) {
      maxPageCss = pageCss;
      maxPageCssPage = page;
    }
  }

  const counts = {
    "max-page-js": maxPageJs,
    "max-page-css": maxPageCss,
    "largest-asset": largest,
    "total-gzip": totalGzip,
    "unresolved-assets": unresolved.length,
  };
  measured[site] = counts;
  docsTotal += htmlFiles.length;
  refsTotal += refs;
  assetsTotal += assets;

  console.log(
    `${site}: html=${htmlFiles.length} refs=${refs} assets=${assets} files=${allFiles.length} ` +
      `js=${maxPageJs}(${maxPageJsPage}) css=${maxPageCss}(${maxPageCssPage}) ` +
      `largest=${largest}(${largestFile}) total=${totalGzip} unresolved=${unresolved.length}`,
  );

  // Anti-vacuity: HTML with no resolvable asset reference means the resolver stopped resolving,
  // and every per-page number above would read a cheerful zero.
  if (refs === 0) {
    console.error(`PERF-FAIL ${site}: resolved no asset references — resolver did nothing`);
    unmeasurable.push(site);
    continue;
  }
  if (assets === 0) {
    console.error(`PERF-FAIL ${site}: resolved no asset files — every reference is dangling`);
    unmeasurable.push(site);
    continue;
  }
  if (totalGzip === 0) {
    console.error(`PERF-FAIL ${site}: dist weighs 0 gzipped bytes — checker measured nothing`);
    unmeasurable.push(site);
    continue;
  }

  const budget = baseline[site] ?? {};
  const over = [];
  const loose = [];
  for (const metric of METRICS) {
    const value = counts[metric];
    const cap = budget[metric];
    if (typeof cap !== "number") {
      // A metric with no budget is held to zero: an unseeded gate must be the strict one.
      if (value > 0) over.push(metric);
      continue;
    }
    // A zero budget is exact and gets no headroom: one dangling reference is one too many.
    if (cap === 0) {
      if (value > 0) over.push(metric);
      continue;
    }
    // ONE rule, evaluated as a single chain, so a metric can never be reported as two opposite
    // defects at once. The first cut tested `value < cap` and `value > cap * headroom` as two
    // INDEPENDENT conditions, which made the whole band [cap, cap x headroom] satisfy both: a
    // budget raised by 1% printed "OVER BUDGET largest-asset: 4087 > 4006" and "LOOSE BUDGET
    // largest-asset: 4087 measured, 4006 budgeted" on adjacent lines. A verdict naming two
    // opposite defects is not a verdict, and a reader who sees both stops trusting either.
    //
    // The three bands, in order:
    //   value >  ceiling  OVER   the site really did get heavier than the budget allows
    //   cap < value <= ceiling  OK — the allowance absorbing measurement jitter
    //   value <  cap     LOOSE  the budget is padded above what the site needs
    //
    // `value < cap` is STRICT, so the seeded state (measured == budget) passes. The first cut
    // used `value <= cap`, and a freshly-seeded ledger failed its own gate — the fastest way to
    // teach a team that a ratchet is noise.
    const ceiling = Math.floor(cap * PERF_HEADROOM);
    if (value > ceiling) {
      over.push(metric);
    } else if (value < cap) {
      // The budget is wider than the site needs. Padding is the one thing the ratchet exists to
      // refuse: the fix is a smaller number, never a wider one.
      loose.push(metric);
    }
  }

  for (const metric of over) {
    const cap = budget[metric];
    const suffix =
      typeof cap === "number" && cap !== 0
        ? ` (+${Math.round((PERF_HEADROOM - 1) * 100)}% headroom, ceiling ${Math.floor(cap * PERF_HEADROOM)})`
        : "";
    console.log(`  OVER BUDGET ${metric}: ${counts[metric]} > ${cap ?? 0}${suffix}`);
  }
  for (const metric of loose) {
    const cap = budget[metric];
    const ceiling = cap === 0 ? 0 : Math.floor(cap * PERF_HEADROOM);
    console.log(
      `  LOOSE BUDGET ${metric}: ${counts[metric]} measured, ${cap} budgeted (ceiling ${ceiling})`,
    );
  }

  if (unresolved.length) {
    for (const item of unresolved.slice(0, 20)) console.log(`  UNRESOLVED ${item}`);
    if (unresolved.length > 20) console.log(`    ... and ${unresolved.length - 20} more`);
  }

  if (over.length === 0 && loose.length === 0) {
    console.log(`  PERF-BASELINE ok`);
  } else {
    if (over.length) {
      console.error(
        `PERF-FAIL ${site}: ${over.map((m) => `${m} ${counts[m]}>${budget[m] ?? 0}`).join(", ")}`,
      );
    }
    if (loose.length) {
      console.error(
        `PERF-FAIL ${site}: budget is loose for ${loose
          .map((m) => `${m} ${counts[m]} vs ${budget[m]}`)
          .join(", ")} — run: node scripts/check-perf.mjs --update-baseline ${site}=<dist>`,
      );
    }
    if (over.length) overBudget.push(site);
    if (loose.length) looseBudget.push(site);
  }
}

// Per-site integrity of the ledger is checked at repo level by scripts/check-static.mjs (it can
// see every site under sites/, which a single matrix job cannot).
if (docsTotal === 0) {
  console.error("PERF-FAIL no HTML documents measured — checker did nothing");
  unmeasurable.push("<all sites: no documents>");
} else if (refsTotal === 0) {
  console.error("PERF-FAIL no asset references resolved — checker did nothing");
  unmeasurable.push("<all sites: no references>");
} else if (assetsTotal === 0) {
  console.error("PERF-FAIL no asset files resolved — checker did nothing");
  unmeasurable.push("<all sites: no assets>");
}

if (updateBaseline) {
  // Refuse only when a site could not be measured at all: a partial write silently drops a
  // site's budget and turns the gate off for it. Budgets that are simply over are the normal
  // way a new metric gets seeded, so they are allowed here.
  if (unmeasurable.length) {
    console.error(
      `PERF-FAIL refusing to update baseline: ${unmeasurable.length} site(s) could not be measured`,
    );
    process.exit(1);
  }
  const merged = {};
  for (const [site, counts] of Object.entries(measured)) {
    merged[site] = Object.fromEntries(METRICS.map((m) => [m, counts[m]]));
  }
  writeFileSync(BASELINE_PATH, `${JSON.stringify(merged, null, 2)}\n`);
  console.log(`PERF-BASELINE updated ${rel(BASELINE_PATH)} for ${Object.keys(merged).join(", ")}`);
  process.exit(0);
}

if (unmeasurable.length || overBudget.length || looseBudget.length) {
  console.error(
    `PERF-FAIL ${overBudget.length} site(s) over budget, ${looseBudget.length} with a loose budget, ${unmeasurable.length} unmeasurable`,
  );
  process.exit(1);
}

console.log(
  `PERF-OK sites=${targets.length} html=${docsTotal} refs=${refsTotal} assets=${assetsTotal}`,
);
