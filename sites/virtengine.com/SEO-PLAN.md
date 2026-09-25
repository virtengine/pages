# SEO plan — category definition hub for virtengine.com

Modelled on NVIDIA's glossary entry ("What is HPC?") and IBM's `/topics/` pages:
one crawlable URL per definition, grouped in a hub, funnelling into the existing
commercial category pages. Created 2026-09-25. Pattern proven in-repo on
`sites/identity.org.au/SEO-PLAN.md` (definitions + guides hubs, phases 1–4).

## Strategy in three sentences

1. Build a `/definitions/what-is-*` hub on virtengine.com — one page per
   category term (IaaS, PaaS, SaaS, infrastructure, AI inference, training,
   HPC…), because a single-page glossary cannot rank per term and `/learn/` is
   deliberately curated ("fewer, stronger guides").
2. Tier the pages by winnability: ship the niche and intersection terms VirtEngine
   has a genuine right to win **first** (AI inference, GPU-as-a-service, compute
   marketplace, SLURM), then the high-volume category heads (IaaS/PaaS/SaaS, HPC,
   cloud computing) whose SERPs are owned by DA 90+ vendors — those are
   authority-builders and snippet plays, not 90-day rank wins.
3. Every page earns its uniqueness with a section NVIDIA cannot write — how the
   thing is **bought, metered and settled on an open marketplace** — which
   funnels to `/marketplace/*` and keeps `check:duplication` clean.

## Division of labour between the two sites

| Site | Owns | Examples |
|---|---|---|
| virtengine.com | Category, informational and commercial queries | "what is ai inference", "gpu as a service", "what is IaaS" |
| docs.virtengine.com | Technical/developer reference | module APIs, SLURM configuration, settlement mechanics |

Definitions link out to docs for depth; docs pages do not target category queries.

## Rules (non-negotiable, from DESIGN.md §9/§10 + build gates)

- Engineering candor: claims trace to the repository or constitution; no
  invented statistics, market-size figures or dates (learn.ts: "No invented
  figures"). Definition sections stay neutral-factual; the VirtEngine angle
  lives only in the clearly labelled marketplace section.
- No emoji, no exclamation-mark marketing, no "revolutionary".
- One primary keyword per page — never two pages targeting the same query.
- Every page: single `h1`, visible FAQ when `FAQPage` JSON-LD is emitted,
  ≥3 internal links out, `Article` + `FAQPage` + breadcrumbs via the `schema`
  prop on `Base` (same as `learn/[slug].astro`).
- `audit:seo` gates: title ≤65 chars, description ≤165 chars, both unique.
- `check:duplication` flags 12+ consecutive identical words across pages —
  shared template provides **structure, never sentences**; every "on a
  marketplace" section is written fresh per page.
- Title pattern: `What is {Term}? | VirtEngine` (+ ` Definitions` only if the
  term name is short enough to stay ≤65).

## Keyword → page map

### Tier A — win first (Phase 2): winnable SERPs, high funnel value

| Primary query | URL | Funnel target | Why winnable |
|---|---|---|---|
| what is ai inference | `/definitions/what-is-ai-inference` | `/marketplace/gpu-compute` | SERP is scattered blogs, no canonical owner; we add marketplace angle |
| gpu as a service | `/definitions/gpu-as-a-service` | `/marketplace/gpu-compute` | Strong buyer intent, vendor pages only |
| what is a compute marketplace | `/definitions/what-is-a-compute-marketplace` | `/marketplace` | Near-zero competition; brand-defining query |
| decentralized cloud computing | `/definitions/what-is-decentralized-cloud` | `/protocol` | Emerging term, no incumbent definition |
| what is slurm | `/definitions/what-is-slurm` | `/marketplace/hpc` → docs HPC concept | Technical right-to-win: docs already document the SLURM integration |
| what is usage-based billing | `/definitions/what-is-usage-based-billing` | `/learn/escrow-and-settlement-explained` | Commercial research intent, weak incumbent content |
| what is bare metal | `/definitions/what-is-bare-metal` | `/marketplace/iaas` | IaaS-adjacent, winnable with the marketplace framing |

### Tier B — category heads (Phase 3): cluster completeness, long-tail + snippets first

| Primary query | URL | Funnel target | Honest expectation |
|---|---|---|---|
| what is iaas | `/definitions/what-is-iaas` | `/marketplace/iaas` | IBM/Azure own the head; win long-tail + snippets, feed the pillar |
| what is paas | `/definitions/what-is-paas` | `/marketplace/paas` | same |
| what is saas | `/definitions/what-is-saas` | `/marketplace/saas` | same |
| what is ai training | `/definitions/what-is-ai-training` | `/solutions/ai-ml-workloads` | Winnable-adjacent; pairs with inference page |
| what is hpc | `/definitions/what-is-hpc` | `/marketplace/hpc` | NVIDIA/IBM own it (the reference query) — target snippet + "hpc cloud" variants |
| what is cloud computing | `/definitions/what-is-cloud-computing` | `/marketplace` | Parent term; include for cluster completeness, rank expectations low |
| what is cloud storage | `/definitions/what-is-cloud-storage` | `/marketplace/storage` | Long-tail viable |
| what is private cloud | `/definitions/what-is-private-cloud` | `/marketplace/iaas` | Winnable with marketplace angle |
| what is a virtual machine | `/definitions/what-is-a-virtual-machine` | `/marketplace/iaas` | Head very hard; long-tail "VM in cloud" is the realistic win |
| what is containerization | `/definitions/what-is-containerization` | `/marketplace/paas` | Moderate; PaaS funnel |
| what is serverless | `/definitions/what-is-serverless` | `/marketplace/paas` | Optional; last in Phase 3 |

### Deliberate non-pages

- **"IaaS vs PaaS vs SaaS"** — the existing learn guide
  `IaaS vs PaaS vs SaaS on VirtEngine` owns the comparison query. Definitions
  target "what is X" only and cross-link to the guide.
- **"what is VEID / tokenomics / slashing / staking / validator"** —
  VirtEngine-specific versions exist in `/learn/` and docs; generic crypto
  definitions ("what is staking") are owned by ethereum.org/Coinbase and are
  off-intent for this audience. Skip unless GSC later shows impressions.
- **News-style or figure-led posts** — DESIGN.md §10 forbids invented stats;
  blog stays announcements-only, definitions carry the evergreen load.
- **Two pages, one query** — every mapped query appears exactly once above.

## Page template (NVIDIA anatomy + marketplace differentiator)

1. **H1** — `What is {Term}?`
2. **Definition block** — 40–70 word first paragraph, snippet-eligible, neutral.
3. **How {term} works / key characteristics** — bullets, freshly written.
4. **{term} in context** — short neutral comparison against 2–3 siblings
   (links to their definition pages; never re-derives the comparison guide).
5. **Use cases** — who buys/uses it and why.
6. **{term} on an open marketplace** — the unique section: how it is listed,
   metered, escrowed and settled on VirtEngine; one CTA to the funnel target.
   Written fresh every time (duplication gate).
7. **FAQ** — 3–4 Q&A pairs, visible on page, `FAQPage` schema.
8. **Related definitions** — 4–6 hub links + link back to `/definitions/`.

Body 700–1,100 words. No custom artwork required; optional reuse of existing
figures only if genuinely illustrative.

## Internal linking

- `/definitions/` hub groups pages under the five category sections the brief
  names: **Service models · Infrastructure · AI & GPU compute · HPC ·
  Marketplace & protocol** — the hub is the glossary-style index.
- Each definition: ≥3 links out (siblings + money page + docs or learn).
- Existing pages gain inbound links in Phase 4: `/marketplace/*` → its
  definition ("What is X?"), `/learn/marketplace-glossary` → definitions,
  the IaaS/PaaS/SaaS learn guide ↔ definition trio.
- Nav: add the hub under the Learn/footer area only — top nav stays as is.

## Phases

- **Phase 0** — this file; `pnpm audit:seo` baseline from a clean build;
  pull GSC queries for virtengine.com (if access exists) and adjust the map
  above before writing — the identity.org.au plan was built this way.
- **Phase 1** — hub scaffolding: `src/data/definitions.ts`,
  `src/pages/definitions/index.astro`, `src/pages/definitions/[slug].astro`
  (mirror the identity.org.au implementation), schema + nav wiring.
- **Phase 2** — Tier A pages (7), first batch of data entries.
- **Phase 3** — Tier B pages (10–11), cluster completed.
- **Phase 4** — existing-content pass: marketplace category pages, glossary,
  IaaS/PaaS/SaaS guide and Learn index link into the hub.
- **Phase 5** — verification: `pnpm build`, `check:schema`, `audit:seo`,
  `check:links`, `check:a11y`, `check:duplication`; deploy; GSC at 30/90 days.

## Measurement

- Baseline: `audit:seo` counts from the Phase 0 build (target: no regression as
  pages are added — titles/descriptions stay unique, within limits).
- 30 days: all new URLs indexed (`site:virtengine.com/definitions`).
- 90 days: impressions per mapped query. Tier A queries should show movement
  first; Tier B judged on long-tail impressions and snippet presence, not head
  position. Pages with impressions but no clicks get a title/description pass.
- Funnel check: which `/marketplace/*` pages gained sessions from definitions.
