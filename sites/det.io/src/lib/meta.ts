/**
 * Meta-field shaping helpers.
 *
 * Search results truncate ruthlessly: page titles are cut around 60–65
 * characters and meta descriptions around 155–160. Trimming here — at a word
 * boundary, or by dropping a redundant segment — keeps the meaning instead of
 * letting Google slice mid-word.
 *
 * These helpers shape *meta output only*. Visible headings and lede paragraphs
 * keep the full text they were authored with; nothing is rewritten.
 */

/** Truncate on a word boundary, appending an ellipsis when text is dropped. */
export function truncateAtWord(text: string, max: number): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const slice = clean.slice(0, Math.max(1, max - 1));
  const cut = slice.lastIndexOf(" ");
  const body = cut > max * 0.5 ? slice.slice(0, cut) : slice;
  return `${body.replace(/[\s,;:—–-]+$/, "")}…`;
}

/** Drop parenthetical asides — "(ceph)", "(Verifiable Electronic Identity)" — for meta use. */
export function stripParentheticals(text: string): string {
  return text
    .replace(/\s*\([^)]*\)/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export interface FitTitleOptions {
  /** Display budget in characters. Google truncates around 60–65. */
  max?: number;
  /** The site brand that usually trails the title, e.g. "det.io". */
  brand?: string;
}

const SEPARATOR = /\s(?:\||—|–)\s/;
/** A candidate shorter than this says too little to be worth using. */
const MIN_CANDIDATE = 28;

/**
 * Fit a title into the display budget. It prefers dropping a redundant segment
 * over cutting words, walking a ladder of candidates and returning the first one
 * that fits:
 *
 * 1. the whole title;
 * 2. the primary segment (with parentheticals removed) + brand;
 * 3. the primary segment without parentheticals;
 * 4. the title minus its brand suffix;
 * 5. first segment + brand;
 * 6. first segment;
 * 7. the primary segment truncated at a word boundary + brand;
 * 8. the primary segment truncated.
 *
 * "Asset stewardship and the Transferred Assets — DETIO constitution explained
 * | det.io" becomes "Asset stewardship and the Transferred Assets | det.io".
 */
export function fitTitle(title: string, options: FitTitleOptions = {}): string {
  const max = options.max ?? 65;
  const brand = options.brand;
  const clean = title.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;

  const parts = clean.split(SEPARATOR).map((part) => part.trim()).filter(Boolean);
  const primary = parts[0] ?? clean;
  const last = parts[parts.length - 1];
  const brandIsLast = Boolean(brand && last && last.toLowerCase() === brand.toLowerCase());
  const primaryBare = stripParentheticals(primary);
  const primarySuffixless = parts.length > 1 ? parts.slice(0, -1).join(" — ") : clean;

  const ladder: string[] = [];
  if (brand && primaryBare !== primary) ladder.push(`${primaryBare} | ${brand}`);
  if (primaryBare !== primary) ladder.push(primaryBare);
  ladder.push(primarySuffixless);
  if (brand && brandIsLast) ladder.push(`${parts[0]} | ${brand}`);
  if (brand) ladder.push(`${primary} | ${brand}`);
  ladder.push(primary);

  for (const candidate of ladder) {
    if (candidate && candidate.length <= max && candidate.length >= MIN_CANDIDATE) return candidate;
  }

  const fallbackPrimary = primaryBare || primary;
  if (brand && brand.length + 3 < max) {
    const budget = max - brand.length - 3;
    const shorter = truncateAtWord(fallbackPrimary, budget);
    if (shorter.length >= MIN_CANDIDATE) return `${shorter} | ${brand}`;
  }
  return truncateAtWord(fallbackPrimary, max);
}

/** Shape a meta description: single line, word-boundary truncation, ≤ max chars. */
export function metaDescription(description: string, max = 158): string {
  return truncateAtWord(description, max);
}