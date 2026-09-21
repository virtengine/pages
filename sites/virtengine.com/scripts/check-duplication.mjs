/**
 * Duplication check: flags 12-20 consecutive identical words across pages.
 * Ignores nav, footer, breadcrumbs, status/legal boilerplate and product names.
 * Usage: node ./scripts/check-duplication.mjs [dist]
 * Manual review only — never auto-deletes content.
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const root = process.argv[2] ?? "dist";
const N = 12;
const IGNORE = [
  /skip to content/i,
  /protocol in development/i,
  /network is not live/i,
  /in development/i,
  /illustrative example/i,
  /virtengine/i,
  /waldur/i,
  /homeport/i,
  /detio foundation/i,
  /apache 2\.0/i,
  /all rights reserved/i,
  /media credits/i,
];

function* htmlFiles(dir) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    const s = statSync(p);
    if (s.isDirectory()) yield* htmlFiles(p);
    else if (p.endsWith(".html")) yield p;
  }
}

function extractText(html) {
  // Strip nav/header/footer/breadcrumb/aside landmarks before comparing.
  let t = html
    .replace(/<header[\s\S]*?<\/header>/gi, " ")
    .replace(/<footer[\s\S]*?<\/footer>/gi, " ")
    .replace(/<nav[\s\S]*?<\/nav>/gi, " ")
    .replace(/<aside[\s\S]*?<\/aside>/gi, " ");
  t = t.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ");
  t = t.replace(/<[^>]+>/g, " ");
  return t.replace(/\s+/g, " ").trim();
}

const pages = [];
try {
  for (const f of htmlFiles(root)) {
    const text = extractText(readFileSync(f, "utf8"));
    if (text) pages.push({ file: relative(root, f), words: text.split(" ") });
  }
} catch (e) {
  console.error(`Cannot read ${root}: run after 'astro build'.`);
  process.exit(2);
}

const index = new Map();
for (const p of pages) {
  for (let i = 0; i + N <= p.words.length; i++) {
    const seq = p.words.slice(i, i + N).join(" ");
    if (IGNORE.some((re) => re.test(seq))) continue;
    if (!index.has(seq)) index.set(seq, new Set());
    index.get(seq).add(p.file);
  }
}

let flagged = 0;
for (const [seq, files] of index) {
  if (files.size >= 2) {
    flagged++;
    console.log(`\n--- ${files.size} pages share ${N} words ---`);
    for (const f of files) console.log(`  ${f}`);
    console.log(`  "${seq.slice(0, 140)}…"`);
    if (flagged > 40) break;
  }
}
console.log(`\nChecked ${pages.length} pages. Flagged sequences: ${flagged}.`);
console.log("Review manually: canonical explanations must live on one owner page; others link.");
process.exit(0);
