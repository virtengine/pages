// Regression suite for scripts/check-branch-bypass.mjs.
// Every case runs the REAL checker against a synthetic git repo built in a temp dir,
// with BRANCH_PROD/BRANCH_REVIEWED pointing at refs the test controls. Nothing is
// stubbed: if the checker stops detecting a bypass, these fail.
import { execFileSync } from "node:child_process";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import assert from "node:assert/strict";

const HERE = dirname(fileURLToPath(import.meta.url));
// The checker sits beside this suite in scripts/, so resolve it by NAME in this
// directory. Resolving via join(HERE, "..") would be right if the suite lived one
// level up, and produced a silently unrunnable suite when it did not.
const CHECKER = join(HERE, "check-branch-bypass.mjs");

function git(cwd, args) {
  return execFileSync("git", args, { cwd, encoding: "utf8" });
}

// A synthetic repo with an unrelated `main` history is NOT what we want: we need
// main and develop to share a root so merge-base resolves.
function makeRepo() {
  const dir = mkdtempSync(join(tmpdir(), "bypass-"));
  git(dir, ["init", "-q", "-b", "main"]);
  git(dir, ["config", "user.email", "t@example.com"]);
  git(dir, ["config", "user.name", "Test"]);
  writeFileSync(join(dir, "root.txt"), "root\n");
  git(dir, ["add", "-A"]);
  git(dir, ["commit", "-q", "-m", "root"]);
  git(dir, ["branch", "develop"]);
  return dir;
}

function runChecker(dir, env = {}) {
  try {
    const out = execFileSync(process.execPath, [CHECKER], {
      cwd: dir,
      encoding: "utf8",
      env: { ...process.env, BRANCH_PROD: "main", BRANCH_REVIEWED: "develop", ...env },
      stdio: ["ignore", "pipe", "pipe"],
    });
    return { code: 0, stdout: out, stderr: "" };
  } catch (err) {
    return { code: err.status ?? 1, stdout: err.stdout ?? "", stderr: err.stderr ?? "" };
  }
}

function commitOn(dir, branch, file, content, message) {
  git(dir, ["checkout", "-q", branch]);
  writeFileSync(join(dir, file), content);
  git(dir, ["add", "-A"]);
  git(dir, ["commit", "-q", "-m", message]);
  git(dir, ["checkout", "-q", "main"]);
}

test("clean repo: main == develop, passes and PROVES it looked", (t) => {
  const dir = makeRepo();
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  const r = runChecker(dir);
  assert.equal(r.code, 0, `expected pass, got ${r.code}: ${r.stderr}`);
  assert.match(r.stdout, /BYPASS-OK/);
  // Anti-vacuity: a pass must report what it compared, or it is indistinguishable
  // from a checker that resolved nothing.
  assert.match(r.stdout, /merge-base=/);
  assert.match(r.stdout, /unjudged=0/);
});

test("legitimate develop->main MERGE does not fail (the common false positive)", (t) => {
  const dir = makeRepo();
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  commitOn(dir, "develop", "a.txt", "a\n", "work on develop");
  git(dir, ["checkout", "-q", "main"]);
  git(dir, ["merge", "-q", "--no-ff", "develop", "-m", "Merge pull request #1 from develop"]);
  const r = runChecker(dir);
  assert.equal(r.code, 0, `a healthy merge must pass, got ${r.code}: ${r.stderr}`);
  assert.match(r.stdout, /BYPASS-OK/);
  // The merge commit IS in the rev-list set, so the checker must have seen it and
  // correctly classified it as a merge.
  assert.match(r.stdout, /merges=[1-9]/);
});

test("a non-merge commit pushed straight to main FAILS (the real defect)", (t) => {
  const dir = makeRepo();
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  commitOn(dir, "main", "sneaked.txt", "2.5MB of webp\n", "Media Update");
  const r = runChecker(dir);
  assert.equal(r.code, 1, `expected failure, got ${r.code}`);
  assert.match(r.stderr, /BYPASS-FAIL/);
  assert.match(r.stderr, /sneaked\.txt|Media Update/);
  assert.match(r.stderr, /UNJUDGED/);
});

test("a bypass commit FOLLOWED by a healthy merge is still caught", (t) => {
  // This is exactly the 92fc1c5 shape: bypass first, then develop->main merges stack on
  // top. A checker that only looked at the tip would call this healthy.
  const dir = makeRepo();
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  commitOn(dir, "main", "media.bin", "weight\n", "Media Update");
  commitOn(dir, "develop", "b.txt", "b\n", "work on develop");
  git(dir, ["checkout", "-q", "main"]);
  git(dir, ["merge", "-q", "--no-ff", "develop", "-m", "Merge pull request #2 from develop"]);
  const r = runChecker(dir);
  assert.equal(r.code, 1, `expected failure, got ${r.code}`);
  assert.match(r.stderr, /BYPASS-FAIL/);
  assert.match(r.stderr, /Media Update/);
});

test("a missing ref FAILS instead of reading as clean", (t) => {
  const dir = makeRepo();
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  const r = runChecker(dir, { BRANCH_REVIEWED: "origin/does-not-exist" });
  assert.equal(r.code, 1, `a missing ref must not pass, got ${r.code}`);
  assert.match(r.stderr, /BYPASS-FAIL/);
  assert.match(r.stderr, /cannot resolve/);
});

test("SKIP_BYPASS_GUARD=1 exits 0 but says loudly that it did not run", (t) => {
  const dir = makeRepo();
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  commitOn(dir, "main", "sneaked.txt", "x\n", "Media Update");
  const r = runChecker(dir, { SKIP_BYPASS_GUARD: "1" });
  assert.equal(r.code, 0);
  assert.match(r.stdout, /BYPASS-SKIPPED/);
  // The escape hatch must still name the unjudged commit, so it is auditable.
  assert.match(r.stdout, /UNJUDGED/);
});

test("unrelated histories fail rather than silently comparing nothing", (t) => {
  const dir = mkdtempSync(join(tmpdir(), "bypass-unrelated-"));
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  git(dir, ["init", "-q", "-b", "main"]);
  git(dir, ["config", "user.email", "t@example.com"]);
  git(dir, ["config", "user.name", "Test"]);
  writeFileSync(join(dir, "main.txt"), "main\n");
  git(dir, ["add", "-A"]);
  git(dir, ["commit", "-q", "-m", "main root"]);
  git(dir, ["checkout", "-q", "--orphan", "develop"]);
  git(dir, ["rm", "-rq", "--cached", "."]);
  rmSync(join(dir, "main.txt"), { force: true });
  writeFileSync(join(dir, "dev.txt"), "dev\n");
  git(dir, ["add", "-A"]);
  git(dir, ["commit", "-q", "-m", "develop root"]);
  const r = runChecker(dir);
  assert.equal(r.code, 1, `expected failure, got ${r.code}`);
  assert.match(r.stderr, /no common ancestor/);
});

// --- the accepted-bypass ledger ---
// The most important property: a ledger entry suppresses ITS OWN sha and nothing else.
// A ledger that silenced every bypass would be strictly worse than no guard at all, so
// this case is what keeps the mechanism honest.

function ledgerFile(dir, contents) {
  const p = join(dir, "ledger.json");
  writeFileSync(p, JSON.stringify(contents, null, 2));
  return p;
}

test("an accepted sha passes and is PRINTED every run; a new bypass still fails", (t) => {
  const dir = makeRepo();
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  commitOn(dir, "main", "media.bin", "2.5MB\n", "Media Update");
  const sha = git(dir, ["rev-parse", "--short", "HEAD"]).trim();
  const ledger = ledgerFile(dir, {
    accepted: [{ sha, reason: "live marketplace imagery, reviewed in writing", accepted_by: "test" }],
  });

  // With the sha accepted, the same tree that just failed now passes — and says so.
  const ok = runChecker(dir, { BYPASS_LEDGER: ledger });
  assert.equal(ok.code, 0, `accepted sha must pass, got ${ok.code}: ${ok.stderr}`);
  assert.match(ok.stdout, /ACCEPTED/);
  assert.match(ok.stdout, /BYPASS-OK/);
  assert.match(ok.stdout, /accepted=1 unjudged=0/);

  // A DIFFERENT bypass, with the same ledger in force, must still fail. This is the
  // property that stops the ledger from becoming a place new problems go to hide.
  commitOn(dir, "main", "later.bin", "more weight\n", "a later sneaky bypass");
  const bad = runChecker(dir, { BYPASS_LEDGER: ledger });
  assert.equal(bad.code, 1, `a NEW bypass must fail even with a populated ledger, got ${bad.code}`);
  assert.match(bad.stderr, /BYPASS-FAIL/);
  assert.match(bad.stderr, /a later sneaky bypass/);
  assert.doesNotMatch(bad.stderr, /UNJUDGED.*Media Update/);
});

test("a ledger entry with no reason is rejected: no silent pardons", (t) => {
  const dir = makeRepo();
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  const ledger = ledgerFile(dir, { accepted: [{ sha: "deadbee", reason: "x" }] });
  const r = runChecker(dir, { BYPASS_LEDGER: ledger });
  assert.equal(r.code, 1, `expected failure, got ${r.code}`);
  assert.match(r.stderr, /no stated reason/);
});

// A shallow clone is the real-world way this guard gets run against history it cannot
// compare: `git clone --depth=1` plus a `--depth=1` fetch of each branch leaves both tips
// parentless, so merge-base finds nothing. That happened to this script's own first CI
// run (run 36827242376), which failed with "unrelated histories". The guard refusing is
// correct — the WORKFLOW step that caused it was the bug — so this case pins that a
// shallow history fails loudly instead of reading as "no bypasses found".
test("a shallow history fails loudly rather than reporting zero bypasses", (t) => {
  const dir = makeRepo();
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  // Rewrite main and develop as single parentless commits, which is exactly what a
  // --depth=1 fetch produces as far as merge-base is concerned.
  const mainTip = git(dir, ["rev-parse", "main"]).trim();
  const devTip = git(dir, ["rev-parse", "develop"]).trim();
  git(dir, ["checkout", "-q", "--orphan", "shallow-main"]);
  git(dir, ["rm", "-rq", "--cached", "."]);
  writeFileSync(join(dir, "m.txt"), "m\n");
  git(dir, ["add", "-A"]);
  git(dir, ["commit", "-q", "-m", "shallow main tip"]);
  git(dir, ["branch", "-f", "main", "HEAD"]);
  git(dir, ["checkout", "-q", "--orphan", "shallow-develop"]);
  git(dir, ["rm", "-rq", "--cached", "."]);
  writeFileSync(join(dir, "d.txt"), "d\n");
  git(dir, ["add", "-A"]);
  git(dir, ["commit", "-q", "-m", "shallow develop tip"]);
  git(dir, ["branch", "-f", "develop", "HEAD"]);
  void mainTip;
  void devTip;
  const r = runChecker(dir);
  assert.equal(r.code, 1, `expected failure, got ${r.code}`);
  assert.match(r.stderr, /no common ancestor/);
  // And it must NOT claim to have found zero bypasses.
  assert.doesNotMatch(`${r.stdout}${r.stderr}`, /unjudged=0/);
});

// --- patch equivalence: topology vs content ---
//
// Measured on origin/develop 4390413 (2026-10-06). `git cherry -v origin/develop
// origin/main` printed `- 6cbafae` — the same patch-id (80de108f) as develop's tip —
// yet the topology-only guard still named 6cbafae UNJUDGED, keeping the develop->main
// gate red on every pull_request including unrelated ones. Because this repo merges with
// --squash, no forward-port can ever satisfy an ancestry test, so that red was permanent.
//
// These cases pin the fix in BOTH directions. The first says a patch-equivalent commit
// passes; the rest are the guards against that becoming a loophole.

test("a commit whose patch IS already on the reviewed branch passes and is PRINTED", (t) => {
  // The 6cbafae shape: a commit reached main, and its content later landed on develop
  // under a different sha (here via a squash-style forward-port on develop).
  const dir = makeRepo();
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  // Step 1 on develop must be the IDENTICAL patch (probe-verified: same patch-id on both
  // sides), and step 2 moves develop PAST it — so develop cannot become an ancestor of
  // main by topology and only patch equivalence can clear the commit. That is the real
  // post-squash shape.
  const steps = [
    ["main", "Header\n", "homepage polish (#64)"],
    ["develop", "Header\n", "forward-port of #64"],  // identical patch
    ["develop", "Header polished\n", "later work on develop"],
  ];
  for (const [branch, content, message] of steps) {
    git(dir, ["checkout", "-q", branch]);
    writeFileSync(join(dir, "site.txt"), content);
    git(dir, ["add", "-A"]);
    git(dir, ["commit", "-q", "-m", message]);
  }
  git(dir, ["checkout", "-q", "main"]);

  const r = runChecker(dir);
  assert.equal(r.code, 0, `patch-equivalent content must pass, got ${r.code}: ${r.stderr}`);
  assert.match(r.stdout, /JUDGED-BY-PATCH/);
  assert.match(r.stdout, /homepage polish/);
  // The exclusion must be visible AND counted, so a silently-empty pass stays impossible.
  assert.match(r.stdout, /accepted=0 unjudged=0 judged-by-patch=1/);
  assert.match(r.stdout, /BYPASS-OK/);
});

test("a SPLIT commit still FAILS even though most of its content is on develop", (t) => {
  // The 3bc740a shape, and the case that keeps patch equivalence honest: a commit whose
  // site-file half was forward-ported while its GATE and BASELINE edits were held back.
  // Patch-id equality is a whole-patch comparison, so this must stay `+` and stay red —
  // a partial content match must never buy a pass.
  const dir = makeRepo();
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  // main's commit carries the site restyle AND the perf-baseline edit; develop carries
  // ONLY the site restyle. Patch-id is a whole-patch comparison, so the halves differ
  // and the commit must stay a bypass — this is exactly 3bc740a.
  git(dir, ["checkout", "-q", "main"]);
  writeFileSync(join(dir, "site.txt"), "restyled\n");
  writeFileSync(join(dir, "baseline.json"), '{"total-gzip": 892122}\n');
  git(dir, ["add", "-A"]);
  git(dir, ["commit", "-q", "-m", "det.io typography polish (#65)"]);
  git(dir, ["checkout", "-q", "develop"]);
  writeFileSync(join(dir, "site.txt"), "restyled\n");
  git(dir, ["add", "-A"]);
  git(dir, ["commit", "-q", "-m", "forward-port of #65 (site files only)"]);
  git(dir, ["checkout", "-q", "main"]);

  const r = runChecker(dir);
  assert.equal(r.code, 1, `a split commit must still fail, got ${r.code}`);
  assert.match(r.stderr, /BYPASS-FAIL/);
  assert.match(r.stderr, /det\.io typography polish/);
  assert.doesNotMatch(`${r.stdout}${r.stderr}`, /JUDGED-BY-PATCH/);
});

test("patch equivalence does not rescue a DIFFERENT change that is not on develop", (t) => {
  // A commit on develop that merely touches the same filename is not the same change.
  const dir = makeRepo();
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  commitOn(dir, "main", "site.txt", "main's content\n", "media update");
  commitOn(dir, "develop", "site.txt", "develop's different content\n", "unrelated work");
  const r = runChecker(dir);
  assert.equal(r.code, 1, `differing content must fail, got ${r.code}`);
  assert.match(r.stderr, /media update/);
});

test("an existing ledger entry still wins over patch equivalence and keeps its reason", (t) => {
  // Ordering is deliberate: a human's written disposition is reported as ACCEPTED with
  // its reason, not quietly demoted to a mechanical JUDGED-BY-PATCH line.
  const dir = makeRepo();
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  commitOn(dir, "main", "site.txt", "one\n", "Media Update");
  const sha = git(dir, ["rev-parse", "--short", "HEAD"]).trim();
  git(dir, ["checkout", "-q", "develop"]);
  writeFileSync(join(dir, "site.txt"), "one\n");
  git(dir, ["add", "-A"]);
  git(dir, ["commit", "-q", "-m", "forward-port"]);
  git(dir, ["checkout", "-q", "main"]);
  // Written LAST: a ledger file inside the repo gets tracked by `git add -A` on
  // develop and then deleted by the checkout back to main, which reads as a missing
  // ledger. The existing suite never checks out after writing one; this one does.
  const ledger = ledgerFile(dir, {
    accepted: [{ sha, reason: "live marketplace imagery, reviewed in writing", accepted_by: "test" }],
  });

  const r = runChecker(dir, { BYPASS_LEDGER: ledger });
  assert.equal(r.code, 0, `expected pass, got ${r.code}: ${r.stderr}`);
  assert.match(r.stdout, /ACCEPTED/);
  assert.match(r.stdout, /reviewed in writing/);
  // Ledger wins over the mechanical test, so the new counter must read 0 here — if it
  // read 1 the entry would have been demoted to a mechanical exclusion.
  assert.match(r.stdout, /accepted=1 unjudged=0 judged-by-patch=0/);
  assert.doesNotMatch(r.stdout, /JUDGED-BY-PATCH/);
});

test("SKIP_BYPASS_GUARD=1 still names a patch-equivalent commit as judged", (t) => {
  // The escape hatch must not make a judged commit look like a live bypass.
  const dir = makeRepo();
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  commitOn(dir, "main", "site.txt", "a\n", "homepage polish (#64)");
  git(dir, ["checkout", "-q", "develop"]);
  writeFileSync(join(dir, "site.txt"), "a\n");
  git(dir, ["add", "-A"]);
  git(dir, ["commit", "-q", "-m", "forward-port"]);
  git(dir, ["checkout", "-q", "main"]);

  const r = runChecker(dir, { SKIP_BYPASS_GUARD: "1" });
  assert.equal(r.code, 0);
  assert.match(r.stdout, /BYPASS-SKIPPED/);
  assert.doesNotMatch(r.stdout, /UNJUDGED homepage polish/);
});

test("a missing or malformed ledger fails instead of reading as clean", (t) => {
  const dir = makeRepo();
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  const missing = runChecker(dir, { BYPASS_LEDGER: join(dir, "nope.json") });
  assert.equal(missing.code, 1);
  assert.match(missing.stderr, /ledger .* is missing/);

  const bad = join(dir, "bad.json");
  writeFileSync(bad, "{ not json");
  const malformed = runChecker(dir, { BYPASS_LEDGER: bad });
  assert.equal(malformed.code, 1);
  assert.match(malformed.stderr, /invalid JSON/);
});