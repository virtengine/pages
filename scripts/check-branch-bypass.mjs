// Branch-bypass guard: fail when the production branch holds commits that never went
// through the reviewed branch.
//
// WHY THIS EXISTS — a measured incident, not a hypothetical. Commit 92fc1c5 ("Media
// Update", 2026-09-29) was pushed straight to `main`, bypassing `develop`. It added
// 2.55 MB of webp under `sites/virtengine.com/public/media/`, which Astro copies into
// `dist` verbatim. The perf budget only noticed four weeks later, when a develop->main
// merge ran the gate against a tree `develop` had never built:
//
//   run 36791383653  PERF-FAIL virtengine.com: total-gzip 24887557>22339776
//
// Byte-exact attribution (0.086% residue) put the whole overage on that one commit.
// Every gate in this repo was green the entire time it sat on `main`, because every
// gate runs on the tree it is handed — and nobody ran one on this tree until `main`
// needed to accept another merge. A build gate cannot catch a commit that never
// triggers a build.
//
// WHAT IT CHECKS. `git rev-list <prod> --not <reviewed>` lists commits reachable from
// the production branch and not from the reviewed one. Legitimate develop->main merges
// DO produce commits in that set — the merge commit itself is not an ancestor of
// develop — so a raw count is meaningless and would be red on every healthy merge.
// The merge commits are identified structurally, not by message: a commit with more
// than one parent is a merge, and a merge whose second parent is an ancestor of the
// reviewed branch carried that branch's content in. So the real defect is a
// NON-merge commit that `develop` does not contain — someone pushed content straight
// to production and no reviewed build ever judged it.
//
// WHY IT IS A SEPARATE SCRIPT AND NOT A PERF NUMBER. The perf budget answers "is this
// site too heavy"; this answers "did anything reach production unjudged". Widening the
// budget would make the symptom invisible while the bypass stays just as real, and a
// reverted media commit would leave the next bypass equally uncaught.
//
// TEST SEAMS. BRANCH_PROD / BRANCH_REVIEWED override the two refs (the regression suite
// builds a tiny synthetic repo and points them at refs it controls); SKIP_BYPASS_GUARD=1
// is the emergency escape and prints a loud line saying it was used.
import { execFileSync } from "node:child_process";
import { readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const LEDGER_PATH = process.env.BYPASS_LEDGER ?? join(HERE, "bypass-accepted.json");

// The accepted ledger. A bypass that a human reviewed and accepted in writing is not
// re-reported on every run, but it is never forgotten either: every entry is printed,
// and an entry only ever suppresses ITS OWN sha. A new bypass is still a hard failure,
// so the ledger cannot become a place where new problems go to hide.
function readLedger() {
  if (!existsSync(LEDGER_PATH)) {
    console.error(`BYPASS-FAIL accepted-bypass ledger ${LEDGER_PATH} is missing`);
    process.exit(1);
  }
  let parsed;
  try {
    parsed = JSON.parse(readFileSync(LEDGER_PATH, "utf8"));
  } catch (err) {
    console.error(`BYPASS-FAIL ledger is invalid JSON — ${err.message}`);
    process.exit(1);
  }
  if (!Array.isArray(parsed.accepted)) {
    console.error(`BYPASS-FAIL ledger has no "accepted" array`);
    process.exit(1);
  }
  // An entry without a reason is a pardon with no argument, which is the thing this guard
  // exists to prevent, so it is a hard error rather than a warning.
  for (const entry of parsed.accepted) {
    if (!entry.sha || !/^[0-9a-f]{7,40}$/i.test(entry.sha)) {
      console.error(`BYPASS-FAIL ledger entry has no valid sha — ${JSON.stringify(entry)}`);
      process.exit(1);
    }
    if (!entry.reason || String(entry.reason).trim().length < 20) {
      console.error(`BYPASS-FAIL ledger entry ${entry.sha} has no stated reason`);
      process.exit(1);
    }
  }
  return parsed.accepted;
}

const PROD = process.env.BRANCH_PROD ?? "origin/main";
const REVIEWED = process.env.BRANCH_REVIEWED ?? "origin/develop";

function git(args, { allowFail = false } = {}) {
  try {
    return execFileSync("git", args, { encoding: "utf8", maxBuffer: 1 << 26 });
  } catch (err) {
    if (allowFail) return "";
    throw new Error(`git ${args.join(" ")} failed: ${err.message}`);
  }
}

// A missing ref must not read as "no bypasses found". That is the failure mode this
// whole repo keeps having to defend against: a checker that passes because it measured
// nothing. If either ref is absent, that is a hard failure with an explanation.
for (const ref of [PROD, REVIEWED]) {
  const ok = git(["rev-parse", "--verify", "--quiet", `${ref}^{commit}`], { allowFail: true }).trim();
  if (!ok) {
    console.error(`BYPASS-FAIL cannot resolve ${ref} — nothing was compared, so nothing was proven`);
    process.exit(1);
  }
}

// Anti-vacuity: if the reviewed branch does not exist as an ancestor anywhere, the
// comparison is meaningless. Verified rather than assumed.
const mergeBase = git(["merge-base", PROD, REVIEWED], { allowFail: true }).trim();
if (!mergeBase) {
  console.error(
    `BYPASS-FAIL ${PROD} and ${REVIEWED} share no common ancestor — unrelated histories`,
  );
  process.exit(1);
}

const shas = git(["rev-list", PROD, "--not", REVIEWED]).trim().split("\n").filter(Boolean);

const bypasses = [];
const merges = [];
for (const sha of shas) {
  const line = git(["rev-list", "--parents", "-n", "1", sha]).trim();
  const parts = line.split(/\s+/);
  const parents = parts.length - 1;
  const subject = git(["show", "-s", "--format=%h %an %s", sha]).trim();
  if (parents > 1) {
    merges.push({ sha: parts[0].slice(0, 7), subject });
    continue;
  }
  bypasses.push({ sha: parts[0].slice(0, 7), subject, parents });
}

// The subject from `git show --format=%h %an %s` already carries the short sha, so
// prefixing it again would print "92fc1c5  92fc1c5 jaeko44 Media Update".
const tag = (s) => s.subject;

const ledger = readLedger();
const acceptedBySha = new Map(ledger.map((e) => [e.sha.toLowerCase().slice(0, 7), e]));
const unjudged = [];
const accepted = [];
for (const b of bypasses) {
  const hit = acceptedBySha.get(b.sha);
  if (hit) accepted.push({ ...b, entry: hit });
  else unjudged.push(b);
}

// Every accepted bypass is printed on every run, so the ledger stays visible and cannot
// rot into a file nobody reads. An accepted entry still does not make its weight free:
// the perf gate measures the bytes regardless of this file.
for (const a of accepted) {
  console.log(`  ACCEPTED ${tag(a)}  (${a.entry.accepted_by ?? "no acceptor recorded"})`);
  console.log(`           ${a.entry.reason}`);
}

if (process.env.SKIP_BYPASS_GUARD === "1") {
  console.log("BYPASS-SKIPPED SKIP_BYPASS_GUARD=1 — the branch-bypass guard did not run");
  for (const b of unjudged) console.log(`  UNJUDGED ${tag(b)}`);
  process.exit(0);
}

if (unjudged.length === 0) {
  // Proof it looked, not silence: report what it compared, so an empty pass is
  // distinguishable from a checker that resolved nothing.
  console.log(
    `BYPASS-OK prod=${PROD} reviewed=${REVIEWED} merge-base=${mergeBase.slice(0, 7)} ` +
      `compared=${shas.length} merges=${merges.length} accepted=${accepted.length} unjudged=0`,
  );
  process.exit(0);
}

console.error(
  `BYPASS-FAIL ${unjudged.length} commit(s) reached ${PROD} without passing ${REVIEWED}:`,
);
for (const b of unjudged) console.error(`  UNJUDGED ${tag(b)}`);
console.error(
  "\nEach of these is a non-merge commit on the production branch that the reviewed branch\n" +
    "does not contain, so no gate on " + REVIEWED + " ever built or judged it. Land the content\n" +
    "on " + REVIEWED + " through a PR (the gate runs there), then merge " + REVIEWED + " into " + PROD + ".\n" +
    "Do NOT widen a performance budget to silence this: that hides the symptom and leaves\n" +
    "the bypass in place.",
);
process.exit(1);