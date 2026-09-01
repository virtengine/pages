# DESIGN — docs.virtengine.com

An engineering-grade documentation identity for the VirtEngine Protocol:
near-black slate surfaces, an electric teal/green accent, geometric display
type, and hand-crafted theme-aware SVG diagrams. Deliberately not the
generic purple-gradient docs look.

Implementation lives in `src/styles/custom.css` (Starlight CSS custom
property overrides) and `src/components/diagrams/` (SVG components).

## Color tokens

### Brand constants

| Token | Value | Use |
| --- | --- | --- |
| `--ve-teal` | `#14b892` | Primary accent (dark theme accent) |
| `--ve-teal-bright` | `#2ee6b7` | Logo/mark accent, OG art |
| `--ve-slate-ink` | `#0b1418` | Near-black slate base |

### Dark theme (default)

| Starlight token | Value |
| --- | --- |
| `--sl-color-accent-low` | `#0c3d31` |
| `--sl-color-accent` | `#14b892` |
| `--sl-color-accent-high` | `#8ef2d5` |
| `--sl-color-white` | `#f0f6f4` |
| `--sl-color-gray-1…6` | `#d5e0dc → #16211d` (cool slate ramp) |
| `--sl-color-black` | `#0b1418` |
| `--sl-color-bg-nav` / `-sidebar` | `#0d1a17` / `#0c1714` |
| `--sl-color-hairline` | `#1d2b26` |

### Light theme

| Starlight token | Value |
| --- | --- |
| `--sl-color-accent-low` | `#c9f2e5` |
| `--sl-color-accent` | `#0a7a5c` |
| `--sl-color-accent-high` | `#08503d` |
| `--sl-color-white` (text) | `#10201b` |
| `--sl-color-black` (bg) | `#fcfefd` |
| Gray ramp | `#1e312b → #f6faf8` |

Accent colors hold ≥ AA contrast against their paired surfaces in both
themes (teal-on-slate and deep-green-on-paper).

## Typography

| Role | Face | Weights | Token |
| --- | --- | --- | --- |
| Display / headings / logo | Space Grotesk | 500 / 600 / 700 | `--ve-font-display` |
| Body / UI | Inter | 400 / 500 / 600 | `--sl-font` |
| Code / data | JetBrains Mono | 400 / 500 | `--sl-font-mono` |

All loaded via `@fontsource/*` packages in `astro.config.mjs` `customCss`.
Headings use `letter-spacing: -0.015em`; the hero H1 uses a
white→accent-high gradient text fill and `clamp(2.4rem, 5vw, 3.6rem)`.

## Logo & mark

- **Mark**: a hexagonal network — six peripheral nodes joined to a hollow
  center node — representing providers/tenants meeting at the chain.
- **Wordmark**: "Virt" in ink + "Engine" in accent, Space Grotesk 700, with
  an outlined `DOCS` tag.
- Files: `src/assets/logo-light.svg`, `src/assets/logo-dark.svg` (theme
  swapped by Starlight), `public/favicon.svg` (mark only, rounded square),
  `public/og.svg` (1200×630 social card, same motif).

## Diagram system

Diagrams are Astro components with inline SVG (`src/components/diagrams/`),
not static images, so they inherit theme tokens and swap correctly between
light/dark:

- Boxes: `--sl-color-gray-6` fill with `--sl-color-gray-4` stroke; key
  stages use `--sl-color-accent-low`/`--sl-color-accent`.
- Flow arrows: accent-colored with SVG markers; warning flows (slashing)
  use `--sl-color-orange`.
- Type inside diagrams: display face ~13px titles, body ~11px annotations,
  mono for step labels/module names.
- Every diagram has a `role="img"` + descriptive `aria-label` and an
  optional `<figcaption>`.
- Wrapper: `.ve-diagram` — bordered, radius 0.6rem, subtle accent-tinted
  panel, horizontal scroll on overflow, animations disabled under
  `prefers-reduced-motion`.

Inventory: MarketplaceFlow, ArchitectureDiagram, EscrowSequence,
StakingFlow, VeidPipeline, HpcFlow, plus the hero network artwork on the
landing page.

## Spacing & radii

Starlight defaults govern layout rhythm; local conventions:

| Element | Radius |
| --- | --- |
| Cards, diagram panels | 0.6rem |
| Code frames | 0.5rem |
| Hero art container | 24px |
| Favicon tile | 7px (36px tile) |

## Components & patterns

- **Cards** (`CardGrid`): gradient surface from gray-6 toward
  accent-low; display-face titles.
- **Asides**: used for the patent notice, mainnet-liveness caution, and
  legacy-section warnings — semantic variants only (`note`, `caution`).
- **Tabs**: scheduler configs (SLURM/MOAB/OOD), platform matrices
  (Android/iOS).
- **Steps**: all onboarding/enrollment sequences.
- **Legacy badge**: sidebar + per-page `caution` badge for the Cloud
  Platform section.

## Accessibility

- AA+ contrast in both themes; accent tuned darker in light mode
  (`#0a7a5c`) for text-on-paper legibility.
- Diagrams carry full text alternatives via `aria-label`.
- Reduced-motion media query kills all diagram animation/transitions.
- Starlight provides skip links, landmarks, and keyboard navigation out of
  the box; nothing in the customization removes them.
