/**
 * Marketplace & services learning layer.
 *
 * Eight guides that explain what the market sells and how buying works,
 * grounded in the protocol repository, the canonical SERVICE_MODELS data and
 * Waldur's official marketplace model. Visuals come from the reusable
 * marketplace components, so the guides and the service pages cannot drift.
 */
import type { LearnEntry } from "./learn";

export const MARKETPLACE_LEARN: LearnEntry[] = [
  {
    slug: "iaas-paas-saas-on-virtengine",
    title: "IaaS vs PaaS vs SaaS on VirtEngine",
    label: "IaaS vs PaaS vs SaaS",
    metaDescription:
      "How IaaS, PaaS and SaaS differ on VirtEngine: who manages the stack, what is metered, and why the protocol is a rail beneath all three — not a layer above them.",
    kicker: "Service models",
    intro:
      "Cloud service models describe how much of the stack the provider operates. VirtEngine does not add a fourth layer above them; it runs underneath all three as the market, identity and settlement rail. Here is what changes and what stays the same.",
    visuals: [
      {
        kind: "service-comparison",
        label:
          "Three-column comparison. IaaS delivers an infrastructure resource that the tenant manages at the OS level, metered by CPU, RAM, GPU and storage. PaaS delivers a managed platform the provider operates, metered by platform components. SaaS delivers a software entitlement, metered by seat, plan or subscription. All three share catalogue, order, counterparty identity, lease, usage where applicable and settlement.",
        caption: "Same rail, different delivery models.",
      },
    ],
    sections: [
      {
        heading: "IaaS — you manage the software layer",
        paragraphs: [
          "An IaaS listing hands the tenant a resource and the responsibility that comes with it. The provider runs the physical infrastructure and the virtualisation or cloud control plane; the tenant manages the operating system, runtime and application.",
        ],
        bullets: [
          "Provider manages: physical infrastructure, virtualisation and the cloud control plane.",
          "Tenant manages: OS, runtime, application, scaling decisions.",
          "Typical meter: CPU, RAM, GPU and storage components.",
        ],
      },
      {
        heading: "PaaS — the provider manages the platform",
        paragraphs: [
          "A PaaS listing moves the runtime into the provider's hands. The tenant orders a managed platform — Kubernetes, a database, an inference endpoint — and deploys onto it. The provider handles upgrades, orchestration and the platform lifecycle.",
        ],
        bullets: [
          "Provider manages: platform, runtime, orchestration, upgrades, availability of the service itself.",
          "Tenant manages: deployments, data, application configuration.",
          "Typical meter: platform components such as vCPU-hours, RAM GB-hours and storage.",
        ],
      },
      {
        heading: "SaaS — the provider manages the whole service",
        paragraphs: [
          "A SaaS listing is access to software someone else operates end to end. The tenant consumes an account, seat or plan; the provider owns the application, its hosting and its support. No virtual machine has to be deployed for the listing to be real.",
        ],
        bullets: [
          "Provider manages: the complete software service.",
          "Tenant consumes: account, seat, plan and function.",
          "Typical meter: seat, plan, subscription or a provider-defined component.",
        ],
      },
      {
        heading: "VirtEngine runs horizontally, not above",
        paragraphs: [
          "The common mistake is to read VirtEngine as another level stacked on top of SaaS. It is not. The same identity checks, catalogue, order and match, lease, escrow, signed usage and settlement sit beneath all three delivery models.",
          "That is what makes a mixed catalogue coherent: a GPU node, a managed database and an analytics subscription are different products on the same market rail.",
        ],
      },
      {
        heading: "Why the distinction matters when ordering",
        paragraphs: [
          "The model tells you where responsibility starts and stops. It also tells you what you are metering and who you contact when something changes — the provider's control plane for the service itself, the protocol for the agreement and the money.",
        ],
      },
    ],
    related: [
      { label: "IaaS on VirtEngine", href: "/marketplace/iaas" },
      { label: "PaaS on VirtEngine", href: "/marketplace/paas" },
      { label: "SaaS on VirtEngine", href: "/marketplace/saas" },
      { label: "Who controls what", href: "/waldur" },
    ],
    media: "hero-infrastructure",
    mediaCaption: "Different layers of the stack. One market beneath them.",
    takeaways: [
      "IaaS, PaaS and SaaS describe who manages the stack — not what the protocol does.",
      "VirtEngine runs beneath all three: identity, catalogue, order, lease, usage, settlement.",
      "Fulfilment always stays with the provider that operates the service.",
      "The model tells you what is metered and who to contact when it changes.",
    ],
    faqs: [
      {
        question: "Is VirtEngine a SaaS platform?",
        answer:
          "No. It is a marketplace protocol. Software plans can be sold through it, but VirtEngine does not operate the software.",
      },
      {
        question: "Does a SaaS listing need a virtual machine?",
        answer:
          "No. A listing can represent access to a service the provider already operates; fulfilment can be an entitlement rather than a deployment.",
        links: [{ label: "SaaS on VirtEngine", href: "/marketplace/saas" }],
      },
      {
        question: "Which model is right for a workload I run myself?",
        answer:
          "IaaS, or PaaS if you would rather not operate the runtime. If the provider runs the whole application, that is SaaS.",
        links: [{ label: "Marketplace overview", href: "/marketplace" }],
      },
    ],
  },
  {
    slug: "three-ways-to-buy",
    title: "Direct order, open bid or selector?",
    label: "Three ways to buy",
    metaDescription:
      "Direct order, open bid and selector matching explained: how each acquisition path resolves on-chain, what it is best for, and what stays the same.",
    kicker: "Acquisition",
    intro:
      "Every order resolves on-chain, but there are three ways to reach a match: name the listing, open the order to bids, or describe requirements and let the engine match. The right choice is about certainty versus competition versus fit.",
    visuals: [
      {
        kind: "acquisition",
        label:
          "Interactive comparison of the three acquisition paths. Direct order: a named listing matches immediately at its published price with no bidding window. Open bid: an open order collects competing provider bids which the tenant accepts or the engine resolves. Selector: described requirements — region, specifications, price cap — are matched deterministically against eligible listings. A table compares who chooses the provider, how price is set, whether bidding is awaited, and the best use of each path.",
        caption: "Three ways to source a service. One market rail.",
      },
      {
        kind: "order-anatomy",
        label:
          "Order anatomy diagram. An order carries the tenant, service or category, offering or requirements, region, resource requirements, provider constraints, price or cap and escrow. Match resolves to a direct listing, an accepted bid or a selector result. The lease binds tenant, provider, offering, pricing, escrow and lifecycle.",
        caption: "Why the marketplace is more than an ecommerce catalogue.",
      },
    ],
    sections: [
      {
        heading: "Direct order — name the listing",
        paragraphs: [
          "Direct ordering is the default. The tenant picks a provider's offering and plan and pays the published price. The order names that listing, matches without a bidding window, and becomes a lease backed by escrow.",
          "Use it when the product is known and the price should be predictable: published plans, SaaS seats, managed services, fixed catalogue products.",
        ],
      },
      {
        heading: "Open bid — let providers compete",
        paragraphs: [
          "An open order describes the requirement and opens a bidding window. Provider daemons watch the chain, price the work against their configured strategy, and place bids that must satisfy the order's resource and attribute requirements.",
          "The tenant can accept a bid or let the matching engine take the best-ranked offer when the window closes. Use it for fungible capacity where competition should set the price.",
        ],
      },
      {
        heading: "Selector — describe what qualifies",
        paragraphs: [
          "A selector order names no provider. The tenant states category, region, minimum specifications and a maximum price; the engine filters to eligible listings and matches deterministically within the cap.",
          "Use it for policy-driven sourcing: region constraints, hardware requirements, compliance or attestation filters — anything where the fit matters more than the vendor name.",
        ],
      },
      {
        heading: "What never changes",
        paragraphs: [
          "Whichever path is used, the order is backed by escrow before it can match, match selection happens on-chain, and the resulting lease carries the same metering and settlement rules. There is no private order book and no off-platform deal.",
        ],
      },
    ],
    related: [
      { label: "How the marketplace works", href: "/learn/how-the-marketplace-works" },
      { label: "Marketplace overview", href: "/marketplace" },
      { label: "Cost-optimized cloud", href: "/solutions/cost-optimized-cloud" },
      { label: "Marketplace glossary", href: "/learn/marketplace-glossary" },
    ],
    media: "provider-datacenter",
    mediaCaption: "Certainty, competition or fit — one resolution path.",
    takeaways: [
      "Direct: choose the listing; match at the published price.",
      "Open bid: let eligible providers compete; accept or auto-resolve.",
      "Selector: describe requirements and a cap; get matched deterministically.",
      "All three end in the same escrow-backed lease.",
    ],
    faqs: [
      {
        question: "Can I switch paths after ordering?",
        answer:
          "Each order carries its own path from creation. Choose the path that matches how you want the provider and price decided.",
      },
      {
        question: "Who sets the price in an open bid?",
        answer:
          "Competing providers do, within your order's requirements. Bids are on-chain objects and multiple bids against one order are the price-setting mechanism for that mode.",
        links: [{ label: "How the marketplace works", href: "/learn/how-the-marketplace-works" }],
      },
      {
        question: "Does a selector order guarantee the cheapest listing?",
        answer:
          "It resolves deterministically to the best eligible listing within your cap — eligibility is defined by the requirements you set.",
      },
    ],
  },
  {
    slug: "anatomy-of-a-marketplace-listing",
    title: "Anatomy of a marketplace listing",
    label: "Anatomy of a listing",
    metaDescription:
      "Read a VirtEngine marketplace listing field by field: provider, category, offering, plan, components, limits, attributes, region, backend, price and identifiers.",
    kicker: "Catalogue",
    intro:
      "A listing is a contract-shaped description: who provides, what is delivered, how it is measured, what it costs, and what evidence supports it. This guide reads a listing card field by field — and shows how the card stays connected to the protocol object behind it.",
    visuals: [
      {
        kind: "listing-anatomy",
        label:
          "Annotated example listing card for a GPU Workspace. Numbered notes explain provider, category, offering, plan, component, limit, attribute, region, backend, price, order field, audit and benchmark, and lifecycle. An identifier mapping shows the on-chain offering_id linking through a provider daemon mapping to the Waldur offering_uuid.",
        caption: "Every part of the card has a job.",
      },
    ],
    sections: [
      {
        heading: "Reading the card",
        paragraphs: [
          "The top of the card identifies the product and the provider: service type, title, provider name and region. These are not decoration — category and region are match inputs, and provider identity is verified state.",
        ],
      },
      {
        heading: "Components and limits",
        paragraphs: [
          "Components are the measurable dimensions the plan is billed on: GPU-hours, vCPU-hours, RAM GB-hours, storage GB-months, seats or provider-defined units. Limits cap them so exposure stays bounded.",
          "A plan with components but no limits is still a plan; limits are what make consumption predictable before the order is placed.",
        ],
      },
      {
        heading: "Attributes, audits and benchmarks",
        paragraphs: [
          "Attributes are machine-readable claims: audited, benchmarked, attested, confidential. Auditor-signed attributes and published hardware benchmarks are evidence, not marketing — and both can be used as match filters.",
        ],
      },
      {
        heading: "Identifiers: from card to protocol object",
        paragraphs: [
          "An offering has an on-chain identifier. The provider daemon persists a mapping between that identifier and the corresponding Waldur offering, so a polished catalogue card never becomes detached from the protocol object it represents.",
        ],
        bullets: [
          "VirtEngine offering_id — the chain object an order can name.",
          "Provider daemon mapping — the persisted cross-reference.",
          "Waldur offering_uuid — the catalogue item users see and order.",
        ],
      },
      {
        heading: "Fulfilment is not on the card",
        paragraphs: [
          "The card describes what is sold, not how it is made. Fulfilment details live in the provider's plan and backend configuration: OpenStack, VMware, a scheduler, an entitlement service or a custom integration.",
          "That is why two listings can look similar on the card and be delivered by completely different systems — and why the provider's implementation path is worth checking before ordering.",
        ],
      },
    ],
    related: [
      { label: "What can you buy?", href: "/marketplace" },
      { label: "From listing to running resource", href: "/learn/how-the-marketplace-works" },
      { label: "Marketplace overview", href: "/marketplace" },
      { label: "Waldur integration", href: "/waldur" },
    ],
    media: "learn-library",
    mediaCaption: "A card is a structured agreement, not a brochure.",
    takeaways: [
      "Provider, category and region are match inputs — not decoration.",
      "Components are what gets metered; limits are what bounds exposure.",
      "Attributes, audits and benchmarks are evidence and can filter matches.",
      "The card is correlated with an on-chain offering and a Waldur catalogue item.",
    ],
    faqs: [
      {
        question: "What is the difference between an offering and a plan?",
        answer:
          "The offering is the product; the plan is the purchasable variant with its own pricing, components and limits.",
      },
      {
        question: "Are benchmarks verified?",
        answer:
          "They are published performance records attached to the provider; audits are auditor-signed attributes. Both are on-chain evidence you can filter on.",
        links: [{ label: "x/benchmark module", href: "/modules/benchmark" }],
      },
      {
        question: "Where do order fields fit?",
        answer:
          "They are the extra inputs a provider needs at order time — a project code, a public key, a region preference — defined by the plan and collected before fulfilment.",
      },
    ],
  },
  {
    slug: "marketplace-glossary",
    title: "Marketplace glossary",
    label: "Marketplace glossary",
    metaDescription:
      "VirtEngine marketplace glossary: provider, tenant, offering, plan, component, order, bid, selector, lease, escrow, usage record, settlement, Waldur, HomePort and more.",
    kicker: "Reference",
    intro:
      "Definitions for the terms used across the marketplace pages, written from the protocol repository and Waldur's published marketplace model. Every term has a stable anchor so it can be linked directly.",
    glossary: true,
    sections: [
      {
        heading: "How to use this glossary",
        paragraphs: [
          "Terms are grouped by area — marketplace and catalogue, orders and settlement, identity and trust, and the control plane. Each definition links to the page that explains it in full where one exists.",
          "Where a term belongs to Waldur rather than VirtEngine, the definition says so and links to Waldur's official documentation.",
        ],
      },
      {
        heading: "Technical detail",
        paragraphs: [
          "Protocol objects such as orders, bids, leases and usage records are defined at message level in the module reference and the external technical documentation.",
        ],
      },
    ],
    related: [
      { label: "How the marketplace works", href: "/learn/how-the-marketplace-works" },
      { label: "Marketplace overview", href: "/marketplace" },
      { label: "Module reference", href: "/modules" },
      { label: "Waldur integration", href: "/waldur" },
    ],
    media: "open-source-screen",
    mediaCaption: "One vocabulary across the market and the control plane.",
    takeaways: [
      "Marketplace terms map to protocol objects: order, bid, match, lease, usage record, settlement.",
      "Catalogue terms come from Waldur's marketplace model: offering, plan, component, limit.",
      "Identity terms — VEID, audit, benchmark, attestation — are match filters as well as claims.",
      "Every definition links to the fuller page where one exists.",
    ],
    faqs: [
      {
        question: "Where are protocol objects defined precisely?",
        answer:
          "In the module reference and the external technical documentation, which document messages and state at implementation level.",
        links: [{ label: "Module reference", href: "/modules" }],
      },
      {
        question: "Which terms are Waldur's rather than VirtEngine's?",
        answer:
          "Offering, plan, component, limit, resource, processor, HomePort and MasterMind come from Waldur's marketplace model; the glossary notes the distinction where it matters.",
        links: [{ label: "Waldur marketplace model", href: "https://docs.waldur.com/latest/about/concepts/marketplace/" }],
      },
    ],
  },
];
