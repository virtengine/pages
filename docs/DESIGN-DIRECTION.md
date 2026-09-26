# Design direction 2026 — det.io & identity.org.au

**Status:** Amendment B implemented in `sites/det.io` and `sites/identity.org.au` (2026-09-25). The sweep changes what the pages are made of — never the logo: det.io still ships `public/images/detio-logo.png`. Virtengine.com is out of this pass.
**Scope:** `sites/det.io`, `sites/identity.org.au` (with a note on `sites/virtengine.com` for family coherence)
**Method:** measured audits of the live sites, measured audits of Awwwards-winning sites, a published AI-slop taxonomy, and font-availability checks against the actual npm packages this repo can install.

---

## 0. The one-paragraph answer

Both sites are already **anti-AI-slop by intent** (their `DESIGN.md` files ban purple gradients, glassmorphism and stock imagery) — and yet both still *read* as AI-built, for two different reasons:

* **det.io** uses the exact typographic stack and beige/neobrutalist texture of the current AI generation. Measured: `Space Grotesk` + `Inter` + `JetBrains Mono` on `#f5f0e2` cream, with hard offset shadows, tickers, grain and stamps. That is the 2025–26 "GPT look", not a brand.
* **identity.org.au** is so restrained it has no voice at all: measured `Public Sans` only, one white, one blue, `6px` corners, **zero** gradients, one hairline shadow across 701 elements. It reads as an unbranded gov template rather than as a product people choose.

The fix is not "more effects" and it is not 3D. The measured pattern across 2026 Awwwards winners is **two colours + a considered type trio + one signature interaction**, with 3D used as a single set-piece rather than as a style. So the proposed direction is:

> **One family system built on the language of proof.**
> **det.io = "The Record"** — a two-colour research monograph with Tufte-style margin evidence, folios and plates.
> **identity.org.au = "The Credential"** — security-print identity: guilloché grounds generated from real record numbers, ID-1 cards, an MRZ data voice, and a single laminate foil that means *verified*.

Both directions turn what the organisations already claim (evidence-first; prove one thing and reveal nothing) into layout, type and motion. Nothing decorative that isn't also *true*.

---

## 1. Research performed

| # | Source | What it gave us |
|---|---|---|
| R1 | Live audit of `https://det.io/` (browser, computed styles, 1,308 elements) | Actual fonts, colours, radii, shadows, gradients, 3D flags |
| R2 | Live audit of `https://identity.org.au/` (701 elements) | Same |
| R3 | Live audit of `https://areyoufoundbyai.com/` (4,000 elements, capped) | The "AI 3D" reference the brief names |
| R4 | Awwwards Sites of the Day index + per-site records (Sep 2026 → Jul 2026) | Winner palettes, tech tags, highlighted "elements" |
| R5 | Awwwards Typography Honors index | Which type directions actually win |
| R6 | Live audits of three winners: `mosbyfiles.com`, `stripe.press/poor-charlies-almanack`, `brand.squarespace.com` | Real fonts + palettes of type-led winners |
| R7 | `impeccable.style/slop` — 67 published anti-patterns in 9 categories | The current slop taxonomy, used as our checklist |
| R8 | Figma "Top Web design trends for 2026" | Where the mainstream is heading (and what to avoid) |
| R9 | npm registry checks of 40 `@fontsource/*` packages | Which proposed fonts this repo can actually install |
| R10 | Repo inventory (`sites/*`, `DESIGN.md`, `scripts/`, CI) | Constraints: Astro 5, Tailwind v4 `@theme`, zero-JS motion, a11y/link/markdown CI gates |

---

## 2. Diagnosis — why the sites read as "AI"

### 2.1 det.io, measured

| Signal | Measured value | Verdict |
|---|---|---|
| Body font share | `Inter` **669** text elements · `JetBrains Mono` **239** · `Space Grotesk` **78** | Inter + JetBrains is the dev-tool default; explicitly listed as slop ("Overused font… Inter and Geist can make unrelated products look alike") |
| H1 | `Space Grotesk` 700, **62px**, `uppercase`, `letter-spacing: -1.86px`, `line-height: 60.76px` | Uppercase display + crushed tracking + stacked sans = the AI hero signature |
| Paper | `rgb(245,240,226)` = **#F5F0E2** | "Cream / beige palette… a default substitute for a considered palette" (slop rule) |
| Shadows | `rgb(29,26,19) 5px 5px 0` ×10 · `8px 8px 0` ×4 · `3px 3px 0` | Neobrutalist hard-offset sticker shadows (2026 slop era "GPT neobrutalist take") |
| Radii | `5px` ×62, plus 3/4/6/7/8/10px | Nine radius values, none load-bearing |
| Gradients | 8 | OK, but combined with grain + halftone + lattice = texture for texture's sake |
| `backdrop-filter` | 1 | Should be 0 (only `virtengine.com` has a defensible case) |
| 3D / perspective | **0** | Important: det.io has *no* 3D — the "AI look" here is typographic, not spatial |
| Motion | `animation-timeline: view()` reveals, ticker marquees | Auto-scrolling marquee is a named slop rule |

**Reference check (R3).** The site named in the brief, `areyoufoundbyai.com`, measures as **`Space Grotesk` (228 elements) + `Space Mono` (97) + `Fraunces`**, cream `#FCFAF6`, ink `#1A1917`, one `<canvas>` for 3D, 7 gradients, 36 shadows. **det.io is two fonts away from the AI reference site.** Its 3D is not the problem; the shared default typography and cream surface are.

### 2.2 identity.org.au, measured

| Signal | Measured value | Verdict |
|---|---|---|
| Fonts | `Public Sans` **539** elements, nothing else | One face, four weights → flat hierarchy (slop: "Flat type hierarchy", "Single font for everything") |
| H1 | 50px / 800 / `-1px` / lh 52px | Competent, but indistinguishable from any SaaS/gov page |
| Surfaces | `#FFFFFF` ×35, `#F3F5F6` ×19, `#17293A` ×14 | Only three surfaces — no rhythm, no counterweight |
| Gradients | **0** | Honest, but also = no identity device of any kind |
| Decor | fingerprint-ridge arcs at ~5% ink (documented as the *only* pattern) | The only brand-specific mark on the site is nearly invisible |
| Off-brand | `scripts/og.mjs` renders `fill="#28205b"` (indigo) on `#fbf8f5` | The only purple in either site, in social cards |

**Verdict:** the two sites are pulling in opposite directions — one is over-textured, the other is bare. Neither has an ownable device.

### 2.3 The slop taxonomy, mapped (R7)

`impeccable.style/slop` publishes 67 rules. The ones that apply to us:

**det.io — remove or justify**
* Auto-scrolling marquee tickers (detected, used in ≥2 bands) → replace with a static justified credit line, or add a pause control and `role="presentation"`.
* Cream/beige as default surface → move to a neutral stock (§4.2).
* Hard-offset shadow on every card → reserve for one component only (the plate), not the layout.
* Badge/pill above headline → move status into the headline or the folio line.
* Decorative grid-line background → the `lattice-backdrop` is framed as "engineering paper", but visually it is the named anti-pattern; replace with *ruled measurement* that carries data (§4.4).
* Grain + halftone as ambient texture → keep halftone only inside two-colour imagery where it is a real printing screen.
* Crushed letter-spacing at display size, flat hierarchy in body → fix via the type scale (§4.3).
* Tiny numbered section labels → keep numbering (it *does* follow a sequence: File 01…04) but make the folio do real work.

**identity.org.au — add, because its failure is the other failure**
* Flat hierarchy, single font for everything, monotonous spacing → introduce the editorial register (§5.3) and a real spacing rhythm.
* Identical card grids → the six "everyday uses" and five data-lifecycle stages need differentiated weight.

**Both — hard bans:** `backdrop-filter`/blur, purple/violet, radial glow halos, gradient text, icon-tile-above-heading, nested cards, bounce/elastic easing, pulsing dots, emoji, generic claims ("world-class", "supercharge"), em-dash overuse (already in your voice rules).

### 2.4 What actually wins in 2026 (R4, R5, R6)

Awarded sites in 2026 are **type-led, flat and near-monochrome**, and spend their motion budget on *one* interaction:

| Site | Awwwards | Measured/recorded palette | Measured type | Signature element |
|---|---|---|---|---|
| Squarespace Foundations (Resn) | SOTD, 1 Sep 2026 | **2 colours**: `#FFFFFF` / `#292929` | **Clarkson** superfamily (Grotesk + Serif + Condensed, 6 cuts) | Editorial typography, interactive gallery |
| Why Zero | SOTD, 7 Sep 2026 | **2 colours**: `#FFFFFF` / `#01C654` | — | *Hold-to-proceed*, narrative scroll, one shader moment |
| Cerebrium | SOTD, 10 Sep 2026 | **2 colours**: `#172B76` / `#902177` | — | 3D used as **one** intro scene + one globe, not as a style |
| Mosby's Files | SOTD 13 Aug 2026 + Typography Honors | `#191919` ground, flat blocks `#1E4BD7` `#D71E1E` `#581E70` `#FFE923` | **Signifier + Founders Grotesk + IBM Plex Mono** | Archival "files" system, 122px uppercase display |
| Poor Charlie's Almanack (Stripe Press) | SOTD 4 Jan 2024, Typography Honors | `#EFEFEF` / `#FFFFFF` | **Cardinal Fruit + Suisse Mono + Ivar** | Book-as-object |
| Typography Honors 2025–26 | — | — | PP Neue Montreal, MONOLOG, sakazuki, IRONHILL… | Each winner owns a distinct face |

**The extractable rule:** *2–4 colours · one display face with a point of view + one text face + one mono · one signature interaction · 3D only as a set-piece.* That is the opposite of "everything at once".

### 2.5 The mainstream is heading somewhere we shouldn't follow (R8)

Figma's 2026 list leads with 3D/immersive, vibrant/neon palettes, maximalism, collage and neobrutalism. These are **volume trends**: they work for consumer/lifestyle brands and are exactly what makes a page look generated when applied to a public-benefit research foundation or a privacy service. We take from that list only *bold typography*, *experimental-but-legible navigation* and *sustainable/accessible practice*.

---

## 3. The strategic frame: design the language of **proof**

Both organisations sell the same abstract thing — **a checkable claim**:

* det.io's voice rule: *"Every claim cites a clause, a patent number, or a repository path."* That is a **citation system**. Today it is rendered as small mono chips. It should be the layout.
* identity.org.au's product: *"Answer 'are you over 18?' with a cryptographic yes — your birth date and documents stay private."* That is **selective disclosure**, the digital descendant of the security document. Today it is rendered as plain white cards.

So: **the design system is the visual grammar of verification** — records, registers, seals, rosettes, folios, plates, margin citations, machine-readable zones. Every device must be *semantically load-bearing*. If a mark cannot answer "what does this prove?", it does not ship.

This also solves the "AI" problem permanently: AI templates borrow the *look* of trust (glow, gradient, glass). We borrow the *mechanics* of trust (registration marks, guilloché, checksums, folios). One of those can be generated by a prompt in four seconds; the other cannot.

---

## 4. Direction A — det.io: **"The Record"**

*A two-colour research monograph. The annual report of a serious research foundation that happens to have a friendly cloud as its mark — executed as a publication, not as a sticker sheet.*

### 4.1 Principles

1. **The page is a document, not a landing page.** Folio, running head, plate numbers, colophon.
2. **Evidence is visible furniture.** Citations move into the margin, aligned to the sentence they support.
3. **Two-colour press.** Ink black + one spot blue (the cloud is its tint). Red appears only as an *annotation* — proofreader's pencil, status caveats.
4. **Texture only where printing would have it.** Halftone inside imagery, never over text; no ambient grain.
5. **Type does the shouting.** Display serif for argument, grotesk for text, mono for record. No uppercase paragraph-level shouting.

### 4.2 Colour — from cream template to press sheet

```css
/* det.io — Amendment B */
@theme {
  /* Stock (the paper) — neutral, low-yellow: kills the "AI cream" read */
  --color-stock:        #f1efe9;   /* page ground            */
  --color-stock-tint:   #e7e4db;   /* tint plate / bands     */
  --color-sheet:        #fbfaf7;   /* plates, cards, tables  */

  /* Ink (black plate) */
  --color-ink:          #14171c;   /* body + display         */
  --color-ink-70:       #4a5058;   /* secondary              */
  --color-ink-45:       #767c85;   /* captions, meta         */
  --color-rule:         #cbc7bd;   /* hairline               */
  --color-rule-strong:  #918d84;   /* section rules          */

  /* Spot blue (one ink, two tints — print-honest) */
  --color-spot:         #1a6f97;   /* 100% — links, active   */
  --color-spot-tint:    #5dbadb;   /*  40% — the cloud mark  */
  --color-spot-wash:    #dfeef6;   /*  10% — grounds only    */

  /* Annotation red — status/correction ONLY, max one element per page */
  --color-annotate:     #b4341f;

  /* Night band (footer + one counterweight section) */
  --color-night:        #151a20;
  --color-night-text:   #eceef0;
}
```

**Why:** the yellow cream (`#F5F0E2`) is the single strongest "AI generated" tell on the page. `#f1efe9` is still paper, but it stops reading as "beige template". Blue becomes a *spot ink with tints* rather than a decorative sky, which makes the existing cloud mark (`#5DBADB`) structurally correct instead of coincidental. Red is a third ink used only for annotation — exactly what your honesty voice needs ("research goals are not claims of deployed services").

### 4.3 Typography — replace the AI stack

**Problem:** `Space Grotesk` + `JetBrains Mono` is the reference site's stack (R3). `Inter` at 669 elements is the slop default (R7).

| Role | Today | Proposed | Why |
|---|---|---|---|
| Display / argument | Space Grotesk 700 UPPERCASE | **Instrument Serif** 400 + italic (`@fontsource/instrument-serif` ✔ R9) | High-contrast editorial serif; reads *publication*, not product. Used at ≥ 28px only. |
| Text / UI | Inter 400–600 | **Archivo Variable** (`@fontsource-variable/archivo` ✔ R9) | Sturdy American gothic, `wdth` axis gives condensed labels for folios/plates/chips without a 4th family. Not a known AI default. |
| Record / evidence | JetBrains Mono 400–500 | **IBM Plex Mono** 400–500 (`@fontsource/ibm-plex-mono` ✔ R9) | Institutional, IBM's public-sector heritage; aligns with the *family spine* (§6) and with the MRZ voice on identity.org.au. JetBrains reads "coding IDE". |

**Alternates if Instrument Serif is too fashion-forward:** `Newsreader` (variable, optical sizing ✔), `Literata` (Google's reading face, education-appropriate ✔), `Fraunces` (wonk axis, ✔ `@fontsource-variable/fraunces`).

**Scale (px):** `12 · 13 · 15 · 17 · 20 · 25 · 33 · 44 · 64 · 96` — ratio ≈ 1.25.
**Rules:**
* H1 `clamp(2.75rem, 6vw, 4.5rem)` / Instrument Serif 400 / `line-height: 1.02` / `letter-spacing: -0.01em` / **sentence case** (drop `uppercase` on H1 — it is the loudest AI tell on the page).
* H2 same face, `clamp(1.75rem, 3vw, 2.5rem)`; H3 Archivo 600.
* Body Archivo 400, `1.0625rem → 1.125rem`, `line-height: 1.65`, measure **68ch**, `text-wrap: pretty`.
* Labels/folios: Archivo 600, `wdth 85`, `0.1em` tracking, uppercase — *only* for short strings (≤ 6 words).
* Evidence: IBM Plex Mono 400, `0.78rem`, `font-variant-numeric: tabular-nums`.
* Kill `crushed letter spacing` above 40px: allow `-0.02em` max.

### 4.4 Motifs — from decoration to apparatus

| Motif | Replaces | Rule for use |
|---|---|---|
| **Register mark** (printer's crosshair ⊕ + crop marks) | generic badges | Section opener only; marks the point where the rule meets the margin. |
| **Folio** (`001 / 032` + running head, mono, sticky left rail) | ambient numbering | Every page. Ties to the real section sequence and tracks scroll position. |
| **Plate** (`Plate 04 · VirtStack · src: research/virtengine`) | card grid | Diagrams/figures get a numbered plate + caption + source line. One shadow allowed: `3px 3px 0 ink`. |
| **Margin evidence** (Tufte side-note) | inline `ClauseRef` chips | On ≥ 1100px, right column `14rem`: `cl 6.1.1`, ACN, patent `AU2024203136B2`, commit hash, repo path. Stacks below the paragraph under 1100px. |
| **Two-colour halftone** | ambient grain/halftone | Only inside imagery, only as the spot-ink screen. |
| **Colophon** | repeated footer legal text | Foot of each long page: typefaces, sources, licence, last-reviewed date. Reinforces "this is a publication". |
| **Lattice** | `lattice-backdrop` plus-grid | **Remove.** If a grid is wanted, make it a *ruled measurement*: hairline baselines tied to the type scale, visible only behind figures. |

### 4.5 Layout — the monograph grid

```css
.page-grid {
  display: grid;
  grid-template-columns:
    [rail] 5.5rem
    [text] minmax(0, 68ch)
    [note] 14rem
    [free] minmax(0, 1fr);
  column-gap: 2rem;
}
@media (max-width: 1100px) {
  .page-grid { grid-template-columns: [rail] 1fr; }
  .page-grid > .note { grid-column: text; } /* stacks under its paragraph */
}
```

* **Left rail:** folio + section number + `section` progress, sticky, mono.
* **Text column:** 68ch measure — never centred-with-giant-padding again.
* **Note column:** evidence citations, `aria-describedby`-linked to their paragraph.
* **Free column:** plates and figures *bleed right* — the page finally has asymmetry, which is what stops it looking like a template.
* Section rhythm: `7rem / 11rem` vertical, opener always = register mark + rule + folio + serif H2.

### 4.6 Page templates (rebuild order)

1. **Home / Field Record №001** — masthead: folio line, serif H1, one-sentence mission, ACN chip, register mark; four programs as *plates*, not equal cards (one primary plate spans 2 columns); constitution band on night stock; colophon.
2. **Program page** (`/research/[slug]`) — abstract block (serif, 3 lines) + margin evidence + plate gallery + "status: in development" annotation in red.
3. **Reference page** (`/constitution/[slug]`, `/governance`) — clause-first: clause text in the text column, commentary in the margin, related clauses as a register table.
4. **Index pages** (`/research`, `/activities`) — a *table of contents*, not a card grid: dotted leaders, folio numbers, one-line abstracts.
5. **Article/guide** — 68ch + margin notes + colophon.

### 4.7 Motion

* Allowed: `transform`, `opacity`, `background-color`, `color`, `stroke-dashoffset`.
* Timing `120–320ms`, easing `cubic-bezier(0.2, 0, 0, 1)` — **no overshoot, no bounce, no elastic** (slop rule).
* Signature: *rules draw in like a plotter* — section rules animate `scaleX` from the register mark outward, once, on first view.
* **Tickers:** delete, or convert to a static justified "credit line" (masthead style). If kept for one band, add pause-on-hover/focus + `aria-hidden="true"` on the duplicate track.
* `animation-timeline: view()` reveals: keep, but content must be visible without JS/CSS animation support (already your rule).

### 4.8 Do / Don't (det.io)

**Do:** sentence-case serif headlines · one shadow style maximum · margin citations · folio on every page · tabular numerals · red only for status/annotation · two inks.
**Don't:** uppercase display · badge pills above H1 · grain over text · lattice backgrounds · 3D/WebGL · blur/glass · gradient text · equal-weight card grids · second accent colour.

---

## 5. Direction B — identity.org.au: **"The Credential"**

*Security-print identity. The page should feel like the object it replaces — a document you never have to hand over.*

### 5.1 Principles

1. **Service register vs editorial register.** The service speaks plain sans; the argument reads like a paper. Two registers, one system.
2. **The credential is the hero.** An ID-1 card (85.60 × 53.98 mm, ISO/IEC 7810) is the most recognisable trust object in the world. Build it in SVG/CSS and let it carry the brand.
3. **Guilloché as ground truth.** Fine-line rosettes, generated at build time from a real record number — no two records share a ground.
4. **One foil, one meaning.** A single iridescent laminate on the credential card = *genuine*. Nowhere else, ever.
5. **Keep the gov-grade clarity.** White, one action colour, notices, numbered steps, definition tables, honesty lock. We are adding identity, not removing legibility.

### 5.2 Colour — same trust palette, plus a security layer

```css
/* identity.org.au — Amendment B */
@theme {
  /* Surfaces (unchanged, plus a counterweight) */
  --color-paper:   #ffffff;
  --color-alt:     #f3f5f6;
  --color-tint:    #e9f1f7;
  --color-vault:   #17293a;   /* the "enclave" band — used once per page */

  /* Ink */
  --color-ink:     #17262e;
  --color-body:    #32424c;
  --color-muted:   #576a75;

  /* Action (single action colour, unchanged) */
  --color-action:      #14558f;
  --color-action-hover:#0d3d68;

  /* Verified — SEMANTIC ONLY: passed states, checkmarks, level chips */
  --color-verified:    #0f7a5c;

  /* Security print layer */
  --color-guilloche:   #14558f;  /* drawn at 6–14% stroke opacity */
  --color-foil:        conic-gradient(from 210deg,
                        #cfe3f5, #f6d9ef, #d9f3e6, #f7ecd2, #cfe3f5);
  --color-status-warn-bg: #fbf2e2;  /* unchanged */
}
```

Fixes to ship with it: `scripts/og.mjs` `fill="#28205b"` → `#17293a`; ensure `theme-color` matches.

### 5.3 Typography

| Role | Today | Proposed | Why |
|---|---|---|---|
| Service UI / body | Public Sans 400–800 | **Public Sans** (keep) | Continuity, WCAG-tested, plain-English voice already tuned across 42 pages. |
| Editorial / display | — (same face) | **Newsreader** variable (`@fontsource/newsreader` ✔ R9) | Gives the *insights, guides, definitions* (25 pages of reading) a real editorial voice, and gives heroes a signature. Sentence case, `font-optical-sizing: auto`. |
| Credential / data | — | **IBM Plex Mono** 400–500 (family spine, §6) | MRZ lines, credential IDs, hashes, timestamps, field labels, consent timestamps. Tabular by default. |

**Two-register rule:** `Service` components (nav, forms, steps, notices, tables, buttons) = Public Sans only. `Editorial` components (H1/H2 on marketing + insights, pull-quotes, ledes) = Newsreader. Never mix inside a component.

**MRZ detail:** real MRZ uses OCR-B at fixed 2-line/72+44-char geometry (OCR-B is not on npm — verified 404, R9). Approximate with IBM Plex Mono, `font-size: 0.72rem`, `letter-spacing: 0.06em`, `line-height: 1.5`, two lines with `<span>`-separated groups, `aria-label` spelling out the meaning. Alternates worth a look: `@fontsource/b612-mono` ✔, `@fontsource/dm-mono` ✔.

**Scale:** identical ramp to det.io (§4.3) so the family shares rhythm while the faces differ.

### 5.4 The signature devices

**A. Guilloché ground (SVG, build-time, seedable).**
Hypotrochoid `x = (R−r)·cos t + d·cos((R−r)/r · t)`, stroked 0.6–1px at 6–14% opacity, `aria-hidden="true"`, ~2–4 KB per pattern.

* Seed 1 — **page seed:** hero rosette behind the credential (10% opacity, masked to a radial fade).
* Seed 2 — **record seed:** each credential/consent record renders its own rosette from its ID → "no two records share a ground". This is the thing people will describe to someone else.
* Seed 3 — **section divider:** a thin rosette band replacing hairline rules between major sections.

**B. The Proof Card (ID-1 component).**
Proportion `85.60 / 53.98`, corner `0.375rem` → 10px optical, ground = seed-2 rosette, fields in IBM Plex Mono, level chip in `--color-verified`, MRZ strip along the bottom, and **one** laminate foil overlay:

```css
.foil {
  background: var(--color-foil);
  mix-blend-mode: color-dodge;
  opacity: .35;
  -webkit-mask-image: linear-gradient(115deg, transparent 35%, #000 50%, transparent 65%);
  mask-size: 260% 100%;
  transition: mask-position 240ms cubic-bezier(.2,0,0,1);
}
/* pointer-tracked: --x updated on pointermove, disabled under reduced motion */
@media (prefers-reduced-motion: reduce) { .foil { transition: none; mask-position: 50% 0; } }
```

≤ 60 lines of vanilla JS, no library, keyboard: `:focus-visible` shows a static foil at 50%.

**C. "What leaves the phone" flow** (evolves `ShareDemo` / `ZkShareScreen` / `DataLifecycle`).
Three states — *on your device* → *sealed enclave* → *result only* — with **one** travelling token (the answer) while every other field stays put and desaturates. Motion exists to prove the claim: "only the result ever remains."

### 5.5 Layout & components

* **Grid:** keep single-column service flow (`max-width: 76rem`), but add a **7/5 hero split**: copy left, Proof Card right, card overlapping the section rule by 24px (the only overlap in the system).
* **Rhythm:** introduce 3 surface states per page: `paper → alt → vault`. The navy band (`--color-vault`) appears exactly once per page, reserved for the privacy/enclave argument. This alone fixes the "flat white wall" read.
* **Tables:** keep gov tables; add `font-variant-numeric: tabular-nums`, a 1px `rule-strong` under the header row, and right-aligned values. Verification-levels and privacy tables become the most beautiful thing on the site.
* **Honesty lock:** elevate from footer text to a persistent, visually distinct **stamped notice** — mono, `1px dashed` border, `--color-ink-45`. It is a differentiator, not a disclaimer.

### 5.6 Component specifications (both sites share this table's structure)

| # | Component | Spec |
|---|---|---|
| C1 | `Folio.astro` | mono `0.72rem`, `tracking .1em`, ink-45; `№ 001 / 032 · DET.IO · FIELD RECORD` |
| C2 | `RegisterMark.astro` | 16px crosshair SVG, `stroke-width 1`, ink-45; section openers only |
| C3 | `Plate.astro` | sheet bg, `1px rule`, `3px 3px 0 ink` shadow, caption row: `Plate 04 · Title · src: path` |
| C4 | `EvidenceNote.astro` | margin column, IBM Plex Mono `0.75rem`, spot colour, `aria-describedby` link to source |
| C5 | `Colophon.astro` | foot of long pages: fonts, sources, licence, `Reviewed 2026-09-25` |
| C6 | `StatusAnnotation.astro` | red `0.75rem` mono, `1px` underline, max **1 per page** — `status: in development` |
| C7 | `TableOfContents.astro` | dotted leaders + folio numbers (replaces card grids on indexes) |
| C8 | `ProofCard.astro` | ID-1 SVG/CSS, guilloché ground, MRZ, level chip, foil |
| C9 | `Field.astro` | mono label `0.7rem` uppercase ink-45 over mono value; used in every table/record |
| C10 | `MrzStrip.astro` | 2 lines, Plex Mono, `aria-label` describing contents |
| C11 | `SecurityNotice.astro` | dashed border, mono, used for honesty lock + patent/ACN notices |
| C12 | `VaultBand.astro` | full-bleed `--color-vault` section, inverse text, one per page |
| C13 | `Steps.astro` (keep) | numbered, add tabular step counter + progress rule |
| C14 | `LevelChip.astro` | `--color-verified` for passed, `--color-muted` for pending; never colour-only (icon + text) |

---

## 6. The family spine (det.io · identity.org.au · virtengine.com)

The sites are separate codebases with separate `DESIGN.md`s; they must stay separate in accent and surface, but should share **grammar**:

| Shared (family) | Per-site (locked) |
|---|---|
| Type ramp (12…96) + 68ch measure | Display faces: Instrument Serif (det.io) / Newsreader (identity) / *(virtengine: decide)* |
| **IBM Plex Mono** as the "record/data" voice | Accent: spot blue (det.io) / action blue + verified green (identity) / green (virtengine) |
| Evidence chips, folio, register mark, colophon | Surface: stock (det.io) / paper (identity) / engineering paper (virtengine) |
| Motion budget (≤320ms, no overshoot, reduced-motion) | Signature device: plate+margin (det.io) / guilloché+foil (identity) |
| Slop bans (§7) | Shadow language: hard offset (det.io) / hairline only (identity) |

**Flag:** `virtengine.com` contains the family's only `backdrop-filter: blur(12px)` and SVG `radialGradient` glows (`marketplace.css`, `instrument.css`, `art/*`). Either justify it (instrument glass is *functional layering*) or align it with the §7 bans.

---

## 7. Anti-slop guardrails (lintable — add to `scripts/check-design.mjs`)

Turn the taxonomy into CI, the same way `check-a11y.mjs` already works:

1. `backdrop-filter` / `filter: blur` → **fail** (allowlist: none initially).
2. `linear-gradient` / `radial-gradient` → **fail** unless in allowlist: `.foil`, duotone image maps, `--color-foil`.
3. Font families outside the `@font-face` allowlist → **fail**.
4. `box-shadow` with blur radius > 0 → **fail** except `.plate` (det.io) and `0 1px 0` hairlines (identity).
5. `border-radius` > 1rem on non-pill elements → **fail**; pill radius only on `[role=button]`, `a`, `.chip`.
6. Any `animation`/`transition` outside `@media (prefers-reduced-motion: no-preference)` → **fail**.
7. `marquee`/infinite translate without a pause control → **fail**.
8. `text-transform: uppercase` on `h1,h2` → **fail** (det.io only).
9. `letter-spacing` < `-0.02em` → **fail**.
10. Emoji in `src/**/*.astro` → **fail** (already in voice rules).
11. Contrast ≥ 4.5:1 body / 3:1 large (extend `check-a11y.mjs`).
12. Every `Plate`/`Figure` must have `caption` + `source` line → **fail** if missing (protects the evidence claim).

Plus a human gate per `DESIGN.md`: *"Does this mark answer 'what does it prove?' If not, remove it."*

---

## 8. Budgets & constraints (non-negotiable)

| Budget | Target |
|---|---|
| Fonts / page | ≤ 4 files, ≤ 160 KB woff2 total, `font-display: swap`, preload **one** (the display face), `latin` subset only |
| JS / page | ≤ 5 KB (foil tracker + nav). Zero JS for content visibility |
| CSS | ≤ 40 KB gzipped per site |
| LCP | ≤ 2.0 s on 4G mid-tier · CLS ≤ 0.05 · INP ≤ 150 ms |
| A11y | WCAG 2.2 AA · one `h1` · no skipped levels · decorative SVG `aria-hidden` · no colour-only meaning |
| Agents | Keep `functions/_middleware.js` Markdown-for-Agents contract: all new devices must be semantic HTML or `aria-hidden`; never put meaning in an SVG title-less graphic |
| CI | `check:links`, `check:a11y`, `check:markdown` must stay green; add `check:design` (§7) |

---

## 9. Rejected directions (with reasons)

| Direction | Why rejected |
|---|---|
| **3D / WebGL everywhere** (the `areyoufoundbyai.com` read) | The named cliché. Winners use 3D as *one* set-piece (Cerebrium: one intro scene, one globe). Cost: ~400 KB–2 MB, WPO score drag, accessibility burden. Verdict: **no WebGL in v1**; at most one lazy-loaded hero scene on a research page, with a static poster and `prefers-reduced-motion` fallback. |
| **Glassmorphism / dark-first / neon glow** | Named slop rules; also wrong for a public-benefit trust product (glow signals "app", not "record"). |
| **Keep beige neobrutalism, polish it** | The polish would not change the read: cream + hard shadows + uppercase display is the current AI generation's default (§2.1). |
| **Maximalism / collage / Y2K vibrant** | Figma's mainstream 2026 volume trends. Wrong audience; will date within a year. |
| **Full rebrand of identity.org.au away from gov-grade** | Its competitive position is "government-service-grade design for a service that is *not* government". Removing that clarity would cost more trust than a distinctive device gains. |
| **Illustrated mascot / character system** | Slop rule ("Rough SVG illustrations"); no budget for a real illustrator. |

---

## 10. Rollout plan

| Phase | Work | Effort | Impact |
|---|---|---|---|
| **0. Decisions** | Choose display faces, stock colour, and whether virtengine joins the spine (§11) | 1 day | — |
| **1. Tokens** | Rewrite both `@theme` blocks; fix `og.mjs` purple; fix stale `theme-color #f6f9fb`; update both `DESIGN.md` to *Amendment B* | 0.5 day | High |
| **2. Type** | Swap font packages, apply §4.3/§5.3 scale + rules, re-tune every heading style | 1–1.5 days | **Highest** |
| **3. Apparatus** | `Folio`, `RegisterMark`, `Plate`, `EvidenceNote`, `TableOfContents`, `Colophon` (det.io); `ProofCard`, `MrzStrip`, `Field`, `SecurityNotice`, `VaultBand` (identity) | 2–3 days | High |
| **4. Templates** | Home + one index + one reference page per site, to prove the system | 2 days | High |
| **5. Signature motion** | Plotter rules (det.io) · foil + travelling token (identity) | 1 day | Medium |
| **6. Sweep** | Remaining 50+ pages, remove tickers/lattice/grain, re-plate diagrams | 2–4 days | Medium |
| **7. Hardening** | `check:design` in CI, contrast audit, perf budgets, Lighthouse ≥ 95 | 1 day | — |

Total: **≈ 10–14 working days** for both sites, phased so phase 2 alone already changes the read.

---

## 11. Decisions needed from you

1. **Display faces:** Instrument Serif (det.io) vs Newsreader-vs-Literata alternates? Newsreader (identity) — or keep identity single-face and let the Proof Card carry the personality?
2. **Stock colour for det.io:** `#f1efe9` (neutral paper, proposed) vs a cooler `#f4f4f2` vs full white?
3. **The cloud mark:** keep `#5DBADB` as the 40% tint of the spot ink (proposed), or re-cut the logo to the deeper spot blue?
4. **Tickers:** delete (proposed) or keep one with pause controls?
5. **virtengine.com:** join the family spine (share mono, folio, slop bans) or leave out of scope?
6. **Photography:** identity has 6 CC0 duotones; det.io has none. Do we commission/licence 3–5 documentary images for det.io's monograph direction, or stay diagram-only (cheaper, and more honest)?
7. **WebGL:** confirm "no WebGL in v1" (§9).

---

## Appendix A — font packages verified available (R9)

`✔` installable from npm (checked `registry.npmjs.org …/latest`): `@fontsource/instrument-serif`, `@fontsource-variable/fraunces`, `@fontsource/newsreader`, `@fontsource/archivo`, `@fontsource-variable/archivo`, `@fontsource/instrument-sans`, `@fontsource-variable/instrument-sans`, `@fontsource-variable/bricolage-grotesque`, `@fontsource/ibm-plex-mono`, `@fontsource/ibm-plex-serif`, `@fontsource/spectral`, `@fontsource-variable/source-serif-4`, `@fontsource-variable/martian-mono`, `@fontsource-variable/spline-sans-mono`, `@fontsource/fragment-mono`, `@fontsource/b612-mono`, `@fontsource/dm-mono`, `@fontsource/space-mono`, `@fontsource/chivo-mono`, `@fontsource-variable/roboto-mono`, `@fontsource-variable/familjen-grotesk`, `@fontsource-variable/onest`, `@fontsource/redacted`, `@fontsource/libre-barcode-128`.

`✘` not found (404): `@fontsource/ocr-b` (real MRZ face — approximate per §5.3), `@fontsource/ibm-plex-mono` *variable*, `@fontsource-variable/dm-mono`.

## Appendix B — measured evidence summary

**det.io (live, R1):** body `#F5F0E2` · fonts `Inter 669 / JetBrains Mono 239 / Space Grotesk 78` · H1 `Space Grotesk 700 · 62px · uppercase · -1.86px · lh 60.76px` · radii `5px×62 + 3/4/6/7/8/10px` · shadows `ink 5px5px0 ×10, 8px8px0 ×4` · gradients `8` · `backdrop-filter 1` · `perspective/3D 0` · 1,308 elements.

**identity.org.au (live, R2):** body `#FFFFFF` · `Public Sans 539` · H1 `50px / 800 / -1px / lh 52px` · radii `6px×46 + 8 pills` · shadows `hairline 1px0 0 ×10` · gradients `0` · backdrop `0` · 701 elements.

**areyoufoundbyai.com (live, R3):** body `#FCFAF6`, ink `#1A1917` · `Space Grotesk 228 / Space Mono 97 / Fraunces (loaded)` · H1 `42px/700` · `canvas ×1` · gradients `7` · shadows `36` · 4,000 elements (capped).

**Awwwards winners (R4/R6):** Squarespace Foundations `#FFFFFF`/`#292929` + Clarkson; Why Zero `#FFFFFF`/`#01C654`; Cerebrium `#172B76`/`#902177`; Mosby's Files `#191919` + flat `#1E4BD7 #D71E1E #581E70 #FFE923` + Signifier/Founders Grotesk/IBM Plex Mono; Poor Charlie's Almanack `#EFEFEF` + Cardinal Fruit/Suisse Mono/Ivar.

## Appendix C — sources

* https://impeccable.style/slop (67-rule AI-slop taxonomy)
* https://www.awwwards.com/websites/ · /websites/sites_of_the_day/ · /websites/winner_category_typography/ · /sites/squarespace-foundations · /sites/why-zero · /sites/cerebrium · /sites/mosbys-files
* https://www.figma.com/resource-library/web-design-trends/ (2026 mainstream list)
* https://areyoufoundbyai.com/ (brief's reference site)
* https://www.mosbyfiles.com/ · https://www.stripe.press/poor-charlies-almanack · https://brand.squarespace.com/ (live type/palette audits)
* `sites/det.io/DESIGN.md`, `sites/identity.org.au/DESIGN.md` (normative today)
