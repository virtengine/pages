# VirtEngine Brand & Design Guide

Design system for **virtengine.com**. This document is normative: tokens, logo rules,
type, spacing, diagram style, motion, and the artwork system are defined here and
implemented in `src/styles/global.css` (tokens), `src/styles/instrument.css` (the
instrument layer), and the components in `src/components/brand/` and
`src/components/art/`.

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
11. [Artwork system](#11-artwork-system)
12. [Media system](#12-media-system)
13. [Interaction patterns](#13-interaction-patterns-zero-js)

---

## 1. Brand foundations

VirtEngine's identity comes from its **original logo** (`public/brand/virtengine-original.png`): a **nested inverted-V mark** in
green `#60CC5D`, a thin geometric "VirtEngine" wordmark in grey `#575757`, and a
"by DET.io" byline. The website is built around exactly these assets — nothing invented.

The design language is **engineering paper**: light grey-green surfaces, ruled
hairlines, strong grey typography, and green used as the _single_ accent. Technical
figures render on dark "instrument plates" (night surfaces) like blueprints — the one
place the site goes dark, deliberately.

The site's art direction is **precision instruments on engineering paper**: every
figure is framed like an exhibit from a machine catalogue — corner registration ticks,
mono rails, dimension lines, hairline grids — and the brand delta recurs as the
geometric primitive. All artwork is original vector work drawn from that geometry
(never stock imagery), and it is animated with CSS only.

The mark's triangles **point down**. In protocol terms that direction is meaningful —
workloads _deploy down_ to infrastructure, usage _settles down_ from escrow — and the
downward delta recurs as a motif: bullet glyphs, breadcrumb separators, section
dividers, and clipped panel corners.

Explicitly banned: purple gradients, glassmorphism hero clichés, emoji, stock
imagery, and the generic dark-slate-with-teal AI template this site previously used.

## 2. Logo

### 2.1 Construction

The mark is the pixel-exact crop `public/brand/virtengine-icon.png`, taken directly
from the canonical raster artwork. `src/components/brand/Mark.astro` only sizes that
official asset; it must never trace, redraw, recolor, or alter its geometry.

Inside figure SVGs the same asset is placed with `src/components/brand/VImage.astro`
(x/y for the top-left corner, `h` for rendered height). There is no second, hand-drawn
"V" anywhere on the site: if a figure needs the mark, it uses this component. (Note:
a literal `<image>` tag in an `.astro` template is normalised to `<img>` by the
compiler and renders as a broken box — `VImage` injects the tag raw for this reason.)

### 2.2 Lockup

`src/components/brand/Lockup.astro` recreates the full logo lockup:

- Mark at `0.92 × S`, gap `0.13 × S`, wordmark **"VirtEngine"** in Questrial at
  `0.48 × S`, grey `#575757` (`--color-slate`).
- Optional byline **"by DET.io"** at `0.3 × S`, light grey (`--color-faint`),
  right-aligned under the wordmark — matching the original PNG.
- On dark surfaces (`onDark`), the wordmark inverts to `--color-night-text`;
  the mark stays brand green.

### 2.3 Usage rules

| Rule                | Value                                                |
| ------------------- | ---------------------------------------------------- |
| Clearspace          | ≥ 0.5 × mark height on all sides                     |
| Minimum mark size   | 16 px rendered height                                |
| Minimum lockup size | 22 px mark size (wordmark stays legible)             |
| Header              | lockup **with** byline, mark 30 px                   |
| Footer              | lockup **with** byline (the formal, attributed form) |
| Favicon / avatars   | mark only, green on transparent                      |

**Do:** use the official cropped mark alone as a bullet/accent glyph at small sizes.
**Don't:** rotate the mark (down is the brand direction), alter its nested cut-outs,
recolor to anything other than brand green / white / ink, place the green mark on
green backgrounds, stretch the lockup, or reconstruct the wordmark in another font.
**Orientation rule (absolute):** the VirtEngine triangle always points **down**, like
a "V" — in the lockup, in every figure, motif, lattice and watermark. An upward
triangle is a defect, not a variation.

## 3. Color

All tokens are defined in `@theme` in `src/styles/global.css`.

### 3.1 Green scale (from brand green `#60CC5D`)

| Token                  | Hex       | Role                                                                   |
| ---------------------- | --------- | ---------------------------------------------------------------------- |
| `--color-green`        | `#60cc5d` | The brand green: mark, glyphs, fills with dark text, diagram accents   |
| `--color-green-bright` | `#7ddd7a` | Hover/glow on night surfaces                                           |
| `--color-green-deep`   | `#23683f` | **Interactive green on light surfaces** (links, buttons) — AA on white |
| `--color-green-dark`   | `#185132` | Hover state of `green-deep`                                            |
| `--color-green-ink`    | `#123f27` | Pressed/emphasis green                                                 |
| `--color-green-soft`   | `#d9efdc` | Tinted borders, quiet emphasis                                         |
| `--color-green-wash`   | `#eef7ee` | Tinted panel backgrounds                                               |

Rule: `#60CC5D` is a _graphic_ color, not a text color on light surfaces (2.1:1 on
white). Text and interactive elements on light use `green-deep`/`green-dark`.

### 3.2 Grey scale (from wordmark grey `#575757`)

| Token                 | Hex       | Role                                         |
| --------------------- | --------- | -------------------------------------------- |
| `--color-ink`         | `#14291f` | Headings, strong text                        |
| `--color-slate`       | `#4c5951` | Body text (the wordmark grey family)         |
| `--color-muted`       | `#5f6b62` | Secondary text                               |
| `--color-faint`       | `#7b857d` | Small print, mono captions (large/mono only) |
| `--color-line`        | `#e2e7e2` | Hairlines, card borders                      |
| `--color-line-strong` | `#c6d0c8` | Emphasized rules, secondary button borders   |

### 3.3 Surfaces

| Token                | Hex       | Role                                    |
| -------------------- | --------- | --------------------------------------- |
| `--color-paper`      | `#fbfcfb` | Page background (engineering paper)     |
| `--color-paper-soft` | `#f2f5f1` | Alternate bands, inline-code background |
| `--color-paper-deep` | `#e9efe9` | Quieter wells, footer status rail       |
| `--color-panel`      | `#ffffff` | Cards and panels                        |

### 3.4 Night surfaces (footer + instrument plates)

| Token                            | Hex                   | Role                             |
| -------------------------------- | --------------------- | -------------------------------- |
| `--color-night`                  | `#101813`             | Footer, instrument plate ground  |
| `--color-night-deep`             | `#0a100c`             | Deepest wells                    |
| `--color-night-panel`            | `#182219`             | Nodes/panels on night            |
| `--color-night-raised`           | `#1e2a20`             | Chips and raised nodes on night  |
| `--color-night-line` / `-strong` | `#253027` / `#3a4a3c` | Rules on night                   |
| `--color-night-text`             | `#e9f0ea`             | Headings/text on night           |
| `--color-night-muted`            | `#a3b2a4`             | Body on night                    |
| `--color-night-faint`            | `#7d8d7e`             | Small print on night             |

The `.night-scope` class applies these and **remaps the diagram components' color
variables** (legacy `--color-teal-*`, `--color-panel`, etc.) so every technical
figure renders green-on-night without per-diagram edits.

### 3.5 Semantic

| Token                | Hex       | Role                                                |
| -------------------- | --------- | --------------------------------------------------- |
| `--color-amber`      | `#9a6700` | Risk/warning text (slashing callouts) — AA on light |
| `--color-amber-soft` | `#fdf3d7` | Warning tint                                        |

## 4. Typography

| Face               | Package                      | Weights     | Role                                                                                                                                                         |
| ------------------ | ---------------------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Questrial**      | `@fontsource/questrial`      | 400         | Display (h1/h2) and wordmark. Chosen as the closest live match to the original logo's thin geometric sans — circular bowls, single weight, quiet confidence. |
| **Inter**          | `@fontsource/inter`          | 400/500/600 | UI, body, card titles (h3/h4 at 600)                                                                                                                         |
| **JetBrains Mono** | `@fontsource/jetbrains-mono` | 400/500     | Module names, data, eyebrows, captions, breadcrumbs                                                                                                          |

Why this pairing: Questrial carries the brand's geometry at display sizes but has no
bold — so headings stay light and architectural like the wordmark, while Inter's 600
does the workhorse emphasis at small sizes where Questrial would fail. Mono marks
everything that is _data_ (module paths, figures, decision records), reinforcing the
engineering register.

### Type scale

| Level             | Size                                         | Face/weight                       |
| ----------------- | -------------------------------------------- | --------------------------------- |
| Display (h1)      | `text-4xl` → `text-6xl` (2.25–3.75 rem)      | Questrial 400, `line-height: 1.1` |
| Section (h2)      | `text-3xl` → `2.6rem`                        | Questrial 400                     |
| Card title (h3)   | `text-base`–`text-lg`                        | Inter 600, ink                    |
| Body              | `text-base` (1 rem), `line-height: 1.65`     | Inter 400                         |
| Small/support     | `text-sm`                                    | Inter 400/500                     |
| Eyebrow / caption | `0.74rem` mono, tracking `0.18em`, uppercase | JetBrains Mono 500                |

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

Orientation is not a style choice: every triangle in the system points **down**
(apex at the bottom), matching the mark's inverted V. Motif clip-paths, SVG lattice
geometries, figure glyphs and watermarks all follow this; a flipped (apex-up)
triangle anywhere is a bug.

## 7. Diagram style

- Figures live on **night plates** (`DiagramFrame`: `.night-scope` + clipped corner
  + hairline border + mono caption `fig NN — …`).
- Strokes: 1.5–2 px, `--color-night-line-strong` for structure; brand green
  (`--color-teal-bright` remapped → green) only for active paths, nodes, and labels
  that carry meaning.
- Text inside figures: mono for identifiers, small sans for labels; night-muted.
- Every figure has a complete `aria-label` narration and a mono `figcaption`.
- Flow direction follows the brand: processes flow left→right, settlement/deployment
  flows _down_.

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

| Foreground            | Background           | Ratio   | Use                                  |
| --------------------- | -------------------- | ------- | ------------------------------------ |
| `ink #14291f`         | `paper #fbfcfb`      | ~14.4:1 | Headings/body ✅ AAA                 |
| `slate #4c5951`       | `paper #fbfcfb`      | ~7.4:1  | Body ✅ AAA-small                    |
| `slate #4c5951`       | `panel #ffffff`      | ~7.6:1  | Card body ✅ AAA                     |
| `muted #5f6b62`       | `panel #ffffff`      | ~5.6:1  | Secondary ✅ AA                      |
| `faint #7b857d`       | `panel #ffffff`      | ~4.0:1  | Large/mono captions only ✅ AA-large |
| `green-deep #23683f`  | `panel #ffffff`      | ~6.7:1  | Links/buttons ✅ AA                  |
| `white`               | `green-deep #23683f` | ~6.7:1  | Primary button text ✅ AA            |
| `night-text #e9eee9`  | `night #1b201b`      | ~14.5:1 | Footer headings ✅ AAA               |
| `night-muted #a7b1a7` | `night #1b201b`      | ~7.3:1  | Footer body ✅ AAA                   |
| `green #60cc5d`       | `night #1b201b`      | ~7.6:1  | Diagram accents ✅ AAA               |
| `amber #9a6700`       | `panel #ffffff`      | ~4.6:1  | Warnings ✅ AA                       |

Additional requirements: skip link, single `h1` per page, landmark structure,
`aria-current` on nav, focus rings in `green-deep` (2 px, 3 px offset), all figures
narrated via `aria-label`, breadcrumbs with `BreadcrumbList` JSON-LD.

## 10. Voice

Engineering candor. Claims trace to the repository or the constitution; risk is
stated plainly (slashing, unbonding, launch posture); network status is quoted
exactly (TestNet January 2027, MainNet March 2027, separate production approval)
and never inflated. No emoji, no exclamation-mark marketing, no "revolutionary".

## 11. Artwork system

All artwork is original SVG drawn from the brand geometry, framed as **instruments**
and rendered in `src/components/art/`:

| Component            | Role                                                              |
| -------------------- | ----------------------------------------------------------------- |
| `brand/VImage.astro` | The official mark as an SVG `<image>`, for any figure that needs the V. |
| `PlateFigure.astro`  | The instrument frame: night plate, mono rail, corner ticks, caption. Every artwork on the site sits in one. |
| `HeroInstrument.astro` | Compact protocol instrument (orbital rings, validator hexagon) used on inner pages. |
| `NetworkField.astro` | Homepage hero: full-bleed 12s CSS loop of a workload entering the protocol, verification, bids, lease, usage. |
| `MarketplaceBids.astro` | Homepage marketplace instrument: one order, competing bids, selected lease. |
| `VeidScopes.astro` | Homepage identity rings: encrypted scopes and validator marks. |
| `SettlementLedger.astro` | Homepage settlement rail: order → bid → lease → usage → settle. |
| `ArchitectureLayers.astro` | Four-layer protocol map; CSS `:has()` hover illuminates a layer. |
| `SourceTerminal.astro` | Documented `make virtengine` build sequence. |
| `IdentityPrism.astro` | VEID hero, vertical edition: the device, the trust boundary raw identity never crosses, the validator ring, and the proof surfaces below. |
| `VeidPhone.astro`    | The VEID wallet as an app mockup (capture / liveness / proof screens). |
| `HeroArt.astro`      | Compact per-page instruments (`protocol`, `providers`, `staking`, `network`, `learn`, `source`). |
| `SurfaceMotif.astro` | Four motifs for protocol-surface panels. |
| `LatticeMark.astro`  | The nested-**downward**-V lattice used as an ambient watermark (footer, closing band). |

Homepage narrative (fixed order): what it is → see it work → evidence it exists → why it matters → three flagship surfaces → infrastructure kinds → architecture → developer proof → launch status → stewardship → journal → participate. Organisation and mission sit after the protocol, never before.

Rules:

- The frame carries meaning: rail text is always `Fig. NN — what it shows`;
  captions state the flow in protocol terms.
- Artwork is decorative (`aria-hidden`) unless the frame is given a `label`, in
  which case a full text alternative is required and the SVG stays `aria-hidden`
  outside it.
- Mono annotations (`.art-mono-sm`, `.art-mono-xs`) are tuned per component to the
  size the plate actually renders at, so no caption lands below ~10.5px.
- Never place text directly on a flow line; labels get a backing rect or sit
  clear of strokes. Brand names keep their capitalisation (`CometBFT`, `Cosmos
  SDK`, `gRPC`) — set them in Inter, not in uppercased mono.
- Progressive enhancement: every plate renders completely without animation.

## 12. Media system

The site carries **real photography** as its "real world" layer — real people, real
hardware, real rooms. There is no stock-photo look and no AI-generated imagery: every
photograph is public-domain / CC0 source material rendered through one fixed brand
treatment, so a portrait, a data-centre aisle and a padlock read as one system.

### 12.1 Sourcing rules

- Source: Openverse (`api.openverse.org`), filtered to `license=cc0,pdm`. CC0 carries
  no attribution obligation; provenance is recorded anyway.
- `public/media/manifest.json` holds the record for every file (title, creator,
  licence, source URL, treatment, widths). `src/data/media.ts` is generated from it by
  `scripts/build-media-data.py` — components import from there, never by raw path.
- `/media-credits` lists the whole library with its provenance; the footer links to it.
- Banned, permanently: AI-generated images, watermarked stock, imagery of identifiable
  people presented as VEID users, and anything implying the network is live.

### 12.2 Treatment (the pipeline)

1. crop to the layout aspect, 1600 px master;
2. grayscale → contrast → **duotone gradient map** in brand colours
   (`paper`: ink `#12241c` → green `#369642` → paper `#fafcfa`;
   `night`: `#16381f` → green → pale `#c8f2c4`);
3. optional **halftone dot screen** (cell 8–13 px, 15° screen angle) for subjects with
   enough contrast to survive it — never on busy patterns or at hero scale where a
   face must stay legible;
4. export WebP at 720/1100/1200/1440/1920 depending on placement, quality 70–80.

Images are never placed raw: the duotone treatment *is* the brand layer.

### 12.3 Placement

| Component | Use |
| --- | --- |
| `media/MediaFigure.astro` | Any framed image: heroes, cards, journal covers. Takes `slug`, `ratio`, `caption`, `credit`, `priority`, `sizes`. |
| `media/MediaBand.astro` | Full-width band with copy beside (`split` / `reverse`) or over the image (`full`, copy on a paper card). |
| `PageHero` (`media` prop) | The photographic page hero — preferred over abstract art on marketing pages. |
| `BlogCard` | One deterministic image per note (hash of the slug → library index). |

Rules:

- Images sit in a hairline frame with the card radius — the same geometry as every
  other surface; captions are Inter `0.88rem` in `slate`, credits are mono.
- Text never sits directly on a photograph without a scrim (journal covers use a
  top/bottom gradient; the full band uses a paper card).
- Alt text is short and factual, and never describes a person as a customer.
- `priority` only for above-the-fold images; everything else lazy-loads with intrinsic
  `width`/`height` so layout never shifts.

### 12.4 Surfaces

The page background is a **soft brand wash**, never graph paper: no ruled grids,
no dotted lattices behind copy, no "terminal" texture. Depth comes from photography,
hairlines, and the green wash (`.grid-backdrop::before`, `.band-night::before`).
The downward-delta motif remains the only geometric signature (see §6).

## 13. Interaction patterns (zero-JS)

The site's interactive pieces are HTML and CSS only — no client JavaScript is
shipped for them.

- **`:target` tabs** (homepage protocol explorer, VEID verifier scenarios):
  panels are anchors (`<section id="...">`), the control is a link row. The
  default panel shows through
  `.panels:not(:has(:target)) .panel--default`, and the active control is styled
  through `.explorer:has(#id:target) a[href="#id"]`. Under `@supports not
  (selector(:has(*)))` every panel renders stacked — content is never hidden.
- **Scroll reveals** use CSS `animation-timeline: view()` behind
  `@supports` + `prefers-reduced-motion`, as before.
- **Instrument motion**: `rail-cursor` (dash travel), `traveler`
  (`offset-path` particles), `dash-march`, `pulse-ring`, `breathe`, `sweep`,
  `stage-pulse`. All are disabled under `prefers-reduced-motion: reduce`.
- Interactive controls are real links (focusable, keyboard-operable, visible
  focus ring) — never divs with click handlers.
