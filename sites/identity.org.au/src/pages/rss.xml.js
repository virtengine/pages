import { INSIGHT_ARTICLES } from "@data/insights";
import { GUIDES } from "@data/guides";
import { SITE } from "@data/site";

/**
 * Insights and guides feed. Items are ordered newest-first by the real
 * `updated` field in src/data/insights.ts and src/data/guides.ts — no dates
 * are invented for the feed.
 */
const escapeXml = (value) =>
  value.replace(/[<>&'"]/g, (character) => ({
    "<": "&lt;",
    ">": "&gt;",
    "&": "&amp;",
    "'": "&apos;",
    '"': "&quot;",
  })[character]);

export function GET() {
  const articles = [
    ...INSIGHT_ARTICLES.map((article) => ({
      ...article,
      path: `/insights/${article.slug}`,
      category: article.topic,
    })),
    ...GUIDES.map((guide) => ({
      ...guide,
      path: `/guides/${guide.slug}`,
      category: `Guides · ${guide.topic}`,
    })),
  ].sort((a, b) => new Date(b.updated).getTime() - new Date(a.updated).getTime());

  const items = articles
    .map((article) => {
      const url = `${SITE.url}${article.path}`;
      return `<item>
      <title>${escapeXml(article.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${new Date(article.updated).toUTCString()}</pubDate>
      <category>${escapeXml(article.category)}</category>
      <description>${escapeXml(article.summary)}</description>
    </item>`;
    })
    .join("\n");

  const lastBuild = articles[0] ? new Date(articles[0].updated).toUTCString() : new Date(0).toUTCString();

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>identity.org.au — insights and guides on digital identity</title>
    <link>${SITE.url}/insights</link>
    <atom:link href="${SITE.url}/rss.xml" rel="self" type="application/rss+xml" />
    <description>Evergreen analysis, guides and explainers on digital identity, privacy, verification and the Identity Wallet — published by ${SITE.foundation}.</description>
    <language>en-au</language>
    <lastBuildDate>${lastBuild}</lastBuildDate>
    ${items}
  </channel>
</rss>`;

  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}