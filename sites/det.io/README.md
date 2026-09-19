# det.io — DET.io Foundation

Static site for **DETIO FOUNDATION LTD** (ACN 699 651 771), a not-for-profit
public company limited by guarantee (Australia) and technical research
organization for decentralized technologies. Steward of the **VirtEngine**
protocol and the **DSEMA** multi-agent architecture.

Built with Astro 5, Tailwind CSS v4, and TypeScript (strict). Static output,
near-zero client JavaScript (the mobile navigation toggle is the only script).
Brand identity is built from the real DET.io logo — sky-blue cloud mark +
DET·IO wordmark — rebuilt as inline SVG in `src/components/brand/`
(see [DESIGN.md](DESIGN.md)).

## Pages (33 routes)

| Route | Purpose |
| --- | --- |
| `/` | Institutional home: mission, programs, public-benefit lock, constitution explorer, ecosystem |
| `/mission` | Charitable purposes (cl 6), funding constraints (cl 9), code of conduct (cl 10) |
| `/constitution` | Constitution explorer index — 10 plain-language topics + document map |
| `/constitution/[slug]` | 10 topic pages from `src/data/constitution.ts`: purpose-and-public-benefit-lock, not-for-profit-and-remuneration-rules, members-and-membership, amendments-and-protected-provisions, reserved-matters, directors-and-permanent-director, asset-stewardship-and-transferred-assets, protocol-governance-privacy-and-safety, meetings-records-and-disputes, winding-up-and-the-charity-lock |
| `/research` | Research portfolio index — 2 programs + 6 topics |
| `/research/virtengine` | VirtEngine program: protocol, VEID, patent AU2024203136B2 |
| `/research/dsema` | DSEMA program: v1.0.5 spec deep dive — dual loops, ensemble mathematics, containment, adversarial evolution, amendment governance |
| `/research/[slug]` | 6 topic pages from `src/data/research.ts`: decentralized-identity, multi-agent-safety, confidential-computing, protocol-governance-design, incentive-mechanism-design, privacy-preserving-verification |
| `/foundation` | Institution index |
| `/foundation/[slug]` | 5 pages from `src/data/foundation.ts`: who-we-are, public-benefit-lock, intellectual-property-stewardship, code-of-conduct, membership |
| `/faq` | 14 questions with FAQPage JSON-LD, from `src/data/faq.ts` |
| `/governance` | Members, directors, Protected Provisions, Reserved Matters, winding-up |
| `/transparency` | Verifiable commitments and document shelf |
| `/contact` | Inquiry routing |
| `/404` | Not-found page |

Plus `robots.txt`, `sitemap-index.xml` (via `@astrojs/sitemap`), `favicon.svg`
(cloud mark), and a rasterized OG image (`og.png`, generated from `og.svg` at
build time). Every page carries unique meta, canonical, OG/Twitter cards, and
breadcrumbs (visible + BreadcrumbList JSON-LD on interior pages).

## Development

System npm is broken in this environment — use the pnpm shim directly:

```powershell
cd sites/det.io
& "$env:LOCALAPPDATA\pnpm\bin\pnpm.CMD" install
& "$env:LOCALAPPDATA\pnpm\bin\pnpm.CMD" run dev      # dev server
& "$env:LOCALAPPDATA\pnpm\bin\pnpm.CMD" run build    # og.png prebuild + astro build → dist/
& "$env:LOCALAPPDATA\pnpm\bin\pnpm.CMD" run preview  # serve dist/
```

Notes:

- `pnpm-workspace.yaml` sets `allowBuilds` for `esbuild` and `sharp`
  (pnpm blocks postinstall scripts by default).
- `scripts/og.mjs` rasterizes `public/og.svg` → `public/og.png` with sharp
  before every build.
- `build.format: "file"` pairs with `trailingSlash: "never"` so canonical
  URLs match emitted files.

## Content rules

All factual claims are grounded in source documents (the signed constitution,
the DSEMA v1.0.5 specification, patent claim documents, and the VirtEngine
repository). Do not add team members, financials, addresses, partner logos,
or charity-registration claims not supported by those sources. Constitution
clause references on the site use the `ClauseRef` component — keep them
accurate to the signed instrument.

See [DESIGN.md](DESIGN.md) for the design system.

## SEO and structured data

- Every page emits one JSON-LD `@graph` from `src/layouts/Base.astro`, built by
  `src/lib/schema.ts`. Nodes are linked by stable `@id`s, so the site, its pages,
  breadcrumbs and articles form one entity graph instead of unrelated blobs.
- The graph always contains `ImageObject #logo`, `Organization #organization`,
  `WebSite #website` and a `WebPage` for the page itself, plus a `BreadcrumbList`
  when the page passes `breadcrumbs`.
- Pages add their own nodes with the `schema` prop: `Article` for constitution
  and foundation explainers, `TechArticle` for research topics, `CollectionPage`
  + `ItemList` for `/constitution`, `/foundation` and `/research` indexes, and
  `FAQPage` for `/faq`. Never hand-write a `<script type="application/ld+json">`
  in a page — extend `src/lib/schema.ts` instead.
- `Article` nodes carry no `datePublished`: the content data has no publication
  dates and inventing one would be a false claim. Add a real `updated` field to
  the data first if you want dates in the markup.
- The organisation entity is `["Organization","NGO"]` with ACN/ABN identifiers
  and no charity-registration claim, matching what the site states.
- Validate after a build: `pnpm build && node scripts/check-structured-data.mjs`
  (exit code 1 on any error). It checks JSON validity, required properties per
  type, `@id` resolution, absolute URLs, headline length, and that FAQ markup is
  visible on the page.
- `pnpm audit:seo` reports duplicate/missing/overlong titles and meta
  descriptions across `dist/` (advisory, always exits 0).
- `src/lib/meta.ts` shapes `<title>` and the meta description for search display
  — titles into ~65 characters by dropping a redundant segment, descriptions into
  158 characters at a word boundary. It only affects meta output; visible
  headings and ledes (including the constitution/research `summary` fields) keep
  their authored text.
- `/rss.xml` is a feed of the research, constitution and foundation pages. Items
  carry no `pubDate` because the data has no dates — add an `updated` field to
  the data before adding dates to the feed or `dateModified` to the markup.

