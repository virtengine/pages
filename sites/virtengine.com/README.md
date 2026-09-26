# virtengine.com

Marketing/project site for the **VirtEngine Protocol** — the open-source
decentralized cloud marketplace protocol. This site targets providers,
validators & staking partners, and open-source contributors; it is not an
end-user entry point.

Built with Astro 5 (static output), Tailwind CSS v4 (`@tailwindcss/vite`),
TypeScript strict, and near-zero client JavaScript (the only script is the
mobile navigation toggle).

## Commands

The system `npm` in this workspace is broken (Nodist npm 6). Use pnpm via its
full path in PowerShell:

```powershell
& "$env:LOCALAPPDATA\pnpm\bin\pnpm.CMD" install
& "$env:LOCALAPPDATA\pnpm\bin\pnpm.CMD" run dev
& "$env:LOCALAPPDATA\pnpm\bin\pnpm.CMD" run build   # runs scripts/og.mjs (OG PNG) then astro build
& "$env:LOCALAPPDATA\pnpm\bin\pnpm.CMD" run preview
```

`pnpm-workspace.yaml` allows the `esbuild` and `sharp` postinstall builds.

## Structure

```
public/            official PNG brand assets, favicon.png, robots.txt, og.png (generated)
scripts/og.mjs     builds og.png (1200×630) around the official PNG lockup via sharp
src/
  data/site.ts     site constants, nav, footer columns, module map, lifecycle copy
  data/modules.ts  26-entry module reference → /modules/[slug]
  data/solutions.ts 10 audience/use-case pages → /solutions/[slug]
  data/learn.ts    10 explainer guides → /learn/[slug]
  data/faq.ts      FAQ entries → /faq (FAQPage JSON-LD)
  layouts/Base.astro   head/SEO/JSON-LD + header/footer shell
  components/brand/    Mark.astro (real triangle mark), Lockup.astro (mark + wordmark)
  components/      Header, Footer, Section, Card, CTA, DiagramFrame,
                   StatCallout, PageHero, Breadcrumbs
  components/diagrams/  hand-crafted animated SVG diagrams (see DESIGN.md)
  pages/           index, protocol, providers, staking, open-source,
                   network, veid, about, faq, 404
  pages/modules/   [slug].astro + index.astro (module reference)
  pages/solutions/ [slug].astro + index.astro (audience pages)
  pages/learn/     [slug].astro + index.astro (guides)
  styles/global.css    Tailwind v4 theme tokens + shared patterns
```

## Content rules

- Facts come from `repos/virtengine/` (README, docs/) and the shared brief —
  never invent statistics, partners, or team members.
- Network launch claims must match the repo posture exactly: TestNet is planned
  for January 2027; MainNet is planned for March 2027 after TestNet exit
  criteria and a fresh go/no-go approval. The April 2026 MainNet windows did
  not proceed and are historical only. Do not describe either network as live
  before formal confirmation.
- Patent language: Apache 2.0 + patent AU2024203136B2; the Apache grant covers
  use within the project.
- Design tokens, logo construction, and diagram conventions are documented in
  `DESIGN.md`. The visual identity is built from the real VirtEngine brand:
  green `#60CC5D` nested-triangle mark + grey `#575757` wordmark
  (source assets in `_agent-context/brand/virtengine/`).

## SEO and structured data

- Every page emits one JSON-LD `@graph` from `src/layouts/Base.astro`, built by
  `src/lib/schema.ts`. Nodes are linked by stable `@id`s, so the site, its pages,
  breadcrumbs and articles form one entity graph instead of unrelated blobs.
- The graph always contains `ImageObject #logo`, `Organization #organization`,
  `WebSite #website` and a `WebPage` for the page itself, plus a `BreadcrumbList`
  when the page passes `breadcrumbs`.
- Pages add their own nodes with the `schema` prop: `BlogPosting` for journal
  articles, `TechArticle` for `/learn` guides, `FAQPage` for `/faq`, and
  `SoftwareApplication` for the home page. Never hand-write a `<script
  type="application/ld+json">` in a page — extend `src/lib/schema.ts` instead.
- `publishedTime` / `modifiedTime` / `section` props drive `datePublished`,
  `dateModified`, `article:published_time` and `og:article:section`. Set them
  only from real dates in `src/data/`; never invent a date to satisfy a linter.
- Paginated views of the historic blog archive are `noindex` and excluded from
  the sitemap; the sitemap filter lives in `astro.config.mjs`.
- Validate after a build: `pnpm build && node scripts/check-structured-data.mjs`
  (exit code 1 on any error). It checks JSON validity, required properties per
  type, `@id` resolution, absolute URLs, headline length, and that FAQ markup is
  visible on the page.
- `pnpm audit:seo` reports duplicate/missing/overlong titles and meta
  descriptions across `dist/` (advisory, always exits 0).
- `src/lib/meta.ts` shapes `<title>` and the meta description for search display
  — titles into ~65 characters by dropping a redundant segment, descriptions into
  158 characters at a word boundary. It only affects meta output; visible
  headings and ledes keep their authored text.
- The journal feed lives at `/blog/rss.xml`, advertised with
  `<link rel="alternate" type="application/rss+xml">`.

