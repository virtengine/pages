// Design gate for det.io and identity.org.au — the §7 anti-slop guardrails from
// docs/DESIGN-DIRECTION.md, made lintable the same way check-a11y.mjs is.
//
// Usage: node scripts/check-design.mjs [root]     (exit 1 on any finding)
//        CHECK_DESIGN_SITES=sites/demo node scripts/check-design.mjs [root]
// The optional root and env var exist so the suite in check-design.test.mjs can
// point the real checker at a crafted tree instead of trusting prose.
//
// Rules implemented (numbers follow DESIGN-DIRECTION §7):
//   1  backdrop-filter / filter: blur          -> fail
//   2  linear/radial/conic-gradient            -> fail, allowlist .foil, duotone, --color-foil
//   3  font-family outside the @font-face set  -> fail (tokens, the three faces, generics)
//   4  box-shadow with blur radius > 1px       -> fail (hard offsets and hairlines only)
//   5  border-radius > 1rem                    -> fail unless it is a pill/circle shape
//   6  looping animation (infinite/alternate)  -> fail outside prefers-reduced-motion: no-preference
//   7  marquee role                            -> fail
//   8  uppercase display headings (h1/h2)      -> fail
//   9  letter-spacing tighter than -0.02em     -> fail
//  10  emoji in src/**/*.astro                 -> fail
//  11  contrast                                -> owned by check-a11y budgets, not repeated here
//  12  Plate/Figure without caption + source   -> fail (protects the evidence claim)
// plus Amendment B site rules: no cream surface, no indigo, no
// Space Grotesk / Inter / JetBrains Mono on det.io, and no weight above 400 on
// the 400-only display face. The logo is deliberately out of scope: a brand
// asset is not a design decision and is never linted.
//
// Rule 5 and 6 are read as intent, not letter: a 999px/50% circle is a deliberate
// dot or pill (step numbers, status dots), and hover transitions stay free — only
// looping keyframes must be gated by reduced motion.
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const DEFAULT_ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const ROOT = process.argv[2] ? resolve(process.argv[2]) : DEFAULT_ROOT;
const SITES = (process.env.CHECK_DESIGN_SITES ?? "sites/det.io,sites/identity.org.au")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);
const EXT = new Set([".astro", ".css", ".mjs", ".js", ".svg"]);
const SKIP = new Set(["node_modules", "dist", ".astro", ".git"]);

// Rule 3: everything a page may name. Tokens first — the three faces are wired
// through --font-display / --font-sans / --font-mono in @theme.
const FONT_ALLOW = new RegExp(
  [
    "var\\(--font-(display|sans|mono)",
    "inherit|unset|initial|revert|caption|icon",
    "Instrument Serif", "Archivo", "IBM Plex Mono",
    "Newsreader", "Public Sans",
    "Georgia", "Segoe UI", "system-ui",
    "ui-sans-serif", "ui-serif", "ui-monospace",
    "sans-serif", "serif", "monospace", "cursive", "fantasy",
  ].join("|"),
  "i",
);

// Rule 2: gradients only where they are the product (holographic foil) or a
// duotone image map, per the §7 allowlist.
const GRADIENT_ALLOW = /(^|[^\w-])\.foil\b|--color-foil|duotone/i;
const GRADIENT = /\b(?:linear|radial|conic)-gradient\s*\(/i;

// Rule 10: emoji ranges. Arrows, middot, section and numero signs are type, not emoji.
const EMOJI = /[\u{1F000}-\u{1FAFF}\u{1F1E6}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{FE0F}\u{1F900}-\u{1F9FF}]/u;

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    if (SKIP.has(name)) continue;
    const path = join(dir, name);
    const st = statSync(path);
    if (st.isDirectory()) walk(path, out);
    else if (EXT.has(name.slice(name.lastIndexOf(".")))) out.push(path);
  }
  return out;
}

const findings = [];

function fail(file, rule, detail) {
  findings.push(`${relative(ROOT, file).replaceAll("\\", "/")}  ${rule}  ${detail}`);
}

/** Split CSS into "selector { declaration-list }" pairs, comments removed. */
function* cssBlocks(css) {
  const clean = css.replace(/\/\*[\s\S]*?\*\//g, "");
  let depth = 0;
  let head = "";
  let body = "";
  for (const ch of clean) {
    if (ch === "{") {
      if (depth === 0) {
        head = body;
        body = "";
      }
      depth += 1;
      if (depth === 1) continue;
    } else if (ch === "}") {
      depth -= 1;
      if (depth < 0) return;
      if (depth === 0) {
        yield { sel: head, decl: body };
        head = "";
        body = "";
        continue;
      }
    }
    body += ch;
  }
}

/** Rule 6: looping keyframes that are not wrapped in reduced-motion: no-preference. */
function ungatedLoops(css) {
  const clean = css.replace(/\/\*[\s\S]*?\*\//g, "");
  const stack = [];
  let buf = "";
  const bad = [];
  for (const ch of clean) {
    if (ch === "{") {
      const head = buf.trim();
      stack.push(head.startsWith("@") ? head : null);
      buf = "";
    } else if (ch === "}") {
      stack.pop();
      buf = "";
    } else if (ch === ";") {
      const decl = buf.trim();
      if (/^(?:animation|animation-name)\s*:/i.test(decl) && /\b(?:infinite|alternate)\b/i.test(decl)) {
        const gated = stack.some((h) => h && /prefers-reduced-motion\s*:\s*no-preference/i.test(h));
        if (!gated) bad.push(decl.slice(0, 100));
      }
      buf = "";
    } else {
      buf += ch;
    }
  }
  return bad;
}

/** Rule 4: blur radius of a shadow layer, colours and var() masked out first. */
function shadowBlurs(value) {
  if (!value) return [];
  const masked = value
    .replace(/rgba?\([^)]*\)|hsla?\([^)]*\)/gi, "C")
    .replace(/#[0-9a-f]{3,8}\b/gi, "C")
    .replace(/var\([^)]*\)/gi, "C");
  const blurs = [];
  for (const layer of masked.split(",")) {
    // Offsets may be unitless 0, so every number counts; blur is the third.
    const tokens = [...layer.matchAll(/-?\d*\.?\d+(?:px|rem)?/gi)];
    if (tokens.length < 3) continue;
    const blur = tokens[2][0];
    const unit = (blur.match(/[a-z]+$/i) ?? [""])[0].toLowerCase();
    blurs.push(unit === "rem" ? parseFloat(blur) * 16 : parseFloat(blur));
  }
  return blurs;
}

/** Rule 5: first corner length in px. */
function radiusPx(value) {
  const m = value.match(/(-?\d*\.?\d+)\s*(px|rem)/i);
  if (!m) return 0;
  return m[2].toLowerCase() === "rem" ? parseFloat(m[1]) * 16 : parseFloat(m[1]);
}

/** Rule 5: a circle or pill is a shape decision, not a rounded blob. */
function isCircleOrPill(value) {
  return /\b(?:999\d*(?:px|rem)|50%|100%|9999px)\b/i.test(value);
}

function styleBlocks(file, text, rel) {
  if (rel.endsWith(".css")) return [text];
  return [...text.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map((m) => m[1]);
}

function fontFamilies(text) {
  const out = [];
  // `strict` entries name one family (font-family / @theme token): the first
  // family in the stack is the one the browser will pick, so it is the one that
  // has to be on the list — a banned face hiding behind ", sans-serif" fails.
  const cssValue = /((?:font-family|--font-(?:display|sans|mono)))\s*:\s*((?:"[^"]*"|'[^']*'|[^;}\n])+)/gi;
  for (const m of text.matchAll(cssValue)) out.push({ value: m[2].trim(), strict: true });
  // HTML / SVG attribute form.
  for (const m of text.matchAll(/font-family\s*=\s*"([^"]*)"/gi)) out.push({ value: m[1].trim(), strict: true });
  // `font:` shorthand resets the family too, but it opens with size and weight,
  // so any allowed family anywhere in it clears the rule.
  for (const m of text.matchAll(/(?:^|[{;\s])font\s*:\s*([^;}\n"]+)/gi)) out.push({ value: m[1].trim(), strict: false });
  return out;
}

/** First family of a stack, quotes stripped. */
function firstFamily(value) {
  const m = value.match(/^("(?:[^"]*)"|'(?:[^']*)'|[^,]+)/);
  return (m ? m[1] : value).trim().replace(/^["']|["']$/g, "");
}

for (const site of SITES) {
  const base = join(ROOT, site);
  for (const file of walk(base)) {
    const text = readFileSync(file, "utf8");
    const rel = relative(ROOT, file).replaceAll("\\", "/");
    const isDet = rel.startsWith("sites/det.io");
    const isIdau = rel.startsWith("sites/identity.org.au");

    // ---- whole-file rules ----
    if (/backdrop-filter\s*:|filter\s*:\s*blur\s*\(/i.test(text)) {
      fail(file, "blur", "backdrop-filter / filter:blur is banned");
    }
    if (/role\s*=\s*["']marquee["']/i.test(text)) {
      fail(file, "marquee", "auto-scrolling marquee role");
    }
    if (isIdau && /#28205b/i.test(text)) {
      fail(file, "indigo", "off-palette indigo");
    }
    if (isDet && /#f5f0e2/i.test(text)) {
      fail(file, "cream", "AI cream surface");
    }
    if (isDet && /fontsource\/(inter|space-grotesk|jetbrains-mono)/i.test(text)) {
      fail(file, "font", "banned display/text/mono stack");
    }

    // public/og.svg is the social card: a rasterised brand asset carrying the
    // logo and its original lettering. Its fonts are baked into an image, not
    // live page type, and the card is never restyled — same rule as the logo.
    const isSocialCard = rel.endsWith("public/og.svg");
    if (!isSocialCard) {
      for (const { value, strict } of fontFamilies(text)) {
        const family = strict ? firstFamily(value) : value;
        if (!FONT_ALLOW.test(family)) fail(file, "font", `family outside the allowlist: ${family.slice(0, 70)}`);
      }
    }

    if (file.endsWith(".astro")) {
      for (const line of text.split("\n")) {
        const hit = line.match(EMOJI);
        if (hit) fail(file, "emoji", `emoji in markup: ${hit[0]}`);
      }
    }

    // ---- css-in-file rules ----
    for (const css of styleBlocks(file, text, rel)) {
      for (const bad of ungatedLoops(css)) {
        fail(file, "loop", `animation without prefers-reduced-motion gate: ${bad}`);
      }
      for (const { sel, decl } of cssBlocks(css)) {
        if (GRADIENT.test(decl) && !GRADIENT_ALLOW.test(sel) && !GRADIENT_ALLOW.test(decl)) {
          fail(file, "gradient", `${sel.trim().slice(-70)} carries a gradient`);
        }
        for (const blur of shadowBlurs(decl.match(/box-shadow\s*:\s*([^;]+)/i)?.[1] ?? "")) {
          if (Math.abs(blur) > 1) {
            fail(file, "shadow", `${sel.trim().slice(-60)} blur ${blur}px (hard offsets only)`);
          }
        }
        const radius = decl.match(/border-radius\s*:\s*([^;]+)/i);
        if (radius) {
          const value = radius[1].trim();
          if (!isCircleOrPill(value) && radiusPx(value) > 16 && !/inherit|initial|unset/i.test(value)) {
            fail(file, "radius", `${sel.trim().slice(-60)} ${value.slice(0, 40)}`);
          }
        }
        const targetsDisplay = /(?:^|[\s,>+~])h[12]\b/.test(sel);
        if (targetsDisplay && /text-transform\s*:\s*uppercase/i.test(decl)) {
          fail(file, "uppercase-display", sel.trim().slice(-80));
        }
        // Instrument Serif ships weight 400 only: anything heavier renders as a
        // synthesised faux bold, which is the kind of slop that hides in CSS.
        if (isDet && /var\(--font-display\)/.test(decl)) {
          const weight = decl.match(/font-weight\s*:\s*(\d+)/i);
          if (weight && Number(weight[1]) > 400) {
            fail(file, "faux-bold", `${sel.trim().slice(-60)} font-weight ${weight[1]} on a 400-only display face`);
          }
        }
        const tracking = decl.match(/letter-spacing\s*:\s*(-0?\.\d+em|-0?\.\d+)/i);
        if (tracking) {
          const raw = tracking[1];
          const value = raw.endsWith("em") ? Number.parseFloat(raw) : Number.parseFloat(raw) / 16;
          if (value < -0.02) fail(file, "crushed-tracking", `${sel.trim().slice(-60)} ${raw}`);
        }
      }
    }

    // ---- rule 12: evidence on every plate and framed figure (det.io) ----
    if (isDet && file.endsWith(".astro")) {
      for (const m of text.matchAll(/class="plate"/g)) {
        const window = text.slice(m.index, m.index + 4000);
        const caption = window.match(/<figcaption[\s\S]*?<\/figcaption>/i);
        if (!caption) fail(file, "evidence", "plate has no figcaption");
        else if (!/src:|href=/i.test(caption[0])) fail(file, "evidence", "figcaption has no source line");
      }
      for (const m of text.matchAll(/<DiagramFrame\b/g)) {
        const window = text.slice(m.index, m.index + 4000);
        if (!/caption\s*=\s*(?:\{[^}]*\}|"[^"]*"|'[^']*')/.test(window)) fail(file, "evidence", "DiagramFrame used without caption");
      }
    }
  }
}

if (findings.length) {
  console.error(`check-design: ${findings.length} finding(s)`);
  for (const line of findings) console.error(`  ${line}`);
  process.exit(1);
}

console.log(`check-design: OK (${SITES.join(", ")})`);
