/**
 * SEO meta gate: duplicate / missing / overlong titles and meta descriptions in a built site.
 *
 * Usage: node scripts/audit-seo-meta.mjs <site-dir> [<site-dir> ...]
 *
 * Reads `<site-dir>/dist`. Pages that opt out of indexing (`robots: noindex`, which is what
 * Astro's redirect stubs emit) are counted and skipped: they are not SEO surfaces, and
 * reporting their missing description would flag correct markup.
 *
 * Fails (exit 1) when an indexable page has no <title> or no meta description, when two
 * indexable pages share a title or a description, or when a dist yields nothing to check.
 * A checker that exits 0 while checking nothing is worse than no checker. Overlong
 * titles/descriptions are reported as warnings only — search engines truncate them, they are
 * not a reason to block a PR.
 *
 * Prints a SEO-OK marker that CI asserts on (`grep -q '^SEO-OK'`). Markers and failure cases
 * are covered by scripts/audit-seo-meta.test.mjs.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const sites = process.argv.slice(2);
if (sites.length === 0) {
  console.error("usage: node scripts/audit-seo-meta.mjs <site-dir> [<site-dir> ...]");
  process.exit(2);
}

const TITLE_MAX = 65;
const DESC_MAX = 165;

function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else if (entry.name.endsWith(".html")) out.push(full);
  }
  return out;
}

let failed = false;

for (const site of sites) {
  const dist = join(site, "dist");
  let files;
  try {
    files = walk(dist);
  } catch (error) {
    console.error(
      `SEO-FAIL ${site}: ` +
        (error.code === "ENOENT" ? "dist directory does not exist" : error.message),
    );
    failed = true;
    continue;
  }

  const titles = new Map();
  const descs = new Map();
  const noTitle = [];
  const noDesc = [];
  const longTitles = [];
  const longDescs = [];
  let noindexed = 0;

  for (const file of files) {
    const html = readFileSync(file, "utf8");
    const rel = relative(dist, file).split("\\").join("/");
    if (/<meta name="robots" content="noindex/.test(html)) {
      noindexed += 1;
      continue; // not an SEO surface — redirect stubs and error pages land here
    }
    const title = (html.match(/<title>([\s\S]*?)<\/title>/) || [])[1];
    const desc = (html.match(/<meta name="description" content="([^"]*)"/) || [])[1];
    if (!title) noTitle.push(rel);
    else {
      if (title.length > TITLE_MAX) longTitles.push(`${rel} (${title.length})`);
      titles.set(title, (titles.get(title) || []).concat(rel));
    }
    if (!desc) noDesc.push(rel);
    else {
      if (desc.length > DESC_MAX) longDescs.push(`${rel} (${desc.length})`);
      descs.set(desc, (descs.get(desc) || []).concat(rel));
    }
  }

  const indexable = files.length - noindexed;
  const dupTitles = [...titles].filter(([, v]) => v.length > 1);
  const dupDescs = [...descs].filter(([, v]) => v.length > 1);

  console.log(
    `== ${site}: pages=${files.length} indexable=${indexable} noindex=${noindexed} ` +
      `noTitle=${noTitle.length} noDesc=${noDesc.length} ` +
      `title>${TITLE_MAX}=${longTitles.length} desc>${DESC_MAX}=${longDescs.length} ` +
      `dupTitles=${dupTitles.length} dupDescs=${dupDescs.length}`,
  );
  for (const [key, value] of dupTitles.slice(0, 5)) {
    console.log(`   dupTitle "${key.slice(0, 55)}" x${value.length} e.g. ${value[0]}`);
  }
  for (const [key, value] of dupDescs.slice(0, 5)) {
    console.log(`   dupDesc  "${key.slice(0, 55)}" x${value.length} e.g. ${value[0]}`);
  }
  for (const rel of noTitle.slice(0, 10)) console.log(`   noTitle: ${rel}`);
  for (const rel of noDesc.slice(0, 10)) console.log(`   noDesc: ${rel}`);
  for (const entry of longTitles.slice(0, 10)) console.log(`   title>${TITLE_MAX}: ${entry}`);
  for (const entry of longDescs.slice(0, 10)) console.log(`   desc>${DESC_MAX}: ${entry}`);

  const errors = [];
  if (files.length === 0) {
    errors.push("no HTML in dist — checker did nothing");
  } else if (indexable === 0) {
    errors.push(`${noindexed} page(s) and not one indexable — nothing to audit`);
  }
  if (noTitle.length) errors.push(`${noTitle.length} indexable page(s) without a <title>`);
  if (noDesc.length) errors.push(`${noDesc.length} indexable page(s) without a meta description`);
  if (dupTitles.length) errors.push(`${dupTitles.length} title(s) shared by several indexable pages`);
  if (dupDescs.length) errors.push(`${dupDescs.length} description(s) shared by several indexable pages`);

  if (errors.length) {
    console.error(`SEO-FAIL ${site}: ${errors.join("; ")}`);
    failed = true;
  } else {
    console.log(
      `SEO-OK ${site} indexable=${indexable} noindex=${noindexed} dupTitles=0 dupDescs=0 ` +
        `warnings=${longTitles.length + longDescs.length}`,
    );
  }
}

process.exit(failed ? 1 : 0);
