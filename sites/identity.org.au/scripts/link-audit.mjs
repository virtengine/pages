// Dist-wide internal link audit: every internal href/src must resolve to a built file.
import { readdirSync, readFileSync, existsSync, statSync } from "node:fs";
import { join, resolve } from "node:path";

const dist = resolve(process.argv[2] ?? "dist");
const htmlFiles = [];
(function walk(dir) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) walk(p);
    else if (p.endsWith(".html")) htmlFiles.push(p);
  }
})(dist);

const attrRe = /(?:href|src)="([^"]+)"/g;
let checked = 0;
const dead = [];
for (const file of htmlFiles) {
  const html = readFileSync(file, "utf8");
  for (const m of html.matchAll(attrRe)) {
    let url = m[1];
    if (/^(https?:|mailto:|tel:|#|data:)/.test(url)) continue;
    url = url.split("#")[0].split("?")[0];
    if (!url) continue;
    if (!url.startsWith("/")) continue; // built site uses root-relative only
    checked++;
    const clean = url.replace(/\/$/, "");
    const candidates = clean === ""
      ? [join(dist, "index.html")]
      : [
          join(dist, clean),
          join(dist, `${clean}.html`),
          join(dist, clean, "index.html"),
        ];
    if (!candidates.some((c) => existsSync(c))) {
      dead.push(`${file.slice(dist.length + 1)} -> ${m[1]}`);
    }
  }
}
console.log(`HTML files: ${htmlFiles.length}; internal refs checked: ${checked}; dead: ${dead.length}`);
for (const d of dead) console.log("DEAD:", d);
process.exit(dead.length ? 1 : 0);
