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

The workflow creates the tag itself and then publishes a **GitHub Release** with:

- The tag name and the full commit SHA.
- A changelog of commits since the previous release, grouped by type.
- Links to the production deploy targets for all four sites (see
  [Production deploy targets](#production-deploy-targets)).

## Production deploy targets

Each site is a Cloudflare Pages project. The project name is the deployment
identity; the custom domain is what visitors actually use.

| Site | Cloudflare Pages project | Production URL | Deploy preview |
| --- | --- | --- | --- |
| virtengine.com | `virtengine-web` | https://virtengine.com | https://virtengine-web.pages.dev |
| docs.virtengine.com | `docs-virtengine-com` | https://docs.virtengine.com | https://docs-virtengine-com.pages.dev |
| det.io | `det-web` | https://det.io | https://det-web.pages.dev |
| identity.org.au | `veid-network` | https://identity.org.au | https://veid-network.pages.dev |

These names are mirrored in each site's `wrangler.jsonc` and in the mapping in
`scripts/generate-release-body.mjs`; the release body is generated from that
mapping, so a correction here must be applied in both places.

`workers/blog-redirect` is **not** a Pages project — it is a Worker serving
`blog.virtengine.com`, which redirects to `https://virtengine.com/blog`. It is
deployed separately and is not part of a site release.

## Creating a release

### Automated (the only supported path)

Trigger the **Release** workflow from the GitHub Actions UI:

1. Go to Actions > Release > Run workflow.
2. Enter the version (e.g., `2026.09.25`) — the `v` prefix is added automatically.
3. Optionally enter a release title (defaults to the tag name).
4. The workflow builds all four sites, creates and pushes the tag, generates the
   changelog, and publishes the GitHub Release.

The workflow is triggered **only** by `workflow_dispatch`. It creates the tag
itself, so a tag pushed by hand does **not** start it.

### Emergency snapshot (manual, no automation)

If Actions is unavailable and the snapshot must be marked now, create the tag by
hand and publish the Release yourself. Nothing runs automatically:

```bash
# Ensure the commit you are tagging is the one you intend to release
git checkout main && git pull

git tag -a v2026.09.25 -m "Release v2026.09.25"
git push origin v2026.09.25

# A pushed tag triggers nothing — the GitHub Release must be created by hand.
VERSION=v2026.09.25 GITHUB_SHA="$(git rev-parse HEAD)" \
  node scripts/generate-release-body.mjs > /tmp/release-body.md
gh release create v2026.09.25 --title "v2026.09.25" --notes-file /tmp/release-body.md
```

Prefer the automated path: the manual route skips the build validation step.

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

1. Discovers every site under `sites/` (vacuous-gate guard: fails if none found).
2. Checks out the full commit history.
3. Builds all four sites to confirm the snapshot is valid.
4. Refuses to continue if the tag already exists.
5. Generates a release body from `git log` between the previous tag and HEAD,
   including the production deploy targets above.
6. Creates and pushes the tag, then publishes the GitHub Release.

It has a single trigger, `workflow_dispatch` — no `push` trigger, deliberately,
because the workflow pushes the tag itself.

Site-specific Cloudflare Pages deployments happen independently via the
existing Cloudflare Pages Git integration or manual `wrangler pages deploy`
commands — the release workflow is not responsible for deploying.