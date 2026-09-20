/**
 * Canonical marketplace marketing model.
 *
 * ACQUISITION_PATHS: the three ways an order can reach a match on-chain.
 * Direct is the default; bid and selector are opt-in. Every path resolves
 * deterministically on-chain and settles through the same escrow rail.
 *
 * SERVICE_CATEGORIES: the service delivery models the Waldur catalogue can
 * publish and the chain can settle — infrastructure, platforms, software and
 * provider-defined custom listings.
 */

export interface AcquisitionPath {
  id: "direct" | "bid" | "selector";
  n: string;
  tab: string;
  tag: string;
  title: string;
  /** One-sentence summary used by compact surfaces (hero figure). */
  short: string;
  body: string;
  steps: [string, string][];
  when: string;
  /** Where this path is explained in full. */
  href: string;
}

export const ACQUISITION_PATHS: AcquisitionPath[] = [
  {
    id: "direct",
    n: "01",
    tab: "Direct order",
    tag: "Default · listed price",
    title: "Name the listing. Buy at the published price.",
    short: "Take a provider's published plan. The order names that listing and matches at its price.",
    href: "/waldur",
    body: "Pick a provider's offering and plan from the catalogue and order it directly. The order names that exact listing, matches without a bidding window, and becomes a lease backed by escrow. This is the default path — and the right one for most purchases.",
    steps: [
      ["Pick", "offering + plan"],
      ["Order", "names that listing"],
      ["Match", "at the listed price"],
      ["Run", "provision · meter · settle"],
    ],
    when: "Published plans from providers you have chosen — compute, SaaS seats, support, anything with a price list.",
  },
  {
    id: "bid",
    n: "02",
    tab: "Open bid",
    tag: "Opt-in · price discovery",
    title: "Post what you need. Providers compete on price.",
    short: "Open the order to a bidding window. Providers compete; you accept one, or the engine resolves the best.",
    href: "/solutions/cost-optimized-cloud",
    body: "Open your order to a bidding window and let eligible providers offer prices. Accept a bid yourself, or let the matching engine take the best-ranked offer when the window closes. Use it for fungible capacity where competition should set the price.",
    steps: [
      ["Post", "specs + max price + window"],
      ["Bids", "providers offer openly"],
      ["Accept", "you pick, or auto-resolve"],
      ["Run", "provision · meter · settle"],
    ],
    when: "Commodity or spot capacity — GPU-hours, bulk compute — where price discovery beats a price list.",
  },
  {
    id: "selector",
    n: "03",
    tab: "Selector",
    tag: "Attribute matching",
    title: "State the requirements. Get matched to eligible listings.",
    short: "Describe category, region, specs and a price cap. The engine matches the best eligible listing.",
    href: "/learn/how-the-marketplace-works",
    body: "Instead of naming a provider, describe the category, region, minimum specifications and maximum price. The engine filters to eligible listings and matches deterministically within your cap — request-for-quote semantics without the negotiation round-trip.",
    steps: [
      ["Describe", "category · region · specs · cap"],
      ["Filter", "eligible listings only"],
      ["Match", "lowest eligible price ≤ cap"],
      ["Run", "provision · meter · settle"],
    ],
    when: "Constrained workloads where the fit matters more than the vendor name.",
  },
];

export interface ServiceCategory {
  id: ServiceModelId;
  label: string;
  name: string;
  body: string;
  examples: string[];
  billing: string;
  delivery: string;
}

/* ------------------------------------------------------------------ *
 * Service-model atlas
 *
 * One canonical model of everything the catalogue can sell and the
 * chain can settle. The marketplace hub grid, the service-model atlas,
 * the dedicated /marketplace/* pages and the Learn cards all read from
 * this array so a category cannot mean one thing in the nav and another
 * on a page.
 *
 * Example listings are fictional and always rendered with an
 * "Illustrative example" label. Provider names are neutral by design:
 * no example may look like a live network participant.
 * ------------------------------------------------------------------ */

export type ServiceModelId =
  | "iaas"
  | "paas"
  | "saas"
  | "hpc"
  | "gpu"
  | "storage"
  | "managed"
  | "custom";

export interface ServiceModelListing {
  /** Category tag on the card, e.g. "IaaS". */
  serviceType: string;
  title: string;
  provider: string;
  region: string;
  /** Short specification lines. */
  specs: string[];
  /** Billing components, e.g. "GPU-hour". */
  components: string[];
  priceLabel: string;
  badges: string[];
}

export interface ServiceModel {
  id: ServiceModelId;
  /** Short tab label, e.g. "IaaS". */
  label: string;
  /** Hub-grid / page title, e.g. "Infrastructure as a Service". */
  title: string;
  /** Hub-card subtitle: one clause, no full stop required. */
  subtitle: string;
  /** Short paragraph (<= 60 words) for pages that need prose. */
  summary: string;
  examples: string[];
  billingModels: string[];
  /** Backends a provider integration can fulfil this model with. */
  fulfilmentTargets: string[];
  /** Example catalogue card — illustrative, never a live listing. */
  listing: ServiceModelListing;
  /** Fulfilment flow node labels, rendered by FulfilmentFlow. */
  flow: string[];
  flowCaption: string;
  /** Dedicated page, or a section anchor where no page exists yet. */
  route: string;
  cta: string;
  related: { label: string; href: string }[];
}

export const SERVICE_MODELS: ServiceModel[] = [
  {
    id: "iaas",
    label: "IaaS",
    title: "Infrastructure as a Service",
    subtitle: "Infrastructure you control.",
    summary:
      "Rented infrastructure, from virtual machines and private clouds to Kubernetes infrastructure, bare-metal nodes, GPU fleets, HPC allocations, storage and network capacity. The provider operates the hypervisor, cloud or cluster; the lease records the commercial relationship and signed usage settles it.",
    examples: [
      "Virtual machines",
      "Private cloud",
      "Bare metal",
      "GPU nodes",
      "Kubernetes infrastructure",
      "Block storage",
      "Network capacity",
    ],
    billingModels: [
      "Published fixed plan",
      "Component-based limits or metered usage",
      "Reserved allocation",
      "Competitive bid for suitable workloads",
    ],
    fulfilmentTargets: ["OpenStack", "VMware", "Kubernetes / Rancher where applicable", "Provider custom integration"],
    listing: {
      serviceType: "IaaS",
      title: "GPU Virtual Machine",
      provider: "Example Provider",
      region: "Sydney · AU",
      specs: ["8 vCPU", "64 GB RAM", "1 × GPU", "1 TB block storage"],
      components: ["GPU-hour", "storage GB-month"],
      priceLabel: "$0.39 / GPU-hour",
      badges: ["audited", "benchmarked"],
    },
    flow: [
      "Catalogue listing",
      "Order",
      "Lease",
      "Provider daemon",
      "Waldur / provider API",
      "OpenStack · VMware · cloud",
      "VM · network · storage",
      "Usage",
      "Settlement",
    ],
    flowCaption:
      "The chain records the agreement; the provider's control plane and backend create the machine. Consensus does not provision hardware.",
    route: "/marketplace/iaas",
    cta: "Explore IaaS",
    related: [
      { label: "GPU & AI compute", href: "/marketplace/gpu-compute" },
      { label: "HPC & batch", href: "/marketplace/hpc" },
      { label: "How marketplace orders work", href: "/learn/how-the-marketplace-works" },
      { label: "Waldur integration", href: "/waldur" },
    ],
  },
  {
    id: "paas",
    label: "PaaS",
    title: "Platform as a Service",
    subtitle: "Managed platforms you deploy onto.",
    summary:
      "Managed platforms ordered per project rather than per server: container orchestration, databases, AI/ML runtimes, inference endpoints and batch platforms. The provider operates the platform and its lifecycle; VirtEngine records the market agreement and settles component usage.",
    examples: [
      "Managed Kubernetes",
      "Managed databases",
      "Inference endpoints",
      "ML workspaces",
      "Application runtimes",
      "Batch platforms",
    ],
    billingModels: [
      "Per-component limits",
      "Metered platform usage",
      "Seat or workspace plans",
      "Reserved capacity",
    ],
    fulfilmentTargets: ["Waldur service plugins", "Rancher / Kubernetes", "Provider software catalogues", "Provider custom integration"],
    listing: {
      serviceType: "PaaS",
      title: "Managed Kubernetes",
      provider: "Example Provider",
      region: "ap-southeast",
      specs: ["3 control-plane nodes", "Autoscaling workers", "Managed upgrades"],
      components: ["vCPU-hour", "RAM GB-hour", "storage GB-month"],
      priceLabel: "Component-priced plan",
      badges: ["managed lifecycle"],
    },
    flow: [
      "Managed service plan",
      "Order",
      "Lease",
      "Provider integration",
      "Managed platform",
      "Platform endpoint",
      "Component usage",
      "Settlement",
    ],
    flowCaption:
      "The provider runs the platform. VirtEngine supplies identity, the market agreement and settlement — it does not operate the database or cluster.",
    route: "/marketplace/paas",
    cta: "Explore PaaS",
    related: [
      { label: "IaaS vs PaaS vs SaaS", href: "/learn/iaas-paas-saas-on-virtengine" },
      { label: "Custom listings", href: "/marketplace/custom-listings" },
      { label: "Waldur integration", href: "/waldur" },
      { label: "How marketplace orders work", href: "/learn/how-the-marketplace-works" },
    ],
  },
  {
    id: "saas",
    label: "SaaS",
    title: "Software as a Service",
    subtitle: "Software delivered as a plan.",
    summary:
      "Software sold as plans: seats, licences, subscriptions and hosted applications. A listing can represent access to a service the provider already operates — fulfilment does not have to deploy a virtual machine. The catalogue and settlement rail are the same as for infrastructure.",
    examples: [
      "Software subscriptions",
      "Seats",
      "Licences",
      "Hosted applications",
      "Support packages",
    ],
    billingModels: [
      "Fixed monthly plan",
      "Per seat",
      "Prepaid term",
      "Provider-defined component",
    ],
    fulfilmentTargets: ["Waldur plan and order fields", "Provider entitlement systems", "Provider custom integration"],
    listing: {
      serviceType: "SaaS",
      title: "Analytics Workspace",
      provider: "Example Provider",
      region: "Region-independent",
      specs: ["10 seats", "Monthly plan", "Standard support"],
      components: ["seat-month", "support tier"],
      priceLabel: "$50 / seat / month",
      badges: ["entitlement"],
    },
    flow: [
      "Software plan",
      "Order",
      "Lease / entitlement agreement",
      "Provider fulfils access",
      "Account · seat · licence",
      "Subscription state",
      "Component usage",
      "Settlement",
    ],
    flowCaption:
      "The software provider owns and operates the application. The chain records who agreed to what, and settles it — it does not create the account itself.",
    route: "/marketplace/saas",
    cta: "Explore SaaS",
    related: [
      { label: "Custom listings", href: "/marketplace/custom-listings" },
      { label: "Marketplace lifecycle", href: "/learn/how-the-marketplace-works" },
      { label: "Waldur integration", href: "/waldur" },
      { label: "IaaS vs PaaS vs SaaS", href: "/learn/iaas-paas-saas-on-virtengine" },
    ],
  },
  {
    id: "hpc",
    label: "HPC & batch",
    title: "HPC & Batch Compute",
    subtitle: "Scheduler-backed compute.",
    summary:
      "Allocations and jobs on high-performance computing facilities: queues, node counts, GPU counts and job durations defined by the listing. The provider's scheduler adapter fulfils the job; signed usage records settle the allocation.",
    examples: [
      "SLURM allocations",
      "MPI jobs",
      "GPU jobs",
      "Batch workloads",
      "Interactive sessions",
    ],
    billingModels: [
      "Allocation-based plan",
      "Node-hour and GPU-hour components",
      "Per-job pricing",
      "Reserved queue capacity",
    ],
    fulfilmentTargets: ["SLURM", "MOAB", "Open OnDemand", "Provider scheduler integration"],
    listing: {
      serviceType: "HPC",
      title: "GPU Batch Queue",
      provider: "Example Provider",
      region: "AU research facility",
      specs: ["4 GPUs", "32 CPU cores", "6-hour maximum job"],
      components: ["GPU-hour", "core-hour"],
      priceLabel: "Allocation-based",
      badges: ["scheduler-backed"],
    },
    flow: [
      "Queue listing",
      "Order / bid",
      "Lease",
      "Scheduler adapter",
      "SLURM · MOAB · Open OnDemand",
      "Job · allocation",
      "Signed usage",
      "Settlement",
    ],
    flowCaption:
      "The scheduler runs the job. The chain records the lease and settles the signed usage the provider daemon reports.",
    route: "/marketplace/hpc",
    cta: "Explore HPC & batch",
    related: [
      { label: "HPC on VirtEngine guide", href: "/learn/hpc-on-virtengine" },
      { label: "HPC cluster operators", href: "/solutions/hpc-clusters" },
      { label: "GPU & AI compute", href: "/marketplace/gpu-compute" },
      { label: "How marketplace orders work", href: "/learn/how-the-marketplace-works" },
    ],
  },
  {
    id: "gpu",
    label: "GPU & AI",
    title: "GPU & AI Compute",
    subtitle: "Accelerator capacity for training and inference.",
    summary:
      "Accelerator capacity listed as a product: GPU virtual machines, dedicated and multi-GPU nodes, training allocations and inference endpoints. Benchmarks and audits make measured performance part of the listing, and usage is metered per GPU-hour.",
    examples: [
      "GPU virtual machines",
      "GPU nodes",
      "Multi-GPU systems",
      "Inference endpoints",
      "Training clusters",
    ],
    billingModels: [
      "Metered GPU-hour",
      "Reserved GPU allocation",
      "Component-based plans",
      "Competitive bid for flexible workloads",
    ],
    fulfilmentTargets: ["Kubernetes / Rancher", "GPU backends and runtimes", "Inference runtimes", "Provider custom integration"],
    listing: {
      serviceType: "GPU & AI",
      title: "Multi-GPU Training Node",
      provider: "Example Provider",
      region: "ap-southeast",
      specs: ["4 × GPU", "96 vCPU", "768 GB RAM", "NVMe scratch"],
      components: ["GPU-hour", "storage GB-month"],
      priceLabel: "$0.39 / GPU-hour",
      badges: ["benchmarked", "attested"],
    },
    flow: [
      "GPU listing",
      "Order / bid",
      "Lease",
      "Provider daemon",
      "GPU backend",
      "Node · endpoint",
      "Metered usage",
      "Settlement",
    ],
    flowCaption:
      "Benchmarks describe measured performance; the provider's backend provides the accelerators; the chain records and settles the lease.",
    route: "/marketplace/gpu-compute",
    cta: "Explore GPU & AI compute",
    related: [
      { label: "GPU compute providers", href: "/solutions/gpu-compute-providers" },
      { label: "AI & ML workloads", href: "/solutions/ai-ml-workloads" },
      { label: "HPC & batch", href: "/marketplace/hpc" },
      { label: "IaaS", href: "/marketplace/iaas" },
    ],
  },
  {
    id: "storage",
    label: "Storage & data",
    title: "Storage & Data Services",
    subtitle: "Persistent capacity and managed data services.",
    summary:
      "Block volumes, object storage, managed databases and archive capacity, listed standalone or as components of another offering. Capacity and transfer components are metered and settle through the same rail as compute.",
    examples: [
      "Block storage",
      "Object storage",
      "Managed databases",
      "Backup / archive",
      "High-throughput storage",
    ],
    billingModels: [
      "Capacity components (GB-month)",
      "Request and transfer components",
      "Reserved capacity",
      "Attached to a compute plan",
    ],
    fulfilmentTargets: ["Provider storage backends", "Waldur storage plugins", "Provider custom integration"],
    listing: {
      serviceType: "Storage",
      title: "Object Storage Bucket",
      provider: "Example Provider",
      region: "Sydney · AU",
      specs: ["S3-compatible", "5 TB included", "Versioning"],
      components: ["storage GB-month", "egress GB"],
      priceLabel: "$0.02 / GB-month",
      badges: ["durable tier"],
    },
    flow: [
      "Storage listing",
      "Order",
      "Lease",
      "Provider backend",
      "Volume · bucket · archive",
      "Capacity & transfer usage",
      "Settlement",
    ],
    flowCaption:
      "Storage is provisioned and operated by the provider's backend; the protocol records the lease and settles measured capacity.",
    route: "/marketplace/storage",
    cta: "Explore storage & data",
    related: [
      { label: "IaaS", href: "/marketplace/iaas" },
      { label: "Managed & professional services", href: "/marketplace/custom-listings" },
      { label: "How marketplace orders work", href: "/learn/how-the-marketplace-works" },
      { label: "Waldur integration", href: "/waldur" },
    ],
  },
  {
    id: "managed",
    label: "Managed services",
    title: "Managed & Professional Services",
    subtitle: "Human or managed services sold through the same catalogue.",
    summary:
      "Consultancy hours, implementation packages, managed operations, support desks and training credits. These are provider-defined offerings with order forms and approvals; work is delivered by people or managed by the provider, and billable components settle on the same rail.",
    examples: [
      "Consultancy hours",
      "Implementation",
      "Support",
      "Managed operations",
      "Training credits",
    ],
    billingModels: [
      "Fixed-fee package",
      "Hourly component",
      "Retainer",
      "Order-form quote",
    ],
    fulfilmentTargets: ["Waldur custom offering types", "Provider approval workflow", "Provider delivery teams"],
    listing: {
      serviceType: "Managed",
      title: "Infrastructure Migration Package",
      provider: "Example Provider",
      region: "Remote delivery",
      specs: ["20 engineering hours", "Project approval required", "Fixed scope"],
      components: ["engineering-hour"],
      priceLabel: "Fixed-fee package",
      badges: ["provider-approved"],
    },
    flow: [
      "Service listing",
      "Order form",
      "Provider approval",
      "Provider delivery",
      "Billable component",
      "Settlement",
    ],
    flowCaption:
      "The provider delivers the work. The catalogue and settlement rail make the engagement orderable and accountable without pretending the protocol performs it.",
    route: "/marketplace/custom-listings",
    cta: "Explore custom & managed listings",
    related: [
      { label: "Custom listings", href: "/marketplace/custom-listings" },
      { label: "How custom offerings work", href: "/learn/how-custom-offerings-work" },
      { label: "SaaS", href: "/marketplace/saas" },
      { label: "Waldur integration", href: "/waldur" },
    ],
  },
  {
    id: "custom",
    label: "Custom",
    title: "Custom Listings",
    subtitle: "Provider-defined offerings beyond the standard categories.",
    summary:
      "Anything a provider can describe, price and fulfil: scripted provisioning, bespoke infrastructure bundles, remote catalogue items and specialist services. Custom listings use order forms, approvals and provider-defined components while keeping the same lease and settlement guarantees.",
    examples: [
      "Scripted service",
      "Custom order form",
      "Remote catalogue item",
      "Specialist service",
      "Bespoke infrastructure bundle",
    ],
    billingModels: [
      "Provider-defined components",
      "Fixed fee or quote",
      "Metered service",
      "Milestone-based",
    ],
    fulfilmentTargets: ["Waldur custom offering types", "Remote Waldur catalogues", "Site-agent plugins", "Scripted provider automation"],
    listing: {
      serviceType: "Custom",
      title: "Scripted Data Processing Run",
      provider: "Example Provider",
      region: "Provider-defined",
      specs: ["Custom order form", "Provider approval", "Output delivered to object storage"],
      components: ["job-run", "storage GB-month"],
      priceLabel: "Provider quote",
      badges: ["provider-defined"],
    },
    flow: [
      "Custom offering",
      "Order form",
      "Provider approval / automation",
      "Fulfilment",
      "Metered or fixed component",
      "Settlement",
    ],
    flowCaption:
      "Fulfilment follows the provider's own mechanism — script, plugin, approval or entitlement. The protocol keeps the agreement and the money verifiable.",
    route: "/marketplace/custom-listings",
    cta: "Explore custom listings",
    related: [
      { label: "How custom offerings work", href: "/learn/how-custom-offerings-work" },
      { label: "Managed & professional services", href: "/marketplace/custom-listings" },
      { label: "Waldur integration", href: "/waldur" },
      { label: "Marketplace overview", href: "/marketplace" },
    ],
  },
];

export const SERVICE_MODEL_BY_ID = Object.fromEntries(
  SERVICE_MODELS.map((model) => [model.id, model]),
) as Record<ServiceModelId, ServiceModel>;

/**
 * Legacy four-card view (IaaS, PaaS, SaaS, custom) used by the homepage and
 * Waldur page instruments. Derived from SERVICE_MODELS so the two views can
 * never diverge.
 */
export const SERVICE_CATEGORIES: ServiceCategory[] = (
  ["iaas", "paas", "saas", "custom"] as const
).map((id) => {
  const model = SERVICE_MODEL_BY_ID[id];
  const legacy: Record<(typeof id), { body: string; billing: string; delivery: string }> = {
    iaas: {
      body: "Rented infrastructure, from virtual machines and private clouds to Kubernetes clusters, bare-metal nodes, GPU fleets, HPC allocations, storage and network.",
      billing: "Reserved limits, monthly or metered usage",
      delivery: "OpenStack · Kubernetes · SLURM · VMware · cloud connectors",
    },
    paas: {
      body: "Managed platforms your teams deploy onto — container orchestration, databases, AI/ML runtimes, inference endpoints and job schedulers — ordered per project, not per server.",
      billing: "Per component: limits or usage",
      delivery: "Waldur service plugins and software catalogs over provider infrastructure",
    },
    saas: {
      body: "Software sold as plans: seats, licences, subscriptions and support packages. Fixed-price products sit in the same catalogue as compute and settle the same way.",
      billing: "Fixed monthly, per seat or prepaid",
      delivery: "Provider-published plans ordered through Waldur",
    },
    custom: {
      body: "Consultancy hours, support desks, training credits, scripted provisioning, and remote catalogues federated from other Waldur instances. If it can be priced and described, it can be listed.",
      billing: "Custom components: hourly, flat fee or order form",
      delivery: "Waldur custom offering types with per-order terms and approvals",
    },
  };
  return {
    id,
    label: model.label,
    name: id === "custom" ? "Anything a provider can describe" : model.title,
    body: legacy[id].body,
    examples: model.examples.slice(0, 5),
    billing: legacy[id].billing,
    delivery: legacy[id].delivery,
  };
});

/* ------------------------------------------------------------------ *
 * Marketplace lifecycle stages (visual model)
 *
 * The five-stage rail's rich content: what each side does, what becomes
 * protocol state, what stays off-chain, and where the lifecycle goes next.
 * Stage names align with LIFECYCLE in site.ts; this model adds the
 * responsibility split the marketplace pages visualise.
 * ------------------------------------------------------------------ */

export interface MarketplaceStage {
  n: string;
  id: "order" | "match" | "lease" | "usage" | "settlement";
  /** Short verb shown on the rail. */
  verb: string;
  /** Protocol object created or resolved in this stage. */
  object: string;
  /** One sentence: what happens. */
  sentence: string;
  /** Icon id rendered by MarketplaceLifecycle. */
  icon: "request" | "branch" | "link" | "meter" | "transfer";
  tenant: string;
  provider: string;
  protocol: string;
  offchain: string;
  next: string;
  /** Where the stage is explained in full. */
  href: string;
  hrefLabel: string;
}

export const MARKETPLACE_STAGES: MarketplaceStage[] = [
  {
    n: "01",
    id: "order",
    verb: "Order",
    object: "Order",
    sentence: "Describe demand and back it with escrow.",
    icon: "request",
    tenant: "Describes the service, region, requirements and price expectations — or names a listing outright — and funds escrow so the demand is provably budgeted.",
    provider: "Watches the chain for open demand that matches registered capacity and attributes.",
    protocol: "An <code>Order</code> object is created and an escrow account is funded against it.",
    offchain: "The workload manifest and any tenant-side configuration are prepared for delivery later.",
    next: "Match — direct purchase, bids, or an attribute match.",
    href: "/learn/how-the-marketplace-works",
    hrefLabel: "How the marketplace works",
  },
  {
    n: "02",
    id: "match",
    verb: "Match",
    object: "Listing / Bid",
    sentence: "Buy directly, compare bids, or match by attributes.",
    icon: "branch",
    tenant: "Takes a published price, accepts a competing bid, or lets the engine resolve eligible listings inside a price cap.",
    provider: "Pricing strategy and bid rules run in the provider daemon; valid bids must satisfy the order's resource and attribute requirements.",
    protocol: "The order resolves to a listing, an accepted <code>Bid</code>, or a deterministic selector result.",
    offchain: "Provider pricing configuration and capacity planning; no off-chain deal can replace the on-chain match.",
    next: "Lease — the match becomes an enforceable agreement.",
    href: "/learn/three-ways-to-buy",
    hrefLabel: "Three ways to buy",
  },
  {
    n: "03",
    id: "lease",
    verb: "Lease",
    object: "Lease",
    sentence: "The selected capacity becomes an enforceable market agreement.",
    icon: "link",
    tenant: "Holds a lease that binds the provider, the price and the funded escrow account.",
    provider: "Routes the matched request into its control plane and backend to provision the service.",
    protocol: "A <code>Lease</code> binds one tenant, one provider and one escrow account; lifecycle state is correlated back to it.",
    offchain: "The provider daemon calls Waldur or a provider integration; the backend creates the resource. The chain does not provision infrastructure.",
    next: "Usage — the service runs and is metered.",
    href: "/learn/how-the-marketplace-works",
    hrefLabel: "How the marketplace works",
  },
  {
    n: "04",
    id: "usage",
    verb: "Usage",
    object: "UsageRecord",
    sentence: "The provider measures consumption and signs the record.",
    icon: "meter",
    tenant: "Consumes the service and can observe resource state through the provider's console.",
    provider: "Meters per-workload consumption on a scheduled cadence, screens anomalies, and submits signed batches to the chain.",
    protocol: "Signed <code>UsageRecord</code> entries are submitted against the lease and reconciled against platform metrics.",
    offchain: "Metering, anomaly detection, retry and reconciliation run inside the provider daemon.",
    next: "Settlement — validated usage becomes payment.",
    href: "/learn/escrow-and-settlement-explained",
    hrefLabel: "Escrow & settlement",
  },
  {
    n: "05",
    id: "settlement",
    verb: "Settlement",
    object: "Settlement",
    sentence: "Validated usage releases the corresponding escrowed funds.",
    icon: "transfer",
    tenant: "Can raise corrections during the dispute window; unspent escrow returns when the deployment closes.",
    provider: "Receives the agreed amount from escrow under the governed settlement fee policy.",
    protocol: "<code>Settlement</code> converts validated records into priced line items and releases escrow.",
    offchain: "Provider and project reporting views remain operational; they do not override the lease price or authorise payout.",
    next: "Renewal, scale, or close — any remaining escrow returns to the tenant.",
    href: "/learn/escrow-and-settlement-explained",
    hrefLabel: "Escrow & settlement",
  },
];
