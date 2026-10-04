// Falsifier for t_f7531cb5 (--dry-run for the perf ledger).
//
// WHY THIS EXISTS. The fix before it, t_96d48a14, shipped a test that could not tell a working
// guard from a broken one: it asserted the EXIT CODE, which a check that exits 1 after doing the
// damage also satisfies. A new test proves nothing until it has been shown to FAIL against the
// defect it claims to pin.
//
// METHOD — this is mutation testing, not a restatement of the tests. Each case writes a MUTANT of
// the checker into a temp directory next to a COPY of the shipped test file and the shipped
// ledger, so `node --test` resolves the suite's own `join(HERE, "check-perf.mjs")` to the mutant
// and runs the REAL suite against it. A mutant is CONFIRMED only when the shipped suite refuses
// it. Copying rather than mutating in place is what keeps one case from damaging the tree the
// next case reads, and it means the repository's files are never the thing under test.
//
// Run: node --test scripts/_falsify-dryrun.mjs
//   (this file IS a node:test file; the SUITE it drives is spawned as a plain `node <file>`, because
//    node refuses to run its test runner recursively inside a test file)
import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, copyFileSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const HERE = dirname(fileURLToPath(import.meta.url));
const CHECKER = join(HERE, "check-perf.mjs");
const SUITE = join(HERE, "check-perf.test.mjs");
const LEDGER = join(HERE, "perf-baseline.json");
const scratch = () => mkdtempSync(join(tmpdir(), "falsify-dryrun-"));

// A sandbox holding the mutant checker, the shipped test file, and the shipped ledger.
function sandbox(replacements) {
  const dir = scratch();
  let source = readFileSync(CHECKER, "utf8");
  for (const [from, to] of replacements) {
    if (!source.includes(from)) throw new Error(`anchor moved, update this mutant: ${from.slice(0, 80)}`);
    source = source.replace(from, to);
  }
  writeFileSync(join(dir, "check-perf.mjs"), source);
  // A mutant that does not PARSE is not a mutant. It makes the suite red for a reason that has
  // nothing to do with the property under test, so a case built on one would "confirm" a defect
  // that does not exist — which is worse than no case, because it reads as evidence. Two rounds
  // were lost to exactly this before the check existed.
  const parsed = spawnSync(process.execPath, ["--check", join(dir, "check-perf.mjs")], {
    encoding: "utf8",
  });
  assert.equal(
    parsed.status,
    0,
    `the mutant does not parse — it is a syntax error, not a mutant:\n${parsed.stderr.split("\n").slice(0, 6).join("\n")}`,
  );
  copyFileSync(SUITE, join(dir, "check-perf.test.mjs"));
  copyFileSync(LEDGER, join(dir, "perf-baseline.json"));
  return dir;
}

// Run the SHIPPED suite against a sandbox and collect the names of the tests that refused.
//
// NOT `node --test`. That was the first cut and it confirmed all nine mutants in 90ms each,
// because node refuses to run the test runner recursively inside a test file: it prints
// "run() is being called recursively within a test file. skipping running files." and exits 0.
// Every mutant "passed" vacuously.
//
// NOT bare `node <file>` either. That runs the suite for real (44/44 green on the control) but the
// reporter is V8-serialized VCDIFF, not text, so every regex below matched nothing and the
// harness reported "ran 0 tests" on a suite that had just run in full.
//
// AND NODE_TEST_CONTEXT MUST GO. The test runner exports it to every child, so a spawned
// `node --test` sees it and prints "run() is being called recursively within a test file.
// skipping running files.", exits 0, and skips the file. That is the first false pass this harness
// produced. Deleting it from the child env is what lets the runner actually execute.
function suiteAgainst(dir) {
  const env = { ...process.env };
  delete env.NODE_TEST_CONTEXT;
  const r = spawnSync(
    process.execPath,
    ["--test", "--test-reporter=tap", "check-perf.test.mjs"],
    { encoding: "utf8", cwd: dir, env },
  );
  const out = `${r.stdout}${r.stderr}`;
  const failed = [...out.matchAll(/^not ok \d+ - (.+)$/gm)].map((m) => m[1].trim());
  const ran = Number((out.match(/^# tests (\d+)$/m) ?? [])[1] ?? 0);
  return { status: r.status, failed, ran, out };
}

// A mutant is CONFIRMED when the suite shipping with the fix refuses it, and — where the case
// knows — that a test ABOUT THAT PROPERTY is among the ones that failed.
function assertCaught(replacements, expectFailing) {
  const dir = sandbox(replacements);
  const { status, failed, ran, out } = suiteAgainst(dir);
  // The suite must have RUN, not merely exited 1: a runner that skips the file also exits 0, and a
  // sandbox that failed to resolve the checker would exit 1 with nothing executed. Both look like a
  // caught mutant.
  assert.ok(ran >= 40, `the suite ran only ${ran} tests in the sandbox — it did not really run:\n${out.slice(-3000)}`);
  assert.equal(
    status,
    1,
    `the shipped suite ${status === 0 ? "PASSED" : "errored"} against this mutant — the new tests do not ` +
      `pin the property:\n${out.slice(-4000)}`,
  );
  assert.ok(failed.length > 0, `no named failure against this mutant:\n${out.slice(-4000)}`);
  if (expectFailing) {
    assert.ok(
      failed.some((name) => expectFailing.some((frag) => name.includes(frag))),
      `caught, but not by a test about ${expectFailing.join("/")}; caught by: ${failed.join(" | ")}`,
    );
  }
  return failed;
}

// A deterministic fixture dist, so a case can drive the checker directly without the suite's
// scratch plumbing. xorshift32, same generator the shipped suite uses.
function fixtureDist() {
  const root = join(scratch(), "dist");
  mkdirSync(join(root, "assets"), { recursive: true });
  const rnd = (n) => {
    const b = Buffer.allocUnsafe(n);
    let seed = (n >>> 0) || 7;
    for (let i = 0; i + 4 <= n; i += 4) {
      seed ^= seed << 13; seed >>>= 0;
      seed ^= seed >>> 17;
      seed ^= seed << 5; seed >>>= 0;
      b.writeUInt32LE(seed >>> 0, i);
    }
    return b;
  };
  writeFileSync(join(root, "assets", "app.js"), rnd(4000));
  writeFileSync(join(root, "assets", "site.css"), rnd(2000));
  writeFileSync(join(root, "assets", "hero.png"), rnd(500));
  writeFileSync(
    join(root, "index.html"),
    `<!doctype html><html lang="en"><head><title>t</title>` +
      `<link rel="stylesheet" href="/assets/site.css">` +
      `<script type="module" src="/assets/app.js"></script></head>` +
      `<body><h1>T</h1><img src="/assets/hero.png" alt="H"></body></html>`,
  );
  return root;
}

function drive(dir, args, ledgerBytes = "{}") {
  const ledger = join(scratch(), "ledger.json");
  writeFileSync(ledger, ledgerBytes);
  const before = readFileSync(ledger, "utf8");
  const r = spawnSync(process.execPath, [join(dir, "check-perf.mjs"), ...args, `site=${fixtureDist()}`], {
    encoding: "utf8",
    env: { ...process.env, PERF_BASELINE: ledger },
  });
  return { status: r.status, out: `${r.stdout}${r.stderr}`, before, after: readFileSync(ledger, "utf8") };
}

test("control: the unmutated checker passes the shipped suite", () => {
  // The falsifier's own falsifier, and the case that caught the recursive-runner fault described
  // above. It asserts the suite is green AND that it ran every test, because "green" is also what a
  // runner that executed nothing reports.
  const { status, failed, ran, out } = suiteAgainst(sandbox([]));
  assert.ok(ran >= 44, `the control suite ran only ${ran} tests:\n${out.slice(-3000)}`);
  assert.equal(status, 0, `the shipped suite fails on the UNMUTATED checker:\n${out.slice(-4000)}`);
  assert.deepEqual(failed, []);
});

// 1. The preview WRITES. Not "the flag stops being read" — that only removes the output. This is
//    the actual hazard: the operator runs a preview and the ledger changes underneath them, which
//    is the blind write --dry-run exists to prevent. Driven as a real write on the preview path,
//    because a mutant that merely stops printing would be caught by the output assertion instead
//    and would never exercise the write.
test("mutant: --dry-run writes the ledger anyway", () => {
  assertCaught(
    [
      [
        "  if (dryRun) {\n    for (const metric of METRICS) {",
        "  if (dryRun) {\n    writeFileSync(BASELINE_PATH, " +
          "`${JSON.stringify({ ...baseline, ...measured }, null, 2)}\\n`);\n    " +
          "for (const metric of METRICS) {",
      ],
    ],
    ["dry-run"],
  );
});

// 1b. The flag is parsed and then ignored, so the preview never prints. Distinct from #1 and still
//     worth pinning: it is the shape of a flag added to the usage string and nowhere else.
test("mutant: --dry-run is parsed but never consulted", () => {
  assertCaught(
    [['const dryRun = args.includes("--dry-run");', "const dryRun = false;"]],
    ["dry-run"],
  );
});

// 2. The flag parses, the write correctly does not happen, but no preview is printed: a stub that
//    satisfies a usage string and nothing else.
test("mutant: --dry-run prints no preview", () => {
  assertCaught([["if (dryRun) {", "if (false) {"]], ["dry-run"]);
});

// 3. The preview is narrowed to the FAILING metrics. It still prints, still writes nothing, still
//    exits with the gate's verdict — so it looks correct — while being redundant with the verdict
//    the checker already printed. This is the specific hole --dry-run exists to close.
test("mutant: the preview omits the metrics that are within budget", () => {
  assertCaught(
    [
      [
        "    for (const metric of METRICS) {\n      const value = counts[metric];",
        "    for (const metric of [...over, ...loose]) {\n      const value = counts[metric];",
      ],
    ],
    ["dry-run"],
  );
});

// 4. The preview is softened: a site over budget exits 0 under --dry-run. Indistinguishable from
//    correct at the call site, and it makes the flag useless as the pre-commit check DONE WHEN
//    requires.
test("mutant: --dry-run exits 0 where the real gate exits 1", () => {
  assertCaught(
    [
      [
        "if (unmeasurable.length || overBudget.length || looseBudget.length) {",
        "if (unmeasurable.length || (dryRun ? false : overBudget.length) || looseBudget.length) {",
      ],
    ],
    ["dry-run"],
  );
});

// 5. Composing the flags weakens the merge guard from #62: --dry-run --update-baseline drops the
//    sites the command line did not name. Proves the composition test is not riding on #62's guard
//    alone.
test("mutant: --dry-run --update-baseline drops a carried-over site", () => {
  assertCaught([["const merged = { ...baseline };", "const merged = {};"]], ["dry-run"]);
});

// 6. The write lands correctly but the log goes back to being unable to say what moved — the
//    "updated ... for <site>" wording that cannot distinguish a one-byte move from an
//    inflationary re-seed.
test("mutant: the update log never names what moved", () => {
  assertCaught(
    [['(moved.length ? `; moved ${moved.join(", ")}` : "; no metric moved"),', '"",']], ["moved"],
  );
});

// 7. A no-op write reports motion instead. A log that cries wolf is as useless as one that stays
//    silent, so both directions are pinned — and this is the direction an operator would notice
//    last, which is exactly why it needs a test.
  // The mirror of #6, and the direction an operator would notice LAST: a re-seed that changed
  // nothing still reports "moved site", which trains a reader to distrust the word and so ignores
  // the genuine case too.
  //
  // The mutation must swallow the PRECEDING line as well. The original is the tail of a `+` chain:
//
//   (kept.length ? ` (${kept.length} carried over)` : "") +
//     (moved.length ? `; moved ...` : "; no metric moved"),
//   );
//
// Replacing only the ternary leaves the earlier `+` with nothing to add, and `node --check` fails
// with "Unexpected token ')'". A parse error is not a mutant: the suite goes red for the wrong
// reason, so the case would "confirm" a defect that does not exist. Two rounds of this were lost
// to exactly that, which is why sandbox() now syntax-checks every mutant before running anything.
test("mutant: a no-op update claims metrics moved", () => {
  assertCaught(
    [
      [
        '(kept.length ? ` (${kept.length} carried over)` : "") +\n' +
          '      (moved.length ? `; moved ${moved.join(", ")}` : "; no metric moved"),',
        '(kept.length ? ` (${kept.length} carried over)` : "") +\n' +
          "      `; moved ${Object.keys(measured).join(\", \")}`,",
      ],
    ],
    ["moved"],
  );
});

// 8. The preview writes the ledger ONLY on the unseeded path — the site-with-no-budget case,
//    which is exactly where an operator previews before creating a budget for the first time. Every
//    dry-run test in the shipped suite runs against a ledger that already HAS the site, so this is
//    the gap the suite structurally cannot cover, and it is driven directly for that reason.
//
//    Both halves are asserted: the mutant must change the file, and the real checker must not. A
//    mutant that changed nothing would "fail" the first half and prove nothing.
test("mutant: --dry-run seeds a site that has no budget entry", () => {
  // The right mutation for this path: make the preview block WRITE on the unseeded case. A site
  // with no ledger entry is MEASURABLE, so it reaches the preview block — which is exactly why
  // every dry-run test in the shipped suite (all of which run against a ledger that already has the
  // site) cannot see this path, and why it is driven directly.
  const mutantDir = sandbox([
    [
      "      if (typeof cap !== \"number\") {\n        console.log(`  PREVIEW ${metric}: ${value} measured, no budget (would seed ${value})`);\n        continue;\n      }",
      "      if (typeof cap !== \"number\") {\n        writeFileSync(BASELINE_PATH, " +
        "`${JSON.stringify({ ...baseline, [site]: Object.fromEntries(METRICS.map((m) => [m, counts[m]])) }, null, 2)}\\n`);\n        " +
        "console.log(`  PREVIEW ${metric}: ${value} measured, no budget (would seed ${value})`);\n        continue;\n      }",
    ],
  ]);
  const soft = drive(mutantDir, ["--dry-run"]);
  assert.notEqual(soft.after, soft.before, `the mutant changed nothing, so this case proves nothing:\n${soft.out}`);
  assert.match(soft.after, /site/, "the mutant did not write a site budget");

  // The REAL checker, same input: a failing preview must still write nothing.
  const real = drive(sandbox([]), ["--dry-run"]);
  assert.equal(real.after, real.before, `the real checker wrote an unseeded preview:\n${real.out}`);
  assert.equal(real.status, 1, real.out);
  assert.match(real.out, /dry run: nothing written/, real.out);
});

// 9. The preview must not fabricate a verdict it cannot support: a site the run could not measure
//    AT ALL must stay a failure under --dry-run, not be reported as "nothing written, all fine".
//    This is the vacuity direction — the one this repo cares about most, since a checker that exits
//    0 while checking nothing is treated here as worse than no checker.
test("mutant: --dry-run reports an unmeasurable site as OK", () => {
  const missingDist = join(scratch(), "no-such-dist");
  const absentLedger = join(scratch(), "absent.json"); // never created

  // The mutant drops `unmeasurable` from the verdict when --dry-run is set. Assert it does.
  const mutantDir = sandbox([
    [
      "if (unmeasurable.length || overBudget.length || looseBudget.length) {",
      "if ((dryRun ? 0 : unmeasurable.length) || overBudget.length || looseBudget.length) {",
    ],
  ]);
  const mutant = spawnSync(
    process.execPath,
    [join(mutantDir, "check-perf.mjs"), "--dry-run", `site=${missingDist}`],
    { encoding: "utf8", env: { ...process.env, PERF_BASELINE: absentLedger } },
  );
  const mutantOut = `${mutant.stdout}${mutant.stderr}`;
  assert.equal(
    mutant.status,
    0,
    `the mutant did not actually swallow the failure, so this case proves nothing:\n${mutantOut}`,
  );
  assert.match(mutantOut, /PERF-OK/, mutantOut);

  // The REAL checker, same input: an unmeasurable site is a failure, preview or not.
  const real = spawnSync(
    process.execPath,
    [join(sandbox([]), "check-perf.mjs"), "--dry-run", `site=${missingDist}`],
    { encoding: "utf8", env: { ...process.env, PERF_BASELINE: absentLedger } },
  );
  const realOut = `${real.stdout}${real.stderr}`;
  assert.equal(real.status, 1, realOut);
  assert.match(realOut, /dist directory does not exist/, realOut);
  assert.match(realOut, /dry run: nothing written/, realOut);
  assert.ok(!existsSync(absentLedger), "the failed preview created the ledger it was pointed at");
});