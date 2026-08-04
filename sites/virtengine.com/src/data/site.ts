export const SITE = {
  name: "VirtEngine",
  url: "https://virtengine.com",
  title: "VirtEngine — The open-source decentralized cloud marketplace protocol",
  description:
    "VirtEngine is an open-source, patented decentralized cloud computing marketplace protocol connecting tenants with providers through an on-chain marketplace, built on CometBFT and the Cosmos SDK.",
  email: "hello@virtengine.com",
  github: "https://github.com/virtengine/virtengine",
  docs: "https://docs.virtengine.com",
  patentUrl: "https://patents.google.com/patent/AU2024203136B2/",
  patentId: "AU2024203136B2",
} as const;

export interface NavItem {
  label: string;
  href: string;
}

export const NAV: NavItem[] = [
  { label: "Protocol", href: "/protocol" },
  { label: "Modules", href: "/modules" },
  { label: "Solutions", href: "/solutions" },
  { label: "Learn", href: "/learn" },
  { label: "Providers", href: "/providers" },
  { label: "Staking", href: "/staking" },
  { label: "VEID", href: "/veid" },
];

export const FOOTER_COLUMNS: { heading: string; items: NavItem[] }[] = [
  {
    heading: "Protocol",
    items: [
      { label: "Architecture", href: "/protocol" },
      { label: "Module reference", href: "/modules" },
      { label: "Network status", href: "/network" },
      { label: "Open source", href: "/open-source" },
      { label: "VEID identity", href: "/veid" },
    ],
  },
  {
    heading: "Participate",
    items: [
      { label: "Become a provider", href: "/providers" },
      { label: "Staking & validators", href: "/staking" },
      { label: "Solutions by audience", href: "/solutions" },
      { label: "About the foundation", href: "/about" },
    ],
  },
  {
    heading: "Learn",
    items: [
      { label: "Guides & explainers", href: "/learn" },
      { label: "FAQ", href: "/faq" },
      { label: "Tokenomics explained", href: "/learn/tokenomics-explained" },
      { label: "How the marketplace works", href: "/learn/how-the-marketplace-works" },
    ],
  },
];

export const ECOSYSTEM: NavItem[] = [
  { label: "docs.virtengine.com", href: "https://docs.virtengine.com" },
  { label: "det.io", href: "https://det.io" },
  { label: "identity.org.au", href: "https://identity.org.au" },
  { label: "GitHub", href: "https://github.com/virtengine/virtengine" },
];

export interface ModuleGroup {
  domain: string;
  summary: string;
  modules: { name: string; role: string }[];
}

/** On-chain module surface, grouped by domain. Source: repos/virtengine/x/ */
export const MODULE_GROUPS: ModuleGroup[] = [
  {
    domain: "Marketplace & workloads",
    summary:
      "The exchange itself — orders, bids, leases, provider registration, and workload capability surfaces.",
    modules: [
      { name: "market", role: "Order, bid, and lease state machine" },
      { name: "marketplace", role: "Marketplace coordination and offering surfaces" },
      { name: "deployment", role: "Tenant deployment specifications and groups" },
      { name: "provider", role: "Provider registration and attributes" },
      { name: "resources", role: "Resource unit and capacity definitions" },
      { name: "hpc", role: "HPC job marketplace for scheduler-backed clusters" },
    ],
  },
  {
    domain: "Identity & security",
    summary:
      "VEID identity scoring, credential registries, multi-factor authentication, and encrypted data handling.",
    modules: [
      { name: "veid", role: "Identity verification and trust scoring" },
      { name: "veidregistry", role: "Identity record and scope registry" },
      { name: "mfa", role: "On-chain multi-factor authentication policies" },
      { name: "cert", role: "TLS certificates for provider/tenant mutual auth" },
      { name: "encryption", role: "Public-key encryption for sensitive on-chain data" },
      { name: "enclave", role: "Confidential compute and enclave attestation" },
      { name: "fraud", role: "Fraud reporting and enforcement hooks" },
      { name: "roles", role: "Role-based access control across modules" },
    ],
  },
  {
    domain: "Economics & settlement",
    summary:
      "Escrow-backed payments, zero marketplace commission, validator transaction fees, staking, and VEID-led issuance economics.",
    modules: [
      { name: "escrow", role: "Funds held against active leases" },
      { name: "settlement", role: "Usage-record settlement into payments" },
      { name: "take", role: "Zero-rate marketplace settlement policy" },
      { name: "bme", role: "Burn-and-mint equilibrium mechanics" },
      { name: "staking", role: "Validator staking extensions" },
      { name: "delegation", role: "Delegation lifecycle management" },
      { name: "issuancepolicy", role: "Token issuance policy controls" },
      { name: "oracle", role: "External price and data feeds" },
    ],
  },
  {
    domain: "Quality & governance",
    summary:
      "Audited attributes, benchmarking, reviews, support flows, and chain configuration.",
    modules: [
      { name: "audit", role: "Auditor-signed provider attributes" },
      { name: "benchmark", role: "Provider hardware benchmarking records" },
      { name: "review", role: "Tenant/provider review and reputation" },
      { name: "support", role: "Support and dispute intake flows" },
      { name: "config", role: "Chain-level configuration (incl. approved clients)" },
    ],
  },
];

/** Marketplace lifecycle stages. Source: repos/virtengine docs. */
export const LIFECYCLE = [
  {
    step: "01",
    name: "Order",
    detail:
      "A tenant posts a deployment order on-chain describing the resources they need — compute, memory, storage, region, and attributes.",
  },
  {
    step: "02",
    name: "Bid",
    detail:
      "Provider daemons watching the chain place competing bids against open orders on behalf of their configured providers.",
  },
  {
    step: "03",
    name: "Lease",
    detail:
      "The tenant's winning bid becomes a lease. Escrow is funded, and the provider daemon instantiates the workload through its orchestration layer.",
  },
  {
    step: "04",
    name: "Usage",
    detail:
      "The provider daemon meters running workloads and submits signed usage records to the chain on a scheduled cadence.",
  },
  {
    step: "05",
    name: "Settlement",
    detail:
      "After a 24-hour dispute window, the settlement module converts usage into billable line items and releases the agreed escrowed funds to the provider with no marketplace commission deducted.",
  },
] as const;
