/**
 * ribbons.ts — the single source of truth for the VirtEngine ribbon field.
 *
 * Both the fixed page veil (RibbonField.astro) and the live glass cards
 * (ribbon-glass.ts) draw from these parameters and geometry helpers, so the
 * ribbons inside white cards are the SAME ribbons drifting behind the dark
 * sections — same positions, same motion, same clock — never a static copy.
 *
 * Sizing/motion note: ribbon widths are ~15% wider than the original drapes
 * and sway ~15% quicker and further (speed and amplitude scaled by 1.15),
 * so the field reads a little more dynamic and open.
 */

export interface RibbonDef {
  /** Horizontal anchor as a fraction of field width. */
  fx: number;
  /** Ribbon width in px at mid-height on a ~1100px field. */
  wd: number;
  /** Static diagonal lean as a fraction of field width. */
  lean: number;
  /** Sway amplitude in px (×1.15 for a more dynamic drift). */
  amp: number;
  /** Spatial frequency of the sway curve. */
  freq: number;
  /** Phase offset. */
  phase: number;
  /** Temporal speed (×1.15 — quicker travel). */
  speed: number;
  /** Depth 0..1 drives parallax + alpha so nearer bands move more. */
  depth: number;
  /** Base alpha. */
  alpha: number;
}

/** Five drapes spread across the full width — the leftmost stays soft and
 *  far so copy stays crisp over it. Widths/speeds/amplitudes ×1.15. */
export const RIBBONS: RibbonDef[] = [
  { fx: 0.22, wd: 201.2, lean: 0.1, amp: 29.9, freq: 1.6, phase: 0.4, speed: 0.184, depth: 0.3, alpha: 0.1 },
  { fx: 0.37, wd: 158.7, lean: 0.12, amp: 39.1, freq: 1.3, phase: 1.7, speed: 0.23, depth: 0.45, alpha: 0.13 },
  { fx: 0.52, wd: 128.8, lean: 0.14, amp: 48.3, freq: 1.1, phase: 2.9, speed: 0.276, depth: 0.62, alpha: 0.16 },
  { fx: 0.67, wd: 98.9, lean: 0.16, amp: 57.5, freq: 0.9, phase: 4.2, speed: 0.322, depth: 0.8, alpha: 0.19 },
  { fx: 0.81, wd: 75.9, lean: 0.18, amp: 66.7, freq: 0.8, phase: 5.5, speed: 0.368, depth: 1.0, alpha: 0.22 },
];

/** Narrow screens get 3 calm drapes instead of 5 — five bands across ~390px
 *  merge into one washed blob. Same ×1.15 treatment. */
export const NARROW_RIBBONS: RibbonDef[] = [
  { fx: 0.3, wd: 151.8, lean: 0.08, amp: 20.7, freq: 1.2, phase: 1.7, speed: 0.207, depth: 0.5, alpha: 0.12 },
  { fx: 0.56, wd: 124.2, lean: 0.1, amp: 27.6, freq: 1.05, phase: 3.1, speed: 0.242, depth: 0.68, alpha: 0.15 },
  { fx: 0.8, wd: 101.2, lean: 0.12, amp: 34.5, freq: 0.9, phase: 4.6, speed: 0.276, depth: 0.88, alpha: 0.18 },
];

/** Breathing drift amplitude (8 × 1.15, in step with the livelier field). */
export const BREATHE_AMP = 9.2;

export interface GeomOpts {
  /** Field width the fx fractions resolve against (viewport for fixed). */
  w: number;
  /** Field height. */
  h: number;
  /** Shared clock time in seconds. */
  time: number;
  /** Lerped scroll dolly 0..1. */
  scrollP: number;
  /** Lerped pointer in [-1, 1]. */
  ptrX: number;
  ptrY: number;
}

/** Horizontal centre of ribbon `r` at height `y` for the given field state. */
export function ribbonCenterX(r: RibbonDef, y: number, o: GeomOpts): number {
  const base = r.fx * o.w;
  const leanShift = (y / o.h - 0.5) * r.lean * o.w;
  const sway = Math.sin((y / o.h) * Math.PI * r.freq + r.phase + o.time * r.speed) * r.amp;
  const breathe = Math.sin(o.time * 0.24 + r.phase) * BREATHE_AMP * r.depth;
  const bend = o.ptrX * 30 * r.depth + o.ptrY * 10 * r.depth * (y / o.h - 0.5);
  const dolly = o.scrollP * -46 * r.depth;
  return base + leanShift + sway + breathe + bend + dolly * 0.4;
}

/** Half-width of ribbon `r` at height `y` (widens toward the viewer). */
export function ribbonHalfWidth(
  r: RibbonDef,
  y: number,
  o: Pick<GeomOpts, "w" | "h"> & { narrow: boolean },
): number {
  const persp = 0.82 + 0.42 * (y / o.h);
  const scale = Math.min(1.15, Math.max(0.6, o.w / 1100)) * (o.narrow ? 0.62 : 1);
  return ((r.wd * persp * scale) / 2);
}

export interface RibbonTrace {
  left: Array<[number, number]>;
  right: Array<[number, number]>;
}

const TRACE_STEPS = 42;

/** Spine trace of ribbon `r` across the field (viewport-space points). */
export function traceRibbon(r: RibbonDef, o: GeomOpts & { narrow: boolean }): RibbonTrace {
  const left: Array<[number, number]> = [];
  const right: Array<[number, number]> = [];
  for (let i = 0; i <= TRACE_STEPS; i++) {
    const y = (i / TRACE_STEPS) * (o.h + 80) - 40 + o.scrollP * 30 * r.depth;
    const cx = ribbonCenterX(r, y, o);
    const hw = ribbonHalfWidth(r, y, o);
    left.push([cx - hw, y]);
    right.push([cx + hw, y]);
  }
  return { left, right };
}

export type RibbonPalette = "dark" | "light";

/**
 * Paint one ribbon. "dark" is the cinematic veil look (translucent green
 * drapes with a lit edge); "light" is the same geometry re-tuned for white
 * cards — soft sage streaks that stay legible under copy.
 */
export function paintRibbon(
  ctx: CanvasRenderingContext2D,
  r: RibbonDef,
  o: GeomOpts & { narrow: boolean; gain?: number },
  palette: RibbonPalette,
): void {
  const { left, right } = traceRibbon(r, o);
  const midX = ribbonCenterX(r, o.h * 0.5, o);
  const hwMid = ribbonHalfWidth(r, o.h * 0.5, o);

  ctx.beginPath();
  ctx.moveTo(left[0][0], left[0][1]);
  for (const p of left) ctx.lineTo(p[0], p[1]);
  for (let i = right.length - 1; i >= 0; i--) ctx.lineTo(right[i][0], right[i][1]);
  ctx.closePath();

  if (palette === "dark") {
    const a = Math.min(0.42, r.alpha * (o.narrow ? 0.85 : 1) * (o.gain ?? 1));
    const g = ctx.createLinearGradient(midX - hwMid, 0, midX + hwMid, 0);
    g.addColorStop(0, `rgba(6, 12, 8, ${a})`);
    g.addColorStop(0.28, `rgba(35, 104, 63, ${a + 0.06})`);
    g.addColorStop(0.52, `rgba(96, 204, 93, ${(a * 0.55).toFixed(3)})`);
    g.addColorStop(0.74, `rgba(35, 104, 63, ${a + 0.04})`);
    g.addColorStop(1, `rgba(6, 12, 8, ${a})`);
    ctx.fillStyle = g;
    ctx.fill();
    // lit edge (left) + dark edge (right) => folded-cloth read
    ctx.beginPath();
    ctx.moveTo(left[0][0], left[0][1]);
    for (const p of left) ctx.lineTo(p[0], p[1]);
    ctx.strokeStyle = `rgba(125, 221, 122, ${(0.1 + r.depth * 0.12).toFixed(3)})`;
    ctx.lineWidth = 1.1;
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(right[0][0], right[0][1]);
    for (const p of right) ctx.lineTo(p[0], p[1]);
    ctx.strokeStyle = "rgba(0, 0, 0, 0.4)";
    ctx.lineWidth = 1.4;
    ctx.stroke();
  } else {
    // Light glass: same spine, whisper-quiet sage so body copy stays crisp.
    const a = r.alpha * (o.narrow ? 0.85 : 1);
    const g = ctx.createLinearGradient(midX - hwMid, 0, midX + hwMid, 0);
    g.addColorStop(0, "rgba(35, 104, 63, 0)");
    g.addColorStop(0.3, `rgba(35, 104, 63, ${(a * 0.85).toFixed(3)})`);
    g.addColorStop(0.52, `rgba(96, 204, 93, ${(a * 1.05).toFixed(3)})`);
    g.addColorStop(0.72, `rgba(35, 104, 63, ${(a * 0.7).toFixed(3)})`);
    g.addColorStop(1, "rgba(35, 104, 63, 0)");
    ctx.fillStyle = g;
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(left[0][0], left[0][1]);
    for (const p of left) ctx.lineTo(p[0], p[1]);
    ctx.strokeStyle = `rgba(35, 104, 63, ${(0.1 + r.depth * 0.08).toFixed(3)})`;
    ctx.lineWidth = 1;
    ctx.stroke();
  }
}

/** Snapshot of the shared field clock published for glass subscribers. */
export interface VeilState {
  t: number;
  scrollP: number;
  ptrX: number;
  ptrY: number;
  narrow: boolean;
  vw: number;
  vh: number;
}

declare global {
  interface Window {
    __veilState?: VeilState;
  }
}

/** Latest published veil clock state, if a veil is driving this page. */
export function veilState(): VeilState | undefined {
  return typeof window !== "undefined" ? window.__veilState : undefined;
}
