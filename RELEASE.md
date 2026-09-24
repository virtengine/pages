# Release process

## Versioning scheme

This monorepo uses **calendar versioning (CalVer)** in the format `vYYYY.MM.DD`.

- `v2026.09.25` — a release cut on 25 September 2026.
- When multiple releases are needed on the same day, append a revision: `v2026.09.25-2`.

This scheme is suited to a content-and-static-site monorepo where:
- The four sites are independently deployed (Cloudflare Pages).
- "Version compatibility" (semver) is not meaningful for static HTML/JS sites.
- The date provides immediate context about when a snapshot was live.

## What a release means

A release is a **tagged snapshot of all sites at a known commit**. It:

- Records the commit SHA of the snapshot so any site can be reproduced.
- Captures a deploy log of which Cloudflare Pages deployments correspond to
  that commit for each site (added to the release body by the workflow).
- Serves as a rollback point — any tagged commit can be redeployed.

The release tag is pushed to GitHub, which triggers the release workflow to
produce a **GitHub Release** with:

- The tag name and commit SHA.
- A changelog of commits since the previous release, grouped by type.
- Links to the deploy previews (added manually or via subsequent CI).

## Creating a release

### Automated (recommended)

Trigger the **Release** workflow from the GitHub Actions UI:

1. Go to Actions > Release > Run workflow.
2. Enter the version (e.g., `2026.09.25`) — the `v` prefix is added automatically.
3. Optionally enter a release title (defaults to the tag name).
4. The workflow creates the tag, generates the changelog, and publishes the
   GitHub Release.

### Manual

```bash
# Ensure main is up to date
git checkout main && git pull

# Tag and push
git tag v2026.09.25
git push origin v2026.09.25

# The release workflow creates the GitHub Release automatically.
```

## Changelog

Commits should follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat(site): add search to docs
fix(site): correct broken link on virtengine.com
docs(site): update deployment guide
ci(pages): harden build gate
```

The release workflow groups commits into categories (Features, Fixes,
Documentation, Maintenance) and includes a summary of affected sites.

## Release workflow

The workflow lives at `.github/workflows/release.yaml`. It:

1. Checks out the full commit history.
2. Builds all sites to confirm the snapshot is valid.
3. Generates a release body from `git log` between the previous tag and this one.
4. Creates or uses the tag and publishes a GitHub Release.

Site-specific Cloudflare Pages deployments happen independently via the
existing CI or manual `wrangler pages deploy` commands — the release workflow
is not responsible for deploying.