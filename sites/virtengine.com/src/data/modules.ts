/**
 * On-chain module reference. Source of truth: repos/virtengine/x/ and the
 * protocol docs (docs/, _docs/). Each entry powers /modules/[slug].
 */
import type { MediaSlug } from "@data/media";

export type ModuleDomain =
  | "Marketplace & workloads"
  | "Identity & security"
  | "Economics & settlement"
  | "Quality & governance";

export interface ModuleInteraction {
  /** Module slug this module interacts with (must exist in MODULES), or null for off-chain surfaces. */
  slug: string | null;
  label: string;
  how: string;
}

/** One at-a-glance fact card rendered under the hero. */
export interface ModuleGlance {
  kicker: string;
  title: string;
  body: string;
}

/** One step of the interactive "how it works" stepper. */
export interface ModuleFlowStep {
  label: string;
  title: string;
  body: string;
}

/** One page-level FAQ entry. */
export interface ModuleFaq {
  question: string;
  answer: string;
  links?: { label: string; href: string }[];
}

export interface ModuleEntry {
  slug: string;
  /** Path in the repository, e.g. "x/market" */
  path: string;
  name: string;
  domain: ModuleDomain;
  /** One-line role, used on cards and in meta descriptions. */
  summary: string;
  /** 2–3 paragraphs: what the module does. */
  whatItDoes: string[];
  /** Why the protocol needs it as a dedicated module. */
  whyItExists: string;
  interactions: ModuleInteraction[];
  concepts: { term: string; def: string }[];
  /** Brand photography for the hero. */
  media: MediaSlug;
  mediaCaption: string;
  /** Three at-a-glance facts rendered under the hero. */
  glance: ModuleGlance[];
  /** Interactive stepper: the module's core flow. */
  flow: ModuleFlowStep[];
  /** Page-level FAQ rendered as an accordion. */
  faqs: ModuleFaq[];
}

export const MODULE_DOMAINS: { domain: ModuleDomain; blurb: string }[] = [
  {
    domain: "Marketplace & workloads",
    blurb:
      "The exchange itself — orders, bids, leases, provider registration, resource definitions, and the HPC job marketplace.",
  },
  {
    domain: "Identity & security",
    blurb:
      "VEID identity scoring, the identity registry, MFA, certificates, encryption, enclave attestation, fraud enforcement, and access control.",
  },
  {
    domain: "Economics & settlement",
    blurb:
      "Escrow-backed payments, zero marketplace commission, validator transaction fees, VEID-led issuance, staking, delegation, and oracles.",
  },
  {
    domain: "Quality & governance",
    blurb:
      "Auditor-signed attributes, hardware benchmarks, reviews, support and dispute intake, and governed chain configuration.",
  },
];

export const MODULES: ModuleEntry[] = [
  // ───────────────────────── Marketplace & workloads ─────────────────────────
  {
    slug: "market",
    path: "x/market",
    name: "Market",
    domain: "Marketplace & workloads",
    summary: "The order, match, and lease state machine at the center of the marketplace.",
    whatItDoes: [
      "The market module implements the exchange itself. Tenants post orders describing the resources they need; orders naming a specific offering match it outright at the listed price, while open orders collect competing bids from provider daemons watching the chain. A match becomes a lease — the on-chain contract under which a provider serves a workload and gets paid. All these objects are chain state, created and transitioned by transactions and validated by consensus.",
      "The module enforces the lifecycle rules: an order can only be matched while open, a bid must satisfy the order's resource and attribute requirements, and a lease binds exactly one tenant, one provider, and one escrow account. Lease closure — voluntary, for non-payment, or through enforcement — flows back through the same state machine so every marketplace event leaves an auditable record.",
    ],
    whyItExists:
      "In a conventional cloud, the exchange between buyer and seller happens inside a company's private billing system. VirtEngine's premise is that the exchange should be the protocol: matching, pricing, and contract state executed by consensus rather than by a trusted intermediary. The market module is where that premise is implemented.",
    interactions: [
      { slug: "deployment", label: "x/deployment", how: "Orders are derived from tenant deployment specifications and groups." },
      { slug: "escrow", label: "x/escrow", how: "Every lease is backed by an escrow account funded before the workload starts." },
      { slug: "provider", label: "x/provider", how: "Bids reference registered providers and their on-chain attributes." },
      { slug: "veid", label: "x/veid", how: "Marketplace participation is identity-gated by VEID trust scores." },
      { slug: "settlement", label: "x/settlement", how: "Usage recorded against a lease settles into payments from lease escrow." },
    ],
    concepts: [
      { term: "Order", def: "A tenant's on-chain request — compute, memory, storage, region, and required attributes — naming a specific offering or open for bids." },
      { term: "Bid", def: "A provider's priced offer against an open order, placed automatically by the provider daemon. Direct orders never need one." },
      { term: "Lease", def: "The matched contract between tenant and provider that authorizes a workload and its payment stream." },
    ],
    media: "marketplace-hardware",
    mediaCaption: "The exchange: orders in, leases out.",
    glance: [
      {
        kicker: "Objects",
        title: "Orders, bids, leases as chain state",
        body: "All three are created and transitioned by transactions and validated by consensus — the exchange is the protocol, not a company's billing system.",
      },
      {
        kicker: "Rules",
        title: "Matching with lifecycle enforcement",
        body: "Orders match only while open; bids must satisfy resource and attribute requirements; a lease binds exactly one tenant, one provider, and one escrow account.",
      },
      {
        kicker: "Audit",
        title: "Every event leaves a record",
        body: "Lease closure — voluntary, for non-payment, or through enforcement — flows back through the same state machine.",
      },
    ],
    flow: [
      {
        label: "Post",
        title: "Tenant posts an order",
        body: "A structured, on-chain request for resources: compute, memory, storage, region, and required attributes.",
      },
      {
        label: "Match",
        title: "Direct purchase or winning bid",
        body: "A named offering matches immediately at its listed price; open orders resolve to the accepted or best-ranked bid.",
      },
      {
        label: "Match",
        title: "A match becomes a lease",
        body: "The matched contract authorizes the workload and its payment stream, backed by escrow funded before serving starts.",
      },
      {
        label: "Close",
        title: "Usage settles, lease closes",
        body: "Recorded usage settles into payments from escrow; closure of any kind returns through the state machine as an auditable record.",
      },
    ],
    faqs: [
      {
        question: "Who can match an order?",
        answer:
          "A named offering matches its own direct orders outright. For open orders, any provider whose bid satisfies the resource and attribute requirements, while the order is open. Matching is consensus-validated, never discretionary.",
      },
      {
        question: "What exactly does a lease bind together?",
        answer:
          "Exactly one tenant, one provider, and one escrow account — the payment stream is authorized against collateral that provably exists before serving starts.",
        links: [{ label: "x/escrow module", href: "/modules/escrow" }],
      },
      {
        question: "How does a lease end?",
        answer:
          "Voluntarily, for non-payment when escrow runs dry, or through enforcement — each path transitions through the same state machine so the marketplace record stays complete.",
        links: [{ label: "How the marketplace works", href: "/learn/how-the-marketplace-works" }],
      },
    ],
  },
  {
    slug: "marketplace",
    path: "x/marketplace",
    name: "Marketplace",
    domain: "Marketplace & workloads",
    summary: "Marketplace coordination and offering surfaces layered over the core exchange.",
    whatItDoes: [
      "Where x/market implements the raw order–match–lease state machine, the marketplace module carries the coordination surfaces around it: how offerings are presented, how marketplace-level rules are applied, and how the exchange is exposed to client interfaces as a coherent product rather than a bag of primitives.",
      "It gives the protocol a place to evolve marketplace behavior — listing rules, offering metadata, cross-module orchestration — without overloading the core matching engine, keeping the state machine in x/market small and verifiable.",
    ],
    whyItExists:
      "Separating the matching engine from marketplace presentation is a deliberate design split: the core exchange must stay minimal and stable, while the marketplace surface can grow with the network. The two-module split keeps consensus-critical logic isolated from product-level iteration.",
    interactions: [
      { slug: "market", label: "x/market", how: "Builds directly on the order, bid, and lease primitives." },
      { slug: "provider", label: "x/provider", how: "Surfaces provider offerings and attributes to tenants." },
      { slug: "resources", label: "x/resources", how: "Uses shared resource definitions to describe offerings consistently." },
      { slug: "review", label: "x/review", how: "Reputation signals feed offer presentation and tenant choice." },
    ],
    concepts: [
      { term: "Offering", def: "A provider-facing presentation of leasable capacity, described with shared resource units and attributes." },
      { term: "Approved client", def: "A client interface permitted to interact with identity-sensitive marketplace flows, governed via x/config." },
    ],
    media: "hero-infrastructure",
    mediaCaption: "The market as a product surface.",
    glance: [
      {
        kicker: "Surface",
        title: "The product around the primitives",
        body: "Offerings presented, marketplace rules applied, the exchange exposed as a coherent product rather than a bag of primitives.",
      },
      {
        kicker: "Evolution",
        title: "Room to grow safely",
        body: "Listing rules, offering metadata, and cross-module orchestration evolve here without touching the core matching engine.",
      },
      {
        kicker: "Stability",
        title: "A small, verifiable core",
        body: "Isolating presentation from matching keeps the consensus-critical state machine in x/market minimal and stable.",
      },
    ],
    flow: [
      {
        label: "Present",
        title: "Offerings are presented",
        body: "Provider capacity surfaces through offering metadata that tenants can browse, filter, and compare.",
      },
      {
        label: "Rule",
        title: "Marketplace rules apply",
        body: "Listing rules and marketplace-level behavior shape what tenants see and how offers compete.",
      },
      {
        label: "Expose",
        title: "Clients get a coherent product",
        body: "The exchange reaches client interfaces as one integrated surface instead of raw primitives.",
      },
      {
        label: "Evolve",
        title: "Behavior grows without core risk",
        body: "New marketplace behavior lands in this module; the x/market state machine stays small and verifiable.",
      },
    ],
    faqs: [
      {
        question: "Why two modules instead of one?",
        answer:
          "Separating the matching engine from marketplace presentation keeps consensus-critical logic isolated from product-level iteration — the core exchange stays minimal and stable while the surface grows with the network.",
      },
      {
        question: "What lives here versus x/market?",
        answer:
          "Coordination surfaces — offerings, listing rules, cross-module orchestration — live here. Order–bid–lease state transitions live in x/market.",
        links: [{ label: "x/market module", href: "/modules/market" }],
      },
      {
        question: "How do reputation signals reach tenants?",
        answer:
          "Review and standing signals feed offer presentation and tenant choice through this surface, so track records influence discovery where decisions happen.",
        links: [{ label: "x/review module", href: "/modules/review" }],
      },
    ],
  },
  {
    slug: "deployment",
    path: "x/deployment",
    name: "Deployment",
    domain: "Marketplace & workloads",
    summary: "Tenant deployment specifications and groups — what tenants ask the marketplace to run.",
    whatItDoes: [
      "The deployment module stores what a tenant wants to run: a deployment specification enumerating one or more groups of services, each with resource requirements (CPU, memory, storage), placement constraints, and pricing bounds. When a tenant creates a deployment, the module emits the orders that the market module opens for bidding.",
      "Deployments are versioned, updatable state: tenants can update or close a deployment, and group-level granularity means a single deployment can fan out to multiple orders placed with different providers in different regions.",
    ],
    whyItExists:
      "Tenants think in terms of workloads, not individual orders. The deployment module translates a declarative workload description into marketplace primitives, the same way a Kubernetes Deployment translates a desired state into pods — but with the exchange, not a scheduler, deciding who runs it.",
    interactions: [
      { slug: "market", label: "x/market", how: "Deployment groups generate the orders the market opens for bidding." },
      { slug: "escrow", label: "x/escrow", how: "A deployment funds the escrow that backs its resulting leases." },
      { slug: "cert", label: "x/cert", how: "Tenant certificates authenticate the deployment owner to providers." },
      { slug: "veid", label: "x/veid", how: "Deployment creation is gated by the tenant's verified identity." },
    ],
    concepts: [
      { term: "Deployment", def: "A tenant's declarative description of the services they want the marketplace to run." },
      { term: "Group", def: "A subdivision of a deployment that becomes an independently-biddable order with its own placement rules." },
      { term: "SDL", def: "The stack definition language in which workloads are described — services, resources, and placement." },
    ],
    media: "open-source-screen",
    mediaCaption: "Workloads declared, then enacted.",
    glance: [
      {
        kicker: "Spec",
        title: "Workloads declared in groups",
        body: "Services with CPU, memory, storage, placement constraints, and pricing bounds — versioned, updatable on-chain state.",
      },
      {
        kicker: "Fan-out",
        title: "One deployment, many orders",
        body: "Groups become independently-biddable orders, placeable with different providers in different regions.",
      },
      {
        kicker: "Gating",
        title: "Identity and escrow up front",
        body: "Creation is VEID-gated to verified tenants, and the deployment funds the escrow behind its leases.",
      },
    ],
    flow: [
      {
        label: "Describe",
        title: "Write the spec",
        body: "Services, resources, placement, and pricing bounds declared in the stack definition language.",
      },
      {
        label: "Emit",
        title: "Groups become orders",
        body: "Each group fans out to an order that the market module opens for competitive bidding.",
      },
      {
        label: "Fund",
        title: "Fund the escrow",
        body: "The deployment funds the escrow account backing its resulting leases — demand arrives with budget attached.",
      },
      {
        label: "Run",
        title: "Update or close",
        body: "Deployments are versioned: update specs as needs change or close out, with unspent escrow returning to the tenant.",
      },
    ],
    faqs: [
      {
        question: "What is a deployment group?",
        answer:
          "A subdivision of a deployment that becomes an independently-biddable order with its own placement rules — the unit providers actually compete for.",
      },
      {
        question: "What is SDL?",
        answer:
          "The stack definition language: how services, resources, and placement are described for the marketplace. Think of it as the desired-state document the exchange acts on.",
      },
      {
        question: "How is the deployment owner authenticated?",
        answer:
          "Tenant certificates (x/cert) authenticate the owner to providers when delivering manifests, and deployment creation itself is gated by the tenant's VEID identity.",
        links: [{ label: "x/cert module", href: "/modules/cert" }],
      },
    ],
  },
  {
    slug: "provider",
    path: "x/provider",
    name: "Provider",
    domain: "Marketplace & workloads",
    summary: "Provider registration and the on-chain attribute record tenants filter against.",
    whatItDoes: [
      "The provider module is the registry of capacity operators. A provider record carries the operator's chain address, service endpoint, and attributes: region, hardware classes, certifications, and any property a tenant might filter on when choosing where a workload lands.",
      "Attributes are the connective tissue of marketplace trust: tenants constrain orders to providers matching required attributes, and auditors can sign attributes (via x/audit) so claims like datacenter tier or jurisdiction carry third-party weight rather than self-assertion alone.",
    ],
    whyItExists:
      "An open marketplace needs a structured, verifiable answer to \"who is offering this capacity?\". Registering providers on-chain — with attributes that auditors can attest — replaces the trust role a centralized cloud's brand plays, using records anyone can verify.",
    interactions: [
      { slug: "market", label: "x/market", how: "Bids are placed by registered providers; orders filter on provider attributes." },
      { slug: "audit", label: "x/audit", how: "Auditors sign provider attributes to upgrade self-claims into attestations." },
      { slug: "benchmark", label: "x/benchmark", how: "Published hardware benchmarks are tied to the provider record." },
      { slug: "veid", label: "x/veid", how: "Provider registration is identity-gated through VEID verification." },
    ],
    concepts: [
      { term: "Provider record", def: "The on-chain registration carrying an operator's endpoint and attributes." },
      { term: "Attribute", def: "A key–value property of a provider — region, hardware, certification — filterable by tenant orders." },
      { term: "Provider daemon", def: "The off-chain agent that bids, orchestrates workloads, and reports usage for a registered provider." },
    ],
    media: "provider-datacenter",
    mediaCaption: "Operators register here.",
    glance: [
      {
        kicker: "Record",
        title: "Registration with attributes",
        body: "Chain address, service endpoint, region, hardware classes, certifications — everything tenant orders filter on, in one verifiable record.",
      },
      {
        kicker: "Attest",
        title: "Claims become attestations",
        body: "Auditors sign attributes so tier or jurisdiction claims carry third-party weight instead of self-assertion alone.",
      },
      {
        kicker: "Agent",
        title: "The daemon does the work",
        body: "The off-chain agent bids on orders, orchestrates won workloads, and reports signed usage back to the chain.",
      },
    ],
    flow: [
      {
        label: "Verify",
        title: "VEID verification first",
        body: "Registration is identity-gated through VEID verification — accountability starts before the first bid.",
      },
      {
        label: "Register",
        title: "Create the record",
        body: "Address, endpoint, and attributes go on-chain as the provider record tenants will filter against.",
      },
      {
        label: "Attest",
        title: "Get attributes signed",
        body: "Auditor signatures upgrade self-claims into attestations that tenant orders can explicitly require.",
      },
      {
        label: "Benchmark",
        title: "Publish measurements",
        body: "Hardware benchmarks tie measured performance to the record, so bids compete on evidence.",
      },
    ],
    faqs: [
      {
        question: "What is a provider attribute?",
        answer:
          "A key–value property of a provider — region, hardware class, certification — that tenant orders can filter on when choosing where a workload lands.",
      },
      {
        question: "Who can sign attributes?",
        answer:
          "Recognized auditors via x/audit. Auditor status is itself an on-chain role, and attestations are revocable and traceable to accountable, identity-verified signers.",
        links: [{ label: "x/audit module", href: "/modules/audit" }],
      },
      {
        question: "What is the provider daemon?",
        answer:
          "The off-chain agent that watches open orders, bids per configured pricing, instantiates won leases on the operator's infrastructure, meters usage per workload, and submits signed records to the chain.",
      },
    ],
  },
  {
    slug: "resources",
    path: "x/resources",
    name: "Resources",
    domain: "Marketplace & workloads",
    summary: "Shared resource-unit and capacity definitions used across the marketplace.",
    whatItDoes: [
      "The resources module defines the vocabulary of the marketplace: what a unit of CPU, memory, storage, or GPU means, how capacity is expressed, and how resource requirements are compared for matching. Every module that talks about capacity — deployments, orders, bids, usage records — uses these shared definitions.",
      "Centralizing the resource model prevents drift: a bid can be checked against an order, and a usage record against a lease, because all three quantify resources identically.",
    ],
    whyItExists:
      "Marketplaces fail on ambiguity. If tenant and provider disagree on what \"one unit of compute\" means, matching and settlement both break. A single, consensus-maintained resource model is what makes cross-provider price comparison and automated settlement possible.",
    interactions: [
      { slug: "deployment", label: "x/deployment", how: "Deployment groups express requirements in shared resource units." },
      { slug: "market", label: "x/market", how: "Order/bid matching compares resource specifications from this module." },
      { slug: "settlement", label: "x/settlement", how: "Usage records quantify consumption in the same units they were leased in." },
      { slug: "benchmark", label: "x/benchmark", how: "Benchmarks ground abstract units in measured hardware performance." },
    ],
    concepts: [
      { term: "Resource unit", def: "The canonical quantification of CPU, memory, storage, or accelerator capacity." },
      { term: "Capacity", def: "A provider's leasable inventory, expressed in resource units for matching." },
    ],
    media: "hero-infrastructure",
    mediaCaption: "One vocabulary for every unit of capacity.",
    glance: [
      {
        kicker: "Units",
        title: "One meaning for every unit",
        body: "CPU, memory, storage, and GPU quantified identically everywhere — the vocabulary every capacity conversation shares.",
      },
      {
        kicker: "Matching",
        title: "Bids check against orders",
        body: "Because all sides share definitions, matching is mechanical and verifiable instead of interpretive.",
      },
      {
        kicker: "Settlement",
        title: "Metered in leased units",
        body: "Usage records quantify consumption in the same units capacity was leased in — then benchmarks ground them in measured hardware.",
      },
    ],
    flow: [
      {
        label: "Define",
        title: "Units are defined once",
        body: "The module fixes what each unit of CPU, memory, storage, or accelerator capacity means.",
      },
      {
        label: "Express",
        title: "Capacity and demand use them",
        body: "Providers express inventory and deployments express requirements in the same shared units.",
      },
      {
        label: "Match",
        title: "Orders meet bids",
        body: "Matching compares specifications written in the shared vocabulary — no translation layer, no ambiguity.",
      },
      {
        label: "Settle",
        title: "Usage bills in kind",
        body: "Consumption is recorded and settled in the units it was leased in, with benchmarks qualifying abstract units by measured performance.",
      },
    ],
    faqs: [
      {
        question: "Why centralize the resource model?",
        answer:
          "Marketplaces fail on ambiguity: if tenant and provider disagree on what one unit of compute means, matching and settlement both break. A single consensus-maintained model makes cross-provider comparison and automated settlement possible.",
      },
      {
        question: "What do benchmarks add to units?",
        answer:
          "They ground abstract units in measured hardware performance — the same unit of compute qualified by what the underlying hardware actually measures.",
        links: [{ label: "x/benchmark module", href: "/modules/benchmark" }],
      },
      {
        question: "Which modules use these definitions?",
        answer:
          "Every module that talks about capacity: deployments express requirements in them, orders and bids match on them, and usage records and settlement bill in them.",
      },
    ],
  },
  {
    slug: "hpc",
    path: "x/hpc",
    name: "HPC",
    domain: "Marketplace & workloads",
    summary: "The HPC job marketplace for scheduler-backed supercomputing clusters.",
    whatItDoes: [
      "The hpc module extends the marketplace to batch supercomputing. Instead of leasing long-running services, tenants submit HPC jobs — batch workloads with resource, walltime, and partition requirements — that execute on providers' existing cluster schedulers: SLURM, MOAB, or Open OnDemand.",
      "On the provider side, the daemon's HPC integration polls on-chain jobs, dispatches them through native scheduler adapters (munge or JWT auth for SLURM, per-partition configuration), tracks lifecycle with configurable concurrency limits and timeouts, and recovers state crash-safely. Job events, security events, and usage feed a dedicated audit log, and usage batches flow into the same settlement pipeline as cloud workloads.",
    ],
    whyItExists:
      "University and national-lab clusters run some of the world's most valuable capacity at partial utilization, but their operating model — batch schedulers, allocations, walltime — doesn't map onto container leases. A dedicated HPC module lets that capacity join the marketplace without re-platforming the cluster.",
    interactions: [
      { slug: "market", label: "x/market", how: "HPC capacity is offered and priced through the same exchange economics." },
      { slug: "settlement", label: "x/settlement", how: "HPC job usage settles through the standard usage-settlement pipeline." },
      { slug: "provider", label: "x/provider", how: "Cluster operators register as providers with HPC-specific attributes." },
      { slug: "audit", label: "x/audit", how: "Scheduler-level audit logging complements on-chain audit attestations." },
    ],
    concepts: [
      { term: "HPC job", def: "A batch workload with resource, walltime, and partition requirements, executed via a cluster scheduler." },
      { term: "Scheduler adapter", def: "The daemon component that speaks natively to SLURM, MOAB, or Open OnDemand." },
      { term: "Partition", def: "A scheduler-level subdivision of a cluster that can be exposed to the marketplace with its own configuration." },
    ],
    media: "hpc-supercomputer",
    mediaCaption: "Supercomputing jobs, market-priced.",
    glance: [
      {
        kicker: "Jobs",
        title: "Batch work, expressed natively",
        body: "On-chain jobs carry resource, walltime, and partition requirements — the batch model, not a container shim.",
      },
      {
        kicker: "Adapters",
        title: "SLURM, MOAB, Open OnDemand",
        body: "Native scheduler adapters with munge/JWT auth, per-partition configuration, concurrency limits, and crash-safe recovery.",
      },
      {
        kicker: "Rails",
        title: "The standard settlement pipeline",
        body: "Usage batches settle exactly like cloud workloads: signed records, 24-hour dispute window, escrow release.",
      },
    ],
    flow: [
      {
        label: "Submit",
        title: "A job goes on-chain",
        body: "Resource, walltime, and partition requirements are recorded as an HPC job through the same exchange economics.",
      },
      {
        label: "Dispatch",
        title: "The adapter dispatches",
        body: "The daemon polls on-chain jobs and dispatches through the native scheduler with configurable limits and timeouts.",
      },
      {
        label: "Track",
        title: "Lifecycle is tracked",
        body: "Polling, dispatch, tracking, and crash-safe recovery — with job, security, and usage events in a dedicated audit log.",
      },
      {
        label: "Settle",
        title: "Usage batches settle",
        body: "Metered batches flow into the standard usage-settlement pipeline from tenant escrow.",
      },
    ],
    faqs: [
      {
        question: "Do clusters need re-platforming?",
        answer:
          "No. The scheduler, partitions, and auth stay as they are — only the partitions and job classes a facility exposes become schedulable from the market.",
      },
      {
        question: "How is HPC usage priced?",
        answer:
          "Through the same exchange economics as the rest of the marketplace. Facilities set pricing per partition and job class, and jobs are paid from tenant escrow with no protocol commission at settlement.",
      },
      {
        question: "What audit trail does a job leave?",
        answer:
          "Two layers: the daemon's dedicated audit log for job, security, and usage events, plus the on-chain record — job, usage batches, settlement — validated by consensus.",
      },
    ],
  },

  // ───────────────────────── Identity & security ─────────────────────────
  {
    slug: "veid",
    path: "x/veid",
    name: "VEID",
    domain: "Identity & security",
    summary: "Identity verification and trust scoring — the patented core of the protocol.",
    whatItDoes: [
      "The veid module implements VirtEngine's identity layer. Users capture identity evidence on-device — documents with OCR, a selfie with active liveness, biometric hardware attestation (fingerprint or iris), and device integrity attestation via Play Integrity or App Attest. The evidence is sealed into encrypted identity scopes, signed by both an approved client and the user, and submitted on-chain.",
      "Validators — the same set that secures consensus — decrypt submitted scopes with their keys, score them with shared machine-learning models, and commit an identity trust score to the ledger by consensus. This validator-run identity verification network is the method protected by patent AU2024203136B2.",
      "The module's zero-knowledge subsystem (x/veid/zk) lets users then prove facts about their verified identity — that a score clears a threshold, that an attribute holds — without revealing documents, biometrics, or the score itself.",
    ],
    whyItExists:
      "An open compute marketplace without identity is an invitation to fraud and abuse: providers need to know a tenant is real before workloads land on their hardware, and tenants need to know a provider is accountable. VEID makes verification a protocol function — decentralized like the chain itself, private by construction — rather than an outsourced KYC checkbox.",
    interactions: [
      { slug: "veidregistry", label: "x/veidregistry", how: "Scores and scope records are registered and resolved through the registry." },
      { slug: "encryption", label: "x/encryption", how: "Identity scopes are sealed with validator-targeted public-key encryption." },
      { slug: "config", label: "x/config", how: "Only governance-approved clients may submit identity data." },
      { slug: "market", label: "x/market", how: "Marketplace access is gated on VEID trust scores in both directions." },
      { slug: "mfa", label: "x/mfa", how: "Sensitive account operations layer on-chain MFA over identity." },
    ],
    concepts: [
      { term: "Identity scope", def: "An encrypted, signed bundle of identity evidence for one verification dimension." },
      { term: "Trust score", def: "The consensus-committed score validators assign after ML evaluation of submitted scopes." },
      { term: "ZK verification tier", def: "A zero-knowledge proof surface that reveals only a threshold or attribute fact — never the data." },
      { term: "Active liveness", def: "A challenge–response selfie flow proving a live human, resistant to photos, replays, and injection." },
    ],
    media: "identity-portrait",
    mediaCaption: "Identity, proven without exposure.",
    glance: [
      {
        kicker: "Capture",
        title: "Evidence stays on-device",
        body: "Documents with OCR, active-liveness selfie, biometric and device attestation — sealed into encrypted scopes, never uploaded raw.",
      },
      {
        kicker: "Score",
        title: "Validators score by consensus",
        body: "The bonded set decrypts scopes, runs shared ML models, and commits trust scores — the patented identity-consensus method.",
      },
      {
        kicker: "Prove",
        title: "Zero-knowledge tiers",
        body: "Prove a threshold or attribute without revealing documents, biometrics, or the score itself.",
      },
    ],
    flow: [
      {
        label: "Capture",
        title: "Evidence on-device",
        body: "Document OCR, liveness challenge, biometric and device attestation — all captured on the handset.",
      },
      {
        label: "Seal",
        title: "Scopes are sealed",
        body: "Evidence bundles are encrypted to validator keys and signed by both an approved client and the user.",
      },
      {
        label: "Score",
        title: "Validators score",
        body: "Decryption, shared-model scoring, and a consensus-committed trust score recorded through the registry.",
      },
      {
        label: "Gate",
        title: "Scores gate the market",
        body: "Marketplace participation, provider registration, and deployment creation all check VEID standing.",
      },
    ],
    faqs: [
      {
        question: "What is an identity scope?",
        answer:
          "An encrypted, signed bundle of identity evidence for one verification dimension — the unit validators decrypt, score, and commit outcomes for.",
        links: [{ label: "x/veidregistry module", href: "/modules/veidregistry" }],
      },
      {
        question: "Who sees my documents and biometrics?",
        answer:
          "Nobody on the public ledger. Scopes are encrypted to validator recipients for scoring, and the verification surfaces expose only zero-knowledge proofs — never raw documents, biometrics, or scores.",
        links: [{ label: "What is VEID?", href: "/learn/what-is-veid" }],
      },
      {
        question: "What is active liveness?",
        answer:
          "A challenge–response selfie flow proving a live human is present — resistant to photos, replays, and injection — performed on-device before anything is sealed.",
      },
    ],
  },
  {
    slug: "veidregistry",
    path: "x/veidregistry",
    name: "VEID Registry",
    domain: "Identity & security",
    summary: "The registry of identity records and scopes that other modules resolve against.",
    whatItDoes: [
      "The veidregistry module is the ledger's index of identity state: which accounts have verified records, which scopes those records comprise, and how identity state is looked up by the modules that enforce identity gates.",
      "Splitting the registry from the scoring engine keeps long-lived identity records cleanly separated from the verification workflow — scoring logic can evolve while the record-of-record interface other modules depend on stays stable.",
    ],
    whyItExists:
      "Every identity-gated action on the chain — registering a provider, creating a deployment, casting an identity-weighted vote — needs a fast, canonical answer to \"what is this account's verified identity state?\". The registry is that answer, kept apart from the machinery that produces it.",
    interactions: [
      { slug: "veid", label: "x/veid", how: "Consensus-committed scores and scope outcomes are recorded into the registry." },
      { slug: "market", label: "x/market", how: "Marketplace identity gates resolve accounts through the registry." },
      { slug: "provider", label: "x/provider", how: "Provider registration checks registry state before admitting operators." },
      { slug: "roles", label: "x/roles", how: "Role assignments can be conditioned on registry-verified identity." },
    ],
    concepts: [
      { term: "Identity record", def: "The canonical on-chain record binding an account to its verification outcomes." },
      { term: "Scope registration", def: "The registry entry tracking which identity scopes an account has verified." },
    ],
    media: "identity-document",
    mediaCaption: "The record of record for identity state.",
    glance: [
      {
        kicker: "Index",
        title: "Identity state, queryable",
        body: "Which accounts hold verified records and which scopes they comprise — one canonical answer for every gated action.",
      },
      {
        kicker: "Split",
        title: "Records apart from machinery",
        body: "Scoring logic can evolve while the record interface other modules depend on stays stable.",
      },
      {
        kicker: "Gates",
        title: "Every check resolves here",
        body: "Provider registration, deployment creation, and identity-weighted votes all read this registry.",
      },
    ],
    flow: [
      {
        label: "Commit",
        title: "Scores commit",
        body: "Consensus-committed scores and scope outcomes are recorded from the scoring engine.",
      },
      {
        label: "Register",
        title: "Records bind accounts",
        body: "The canonical record ties each account to its verification outcomes and verified scopes.",
      },
      {
        label: "Resolve",
        title: "Modules query",
        body: "Marketplace gates, registration checks, and role conditions resolve identity state through the registry.",
      },
      {
        label: "Endure",
        title: "Records outlive workflows",
        body: "Long-lived identity state stays addressable as scoring machinery evolves underneath.",
      },
    ],
    faqs: [
      {
        question: "Why split the registry from scoring?",
        answer:
          "So verification workflows can evolve without breaking the stable record interface that every gated module depends on — production machinery changes, the address of truth doesn't.",
      },
      {
        question: "What does an identity record contain?",
        answer:
          "The binding between an account and its verification outcomes, plus which identity scopes it has verified — the facts gated actions need, nothing more.",
      },
      {
        question: "Which actions check the registry?",
        answer:
          "Provider registration, deployment creation, marketplace participation gates, and identity-conditioned role grants — anything that must answer what an account's verified state is.",
        links: [{ label: "x/veid module", href: "/modules/veid" }],
      },
    ],
  },
  {
    slug: "mfa",
    path: "x/mfa",
    name: "MFA",
    domain: "Identity & security",
    summary: "On-chain multi-factor authentication policies for sensitive operations.",
    whatItDoes: [
      "The mfa module brings multi-factor authentication into consensus: accounts can enroll additional factors, and designated sensitive operations — account recovery among them — require satisfying an on-chain MFA policy before they execute.",
      "Because the policy check happens in the state machine rather than in a client app, MFA cannot be stripped by a malicious interface: a transaction that doesn't carry the required factors simply fails validation.",
    ],
    whyItExists:
      "Key compromise is the dominant failure mode of blockchain accounts. For a chain that carries identity records and payment streams, single-signature security is not enough — MFA enforced by the protocol itself closes the gap between wallet security and account security.",
    interactions: [
      { slug: "veid", label: "x/veid", how: "MFA layers on VEID identity for step-up verification on sensitive flows." },
      { slug: "roles", label: "x/roles", how: "Role-holding accounts can be required to authenticate with additional factors." },
      { slug: "config", label: "x/config", how: "Which operations demand MFA is governed chain configuration." },
    ],
    concepts: [
      { term: "Factor enrollment", def: "Registering an additional authentication factor against an on-chain account." },
      { term: "Step-up authentication", def: "Requiring stronger factors for higher-risk operations like recovery." },
    ],
    media: "identity-liveness",
    mediaCaption: "Step-up proof, enforced by consensus.",
    glance: [
      {
        kicker: "Policy",
        title: "Factors as chain state",
        body: "Enrolled factors and the operations that demand them live in consensus — not in any single app's settings.",
      },
      {
        kicker: "Force",
        title: "Clients can't strip it",
        body: "A transaction without the required factors fails validation. No interface, malicious or otherwise, can waive the check.",
      },
      {
        kicker: "Scope",
        title: "Recovery and privileged roles",
        body: "Account recovery and role-held operations carry step-up requirements where compromise would hurt most.",
      },
    ],
    flow: [
      {
        label: "Enroll",
        title: "Register factors",
        body: "Additional authentication factors are enrolled against the on-chain account.",
      },
      {
        label: "Govern",
        title: "Policy names operations",
        body: "Chain configuration designates which operations demand MFA — recovery, privileged roles, and their kin.",
      },
      {
        label: "Step up",
        title: "Sensitive flows challenge",
        body: "High-risk operations require satisfying the on-chain policy before they execute.",
      },
      {
        label: "Fail closed",
        title: "Missing factors fail",
        body: "Non-compliant transactions fail validation regardless of which client submitted them.",
      },
    ],
    faqs: [
      {
        question: "Why put MFA on-chain instead of in wallets?",
        answer:
          "Key compromise is the dominant account failure mode, and for a chain carrying identity records and payment streams, single-signature security is not enough. Protocol-enforced factors close the gap between wallet security and account security.",
      },
      {
        question: "What is step-up authentication?",
        answer:
          "Requiring stronger factors for higher-risk operations like account recovery — the policy escalates with the stakes of the action.",
      },
      {
        question: "How does MFA relate to VEID?",
        answer:
          "MFA layers on VEID identity for step-up verification on sensitive flows, and privileged role-holding accounts can be required to carry stronger authentication.",
        links: [{ label: "x/veid module", href: "/modules/veid" }],
      },
    ],
  },
  {
    slug: "cert",
    path: "x/cert",
    name: "Certificates",
    domain: "Identity & security",
    summary: "TLS certificates for mutual authentication between providers and tenants.",
    whatItDoes: [
      "The cert module anchors TLS certificates on-chain so that providers and tenants can mutually authenticate off-chain connections. When a tenant's client connects to a provider daemon endpoint — to send a manifest, fetch logs, or reach a deployed service — both sides verify the peer's certificate against chain state.",
      "Certificates are issued and revoked by their owning accounts, giving every marketplace participant a self-service PKI whose root of trust is the ledger rather than a commercial certificate authority.",
    ],
    whyItExists:
      "Leases are agreed on-chain but workloads are served off-chain. Without a shared PKI, the off-chain hop would be the weakest link — either unauthenticated or dependent on external CAs. Anchoring certificates in consensus lets any lease counterparty verify exactly who they are talking to.",
    interactions: [
      { slug: "provider", label: "x/provider", how: "Provider endpoints present chain-anchored certificates to tenants." },
      { slug: "deployment", label: "x/deployment", how: "Tenant clients authenticate with certificates when delivering manifests." },
      { slug: "market", label: "x/market", how: "Lease counterparties are the identities certificates authenticate." },
    ],
    concepts: [
      { term: "mTLS", def: "Mutual TLS — both client and server authenticate, each verified against on-chain certificate state." },
      { term: "Revocation", def: "On-chain invalidation of a certificate, effective for all future connection checks." },
    ],
    media: "staking-security",
    mediaCaption: "Keys anchored to on-chain identity.",
    glance: [
      {
        kicker: "PKI",
        title: "Self-service, ledger-rooted",
        body: "Issue and revoke your own certificates. The ledger is the root of trust — not a commercial certificate authority.",
      },
      {
        kicker: "mTLS",
        title: "Both sides verify",
        body: "Tenant clients and provider endpoints authenticate each other against chain state before workload data moves.",
      },
      {
        kicker: "Scope",
        title: "Every off-chain hop",
        body: "Manifest delivery, log fetches, and connections to deployed services all ride verified channels.",
      },
    ],
    flow: [
      {
        label: "Issue",
        title: "Accounts issue certificates",
        body: "Owning accounts create certificates for their endpoints and clients — self-service PKI.",
      },
      {
        label: "Present",
        title: "Peers present on connect",
        body: "Provider endpoints and tenant clients present chain-anchored certificates when connections open.",
      },
      {
        label: "Verify",
        title: "Both sides check chain state",
        body: "Mutual verification against on-chain records before any workload data moves.",
      },
      {
        label: "Revoke",
        title: "Revocation is on-chain",
        body: "Invalidation takes effect for all future connection checks, visible to every counterparty.",
      },
    ],
    faqs: [
      {
        question: "Why not just use public certificate authorities?",
        answer:
          "Leases are agreed on-chain but workloads are served off-chain. Anchoring certificates in consensus lets any lease counterparty verify exactly who they are talking to, without depending on external authorities for the protocol's most sensitive hop.",
      },
      {
        question: "What is mTLS in this context?",
        answer:
          "Mutual TLS: both client and server authenticate, each verified against on-chain certificate state — the lease counterparties are the identities the certificates authenticate.",
      },
      {
        question: "What happens on key compromise?",
        answer:
          "The owning account revokes the certificate on-chain, and revocation is effective for all future connection checks across the marketplace.",
      },
    ],
  },
  {
    slug: "encryption",
    path: "x/encryption",
    name: "Encryption",
    domain: "Identity & security",
    summary: "Public-key encryption so sensitive on-chain data is readable only by intended recipients.",
    whatItDoes: [
      "The encryption module gives the chain a native envelope-encryption capability: data written into transactions can be sealed to specific recipients' public keys, so it transits the mempool, lives in blocks, and replicates to every node while remaining readable only where intended.",
      "Its most important client is VEID — identity scopes are encrypted to validator recipients so the identity network can score them while the public ledger never exposes raw documents or biometrics. Key registration and fingerprinting let senders discover and pin recipient keys on-chain.",
    ],
    whyItExists:
      "Public ledgers and personal data are structurally at odds: everything on-chain is replicated everywhere, forever. Making recipient-targeted encryption a first-class module resolves the tension — the chain carries ciphertext and its integrity guarantees, while plaintext exists only at authorized endpoints.",
    interactions: [
      { slug: "veid", label: "x/veid", how: "Identity scopes are sealed to validator keys for consensus scoring." },
      { slug: "enclave", label: "x/enclave", how: "Enclave workflows combine attestation with encrypted payload delivery." },
      { slug: "support", label: "x/support", how: "Dispute evidence can be sealed to the parties entitled to read it." },
    ],
    concepts: [
      { term: "Envelope encryption", def: "Sealing a payload with a symmetric key that is itself encrypted to each recipient's public key." },
      { term: "Key fingerprint", def: "A compact, verifiable digest of a registered public key used to pin recipients." },
    ],
    media: "identity-document",
    mediaCaption: "Sealed to validator keys.",
    glance: [
      {
        kicker: "Seal",
        title: "Ciphertext on-chain, plaintext at endpoints",
        body: "Payloads transit mempools and blocks readable only where intended — replicated everywhere, exposed nowhere.",
      },
      {
        kicker: "Client",
        title: "VEID runs on it",
        body: "Identity scopes are encrypted to validator recipients so the identity network can score them while the public ledger never exposes raw data.",
      },
      {
        kicker: "Keys",
        title: "Registered and fingerprinted",
        body: "Senders discover and pin recipient keys on-chain before sealing anything to them.",
      },
    ],
    flow: [
      {
        label: "Register",
        title: "Recipients register keys",
        body: "Public keys with verifiable fingerprints go on-chain — validators, dispute parties, enclave targets.",
      },
      {
        label: "Seal",
        title: "Senders envelope-encrypt",
        body: "A symmetric key seals the payload; the key itself is encrypted to each recipient's public key.",
      },
      {
        label: "Transit",
        title: "Ciphertext rides the chain",
        body: "Blocks carry ciphertext plus the chain's integrity and ordering guarantees — plaintext exists only at authorized endpoints.",
      },
      {
        label: "Open",
        title: "Recipients decrypt",
        body: "Validators open identity scopes for scoring; entitled parties open sealed dispute evidence.",
      },
    ],
    faqs: [
      {
        question: "What is envelope encryption?",
        answer:
          "Sealing a payload with a symmetric key that is itself encrypted to each recipient's public key — efficient for large payloads, precise about who may open them.",
      },
      {
        question: "What is a key fingerprint?",
        answer:
          "A compact, verifiable digest of a registered public key, used to pin recipients so senders seal to exactly the key they intend.",
      },
      {
        question: "Why not keep sensitive data off-chain entirely?",
        answer:
          "Because the protocol needs integrity and ordering guarantees for that data too. Sealed envelopes give both — the chain carries ciphertext and its guarantees, while plaintext exists only at authorized endpoints.",
        links: [{ label: "x/veid module", href: "/modules/veid" }],
      },
    ],
  },
  {
    slug: "enclave",
    path: "x/enclave",
    name: "Enclave",
    domain: "Identity & security",
    summary: "Confidential-compute and enclave attestation for sensitive workloads.",
    whatItDoes: [
      "The enclave module records and verifies attestations from trusted execution environments. A provider offering confidential compute can prove on-chain that a workload runs inside a genuine hardware enclave with a specific measured configuration, and a tenant can require that proof before their workload — or its data — is delivered.",
      "Attestation evidence is validated against the state machine's expectations, turning \"trust me, it's confidential\" into a verifiable claim any counterparty can check.",
    ],
    whyItExists:
      "Some workloads cannot leave their trust boundary on faith alone — regulated data, proprietary models, private keys. Confidential computing solves the technical problem; the enclave module solves the marketplace problem of proving it, so confidential capacity can be advertised, verified, and priced like any other attribute.",
    interactions: [
      { slug: "encryption", label: "x/encryption", how: "Workload secrets are encrypted for delivery only after attestation verifies." },
      { slug: "provider", label: "x/provider", how: "Confidential-compute capability is a provider attribute tenants filter on." },
      { slug: "market", label: "x/market", how: "Orders can require attested enclave execution as a placement constraint." },
    ],
    concepts: [
      { term: "TEE", def: "Trusted execution environment — hardware-isolated compute whose state the host cannot inspect." },
      { term: "Attestation", def: "Cryptographic evidence, signed by hardware, of exactly what code runs inside an enclave." },
      { term: "Measurement", def: "The digest of an enclave's code and configuration that attestation commits to." },
    ],
    media: "identity-portrait",
    mediaCaption: "Attested execution, verified before secrets move.",
    glance: [
      {
        kicker: "Prove",
        title: "Attestation recorded on-chain",
        body: "Genuine hardware enclaves with measured configurations — evidence any counterparty can check, not a vendor claim.",
      },
      {
        kicker: "Require",
        title: "Placement constraints",
        body: "Orders can demand attested enclave execution, so unverified capacity can never match sensitive workloads.",
      },
      {
        kicker: "Deliver",
        title: "Secrets after proof",
        body: "Workload secrets stay encrypted until attestation verifies — attestation plus sealed delivery in one workflow.",
      },
    ],
    flow: [
      {
        label: "Offer",
        title: "Providers advertise capability",
        body: "Confidential-compute capability becomes a filterable provider attribute tenants can discover.",
      },
      {
        label: "Require",
        title: "Tenants constrain orders",
        body: "Attested enclave execution enters placement constraints for workloads that need it.",
      },
      {
        label: "Verify",
        title: "Attestation is validated",
        body: "Hardware-signed evidence is checked against the state machine's expectations.",
      },
      {
        label: "Deliver",
        title: "Secrets flow, workload runs",
        body: "Encrypted payloads deliver post-verification; usage settles through the normal pipeline.",
      },
    ],
    faqs: [
      {
        question: "What is a TEE?",
        answer:
          "A trusted execution environment — hardware-isolated compute whose state even the host operator cannot inspect. The enclave module proves workloads actually run inside one.",
      },
      {
        question: "What is a measurement?",
        answer:
          "The digest of an enclave's code and configuration that attestation commits to — the precise fingerprint tenants accept or reject in placement constraints.",
      },
      {
        question: "How is confidential capacity priced?",
        answer:
          "Like any other attribute: confidential capability is priced by open bidding, with its premium set by supply and demand rather than a vendor price list.",
        links: [{ label: "Confidential computing", href: "/solutions/enterprises-confidential-compute" }],
      },
    ],
  },
  {
    slug: "fraud",
    path: "x/fraud",
    name: "Fraud",
    domain: "Identity & security",
    summary: "Fraud reporting and enforcement hooks that police marketplace conduct.",
    whatItDoes: [
      "The fraud module receives and adjudicates reports of marketplace misconduct — falsified usage, identity abuse, malicious workloads — and carries the enforcement hooks that other modules honor: flags, holds, and penalties that alter what a flagged account may do.",
      "It complements consensus-level slashing: where slashing punishes validator protocol violations, the fraud module addresses marketplace-level misconduct by tenants and providers.",
    ],
    whyItExists:
      "Open participation means adversarial participation. A marketplace that cannot expel or penalize bad actors decays into one; putting fraud handling on-chain makes enforcement transparent, rule-bound, and reviewable instead of arbitrary platform moderation.",
    interactions: [
      { slug: "veid", label: "x/veid", how: "Identity abuse reports feed back into trust standing." },
      { slug: "market", label: "x/market", how: "Enforcement outcomes can restrict marketplace participation." },
      { slug: "settlement", label: "x/settlement", how: "Disputed or fraudulent usage is intercepted before it settles." },
      { slug: "support", label: "x/support", how: "Dispute intake escalates to fraud handling where misconduct is alleged." },
    ],
    concepts: [
      { term: "Fraud report", def: "An on-chain allegation of misconduct with supporting evidence, subject to adjudication." },
      { term: "Enforcement hook", def: "A module-level check that honors fraud flags before permitting an action." },
    ],
    media: "network-earth",
    mediaCaption: "Misconduct meets a rule-bound response.",
    glance: [
      {
        kicker: "Report",
        title: "Misconduct on the record",
        body: "Falsified usage, identity abuse, malicious workloads — alleged with evidence and adjudicated on-chain.",
      },
      {
        kicker: "Enforce",
        title: "Hooks other modules honor",
        body: "Flags, holds, and penalties alter what a flagged account may do across the market and settlement flows.",
      },
      {
        kicker: "Split",
        title: "Market faults vs consensus faults",
        body: "Slashing punishes validator violations; this module addresses tenant and provider misconduct.",
      },
    ],
    flow: [
      {
        label: "Allege",
        title: "A report is filed",
        body: "An on-chain allegation of misconduct with supporting evidence opens the case.",
      },
      {
        label: "Judge",
        title: "The report is adjudicated",
        body: "Transparent, rule-bound adjudication — enforcement by protocol, not arbitrary platform moderation.",
      },
      {
        label: "Enforce",
        title: "Hooks engage",
        body: "Flags and holds propagate to market participation, settlement, and support flows.",
      },
      {
        label: "Resolve",
        title: "Standing updates",
        body: "Outcomes feed trust standing, participation rights, and the auditable record.",
      },
    ],
    faqs: [
      {
        question: "What counts as marketplace fraud?",
        answer:
          "Falsified usage, identity abuse, malicious workloads — conduct enforced at the marketplace layer rather than the consensus layer.",
      },
      {
        question: "How is this different from slashing?",
        answer:
          "Slashing punishes validator protocol violations like double-signing. The fraud module addresses tenant and provider misconduct — the two systems complement, never overlap.",
        links: [{ label: "Understanding slashing", href: "/learn/understanding-slashing" }],
      },
      {
        question: "Can enforcement stop a payout?",
        answer:
          "Yes. Disputed or fraudulent usage is intercepted before it settles, and enforcement outcomes can restrict marketplace participation until resolved.",
        links: [{ label: "x/settlement module", href: "/modules/settlement" }],
      },
    ],
  },
  {
    slug: "roles",
    path: "x/roles",
    name: "Roles",
    domain: "Identity & security",
    summary: "Role-based access control shared across the protocol's modules.",
    whatItDoes: [
      "The roles module implements protocol-wide RBAC: named roles with defined capabilities, assignable to accounts, checked by other modules before privileged operations execute. Auditor rights, administrative operations, and specialized marketplace capabilities all resolve through role checks.",
      "Centralizing authorization means access decisions are consistent, queryable, and governable — a role grant is a transaction, not a configuration file on someone's server.",
    ],
    whyItExists:
      "Two dozen modules each inventing its own permission model would be unauditable. One RBAC module gives the protocol a single, inspectable answer to \"who may do what\" — and one governance surface to change it.",
    interactions: [
      { slug: "audit", label: "x/audit", how: "Auditor status is a role that authorizes signing provider attributes." },
      { slug: "config", label: "x/config", how: "Configuration changes require appropriately-roled accounts." },
      { slug: "mfa", label: "x/mfa", how: "Privileged roles can be required to carry stronger authentication." },
      { slug: "veidregistry", label: "x/veidregistry", how: "Role grants can be conditioned on verified identity." },
    ],
    concepts: [
      { term: "Role", def: "A named bundle of capabilities assignable to accounts and checked by modules." },
      { term: "Capability check", def: "The authorization gate a module runs before executing a privileged message." },
    ],
    media: "closing-hands",
    mediaCaption: "Capabilities granted, auditable on chain.",
    glance: [
      {
        kicker: "One model",
        title: "RBAC for every module",
        body: "Named roles with defined capabilities, checked everywhere — one inspectable answer to who may do what.",
      },
      {
        kicker: "Grants",
        title: "Authorization as transactions",
        body: "A role grant is chain state, queryable by anyone — not a configuration file on someone's server.",
      },
      {
        kicker: "Govern",
        title: "One surface to change",
        body: "Role definitions and grants change through governance, with identity and MFA conditions attachable.",
      },
    ],
    flow: [
      {
        label: "Define",
        title: "Capabilities bundle into roles",
        body: "Auditor rights, administrative operations, marketplace capabilities — named, bounded, documented.",
      },
      {
        label: "Grant",
        title: "Accounts receive roles",
        body: "Grants are transactions: public, queryable, and optionally conditioned on verified identity.",
      },
      {
        label: "Check",
        title: "Modules gate on roles",
        body: "Privileged messages run capability checks before executing — no check, no execution.",
      },
      {
        label: "Harden",
        title: "Identity and factors attach",
        body: "Sensitive grants can require VEID-verified identity or stronger MFA authentication.",
      },
    ],
    faqs: [
      {
        question: "Why not let each module manage permissions?",
        answer:
          "Two dozen bespoke permission models would be unauditable. One RBAC module keeps authorization consistent, queryable, and governable across the protocol.",
      },
      {
        question: "What is a capability check?",
        answer:
          "The authorization gate a module runs before executing a privileged message — the runtime enforcement of the role model.",
      },
      {
        question: "Is auditor status a role?",
        answer:
          "Yes. Auditor status authorizes signing provider attributes, with grants that can carry identity conditions and MFA requirements.",
        links: [{ label: "x/audit module", href: "/modules/audit" }],
      },
    ],
  },

  // ───────────────────────── Economics & settlement ─────────────────────────
  {
    slug: "escrow",
    path: "x/escrow",
    name: "Escrow",
    domain: "Economics & settlement",
    summary: "Funds held on-chain against active leases, released only by settlement rules.",
    whatItDoes: [
      "The escrow module holds tenant funds against active leases. When a deployment is created, the tenant funds an escrow account; when leases form, payment obligations draw against that balance. Providers can verify collateral exists before committing capacity, and tenants know funds move only under settlement rules — not at a counterparty's discretion.",
      "Escrow accounts track deposits, settlements, and withdrawals as auditable state transitions. If a balance runs dry, the associated leases close for non-payment; when a deployment closes, any unspent balance returns to the tenant.",
    ],
    whyItExists:
      "Payment risk kills open marketplaces: providers won't serve strangers on the promise of a future invoice, and tenants won't prepay strangers either. On-chain escrow removes both counterparty risks at once — funds are provably committed but provably not yet transferred.",
    interactions: [
      { slug: "market", label: "x/market", how: "Every lease is backed by a funded escrow account from creation." },
      { slug: "settlement", label: "x/settlement", how: "Settled usage line items draw down escrow into provider payouts." },
      { slug: "take", label: "x/take", how: "Settlement keeps marketplace commission at zero as escrow releases to providers." },
      { slug: "deployment", label: "x/deployment", how: "Deployments fund and reclaim the escrow behind their leases." },
    ],
    concepts: [
      { term: "Escrow account", def: "The on-chain balance a tenant funds against a deployment's payment obligations." },
      { term: "Drawdown", def: "The settlement-triggered transfer from escrow toward a provider's earned balance." },
    ],
    media: "settlement-ledger",
    mediaCaption: "Funds locked before the workload starts.",
    glance: [
      {
        kicker: "Commit",
        title: "Provably funded, not yet transferred",
        body: "Tenants fund escrow at deployment creation; providers verify collateral exists before committing capacity.",
      },
      {
        kicker: "Draw",
        title: "Settlement moves funds",
        body: "Validated line items draw down escrow into provider payouts — never at a counterparty's discretion.",
      },
      {
        kicker: "Return",
        title: "Unspent comes back",
        body: "Dry balances close leases for non-payment; closed deployments refund the remainder to the tenant.",
      },
    ],
    flow: [
      {
        label: "Fund",
        title: "Tenant funds escrow",
        body: "The deployment's escrow account opens with real budget behind it — demand arrives collateralized.",
      },
      {
        label: "Verify",
        title: "Providers check collateral",
        body: "Capacity commits only after collateral is provably in place and visible on-chain.",
      },
      {
        label: "Draw",
        title: "Settlement draws down",
        body: "Each cleared usage record converts into a drawdown toward the provider's earned balance.",
      },
      {
        label: "Refund",
        title: "Remainders return",
        body: "Unspent balances flow back to the tenant when the deployment closes.",
      },
    ],
    faqs: [
      {
        question: "What is an escrow account?",
        answer:
          "The on-chain balance a tenant funds against a deployment's payment obligations — deposits, settlements, and withdrawals tracked as auditable state transitions.",
      },
      {
        question: "What is a drawdown?",
        answer:
          "The settlement-triggered transfer from escrow toward a provider's earned balance — the moment committed funds become earned funds.",
        links: [{ label: "x/settlement module", href: "/modules/settlement" }],
      },
      {
        question: "What happens if escrow runs dry?",
        answer:
          "Associated leases close for non-payment through the market state machine: service stops, and the record stays auditable for both sides.",
      },
    ],
  },
  {
    slug: "settlement",
    path: "x/settlement",
    name: "Settlement",
    domain: "Economics & settlement",
    summary: "Converts signed usage records into billable line items and provider payouts.",
    whatItDoes: [
      "The settlement module turns metered usage into money. Provider daemons collect per-workload resource metrics on an hourly cadence, batch them into signed usage records, and submit them on-chain (MsgRecordUsage). The module validates records against their leases and converts them into billable line items priced by the lease terms.",
      "Every reported record sits in a 24-hour dispute window during which either party can raise corrections — anomaly detection on the provider side flags outliers before they ever reach the chain. After the window closes, line items settle against lease escrow and the agreed funds transfer to the provider with no marketplace commission. Reconciliation against platform metrics (default every 6 hours) cross-checks reported usage.",
    ],
    whyItExists:
      "Metering and billing are where cloud customers get hurt and providers get stiffed. Making settlement a consensus function — signed records, public dispute window, automatic escrow release — replaces invoice trust with protocol guarantees for both sides.",
    interactions: [
      { slug: "escrow", label: "x/escrow", how: "Settled line items draw provider payouts from lease escrow." },
      { slug: "take", label: "x/take", how: "The zero marketplace-commission policy is applied at payout time." },
      { slug: "market", label: "x/market", how: "Usage records are validated against the lease they bill." },
      { slug: "fraud", label: "x/fraud", how: "Disputed or anomalous usage escalates before settlement completes." },
      { slug: "oracle", label: "x/oracle", how: "Price feeds inform fiat-referenced pricing where leases use it." },
    ],
    concepts: [
      { term: "Usage record", def: "A signed, per-lease report of metered resource consumption for a collection period." },
      { term: "Dispute window", def: "The 24-hour period after reporting during which corrections can be raised." },
      { term: "Line item", def: "A priced billing entry derived from a validated usage record." },
    ],
    media: "settlement-ledger",
    mediaCaption: "Metered usage becomes provider payout.",
    glance: [
      {
        kicker: "Meter",
        title: "Hourly signed records",
        body: "Daemons collect per-workload metrics and submit MsgRecordUsage on an hourly cadence, reconciled every 6 hours by default.",
      },
      {
        kicker: "Dispute",
        title: "24 hours to correct",
        body: "Every record sits in a public dispute window; provider-side anomaly detection flags outliers before they reach the chain.",
      },
      {
        kicker: "Pay",
        title: "Escrow releases, 0% taken",
        body: "Cleared line items settle from escrow with no marketplace commission — the agreed amount, in full.",
      },
    ],
    flow: [
      {
        label: "Collect",
        title: "Daemons meter hourly",
        body: "Per-workload resource metrics gathered on schedule and reconciled against platform metrics every 6 hours by default.",
      },
      {
        label: "Submit",
        title: "Signed records go on-chain",
        body: "Batched usage records are validated against their leases and priced by lease terms into billable line items.",
      },
      {
        label: "Dispute",
        title: "The window opens",
        body: "Twenty-four hours for corrections from either party; fraud and support paths engage on escalation.",
      },
      {
        label: "Release",
        title: "Escrow pays out",
        body: "Cleared items transfer the agreed funds to the provider — full amount, no platform deduction.",
      },
    ],
    faqs: [
      {
        question: "What is a usage record?",
        answer:
          "A signed, per-lease report of metered resource consumption for a collection period — the atomic unit of marketplace billing.",
      },
      {
        question: "What is a line item?",
        answer:
          "A priced billing entry derived from a validated usage record — the thing escrow actually releases against.",
      },
      {
        question: "How are anomalies caught before payout?",
        answer:
          "Provider-side anomaly detection flags outliers before submission, reconciliation cross-checks reported usage every 6 hours by default, and the 24-hour dispute window gives both parties a final correction pass.",
        links: [{ label: "Escrow & settlement explained", href: "/learn/escrow-and-settlement-explained" }],
      },
    ],
  },
  {
    slug: "take",
    path: "x/take",
    name: "Take",
    domain: "Economics & settlement",
    summary: "The zero-rate marketplace settlement policy; validator transaction fees remain separate.",
    whatItDoes: [
      "The take module governs marketplace-settlement policy. Under the proposed economics, its marketplace commission is 0%, so escrow settles the agreed lease amount to the provider without a platform deduction.",
      "This does not remove transaction fees: low validator fees apply to on-chain messages and compensate the validating network. They are proposed at approximately 90% below standard network transaction fees.",
    ],
    whyItExists:
      "A protocol needs sustainable revenue tied to genuine usage. A transparent, governed take on settled payments is the cleanest such mechanism: visible to every participant, proportional to real economic activity, and changeable only by stakeholder vote.",
    interactions: [
      { slug: "settlement", label: "x/settlement", how: "The zero marketplace-commission policy is honoured at payout." },
      { slug: "escrow", label: "x/escrow", how: "The agreed lease amount is released at the escrow boundary." },
      { slug: "bme", label: "x/bme", how: "VEID-led issuance policy interacts with supply mechanics." },
    ],
    concepts: [
      { term: "Marketplace commission", def: "The governed platform deduction from marketplace payments — proposed at 0%." },
    ],
    media: "settlement-ledger",
    mediaCaption: "The full amount moves. Nothing is skimmed.",
    glance: [
      {
        kicker: "Rate",
        title: "Marketplace commission: 0%",
        body: "Escrow settles the agreed lease amount to the provider without a platform deduction.",
      },
      {
        kicker: "Fees",
        title: "Validators still get paid",
        body: "Low transaction fees on on-chain messages compensate the validating network — proposed around 90% below standard network fees.",
      },
      {
        kicker: "Govern",
        title: "Changeable only by vote",
        body: "Settlement policy is governed state, not a dashboard setting anyone can quietly edit.",
      },
    ],
    flow: [
      {
        label: "Clear",
        title: "Usage clears",
        body: "Line items clear the dispute window against funded lease escrow.",
      },
      {
        label: "Apply",
        title: "Policy applies at payout",
        body: "The zero-commission policy is honored as funds release to the provider.",
      },
      {
        label: "Compensate",
        title: "Validators earn fees",
        body: "Message-level transaction fees flow to the validating network for operating consensus.",
      },
      {
        label: "Govern",
        title: "Stakeholders can change it",
        body: "Any future rate change requires stakeholder vote — visible, proportional, governed.",
      },
    ],
    faqs: [
      {
        question: "What is the marketplace commission?",
        answer:
          "The governed platform deduction from marketplace payments — proposed at 0%, so settlement moves the agreed lease amount in full.",
      },
      {
        question: "Does 0% mean running the chain is free?",
        answer:
          "No. Low validator transaction fees apply to on-chain messages and compensate the validating network. The 0% applies to the settled lease payment itself.",
      },
      {
        question: "Why have a take module at a 0% rate?",
        answer:
          "A protocol needs sustainable revenue tied to genuine usage. A transparent, governed take on settled payments is the cleanest such mechanism — visible to every participant, proportional to real activity, and changeable only by stakeholder vote.",
      },
    ],
  },
  {
    slug: "bme",
    path: "x/bme",
    name: "BME",
    domain: "Economics & settlement",
    summary: "Burn-and-mint equilibrium mechanics linking token supply to marketplace demand.",
    whatItDoes: [
      "The bme module implements supply operations. The proposed issuance path is VEID-led: a 15-token batch is issued as eligible active verified humans accrue entitlement, with 14 tokens allocated to those humans and 1 token allocated to the Foundation-controlled genesis account. Staking rewards remain at a much lower proposed level.",
      "Initial supply is zero and there is no fixed maximum supply. New issuance is conditional on verified human identities. The in-repo simulation framework (pkg/economics) contains legacy inflation assumptions and requires alignment before it can validate this policy.",
    ],
    whyItExists:
      "A pure fixed-supply token disconnects the asset from the service it prices; unconstrained inflation destroys holder trust. BME ties supply mechanics to real consumption of compute, aligning the token's monetary dynamics with the marketplace it exists to serve.",
    interactions: [
      { slug: "take", label: "x/take", how: "Keeps marketplace settlement commission at zero." },
      { slug: "settlement", label: "x/settlement", how: "Settles escrow without a platform deduction." },
      { slug: "issuancepolicy", label: "x/issuancepolicy", how: "Mint schedules operate under governed issuance policy." },
      { slug: "staking", label: "x/staking", how: "Issuance funds staking rewards alongside the inflation mechanism." },
    ],
    concepts: [
      { term: "Burn-and-mint equilibrium", def: "A monetary design where service payments burn tokens and issuance mints them, equilibrating around real demand." },
    ],
    media: "staking-security",
    mediaCaption: "Supply mechanics that pay for security.",
    glance: [
      {
        kicker: "Supply",
        title: "Zero initial, no fixed max",
        body: "New issuance is conditional on verified human identities — never pre-mined, never capped by fiat.",
      },
      {
        kicker: "Batch",
        title: "VEID-led 15-token path",
        body: "Proposed: 14 tokens to eligible active verified humans and 1 to the Foundation genesis account, as entitlement accrues.",
      },
      {
        kicker: "Bounds",
        title: "Policy-governed minting",
        body: "Mint schedules execute under issuance-policy bounds; the simulation framework still requires alignment to validate the policy.",
      },
    ],
    flow: [
      {
        label: "Verify",
        title: "Humans verify",
        body: "Eligible active verified humans accrue entitlement through VEID — issuance follows identity, not speculation.",
      },
      {
        label: "Batch",
        title: "15-token batches issue",
        body: "Fourteen tokens to humans, one to the genesis account, per the proposed path.",
      },
      {
        label: "Reward",
        title: "Security gets funded",
        body: "Issuance funds staking rewards alongside the inflation mechanism, at a much lower proposed level than the prior model.",
      },
      {
        label: "Govern",
        title: "Policy bounds everything",
        body: "Schedules, safeguards, and parameters stay changeable only by governance.",
      },
    ],
    faqs: [
      {
        question: "What is burn-and-mint equilibrium?",
        answer:
          "A monetary design where service payments burn tokens and issuance mints them, equilibrating around real demand — connecting the asset to the service it prices.",
        links: [{ label: "Tokenomics explained", href: "/learn/tokenomics-explained" }],
      },
      {
        question: "Is there a maximum supply?",
        answer:
          "No fixed maximum and zero initial supply. New tokens issue only through verified human identities, with continued issuance as new identities are verified and the verified population grows.",
      },
      {
        question: "What still needs work here?",
        answer:
          "The in-repo simulation framework (pkg/economics) carries legacy inflation assumptions and requires alignment before it can validate the proposed policy — stated openly so analysts price the uncertainty correctly.",
      },
    ],
  },
  {
    slug: "staking",
    path: "x/staking",
    name: "Staking",
    domain: "Economics & settlement",
    summary: "Validator staking extensions over Cosmos SDK staking, tuned for the dual validator role.",
    whatItDoes: [
      "The staking module extends Cosmos SDK staking for VirtEngine's needs. Bonded stake weights consensus voting power under CometBFT, and slashing applies to protocol misbehavior. Unbonding and reward parameters are governance-controlled.",
      "VirtEngine validators can participate in both consensus and the VEID Network. Staking rewards remain but are proposed at roughly 90% lower than the prior model; compensation, commission and conditions are governed protocol parameters.",
    ],
    whyItExists:
      "Proof-of-stake security is only as strong as the incentive to bond. The extended staking module ties security funding to a self-balancing feedback loop, and compensates the identity-network work that makes VirtEngine's validator role unique.",
    interactions: [
      { slug: "delegation", label: "x/delegation", how: "Delegators bond stake to validators through the delegation lifecycle." },
      { slug: "veid", label: "x/veid", how: "Validators may participate in VEID identity scoring under the governed incentive policy." },
      { slug: "bme", label: "x/bme", how: "Issuance mechanics fund the reward schedule." },
      { slug: "issuancepolicy", label: "x/issuancepolicy", how: "Reward issuance operates under governed policy." },
    ],
    concepts: [
      { term: "Bonded stake", def: "Tokens locked to a validator, weighting its consensus vote and earning rewards." },
      { term: "Unbonding period", def: "The 21-day exit delay during which stake earns nothing and remains slashable." },
      { term: "Identity-led issuance", def: "A proposed allocation for accounts meeting the network-defined unique-identity threshold and activity conditions." },
    ],
    media: "staking-security",
    mediaCaption: "Bonded stake, slashing in writing.",
    glance: [
      {
        kicker: "Bond",
        title: "Stake weights consensus",
        body: "Bonded tokens weight CometBFT voting power and earn rewards — security funded by commitment.",
      },
      {
        kicker: "Dual",
        title: "Consensus plus identity",
        body: "Validators may also score VEID identity under the governed incentive policy — one stake, layered duties.",
      },
      {
        kicker: "Bound",
        title: "21 days to exit",
        body: "Unbonding earns nothing and remains slashable for prior offenses — a protocol parameter, not a promise.",
      },
    ],
    flow: [
      {
        label: "Bond",
        title: "Stake bonds to validators",
        body: "Directly or via delegation, tokens lock and weight consensus power under CometBFT.",
      },
      {
        label: "Validate",
        title: "Duties execute",
        body: "Consensus participation plus optional VEID identity scoring under the governed incentive policy.",
      },
      {
        label: "Reward",
        title: "Issuance funds rewards",
        body: "Reward schedules run under governed policy at the proposed conservative level — roughly 90% lower than the prior model.",
      },
      {
        label: "Exit",
        title: "Unbond or redelegate",
        body: "Twenty-one days to exit; redelegation moves weight between validators without a full unbonding cycle.",
      },
    ],
    faqs: [
      {
        question: "What is bonded stake?",
        answer:
          "Tokens locked to a validator, weighting its consensus vote and earning rewards — the capital commitment that secures the chain.",
      },
      {
        question: "How do VEID rewards work for validators?",
        answer:
          "Validators participating in identity scoring earn under the governed incentive policy — conservative, governance-controlled, with no fixed pool promised.",
        links: [{ label: "What is VEID?", href: "/learn/what-is-veid" }],
      },
      {
        question: "What is identity-led issuance?",
        answer:
          "A proposed allocation for accounts meeting the network-defined unique-identity threshold and activity conditions — issuance that follows verified humans.",
        links: [{ label: "x/issuancepolicy module", href: "/modules/issuancepolicy" }],
      },
    ],
  },
  {
    slug: "delegation",
    path: "x/delegation",
    name: "Delegation",
    domain: "Economics & settlement",
    summary: "The full delegation lifecycle for token holders and staking partners.",
    whatItDoes: [
      "The delegation module manages how token holders place stake with validators without running infrastructure themselves: delegating, redelegating between validators, unbonding, and collecting the delegator share of rewards net of validator commission.",
      "Delegation grants voting weight, not custody — tokens remain the delegator's throughout. The module gives staking-as-a-service partners a complete on-chain lifecycle to build client offerings on.",
    ],
    whyItExists:
      "Most token holders will never run a validator, but the network still needs their stake bonded for security. A first-class delegation lifecycle turns passive holders into security contributors — and spreads stake across more validators, strengthening the Nakamoto coefficient.",
    interactions: [
      { slug: "staking", label: "x/staking", how: "Delegated stake bonds to validators and weights consensus power." },
      { slug: "veid", label: "x/veid", how: "Delegators share in validator income that includes VEID rewards." },
    ],
    concepts: [
      { term: "Delegation", def: "Bonding your tokens to a validator's stake in exchange for a share of its rewards." },
      { term: "Commission", def: "The validator's percentage cut of rewards before the delegator share is distributed." },
      { term: "Redelegation", def: "Moving bonded stake between validators without a full unbonding cycle." },
    ],
    media: "closing-hands",
    mediaCaption: "Stake entrusted, rewards shared.",
    glance: [
      {
        kicker: "Access",
        title: "Security without servers",
        body: "Holders bond stake to validators without running infrastructure — passive capital becomes active security.",
      },
      {
        kicker: "Custody",
        title: "Weight, never custody",
        body: "Tokens remain the delegator's throughout the lifecycle. Delegation grants voting weight, nothing more.",
      },
      {
        kicker: "Spread",
        title: "Decentralization by default",
        body: "Broad delegation across validators strengthens the Nakamoto coefficient — spread stake, strengthen the chain.",
      },
    ],
    flow: [
      {
        label: "Delegate",
        title: "Bond to a validator",
        body: "Choose on quality — uptime, self-bond, commission, governance participation — and delegate.",
      },
      {
        label: "Earn",
        title: "Collect net of commission",
        body: "The delegator share of block, VEID, and uptime rewards arrives minus the validator's cut.",
      },
      {
        label: "Move",
        title: "Redelegate freely",
        body: "Shift bonded stake between validators without sitting out a full unbonding cycle.",
      },
      {
        label: "Exit",
        title: "Unbond when done",
        body: "Twenty-one days, no earnings, still slashable for prior offenses — plan exits around the window.",
      },
    ],
    faqs: [
      {
        question: "What is delegation?",
        answer:
          "Bonding your tokens to a validator's stake in exchange for a share of its rewards — the way most holders participate in security.",
      },
      {
        question: "What is commission?",
        answer:
          "The validator's percentage cut of rewards before the delegator share is distributed. Low commission means little if uptime is poor — select on quality first.",
      },
      {
        question: "What is redelegation?",
        answer:
          "Moving bonded stake between validators without a full unbonding cycle — repositioning without the 21-day wait.",
        links: [{ label: "x/staking module", href: "/modules/staking" }],
      },
    ],
  },
  {
    slug: "issuancepolicy",
    path: "x/issuancepolicy",
    name: "Issuance Policy",
    domain: "Economics & settlement",
    summary: "Governed controls over how and when new tokens are issued.",
    whatItDoes: [
      "The issuancepolicy module encodes the rules under which new tokens may be minted: schedules, safeguards and policy parameters that staking and identity allocations must respect. The proposed issuance model uses VEID-led 15-token issuance batches: 14 tokens to eligible active verified humans and 1 token to the Foundation-controlled genesis account. All policy lives in chain state and can be changed through consensus.",
      "Because policy is a module, changing issuance rules is a governance act with a public proposal trail, not a quiet parameter edit.",
    ],
    whyItExists:
      "Monetary credibility requires that issuance be rule-bound and visible. Separating the policy (what may be minted) from the mechanics (how minting executes) means the rules can be audited and governed independently of the machinery.",
    interactions: [
      { slug: "bme", label: "x/bme", how: "Mint schedules execute within policy bounds." },
      { slug: "staking", label: "x/staking", how: "Reward issuance is constrained by governed policy." },
      { slug: "config", label: "x/config", how: "Policy parameters are part of governed chain configuration." },
    ],
    concepts: [
      { term: "Issuance schedule", def: "The governed timetable and limits under which new supply may be minted." },
      { term: "Max supply", def: "No fixed maximum or hard cap. Initial supply is zero; new tokens are issued only through verified human identities, with continued issuance as new identities are verified and the human population grows." },
    ],
    media: "learn-library",
    mediaCaption: "Mint schedules under governed policy.",
    glance: [
      {
        kicker: "Rules",
        title: "What may be minted",
        body: "Schedules, safeguards, and parameters that staking and identity allocations must respect — all in chain state.",
      },
      {
        kicker: "Batches",
        title: "VEID-led 15-token path",
        body: "Proposed: 14 tokens to eligible active verified humans and 1 to the Foundation genesis account, as entitlement accrues.",
      },
      {
        kicker: "Trail",
        title: "Changes are proposals",
        body: "Policy changes carry a public governance trail with open debate — never a quiet parameter edit.",
      },
    ],
    flow: [
      {
        label: "Encode",
        title: "Policy becomes state",
        body: "Issuance rules live in chain state, auditable by anyone, changeable only through consensus.",
      },
      {
        label: "Constrain",
        title: "Mechanics obey bounds",
        body: "BME mint schedules and staking rewards execute within the policy's schedules and safeguards.",
      },
      {
        label: "Propose",
        title: "Changes go public",
        body: "New schedules arrive as governance proposals with open debate and stakeholder vote.",
      },
      {
        label: "Enact",
        title: "Consensus adopts",
        body: "Approved policy activates through the normal upgrade path, with the trail preserved on-chain.",
      },
    ],
    faqs: [
      {
        question: "What is an issuance schedule?",
        answer:
          "The governed timetable and limits under which new supply may be minted — the temporal bounds every minting path must respect.",
      },
      {
        question: "Is there a maximum supply?",
        answer:
          "No fixed maximum or hard cap. Initial supply is zero, and new tokens issue only through verified human identities as the verified population grows.",
        links: [{ label: "Tokenomics explained", href: "/learn/tokenomics-explained" }],
      },
      {
        question: "Why separate policy from mechanics?",
        answer:
          "So the rules can be audited and governed independently of the minting machinery — monetary credibility requires issuance to be rule-bound and visible.",
        links: [{ label: "x/bme module", href: "/modules/bme" }],
      },
    ],
  },
  {
    slug: "oracle",
    path: "x/oracle",
    name: "Oracle",
    domain: "Economics & settlement",
    summary: "External price and data feeds brought on-chain for pricing and policy.",
    whatItDoes: [
      "The oracle module brings external data — token prices, reference exchange rates — into chain state where economic logic can use it. Feeds are submitted, validated, and stored so that modules pricing marketplace services or evaluating policy have a consensus-visible data source.",
      "Oracle design constrains manipulation: submissions are permissioned and validated rather than free-for-all, because a corrupted price feed corrupts everything priced by it.",
    ],
    whyItExists:
      "A marketplace that prices real-world compute in a volatile token needs a trustworthy bridge to external prices. Doing that bridging in a dedicated, auditable module keeps a sensitive dependency contained and governable.",
    interactions: [
      { slug: "settlement", label: "x/settlement", how: "Fiat-referenced pricing resolves through oracle rates." },
      { slug: "bme", label: "x/bme", how: "Supply mechanics can reference oracle-reported market conditions." },
      { slug: "market", label: "x/market", how: "Bid pricing strategies can anchor to oracle-published references." },
    ],
    concepts: [
      { term: "Feed", def: "A stream of externally-sourced values validated into chain state." },
      { term: "Oracle risk", def: "The exposure created when on-chain logic depends on off-chain data quality." },
    ],
    media: "network-earth",
    mediaCaption: "Outside prices, brought on chain.",
    glance: [
      {
        kicker: "Bridge",
        title: "Outside data, inside consensus",
        body: "Token prices and reference rates become chain-visible state that economic logic can safely consume.",
      },
      {
        kicker: "Guard",
        title: "Permissioned, validated feeds",
        body: "Submissions are validated, not free-for-all — a corrupted feed would corrupt everything priced by it.",
      },
      {
        kicker: "Use",
        title: "Pricing and policy",
        body: "Fiat-referenced settlement, bid strategies, and supply mechanics all resolve through oracle rates.",
      },
    ],
    flow: [
      {
        label: "Submit",
        title: "Feeds are submitted",
        body: "Permissioned sources publish token prices and reference rates on a schedule.",
      },
      {
        label: "Validate",
        title: "Values are checked",
        body: "Submissions pass validation before entering state — the guardrail against corrupted data.",
      },
      {
        label: "Store",
        title: "Rates become state",
        body: "Consensus-visible data that any module can reference deterministically.",
      },
      {
        label: "Price",
        title: "Logic consumes",
        body: "Settlement conversions, bid anchors, and policy inputs resolve through stored rates.",
      },
    ],
    faqs: [
      {
        question: "What is a feed?",
        answer:
          "A stream of externally-sourced values — token prices, reference exchange rates — validated into chain state on a schedule.",
      },
      {
        question: "What is oracle risk?",
        answer:
          "The exposure created when on-chain logic depends on off-chain data quality. This module contains it by design: permissioned submissions, validation before storage, and a governable dependency surface.",
      },
      {
        question: "Which modules read oracle data?",
        answer:
          "Settlement for fiat-referenced pricing, market participants anchoring bid strategies, and supply mechanics referencing market conditions.",
        links: [{ label: "x/settlement module", href: "/modules/settlement" }],
      },
    ],
  },

  // ───────────────────────── Quality & governance ─────────────────────────
  {
    slug: "audit",
    path: "x/audit",
    name: "Audit",
    domain: "Quality & governance",
    summary: "Auditor-signed provider attributes that upgrade self-claims into attestations.",
    whatItDoes: [
      "The audit module lets recognized auditors sign provider attributes on-chain. A provider may claim any attribute — region, datacenter tier, compliance posture — but an auditor's signature turns the claim into an attestation a tenant can weight accordingly: orders can require attributes signed by specific auditors.",
      "Attestations are revocable and auditable themselves, so audit trust is traceable to accountable, identity-verified signers rather than to an anonymous badge.",
    ],
    whyItExists:
      "Self-reported quality is worth little in an anonymous marketplace. An on-chain attestation layer imports the assurance model of real procurement — independent verification — without importing a centralized gatekeeper.",
    interactions: [
      { slug: "provider", label: "x/provider", how: "Attestations attach to provider attribute records." },
      { slug: "market", label: "x/market", how: "Orders can require auditor-signed attributes for placement." },
      { slug: "roles", label: "x/roles", how: "Auditor status is an on-chain role with defined capabilities." },
      { slug: "veid", label: "x/veid", how: "Auditors are identity-verified participants with accountable standing." },
    ],
    concepts: [
      { term: "Attestation", def: "An auditor's on-chain signature over a provider's claimed attribute." },
      { term: "Audited placement", def: "An order constraint requiring attributes signed by trusted auditors." },
    ],
    media: "provider-technician",
    mediaCaption: "Claims inspect a second time — by someone accountable.",
    glance: [
      {
        kicker: "Upgrade",
        title: "Self-claims become attestations",
        body: "A provider may claim any attribute; an auditor's signature turns it into something tenants can weight.",
      },
      {
        kicker: "Require",
        title: "Orders can demand signatures",
        body: "Placement constraints can require attributes signed by specific auditors — audited capacity only.",
      },
      {
        kicker: "Trace",
        title: "Trust traced to people",
        body: "Attestations are revocable, and auditor status is an on-chain role held by identity-verified signers.",
      },
    ],
    flow: [
      {
        label: "Claim",
        title: "Provider claims attributes",
        body: "Region, datacenter tier, compliance posture — asserted on the provider record.",
      },
      {
        label: "Inspect",
        title: "An auditor verifies",
        body: "A recognized, identity-verified auditor inspects the claim against reality.",
      },
      {
        label: "Sign",
        title: "The attestation lands",
        body: "An on-chain signature upgrades the claim into an attestation tenants can require.",
      },
      {
        label: "Revoke",
        title: "Standing is revocable",
        body: "Attestations remain auditable and revocable, traceable to accountable signers.",
      },
    ],
    faqs: [
      {
        question: "What is an attestation?",
        answer:
          "An auditor's on-chain signature over a provider's claimed attribute — the difference between \"trust us\" and \"a verified party checked\".",
      },
      {
        question: "Who can be an auditor?",
        answer:
          "Holders of the auditor role — an on-chain role with defined capabilities, held by VEID-verified participants with accountable standing.",
        links: [{ label: "x/roles module", href: "/modules/roles" }],
      },
      {
        question: "How do tenants use attestations?",
        answer:
          "Through audited placement constraints: orders can require specific attributes signed by trusted auditors, so only verified claims match.",
      },
    ],
  },
  {
    slug: "benchmark",
    path: "x/benchmark",
    name: "Benchmark",
    domain: "Quality & governance",
    summary: "On-chain hardware benchmarking records that ground offers in measured performance.",
    whatItDoes: [
      "The benchmark module stores hardware performance measurements tied to provider records — compute throughput, memory bandwidth, storage and network performance — so that tenants can compare providers on measured capability rather than marketing copy.",
      "Published benchmarks make the marketplace's abstract resource units concrete: the same \"unit\" of compute can be qualified by what the underlying hardware actually measures.",
    ],
    whyItExists:
      "Price-per-unit is meaningless if units hide wildly different hardware. Benchmarks are the marketplace's answer to performance information asymmetry — the data that lets price competition operate on real value.",
    interactions: [
      { slug: "provider", label: "x/provider", how: "Benchmark records attach to the provider's on-chain identity." },
      { slug: "resources", label: "x/resources", how: "Measurements ground the shared resource-unit vocabulary." },
      { slug: "market", label: "x/market", how: "Tenants weigh benchmark data when selecting bids." },
    ],
    concepts: [
      { term: "Benchmark record", def: "A published measurement of provider hardware performance, tied to its record." },
    ],
    media: "marketplace-hardware",
    mediaCaption: "Measured performance, not marketing copy.",
    glance: [
      {
        kicker: "Measure",
        title: "Hardware, actually measured",
        body: "Throughput, memory bandwidth, storage and network performance — recorded on-chain against the provider record.",
      },
      {
        kicker: "Compare",
        title: "Offers compete on evidence",
        body: "Tenants weigh measured capability when selecting bids, so price competition operates on real value.",
      },
      {
        kicker: "Ground",
        title: "Abstract units made concrete",
        body: "Benchmarks qualify shared resource units with what the underlying hardware actually does.",
      },
    ],
    flow: [
      {
        label: "Run",
        title: "Hardware is benchmarked",
        body: "Standard performance tests run against the operator's actual machines.",
      },
      {
        label: "Publish",
        title: "Records go on-chain",
        body: "Measurements attach to the provider's on-chain identity, visible to every tenant.",
      },
      {
        label: "Qualify",
        title: "Units gain meaning",
        body: "Shared resource units are grounded in measured hardware — same unit, verifiable capability.",
      },
      {
        label: "Select",
        title: "Bids compete on data",
        body: "Tenants weigh benchmark records when choosing between competing offers.",
      },
    ],
    faqs: [
      {
        question: "What is a benchmark record?",
        answer:
          "A published measurement of provider hardware performance, tied to its on-chain record — the marketplace's answer to performance information asymmetry.",
      },
      {
        question: "Why do benchmarks matter for pricing?",
        answer:
          "Price-per-unit is meaningless if units hide wildly different hardware. Benchmarks let price competition operate on measured value instead of spec-sheet theater.",
        links: [{ label: "x/resources module", href: "/modules/resources" }],
      },
      {
        question: "How do tenants use benchmark data?",
        answer:
          "As a selection signal: when comparing bids, measured performance qualifies the abstract resource units each offer proposes.",
        links: [{ label: "How the marketplace works", href: "/learn/how-the-marketplace-works" }],
      },
    ],
  },
  {
    slug: "review",
    path: "x/review",
    name: "Review",
    domain: "Quality & governance",
    summary: "Tenant–provider reviews building portable, tamper-evident reputation.",
    whatItDoes: [
      "The review module records reviews between lease counterparties: tenants review providers on delivery quality, and provider-side standing accumulates into a reputation that is portable across the whole marketplace and tamper-evident by construction — reviews are chain state tied to real leases.",
      "Because a review requires an underlying lease, reputation cannot be fabricated by sockpuppet accounts at scale; combined with VEID identity gating, review farming is structurally expensive.",
    ],
    whyItExists:
      "Repeat-game trust is what makes marketplaces work, and centralized platforms hold that trust hostage — leave the platform, lose your reputation. On-chain reviews make track records a public good owned by the participant who earned them.",
    interactions: [
      { slug: "market", label: "x/market", how: "Reviews attach to completed leases between real counterparties." },
      { slug: "veid", label: "x/veid", how: "Identity gating makes review manipulation costly." },
      { slug: "marketplace", label: "x/marketplace", how: "Reputation signals inform offer presentation and choice." },
    ],
    concepts: [
      { term: "Lease-bound review", def: "A review permitted only between actual counterparties of a real lease." },
      { term: "Portable reputation", def: "Track record held as chain state, not as a platform's private asset." },
    ],
    media: "closing-hands",
    mediaCaption: "Reputation earned between real counterparties.",
    glance: [
      {
        kicker: "Bound",
        title: "Reviews need real leases",
        body: "Only counterparties to an actual lease can review — sockpuppet reputation is structurally off the table.",
      },
      {
        kicker: "Portable",
        title: "Yours, not the platform's",
        body: "Standing is chain state: leave any interface, keep every earned review.",
      },
      {
        kicker: "Gated",
        title: "Identity makes farming costly",
        body: "VEID gating combined with lease-binding makes manufactured reputation expensive to attempt.",
      },
    ],
    flow: [
      {
        label: "Serve",
        title: "A lease completes",
        body: "Delivery happened between verifiable counterparties — the precondition for any review.",
      },
      {
        label: "Review",
        title: "Both sides rate",
        body: "Tenants review providers on delivery quality; providers review tenants on conduct.",
      },
      {
        label: "Record",
        title: "Reviews become state",
        body: "Tamper-evident, tied to the lease, and visible across the whole marketplace.",
      },
      {
        label: "Compound",
        title: "Standing compounds",
        body: "Accumulated reputation feeds offer presentation and tenant choice — portability included.",
      },
    ],
    faqs: [
      {
        question: "What is a lease-bound review?",
        answer:
          "A review permitted only between actual counterparties of a real lease — the constraint that anchors reputation to delivery.",
      },
      {
        question: "Can reputation be faked?",
        answer:
          "Not at scale. Reviews require an underlying lease, and VEID identity gating makes review farming structurally expensive — repeat-game trust, protocol-enforced.",
      },
      {
        question: "What does portable reputation mean?",
        answer:
          "Your track record lives in chain state rather than a platform's database: switch interfaces or providers and your earned standing travels with you.",
        links: [{ label: "How the marketplace works", href: "/learn/how-the-marketplace-works" }],
      },
    ],
  },
  {
    slug: "support",
    path: "x/support",
    name: "Support",
    domain: "Quality & governance",
    summary: "Support and dispute intake flows for marketplace participants.",
    whatItDoes: [
      "The support module provides the on-chain intake path for problems: tickets and disputes raised against leases, usage records, or counterparties, tracked as state with defined lifecycles rather than emails into a void.",
      "It is the front door of the dispute machinery — settlement's 24-hour dispute window, fraud escalation, and correction flows all connect to intake records created here.",
    ],
    whyItExists:
      "Decentralization removes the support desk, but not the need for recourse. Structured, on-chain intake gives every participant a visible, non-discretionary path to raise problems — and gives the protocol's dispute rules something concrete to operate on.",
    interactions: [
      { slug: "settlement", label: "x/settlement", how: "Usage disputes raised in the window flow through intake records." },
      { slug: "fraud", label: "x/fraud", how: "Misconduct allegations escalate from support to fraud handling." },
      { slug: "market", label: "x/market", how: "Disputes reference the leases they concern." },
    ],
    concepts: [
      { term: "Dispute intake", def: "The structured on-chain record opening a dispute with lifecycle tracking." },
    ],
    media: "provider-datacenter",
    mediaCaption: "Recourse with a lifecycle, not an inbox.",
    glance: [
      {
        kicker: "Intake",
        title: "Tickets as state",
        body: "Problems raised against leases, usage records, or counterparties become tracked records with defined lifecycles.",
      },
      {
        kicker: "Front door",
        title: "Where disputes begin",
        body: "The 24-hour settlement window, fraud escalation, and correction flows all connect back to intake created here.",
      },
      {
        kicker: "Recourse",
        title: "Non-discretionary by design",
        body: "Decentralization removes the support desk, not the need for a visible path — every participant gets one.",
      },
    ],
    flow: [
      {
        label: "Raise",
        title: "A problem is filed",
        body: "Tickets and disputes open against the lease, record, or counterparty concerned.",
      },
      {
        label: "Track",
        title: "The record lives",
        body: "Defined lifecycles replace emails into a void — status and history are visible state.",
      },
      {
        label: "Route",
        title: "It reaches the right machinery",
        body: "Usage disputes meet the settlement window; misconduct allegations escalate to fraud handling.",
      },
      {
        label: "Resolve",
        title: "Outcomes are recorded",
        body: "Resolutions, corrections, and escalations leave an auditable trail for all parties.",
      },
    ],
    faqs: [
      {
        question: "What is dispute intake?",
        answer:
          "The structured on-chain record opening a dispute, with lifecycle tracking from filing through resolution — the front door of the protocol's dispute machinery.",
      },
      {
        question: "How does this connect to settlement?",
        answer:
          "Usage disputes raised inside the 24-hour window flow through intake records; corrections and holds attach to them before payout completes.",
        links: [{ label: "x/settlement module", href: "/modules/settlement" }],
      },
      {
        question: "What if the problem is misconduct?",
        answer:
          "Misconduct allegations escalate from support to fraud handling, where enforcement hooks can restrict participation pending adjudication.",
        links: [{ label: "x/fraud module", href: "/modules/fraud" }],
      },
    ],
  },
  {
    slug: "config",
    path: "x/config",
    name: "Config",
    domain: "Quality & governance",
    summary: "Governed chain-level configuration — including the approved-client list.",
    whatItDoes: [
      "The config module holds chain-level configuration as governed state. Its highest-stakes entry is the approved-client list: the set of client interfaces permitted to submit identity data into VEID. Validators verify that identity submissions originate from an approved client and carry the user's signature before scoring them.",
      "Other operational parameters live here too, so that \"how the chain is configured\" is always a queryable, proposal-governed fact rather than an operator convention.",
    ],
    whyItExists:
      "The security of the identity pipeline depends on the integrity of capture software. Governing the approved-client list on-chain puts that trust decision where it belongs — with the network's stakeholders, under public proposal and vote — instead of with any single party.",
    interactions: [
      { slug: "veid", label: "x/veid", how: "Identity submissions are accepted only from approved clients." },
      { slug: "roles", label: "x/roles", how: "Configuration changes require authorized roles and governance." },
      { slug: "issuancepolicy", label: "x/issuancepolicy", how: "Economic policy parameters live alongside operational config." },
    ],
    concepts: [
      { term: "Approved client", def: "A governance-vetted client interface permitted to submit identity data." },
      { term: "Governed parameter", def: "A configuration value changeable only by on-chain proposal and vote." },
    ],
    media: "network-earth",
    mediaCaption: "The chain's dials, governed in public.",
    glance: [
      {
        kicker: "List",
        title: "The approved-client list",
        body: "Only governance-vetted client interfaces may submit identity data — validators check origin and signature before scoring.",
      },
      {
        kicker: "State",
        title: "Configuration as queryable fact",
        body: "How the chain is configured is chain state — never an operator convention hidden in a config file.",
      },
      {
        kicker: "Vote",
        title: "Changes need governance",
        body: "Approved clients and operational parameters move only by public proposal and stakeholder vote.",
      },
    ],
    flow: [
      {
        label: "Propose",
        title: "A change is proposed",
        body: "Adding an approved client or adjusting a parameter opens a public governance proposal.",
      },
      {
        label: "Vote",
        title: "Stakeholders decide",
        body: "The network's stakeholders vote — the trust decision sits with them, not with any single party.",
      },
      {
        label: "Store",
        title: "Config lands in state",
        body: "The approved list and parameters become queryable chain state that enforcement reads.",
      },
      {
        label: "Enforce",
        title: "Validator checks apply",
        body: "Identity submissions failing the approved-client and signature checks are rejected before scoring.",
      },
    ],
    faqs: [
      {
        question: "What is the approved-client list?",
        answer:
          "The set of client interfaces permitted to submit identity data into VEID — a governance-vetted list, because the security of the identity pipeline depends on the integrity of capture software.",
      },
      {
        question: "Why does client approval live on-chain?",
        answer:
          "It puts the trust decision where it belongs — with the network's stakeholders, under public proposal and vote — rather than with any single party distributing capture apps.",
        links: [{ label: "x/veid module", href: "/modules/veid" }],
      },
      {
        question: "What else is governed here?",
        answer:
          "Operational parameters across the chain, so configuration is always a queryable, proposal-governed fact — role-authorized and, where required, MFA-protected.",
        links: [{ label: "Governance guide", href: "/learn/governance-guide" }],
      },
    ],
  },
];

export function getModule(slug: string): ModuleEntry | undefined {
  return MODULES.find((m) => m.slug === slug);
}

export function modulesByDomain(domain: ModuleDomain): ModuleEntry[] {
  return MODULES.filter((m) => m.domain === domain);
}
