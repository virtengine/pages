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
  id: "iaas" | "paas" | "saas" | "custom";
  label: string;
  name: string;
  body: string;
  examples: string[];
  billing: string;
  delivery: string;
}

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    id: "iaas",
    label: "IaaS",
    name: "Infrastructure as a service",
    body: "Rented infrastructure, from virtual machines and private clouds to Kubernetes clusters, bare-metal nodes, GPU fleets, HPC allocations, storage and network.",
    examples: ["OpenStack tenant", "GPU node", "Rancher cluster", "SLURM allocation", "Object storage"],
    billing: "Reserved limits, monthly or metered usage",
    delivery: "OpenStack · Kubernetes · SLURM · VMware · cloud connectors",
  },
  {
    id: "paas",
    label: "PaaS",
    name: "Platform as a service",
    body: "Managed platforms your teams deploy onto — container orchestration, databases, AI/ML runtimes, inference endpoints and job schedulers — ordered per project, not per server.",
    examples: ["Managed Kubernetes", "Database cluster", "Inference endpoint", "ML workspace", "Batch scheduler"],
    billing: "Per component: limits or usage",
    delivery: "Waldur service plugins and software catalogs over provider infrastructure",
  },
  {
    id: "saas",
    label: "SaaS",
    name: "Software as a service",
    body: "Software sold as plans: seats, licences, subscriptions and support packages. Fixed-price products sit in the same catalogue as compute and settle the same way.",
    examples: ["Analytics seats", "Software licence", "Support plan", "Implementation package"],
    billing: "Fixed monthly, per seat or prepaid",
    delivery: "Provider-published plans ordered through Waldur",
  },
  {
    id: "custom",
    label: "Custom listings",
    name: "Anything a provider can describe",
    body: "Consultancy hours, support desks, training credits, scripted provisioning, and remote catalogues federated from other Waldur instances. If it can be priced and described, it can be listed.",
    examples: ["Consultancy hours", "Support desk", "Training credits", "Custom script", "Remote catalogue"],
    billing: "Custom components: hourly, flat fee or order form",
    delivery: "Waldur custom offering types with per-order terms and approvals",
  },
];
