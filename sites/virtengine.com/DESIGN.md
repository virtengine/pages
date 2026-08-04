# VirtEngine Brand & Design Guide

Design system for **virtengine.com**. This document is normative: tokens, logo rules,
type, spacing, diagram style, and motion are defined here and implemented in
`src/styles/global.css` and the brand components in `src/components/brand/`.

## Contents

1. [Brand foundations](#1-brand-foundations)
2. [Logo](#2-logo)
3. [Color](#3-color)
4. [Typography](#4-typography)
5. [Spacing, grid & radii](#5-spacing-grid--radii)
6. [Triangle geometry motifs](#6-triangle-geometry-motifs)
7. [Diagram style](#7-diagram-style)
8. [Motion](#8-motion)
9. [Accessibility & contrast](#9-accessibility--contrast)
10. [Voice](#10-voice)

---

## 1. Brand foundations

VirtEngine's identity comes from its **original logo** (see
`_agent-context/brand/virtengine/`): a **nested double inverted-triangle mark** in
green `#60CC5D`, a thin geometric "VirtEngine" wordmark in grey `#575757`, and a
"by DET.io" byline. The website is built around exactly these assets — nothing invented.

The design language is **engineering paper**: light grey-green surfaces, ruled
hairlines, strong grey typography, and green used as the *single* accent. Technical
figures render on dark "diagram plates" (night surfaces) like blueprints — the one
place the site goes dark, deliberately.

The mark's triangles **point down**. In protocol terms that direction is meaningful —
workloads *deploy down* to infrastructure, usage *settles down* from escrow — and the
downward delta recurs as a motif: bullet glyphs, breadcrumb separators, section
dividers, and clipped panel corners.

Explicitly banned: purple gradients, glassmorphism hero clichés, emoji, stock
imagery, and the generic dark-slate-with-teal AI template this site previously used.

## 2. Logo

### 2.1 Construction

The mark is rebuilt as clean geometry from the traced original
(`virtengine-mark.svg`, potrace output) in `src/components/brand/Mark.astro`:

- **Back ring** — inverted-triangle outline, offset up-right: vertices
  `(42,6) (118,6) (80,72)`, stroke 10 (viewBox `-10 -6 140 114`).
- **Front ring** — inverted-triangle outline, offset down-left: vertices
  `(2,26) (78,26) (40,92)`, stroke 10. Where the rings cross, the front ring
  **knocks out** of the back ring (17-unit mask halo), exactly as in the original —
  so the mark works on any surface without a background rectangle.
- **Core** — solid inverted triangle centered in the front ring: vertices
  `(25,40) (55,40) (40,66)`.

The mark takes `currentColor`; brand green is applied via `text-green`.

### 2.2 Lockup

`src/components/brand/Lockup.astro` recreates the full logo lockup:

- Mark at size *S*, gap `0.32 × S`, wordmark **"VirtEngine"** in Questrial at
  `0.68 × S`, grey `#575757` (`--color-slate`).
- Optional byline **"by DET.io"** at `0.3 × S`, light grey (`--color-faint`),
  right-aligned under the wordmark — matching the original PNG.
- On dark surfaces (`onDark`), the wordmark inverts to `--color-night-text`;
  the mark stays brand green.

### 2.3 Usage rules

| Rule | Value |
| --- | --- |
| Clearspace | ≥ 0.5 × mark height on all sides |
| Minimum mark size | 16 px rendered height |
| Minimum lockup size | 22 px mark size (wordmark stays legible) |
| Header | lockup without byline, mark 30 px |
| Footer | lockup **with** byline (the formal, attributed form) |
| Favicon / avatars | mark only, green on transparent |

**Do:** use the mark alone as a bullet/accent glyph at small sizes; recolor via
`currentColor` to brand green or night-text white.
**Don't:** rotate the mark (down is the brand direction), outline the solid core,
recolor to anything other than brand green / white / ink, place the green mark on
green backgrounds, stretch the lockup, or reconstruct the wordmark in another font.

## 3. Color

All tokens are defined in `@theme` in `src/styles/global.css`.

### 3.1 Green scale (from brand green `#60CC5D`)

| Token | Hex | Role |
| --- | --- | --- |
| `--color-green` | `#60cc5d` | The brand green: mark, glyphs, fills with dark text, diagram accents |
| `--color-green-bright` | `#7ddd7a` | Hover/glow on night surfaces |
| `--color-green-deep` | `#2b7d29` | **Interactive green on light surfaces** (links, buttons) — AA on white |
| `--color-green-dark` | `#1f611e` | Hover state of `green-deep` |
| `--color-green-soft` | `#dcf3db` | Tinted borders, quiet emphasis |
| `--color-green-wash` | `#eff8ee` | Tinted panel backgrounds |

Rule: `#60CC5D` is a *graphic* color, not a text color on light surfaces (2.1:1 on
white). Text and interactive elements on light use `green-deep`/`green-dark`.

### 3.2 Grey scale (from wordmark grey `#575757`)

| Token | Hex | Role |
| --- | --- | --- |
| `--color-ink` | `#262b26` | Headings, strong text |
| `--color-slate` | `#575757` | Body text (the wordmark grey) |
| `--color-muted` | `#6d736d` | Secondary text |
| `--color-faint` | `#7c827c` | Small print, mono captions (large/mono only) |
| `--color-line` | `#dee3de` | Hairlines, card borders |
| `--color-line-strong` | `#c2cac2` | Emphasized rules, secondary button borders |

### 3.3 Surfaces

| Token | Hex | Role |
| --- | --- | --- |
| `--color-paper` | `#f7f8f7` | Page background (engineering paper) |
| `--color-paper-soft` | `#eef1ee` | Alternate bands, inline-code background |
| `--color-panel` | `#ffffff` | Cards and panels |

### 3.4 Night surfaces (footer + diagram plates)

| Token | Hex | Role |
| --- | --- | --- |
| `--color-night` | `#1b201b` | Footer, diagram plate background |
| `--color-night-deep` | `#141814` | Deepest wells |
| `--color-night-panel` | `#232923` | Nodes/panels on night |
| `--color-night-line` / `-strong` | `#313931` / `#465046` | Rules on night |
| `--color-night-text` | `#e9eee9` | Headings/text on night |
| `--color-night-muted` | `#a7b1a7` | Body on night |
| `--color-night-faint` | `#828c82` | Small print on night |

The `.night-scope` class applies these and **remaps the diagram components' color
variables** (legacy `--color-teal-*`, `--color-panel`, etc.) so every technical
figure renders green-on-night without per-diagram edits.

### 3.5 Semantic

| Token | Hex | Role |
| --- | --- | --- |
| `--color-amber` | `#9a6700` | Risk/warning text (slashing callouts) — AA on light |
| `--color-amber-soft` | `#fdf3d7` | Warning tint |

## 4. Typography

| Face | Package | Weights | Role |
| --- | --- | --- | --- |
| **Questrial** | `@fontsource/questrial` | 400 | Display (h1/h2) and wordmark. Chosen as the closest live match to the original logo's thin geometric sans — circular bowls, single weight, quiet confidence. |
| **Inter** | `@fontsource/inter` | 400/500/600 | UI, body, card titles (h3/h4 at 600) |
| **JetBrains Mono** | `@fontsource/jetbrains-mono` | 400/500 | Module names, data, eyebrows, captions, breadcrumbs |

Why this pairing: Questrial carries the brand's geometry at display sizes but has no
bold — so headings stay light and architectural like the wordmark, while Inter's 600
does the workhorse emphasis at small sizes where Questrial would fail. Mono marks
everything that is *data* (module paths, figures, decision records), reinforcing the
engineering register.

### Type scale

| Level | Size | Face/weight |
| --- | --- | --- |
| Display (h1) | `text-4xl` → `text-6xl` (2.25–3.75 rem) | Questrial 400, `line-height: 1.1` |
| Section (h2) | `text-3xl` → `2.6rem` | Questrial 400 |
| Card title (h3) | `text-base`–`text-lg` | Inter 600, ink |
| Body | `text-base` (1 rem), `line-height: 1.65` | Inter 400 |
| Small/support | `text-sm` | Inter 400/500 |
| Eyebrow / caption | `0.74rem` mono, tracking `0.18em`, uppercase | JetBrains Mono 500 |

## 5. Spacing, grid & radii

- Container: `74rem` max, `clamp(1.25rem, 4vw, 2.5rem)` inline padding (`.container-site`).
- Section rhythm: `py-14 md:py-20`; section headers carry a top hairline rule
  (`.section-head`) — the ruled-paper signature.
- Hero bands use `.grid-backdrop`: 72 px engineering grid in `--color-line`, faded
  by a radial mask.
- Radii are deliberately tight (engineering, not bubbly): `--radius-card: 0.375rem`,
  `--radius-frame: 0.5rem`, buttons `rounded-sm`.
- Grids: 2–3 columns for cards, 4–5 for step sequences; gaps `gap-3`–`gap-5`.

## 6. Triangle geometry motifs

All derive from the mark and are implemented as utilities:

- `.eyebrow::before` — small green downward delta before every section kicker.
- `.tri-list` — list bullets as green downward deltas (`clip-path: polygon(0 0, 100% 0, 50% 100%)`).
- `.clip-corner` — cards/buttons with the top-right corner clipped at 45° (1.1 rem),
  a triangle subtracted from the panel.
- `.delta-divider` — a downward delta notch marking the transition into the night
  footer.
- Breadcrumb separators — tiny downward deltas, not chevrons.

Use at most two motifs per viewport region; the motif is seasoning, not soup.

## 7. Diagram style

- Figures live on **night plates** (`DiagramFrame`: `.night-scope` + clipped corner
  + hairline border + mono caption `fig NN — …`).
- Strokes: 1.5–2 px, `--color-night-line-strong` for structure; brand green
  (`--color-teal-bright` remapped → green) only for active paths, nodes, and labels
  that carry meaning.
- Text inside figures: mono for identifiers, small sans for labels; night-muted.
- Every figure has a complete `aria-label` narration and a mono `figcaption`.
- Flow direction follows the brand: processes flow left→right, settlement/deployment
  flows *down*.

## 8. Motion

- Zero client JS for motion. Scroll reveals use CSS
  `animation-timeline: view()` (`.reveal`), gated behind `@supports` and
  `prefers-reduced-motion: no-preference`.
- Diagram primitives: `.flow-dash` (marching dashes on flow edges), `.node-pulse`
  (opacity pulse), `.orbit-drift` (slow rotation). All are disabled or neutralized
  under `prefers-reduced-motion: reduce`.
- Transitions: color only, 150 ms ease. No transform hover gimmicks.

## 9. Accessibility & contrast

Measured contrast ratios for the canonical combinations:

| Foreground | Background | Ratio | Use |
| --- | --- | --- | --- |
| `ink #262b26` | `paper #f7f8f7` | ~13.9:1 | Headings/body ✅ AAA |
| `slate #575757` | `paper #f7f8f7` | ~6.8:1 | Body ✅ AAA-small |
| `slate #575757` | `panel #ffffff` | ~7.4:1 | Card body ✅ AAA |
| `muted #6d736d` | `panel #ffffff` | ~5.0:1 | Secondary ✅ AA |
| `faint #7c827c` | `panel #ffffff` | ~4.0:1 | Large/mono captions only ✅ AA-large |
| `green-deep #2b7d29` | `panel #ffffff` | ~4.9:1 | Links/buttons ✅ AA |
| `white` | `green-deep #2b7d29` | ~4.9:1 | Primary button text ✅ AA |
| `night-text #e9eee9` | `night #1b201b` | ~14.5:1 | Footer headings ✅ AAA |
| `night-muted #a7b1a7` | `night #1b201b` | ~7.3:1 | Footer body ✅ AAA |
| `green #60cc5d` | `night #1b201b` | ~7.6:1 | Diagram accents ✅ AAA |
| `amber #9a6700` | `panel #ffffff` | ~4.6:1 | Warnings ✅ AA |

Additional requirements: skip link, single `h1` per page, landmark structure,
`aria-current` on nav, focus rings in `green-deep` (2 px, 3 px offset), all figures
narrated via `aria-label`, breadcrumbs with `BreadcrumbList` JSON-LD.

## 10. Voice

Engineering candor. Claims trace to the repository or the constitution; risk is
stated plainly (slashing, unbonding, launch posture); mainnet status is quoted
exactly (GO 2026-04-11, windows 2026-04-18/19 UTC) and never inflated. No emoji,
no exclamation-mark marketing, no "revolutionary".
