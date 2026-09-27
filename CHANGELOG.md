# Changelog

All notable changes to the VirtEngine pages monorepo are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/),
and this project adheres to [Calendar Versioning](https://calver.org/)
(`vYYYY.MM.DD`).

## v2026.09.25 — Unreleased

### Added

- **pages:** Release workflow, RELEASE.md, and changelog config.
- **pages:** generate-release-body.mjs — groups commits by conventional
  commit type and detects which sites changed.
- **pages:** CalVer versioning scheme documented in RELEASE.md.
- **pages:** Release body now carries a production deploy table (Cloudflare
  Pages project, production URL, `*.pages.dev` preview) for all four sites and
  the full commit SHA, so a release is a complete rollback reference.

### Fixed

- **pages:** RELEASE.md no longer claims a pushed tag triggers the release
  workflow. The workflow is `workflow_dispatch`-only and creates the tag
  itself; the manual path is now documented as an emergency snapshot that
  requires a hand-made GitHub Release.
- **pages:** First-release "Affected sites" no longer reports an empty list —
  with no previous tag the diff range compared HEAD against the working tree.
  It now names all sites and labels the release as the first one.

### Existing (pre-release)

The repository was created with four Astro sites under `sites/` and one
Cloudflare Worker under `workers/`. See the git log for full history.