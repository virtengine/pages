import { CONSTITUTION_TOPICS } from "@data/constitution";
import { FOUNDATION_PAGES } from "@data/foundation";
import { RESEARCH_TOPICS } from "@data/research";
import { SITE } from "@data/site";

/**
 * Foundation feed: research topics, constitution explainers and institution
 * pages.
 *
 * Note on dates: none of these content sets carries a publication or review
 * date in src/data/, so items deliberately omit <pubDate> rather than borrow a
 * date from the site footer. Add an `updated` field to the data if you want
 * dated feed items (and `dateModified` in the page JSON-LD).
 */
const escapeXml = (value) =>
  value.replace(/[<>&'"]/g, (character) => ({
    "<": "&lt;",
    ">": "&gt;",
    "&": "&amp;",
    "'": "&apos;",
    '"': "&quot;",
  })[character]);

const entries = [
  ...RESEARCH_TOPICS.map((topic) => ({
    group: "Research",
    title: topic.title,
    href: `/research/${topic.slug}`,
    description: topic.summary,
  })),
  ...CONSTITUTION_TOPICS.map((topic) => ({
    group: "Constitution",
    title: topic.title,
    href: `/constitution/${topic.slug}`,
    description: topic.summary,
  })),
  ...FOUNDATION_PAGES.map((page) => ({
    group: "Foundation",
    title: page.title,
    href: `/foundation/${page.slug}`,
    description: page.summary,
  })),
];

export function GET() {
  const items = entries
    .map((entry) => {
      const url = `${SITE.url}${entry.href}`;
      return `<item>
      <title>${escapeXml(entry.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <category>${escapeXml(entry.group)}</category>
      <description>${escapeXml(entry.description)}</description>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>DET.io Foundation — research, constitution and institution</title>
    <link>${SITE.url}/research</link>
    <atom:link href="${SITE.url}/rss.xml" rel="self" type="application/rss+xml" />
    <description>Open research, the signed constitution explained clause by clause, and how ${SITE.legalName} works as an institution.</description>
    <language>en-au</language>
    <copyright>${escapeXml(SITE.legalName)} — ACN ${SITE.acn}</copyright>
    ${items}
  </channel>
</rss>`;

  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}