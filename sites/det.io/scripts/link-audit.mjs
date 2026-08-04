// Ad-hoc dead-link audit for the built det.io dist folder (dev tooling, not shipped).
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "../dist");
const files = [];
(function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.name.endsWith(".html")) files.push(full);
  }
})(root);

let refs = 0;
const dead = [];
for (const file of files) {
  const html = fs.readFileSync(file, "utf8");
  for (const match of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    let url = match[1];
    if (/^(https?:|mailto:|#|data:)/.test(url)) continue;
    refs++;
    url = url.split("#")[0].split("?")[0];
    if (!url) continue;
    const target = url.startsWith("/")
      ? path.join(root, url.slice(1))
      : path.join(path.dirname(file), url);
    if (
      fs.existsSync(target) ||
      fs.existsSync(target + ".html") ||
      fs.existsSync(path.join(target, "index.html"))
    )
      continue;
    dead.push(`${file.replace(root, "")} -> ${match[1]}`);
  }
}
console.log(`files: ${files.length}  internal refs: ${refs}  dead: ${dead.length}`);
dead.forEach((d) => console.log(d));
process.exit(dead.length ? 1 : 0);
