/**
 * Edge content negotiation: Markdown for Agents, self-hosted.
 *
 * When a request carries `Accept: text/markdown`, this middleware fetches the
 * normal HTML response via `context.next()` and converts it to Markdown, so
 * agents receive clean text instead of scraping dense page HTML. Browsers and
 * any client that does not ask for markdown get byte-identical HTML.
 *
 * Response contract (mirrors Cloudflare's Markdown for Agents output):
 *   - `Content-Type: text/markdown; charset=utf-8`
 *   - `Vary` gains `Accept` so caches keep HTML and Markdown variants apart
 *   - YAML frontmatter from <meta> tags (title, description, image)
 *   - body Markdown converted from <main> (nav/header/footer/scripts stripped)
 *   - page JSON-LD preserved as a fenced ```json block at the end
 *   - `x-markdown-tokens` / `x-original-tokens` estimates
 *   - origin status, cache and security headers are otherwise preserved
 *
 * Requires no Cloudflare plan feature and no dependencies: this file is
 * dependency-free on purpose so the exact same code runs in the Pages
 * Function and in the Node test/checker scripts.
 *
 * This file is copied verbatim into each site's `functions/` directory
 * (virtengine.com, identity.org.au, det.io). Keep the copies in sync —
 * `scripts/check-markdown.mjs` exercises every copy against real builds.
 */

const MARKDOWN_MIME = "text/markdown; charset=utf-8";

/** Subtrees that never carry agent-readable content. */
const SKIP_TAGS = new Set([
  "script",
  "style",
  "noscript",
  "template",
  "header",
  "footer",
  "nav",
  "svg",
  "form",
  "button",
  "iframe",
  "canvas",
  "video",
  "audio",
  "dialog",
  "select",
  "datalist",
  "map",
  "object",
  "embed",
]);

const VOID_TAGS = new Set(
  "area,base,br,col,embed,hr,img,input,link,meta,param,source,track,wbr".split(","),
);

/** Elements whose text must be preserved verbatim (still entity-decoded). */
const RAW_TEXT_TAGS = new Set(["script", "style", "textarea", "title"]);

const NAMED_ENTITIES = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
  copy: "©",
  reg: "®",
  hellip: "…",
  mdash: "—",
  ndash: "–",
  laquo: "«",
  raquo: "»",
  lsquo: "'",
  rsquo: "'",
  ldquo: "\u201c",
  rdquo: "\u201d",
  bull: "•",
  middot: "·",
  dagger: "†",
  Dagger: "‡",
  trade: "™",
  euro: "€",
  pound: "£",
  yen: "¥",
  sect: "§",
  para: "¶",
};

export function estimateTokens(text) {
  return Math.max(1, Math.ceil(String(text).length / 4));
}

function decodeEntities(s) {
  return s.replace(/&(#\d+|#[xX][0-9a-fA-F]+|[A-Za-z][A-Za-z0-9]+);/g, (m, e) => {
    if (e[0] === "#") {
      const cp = e[1] === "x" || e[1] === "X" ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10);
      try {
        return String.fromCodePoint(cp);
      } catch {
        return m;
      }
    }
    return NAMED_ENTITIES[e] ?? m;
  });
}

function parseAttrs(inner) {
  const attrs = {};
  const re = /([A-Za-z_:][A-Za-z0-9_:.-]*)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'`=<>]+)))?/g;
  let m;
  while ((m = re.exec(inner)) !== null) {
    const name = m[1].toLowerCase();
    const value = m[2] ?? m[3] ?? m[4] ?? "";
    attrs[name] = decodeEntities(value);
  }
  return attrs;
}

/**
 * Minimal lenient HTML parser -> { t:'e', n, a, c } / { t:'x', s } tree.
 * Good enough for well-formed static builds; never throws on messy input.
 */
function parseHtml(html) {
  const root = { t: "e", n: "root", a: {}, c: [] };
  const stack = [root];
  const len = html.length;
  let i = 0;
  const current = () => stack[stack.length - 1];
  const pushText = (s) => {
    if (s) current().c.push({ t: "x", s: decodeEntities(s) });
  };

  while (i < len) {
    const lt = html.indexOf("<", i);
    if (lt === -1) {
      pushText(html.slice(i));
      break;
    }
    if (lt > i) pushText(html.slice(i, lt));

    // Comment.
    if (html.startsWith("<!--", lt)) {
      const end = html.indexOf("-->", lt + 4);
      i = end === -1 ? len : end + 3;
      continue;
    }
    // Doctype / declarations: skip to ">".
    if (html[lt + 1] === "!") {
      const end = html.indexOf(">", lt + 2);
      i = end === -1 ? len : end + 1;
      continue;
    }
    // End tag: pop until the matching open element (lenient).
    if (html[lt + 1] === "/") {
      const end = html.indexOf(">", lt + 2);
      if (end === -1) {
        i = len;
        break;
      }
      const name = html
        .slice(lt + 2, end)
        .trim()
        .split(/\s+/)[0]
        .toLowerCase();
      for (let k = stack.length - 1; k > 0; k--) {
        if (stack[k].n === name) {
          stack.length = k;
          break;
        }
      }
      i = end + 1;
      continue;
    }

    // Start tag: scan to ">" respecting quotes.
    let j = lt + 1;
    let quote = null;
    while (j < len) {
      const ch = html[j];
      if (quote) {
        if (ch === quote) quote = null;
      } else if (ch === '"' || ch === "'") {
        quote = ch;
      } else if (ch === ">") {
        break;
      }
      j++;
    }
    if (j >= len) break;
    const inner = html.slice(lt + 1, j);
    const nameMatch = /^[A-Za-z][A-Za-z0-9:-]*/.exec(inner);
    if (!nameMatch) {
      i = j + 1;
      continue;
    }
    const name = nameMatch[0].toLowerCase();
    const attrs = parseAttrs(inner.slice(name.length));
    const selfClose = /\/\s*$/.test(inner) || VOID_TAGS.has(name);
    i = j + 1;

    const el = { t: "e", n: name, a: attrs, c: [] };
    current().c.push(el);
    if (selfClose) continue;
    if (RAW_TEXT_TAGS.has(name)) {
      // Raw text: consume verbatim until the matching close tag.
      const closeRe = new RegExp(`</${name}\\s*>`, "ig");
      closeRe.lastIndex = i;
      const found = closeRe.exec(html);
      if (found) {
        pushTextRaw(el, html.slice(i, found.index));
        i = found.index + found[0].length;
      } else {
        pushTextRaw(el, html.slice(i));
        i = len;
      }
      continue;
    }
    stack.push(el);
  }
  return root;

  function pushTextRaw(el, s) {
    if (s) el.c.push({ t: "x", s: decodeEntities(s) });
  }
}

function findFirst(node, name) {
  if (node.t === "e") {
    if (node.n === name) return node;
    for (const ch of node.c) {
      const found = findFirst(ch, name);
      if (found) return found;
    }
  }
  return null;
}

function collectText(node) {
  if (node.t === "x") return node.s;
  if (node.t === "e") {
    if (node.n === "br") return "\n";
    if (SKIP_TAGS.has(node.n)) return "";
    return node.c.map(collectText).join("");
  }
  return "";
}

function collapse(s) {
  return s.replace(/[\t\n\r ]+/g, " ").replace(/ /g, " ").trim();
}

function resolveUrl(href, pageUrl) {
  if (!href) return "";
  try {
    return new URL(href, pageUrl).href;
  } catch {
    return href;
  }
}

function shouldSkip(el) {
  if (SKIP_TAGS.has(el.n)) return true;
  if (el.a.hidden !== undefined) return true;
  if (el.a.type === "hidden") return true;
  const style = el.a.style ?? "";
  if (/display\s*:\s*none/i.test(style)) return true;
  return false;
}

const TRANSPARENT_INLINE = new Set([
  "span",
  "small",
  "abbr",
  "time",
  "sup",
  "sub",
  "u",
  "s",
  "del",
  "mark",
  "q",
  "cite",
  "dfn",
  "kbd",
  "samp",
  "var",
  "label",
  "font",
  "bdi",
  "bdo",
  "data",
  "ins",
]);

const BLOCK_TAGS = new Set([
  "p",
  "div",
  "section",
  "article",
  "main",
  "body",
  "figure",
  "figcaption",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "ul",
  "ol",
  "table",
  "blockquote",
  "pre",
  "hr",
  "details",
  "dl",
  "li",
  "tr",
]);

function inlineOf(node, pageUrl) {
  if (node.t === "x") return node.s;
  if (node.t !== "e" || shouldSkip(node)) return "";
  const { n, a, c } = node;
  if (n === "br") return "\n";
  if (n === "img") {
    const alt = (a.alt ?? "").trim();
    if (!alt) return "";
    const src = resolveUrl(a.src ?? "", pageUrl);
    return src ? `![${alt}](${src})` : `![${alt}]()`;
  }
  if (n === "a") {
    const inner = c
      .map((ch) => inlineOf(ch, pageUrl))
      .join("")
      .trim();
    const href = resolveUrl((a.href ?? "").trim(), pageUrl);
    if (!inner) return "";
    // Linked image: [![alt](src)](href)
    if (c.length === 1 && c[0].t === "e" && c[0].n === "img" && inner.startsWith("![")) {
      return href ? `[${inner}](${href})` : inner;
    }
    if (!href) return inner;
    return `[${inner}](${href})`;
  }
  if (n === "code") {
    const t = collapse(c.map((ch) => inlineOf(ch, pageUrl)).join(""));
    if (!t) return "";
    return `\`${t.replace(/`/g, "'")}\``;
  }
  if (n === "strong" || n === "b") {
    const t = collapse(c.map((ch) => inlineOf(ch, pageUrl)).join(""));
    return t ? `**${t}**` : "";
  }
  if (n === "em" || n === "i") {
    const t = collapse(c.map((ch) => inlineOf(ch, pageUrl)).join(""));
    return t ? `*${t}*` : "";
  }
  if (n === "pre") {
    return collapse(c.map((ch) => inlineOf(ch, pageUrl)).join(""));
  }
  if (BLOCK_TAGS.has(n)) {
    // Block element met in an inline context: flatten with spaces.
    return collapse(c.map((ch) => inlineOf(ch, pageUrl)).join(" "));
  }
  // Transparent inline container (or unknown inline tag).
  return c.map((ch) => inlineOf(ch, pageUrl)).join("");
}

function renderList(node, pageUrl, ctx, out) {
  const ordered = node.n === "ol";
  let num = 0;
  const indent = "  ".repeat(ctx.listDepth);
  for (const li of node.c) {
    if (li.t !== "e" || li.n !== "li" || shouldSkip(li)) continue;
    num++;
    const marker = ordered ? `${num}.` : "-";
    const parts = [];
    let buf = "";
    const flush = () => {
      const t = collapse(buf);
      if (t) parts.push(t);
      buf = "";
    };
    for (const ch of li.c) {
      if (ch.t === "e" && (ch.n === "ul" || ch.n === "ol") && !shouldSkip(ch)) {
        flush();
        parts.push(ch);
      } else {
        buf += inlineOf(ch, pageUrl);
      }
    }
    flush();
    if (parts.length === 0) continue;
    out.push(`${indent}${marker} ${parts[0]}`);
    for (const part of parts.slice(1)) {
      if (typeof part === "string") {
        out.push(`${indent}  ${part}`);
      } else {
        renderList(part, pageUrl, { ...ctx, listDepth: ctx.listDepth + 1 }, out);
      }
    }
  }
}

function renderTable(node, pageUrl, out) {
  const rows = [];
  const walk = (el) => {
    for (const ch of el.c) {
      if (ch.t !== "e") continue;
      if (ch.n === "tr") {
        const cells = [];
        for (const cell of ch.c) {
          if (cell.t === "e" && (cell.n === "th" || cell.n === "td") && !shouldSkip(cell)) {
            cells.push(
              collapse(cell.c.map((g) => inlineOf(g, pageUrl)).join(" ")).replace(/\|/g, "\\|"),
            );
          }
        }
        if (cells.some((cell) => cell !== "")) rows.push(cells);
      } else if (ch.n === "thead" || ch.n === "tbody" || ch.n === "tfoot") {
        walk(ch);
      }
    }
  };
  walk(node);
  if (rows.length === 0) return;
  const width = Math.max(...rows.map((r) => r.length));
  const pad = (r) => r.concat(new Array(Math.max(0, width - r.length)).fill(""));
  const header = pad(rows[0]);
  out.push(`| ${header.join(" | ")} |`);
  out.push(`| ${header.map(() => "---").join(" | ")} |`);
  for (const row of rows.slice(1)) out.push(`| ${pad(row).join(" | ")} |`);
}

function renderPre(node, out) {
  const raw = collectText(node).replace(/\r/g, "");
  const lines = raw.split("\n");
  while (lines.length > 0 && lines[0].trim() === "") lines.shift();
  while (lines.length > 0 && lines[lines.length - 1].trim() === "") lines.pop();
  if (lines.length === 0) return;
  out.push("```\n" + lines.join("\n") + "\n```");
}

function blockElement(node, pageUrl, ctx, out) {
  const { n, a, c } = node;
  if (n === "hr") {
    out.push("---");
    return;
  }
  if (/^h[1-6]$/.test(n)) {
    const t = collapse(c.map((ch) => inlineOf(ch, pageUrl)).join(""));
    if (t) out.push(`${"#".repeat(Number(n[1]))} ${t}`);
    return;
  }
  if (n === "ul" || n === "ol") {
    renderList(node, pageUrl, ctx, out);
    return;
  }
  if (n === "table") {
    renderTable(node, pageUrl, out);
    return;
  }
  if (n === "pre") {
    renderPre(node, out);
    return;
  }
  if (n === "blockquote") {
    const sub = [];
    flowChildren(node, pageUrl, ctx, sub);
    for (const line of sub.join("\n\n").split("\n")) out.push(line.trim() === "" ? ">" : `> ${line}`);
    return;
  }
  if (n === "details") {
    for (const ch of c) {
      if (ch.t === "e" && ch.n === "summary" && !shouldSkip(ch)) {
        const t = collapse(ch.c.map((g) => inlineOf(g, pageUrl)).join(""));
        if (t) out.push(`**${t}**`);
      } else if (ch.t === "e" && BLOCK_TAGS.has(ch.n)) {
        blockElement(ch, pageUrl, ctx, out);
      } else if (ch.t === "e" && !shouldSkip(ch)) {
        const t = collapse(inlineOf(ch, pageUrl));
        if (t) out.push(t);
      } else if (ch.t === "x") {
        const t = collapse(ch.s);
        if (t) out.push(t);
      }
    }
    return;
  }
  if (n === "dl") {
    for (const ch of c) {
      if (ch.t !== "e" || shouldSkip(ch)) continue;
      if (ch.n === "dt") {
        const t = collapse(ch.c.map((g) => inlineOf(g, pageUrl)).join(""));
        if (t) out.push(`**${t}**`);
      } else if (ch.n === "dd") {
        flowChildren(ch, pageUrl, ctx, out);
      }
    }
    return;
  }
  if (n === "img") {
    const t = inlineOf(node, pageUrl);
    if (t) out.push(t);
    return;
  }
  if (n === "a" && c.some((ch) => ch.t === "e" && BLOCK_TAGS.has(ch.n))) {
    // Card-style link wrapping blocks (index cards): linked image,
    // linked heading at its own level, then plain paragraphs.
    const href = resolveUrl((a.href ?? "").trim(), pageUrl);
    const images = [];
    let heading = null;
    let headingLevel = 3;
    const paras = [];
    for (const ch of c) {
      if (ch.t !== "e" || shouldSkip(ch)) continue;
      if (ch.n === "img") {
        const t = inlineOf(ch, pageUrl);
        if (t) images.push(t);
      } else if (/^h[1-6]$/.test(ch.n) && heading === null) {
        heading = collapse(ch.c.map((g) => inlineOf(g, pageUrl)).join(""));
        headingLevel = Number(ch.n[1]);
      } else if (BLOCK_TAGS.has(ch.n)) {
        const t = collapse(ch.c.map((g) => inlineOf(g, pageUrl)).join(" "));
        if (t) paras.push(t);
      } else {
        const t = collapse(inlineOf(ch, pageUrl));
        if (t) paras.push(t);
      }
    }
    for (const img of images) {
      // Linked card image: [![alt](src)](page)
      out.push(href ? `[${img}](${href})` : img);
    }
    if (heading) out.push(href ? `${"#".repeat(headingLevel)} [${heading}](${href})` : `${"#".repeat(headingLevel)} ${heading}`);
    else if (href && paras.length > 0) out.push(`[${paras.shift()}](${href})`);
    else if (href && images.length === 0) out.push(`[link](${href})`);
    for (const p of paras) out.push(p);
    return;
  }
  // Transparent flow container (div/section/article/figure/…).
  flowChildren(node, pageUrl, ctx, out);
}

function flowChildren(node, pageUrl, ctx, out) {
  let buf = "";
  const flush = () => {
    // Keep intentional line breaks (<br>) while dropping pure-whitespace
    // source-formatting lines; single newlines render as spaces in Markdown.
    const text = buf
      .split("\n")
      .map((line) => collapse(line))
      .filter((line) => line !== "")
      .join("\n");
    if (text) out.push(text);
    buf = "";
  };
  for (const ch of node.c) {
    if (ch.t === "x") {
      buf += ch.s;
    } else if (ch.t === "e" && shouldSkip(ch)) {
      continue;
    } else if (ch.t === "e" && ch.n === "br") {
      buf += "\n";
    } else if (ch.t === "e" && (BLOCK_TAGS.has(ch.n) || ch.n === "img" || ch.n === "a")) {
      // Anchors stay inline unless they wrap blocks (handled in blockElement).
      if (ch.n === "a" && !ch.c.some((g) => g.t === "e" && BLOCK_TAGS.has(g.n))) {
        buf += inlineOf(ch, pageUrl);
      } else {
        flush();
        blockElement(ch, pageUrl, ctx, out);
      }
    } else if (ch.t === "e") {
      buf += inlineOf(ch, pageUrl);
    }
  }
  flush();
}

function metaContent(headHtml, attr, value) {
  const re = new RegExp(
    `<meta\\b[^>]*\\b${attr}\\s*=\\s*("|')${value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\1[^>]*>`,
    "i",
  );
  const tag = re.exec(headHtml);
  if (!tag) return "";
  const attrs = parseAttrs(tag[0].replace(/^<meta/i, "").replace(/>$/, ""));
  return (attrs.content ?? "").trim().replace(/\s+/g, " ");
}

function yamlQuote(s) {
  return `"${s.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
}

function extractJsonLd(html) {
  const blocks = [];
  const re = /<script\b[^>]*\btype\s*=\s*("|')application\/ld\+json\1[^>]*>([\s\S]*?)<\/script\s*>/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    const raw = m[2].trim();
    if (!raw) continue;
    try {
      blocks.push(JSON.stringify(JSON.parse(raw), null, 2));
    } catch {
      blocks.push(raw);
    }
  }
  return blocks.join("\n");
}

/**
 * Convert a full HTML page to the Markdown-for-Agents shape:
 * YAML frontmatter + body Markdown + JSON-LD fence.
 */
export function convertHtmlToMarkdown(html, pageUrl) {
  const headMatch = /<head\b[^>]*>([\s\S]*?)<\/head\s*>/i.exec(html);
  const headHtml = headMatch ? headMatch[1] : "";

  const title =
    metaContent(headHtml, "name", "title") ||
    metaContent(headHtml, "property", "og:title") ||
    collapse(collectText(findFirst(parseHtml(headHtml), "title") ?? { t: "x", s: "" }));
  const description =
    metaContent(headHtml, "name", "description") || metaContent(headHtml, "property", "og:description");
  const image = metaContent(headHtml, "property", "og:image");

  const doc = parseHtml(html);
  const scope = findFirst(doc, "main") ?? findFirst(doc, "body") ?? doc;
  const ctx = { listDepth: 0 };
  const out = [];
  flowChildren(scope, pageUrl, ctx, out);

  const parts = [];
  const frontmatter = [];
  if (title) frontmatter.push(`title: ${yamlQuote(title)}`);
  if (description) frontmatter.push(`description: ${yamlQuote(description)}`);
  if (image) frontmatter.push(`image: ${yamlQuote(image)}`);
  if (frontmatter.length > 0) parts.push(`---\n${frontmatter.join("\n")}\n---`);
  const body = out.join("\n\n").replace(/\n{3,}/g, "\n\n").trim();
  if (body) parts.push(body);
  const jsonLd = extractJsonLd(html);
  if (jsonLd) parts.push(`\`\`\`json\n${jsonLd}\n\`\`\``);
  return parts.join("\n\n").trim();
}

function wantsMarkdown(request) {
  const accept = request.headers.get("accept") ?? "";
  return accept
    .split(",")
    .some((part) => part.split(";")[0].trim().toLowerCase() === "text/markdown");
}

function isPagePath(pathname) {
  const m = /\.([A-Za-z0-9]{1,8})(?:[?#]|$)/.exec(pathname);
  if (!m) return true;
  return /^(html?|php|aspx?)$/i.test(m[1]);
}

export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);

  if ((request.method !== "GET" && request.method !== "HEAD") || !wantsMarkdown(request) || !isPagePath(url.pathname)) {
    return context.next();
  }

  const res = await context.next();
  const contentType = res.headers.get("content-type") ?? "";
  if (!res.ok || !contentType.includes("text/html")) return res;

  let html;
  try {
    html = await res.text();
  } catch {
    return res;
  }

  // From here the origin body is consumed: every exit path below must
  // re-wrap `html` instead of returning `res` itself.
  const passthrough = () =>
    new Response(html, { status: res.status, statusText: res.statusText, headers: res.headers });

  let markdown;
  try {
    markdown = convertHtmlToMarkdown(html, url.href);
  } catch {
    return passthrough();
  }
  // Fail safe: never serve a degenerate conversion — fall back to HTML.
  if (!markdown || markdown.trim().length < 120) return passthrough();

  const headers = new Headers(res.headers);
  headers.set("content-type", MARKDOWN_MIME);
  // Vary gains the Accept dimension (token-compared: "Accept-Encoding" must
  // not count as Accept). A bare "*" already varies on everything.
  const varyParts = (headers.get("vary") ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  if (!varyParts.includes("*") && !varyParts.some((p) => p.toLowerCase() === "accept")) {
    varyParts.push("Accept");
  }
  headers.set("vary", varyParts.join(", "));
  for (const h of [
    "content-encoding",
    "content-length",
    "content-range",
    "transfer-encoding",
    "content-md5",
    "etag",
    "last-modified",
    "age",
  ]) {
    headers.delete(h);
  }
  headers.set("x-markdown-tokens", String(estimateTokens(markdown)));
  headers.set("x-original-tokens", String(estimateTokens(html)));

  return new Response(markdown, { status: res.status, statusText: res.statusText, headers });
}
