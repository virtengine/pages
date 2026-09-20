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
    slug: "what-can-you-buy-through-virtengine",
    title: "What can you buy through VirtEngine?",
    label: "What can you buy?",
    metaDescription:
      "The VirtEngine catalogue explained: IaaS, PaaS, SaaS, HPC, GPU, storage, managed and custom listings — one market, one settlement rail.",
    kicker: "Marketplace & services",
    intro:
      "VirtEngine is a market for services, not only servers. Infrastructure, managed platforms, software plans, HPC allocations, storage and provider-defined services list in one catalogue and settle through one rail. This guide walks the categories and what each one actually delivers.",
    visuals: [
      {
        kind: "atlas",
        label:
          "Interactive service-model atlas: IaaS, PaaS, SaaS, HPC and batch, GPU and AI compute, storage and data, managed services and custom listings. Each category shows an example listing, billing models, provider implementation paths and its fulfilment flow from catalogue listing through order, lease, provider integration and usage to settlement.",
        caption: "One catalogue model, eight service categories.",
      },
    ],
    sections: [
      {
        heading: "One catalogue, different things being delivered",
        paragraphs: [
          "The catalogue is not organised by technology. It is organised by what a tenant receives: a machine, a platform, software access, scheduler time, storage, professional work or something the provider defines.",
        ],
        bullets: [
          "IaaS — infrastructure you control: VMs, private cloud, bare metal, GPU nodes, storage and network.",
          "PaaS — managed platforms you deploy onto: Kubernetes, databases, inference endpoints, ML workspaces.",
          "SaaS — software delivered as a plan: seats, licences, hosted applications and support packages.",
          "HPC & batch — scheduler-backed compute: SLURM allocations, MPI jobs, GPU batch work.",
          "GPU & AI — accelerator capacity: GPU VMs, multi-GPU nodes, training allocations, inference endpoints.",
          "Storage & data — block, object, managed databases, backup and archive capacity.",
          "Managed & professional services — consultancy, implementation, support and managed operations.",
          "Custom listings — provider-defined offerings beyond the standard categories.",
        ],
      },
      {
        heading: "Infrastructure and platforms",
        paragraphs: [
          "IaaS listings describe capacity the tenant operates: virtual machines, private cloud tenants, bare-metal nodes and GPU systems. The provider runs the hypervisor or cloud; the tenant manages the operating system and everything above it.",
          "PaaS listings shift that line. The provider operates the runtime — a Kubernetes control plane, a database, an inference service — and the tenant deploys onto it. Billing follows platform components rather than a single machine.",
        ],
      },
      {
        heading: "Software, storage and services",
        paragraphs: [
          "SaaS listings represent access to software a provider already operates. The plan describes seats, limits and support; fulfilment is an entitlement, not a virtual machine. VirtEngine records who agreed to what and settles it.",
          "Storage listings can stand alone or attach to compute. Managed and custom listings cover work delivered by people or by provider-defined automation — consultancy hours, implementation packages, scripted runs, remote catalogue items.",
        ],
      },
      {
        heading: "What the protocol does not do",
        paragraphs: [
          "VirtEngine does not operate databases, clusters or software for customers. It does not create the resource. The provider's control plane and backend fulfil the service; the protocol records the agreement, verifies identity, holds escrow and settles signed usage.",
          "That division is deliberate: it is why one market can carry many delivery models without embedding every infrastructure workflow into consensus code.",
        ],
      },
    ],
    related: [
      { label: "Marketplace overview", href: "/marketplace" },
      { label: "IaaS", href: "/marketplace/iaas" },
      { label: "PaaS", href: "/marketplace/paas" },
      { label: "SaaS", href: "/marketplace/saas" },
    ],
    media: "marketplace-hardware",
    mediaCaption: "Many service types. One catalogue model.",
    takeaways: [
      "The catalogue is organised by what is delivered, not by technology.",
      "Eight categories share one order, lease, usage and settlement rail.",
      "Fulfilment always stays with the provider that operates the service.",
      "The protocol records the agreement and settles it — it does not provision.",
    ],
    faqs: [
      {
        question: "Is the marketplace only for compute?",
        answer:
          "No. Software plans, storage, HPC allocations and provider-defined services list alongside compute and settle through the same rail.",
        links: [{ label: "Marketplace overview", href: "/marketplace" }],
      },
      {
        question: "Who operates the service I buy?",
        answer:
          "The provider that listed it. Waldur or a provider integration fulfils the order; VirtEngine holds the market agreement, identity and settlement state.",
        links: [{ label: "Who controls what", href: "/learn/who-controls-what" }],
      },
      {
        question: "Can I buy anything not listed in these categories?",
        answer:
          "A provider can publish a custom offering with its own order form, components and approval rules. If it can be described, priced and fulfilled, it can be listed.",
        links: [{ label: "How custom offerings work", href: "/learn/how-custom-offerings-work" }],
      },
    ],
  },
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
      { label: "Who controls what", href: "/learn/who-controls-what" },
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
      { label: "What can you buy?", href: "/learn/what-can-you-buy-through-virtengine" },
      { label: "From listing to running resource", href: "/learn/from-listing-to-running-resource" },
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
    slug: "from-listing-to-running-resource",
    title: "From listing to running resource",
    label: "Listing → resource",
    metaDescription:
      "Trace a VirtEngine service from catalogue card through order, match, lease, provider daemon, Waldur fulfilment and backend provisioning — and back to signed usage.",
    kicker: "Delivery",
    intro:
      "Between a catalogue card and a running resource sit a lease, a provider daemon, a control plane and a backend. This guide traces that path and shows exactly what returns to the chain.",
    visuals: [
      {
        kind: "lifecycle",
        label:
          "Interactive five-stage lifecycle. Order: the tenant describes demand and funds escrow. Match: direct purchase, competing bids or attribute matching resolves the provider. Lease: the match binds tenant, provider and escrow. Usage: the provider meters and signs consumption. Settlement: validated usage releases escrowed funds. Each stage panel separates tenant actions, provider actions, protocol state and off-chain work.",
        caption: "Catalogue → order → match → lease → fulfilment → usage → settlement.",
      },
      {
        kind: "fulfilment",
        label:
          "Fulfilment flow after a lease: the lease event reaches the provider daemon, which routes a correlated order into Waldur; a backend plugin then creates the resource. The chain records the outcome through authenticated callbacks.",
        caption: "The chain does not provision. The provider integration does.",
        nodes: ["Lease event", "Provider daemon", "Waldur order", "Backend plugin", "Resource created"],
        kinds: { "Lease event": "protocol", "Provider daemon": "provider", "Waldur order": "provider", "Backend plugin": "provider" },
      },
    ],
    sections: [
      {
        heading: "Catalogue to lease",
        paragraphs: [
          "The order names an offering at its listed price, opens to bids, or describes requirements. Escrow is funded so the market can see the demand is budgeted, and the match resolves on-chain to one provider and one price.",
        ],
      },
      {
        heading: "The provider side",
        paragraphs: [
          "The provider daemon watches protocol events, maintains the offering and resource mappings, and routes the matched request into the provider's control plane. Waldur invokes the configured processor — a cloud backend, a scheduler adapter or a custom integration — and the resource is created.",
          "Provision, resize, suspend, resume and terminate are asynchronous. Each outcome returns as an authenticated callback with signatures, bounded payloads, expiring timestamps and replay protection before it becomes protocol state.",
        ],
      },
      {
        heading: "What returns to the chain",
        paragraphs: [
          "Lifecycle state is correlated back to the lease, and consumption is metered per workload, screened for anomalies and submitted as signed usage records. Settlement validates those records against the lease before pricing them.",
          "Waldur's dashboards and invoices remain operational views. They do not override the lease price or authorise a protocol payout.",
        ],
      },
      {
        heading: "Changing and ending a service",
        paragraphs: [
          "Scaling or changing a resource follows the same path: an action in the control plane, an authenticated callback, correlated lease state. When the service ends, remaining escrow returns to the tenant.",
        ],
      },
    ],
    related: [
      { label: "Anatomy of a listing", href: "/learn/anatomy-of-a-marketplace-listing" },
      { label: "Escrow & settlement", href: "/learn/escrow-and-settlement-explained" },
      { label: "Waldur integration", href: "/waldur" },
      { label: "Provider path", href: "/providers" },
    ],
    media: "settlement-ledger",
    mediaCaption: "A lease goes out; signed usage and state come back.",
    takeaways: [
      "The lease is the pivot: everything before it sets it up, everything after references it.",
      "Fulfilment runs through the provider daemon, Waldur and the provider's backend.",
      "Authenticated callbacks are how provider state becomes protocol state.",
      "Waldur reporting is operational; protocol payout follows the lease.",
    ],
    faqs: [
      {
        question: "Does the blockchain create the virtual machine?",
        answer:
          "No. A lease event reaches the provider daemon, which routes the work into the provider's control plane; the backend creates the resource.",
        links: [{ label: "Who controls what", href: "/learn/who-controls-what" }],
      },
      {
        question: "How do I know provisioning finished?",
        answer:
          "The provider's console shows resource state, and the outcome returns to the bridge as an authenticated callback that is validated and correlated with the lease.",
      },
      {
        question: "What happens to unused escrow?",
        answer:
          "It returns to the tenant when the deployment closes.",
        links: [{ label: "Escrow & settlement", href: "/learn/escrow-and-settlement-explained" }],
      },
    ],
  },
  {
    slug: "how-custom-offerings-work",
    title: "How custom offerings work",
    label: "Custom offerings",
    metaDescription:
      "Provider-defined VirtEngine listings explained: order forms, approvals, automated and entitlement fulfilment, metered and fixed components, and what is not claimed.",
    kicker: "Custom services",
    intro:
      "If a provider can describe, price and fulfil a service, the catalogue does not have to stop at servers. Custom offerings cover consultancy, scripted provisioning, remote catalogue items and specialist work — with the same lease and settlement guarantees as any other listing.",
    visuals: [
      {
        kind: "fulfilment",
        label:
          "Custom-offering fulfilment flow: a custom offering presents an order form; the provider approves or automates it; fulfilment follows the provider's own mechanism; a metered or fixed component is recorded; settlement releases escrow.",
        caption: "Fulfilment follows the provider's mechanism. The agreement and the money stay verifiable.",
        nodes: ["Custom offering", "Order form", "Provider approval / automation", "Fulfilment", "Metered or fixed component", "Settlement"],
        kinds: { "Custom offering": "protocol", "Metered or fixed component": "protocol", Settlement: "protocol", "Provider approval / automation": "provider", Fulfilment: "provider" },
      },
    ],
    sections: [
      {
        heading: "What makes a listing custom",
        paragraphs: [
          "A custom listing is provider-defined: the title, description, order fields, components and approval rules come from the provider rather than a fixed category template. The catalogue entry is still a real offering with an on-chain identity and a lease behind it.",
        ],
      },
      {
        heading: "Order forms and approvals",
        paragraphs: [
          "Custom offerings can collect extra information at order time — project details, a target environment, a statement of work reference — and can require provider approval before fulfilment begins. Either way, escrow and the lease rules apply as they do elsewhere.",
        ],
      },
      {
        heading: "Fulfilment patterns",
        paragraphs: [
          "The provider chooses how the work is delivered. The protocol does not prescribe the mechanism; it records the agreement and settles the outcome.",
        ],
        bullets: [
          "Automated — order triggers a script or plugin and the service is created.",
          "Provider-approved — an approval step precedes fulfilment.",
          "Entitlement — an account, seat or licence is activated.",
          "Metered service — usage is measured and settles per component.",
          "Human service — approved work allocation produces a billable component.",
        ],
      },
      {
        heading: "Metered and fixed components",
        paragraphs: [
          "Custom offerings can be billed per measured unit, as a fixed fee, or as a mixture — for example a fixed implementation package followed by a metered managed service. What matters is that the components are defined before ordering and settle against the lease.",
        ],
      },
      {
        heading: "What is not claimed",
        paragraphs: [
          "Not every fulfilment pattern is implemented for every backend. Which mechanisms a deployment supports depends on the provider's Waldur configuration, plugins and integration work — and production availability depends on operator deployment, not on the existence of the offering type.",
        ],
      },
    ],
    related: [
      { label: "Custom listings", href: "/marketplace/custom-listings" },
      { label: "What can you buy?", href: "/learn/what-can-you-buy-through-virtengine" },
      { label: "Waldur integration", href: "/waldur" },
      { label: "Marketplace glossary", href: "/learn/marketplace-glossary" },
    ],
    media: "provider-technician",
    mediaCaption: "If it can be described, priced and fulfilled, it can be listed.",
    takeaways: [
      "Custom listings are provider-defined products with real order forms and approval rules.",
      "Fulfilment follows the provider's mechanism — script, approval, entitlement or human work.",
      "Components can be metered, fixed or a mixture; all settle against the lease.",
      "Supported mechanisms depend on the deployment, not just the offering type.",
    ],
    faqs: [
      {
        question: "Can a custom listing be a service, not infrastructure?",
        answer:
          "Yes. Consultancy hours, support desks, training credits and implementation packages are all custom listings.",
        links: [{ label: "Custom listings", href: "/marketplace/custom-listings" }],
      },
      {
        question: "Who approves a custom order?",
        answer:
          "The provider, if the offering is configured to require approval. The order and its escrow exist either way; approval gates fulfilment.",
      },
      {
        question: "Is every custom fulfilment pattern available today?",
        answer:
          "No. The offering model supports these patterns, but what a given provider deployment can actually fulfil depends on its configuration, plugins and certification.",
      },
    ],
  },
  {
    slug: "who-controls-what",
    title: "Who controls what: VirtEngine, Waldur and the provider",
    label: "Who controls what",
    metaDescription:
      "The VirtEngine responsibility boundary explained: what the protocol, the provider daemon, Waldur and the provider backend each own — and why the split matters.",
    kicker: "Responsibilities",
    intro:
      "Four layers share the work: the protocol, the provider daemon, Waldur and the provider's backend. Keeping them distinct is what stops a diagram from overclaiming — and tells you where to look when something changes.",
    visuals: [
      {
        kind: "responsibility",
        label:
          "Three-column responsibility diagram. VirtEngine protocol: providers, offerings, orders, bids and matches, leases, VEID, escrow and settlement — consensus and market state. Provider daemon: offering sync, mapping, event subscriptions, routing, signed callbacks, lifecycle reconciliation and usage submission — translation and reconciliation. Waldur: HomePort, organisations, projects, catalogue, resources, quotas, reporting and backend plugins — service management and fulfilment. Hovering a capability highlights the connected responsibilities in adjacent columns.",
        caption: "The service control plane, reconciled with protocol state.",
      },
    ],
    sections: [
      {
        heading: "VirtEngine — the verifiable market",
        paragraphs: [
          "The protocol owns identity and trust state, provider and offering records, orders, matching, leases, escrow, signed usage and settlement. It decides who may trade and what was agreed; it does not operate the service being sold.",
        ],
      },
      {
        heading: "The provider daemon — translation and reconciliation",
        paragraphs: [
          "The daemon is the operator-run bridge. It synchronises offerings, keeps mappings, subscribes to events, routes fulfilment, verifies signed callbacks, reconciles lifecycle state and submits usage. It is the only layer that speaks both chain and control-plane.",
        ],
      },
      {
        heading: "Waldur — service management",
        paragraphs: [
          "Waldur presents the catalogue and operates resources, organisations, projects, quotas, reporting and backend plugins. It is where a tenant sees and manages a service day to day.",
        ],
      },
      {
        heading: "The provider backend — the real thing",
        paragraphs: [
          "The backend is what actually delivers: a virtual machine, a cluster, a database, a software entitlement, storage, support or a custom service. VirtEngine never claims to be this layer.",
        ],
      },
      {
        heading: "Why the boundary matters",
        paragraphs: [
          "When the layers blur, claims get inflated. The chain does not provision infrastructure; Waldur does not decide escrow; the backend does not set the price. Each layer's job is clear, and each can be inspected separately.",
        ],
      },
    ],
    related: [
      { label: "Waldur integration", href: "/waldur" },
      { label: "From listing to running resource", href: "/learn/from-listing-to-running-resource" },
      { label: "Marketplace overview", href: "/marketplace" },
      { label: "Marketplace glossary", href: "/learn/marketplace-glossary" },
    ],
    media: "network-earth",
    mediaCaption: "Four layers, four jobs.",
    takeaways: [
      "VirtEngine: identity, market state, escrow, usage and settlement.",
      "Provider daemon: offering sync, routing, callbacks, reconciliation and usage submission.",
      "Waldur: catalogue, projects, resources, quotas, reporting and backend plugins.",
      "Provider backend: the VM, cluster, database, entitlement or service itself.",
    ],
    faqs: [
      {
        question: "Does Waldur run on the blockchain?",
        answer:
          "No. Waldur is an independent service-management platform. The provider daemon keeps chain state and the Waldur control plane correlated.",
        links: [{ label: "Waldur integration", href: "/waldur" }],
      },
      {
        question: "Can the protocol move funds without the provider?",
        answer:
          "Settlement follows validated usage against the lease and the governed fee policy. The provider's operational reporting does not authorise payout.",
      },
      {
        question: "Who do I contact about a running service?",
        answer:
          "The provider that operates it. The protocol makes their performance auditable; it does not run their infrastructure.",
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
