import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputFile = path.join(projectRoot, "src", "data", "legacy-blog.json");
const assetRoot = path.join(projectRoot, "public", "blog-assets");
const origin = "https://blog.virtengine.com";

function decodeEntities(value) {
  const named = {
    amp: "&",
    apos: "'",
    gt: ">",
    hellip: "…",
    laquo: "«",
    ldquo: "“",
    lsquo: "‘",
    lt: "<",
    nbsp: " ",
    quot: '"',
    raquo: "»",
    rdquo: "”",
    rsquo: "’",
  };

  return value.replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (entity, key) => {
    if (key[0] === "#") {
      const hex = key[1]?.toLowerCase() === "x";
      const point = Number.parseInt(key.slice(hex ? 2 : 1), hex ? 16 : 10);
      return Number.isFinite(point) ? String.fromCodePoint(point) : entity;
    }
    return named[key.toLowerCase()] ?? entity;
  });
}

function plainText(html) {
  return decodeEntities(
    html
      .replace(/<script\b[\s\S]*?<\/script>/gi, " ")
      .replace(/<style\b[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim(),
  );
}

function safeContent(html) {
  return html
    .replace(/<script\b[\s\S]*?<\/script>/gi, "")
    .replace(/<style\b[\s\S]*?<\/style>/gi, "")
    .replace(/<form\b[\s\S]*?<\/form>/gi, "")
    .replace(/\son[a-z]+\s*=\s*("[^"]*"|'[^']*')/gi, "")
    .trim();
}

function matchOne(html, expression, fallback = "") {
  return html.match(expression)?.[1]?.trim() ?? fallback;
}

function parseArticle(articleHtml, indexPage) {
  const titleAnchor = articleHtml.match(
    /<h1\b[^>]*class="[^"]*entry-title[^"]*"[^>]*>[\s\S]*?<a\b[^>]*href="([^"]+)"[^>]*>[\s\S]*?<\/a>[\s\S]*?<\/h1>/i,
  );
  if (!titleAnchor) return null;

  const originalUrl = titleAnchor[1];
  const parsedUrl = new URL(originalUrl, origin);
  const slug = parsedUrl.pathname.split("/").filter(Boolean).at(-1);
  if (!slug) return null;

  const titleHtml = matchOne(
    articleHtml,
    /<h1\b[^>]*class="[^"]*entry-title[^"]*"[^>]*>[\s\S]*?<a\b[^>]*>([\s\S]*?)<\/a>[\s\S]*?<\/h1>/i,
  );
  const publishedAt = matchOne(articleHtml, /<time\b[^>]*datetime="([^"]+)"/i);
  const authorHtml = matchOne(
    articleHtml,
    /<span\b[^>]*class="[^"]*fn[^"]*"[^>]*>([\s\S]*?)<\/span>/i,
    "VirtEngine by DET.io",
  );
  const readingTime = matchOne(articleHtml, /Reading time\s*~\s*([^<\r\n]+)/i, "1 minute");
  const content = safeContent(
    matchOne(
      articleHtml,
      /<div\b[^>]*class="[^"]*entry-content[^"]*"[^>]*>([\s\S]*?)<\/div>\s*<!--\s*\/\.entry-content\s*-->/i,
    ),
  );
  if (!content) return null;

  const descriptionText = plainText(content);
  const description =
    descriptionText.length > 190 ? `${descriptionText.slice(0, 187).trimEnd()}…` : descriptionText;

  return {
    slug,
    title: plainText(titleHtml),
    description,
    author: plainText(authorHtml),
    publishedAt,
    readingTime: plainText(readingTime),
    originalUrl: new URL(`/${slug}/`, origin).href,
    legacyIndexPage: indexPage,
    html: content,
  };
}

function extractImageUrls(html) {
  const urls = new Set();
  for (const match of html.matchAll(/\b(?:src|data-src)\s*=\s*("([^"]+)"|'([^']+)')/gi)) {
    const value = match[2] ?? match[3];
    if (!value || value.startsWith("data:")) continue;
    try {
      const url = new URL(value, origin);
      if (
        url.hostname === "blog.virtengine.com" &&
        url.pathname !== "/" &&
        /\.(?:avif|gif|jpe?g|png|svg|webp)$/i.test(url.pathname)
      ) {
        url.hash = "";
        urls.add(url.href);
      }
    } catch {
      // Leave malformed legacy references untouched.
    }
  }
  return urls;
}

function assetPathFor(urlString) {
  const url = new URL(urlString);
  const cleanParts = decodeURIComponent(url.pathname)
    .split("/")
    .filter((part) => part && part !== "." && part !== "..");
  return path.join(assetRoot, ...cleanParts);
}

async function downloadAsset(urlString) {
  const response = await fetch(urlString, { redirect: "follow", signal: AbortSignal.timeout(15_000) });
  if (!response.ok) return null;
  if (!response.headers.get("content-type")?.toLowerCase().startsWith("image/")) return null;
  const localPath = assetPathFor(urlString);
  await mkdir(path.dirname(localPath), { recursive: true });
  await writeFile(localPath, Buffer.from(await response.arrayBuffer()));
  const url = new URL(urlString);
  return `/blog-assets${url.pathname}`;
}

function rewriteContent(html, assetMap) {
  let rewritten = html;
  for (const [source, target] of assetMap) {
    const sourceUrl = new URL(source);
    rewritten = rewritten
      .split(source)
      .join(target)
      .split(`"${sourceUrl.pathname}`)
      .join(`"${target}`)
      .split(`'${sourceUrl.pathname}`)
      .join(`'${target}`);
  }

  return rewritten
    .replace(/https?:\/\/blog\.virtengine\.com\/page(\d+)\/?/gi, "/blog/archive/page/$1")
    .replace(/https?:\/\/blog\.virtengine\.com\/(?:rss|feed)\/?/gi, "/blog/rss.xml")
    .replace(/https?:\/\/blog\.virtengine\.com\/([^"'#?\s]+)\/?/gi, (_match, pathname) => {
      const normalized = pathname.replace(/^\/+|\/+$/g, "");
      if (!normalized) return "/blog";
      if (normalized.startsWith("content/images/") || normalized.startsWith("images/")) {
        return `/blog-assets/${normalized}`;
      }
      return `/blog/${normalized}`;
    })
    .replace(/https?:\/\/blog\.virtengine\.com\/?(?=["'#?\s<])/gi, "/blog");
}

async function main() {
  const articles = [];
  const seen = new Set();

  for (let page = 1; page <= 13; page += 1) {
    const pageUrl = page === 1 ? `${origin}/` : `${origin}/page${page}/`;
    const response = await fetch(pageUrl);
    if (!response.ok) throw new Error(`Could not fetch ${pageUrl}: ${response.status}`);
    const html = await response.text();
    for (const match of html.matchAll(/<article\b[\s\S]*?<\/article>/gi)) {
      const article = parseArticle(match[0], page);
      if (!article || seen.has(article.slug)) continue;
      seen.add(article.slug);
      articles.push(article);
    }
  }

  const imageUrls = new Set(articles.flatMap((article) => [...extractImageUrls(article.html)]));
  const assetMap = new Map();
  const pendingImages = [...imageUrls];
  for (let index = 0; index < pendingImages.length; index += 8) {
    const batch = pendingImages.slice(index, index + 8);
    const migrated = await Promise.all(
      batch.map(async (imageUrl) => {
        try {
          return [imageUrl, await downloadAsset(imageUrl)];
        } catch (error) {
          console.warn(`Could not migrate image ${imageUrl}: ${error.message}`);
          return [imageUrl, null];
        }
      }),
    );
    for (const [imageUrl, target] of migrated) {
      if (target) assetMap.set(imageUrl, target);
    }
  }

  const output = articles
    .map((article) => ({ ...article, html: rewriteContent(article.html, assetMap) }))
    .sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt));

  await mkdir(path.dirname(outputFile), { recursive: true });
  await writeFile(outputFile, `${JSON.stringify(output, null, 2)}\n`, "utf8");
  console.log(`Migrated ${output.length} posts and ${assetMap.size}/${imageUrls.size} images.`);
}

await main();
