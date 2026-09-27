# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Developers, node operators, and integrators building on or running the
VirtEngine protocol. They arrive with a specific question — an API shape, a
transaction format, a deployment step — and need an exact answer they can trust
and copy.

## Product Purpose

The canonical documentation for the VirtEngine Protocol. It is the reference
implementation of what the protocol is, how to run it, and how to integrate
with it. Correctness and findability outrank persuasion: a page that is
engaging but imprecise is a defect.

Success means an integrator can complete a task from the docs alone, without
reading the source or asking in a channel.

## Positioning

Canonical, versioned protocol documentation published from the same repository
as the implementation, so the docs and the code cannot drift. Marketing sites
describe the protocol; this one specifies it.

## Operating Context

- Astro site in the `pages` monorepo. Shares the official VirtEngine identity
  with `virtengine.com` — same brand assets, same design language.
- `DESIGN.md` is normative and explicitly defers to the virtengine.com identity.
- Documentation content is structured for navigation and search, not for
  narrative reading.

## Capabilities and Constraints

- Content must match the implemented protocol. When the two disagree, the code
  is the defect and the docs are corrected.
- Examples are copy-pasteable and must run as written.
- Network timelines are fixed facts: TestNet January 2027, MainNet March 2027,
  and the network is not live.
- Versioned and deprecated surfaces must stay clearly labelled.

## Brand Commitments

- Name: docs.virtengine.com, "canonical documentation for the VirtEngine
  Protocol". Same official identity as virtengine.com — no separate visual
  language, no playful treatment.
- Tone: exact, neutral, technically literate.

## Evidence on Hand

- The protocol implementation in the `virtengine` repository.
- Absences that must not be fabricated: no performance claims beyond what is
  measured, and no "production ready" framing while the network is in
  development.

## Product Principles

1. Exactness beats persuasion on this site.
2. One canonical location for each fact; link rather than restate.
3. Examples that run.
4. Version state is always visible.
5. Same brand system as virtengine.com, calmer and denser.

## Accessibility & Inclusion

WCAG 2.1 AA. Technical content includes code blocks, tables, and inline
notation that must remain legible and navigable by keyboard and screen reader.
