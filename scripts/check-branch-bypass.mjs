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
// TOPOLOGY IS NOT THE SAME QUESTION AS CONTENT — measured 2026-10-06. The first cut of
// this guard asked only `git rev-list PROD --not REVIEWED`, which is a question about
// SHA GRAPH SHAPE. It answered that shape correctly and still cried wolf forever: this
// repo merges with --squash, and a squash merge rewrites every sha it carries, so a
// commit that HAD been reviewed on develop came back as UNJUDGED with no way to ever
// satisfy the guard. Measured on origin/develop 4390413:
//
//   git cherry -v origin/develop origin/main
//   - 6cbafae  fix(virtengine): recover stashed homepage and header polish (#64)
//   + 3bc740a  Polish DET.io typography, privacy map, and diagrams (#65)
//
// The `-` is the whole finding: 6cbafae's content is byte-identical to develop's tip
// (patch-id 80de108f on both) and had been built by the full gate in PR #70 — yet the
// guard still named it, which kept the develop->main gate red on EVERY pull_request
// including ones that changed nothing. A guard that is red on unrelated PRs has no
// signal left for the one real bypass.
//
// So both questions are asked. Ancestry says "did this sha travel the reviewed path".
// Patch equivalence (`git cherry`) says "is this EXACT change already on the reviewed
// branch, under whatever sha". Content is the thing that was actually built, so a
// patch-equivalent commit is reported as JUDGED-BY-PATCH rather than as a bypass. This
// is strictly tighter than the ledger: the ledger is a human writing a reason, whereas
// this is the CI pipeline's own build proving the identical tree was green.
//
// It does NOT widen what counts as judged in the dangerous direction. Patch-id equality
// is a whole-patch comparison, so a SPLIT commit — site files forward-ported while its
// gate/baseline edits are held back — is still `+` and still fails. That is deliberate:
// 3bc740a (PR #65) is exactly that shape, and it is still red, because it still is.
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

// `git cherry -v REVIEWED PROD` walks the commits PROD has that REVIEWED does not, and
// marks each `-` when a patch-equivalent change IS reachable from REVIEWED. That is the
// single call that answers "is this content already judged", and it costs one diff per
// candidate commit (0.37s against this repo's 21/130 commit graph).
//
// A failure here must NOT degrade to "no patch equivalents found": that would silently
// widen the report back to the topology-only behaviour this section exists to fix, and
// it would do so without a word. So a `git cherry` that cannot run is a hard failure.
function patchEquivalentOnReviewed() {
  let out;
  try {
    out = execFileSync("git", ["cherry", "-v", REVIEWED, PROD], {
      encoding: "utf8",
      maxBuffer: 1 << 26,
    });
  } catch (err) {
    console.error(
      `BYPASS-FAIL could not compute patch equivalence — \`git cherry -v ${REVIEWED} ${PROD}\` failed: ${err.message}\n` +
        "Content equivalence is half of this guard's verdict; without it every squash-merged\n" +
        "commit would be reported as a bypass and no PR could ever go green.",
    );
    process.exit(1);
  }
  const equivalent = new Set();
  for (const line of out.split("\n")) {
    if (!line.startsWith("- ")) continue;
    const sha = line.slice(2).split(/\s+/)[0];
    if (sha) equivalent.add(sha.toLowerCase().slice(0, 7));
  }
  return equivalent;
}

const ledger = readLedger();
const acceptedBySha = new Map(ledger.map((e) => [e.sha.toLowerCase().slice(0, 7), e]));
const patchEquivalent = patchEquivalentOnReviewed();
const unjudged = [];
const accepted = [];
const judgedByPatch = [];
for (const b of bypasses) {
  // Ledger first: an accepted sha is a human's written disposition and is reported as
  // such, with its reason. Only then the mechanical content test.
  const hit = acceptedBySha.get(b.sha);
  if (hit) accepted.push({ ...b, entry: hit });
  else if (patchEquivalent.has(b.sha)) judgedByPatch.push(b);
  else unjudged.push(b);
}

// Every accepted bypass is printed on every run, so the ledger stays visible and cannot
// rot into a file nobody reads. An accepted entry still does not make its weight free:
// the perf gate measures the bytes regardless of this file.
for (const a of accepted) {
  console.log(`  ACCEPTED ${tag(a)}  (${a.entry.accepted_by ?? "no acceptor recorded"})`);
  console.log(`           ${a.entry.reason}`);
}

// Content-equivalent commits are printed too, with the reviewed-branch sha that proves
// it. An exclusion nobody can see is indistinguishable from a missed bypass, and this
// repo has already been bitten by a gate that reported nothing.
for (const b of judgedByPatch) {
  console.log(`  JUDGED-BY-PATCH ${tag(b)}`);
  console.log(`           identical patch is already on ${REVIEWED}; no ledger entry needed`);
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
      `compared=${shas.length} merges=${merges.length} accepted=${accepted.length} ` +
      `unjudged=0 judged-by-patch=${judgedByPatch.length}`,
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