#!/usr/bin/env node

/**
 * generate-release-body.mjs
 *
 * Called by the release workflow. Reads git history between the previous
 * tag (if any) and HEAD, groups commits by Conventional Commits type, and
 * prints a markdown release body to stdout.
 *
 * Usage:
 *   node scripts/generate-release-body.mjs
 *
 * Environment variables:
 *   GITHUB_SHA         — the commit being released (used as fallback)
 *   VERSION            — the tag name (e.g., v2026.09.25)
 */

import { execSync } from "node:child_process";

const version = process.env.VERSION || "v0.0.0";
const sha = process.env.GITHUB_SHA || execSync("git rev-parse HEAD", { encoding: "utf8" }).trim();

// Find the previous tag, if any
let previousTag = "";
try {
  previousTag = execSync(
    `git tag --sort=-version:refname | head -1`,
    { encoding: "utf8" }
  ).trim();
} catch {
  // No tags yet
}

// Build the log range
const range = previousTag ? `${previousTag}..HEAD` : "HEAD";
const logFormat = "%s|||%an|||%h";

let rawCommits = "";
try {
  rawCommits = execSync(
    `git log --no-merges --format="${logFormat}" ${range}`,
    { encoding: "utf8" }
  );
} catch {
  rawCommits = "";
}

const lines = rawCommits.trim().split("\n").filter(Boolean);

// Group commits by conventional commit type
const groups = {
  feat: [],
  fix: [],
  docs: [],
  refactor: [],
  ci: [],
  chore: [],
  test: [],
  style: [],
  perf: [],
  other: [],
};

const typeMap = {
  feat: "feat",
  feature: "feat",
  fix: "fix",
  bugfix: "fix",
  docs: "docs",
  documentation: "docs",
  refactor: "refactor",
  ci: "ci",
  chore: "chore",
  test: "test",
  style: "style",
  perf: "perf",
  performance: "perf",
};

for (const line of lines) {
  const sep = line.indexOf("|||");
  if (sep === -1) continue;
  const subject = line.slice(0, sep);
  const rest = line.slice(sep + 3);
  const authorSep = rest.indexOf("|||");
  const author = authorSep !== -1 ? rest.slice(0, authorSep) : "unknown";
  const hash = authorSep !== -1 ? rest.slice(authorSep + 3) : rest;

  // Parse Conventional Commits: type(scope): description
  const match = subject.match(
    /^(feat|feature|fix|bugfix|docs|documentation|refactor|ci|chore|test|style|perf|performance)(?:\(([^)]+)\))?:\s*(.+)/
  );

  let type = "other";
  let scope = "";
  let description = subject;
  if (match) {
    const rawType = match[1].toLowerCase();
    type = typeMap[rawType] || "other";
    scope = match[2] || "";
    description = match[3];
  }

  groups[type].push({ description, scope, author, hash });
}

// Production deploy targets.
//
// The Cloudflare Pages project name is the deployment identity; the custom
// domain is what users actually visit. Both are listed so the release body is
// a complete rollback reference.
//
// These project names MUST match each site's wrangler.jsonc "name". They were
// corrected in PR #6 — the older virtengine-com / det-io / identity-org-au
// projects are dead (522 / NXDOMAIN), so never derive this map from stale docs.
const sites = [
  { dir: "virtengine.com", project: "virtengine-web", domain: "virtengine.com" },
  { dir: "docs.virtengine.com", project: "docs-virtengine-com", domain: "docs.virtengine.com" },
  { dir: "det.io", project: "det-web", domain: "det.io" },
  { dir: "identity.org.au", project: "veid-network", domain: "identity.org.au" },
];

function pluralize(n, s) {
  return n === 1 ? s : `${s}s`;
}

// Detect which sites changed.
//
// With no previous tag, `git diff --name-only HEAD` compares HEAD against the
// working tree (empty in CI), so the naive range would report zero affected
// sites on the very first release. Fall back to treating every site as
// affected, and say so, rather than emitting a misleading empty list.
const firstRelease = previousTag === "";
const changedSites = [];

for (const site of sites) {
  if (firstRelease) {
    changedSites.push(site.dir);
    continue;
  }
  try {
    const count = execSync(
      `git diff --name-only ${range} -- "sites/${site.dir}" 2>/dev/null | wc -l`,
      { encoding: "utf8" }
    ).trim();
    if (parseInt(count, 10) > 0) {
      changedSites.push(site.dir);
    }
  } catch {
    // skip
  }
}

// Count all commits
const totalCommits = Object.values(groups).reduce((sum, arr) => sum + arr.length, 0);

// Build the lines buffer
const linesBuf = [];

linesBuf.push(`## Release ${version}`);
linesBuf.push("");
linesBuf.push(
  changelogDate()
    ? `**Date:** ${changelogDate()}`
    : ""
);
const fullSha = sha || "";
linesBuf.push(
  sha ? `**Commit:** \`${sha.slice(0, 10)}\`` : ""
);
linesBuf.push(`**Full commit SHA:** \`${fullSha}\``);
linesBuf.push(`**Commits since last release:** ${totalCommits} ${pluralize(totalCommits, "commit")}`);
linesBuf.push("");

// What's in this release
if (changedSites.length > 0) {
  const suffix = firstRelease ? " (first release — all sites)" : "";
  linesBuf.push(`**Affected sites:** ${changedSites.join(", ")}${suffix}`);
  linesBuf.push("");
}

// DONE WHEN requires the release to carry the deploy URL alongside the commit,
// so the snapshot can be found in Cloudflare and rolled back to. These are the
// production targets; queue/watch URLs are per-deployment and not knowable here.
linesBuf.push("## Production deploys");
linesBuf.push("");
linesBuf.push("| Site | Cloudflare Pages project | Production URL | Deploy preview |");
linesBuf.push("| --- | --- | --- | --- |");
for (const site of sites) {
  linesBuf.push(
    `| ${site.domain} | \`${site.project}\` | https://${site.domain} | https://${site.project}.pages.dev |`
  );
}
linesBuf.push("");
linesBuf.push(
  `All four Pages projects deploy from this commit \`${fullSha}\` once it is on \`main\`.`
);
linesBuf.push(
  "Site-specific deployments run through the existing Cloudflare Pages build, not this workflow."
);
linesBuf.push("");

const groupLabels = {
  feat: "Features",
  fix: "Bug fixes",
  docs: "Documentation",
  refactor: "Refactoring",
  ci: "CI & tooling",
  chore: "Maintenance",
  test: "Tests",
  style: "Style",
  perf: "Performance",
  other: "Other changes",
};

const groupOrder = ["feat", "fix", "docs", "perf", "refactor", "ci", "test", "style", "chore", "other"];

for (const key of groupOrder) {
  const items = groups[key];
  if (items.length === 0) continue;
  const label = groupLabels[key] || key;
  linesBuf.push(`### ${label} (${items.length} ${pluralize(items.length, "change")})`);
  linesBuf.push("");
  for (const item of items) {
    const scoped = item.scope ? `**${item.scope}:** ` : "";
    linesBuf.push(`- ${scoped}${item.description} (\`${item.hash}\`)`);
  }
  linesBuf.push("");
}

// Build summary metadata
linesBuf.push("---");
linesBuf.push("");
linesBuf.push(`_${totalCommits} commits across ${changedSites.length} sites_`);
linesBuf.push(`_Generated from \`git log ${range}\`_`);

const body = linesBuf.filter((l) => l !== "").join("\n") + "\n";

// Print to stdout — the workflow captures this
process.stdout.write(body);

function changelogDate() {
  try {
    const date = execSync(`git log -1 --format=%ci ${sha}`, {
      encoding: "utf8",
    }).trim();
    return date.split(" ")[0];
  } catch {
    return new Date().toISOString().split("T")[0];
  }
}