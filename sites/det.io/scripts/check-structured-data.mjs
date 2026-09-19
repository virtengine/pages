#!/usr/bin/env node
/**
 * Validate the JSON-LD emitted by a built Astro site.
 *
 * Usage: node scripts/check-structured-data.mjs [distDir]
 *
 * Checks, per page:
 *  - every <script type="application/ld+json"> parses as JSON
 *  - the document has an @graph and every node carries an @type
 *  - required properties per schema.org type are present (Google's spec)
 *  - every same-host @id reference resolves to a node in the same document
 *    (cross-host @id references are legal linked data and are reported as info)
 *  - every URL in the document is absolute
 *  - headlines stay within Google's 110-character display limit
 *  - FAQPage questions appear in the rendered text (Google requires the
 *    marked-up content to be visible on the page)
 *
 * Exit code 1 when any ERROR is found. Warnings do not fail the build.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const distDir = process.argv[2] ?? "dist";
const explicitOrigin = process.argv[3];

/** Required properties per type, from Google's structured data documentation. */
const REQUIRED = {
  Organization: ["name", "url"],
  NGO: [],
  WebSite: ["name", "url"],
  WebPage: ["name", "url"],
  CollectionPage: ["name", "url"],
  AboutPage: ["name", "url"],
  ContactPage: ["name", "url"],
  BreadcrumbList: ["itemListElement"],
  ItemList: ["itemListElement"],
  FAQPage: ["mainEntity"],
  Article: ["headline"],
  BlogPosting: ["headline"],
  TechArticle: ["headline"],
  NewsArticle: ["headline"],
  ImageObject: ["url"],
  SoftwareApplication: ["name"],
  WebApplication: ["name"],
  Service: ["name"],
  Question: ["name", "acceptedAnswer"],
  Answer: ["text"],
  ListItem: ["position", "name", "item"],
  PropertyValue: ["propertyID", "value"],
  Offer: ["price"],
  Thing: ["name"],
};

const RECOMMENDED = {
  Article: ["author", "datePublished", "image", "publisher", "mainEntityOfPage"],
  BlogPosting: ["author", "datePublished", "image", "publisher", "mainEntityOfPage"],
  TechArticle: ["author", "image", "publisher", "mainEntityOfPage"],
  Organization: ["logo", "description", "sameAs"],
  WebSite: ["description", "inLanguage", "publisher"],
  WebPage: ["description", "inLanguage", "breadcrumb", "primaryImageOfPage", "isPartOf"],
  FAQPage: ["isPartOf"],
  SoftwareApplication: ["description", "offers", "publisher"],
};

const errors = [];
const warnings = [];
const infos = [];
let pagesChecked = 0;
let nodesChecked = 0;
let jsonLdBlocks = 0;

function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...walk(full));
    else if (entry.endsWith(".html")) out.push(full);
  }
  return out;
}

const decodeEntities = (value) =>
  value
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");

const stripTags = (html) =>
  decodeEntities(
    html
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " "),
  )
    .replace(/\s+/g, " ")
    .trim();

const isAbsolute = (value) => /^https?:\/\/[^\s]+$/i.test(value);

const typesOf = (node) => {
  const type = node["@type"];
  if (!type) return [];
  return Array.isArray(type) ? type : [type];
};

/**
 * The host this document describes. Prefer the explicit CLI argument; otherwise
 * take the most common host among `#`-fragment @ids, which is the document's own
 * site (referenced foreign entities are always a minority).
 */
function siteHostOf(nodes, explicitOrigin) {
  if (explicitOrigin) {
    try {
      return new URL(explicitOrigin).host;
    } catch {
      /* fall through to inference */
    }
  }
  const counts = new Map();
  for (const node of nodes) {
    const id = node["@id"];
    if (typeof id !== "string" || !id.includes("#")) continue;
    try {
      const host = new URL(id).host;
      counts.set(host, (counts.get(host) ?? 0) + 1);
    } catch {
      /* ignore */
    }
  }
  let best = null;
  let bestCount = 0;
  for (const [host, count] of counts) {
    if (count > bestCount) {
      best = host;
      bestCount = count;
    }
  }
  return best;
}

function checkNode(node, page, ids, siteHost, crossRefs) {
  nodesChecked += 1;
  const types = typesOf(node);
  if (types.length === 0) {
    errors.push(`${page}: node without @type — ${JSON.stringify(node).slice(0, 120)}`);
    return;
  }
  for (const type of types) {
    for (const prop of REQUIRED[type] ?? []) {
      const value = node[prop];
      if (value === undefined || value === null || value === "" ||
          (Array.isArray(value) && value.length === 0)) {
        errors.push(`${page}: ${type} is missing required property "${prop}"`);
      }
    }
    for (const prop of RECOMMENDED[type] ?? []) {
      if (node[prop] === undefined) {
        warnings.push(`${page}: ${type} has no recommended property "${prop}"`);
      }
    }
    if (!REQUIRED[type] && !RECOMMENDED[type]) {
      infos.push(`${page}: unrecognised @type "${type}" (no rule set — check it manually)`);
    }
  }

  for (const [key, value] of Object.entries(node)) {
    if (typeof value === "string" && key === "headline" && value.length > 110) {
      errors.push(`${page}: headline exceeds 110 characters (${value.length})`);
    }
  }

  // Resolve @id references: same-host ones must exist in this document.
  const refs = [];
  const visit = (candidate) => {
    if (!candidate || typeof candidate !== "object") return;
    if (Array.isArray(candidate)) {
      candidate.forEach(visit);
      return;
    }
    const keys = Object.keys(candidate);
    if (typeof candidate["@id"] === "string" && keys.length === 1) refs.push(candidate["@id"]);
    Object.values(candidate).forEach(visit);
  };
  Object.entries(node)
    .filter(([key]) => key !== "@id")
    .forEach(([, value]) => visit(value));

  for (const ref of refs) {
    if (ref.startsWith("#")) {
      if (!ids.has(ref)) errors.push(`${page}: unresolved local @id reference "${ref}" in ${types[0]}`);
      continue;
    }
    if (!ref.includes("#")) continue;
    let host = null;
    try {
      host = new URL(ref).host;
    } catch {
      errors.push(`${page}: @id reference is not an absolute URL — "${ref}" in ${types[0]}`);
      continue;
    }
    if (siteHost && host === siteHost) {
      if (!ids.has(ref)) errors.push(`${page}: unresolved @id reference "${ref}" in ${types[0]}`);
    } else {
      crossRefs.add(`${host} → ${ref}`);
    }
  }

  // Absolute URLs only.
  const URL_KEYS = ["@id", "url", "contentUrl", "logo", "image", "mainEntityOfPage", "item", "sameAs", "downloadUrl", "softwareHelp", "privacyPolicy", "termsOfService", "license"];
  for (const [key, value] of Object.entries(node)) {
    if (!URL_KEYS.includes(key)) continue;
    const values = Array.isArray(value) ? value : [value];
    for (const candidate of values) {
      const url = typeof candidate === "string" ? candidate : candidate?.url;
      if (typeof url === "string" && !isAbsolute(url) && !url.startsWith("#")) {
        errors.push(`${page}: ${types[0]}.${key} is not an absolute URL — "${url}"`);
      }
    }
  }
}

for (const file of walk(distDir)) {
  const html = readFileSync(file, "utf8");
  const page = relative(distDir, file).replace(/\\/g, "/");
  const blocks = [...html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)];
  if (blocks.length === 0) {
    // Astro redirect stubs carry a meta refresh + noindex and need no markup.
    if (/http-equiv="refresh"/i.test(html)) continue;
    warnings.push(`${page}: no JSON-LD found`);
    continue;
  }
  pagesChecked += 1;

  for (const block of blocks) {
    jsonLdBlocks += 1;
    let doc;
    try {
      doc = JSON.parse(decodeEntities(block[1]));
    } catch (error) {
      errors.push(`${page}: invalid JSON-LD — ${error.message}`);
      continue;
    }
    if (!doc["@context"]) errors.push(`${page}: JSON-LD is missing @context`);

    const nodes = Array.isArray(doc["@graph"]) ? doc["@graph"] : [doc];
    const ids = new Set(nodes.map((node) => node["@id"]).filter(Boolean));
    const siteHost = siteHostOf(nodes, explicitOrigin);
    const crossRefs = new Set();

    for (const node of nodes) checkNode(node, page, ids, siteHost, crossRefs);
    for (const ref of crossRefs) infos.push(`${page}: cross-site @id reference ${ref}`);

    const visibleText = stripTags(html);
    for (const node of nodes) {
      if (!typesOf(node).includes("FAQPage")) continue;
      const questions = node.mainEntity ?? [];
      let hidden = 0;
      for (const question of questions) {
        const text = typeof question.name === "string" ? question.name : "";
        const probe = decodeEntities(text).slice(0, 40);
        if (probe.length > 10 && !visibleText.includes(probe)) hidden += 1;
      }
      if (hidden > 0) {
        warnings.push(`${page}: ${hidden}/${questions.length} FAQ question(s) not found in visible page text`);
      }
    }
  }
}

const report = {
  pages_checked: pagesChecked,
  json_ld_blocks: jsonLdBlocks,
  nodes: nodesChecked,
  errors: errors.length,
  warnings: warnings.length,
  cross_site_references: new Set(infos.filter((i) => i.includes("cross-site"))).size,
};

if (warnings.length) {
  console.log(`WARN (${warnings.length}):`);
  for (const warning of warnings.slice(0, 25)) console.log(`  - ${warning}`);
  if (warnings.length > 25) console.log(`  ... ${warnings.length - 25} more`);
}
if (errors.length) {
  console.log(`ERROR (${errors.length}):`);
  for (const error of errors.slice(0, 40)) console.log(`  - ${error}`);
  if (errors.length > 40) console.log(`  ... ${errors.length - 40} more`);
}
console.log(`\n${JSON.stringify(report, null, 2)}`);
process.exit(errors.length > 0 ? 1 : 0);
