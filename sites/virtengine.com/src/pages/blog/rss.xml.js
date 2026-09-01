import { ALL_POSTS } from "@data/blog";
import { SITE } from "@data/site";

const escapeXml = (value) =>
  value.replace(/[<>&'\"]/g, (character) => ({
    "<": "&lt;",
    ">": "&gt;",
    "&": "&amp;",
    "'": "&apos;",
    '\"': "&quot;",
  })[character]);

export function GET() {
  const items = ALL_POSTS.map((article) => {
    const url = `${SITE.url}/blog/${article.slug}`;
    return `<item>
      <title>${escapeXml(article.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${new Date(article.publishedAt).toUTCString()}</pubDate>
      <dc:creator>${escapeXml(article.author)}</dc:creator>
      <description>${escapeXml(article.description)}</description>
    </item>`;
  }).join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>VirtEngine Journal</title>
    <link>${SITE.url}/blog</link>
    <description>Protocol notes and the preserved VirtEngine blog archive.</description>
    <language>en-au</language>
    <lastBuildDate>${new Date(CURRENT_BUILD_DATE).toUTCString()}</lastBuildDate>
    ${items}
  </channel>
</rss>`;

  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}

const CURRENT_BUILD_DATE = "2026-09-01T00:00:00.000Z";
