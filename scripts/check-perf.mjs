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
//   max-page-fonts     the same for web fonts: local <link rel=preload as=font> plus every
//                      woff2/woff/ttf/otf/eot a @font-face rule in that page's stylesheets pulls
//   max-page-images    the same for raster/vector images: local <img>/<source> src, srcset and
//                      poster, counting each distinct file once however many candidates name it
//   largest-asset      the single largest emitted file, gzipped (source maps excluded — nobody
//                      downloads them, so budgeting for them would drown out every real signal)
//   total-gzip         every emitted byte in dist, gzipped
//   unresolved-assets  local asset references in the HTML that do NOT exist in dist — a 404 that
//                      no other gate in this repo can see, since check-links only walks hrefs
//
// The gate is a RATCHET, exactly like scripts/check-a11y.mjs: scripts/perf-baseline.json records
// the measured value per site, and a metric fails unless the site measures within PERF_TOLERANCE
// of its budget:
//
//   value > budget x 1.05         OVER   the site got heavier than the budget allows
//   value < budget x 0.95         LOOSE  the site got lighter — the budget should shrink
//   otherwise                     ok
//
// A budget can therefore only be fixed by measuring, never by widening the number by hand.
//
// WHY A BAND AND NOT EQUALITY — measured, not assumed. The first cut compared bytes exactly and
// went red on its very first CI run, which is how the real number below was obtained. The four
// sites are built on a developer's Windows box and gated on a Linux runner, and the build is NOT
// byte-reproducible across the two: sharp/libvips encodes a different og.png (det.io's largest
// asset came out 981 bytes, +2.26%, heavier on Linux), and a handful of text assets differ by a
// few dozen bytes. PR #39, CI run 36679453440, per metric:
//
//   virtengine.com        js 0.0000%  css 0.0000%  largest 0.0000%  total -0.0002%
//   docs.virtengine.com   js 0.0000%  css 0.0000%  largest +0.0042%  total -0.0864%
//   det.io                js 0.0000%  css 0.0000%  largest +2.2550%  total +0.1204%
//   identity.org.au       js 0.0000%  css 0.0000%  largest 0.0000%  total -0.0009%
//
// 2.26% is the worst observed, and PERF_TOLERANCE is 5%: double the measured spread, so the band
// is not sized to a single sample. The band is still tight enough to be a budget: 5% of
// virtengine.com's worst page is 533 BYTES of JavaScript, and 5% of its whole site is 1.1 MB.
//
// The tolerance applies to BYTE metrics only. `unresolved-assets` is a count of dangling
// references, it is platform-independent, and it is held at exactly 0 — which is where the gate's
// sharpest signal lives, since a 404-ing bundle is the defect no other gate in this repo sees.
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

// How far a measurement may sit from its budget, as a fraction. 0.05 = +/-5%.
// Sized from the measured Windows-vs-Linux spread, not guessed: see the header table. A byte
// metric inside this band passes; outside it, in EITHER direction, the run fails.
const PERF_TOLERANCE = 0.05;

// A budget is checked against every metric the checker can measure, in this order. Keeping the
// list explicit (rather than diffing against a live measurement) is what makes
// "the repo's own baseline still matches the checker's metric set" testable.
const METRICS = [
  "max-page-js",
  "max-page-css",
  "max-page-fonts",
  "max-page-images",
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

// The two per-page asset classes that had no metric of their own until now. They are split from
// ASSET_EXT rather than inferred from it so that "is this a font" and "is this an image" are
// stated once, and a page that loads every weight is caught by the worst page rather than only
// by the site-wide totals.
const FONT_EXT = new Set([".woff2", ".woff", ".ttf", ".otf", ".eot"]);
const IMAGE_EXT = new Set([
  ".svg", ".png", ".jpg", ".jpeg", ".gif", ".webp", ".avif", ".ico", ".bmp", ".tiff",
]);

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
  let maxPageFonts = 0;
  let maxPageFontsPage = "";
  let maxPageImages = 0;
  let maxPageImagesPage = "";
  let refs = 0;
  let assets = 0;
  const unresolved = [];

  for (const file of htmlFiles) {
    const html = readFileSync(file, "utf8");
    const page = relative(dist, file).replace(/\\/g, "/");
    const clean = strip(html);
    let pageJs = 0;
    let pageCss = 0;
    let pageFonts = 0;
    let pageImages = 0;
    // A srcset names the same file in several densities, and a stylesheet's @font-face can be
    // repeated across faces; both would otherwise be charged to the reader many times over for
    // one download. Each distinct resolved path counts once per page.
    const countedFonts = new Set();
    const countedImages = new Set();
    const pageStylesheets = [];
    // Charge a font/image reference exactly once per page, whoever asks for it.
    const charge = (abs) => {
      const ext = posix.extname(relative(dist, abs).replace(/\\/g, "/")).toLowerCase();
      if (FONT_EXT.has(ext)) {
        if (countedFonts.has(abs)) return;
        countedFonts.add(abs);
        pageFonts += gzipSize(abs);
        return;
      }
      if (IMAGE_EXT.has(ext)) {
        if (countedImages.has(abs)) return;
        countedImages.add(abs);
        pageImages += gzipSize(abs);
      }
    };

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
        if (rels.includes("stylesheet")) {
          pageCss += gzipSize(abs);
          // Remembered so the @font-face rules it contains can be charged to this page: a font is
          // downloaded because of the stylesheet, and without this a page's font weight would be
          // invisible whenever the browser fetched it from CSS rather than from a preload link.
          pageStylesheets.push(abs);
        } else if (rels.includes("icon")) {
          // An icon is weight the reader downloads, but not page CSS or JS. Charge it as an image.
          charge(abs);
        } else {
          // modulepreload/preload of a script is JavaScript the reader will execute. A preload of
          // anything else is weight, but charge() only bills it if it is a font or an image --
          // anything it did not classify must still be charged as JS, or a preloaded script
          // would stop counting toward max-page-js.
          const ext = posix.extname(relative(dist, abs).replace(/\\/g, "/")).toLowerCase();
          if (FONT_EXT.has(ext) || IMAGE_EXT.has(ext)) charge(abs);
          else pageJs += gzipSize(abs);
        }
        continue;
      }

      // Images, media and fonts are weight the reader downloads too. Fonts and images are now
      // charged to this page's own totals as well as appearing in largest-asset / total-gzip, so
      // one page loading every weight is caught by its own budget instead of hiding in a
      // site-wide number that no single navigation pays.
      if (tag === "img" || tag === "source" || tag === "audio" || tag === "video") {
        for (const name of ["src", "poster", "data-src"]) {
          const value = attrs.get(name);
          if (!isAssetRef(value)) continue;
          const abs = resolveRef(dist, value);
          refs++;
          if (abs && existsSync(abs)) {
            assets++;
            charge(abs);
          } else unresolved.push(`${page} :: <${tag} ${name}="${value}">`);
        }
        for (const name of ["srcset", "data-srcset"]) {
          const value = attrs.get(name);
          if (!value) continue;
          for (const candidate of value.split(",")) {
            const url = candidate.trim().split(/\s+/)[0];
            if (!isAssetRef(url)) continue;
            const abs = resolveRef(dist, url);
            refs++;
            if (abs && existsSync(abs)) {
              assets++;
              charge(abs);
            } else unresolved.push(`${page} :: <${tag} ${name}="${url}">`);
          }
        }
      }
    }

    // Fonts declared by this page's stylesheets via @font-face. A browser downloads these because
    // the page's CSS asks for them, so they are the page's weight even though no HTML tag names
    // them -- which is exactly how @fontsource ships, and how a five-family stack would otherwise
    // stay invisible to every per-page budget.
    //
    // WHAT THIS NUMBER IS: an UPPER BOUND on one navigation's font weight, not its expected
    // value. A @font-face carries a unicode-range, so a browser pulls only the faces whose
    // ranges cover the text it is rendering (virtengine.com declares 33 faces but a latin page
    // needs a handful). Budgeting every declared face is deliberate: it is the number that moves
    // when someone adds a family, drops a weight or ships a whole script's faces, and it is
    // stable across locales in a way an expected-value budget would not be.
    for (const sheet of pageStylesheets) {
      const css = readFileSync(sheet, "utf8");
      for (const m of css.matchAll(/url\(\s*(['"]?)([^'")]+)\1\s*\)/gi)) {
        const url = m[2];
        if (isExternal(url)) continue;
        // Resolved against dist, NOT the stylesheet's directory: Astro emits asset URLs
        // site-absolute (/_astro/inter-cyrillic-400-normal.obahsSVq.woff2), so resolving against
        // the sheet's own path would build a path that does not exist and silently measure 0.
        const abs = resolveRef(dist, url);
        if (!abs || !existsSync(abs)) continue;
        if (!FONT_EXT.has(posix.extname(abs).toLowerCase())) continue;
        charge(abs);
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
    if (pageFonts > maxPageFonts) {
      maxPageFonts = pageFonts;
      maxPageFontsPage = page;
    }
    if (pageImages > maxPageImages) {
      maxPageImages = pageImages;
      maxPageImagesPage = page;
    }
  }

  const counts = {
    "max-page-js": maxPageJs,
    "max-page-css": maxPageCss,
    "max-page-fonts": maxPageFonts,
    "max-page-images": maxPageImages,
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
      `fonts=${maxPageFonts}(${maxPageFontsPage}) images=${maxPageImages}(${maxPageImagesPage}) ` +
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
    // A zero budget is exact and gets no tolerance: one dangling reference is one too many.
    if (cap === 0) {
      if (value > 0) over.push(metric);
      continue;
    }
    // ONE rule, evaluated as a single chain, so a metric can never be reported as two opposite
    // defects at once. The first cut tested `value < cap` and `value > cap * headroom` as two
    // INDEPENDENT conditions, which made the band between them satisfy both: a budget raised by
    // 1% printed "OVER BUDGET largest-asset: 4087 > 4006" and "LOOSE BUDGET largest-asset: 4087
    // measured, 4006 budgeted" on adjacent lines. A verdict naming two opposite defects is not a
    // verdict, and a reader who sees both stops trusting either.
    //
    // The band is TWO-SIDED on purpose. An earlier one-sided version only caught a site getting
    // heavier, so a site that got LIGHTER left its budget permanently padded and the number
    // decayed into a lie — the exact failure the ratchet exists to prevent, just slower.
    const ceiling = Math.floor(cap * (1 + PERF_TOLERANCE));
    const floor = Math.ceil(cap * (1 - PERF_TOLERANCE));
    if (value > ceiling) {
      over.push(metric);
    } else if (value < floor) {
      // The site is comfortably under budget: the number is stale and should be re-measured
      // down. Padding is the one thing the ratchet exists to refuse; the fix is a smaller
      // budget, never a wider one.
      loose.push(metric);
    }
  }

  for (const metric of over) {
    const cap = budget[metric];
    const suffix =
      typeof cap === "number" && cap !== 0
        ? ` (tolerance +${Math.round(PERF_TOLERANCE * 100)}%, ceiling ${Math.floor(cap * (1 + PERF_TOLERANCE))})`
        : "";
    console.log(`  OVER BUDGET ${metric}: ${counts[metric]} > ${cap ?? 0}${suffix}`);
  }
  for (const metric of loose) {
    const cap = budget[metric];
    const floor = cap === 0 ? 0 : Math.ceil(cap * (1 - PERF_TOLERANCE));
    console.log(
      `  LOOSE BUDGET ${metric}: ${counts[metric]} measured, ${cap} budgeted (floor ${floor})`,
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
  // MERGE into the existing ledger, never REPLACE it. The first cut built `merged` from the sites
  // on the command line alone, so re-seeding ONE site rewrote a four-site ledger into a one-site
  // ledger: the other three were deleted wholesale and the log still read "updated ... for
  // <site>", which describes a targeted edit. Since a site with no entry is held to zero
  // (check-perf.mjs:484) the deletion did not go unnoticed at run time — it turned three
  // production sites red — but it destroyed every budget for them, and the fix for that red was
  // as destructive as the bug. A budget ledger that can lose three of four entries by a
  // documented command is the same class as a check that passes while checking nothing.
  //
  // Merge is by SITE, never by file: the command line is the set of sites being re-measured, so
  // those are overwritten, and everything else is carried through byte-for-byte.
  const merged = { ...baseline };
  for (const [site, counts] of Object.entries(measured)) {
    merged[site] = Object.fromEntries(METRICS.map((m) => [m, counts[m]]));
  }
  const kept = Object.keys(merged).filter((s) => !(s in measured));
  if (kept.length) {
    console.log(`PERF-BASELINE carried over ${kept.length} unmeasured site(s): ${kept.join(", ")}`);
  }
  // The drop check is made on the object ABOUT TO BE WRITTEN, before anything is written.
  //
  // The first version of this guard read the file back after the write and compared. That sounds
  // stronger -- it observes the real file -- and it is useless as a guard, because the write has
  // already happened. Reverting `merged` to a replace made that version print "dropped 3 site(s)"
  // and exit 1 with the ledger on disk already reduced to ['det.io']: the check named the victims
  // after destroying them, and the operator's only recovery was the same re-seed-by-hand that was
  // the original hazard. A check that reports damage after causing it is a report, not a guard.
  const lost = Object.keys(baseline).filter((s) => !(s in merged));
  if (lost.length) {
    console.error(
      `PERF-FAIL update-baseline would drop ${lost.length} site(s) from the ledger: ${lost.join(", ")}`,
    );
    process.exit(1);
  }

  writeFileSync(BASELINE_PATH, `${JSON.stringify(merged, null, 2)}\n`);

  // Read back as well: the merge can be correct while the write is not (a partial write, a wrong
  // path), and a claim about what landed on disk should be observed rather than assumed.
  const written = JSON.parse(readFileSync(BASELINE_PATH, "utf8"));
  const missingOnDisk = Object.keys(merged).filter((s) => !(s in written));
  if (missingOnDisk.length) {
    console.error(
      `PERF-FAIL the written ledger is missing ${missingOnDisk.length} site(s): ${missingOnDisk.join(", ")}`,
    );
    process.exit(1);
  }
  // Per-site VALUE comparison: "carried over" has to mean "present with its OLD numbers", not
  // merely "mentioned". Comparing the entries by value is what makes a merge that zeroed, rounded
  // or re-measured an untouched site fail instead of passing a key-count check.
  for (const site of kept) {
    if (JSON.stringify(written[site]) !== JSON.stringify(baseline[site])) {
      console.error(`PERF-FAIL update-baseline altered carried-over site ${site}`);
      process.exit(1);
    }
  }
  console.log(
    `PERF-BASELINE updated ${rel(BASELINE_PATH)} for ${Object.keys(measured).join(", ")}` +
      (kept.length ? ` (${kept.length} carried over)` : ""),
  );
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
