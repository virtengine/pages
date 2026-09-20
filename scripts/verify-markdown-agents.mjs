#!/usr/bin/env node
/**
 * Post-deploy verifier for Markdown for Agents (content negotiation).
 *
 * Run AFTER deploying the functions/_middleware.js change to production:
 *
 *   node scripts/verify-markdown-agents.mjs
 *
 * For each of virtengine.com, identity.org.au and det.io it:
 *   1. probes the live homepage with `Accept: text/markdown` and asserts
 *      `Content-Type: text/markdown` plus an `x-markdown-tokens` header;
 *   2. runs the public isitagentready.com scan and asserts
 *      checks.contentAccessibility.markdownNegotiation.status === "pass".
 *
 * No credentials needed. Exits 0 when every site passes, 1 otherwise.
 *
 * Skill: https://isitagentready.com/.well-known/agent-skills/markdown-negotiation/SKILL.md
 */

const SITES = ["https://virtengine.com", "https://identity.org.au", "https://det.io"];

async function fetchTimeout(url, options = {}, ms = 30000) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), ms);
  try {
    return await fetch(url, { ...options, signal: ctrl.signal });
  } finally {
    clearTimeout(timer);
  }
}

async function probe(site) {
  try {
    const res = await fetchTimeout(`${site}/`, { headers: { Accept: "text/markdown" } });
    const contentType = res.headers.get("content-type") ?? "(none)";
    const tokens = res.headers.get("x-markdown-tokens") ?? "(none)";
    const ok = res.ok && contentType.includes("text/markdown") && /^\d+$/.test(tokens);
    return { site, ok, detail: `${res.status} ${contentType} x-markdown-tokens=${tokens}` };
  } catch (err) {
    return { site, ok: false, detail: `probe error: ${String(err)}` };
  }
}

async function scan(site) {
  try {
    const res = await fetchTimeout(
      "https://isitagentready.com/api/scan",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: site }),
      },
      180000,
    );
    const body = await res.json().catch(() => ({}));
    const status = body?.checks?.contentAccessibility?.markdownNegotiation?.status ?? "(unknown)";
    return { site, ok: status === "pass", detail: `markdownNegotiation.status=${status}` };
  } catch (err) {
    return { site, ok: false, detail: `scan error: ${String(err)}` };
  }
}

let failed = false;
console.log("Live probes (Accept: text/markdown):");
for (const site of SITES) {
  const r = await probe(site);
  console.log(`  ${r.site}: ${r.ok ? "CONVERTS" : "FAIL"} — ${r.detail}`);
  if (!r.ok) failed = true;
}

console.log("\nisitagentready.com scans:");
for (const site of SITES) {
  const r = await scan(site);
  console.log(`  ${r.site}: ${r.ok ? "PASS" : "FAIL"} — ${r.detail}`);
  if (!r.ok) failed = true;
}

process.exit(failed ? 1 : 0);
