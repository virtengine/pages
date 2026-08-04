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

## Routes (61)

- `/` — service homepage (wallet CTA + phone-mockup hero, two-surface service
  band, service cards, levels, insights strip, trust strip)
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
- Policies: `/privacy`, `/terms-of-use`, `/accessibility`, `/security`
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
with contrast table, Public Sans type system, service-design component
inventory (banners, steps, cards, tables, tags, side-nav), phone mockup
system, content/voice rules and honesty locks.
