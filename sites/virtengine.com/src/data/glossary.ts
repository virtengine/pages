/**
 * Marketplace glossary. Terms are defined from the protocol repository and
 * Waldur's official marketplace model. Each entry has a stable anchor so
 * other pages can deep-link a definition, and the Learn glossary page renders
 * the whole set as one crawlable definition list.
 */
export interface GlossaryTerm {
  /** Stable anchor id. */
  id: string;
  term: string;
  definition: string;
  /** Where the term is explained further, if a fuller page exists. */
  href?: string;
  hrefLabel?: string;
  /** Optional cross-reference to another glossary anchor. */
  see?: string[];
}

export interface GlossaryGroup {
  id: string;
  heading: string;
  intro: string;
  terms: GlossaryTerm[];
}

export const GLOSSARY: GlossaryGroup[] = [
  {
    id: "marketplace",
    heading: "Marketplace & catalogue",
    intro: "The commercial surface: what is listed, who lists it, and how it is described.",
    terms: [
      {
        id: "provider",
        term: "Provider",
        definition:
          "An independent operator that lists capacity or services in the catalogue and fulfils leases on its own infrastructure. Providers register on-chain with attributes, region and identity, and run the provider daemon.",
        href: "/providers",
        hrefLabel: "Provider path",
        see: ["provider-daemon", "offering"],
      },
      {
        id: "tenant",
        term: "Tenant",
        definition:
          "The buyer: an organisation or individual that orders services through the marketplace and operates the leased resources. Tenants are identity-gated before matching, exactly as providers are.",
        href: "/tenants",
        hrefLabel: "Tenant overview",
        see: ["order", "lease"],
      },
      {
        id: "offering",
        term: "Offering",
        definition:
          "A listed product or service a provider publishes. On-chain it is the offering object orders can name; in Waldur it is the catalogue item users see. The provider daemon keeps the two correlated.",
        href: "/learn/anatomy-of-a-marketplace-listing",
        hrefLabel: "Anatomy of a listing",
        see: ["plan", "component"],
      },
      {
        id: "plan",
        term: "Plan",
        definition:
          "A purchasable variant of an offering — the pricing and configuration a tenant chooses, such as hourly, monthly, reserved or per-seat. Waldur models plans under offerings; VirtEngine records the agreed commercial terms in the lease.",
        href: "/marketplace",
        hrefLabel: "Marketplace overview",
        see: ["offering", "component"],
      },
      {
        id: "component",
        term: "Component",
        definition:
          "A measurable billing dimension of a plan — GPU-hours, vCPU-hours, RAM GB-hours, storage GB-months, seats, or a provider-defined unit. Providers meter components; settlement prices them against the lease.",
        href: "/learn/how-the-marketplace-works",
        hrefLabel: "How the marketplace works",
        see: ["usage-record", "settlement"],
      },
      {
        id: "limit",
        term: "Limit",
        definition:
          "A cap on a component, such as a maximum number of vCPU-hours or a storage ceiling. Limits keep a plan's exposure bounded and are visible to the tenant before ordering.",
        see: ["component", "plan"],
      },
      {
        id: "custom-offering",
        term: "Custom offering",
        definition:
          "A provider-defined listing beyond the standard service models: scripted provisioning, consultancy hours, remote catalogue items or bespoke bundles. Custom offerings use order forms, approvals and provider-defined components while keeping the same lease and settlement guarantees.",
        href: "/marketplace/custom-listings",
        hrefLabel: "Custom listings",
        see: ["offering", "processor"],
      },
      {
        id: "resource",
        term: "Resource",
        definition:
          "The thing that actually exists after fulfilment — a virtual machine, cluster, database, entitlement, storage bucket or service engagement. The provider's backend owns the resource; VirtEngine records the lease it belongs to.",
        see: ["backend", "allocation"],
      },
      {
        id: "allocation",
        term: "Allocation",
        definition:
          "The provider-side assignment of capacity to a tenant — for example an HPC allocation on a scheduler or a quota grant in a private cloud. Allocation state is reconciled back to the chain as lease and lifecycle state.",
        see: ["resource", "lease"],
      },
      {
        id: "backend",
        term: "Backend",
        definition:
          "The provider system that creates and operates the sold service: OpenStack, VMware, Kubernetes/Rancher, a scheduler, a storage system, an entitlement service or a custom integration. VirtEngine does not provision backends; the provider's integration does.",
        see: ["processor", "provider-daemon"],
      },
      {
        id: "processor",
        term: "Processor",
        definition:
          "Waldur's term for the plugin or integration that fulfils an order against a backend — for example a cloud processor, a site agent or a custom scripted processor. The processor performs the work; Waldur tracks the order and resource state around it.",
        href: "https://docs.waldur.com/latest/about/concepts/marketplace/",
        hrefLabel: "Waldur marketplace model",
        see: ["backend", "waldur"],
      },
    ],
  },
  {
    id: "protocol",
    heading: "Orders, leases & settlement",
    intro: "The protocol objects an order passes through, and the money rules attached to them.",
    terms: [
      {
        id: "order",
        term: "Order",
        definition:
          "A structured, on-chain request for a service: it names an offering at its listed price, or opens demand that qualifying providers can bid on. An order is backed by escrow so the market can see real budget behind the demand.",
        href: "/learn/how-the-marketplace-works",
        hrefLabel: "Marketplace lifecycle",
        see: ["direct-order", "bid", "selector"],
      },
      {
        id: "direct-order",
        term: "Direct order",
        definition:
          "An order that names one specific offering and matches at its published price without a bidding window. The default acquisition path and the right one for most catalogue purchases.",
        href: "/learn/three-ways-to-buy",
        hrefLabel: "Three ways to buy",
        see: ["order", "match"],
      },
      {
        id: "bid",
        term: "Bid",
        definition:
          "A priced offer a provider daemon places against an open order. Bids are on-chain objects that must satisfy the order's resource and attribute requirements to be valid. The tenant can accept one, or the matching engine resolves the best-ranked bid when the window closes.",
        see: ["order", "match"],
      },
      {
        id: "selector",
        term: "Selector",
        definition:
          "An acquisition mode where the tenant names no provider: category, region, minimum specifications and a maximum price are described, and the engine resolves the best eligible listing deterministically within that cap.",
        href: "/learn/three-ways-to-buy",
        hrefLabel: "Three ways to buy",
        see: ["match", "order"],
      },
      {
        id: "match",
        term: "Match",
        definition:
          "The protocol step that resolves an order to a provider: a direct purchase at a listed price, an accepted bid, or an attribute match against eligible listings. Match selection happens on-chain.",
        see: ["lease", "order"],
      },
      {
        id: "lease",
        term: "Lease",
        definition:
          "The on-chain agreement binding one tenant, one provider and one escrow account after a match. Fulfilment, metering and settlement all reference the lease, which is what makes the relationship enforceable rather than merely displayed.",
        href: "/learn/how-the-marketplace-works",
        hrefLabel: "How the marketplace works",
        see: ["escrow", "settlement"],
      },
      {
        id: "escrow",
        term: "Escrow",
        definition:
          "Funds committed by the tenant against a lease. Escrow is provably funded but provably not yet transferred: it moves only under settlement rules, and unspent balance returns to the tenant when the deployment closes.",
        href: "/learn/escrow-and-settlement-explained",
        hrefLabel: "Escrow & settlement explained",
        see: ["settlement", "lease"],
      },
      {
        id: "usage-record",
        term: "Usage record",
        definition:
          "A signed measurement of consumption for a lease, submitted by the provider daemon on a scheduled cadence. Records are screened by anomaly detection, pass through a dispute window, and are validated against the lease before pricing.",
        href: "/learn/escrow-and-settlement-explained",
        hrefLabel: "Escrow & settlement explained",
        see: ["component", "settlement"],
      },
      {
        id: "settlement",
        term: "Settlement",
        definition:
          "The conversion of validated usage records into priced line items and the release of the agreed amount from escrow to the provider under the governed settlement fee policy.",
        href: "/modules/settlement",
        hrefLabel: "x/settlement module",
        see: ["escrow", "usage-record"],
      },
      {
        id: "dispute-window",
        term: "Dispute window",
        definition:
          "A period (24 hours by default) during which either party can dispute or correct a usage record before it settles. Disputed records escalate through support intake, and to fraud handling where misconduct is alleged.",
        href: "/modules/escrow",
        hrefLabel: "x/escrow module",
        see: ["usage-record", "settlement"],
      },
    ],
  },
  {
    id: "identity",
    heading: "Identity & trust",
    intro: "How the market knows who is on the other side of a lease.",
    terms: [
      {
        id: "veid",
        term: "VEID",
        definition:
          "Verifiable Electronic Identity: the protocol's privacy-preserving identity layer. Encrypted identity evidence is scored by validators by consensus, and users prove facts about the result with zero-knowledge proofs rather than revealing documents.",
        href: "/veid",
        hrefLabel: "VEID overview",
        see: ["attestation"],
      },
      {
        id: "audit",
        term: "Audit",
        definition:
          "Auditor-signed provider attributes recorded on-chain — certifications, compliance evidence and verified operational claims that tenants can filter on when choosing a listing.",
        href: "/modules/audit",
        hrefLabel: "x/audit module",
        see: ["benchmark", "attestation"],
      },
      {
        id: "benchmark",
        term: "Benchmark",
        definition:
          "Measured hardware performance data published by a provider. Benchmarks let tenants compare capacity on observed results rather than specification claims.",
        href: "/modules/benchmark",
        hrefLabel: "x/benchmark module",
        see: ["audit"],
      },
      {
        id: "attestation",
        term: "Attestation",
        definition:
          "Cryptographic evidence that hardware or software is what it claims to be — used for confidential-compute enclaves and device integrity. Attestation results can be required as listing attributes before a match.",
        href: "/trusted-processing",
        hrefLabel: "Trusted processing",
        see: ["veid", "audit"],
      },
      {
        id: "mtls",
        term: "mTLS",
        definition:
          "Mutually authenticated TLS: both sides of an off-chain connection present certificates. VirtEngine anchors certificates on-chain (x/cert), so manifest delivery and status calls between tenant and provider are mutually authenticated.",
        href: "/modules/cert",
        hrefLabel: "x/cert module",
        see: ["provider-daemon"],
      },
      {
        id: "cid",
        term: "CID",
        definition:
          "Content identifier: a hash-derived address for off-chain content such as workload manifests or evidence bundles. Where a manifest is referenced, the CID lets either side verify the bytes they received match what was agreed.",
        see: ["lease"],
      },
    ],
  },
  {
    id: "control-plane",
    heading: "Waldur & delivery",
    intro: "The control plane, the bridge and the systems that actually run services.",
    terms: [
      {
        id: "waldur",
        term: "Waldur",
        definition:
          "An independently developed open-source service-management platform: catalogue, organisations, projects, orders, resources, quotas, accounting and provider plugins. VirtEngine integrates with Waldur through the provider daemon; it does not own or replace it.",
        href: "/waldur",
        hrefLabel: "Waldur integration",
        see: ["homeport", "mastermind"],
      },
      {
        id: "homeport",
        term: "HomePort",
        definition:
          "Waldur's browser application: the self-service surface where users browse the catalogue, order, and manage resources, quotas and reporting inside their organisation and project boundaries.",
        href: "https://docs.waldur.com/latest/developer-guide/homeport/",
        hrefLabel: "Waldur HomePort docs",
        see: ["waldur", "mastermind"],
      },
      {
        id: "mastermind",
        term: "MasterMind",
        definition:
          "Waldur's backend API and service layer. HomePort and integrations talk to MasterMind to manage offerings, orders, resources, accounting and provider plugins.",
        href: "https://docs.waldur.com/latest/admin-guide/architecture/",
        hrefLabel: "Waldur architecture",
        see: ["waldur", "homeport"],
      },
      {
        id: "provider-daemon",
        term: "Provider daemon",
        definition:
          "The off-chain agent an operator runs. It watches protocol events, maintains offering and resource mappings, routes fulfilment into the provider's control plane, verifies signed callbacks, reconciles state and submits signed usage records.",
        href: "/providers",
        hrefLabel: "Provider path",
        see: ["waldur", "usage-record"],
      },
    ],
  },
];

export const GLOSSARY_TERMS: GlossaryTerm[] = GLOSSARY.flatMap((group) => group.terms);

export const GLOSSARY_TERM_BY_ID = Object.fromEntries(
  GLOSSARY_TERMS.map((term) => [term.id, term]),
) as Record<string, GlossaryTerm>;
