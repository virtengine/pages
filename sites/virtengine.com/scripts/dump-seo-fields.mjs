// Detailed SEO field dump: which pages have overlong or duplicate titles/descriptions.
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...walk(full));
    else if (entry.endsWith(".html")) out.push(full);
  }
  return out;
}

const siteArg = process.argv[2] ?? ".";
const files = walk(join(siteArg, "dist"));
const longTitles = [];
const longDescs = [];

for (const file of files) {
  const html = readFileSync(file, "utf8");
  const rel = relative(join(siteArg, "dist"), file).split("\\").join("/");
  const title = (html.match(/<title>([\s\S]*?)<\/title>/) || [])[1] ?? "";
  const desc = (html.match(/<meta name="description" content="([^"]*)"/) || [])[1] ?? "";
  if (title.length > 65) longTitles.push([rel, title.length, title]);
  if (desc.length > 165) longDescs.push([rel, desc.length, desc]);
}

console.log(`### titles > 65 chars: ${longTitles.length}`);
for (const [rel, len, title] of longTitles) console.log(`${String(len).padStart(4)} ${rel}\n     ${title}`);
console.log(`\n### descriptions > 165 chars: ${longDescs.length}`);
for (const [rel, len, desc] of longDescs.slice(0, 60)) console.log(`${String(len).padStart(4)} ${rel}\n     ${desc.slice(0, 200)}`);
if (longDescs.length > 60) console.log(`... ${longDescs.length - 60} more`);