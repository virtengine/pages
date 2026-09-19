// Repo-wide internal link checker for the four built sites (build gate tooling).
//
// Usage: node scripts/check-links.mjs <dist-dir> [<dist-dir> ...]
//
// Checks every internal href/src/poster on a real HTML tag in the built output:
//   * the target file must exist on disk (path, path.html, path/index.html), and
//   * a "#fragment" must match an id in the target page when that page is in scope.
//
// It is tag-aware on purpose: escaped code samples in the legacy blog contain text
// like `&lt;a href="signin"&gt;` / `href="configuration.xsl"` which a naive
// /href="..."/ scan reports as dead links that no browser would ever follow.
//
// A checker that exits 0 while checking nothing is worse than no checker, so this
// script hard-fails when a dist has no HTML or when it found no internal references
// to check, and prints a LINKCHECK-OK marker that CI asserts on.
import { readdirSync, readFileSync, existsSync, statSync } from "node:fs";
import { join, resolve, relative } from "node:path";

const distRoots = process.argv.slice(2).map((p) => resolve(p));
if (distRoots.length === 0) {
  console.error("usage: node scripts/check-links.mjs <dist-dir> [<dist-dir> ...]");
  process.exit(2);
}

const EXTERNAL = /^(?:[a-z][a-z0-9+.-]*:|\/\/|#)/i; // http:, mailto:, tel:, data:, protocol-relative, bare anchor
const TAG = /<([a-zA-Z][a-zA-Z0-9:-]*)((?:"[^"]*"|'[^']*'|[^>"'])*)>/g;
const ATTR = /([a-zA-Z_:][-a-zA-Z0-9_:.]*)\s*=\s*(?:"([^"]*)"|'([^']*)')/g;
const LINK_ATTRS = new Set(["href", "src", "poster"]);

// Drop non-markup regions so JS/CSS payloads cannot masquerade as links.
const strip = (html) =>
  html
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<script\b[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[\s\S]*?<\/style>/gi, " ");

function scan(html) {
  const links = [];
  const ids = new Set();
  for (const tag of strip(html).matchAll(TAG)) {
    for (const attr of tag[2].matchAll(ATTR)) {
      const name = attr[1].toLowerCase();
      const value = attr[2] ?? attr[3] ?? "";
      if (LINK_ATTRS.has(name)) links.push([tag[1].toLowerCase(), name, value]);
      else if (name === "id") ids.add(value);
    }
  }
  return { links, ids };
}

let failed = false;

for (const dist of distRoots) {
  const label = relative(process.cwd(), dist) || dist;
  if (!existsSync(dist) || !statSync(dist).isDirectory()) {
    console.error(`LINKCHECK-FAIL ${label}: dist directory does not exist`);
    failed = true;
    continue;
  }

  const htmlFiles = [];
  (function walk(dir) {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.name.endsWith(".html")) htmlFiles.push(full);
    }
  })(dist);

  const ids = new Map();
  const refs = [];
  for (const file of htmlFiles) {
    const { links, ids: found } = scan(readFileSync(file, "utf8"));
    ids.set(resolve(file), found);
    for (const [, attr, value] of links) refs.push([file, attr, value]);
  }

  const decode = (s) => {
    try {
      return decodeURIComponent(s);
    } catch {
      return s;
    }
  };

  const dead = [];
  const missingFragments = [];
  let checked = 0;
  let fragmentsChecked = 0;

  for (const [file, , raw] of refs) {
    const url = raw.trim();
    if (!url || EXTERNAL.test(url)) continue;

    const hashAt = url.indexOf("#");
    const fragment = hashAt === -1 ? "" : url.slice(hashAt + 1);
    const pathPart = decode((hashAt === -1 ? url : url.slice(0, hashAt)).split("?")[0]);
    if (!pathPart) continue; // same-page anchor, nothing to resolve

    checked++;
    const base = pathPart.startsWith("/")
      ? join(dist, pathPart)
      : resolve(join(file, ".."), pathPart);
    const candidates = pathPart.endsWith("/")
      ? [join(base, "index.html")]
      : [base, `${base}.html`, join(base, "index.html")];
    const target = candidates.find((c) => existsSync(c) && statSync(c).isFile());

    if (!target) {
      dead.push(`${relative(dist, file)} -> ${raw}`);
      continue;
    }
    if (fragment && ids.has(resolve(target))) {
      fragmentsChecked++;
      if (!ids.get(resolve(target)).has(decode(fragment))) {
        missingFragments.push(`${relative(dist, file)} -> ${raw}`);
      }
    }
  }

  console.log(
    `${label}: html=${htmlFiles.length} internal_refs=${checked} fragments=${fragmentsChecked} ` +
      `dead=${dead.length} missing_fragments=${missingFragments.length}`,
  );
  for (const d of dead) console.log(`  DEAD: ${d}`);
  for (const f of missingFragments) console.log(`  MISSING_FRAGMENT: ${f}`);

  if (htmlFiles.length === 0) {
    console.error(`LINKCHECK-FAIL ${label}: no HTML in dist — build output is empty`);
    failed = true;
  } else if (checked === 0) {
    console.error(`LINKCHECK-FAIL ${label}: no internal references found — checker did nothing`);
    failed = true;
  } else if (dead.length || missingFragments.length) {
    console.error(
      `LINKCHECK-FAIL ${label}: ${dead.length} dead link(s), ${missingFragments.length} missing fragment(s)`,
    );
    failed = true;
  } else {
    console.log(`LINKCHECK-OK ${label} html=${htmlFiles.length} refs=${checked}`);
  }
}

process.exit(failed ? 1 : 0);
