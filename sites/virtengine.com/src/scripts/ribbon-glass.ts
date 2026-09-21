/**
 * ribbon-glass.ts — live ribbon continuation inside white cards.
 *
 * The old approach painted every white card with a captured still frame
 * (ribbon-glass.webp, viewport-fixed): static streaks that sat frozen while
 * the real veil moved behind the dark sections — and sampled bright or
 * plain areas per card, so some cards showed streaks and others didn't.
 *
 * This module injects a small canvas into each glass card that draws the
 * SAME field (src/scripts/ribbons.ts) in viewport-locked coordinates on the
 * shared veil clock. Streaks line up across neighbouring cards, continue
 * the dark-section drapes, and animate with them. Cards keep a frosted
 * white base (see the "Ribbon glass" block in marketplace.css) so copy
 * stays crisp; without JS the static CSS sheen remains as the fallback.
 *
 * Cost control: canvases only animate while visible (IntersectionObserver),
 * paint at most every other frame, and use the calmer 3-ribbon set on narrow
 * screens. `prefers-reduced-motion` renders a single static frame.
 */

import {
  RIBBONS,
  NARROW_RIBBONS,
  paintRibbon,
  veilState,
  type RibbonDef,
} from "./ribbons";

const GLASS_SELECTOR = [
  ".home-trust-grid article",
  ".home-market-visual",
  ".mk-market-core",
  ".mk-market-node",
  ".buy-tab",
  ".buy-stage",
  ".buy-chip",
  ".mk-listing",
  ".sms-card",
  ".sms-rail",
  ".mk-mixed-catalogue li",
  ".mk-compact-acq li",
  ".mk-rail-band",
  ".mk-more",
  ".mk-viz",
  ".mk-buyer-selector",
  ".mk-order-col",
  ".mk-category-card",
  ".mk-check-col",
  ".mk-fig-card",
  ".mk-life-panel",
  ".mk-acq-panel",
  ".mk-atlas-panel",
  ".mk-wis-panel",
  ".mk-demo-panel",
  ".sol-visual",
  ".mod-tiles a",
  ".learn-map-feature li > a",
  ".provider-readiness li",
  ".veid-detail",
].join(", ");

interface GlassCard {
  el: HTMLElement;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D | null;
  visible: boolean;
  cw: number;
  ch: number;
}

let booted = false;

export function initRibbonGlass(scope: ParentNode = document): void {
  if (booted) return;
  booted = true;
  if (typeof window === "undefined") return;

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  const narrowMQ = window.matchMedia("(max-width: 640px)");

  const cards: GlassCard[] = [];
  scope.querySelectorAll<HTMLElement>(GLASS_SELECTOR).forEach((el) => {
    if (el.dataset.ribbonGlass === "true") return;
    el.dataset.ribbonGlass = "true";
    const canvas = document.createElement("canvas");
    canvas.className = "ribbon-glass-canvas";
    canvas.setAttribute("aria-hidden", "true");
    el.prepend(canvas);
    const ctx = canvas.getContext("2d", { alpha: true });
    cards.push({ el, canvas, ctx, visible: false, cw: 0, ch: 0 });
  });
  if (cards.length === 0) return;

  const dpr = () => Math.min(window.devicePixelRatio || 1, 1.5);
  let ownT = Math.random() * 100;

  function fieldState() {
    const live = veilState();
    if (live) return live;
    const max = Math.max(
      1,
      document.documentElement.scrollHeight - (window.innerHeight || 1),
    );
    return {
      t: ownT,
      scrollP: Math.max(0, Math.min(1, window.scrollY / max)),
      ptrX: 0,
      ptrY: 0,
      narrow: narrowMQ.matches,
      vw: window.innerWidth || 1,
      vh: window.innerHeight || 1,
    };
  }

  function activeRibbons(narrow: boolean): RibbonDef[] {
    return narrow ? NARROW_RIBBONS : RIBBONS;
  }

  function drawCard(card: GlassCard): void {
    const { ctx } = card;
    if (!ctx) return;
    const rect = card.el.getBoundingClientRect();
    if (rect.width < 2 || rect.height < 2) return;
    const scale = dpr();
    const cw = Math.round(rect.width * scale);
    const ch = Math.round(rect.height * scale);
    if (cw !== card.cw || ch !== card.ch) {
      card.cw = cw;
      card.ch = ch;
      card.canvas.width = cw;
      card.canvas.height = ch;
    }
    const s = fieldState();
    ctx.setTransform(scale, 0, 0, scale, -rect.left * scale, -rect.top * scale);
    ctx.clearRect(rect.left, rect.top, rect.width, rect.height);
    const opts = {
      w: s.vw,
      h: s.vh,
      time: s.t,
      scrollP: s.scrollP,
      ptrX: s.ptrX,
      ptrY: s.ptrY,
      narrow: s.narrow,
      gain: 1,
    };
    for (const r of activeRibbons(s.narrow)) paintRibbon(ctx, r, opts, "light");
  }

  function drawVisible(): void {
    for (const card of cards) {
      if (card.visible) drawCard(card);
    }
  }

  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const card = cards.find((c) => c.el === entry.target);
          if (!card) continue;
          card.visible = entry.isIntersecting;
          if (card.visible && reduce.matches) drawCard(card);
        }
      },
      { rootMargin: "120px" },
    );
    cards.forEach((card) => io.observe(card.el));
  } else {
    cards.forEach((card) => {
      card.visible = true;
    });
    drawVisible();
  }

  if (reduce.matches) {
    drawVisible();
    return;
  }

  let frame = 0;
  let running = true;
  function loop(): void {
    if (!running) return;
    ownT += 0.016;
    frame += 1;
    // Glass paints at half rate — the veil carries the 60fps motion.
    if (frame % 2 === 0) drawVisible();
    requestAnimationFrame(loop);
  }
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      running = false;
    } else if (!reduce.matches) {
      running = true;
      requestAnimationFrame(loop);
    }
  });
  // Re-seed static geometry on viewport changes; the loop picks it up.
  window.addEventListener("resize", () => drawVisible(), { passive: true });
  requestAnimationFrame(loop);
}
