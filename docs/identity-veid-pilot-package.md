# Identity / VEID pilot package

Implemented locally on 9 October 2026 in `sites/identity.org.au`, branch `codex/identity-veid-pilot-package`.

## Delivered scope

- Main marketing routes lead to a reusable-verification demonstration and pilot discussion, with a site-wide availability notice.
- Homepage, business onboarding, integration overview and trusted-processing copy distinguish reference design from production evidence. Related setup, FAQ and launch copy no longer promises a ten-minute setup or January 2027 release.
- Four new routes: `/for-services/demo`, `/for-services/pilot`, `/for-services/issuer-policy` and `/for-services/pilot-integration`.
- Downloadable discussion pack at `/pilot/discussion-pack.md`: proposition, trust policy, data boundaries, illustrative messages, evaluation plan, draft agreement headings, buyer interview guide and evidence register.
- Local state model and meaningful tests for consent, independent service requests, invalid states, revocation, recovery boundaries and duplicate approvals.
- Small existing type errors in header interaction and media-key enumeration fixed; identity site's error allowance reduced from two to zero.

## Demonstration boundary

The demo uses a fictional membership issuer and two fictional services. It does not issue or cryptographically verify credentials, authenticate a real holder, use an enclave, contact VEID, or write chain records. Selection, claims and history are kept only in browser memory; no demo request is sent to a server and reload clears history. It models production outcomes for discussion. It cannot establish age, financial KYC, accreditation or interoperability.

No website deployment, outbound partner contact, regulator submission, production adapter change or payment-network integration was performed. Visa/Mastercard remain industry examples, never confirmed partners.

## Verification record

- Astro production build: 82 pages, successful.
- Type gate: 98 files, zero errors and zero warnings. Baseline tightened to zero.
- Five state-model tests: passed, including failure scenarios and consent preservation.
- Built-site links: 83 HTML files including redirect, 6,607 internal references, no dead links.
- Basic static accessibility gate: zero missing image alternatives, missing document language, duplicate IDs or heading-level skips. This gate is not a complete WCAG audit.
- Design and Markdown negotiation gates: passed.
- Structured data: zero errors; 12 existing advisory warnings for editorial articles without `datePublished`. No publication dates were invented to silence them.
- Browser: approval, refusal, separate service consent, six failure scenarios, pause/restore, reset, reload clearing, keyboard focus, minimal disclosed result, no interaction-triggered network requests after asset loading, pack download, and mobile overflow checks passed.
- Layout: screenshots inspected at 1440px desktop and 390px mobile; new routes, services page and homepage checked for mobile horizontal overflow. No console errors or warnings recorded for the demo.

Screenshots are generated under the ignored `sites/identity.org.au/output/playwright/` directory.

## Performance budget decision

The old maximum page-JavaScript allowance was 1,435 gzip bytes. A new interactive route necessarily adds executable code: final measured maximum is 2,389 gzip bytes on the demo, including shared scripts. Its own module is approximately 1.8 KB gzip. The identity-site ledger is remeasured for this feature; other sites' entries are carried over unchanged. No new client framework or remote script was added to the demo.

This is a deliberate feature-cost increase, not evidence of a speed improvement. The performance gate measures asset weights, not real-user latency or Core Web Vitals. Existing image and font costs remain separate optimisation opportunities.

## Next implementation and commercial gates

| Gate | Concrete next deliverable | Acceptance evidence |
| --- | --- | --- |
| Real workflow | Accepted issuer, two willing services, agreed membership decision | Written scope, responsible contacts and baseline process |
| Mobile production path | Required real adapters and supported device matrix | Encryption without development fallbacks; real-device capture/authentication tests |
| Trusted presentation | Issuer, holder, request and status binding | Independent review and adversarial replay/status/key-compromise tests |
| Proof correctness where used | Cryptographic commitment, authoritative claim binding and accurate predicates | Review of current ZK implementation and test vectors; exact age boundaries if age is introduced |
| Interoperability | Selected credential/protocol profile | Independent issuance/presentation implementation tests; no inferred regulator recognition |
| Privacy and recovery | Actor-level data inventory, retention, recovery and deletion | Reviewed notices; logs/backups/chain metadata review; device-loss tests |
| Assurance | Applicable privacy, security, fraud and accessibility evidence | Independent assessment, remediation and operational readiness approval |
| Regulatory route | Role-specific accreditation scope and, if appropriate, separate AGDIS route | Current forms and regulator correspondence; no assumption of prior approval |
| Controlled pilot | Agreed protocol, evaluation and terms | Synthetic rehearsal before real data; pre-agreed metrics and stop conditions |
| Distribution | Evidence-led buyer outreach and measured case study | Explicit outreach authorisation, accepted commitments and publication consent |

The public agreement is a discussion draft. Contacts, budgets, legal terms, retention periods, participants and dates remain to be agreed; this package does not invent those commitments.

## Reproduce the local checks

From `sites/identity.org.au`, using the Node 24 runtime used for this verification:

```powershell
pnpm install --frozen-lockfile
node scripts/og.mjs
node node_modules/astro/astro.js build
node --test scripts/pilot-demo.test.mjs
node ../../scripts/check-types.mjs
node ../../scripts/check-links.mjs dist
node ../../scripts/check-a11y.mjs dist
node ../../scripts/check-perf.mjs dist
node ../../scripts/check-markdown.mjs dist
node scripts/check-structured-data.mjs dist
$env:CHECK_DESIGN_SITES = 'sites/identity.org.au'
node ../../scripts/check-design.mjs
```

The install initially exposed a missing transitive optional runtime locally. Reinstalling the existing locked dependency graph with `pnpm install --frozen-lockfile --force` repaired it without changing the manifest or lockfile.
