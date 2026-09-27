# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

People proving a claim about their identity — a document holder who needs to
show only part of an ID, and a relying party who needs to check that proof.
The core promise is selective disclosure: prove what matters, keep the rest
private.

## Product Purpose

identity.org.au is the Identity Wallet for the VirtEngine ecosystem. It performs
guided local document capture and OCR, keeps original scans on the user's
device, and discloses only separately approved derived fields on-chain.

Success means a user can prove a specific attribute without handing over the
underlying document, and a verifier can check that proof.

## Positioning

Original scans never leave the phone; only approved derived fields are
disclosed, and the disclosure is provable on-chain. An identity product that
uploads your passport to a server cannot make that claim truthfully.

## Operating Context

- Astro site in the `pages` monorepo; the credential-facing sibling of
  virtengine.com.
- `DESIGN.md` Amendment B (2026-09-25) is normative for the credential layer.
- Service UI stays Public Sans. Editorial headlines use Newsreader, roman (not
  italic display). Record fields, MRZ, and the honesty stamp use IBM Plex Mono.
- One vault band per page (`ClosingBand`, `#17293a`). The Proof Card is the only
  foil. `scripts/og.mjs` uses `#17293a`, never indigo.
- Palettes run cool and pale (`#ffffff`, `#f3f5f6`, `#e9f1f7`, `#d5dde2`).

## Capabilities and Constraints

- The honesty lock is a stamped notice above the footer, not only a paragraph
  inside it. This is a disclosure obligation, not a stylistic choice.
- Guilloché grounds are seeded and decorative only — never load-bearing for
  security, never a claim of tamper-resistance on their own.
- Exactly one vault band per page.
- Privacy claims must match the implementation. If capture is local, the copy
  says local.

## Brand Commitments

- Name: identity.org.au. Voice is plain, honest, and unhyped — the product's
  credibility rests on not overstating what it proves.
- Proof Card is the sole foil element; restraint is the aesthetic.

## Evidence on Hand

- Working local capture and OCR flow in the site.
- VEID protocol implementation in the `virtengine` repository, including the
  mobile capture app.
- Absences that must not be fabricated: no claim of government accreditation and
  no production credential issuance while the network is in development.

## Product Principles

1. Disclose the minimum that satisfies the claim.
2. The original document stays on the device.
3. Say plainly what a proof does not establish.
4. One credential, one vault band, no decorative security theatre.
5. Credibility outranks conversion.

## Accessibility & Inclusion

WCAG 2.1 AA. Capture flows are used on mobile under stress, often by people
using assistive technology: large touch targets, visible focus, no
timing-dependent instructions, and legible mono for record fields and MRZ.
