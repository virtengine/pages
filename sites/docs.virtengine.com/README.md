# docs.virtengine.com

Canonical documentation for the **VirtEngine Protocol** — a decentralized
cloud computing marketplace built on CometBFT and the Cosmos SDK. Built with
[Astro 5](https://astro.build) and
[Starlight](https://starlight.astro.build).

This site replaces the legacy Jekyll documentation (`docs-2.virtengine.com`)
and documents the protocol for six audiences: providers, tenants/deployers,
validators & staking partners, developers, researchers/auditors, and VEID
identity users. The legacy Waldur-based cloud platform is preserved in a
clearly-marked "Cloud Platform (Legacy)" section.

## Requirements

- Node.js ≥ 20.3 (developed against v20.19.1)
- pnpm (the workspace toolchain uses pnpm 11; the system npm is broken —
  see below)

## Commands

All commands run from this directory. On the development machine the
system `npm` is unusable (Nodist npm 6), so use pnpm via its full path:

```powershell
& "$env:LOCALAPPDATA\pnpm\bin\pnpm.CMD" install     # install dependencies
& "$env:LOCALAPPDATA\pnpm\bin\pnpm.CMD" run dev     # dev server at localhost:4321
& "$env:LOCALAPPDATA\pnpm\bin\pnpm.CMD" run build   # production build to ./dist
& "$env:LOCALAPPDATA\pnpm\bin\pnpm.CMD" run preview # preview the build
& "$env:LOCALAPPDATA\pnpm\bin\pnpm.CMD" run deploy  # build and deploy to Cloudflare Pages
```

On a machine with a healthy toolchain, plain `pnpm install` / `pnpm run
build` work identically.

## Deployment

The production site is hosted by **Cloudflare Pages** as the
`docs-virtengine-com` project. Cloudflare watches the `main` branch of the
`virtengine/pages` repository and builds this monorepo directory with:

- Root directory: `sites/docs.virtengine.com`
- Build command: `pnpm install --frozen-lockfile && pnpm run build`
- Build output directory: `dist`
- Custom domain: `docs.virtengine.com`

The checked-in `wrangler.jsonc` is the deployment source of truth for direct
deployments. `public/_headers` contains the Cloudflare Pages security and cache
policy, while `public/_redirects` preserves high-level legacy Jekyll routes.
Netlify is not part of the deployment path.

## Project structure

```
astro.config.mjs             # Starlight config: sidebar, theme, fonts, SEO
src/
  content.config.ts          # Astro content collections (Starlight docsLoader)
  content/docs/              # All documentation pages (MDX)
    index.mdx                # Landing page (splash)
    protocol/                # Introduction, how-it-works, architecture, modules
    concepts/                # Marketplace, escrow, usage, tokenomics, BME, ...
    veid/                    # Identity layer: enrollment, attestation, consent, privacy
    providers/               # Provider onboarding, daemon, HPC ops, payouts
    validators/              # Validators, staking, slashing, governance, mainnet
    tenants/                 # Deploying, leases/escrow, provider selection, HPC jobs
    developers/              # Building, dev environment, SDKs, contributing
    cloud-platform/          # Legacy Waldur-based platform docs
  components/diagrams/       # Hand-crafted, theme-aware inline SVG diagrams
  styles/custom.css          # Design tokens & Starlight overrides (see DESIGN.md)
  assets/                    # Logo SVGs (light/dark)
public/
  favicon.svg, og.svg, robots.txt
```

## Content sourcing rules

All protocol content is sourced from the `virtengine` repository
(`repos/virtengine/` in the parent workspace): README, `docs/*.md`,
`x/` module sources, `CONSENT_FRAMEWORK.md`, and operations guides.
Do **not** invent statistics, network-status claims, or parameters — the
mainnet posture in particular must match
`_docs/operations/mainnet-go-no-go-decision.md` (GO decision 2026-04-11,
launch windows 2026-04-18/19 UTC, network not to be described as live
beyond that).

## Design

See [DESIGN.md](./DESIGN.md) for the design tokens (palette, typography,
diagram conventions) and how the Starlight theme is customized.
