// Accessibility budget for the four built sites (build gate tooling).
//
// Usage: node scripts/check-a11y.mjs [--update-baseline] <site>=<dist-dir> [<site>=<dist-dir> ...]
//
// Zero dependencies on purpose: axe/puppeteer need a real browser, are slow in CI and are
// flaky, while every rule below is answerable from the built HTML that is already on disk.
// The rules are the four cheap checks that catch the defects a link checker cannot see:
//
//   img-missing-alt      <img> with no alt attribute at all (a bare `alt` counts as present)
//   document-missing-lang  <html> without a non-empty lang — also fires when there is no
//                          <html> element, since then the language cannot be verified
//   duplicate-id         the same id twice in one document (also breaks #fragment links)
//   heading-level-skip   h1 -> h3 (a jump of more than one level) in document order
//
// The existing sites already violate these (legacy blog markup), so the gate is a *ratchet*:
// scripts/a11y-baseline.json records the exact known violation count per site and rule. A site
// that exceeds its budget fails, and a baseline that is looser than reality also fails so the
// budget cannot be padded into meaninglessness. Fix violations with `--update-baseline`, which
// rewrites the file in place, and commit the smaller numbers with the fix.
//
// A checker that exits 0 while checking nothing is worse than no checker, so this script
// hard-fails on a missing dist, on a dist with no HTML, and when it inspected nothing at all,
// and prints an A11Y-OK marker that CI asserts on.
import { readdirSync, readFileSync, writeFileSync, existsSync, statSync } from "node:fs";
import { join, resolve, relative, dirname, basename } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
// A11Y_BASELINE is a test seam only: the regression suite points other runs at a scratch ledger
// so it never rewrites the real one. CI sets nothing and gets scripts/a11y-baseline.json.
const BASELINE_PATH = process.env.A11Y_BASELINE ?? join(HERE, "a11y-baseline.json");

const RULES = ["img-missing-alt", "document-missing-lang", "duplicate-id", "heading-level-skip"];

const args = process.argv.slice(2);
const updateBaseline = args.includes("--update-baseline");
const targets = args.filter((a) => !a.startsWith("--"));

if (targets.length === 0) {
  console.error(
    "usage: node scripts/check-a11y.mjs [--update-baseline] <site>=<dist-dir> [<site>=<dist-dir> ...]",
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

// Attributes with no value (`alt`, `defer`, `aria-hidden`) must count as present-but-empty:
// a minifier emits `alt` for alt="", and treating that as "missing" buries the real defects.
function attrsOf(raw) {
  const out = new Map();
  for (const m of raw.matchAll(ATTR)) {
    out.set(m[1].toLowerCase(), m[2] ?? m[3] ?? m[4] ?? "");
  }
  return out;
}

function inspectDocument(html, file, violations) {
  const clean = strip(html);
  const push = (rule, detail) => violations.push([rule, `${rel(file)}${detail ? ` :: ${detail}` : ""}`]);

  // Astro emits meta-refresh stubs for redirected routes (identity.org.au/governance.html is
  // one). They carry no <html>, no headings and no content, so applying page rules to them
  // would only train the gate's readers to ignore it.
  const isRedirect = /<meta\b[^>]*http-equiv\s*=\s*["']?refresh/i.test(clean);

  const htmlTag = clean.match(/<html\b((?:"[^"]*"|'[^']*'|[^>"'])*)>/i);
  const lang = htmlTag ? (attrsOf(htmlTag[1]).get("lang") ?? "").trim() : "";
  if (!lang && !isRedirect) push("document-missing-lang", htmlTag ? "lang is empty" : "no <html> element");

  const ids = new Map();
  const headings = [];
  let inspected = 0;

  for (const m of clean.matchAll(TAG)) {
    inspected++;
    const tag = m[1].toLowerCase();
    const attrs = attrsOf(m[2]);
    if (tag === "img") {
      if (!attrs.has("alt")) push("img-missing-alt", m[0].slice(0, 120));
    }
    if (attrs.has("id")) {
      const id = attrs.get("id");
      ids.set(id, (ids.get(id) ?? 0) + 1);
    }
    if (/^h[1-6]$/.test(tag)) headings.push(Number(tag[1]));
  }

  for (const [id, count] of ids) {
    if (count > 1) push("duplicate-id", `#${id} appears ${count} times`);
  }

  let previous = 0;
  let reported = false;
  for (const level of headings) {
    if (previous && level > previous + 1 && !reported) {
      reported = true;
      push("heading-level-skip", `h${previous} -> h${level}`);
    }
    previous = level;
  }

  return { inspected, redirect: isRedirect };
}

function readBaseline() {
  if (!existsSync(BASELINE_PATH)) return {};
  try {
    return JSON.parse(readFileSync(BASELINE_PATH, "utf8"));
  } catch (err) {
    console.error(`A11Y-FAIL ${rel(BASELINE_PATH)}: invalid JSON — ${err.message}`);
    process.exit(1);
  }
}

const baseline = readBaseline();
const measured = {};
const unmeasurable = [];
const overBudget = [];
let docsTotal = 0;
let inspectedTotal = 0;
const baselineSites = new Set();

for (const target of targets) {
  const eq = target.indexOf("=");
  const dist = resolve(eq === -1 ? target : target.slice(eq + 1));
  const site = eq === -1 ? basename(dirname(dist)) : target.slice(0, eq);
  baselineSites.add(site);

  if (!existsSync(dist) || !statSync(dist).isDirectory()) {
    console.error(`A11Y-FAIL ${site}: dist directory does not exist (${rel(dist)})`);
    unmeasurable.push(site);
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

  const violations = [];
  let inspected = 0;
  let redirects = 0;
  for (const file of htmlFiles) {
    const result = inspectDocument(readFileSync(file, "utf8"), file, violations);
    inspected += result.inspected;
    if (result.redirect) redirects++;
  }

  const counts = {};
  for (const rule of RULES) counts[rule] = 0;
  for (const [rule] of violations) counts[rule]++;
  measured[site] = counts;
  docsTotal += htmlFiles.length;
  inspectedTotal += inspected;

  const budget = baseline[site] ?? {};
  const over = RULES.filter((rule) => (counts[rule] ?? 0) > (budget[rule] ?? 0));
  const loose = RULES.filter((rule) => (counts[rule] ?? 0) < (budget[rule] ?? 0));

  console.log(
    `${site}: html=${htmlFiles.length} redirects=${redirects} elements=${inspected} ` +
      RULES.map((rule) => `${rule}=${counts[rule]}/${budget[rule] ?? 0}`).join(" "),
  );

  if (htmlFiles.length === 0) {
    console.error(`A11Y-FAIL ${site}: no HTML in dist — build output is empty`);
    unmeasurable.push(site);
    continue;
  }
  if (inspected === 0) {
    console.error(`A11Y-FAIL ${site}: inspected no elements — checker did nothing`);
    unmeasurable.push(site);
    continue;
  }

  for (const rule of over) {
    const shown = violations.filter(([r]) => r === rule);
    console.log(`  OVER BUDGET ${rule}: ${shown.length - (budget[rule] ?? 0)} above baseline`);
    for (const [, detail] of shown.slice(0, 20)) console.log(`    ${detail}`);
    if (shown.length > 20) console.log(`    ... and ${shown.length - 20} more`);
  }

  if (over.length === 0 && loose.length === 0) {
    console.log(`  A11Y-BASELINE ok`);
  } else {
    if (over.length) {
      console.error(
        `A11Y-FAIL ${site}: ${over.map((r) => `${r} ${counts[r]}>${budget[r] ?? 0}`).join(", ")}`,
      );
    }
    if (loose.length) {
      console.error(
        `A11Y-FAIL ${site}: baseline is loose for ${loose
          .map((r) => `${r} ${counts[r]}<${budget[r]}`)
          .join(", ")} — run: node scripts/check-a11y.mjs --update-baseline <site>=<dist>`,
      );
    }
    overBudget.push(site);
  }
}

// Per-site integrity of the ledger is checked at repo level by scripts/check-static.mjs (it can
// see every site under sites/, which a single matrix job cannot): a baseline entry for a site
// that no longer exists is caught there, not here.
if (docsTotal === 0) {
  console.error("A11Y-FAIL no HTML documents checked — checker did nothing");
  unmeasurable.push("<all sites: no documents>");
} else if (inspectedTotal === 0) {
  console.error("A11Y-FAIL no elements inspected — checker did nothing");
  unmeasurable.push("<all sites: no elements>");
}

if (updateBaseline) {
  // Refuse only when a site could not be measured at all: a partial write silently drops a
  // site's budget and turns the gate off for it. Budgets that are simply over are the normal
  // way a new rule gets seeded, so they are allowed here.
  if (unmeasurable.length) {
    console.error(
      `A11Y-FAIL refusing to update baseline: ${unmeasurable.length} site(s) could not be measured`,
    );
    process.exit(1);
  }
  const merged = { ...baseline, ...measured };
  writeFileSync(BASELINE_PATH, `${JSON.stringify(merged, null, 2)}\n`);
  console.log(`A11Y-BASELINE updated ${rel(BASELINE_PATH)} for ${Object.keys(measured).join(", ")}`);
  process.exit(0);
}

if (unmeasurable.length || overBudget.length) {
  console.error(
    `A11Y-FAIL ${overBudget.length} site(s) over budget, ${unmeasurable.length} unmeasurable`,
  );
  process.exit(1);
}

console.log(`A11Y-OK sites=${targets.length} html=${docsTotal} elements=${inspectedTotal}`);
