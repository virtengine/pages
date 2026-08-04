# DET.io Brand & Design Guide

Design system for **det.io**, the institutional home of DETIO FOUNDATION LTD.
This document is normative: logo construction, tokens, type, spacing, diagram
style, and motion are defined here and implemented in `src/styles/global.css`
and the brand components in `src/components/brand/`.

## Contents

1. [Brand foundations](#1-brand-foundations)
2. [Logo](#2-logo)
3. [Color](#3-color)
4. [Typography](#4-typography)
5. [Spacing, grid & radii](#5-spacing-grid--radii)
6. [Editorial signatures](#6-editorial-signatures)
7. [Diagram style](#7-diagram-style)
8. [Motion](#8-motion)
9. [Accessibility & contrast](#9-accessibility--contrast)
10. [Voice](#10-voice)

---

## 1. Brand foundations

DET.io's identity comes from its **real logo**
(`public/images/detio-logo.png`, sourced from `_agent-context/brand/detio/detio-logo-3d.png`):
a **sky-blue cloud mark** with a lighter highlight puff and a **dark navy
under-shadow**, beside the **"DET·IO" wordmark** and a wireframe-globe "O".
Sampled brand colors: sky blue `#5DBADB`, steel `#4C7094`, navy shadow
`#233040`. The `Lockup` component renders this logo image directly rather than
a reconstructed vector; the flat 2D variant
(`_agent-context/brand/detio/detio-logo-flat.png`) and the hand-built
`CloudMark`/`Wordmark` geometry below remain for historical reference and
single-color/favicon-style uses only.

The design language is **institutional paper**: cool blue-tinted light
surfaces, editorial double keylines, numbered folio sections, mono "evidence
register" citations (ACN, clause refs, patent numbers), and a deep-navy night
band for the footer and closing sections. The site must read like the annual
report of a serious research foundation that happens to have a friendly cloud
as its mark — the cloud supplies warmth; the typography and rules supply
gravitas.

Explicitly banned: purple gradients, glassmorphism heroes, emoji, stock
imagery, the generic dark-slate-with-teal template look, and any invented
statistics or claims.

## 2. Logo

### 2.1 Cloud mark construction

`src/components/brand/CloudMark.astro` rebuilds the flat logo's cloud as clean
geometry (viewBox `0 0 132 96`), in three layers bottom-to-top, exactly as the
original:

1. **Under-shadow** — the cloud silhouette filled navy `#233040`, offset
   `translate(-4 9)`, peeking out at the lower left as in the PNG.
2. **Body** — four circles `(27,60,r16) (52,40,r25) (81,50,r20) (104,61,r14)`
   plus a flat-bottom rounded rect `x14 y50 w104 h27 rx13.5`, filled sky
   `#5DBADB`.
3. **Highlight puff** — three smaller circles at the upper left
   `(34,30,r13) (18,42,r10) (49,24,r9)`, filled `#8FD6EE`.

A `mono` prop renders the body silhouette only in `currentColor` for
favicon-like, single-color uses.

### 2.2 Wordmark construction

`src/components/brand/Wordmark.astro` draws **DET·IO** as pure geometry
(viewBox `0 0 400 104`, stroke 24, `stroke-linecap="round"`), faithful to the
flat logo's uniform-width rounded strokes:

- **D** — stem `M28 22v60` + bowl `M28 22h8a30 30 0 0 1 0 60h-8`
- **E** — three **detached** rounded bars `M112 24h52 / M112 52h52 / M112 80h52`
  (the logo's most distinctive letterform — never join them with a stem)
- **T** — bar `M192 24h60`, stem `M222 24v58`
- **interpunct** — filled circle `(276,58,r11)` at mid-x-height
- **I** — stem `M310 24v58`
- **O** — ring `(358,53,r29)`

The wordmark renders in `currentColor` and is always set in brand sky blue.
**Typeface decision:** the shipped wordmark is hand-drawn SVG, not a font. The
closest typeface equivalent — for use only in non-web collateral where the SVG
is unavailable — is **Baloo 2** (rounded terminals, chunky counters); Fredoka
and Varela Round were evaluated and rejected as too light and too narrow
respectively. The rounded display style is reserved exclusively for the
wordmark; body and display text stay editorial (§4).

### 2.3 Lockup

`src/components/brand/Lockup.astro`: cloud mark at size *S*, gap `0.26 × S`,
wordmark at `0.56 × S` height, and an optional letterspaced
**FOUNDATION** supporting line (Space Grotesk 600, `0.24 × S`, steel on light /
night-muted on dark) beneath the wordmark — the lockup form for the legal
entity DETIO FOUNDATION LTD.

### 2.4 Usage rules

| Rule | Value |
| --- | --- |
| Clearspace | ≥ 0.5 × mark height on all sides |
| Minimum mark size | 20 px rendered height (shadow legibility limit) |
| Minimum lockup size | 28 px mark (supporting line hidden below 32 px) |
| Header | lockup **with** FOUNDATION line, mark 36 px |
| Footer | lockup with FOUNDATION line, mark 40 px, `onDark` |
| Favicon / avatars | mark only on night `#16202b` rounded square |
| OG / social | mark + wordmark geometry on night, sky accent bar |

**Do:** use the mark on paper, white, or night surfaces; keep the three-layer
construction; use the `mono` variant when a single color is required.
**Don't:** rotate or flip the mark, drop the shadow layer at sizes ≥ 20 px,
recolor the body to anything other than sky/`currentColor`, join the E bars,
reconstruct the wordmark in a font, or place the sky-blue mark on sky-blue.

## 3. Color

All tokens are defined in `@theme` in `src/styles/global.css`.

### 3.1 Brand blue scale (from sky `#5DBADB`)

| Token | Hex | Role |
| --- | --- | --- |
| `--color-sky` | `#5dbadb` | The brand blue: mark body, graphic fills, night-CTA background |
| `--color-sky-bright` | `#8fd6ee` | Highlight puff; accent text + hover on night |
| `--color-sky-wash` | `#e3f3fa` | Tinted callout panels ("why this matters") |
| `--color-blue-deep` | `#1a6f97` | **Interactive blue on light** (links, buttons, chips) — AA on white |
| `--color-blue-mid` | `#2586b1` | Hover state of `blue-deep` |

Rule: `#5DBADB` is a *graphic* color, not a text color on light surfaces
(≈2.2:1 on white). Interactive and text blue on light is `blue-deep`.

### 3.2 Steel & navy (from `#4C7094` / `#233040`)

| Token | Hex | Role |
| --- | --- | --- |
| `--color-steel` | `#4c7094` | Secondary accent, FOUNDATION supporting line (AA on white, 5.2:1) |
| `--color-navy` | `#233040` | Cloud under-shadow; strong graphic dark |
| `--color-ink` | `#17222b` | Headings, strong text |
| `--color-text-muted` | `#3e5261` | Body text |
| `--color-text-soft` | `#5b7080` | Secondary text, mono captions |
| `--color-amber-deep` | `#8a5c12` | Reserved for warnings only |

### 3.3 Surfaces

| Token | Hex | Role |
| --- | --- | --- |
| `--color-paper` | `#f6f9fb` | Page background (cool blue-tinted paper) |
| `--color-surface` | `#ffffff` | Cards, tables, panels |
| `--color-vellum` | `#ebf2f7` | Chip backgrounds, gradients |
| `--color-sage` | `#ddeaf2` | Quiet tinted areas |
| `--color-hairline` | `#d9e2e9` | Hairlines, card borders |
| `--color-hairline-strong` | `#b4c6d2` | Emphasized rules, underline decoration |

### 3.4 Night band (footer, closing CTAs)

| Token | Hex | Role |
| --- | --- | --- |
| `--color-night` | `#16202b` | Deep navy band background |
| `--color-night-panel` | `#1e2c3b` | Panels on night |
| `--color-night-hairline` | `#2c3d4f` | Rules on night |
| `--color-night-text` | `#eaf2f8` | Text on night |
| `--color-night-muted` | `#a2b7c7` | Secondary text on night |

## 4. Typography

| Face | Weights | Role |
| --- | --- | --- |
| **Space Grotesk** | 500/600/700 | Display: headings, buttons, nav — editorial, slightly technical |
| **Inter** | 400/500/600 | Body text |
| **JetBrains Mono** | 400/500 | Evidence register: clause refs, ACN, eyebrows, captions, tables of record |

Pairing rationale: the wordmark's rounded display voice is deliberately **not**
echoed in the UI type — a rounded body face would tip the institution into
toyland. Space Grotesk carries display duties with enough geometric character
to sit beside the mark without imitating it; this is the same family stack as
virtengine.com, docs.virtengine.com, and identity.org.au, preserving ecosystem
kinship. Loaded via `@fontsource` in `src/layouts/Base.astro`.

Scale (fluid): h1 `text-4xl → 3.6rem`, h2 `text-3xl/4xl`, h3 `text-lg–2xl`,
body `1.0625rem/1.7`, mono captions `0.72–0.78rem` with `0.14–0.18em`
tracking. Headings track `-0.015em`, `text-wrap: balance`.

## 5. Spacing, grid & radii

- Container `max-width: 74rem`, inline padding `clamp(1.25rem, 4vw, 2.5rem)`.
- Section rhythm `py-14 md:py-20`; card padding `p-5–p-8`.
- Radii: `--radius-card: 0.5rem`, `--radius-frame: 0.75rem` — sharper than the
  sibling sites; printed, institutional.
- Backdrop: 56 px hairline lattice (`.lattice-backdrop`), masked radially from
  the top — engineering paper, not decoration.

## 6. Editorial signatures

Carried over from round 1 and re-expressed in blue:

- **Double keyline** (`.rule-double`): 2.5 px ink rule with a 1 px hairline
  echo 3.5 px below — opens every numbered section.
- **Numbered folio sections**: two-digit mono numerals in the eyebrow.
- **Evidence register**: `ClauseRef` chips (`cl 18.3`, `sch 1`) in JetBrains
  Mono on vellum, blue-deep text — every legal claim is cited inline.
- **"Why this matters" callouts**: sky-wash panel with a 4 px sky left border.
- **Breadcrumb trail**: mono, chevron-separated, on every interior page,
  mirrored by BreadcrumbList JSON-LD.

## 7. Diagram style

Hand-drawn inline SVG only (7 diagrams in `src/components/diagrams/`). Line
weight 1.5–2.5, `vector-effect` avoided in favor of fixed viewBoxes; labels in
JetBrains Mono. On light frames (`DiagramFrame`): ink lines, blue-deep accents.
Legacy `--color-blue-*`/`--color-sky-*` variables flow into the diagram
components via the token rename, so all figures render in the brand blues.
Every diagram carries a full-text `aria-label` and a mono `figcaption`
(`fig 01 — …`).

## 8. Motion

- Reveal-on-scroll via CSS `animation-timeline: view()` (zero JS), entry range
  0–42%, 0.8 s ease-out rise.
- Diagram primitives: `.flow-dash` (dash march), `.node-pulse`, `.orbit-slow`,
  `.ring-breathe`.
- All motion collapses under `prefers-reduced-motion: reduce` (durations to
  0.01 ms; dashes become solid).
- Only client-side JS on the site: the mobile nav toggle in `Header.astro`.

## 9. Accessibility & contrast

| Pair | Ratio | Use |
| --- | --- | --- |
| ink `#17222b` on paper `#f6f9fb` | ≈15.6:1 | headings/body — AAA |
| text-muted `#3e5261` on white | ≈8.0:1 | body — AAA |
| blue-deep `#1a6f97` on white | ≈5.1:1 | links/buttons — AA (AAA large) |
| white on blue-deep | ≈5.1:1 | primary buttons — AA |
| steel `#4c7094` on white | ≈5.2:1 | supporting line — AA |
| night-text `#eaf2f8` on night `#16202b` | ≈14.6:1 | footer — AAA |
| sky-bright `#8fd6ee` on night | ≈9.5:1 | night accents — AAA |
| sky `#5dbadb` on night | ≈7.0:1 | night CTA fill (with navy text ≈2.9:1 — large/bold only) |

Sky `#5DBADB` never carries small text on light. Focus states: 2.5 px
blue-deep outline, 3 px offset. Skip link, landmarks, `aria-current`,
heading hierarchy, and per-diagram text alternatives throughout.

## 10. Voice

Institutional, precise, evidence-first. Every claim cites a clause, a patent
number, or a repository path. State intent as intent (ACNC registration),
research as research (DSEMA), and never invent numbers, staff, partners, or
status. Sentence-case headings; no exclamation marks; "the foundation", not
"we're on a mission".
