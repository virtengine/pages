# DESIGN — identity.org.au

> **Amendment B (2026-09-25) is normative for the credential layer.**
> Service UI stays Public Sans. Editorial headlines (H1, section H2, vault
> band) use Newsreader, roman, not italic display. Record fields, MRZ, and
> the honesty stamp use IBM Plex Mono. One vault band per page
> (`ClosingBand`, `#17293a`). Guilloché grounds are seeded and decorative.
> The Proof Card is the only foil. `scripts/og.mjs` uses `#17293a`, never
> indigo. The honesty lock is a stamped notice above the footer, not only a
> paragraph inside it.



Government-service-grade design for a service that is emphatically **not** a
government service. The design DNA is the digitalid.gov.au / my.identity.gov.au
class of sites: white surfaces, near-black ink, one action colour used with
discipline, plain English, and service-design components (notice banners,
numbered steps, chevron card lists, definition tables). The honesty lock — "not
an Australian Government service" — is a permanent, site-wide component, not a
footnote.

identity.org.au sits between its siblings in the DETIO family: det.io
(sky `#5DBADB` / steel `#4C7094` / navy) and virtengine.com (green `#60CC5D`).
This site borrows the family **steel-navy** as its structural colour and adds a
deep trust-blue as its single action colour.

## Contents

1. [Logo — the Ridgemark](#logo--the-ridgemark)
2. [Colour tokens + contrast table](#colour-tokens)
3. [Typography](#typography)
4. [Spacing, grid, measure](#spacing-grid-measure)
5. [Layout and editorial system](#layout-and-editorial-system)
6. [Component inventory](#component-inventory)
7. [Phone mockup system](#phone-mockup-system)
8. [Media system](#7b-media-system)
9. [Content and voice rules](#content-and-voice-rules)
10. [Motion](#motion)
11. [Honesty locks](#honesty-locks)

## Logo — the Ridgemark

A navy shield carrying a tick drawn as **concentric fingerprint ridges**:
verification (the tick) formed out of biometric identity (the ridges), held
under protection (the shield). It is designed to read as national-infrastructure
signage — flat duotone, no gradients, no purple, no emoji.

### Construction (48×48 grid)

- **Shield**: apex at (24, 2.5), shoulders at x = 4.5 / 43.5, y = 9.75; straight
  sides to y = 26; symmetric curves closing at the base (24, 47.75). Fill
  `--color-navy` `#17293a`.
- **Primary tick**: polyline (13, 27.5) → (22, 36.5) → (37.5, 18.5), stroke
  white, width 4.4, round caps and joins.
- **Ridge echoes** (the fingerprint lines): a parallel inner tick
  (16.5, 22.5) → (22, 28) → (33, 15.5) at width 2.4 in light steel-blue
  `#6ea3d8` (85% opacity), and a short lower ridge fragment
  (11.5, 31.5) → (15, 35) at 55% opacity.

### Variants and files

| Variant | Where | File |
| --- | --- | --- |
| Solid (navy shield, white tick, steel-blue ridges) | Header, light surfaces | `src/components/brand/Mark.astro` (`variant="solid"`) |
| Reversed (white shield, navy tick, steel ridges) | Navy footer | `Mark.astro` (`variant="reversed"`) |
| Favicon (navy rounded tile, outlined shield) | Browser tab | `public/favicon.svg` |
| OG lockup | Social cards, 1200×630 | `public/og.svg` → rasterized to `og.png` by `scripts/og.mjs` |

### Lockup

Mark + wordmark **identity`.org.au`** — "identity" in ink extra-bold,
".org.au" in steel semi-bold (the domain *is* the brand, the my.gov.au
pattern). Optional support line `IDENTITY WALLET · VIRTENGINE ECOSYSTEM`
(0.7rem, 0.16em tracking) used in the footer. Component:
`src/components/brand/Lockup.astro`. Clear space: half the mark height on all
sides. Never distort, recolour outside the two variants, or add effects.

## Colour tokens

Defined once in `src/styles/global.css` under `@theme` (Tailwind v4).

### Surfaces

| Token | Value | Use |
| --- | --- | --- |
| `--color-paper` | `#ffffff` | Page background |
| `--color-alt` | `#f3f5f6` | Alternating bands, page headers, side-nav active |
| `--color-tint` | `#e9f1f7` | Provenance banner, secondary-button hover |
| `--color-hairline` | `#d5dde2` | Default borders, table rules |
| `--color-hairline-strong` | `#a3b2bb` | Step connectors, emphasis borders |

### Text on white — contrast

| Token | Value | Contrast on `#ffffff` | Use |
| --- | --- | --- | --- |
| `--color-ink` | `#17262e` | ≈ 14.9:1 (AAA) | Headings, bold facts |
| `--color-body` | `#32424c` | ≈ 9.6:1 (AAA) | Body text |
| `--color-muted` | `#576a75` | ≈ 5.6:1 (AA) | Captions, breadcrumb current page |
| `--color-action` | `#14558f` | ≈ 7.2:1 (AAA) | Links, primary buttons |
| `--color-steel` | `#4c7094` | ≈ 4.9:1 (AA) | Eyebrows, tags, family accent |
| `--color-accent` | `#0f7a5c` | ≈ 5.3:1 (AA) | Success rules, teal-green family bridge |

Body text targets AAA (≥ 7:1); 17px base size.

### Structural navy (family lineage)

`--color-navy #17293a` (header top rule, footer, step discs, the mark),
`--color-navy-panel #22374c`, `--color-navy-hairline #33485d`,
`--color-navy-muted #a7b8c6` (footer headings ≈ 7.5:1 on navy).

### Status

Info `#e9f1f7` / rule `#14558f`; warning `#fbf2e2` / text `#7a4a0e` / rule
`#b8801f`; success `#e7f4ee` / rule `#0f7a5c`. Focus ring: 3px solid
`--color-focus #9e5f00` — visible on both white and navy.

**One action colour rule:** interactive = `--color-action` blue, always.
Steel and accent-green are never clickable colours.

## Typography

| Role | Face | Weights |
| --- | --- | --- |
| Everything | **Public Sans** (via `@fontsource/public-sans`) | 400 / 600 / 700 / 800 |

Public Sans is the govt-service genre's typeface (developed for USWDS; the same
plain-legibility class as the AGDS defaults). One family, used with a strong
weight scale, is a deliberate service-design choice — no display font, no mono
eyebrows.

- Base: 17px (`1.0625rem`), line-height 1.65
- h1: `clamp(1.9rem, 4vw, 2.7rem)`, weight 800, tracking −0.01em
- h2: 1.4–1.75rem, weight 700; h3: 1.05–1.17rem
- Eyebrows: 0.8125rem, weight 700, 0.14em tracking, uppercase, steel
- `text-wrap: balance` on headings

## Spacing, grid, measure

- Container: `max-width 76rem`, `padding-inline clamp(1.25rem, 4vw, 2.5rem)`
- 12-col grid on heroes (7/5 text–phone split); guide pages use a
  `16rem + 1fr` side-nav grid; help articles `1fr + 20rem` related rail
- **Measure discipline:** `.measure` caps text at 72ch, `.measure-narrow` 60ch;
  `.prose-service` enforces 72ch on all article copy
- Section rhythm: `py-14 lg:py-20`, alternating paper/alt bands separated by
  hairlines
- Radius: `--radius-tile 0.375rem` (cards, buttons, alerts) — small radii only,
  nothing pill-shaped except phone-screen chips

## 5. Layout and editorial system

The rehaul keeps government-service restraint while giving journeys an editorial
register: stronger section rhythm, captioned light figures, machine-readable
status facts, statement bands, and one accessible demonstration pattern.

- **Ridge motif**: a repeating radial-arc texture derived from the Ridgemark's
  fingerprint ridges, drawn at ~5% ink on heroes and ~5% white on navy bands.
  It is the only decorative pattern; there is no grain, lattice or noise.
- **Primary actions are navy** (`--color-navy`), secondary actions are navy
  outlines; the action blue is reserved for links and focus-affordance text.
- **Statement bands**: `ClosingBand.astro` closes marketing and service journeys
  in navy with a strong line and action buttons; the navy closing band and the
  navy footer frame the light middle of the site.
- `Section.astro`: ruled editorial header (`index · eyebrow`, headline,
  standfirst) with a 3px navy rule and predictable vertical rhythm. Sections do
  **not** carry the page container; each Section is wrapped in
  `.container-site` by the page so full-bleed bands (media, closing) can sit
  between them.
- `Section.astro`: ruled editorial header (`index · eyebrow`, headline,
  standfirst) with a 3px navy rule and predictable vertical rhythm.
- `ServiceHero.astro`: unified service hero with breadcrumbs, status tag,
  actions, supporting note, and an optional framed media slot; `PageHeader.astro`
  matches its type scale on guide and policy pages.
- `FactStrip.astro`: a compact list of checkable facts inside the container,
  separated by rules; every item is text unless it has a destination.
- `ServiceFigure.astro`: light alternative to ad-hoc `<figure>` wrappers, with a
  **navy rail**, responsive body, caption, and optional horizontal-scroll
  preservation for wide diagrams.
- `TableScroll.astro`: keyboard-focusable scroll region for tables that cannot be
  simplified; paired with sticky first columns and a minimum table width.
- `ShareDemo.astro`: a simplified zero-JS consent/proof/receipt demonstration.
  One radio control set drives the illustrated phone and panel; boundary
  accounting is explicit; the phone is decorative and panels carry meaning.
- Headings follow page context: `Steps.astro` accepts `headingLevel={2|3}` so a
  step list directly under an `h1` does not create an `h1 → h3` skip.

## 6. Component inventory

| Component | File | Pattern |
| --- | --- | --- |
| Provenance statement | `Footer.astro` | Site-wide "not a government service" statement in the navy footer, with the accreditation posture and acknowledgement |
| Service section | `Section.astro` | Ruled editorial section header and vertical rhythm; optional `index · eyebrow`, headline, standfirst |
| Feature hero | `ServiceHero.astro` | Breadcrumbs, status tag, eyebrow, headline, standfirst, actions, supporting note, optional framed media |
| Closing band | `ClosingBand.astro` | Navy statement band with action slots, used above the footer on key journeys |
| Fact strip | `FactStrip.astro` | Compact machine-readable status facts inside the container; plain text unless a destination exists |
| Service figure | `ServiceFigure.astro` | Light rail/caption frame for diagrams and phone mockups; optional scroll preservation for wide SVG diagrams |
| Sharing demo | `ShareDemo.astro` | Simplified zero-JS request → proof → receipt walkthrough with boundary accounting |
| Scrollable table | `TableScroll.astro` | Keyboard-focusable region with sticky first column for tables that cannot be simplified; wide variant for four or more columns |
| Notice/alert | `Alert.astro` | Left rule + tinted surface + drawn SVG icon; `info` / `warning` / `success`, with live-region semantics |
| Callout | `Callout.astro` | Neutral navy left-rule panel for asides and definitions |
| Steps | `Steps.astro` | Gov numbered-steps: navy discs joined by a vertical rule, optional detail bullets, screen-reader step position, contextual `headingLevel` |
| Card link | `CardLink.astro` | Chevron-affordance card list with optional tag + description |
| Status tag | `StatusTag.astro` | Uppercase bordered tag: `neutral` / `info` / `success` / `warning` |
| Breadcrumbs | `Breadcrumbs.astro` | On every interior page; BreadcrumbList JSON-LD emitted by `Base.astro` |
| Page header | `PageHeader.astro` | Alt band: breadcrumbs + eyebrow + h1 + lede |
| Side-nav layout | `layouts/Guide.astro` | Sticky section nav with `aria-current` left-rule state (wallet, get-started, about, for-services) |
| Definition tables | `.table-gov` (global.css) | Navy-ruled header row, alt thead surface, row hairlines |
| Accordion | `.details-gov` (global.css) | Native `<details>` — zero JS — with rotating chevron |
| Footer | `Footer.astro` | Navy; 5 structured link columns, ecosystem row (incl. my.identity.org.au and the det.io identity research program), honesty statements, acknowledgement line, contacts |
| Flow diagram | `components/diagrams/VerifyFlow.astro` | Wallet → VEID chain modules → marketplace approval; flat duotone in system colours, full-sentence `aria-label` |
| Lock-and-key diagram | `components/diagrams/LockAndKey.astro` | The signature trusted-processing graphic: evidence sealed on-device, opaque transit, attestation gate, vault with hardware-forged key, destruction step, result-only exit, operators drawn outside with no access path. CSS-only parcel/pulse motion, killed under `prefers-reduced-motion` |
| Data lifecycle strip | `components/diagrams/DataLifecycle.astro` | Five-stage "what happens to your data" strip (captured → encrypted → attested enclave → destroyed → result only); optional `withTable` companion `.table-gov` table. Reused on /, /privacy, /privacy/trusted-processing, /wallet/security and the biometrics help article |
| Browser mockup | `components/phone/WebPortalFrame.astro` | Desktop-browser frame of the my.identity.org.au portal (credential, proofs, consents, session security) |
| Phone mockups | `components/phone/*` | See below |

## 7. Phone mockup system

Refined SVG phone frames replace abstract hero art. `Phone.astro` draws the
device (viewBox 0 0 328 670, device body at 4,4–316,656; usable screen area x
16–304, y 42–644) and slots screen content; `ScreenChrome.astro` adds the navy
app bar (with the mark) and 5-step progress dots. Screens are accurate to the
reference capture app (`mobile/veid-capture-app`):

| Screen | Shows | Used on |
| --- | --- | --- |
| `DocScanScreen` | Guided document capture: corner brackets, edge/glare checks, on-device processing note | set-up-your-wallet, mobile-wallet |
| `LivenessScreen` | Active liveness: blink ✓ / head-turn in progress / smile next | set-up-your-wallet, mobile-wallet |
| `CredentialScreen` | Wallet home: Standard-level credential card, shareable proofs, consent activity | home hero, wallet overview |
| `ZkShareScreen` | Zero-knowledge share: locked fields stay, one proof leaves | home, credentials |
| `WebPortalFrame` | Browser portal: credential, proofs, consents, session security | wallet overview, web wallet |

Every phone SVG has `role="img"` and a full-sentence `aria-label`.

## 7b. Media system

The site carries **real photography** as its "real world" layer — documents,
devices, rooms and objects from open collections. There is no stock-photo look
and no AI-generated imagery: every photograph is public-domain / CC0 source
material rendered through one fixed brand treatment, so a hand holding a phone,
a passport on a desk and a bank vault read as one system.

### Sourcing rules

- Source: Openverse (`api.openverse.org`), filtered to `license=cc0,pdm`, with
  Wikimedia Commons searched directly as a fallback; only `image/jpeg`
  photographs qualify and obvious artwork (paintings, drawings, engravings,
  maps, posters) is rejected by title.
- `scripts/media-harvest.py` downloads, crops, treats and writes both the WebP
  variants and `public/media/manifest.json` (title, creator, licence, source,
  provider, treatment). `scripts/build-media-data.py` generates
  `src/data/media.ts` from the manifest — components import from there, never by
  raw path.
- `/media-credits` lists the whole library with its provenance; the footer links
  to it.
- Banned, permanently: AI-generated images, watermarked stock, imagery of
  identifiable people presented as customers or users, and anything implying the
  network is live.

### Treatment (the pipeline)

1. crop to the placement aspect (bias above centre for portraits);
2. greyscale → **duotone gradient map** in the brand palette
   (`paper`: navy `#142433` → steel `#5b83a8` → paper `#f7fafc`;
   `night`: `#0b141d` → `#3f6b95` → `#cfe3f2`);
3. optional **halftone dot screen** (15°, cell ≈ width/120) for object studies
   with strong silhouettes — never on faces or scenes where legibility matters;
4. export WebP at 720/1100/1200/1440 as placed, quality 78.

Images are never placed raw: the duotone treatment *is* the brand layer.

### Placement

| Component | Use |
| --- | --- |
| `media/MediaFigure.astro` | Any framed image: figures, credits grid. Takes `slug`, `ratio`, `caption`, `credit`, `priority`, `sizes`. |
| `media/MediaBand.astro` | Full-width photographic band with copy beside (`split` / `reverse`) or over the image (`full`, copy on a paper card). |

Rules:

- Images sit in a hairline frame with the tile radius — the same geometry as
  every other surface; captions are body small, credits are letterspaced
  uppercase, and provenance lives on `/media-credits`.
- Text never sits directly on a photograph without a card (the `full` band uses
  a paper card).
- Alt text is short and factual, and never describes a person as a customer.

## 8. Content and voice rules

- **Plain English first.** Every technical concept gets a plain sentence before
  any term of art; jargon is defined on first use ("a zero-knowledge proof — a
  cryptographic yes/no").
- **Sentence caps:** aim ≤ 25 words; ledes ≤ 2 sentences; reading level ~year 9.
- **Second person**, active voice: "you approve", "your wallet shows you".
- **Numbers, not adjectives:** retention is "30 days + 90-day backup rotation",
  never "promptly".
- **Honesty over polish:** limitations are stated (reference implementation,
  no app stores, no accreditation, self-assessed accessibility).
- Sentence case for headings. No exclamation marks. No emoji.

### Insights editorial voice

The `/insights` section is the advocacy/analysis layer (`src/data/insights.ts`).
Its rules are stricter than the service pages because analysis is where
invention creeps in:

- **Evergreen only.** No news pegs, no "recent study", no dated events. An
  article must read true in five years.
- **No invented evidence.** No statistics, figures, case studies, incident
  descriptions or named victims/attackers — qualitative argument only, and
  economics articles argue from structure, never numbers.
- **No personas.** Attribution is "Identity.org.au editorial" (an
  organisational author in Article JSON-LD). Never a fabricated byline.
- **Claims about the service are checkable.** Any sentence describing wallet
  behaviour must be grounded in the open-source code or published policies,
  and should link to the service/help page that carries the detail.
- **Arguments over assertions.** Each article must give the reader the
  reasoning (the honeypot logic, the cave analogy), not conclusions to accept
  on trust — and must state honest limits ("no system should claim deepfake
  immunity").
- Structure: lede ≤ 2 sentences; sections with plain h2s; one callout per
  major argument; a related-articles rail; cross-links into `/wallet`,
  `/help` and `/get-started`.

### Definitions and guides

`/definitions` (`src/data/definitions.ts`) is the reference layer: one page
per term, each mapped to exactly one primary query (see `SEO-PLAN.md`).
`/guides` (`src/data/guides.ts`) holds long-form explainers and how-tos with
the same section/callout/related shape, plus optional comparison tables
rendered with `TableScroll` + `table-gov`.

- Same rules as Insights: evergreen, no statistics or market-size figures,
  no personas, attribution "Identity.org.au editorial".
- One primary query per page — never two pages targeting the same query;
  related queries ride as secondary keywords in the summary.
- Each page ends with a visible `faq` block rendered as native `<details>` —
  FAQPage JSON-LD is emitted from it, and Google requires marked-up questions
  to be visible on the page.
- Government-adjacent content (AGDIS, the Australian landscape) states
  non-affiliation and non-accreditation explicitly, and uses "aligns with the
  principles of" as the ceiling for any comparison with accredited systems.

## 9. Motion

Near zero. The only scripted behaviour on the site is the mobile menu toggle;
FAQ accordions are native `<details>`, and the sharing demonstration uses CSS-only
radio state. Transitions are 140–160ms colour/border eases on hover; the demo's
flow line is the only looping keyframe animation. There are no scroll animations,
no parallax, no animated SVG beyond these restrained diagram cues.
`prefers-reduced-motion: reduce` collapses all remaining transition durations
to 0.01ms globally and disables looping demonstration/diagram motion.

## 10. Honesty locks

Enforced in components so they cannot drift page-by-page:

1. Footer statement: not a government service; not AGDIS/myID/myGov.
2. First FAQ question answers it explicitly (FAQPage JSON-LD included).
3. No accreditation claims anywhere — "aligns with the principles of" is the
   ceiling. No app-store links, no user counts, no invented partners.
4. Illustrated interactions are labelled as demonstrations, and sharing controls
   never imply that data is transmitted by the marketing site.
5. Schema.org uses `Organization` + `Service` — never `GovernmentService`.
