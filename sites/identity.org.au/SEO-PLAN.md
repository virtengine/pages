# SEO plan — resource hubs for identity.org.au

Search-console queries this plan targets (all currently low-impression), the page
each query maps to, and the rules every new page must follow. Created
2026-09-25; phases 1–4 executed in the same pass.

## Rules (non-negotiable, from DESIGN.md §8/§10)

- Evergreen only. No statistics, market-size figures, news pegs, dates or
  personas. Attribution is "Identity.org.au editorial".
- Honesty locks: not a government service; no accreditation claims ("aligns
  with the principles of" is the ceiling); AGDIS content states non-affiliation
  explicitly; never `GovernmentService` schema.
- One primary keyword per page — never two pages targeting the same query.
- Every new page: ≥3 internal links out, visible FAQ markup when FAQPage
  JSON-LD is emitted, `updated` dates from real data only.
- Facts about the service only from the README content-source list.

## Keyword → page map

| Query (impressions) | Target page | Hub |
|---|---|---|
| what is identity document | `/definitions/what-is-an-identity-document` | Definitions |
| digital identity verification (8), digital identity check (3) | `/definitions/what-is-digital-identity-verification` (check = secondary) | Definitions |
| digital identity proofing (1) | `/definitions/what-is-digital-identity-proofing` | Definitions |
| document verification system (1), document verification services (1) | `/definitions/what-is-document-verification` | Definitions |
| biometric digital id (1), biometric digital identity (1) | `/definitions/what-is-biometric-identity-verification` | Definitions |
| digital identity wallet (3) | `/definitions/what-is-a-digital-identity-wallet` | Definitions |
| digital identity card (1) | `/definitions/what-is-a-digital-identity-card` | Definitions |
| digital identity services (1) | `/definitions/what-is-a-digital-identity-service` | Definitions |
| how to protect your identity for free | `/guides/how-to-protect-your-identity-for-free` | Guides |
| age verification (2), age verif (2), age id, age identification | `/guides/age-verification-explained` | Guides |
| agdis, australian digital identity (4) | `/guides/australian-government-digital-id-system` | Guides |
| australia identity verification market (2), australian digital identity (4) | `/guides/digital-identity-in-australia` | Guides |
| identity verification solutions, biometrics identity verification system, direct identity (4) | `/guides/identity-verification-solutions-compared` | Guides |
| ai generated fake ids (1) | existing `/insights/ai-generated-fraud-and-fake-ids` — inbound links only | Insights |

Deliberate non-pages: "digital identity check" is a secondary keyword of
digital identity verification (identical intent — avoids cannibalisation).
"direct identity" is interpreted as authoritative-source ("direct") verification
and covered inside the comparison guide; re-check intent in GSC at 90 days.

## Phases

- **Phase 0** — this file; `audit:seo` baseline captured from the build.
- **Phase 1** — `/definitions/` hub: `src/data/definitions.ts` (8 terms),
  `src/pages/definitions/index.astro`, `src/pages/definitions/[slug].astro`.
  Article + FAQPage JSON-LD from `articleNode`/`faqPageNode`.
- **Phase 2** — `/guides/` hub: `src/data/guides.ts` (5 guides),
  `src/pages/guides/index.astro`, `src/pages/guides/[slug].astro`.
  Same schema pattern; one comparison table via `TableScroll`.
- **Phase 3** — existing-content pass: FAQ "Key terms" group, Guides in `NAV`
  and a new footer "Learn" column, for-services meta retunes + method-compare
  card, guides strip on `/insights` and the homepage, help-centre related
  resources, guides merged into `/rss.xml`, README/DESIGN documentation.
- **Phase 4** — verification: `pnpm build`, `check:schema`, `audit:seo`,
  `check:links`, `check:a11y`; deploy; monitor GSC at 30/90 days.

## Measurement

- Baseline: all listed queries 0 clicks; impressions 1–8 each.
- 30 days: new URLs indexed (site:identity.org.au/definitions, /guides).
- 90 days: impressions per mapped query; revisit "direct identity" intent;
  promote pages with impressions but no clicks by tightening titles.
