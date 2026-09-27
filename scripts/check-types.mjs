// Type-check budget for the Astro sites (build gate tooling).
//
// Usage: node scripts/check-types.mjs [--update-baseline]
//        (run from a site directory: sites/<site>)
//
// `astro check` reports real type errors, but the sites carry a known backlog, so gating on
// "zero errors" would either never land or force a blanket suppression sweep. This is a
// ratchet, the same shape as check-a11y.mjs: scripts/types-baseline.json records each site's
// known error count. A site above its budget fails, and a baseline looser than reality also
// fails, so the number can only move down — a fixed count has to be committed with the fix.
//
// A checker that inspects nothing is worse than no checker, so this hard-fails when `astro
// check` did not run, printed no Result block, or inspected zero files, and prints a
// TYPECHECK-OK marker that CI asserts on.
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { join, resolve, basename, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
// TYPES_BASELINE is a test seam only (mirrors A11Y_BASELINE): CI sets nothing and gets the
// committed ledger.
const BASELINE_PATH = process.env.TYPES_BASELINE ?? join(HERE, "types-baseline.json");
const BUILD_MARKER = "TYPECHECK-OK";

const updateBaseline = process.argv.includes("--update-baseline");
const site = basename(resolve(process.cwd()));

// `astro check` lives in the site's own node_modules; run it through node so no shell or
// .cmd shim is involved (this has to work on the Windows agent hosts too).
const astroBin = join(process.cwd(), "node_modules", "astro", "astro.js");
if (!existsSync(astroBin)) {
  console.error(
    `TYPECHECK-FAIL ${site}: astro is not installed (${astroBin}) — run pnpm install first`,
  );
  process.exit(1);
}

const res = spawnSync(process.execPath, [astroBin, "check"], {
  cwd: process.cwd(),
  encoding: "utf8",
});
// eslint-disable-next-line no-control-regex
const strip = (s) => (s ?? "").replace(/\u001b\[[0-9;]*m/g, "");
const output = strip(res.stdout) + strip(res.stderr);

// @astrojs/check prints "Result (N files):" followed by the counts.
const filesMatch = output.match(/^Result \((\d+) files?\):/m);
const errorsMatch = output.match(/^- (\d+) errors?$/m);
const warningsMatch = output.match(/^- (\d+) warnings?$/m);

if (!filesMatch || !errorsMatch) {
  // Surface the tail of the run: this is the "checker did nothing" path.
  console.error(`TYPECHECK-FAIL ${site}: astro check produced no Result block`);
  console.error(output.trim().split("\n").slice(-20).join("\n"));
  process.exit(1);
}

const files = Number(filesMatch[1]);
const errors = Number(errorsMatch[1]);
const warnings = warningsMatch ? Number(warningsMatch[1]) : 0;

if (files === 0) {
  console.error(`TYPECHECK-FAIL ${site}: astro check inspected 0 files — checker did nothing`);
  process.exit(1);
}

// Histogram of error codes (ts(2339) etc.) so the failure output is actionable.
const codes = new Map();
for (const m of output.matchAll(/error ts\((\d+)\)/g)) {
  codes.set(m[1], (codes.get(m[1]) ?? 0) + 1);
}
const top = [...codes.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8);

let baseline = {};
if (existsSync(BASELINE_PATH)) {
  try {
    baseline = JSON.parse(readFileSync(BASELINE_PATH, "utf8"));
  } catch (err) {
    console.error(`TYPECHECK-FAIL ${BASELINE_PATH}: invalid JSON — ${err.message}`);
    process.exit(1);
  }
}
const budget = baseline[site]?.errors ?? 0;

console.log(
  `${site}: files=${files} errors=${errors}/${budget} warnings=${warnings}` +
    (top.length ? ` top=${top.map(([c, n]) => `ts(${c})x${n}`).join(",")}` : ""),
);

if (updateBaseline) {
  const merged = { ...baseline, [site]: { errors } };
  writeFileSync(BASELINE_PATH, `${JSON.stringify(merged, null, 2)}\n`);
  console.log(`TYPECHECK-BASELINE updated ${BASELINE_PATH} ${site}=${errors}`);
  process.exit(0);
}

const over = errors > budget;
const loose = errors < budget;

if (over) {
  console.error(`TYPECHECK-FAIL ${site}: ${errors} type errors, budget ${budget} (+${errors - budget})`);
  const lines = output.split("\n").filter((l) => /- error ts\(/.test(l));
  for (const l of lines.slice(0, 20)) console.error(`    ${l}`);
  if (lines.length > 20) console.error(`    ... and ${lines.length - 20} more`);
}
if (loose) {
  console.error(
    `TYPECHECK-FAIL ${site}: baseline is loose (${errors} < ${budget}) — ` +
      `run: node scripts/check-types.mjs --update-baseline  (from sites/${site})`,
  );
}

if (over || loose) process.exit(1);

console.log(`${BUILD_MARKER} site=${site} files=${files} errors=${errors} budget=${budget}`);
