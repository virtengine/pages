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

### Existing (pre-release)

The repository was created with four Astro sites under `sites/` and one
Cloudflare Worker under `workers/`. See the git log for full history.