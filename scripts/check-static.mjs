// Repo-wide static checks for the pages monorepo (build gate tooling).
//
// Usage: node scripts/check-static.mjs
//
// Three things this repo has no other guard for:
//   1. every JS module in the tree parses (node --check),
//   2. every JSON / JSONC config parses (a broken wrangler.jsonc breaks a deploy),
//   3. every site under sites/ still exposes the build gate scripts CI calls.
import { readdirSync, readFileSync, existsSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { spawnSync } from "node:child_process";

const SKIP_DIRS = new Set([
  ".git",
  ".worktrees",
  "node_modules",
  "dist",
  ".astro",
  ".wrangler",
]);

const JS_EXT = new Set([".js", ".mjs", ".cjs"]);
const failures = [];
const counts = { js: 0, json: 0, jsonc: 0, sites: 0 };

function walk(dir, files = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (!SKIP_DIRS.has(entry.name)) walk(join(dir, entry.name), files);
    } else if (entry.isFile()) {
      files.push(join(dir, entry.name));
    }
  }
  return files;
}

// JSONC = JSON with // and /* */ comments and trailing commas.
function parseJsonc(text, file) {
  const stripped = text
    .replace(/"(?:[^"\\]|\\.)*"|(\/\/[^\n]*|\/\*[\s\S]*?\*\/)/g, (m, comment) =>
      comment ? " " : m,
    )
    .replace(/,(\s*[}\]])/g, "$1");
  return JSON.parse(stripped);
}

for (const file of walk(".")) {
  const rel = relative(".", file);
  if (JS_EXT.has(rel.slice(rel.lastIndexOf(".")))) {
    counts.js++;
    const res = spawnSync(process.execPath, ["--check", file], { encoding: "utf8" });
    if (res.status !== 0) {
      failures.push(`${rel}: node --check failed\n${(res.stderr || res.stdout || "").trim()}`);
    }
  } else if (rel.endsWith(".json")) {
    counts.json++;
    try {
      JSON.parse(readFileSync(file, "utf8"));
    } catch (err) {
      failures.push(`${rel}: invalid JSON — ${err.message}`);
    }
  } else if (rel.endsWith(".jsonc")) {
    counts.jsonc++;
    try {
      const parsed = parseJsonc(readFileSync(file, "utf8"), rel);
      // A wrangler config that points at a missing entry point fails at deploy time,
      // not here — so check the one field CI can verify statically.
      if (typeof parsed.main === "string") {
        const entry = join(file, "..", parsed.main);
        if (!existsSync(entry)) {
          failures.push(`${rel}: "main" points at missing file ${parsed.main}`);
        }
      }
    } catch (err) {
      failures.push(`${rel}: invalid JSONC — ${err.message}`);
    }
  }
}

const REQUIRED_SCRIPTS = ["build", "check:links"];
const sitesDir = "sites";
if (!existsSync(sitesDir)) {
  failures.push("sites/: directory is missing");
} else {
  for (const entry of readdirSync(sitesDir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const pkgPath = join(sitesDir, entry.name, "package.json");
    if (!existsSync(pkgPath) || !statSync(pkgPath).isFile()) continue;
    counts.sites++;
    let pkg;
    try {
      pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
    } catch (err) {
      failures.push(`${pkgPath}: invalid JSON — ${err.message}`);
      continue;
    }
    for (const script of REQUIRED_SCRIPTS) {
      if (!pkg.scripts?.[script]) {
        failures.push(`${pkgPath}: missing required script "${script}" — CI's build gate calls it`);
      }
    }
  }
  if (counts.sites === 0) failures.push("sites/: no site package.json found — build gate would be vacuous");
}

for (const failure of failures) console.error(`FAIL ${failure}`);
console.log(
  `checked js=${counts.js} json=${counts.json} jsonc=${counts.jsonc} sites=${counts.sites}; failures=${failures.length}`,
);
if (failures.length) {
  console.error("STATIC-FAIL");
  process.exit(1);
}
console.log("STATIC-OK");
