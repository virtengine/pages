# identity.org.au

The dual home of the VirtEngine ecosystem's identity layer: an advocacy and
education hub for privacy-preserving digital identity, **and** the home of the
real Identity Wallet service — whose web portal runs at **my.identity.org.au**
and whose verification makes people approved clients on the VirtEngine
network. Government-service-grade design for a service that is **not** a
government service (and says so on every page). Stewarded by the
not-for-profit DETIO FOUNDATION LTD (ACN 699 651 771).

Astro 5 + Tailwind CSS v4, static output, ~zero client JS (mobile nav toggle
only; FAQ uses native `<details>`).

## Routes (62)

- `/` — service homepage (wallet CTA + phone-mockup hero, fact strip, two-surface
  service band, media band, service cards, levels, insights, trust, support)
- `/how-it-works`, `/for-individuals`, `/faq` (FAQPage JSON-LD), `404`
- `/wallet/` — the service section: overview + `web-wallet` (my.identity.org.au),
  `mobile-wallet`, `verify-on-virtengine` (flow diagram), `credentials`,
  `security`
- `/insights/` — analysis hub + 12 evergreen articles from `src/data/insights.ts`
  (Article JSON-LD, topic tags, related rail)
- `/for-services` + `/for-services/become-a-verifier`,
  `/for-services/integration-overview`
- `/get-started/` — side-nav guide: `what-you-need`, `set-up-your-wallet`,
  `verification-levels`, `if-verification-fails`, `lost-or-new-device`
- `/help/` — help centre index + 16 data-driven articles (`src/data/help.ts`)
- `/about/` — side-nav section: `what-is-identity-org-au`, `the-technology`,
  `who-runs-it`, `open-source`, `patents`
- Policies: `/privacy`, `/terms-of-use`, `/accessibility`, `/security`,
  `/media-credits`
- `/governance` → redirects to `/about/who-runs-it`

## Build

The workspace system npm is broken — use pnpm via full path (PowerShell):

```powershell
& "$env:LOCALAPPDATA\pnpm\bin\pnpm.CMD" install
& "$env:LOCALAPPDATA\pnpm\bin\pnpm.CMD" run build   # runs scripts/og.mjs (og.svg → og.png) then astro build
& "$env:LOCALAPPDATA\pnpm\bin\pnpm.CMD" run preview
```

## Content sources (facts only from these)

- `repos/virtengine/mobile/veid-capture-app/README.md` — capture flow
- `repos/virtengine/docs/veid/biometric-hardware-attestation.md` — enrollment + attestation
- `repos/virtengine/CONSENT_FRAMEWORK.md` — scopes, grant/revoke lifecycle
- `repos/virtengine/BIOMETRIC_DATA_ADDENDUM.md` — retention figures, deletion, breach commitments
- `repos/virtengine/PRIVACY_POLICY.md`, `TERMS_OF_SERVICE.md`, `SECURITY.md`
- `repos/virtengine/x/veid/` — tier constants, composite scoring, zk circuits
  (age range, residency, score range); `x/veidregistry/` — governance-approved
  verifier versions
- DETIO constitution (incl. clause 6.1.3 human-rights purpose) + patent
  AU2024203136B2 (`_agent-context/`)

## Design

See [DESIGN.md](DESIGN.md) — the Ridgemark logo construction, colour tokens
with contrast table, Public Sans type system, the shared section/hero/figure
system, service-design component inventory (banners, steps, cards, tables,
tags, side-nav), interactive sharing demonstration, phone mockup system,
the media system (CC0 photography + navy duotone), content/voice rules and
honesty locks.

## Media

Photography is sourced and treated by scripts, not by hand:

```powershell
python scripts/media-harvest.py        # download + treat + manifest (idempotent)
python scripts/build-media-data.py     # manifest → src/data/media.ts
```

Every image is CC0 / public domain (Openverse, Wikimedia Commons fallback),
cropped to its placement aspect, duotoned in the brand palette, optionally
halftone-screened, and exported as WebP variants. Provenance is listed on
`/media-credits`; never edit `src/data/media.ts` by hand.

## SEO and structured data

- Every page emits one JSON-LD `@graph` from `src/layouts/Base.astro`, built by
  `src/lib/schema.ts`. Nodes are linked by stable `@id`s, so the site, its pages,
  breadcrumbs, articles and the wallet entity form one graph.
- The operator entity (`DETIO FOUNDATION LTD`) is declared with the same `@id`
  that det.io uses — `https://det.io/#organization` — so both hosts describe one
  organisation instead of two lookalikes. Keep that `@id` in sync.
- The Identity Wallet is a `["SoftwareApplication","WebApplication"]` node
  (`#wallet`) referenced by `WebSite.about`; wallet pages are *about* it, policy
  pages are about the foundation.
- Pages add their own nodes with the `schema` prop: `Article` for `/insights`,
  `TechArticle` for `/help`, `FAQPage` for `/faq`, and `CollectionPage` +
  `ItemList` for the `/insights` and `/help` indexes. Never hand-write a
  `<script type="application/ld+json">` in a page — extend `src/lib/schema.ts`.
- `modifiedTime` drives `dateModified` and `article:modified_time`; it is set
  only from the real `updated` field in `src/data/`. Never invent a date.
- Validate after a build:
  `pnpm build && node scripts/check-structured-data.mjs` (exit code 1 on any
  error). It checks JSON validity, required properties per type, `@id`
  resolution, absolute URLs, headline length, and that FAQ markup is visible.
- `pnpm audit:seo` reports duplicate/missing/overlong titles and meta
  descriptions across `dist/` (advisory, always exits 0).
- `src/lib/meta.ts` shapes `<title>` and the meta description for search display
  — titles into ~65 characters (dropping a redundant segment or a parenthetical),
  descriptions into 158 characters at a word boundary. Meta output only: visible
  headings and ledes keep their authored text.
- `/rss.xml` is the insights feed, ordered by the real `updated` field and
  advertised with `<link rel="alternate" type="application/rss+xml">`.

