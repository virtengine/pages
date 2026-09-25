export const SITE = {
  name: "VirtEngine",
  url: "https://virtengine.com",
  title: "Open Cloud & Services Marketplace | VirtEngine",
  description:
    "VirtEngine is an open-source marketplace protocol for cloud infrastructure and services — direct orders, competitive bids and attribute matching, with identity, escrow and settlement on-chain.",
  email: "hello@virtengine.com",
  github: "https://github.com/virtengine/virtengine",
  docs: "https://docs.virtengine.com",
  patentUrl: "https://patents.google.com/patent/AU2024203136B2/",
  patentId: "AU2024203136B2",
} as const;

/** Single source for Foundation identity. /about owns full history; others link. */
export const foundationDetails = {
  name: "DETIO FOUNDATION LTD",
  structure: "Australian not-for-profit public company limited by guarantee",
  acn: "ACN 699 651 771",
  purpose:
    "Supporting open infrastructure, privacy-preserving identity and public-interest technology.",
  lock: "Constitutional public-benefit lock: no private commercial operation, no dividends, no private capture; assets pass to another public-benefit entity on winding-up.",
} as const;

export interface NavItem {
  label: string;
  href: string;
}

export const NAV: NavItem[] = [
 {label: "Our mission", href: "/about"},
 {label: "The protocol", href: "/protocol"},
 {label: "Learn", href: "/learn"},
 {label: "Journal", href: "/blog"},
 {label: "Get involved", href: "/participate"},
 {label: "Contact", href: "/contact"},
];

export const FOOTER_COLUMNS: { heading: string; items: NavItem[] }[] = [
  {
    heading: "Protocol",
    items: [
      { label: "Architecture", href: "/protocol" },
      { label: "Identity (VEID)", href: "/veid" },
      { label: "Network status", href: "/network" },
      { label: "Open source", href: "/open-source" },
    ],
  },
  {
    heading: "Marketplace",
    items: [
      { label: "Marketplace overview", href: "/marketplace" },
      { label: "GPU & AI compute", href: "/marketplace/gpu-compute" },
      { label: "Ways to buy", href: "/learn/three-ways-to-buy" },
      { label: "For tenants & buyers", href: "/tenants" },
    ],
  },
  {
    heading: "Participate",
    items: [
      { label: "Become a provider", href: "/providers" },
      { label: "Staking & validators", href: "/staking" },
      { label: "Solutions", href: "/solutions" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    heading: "Learn",
    items: [
      { label: "Guides & explainers", href: "/learn" },
      { label: "Definitions", href: "/definitions" },
      { label: "Journal", href: "/blog" },
      { label: "FAQ", href: "/faq" },
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
      { name: "market", role: "Order, match, and lease state machine" },
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
      "Escrow-backed payments, governance-set settlement fees, validator transaction fees, staking, and VEID-led issuance economics.",
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
    short: "Describe the workload, or name a listing.",
  },
  {
    step: "02",
    name: "Match",
    detail:
      "Match resolves on-chain through one of three acquisition paths: direct orders bind a named offering at its listed price, open orders collect competing bids from provider daemons until one is accepted, and selector orders resolve to the best eligible listing within their caps. Every path resolves deterministically.",
    short: "Direct price, competing bids, or attribute match.",
  },
  {
    step: "03",
    name: "Lease",
    detail:
      "The match becomes a lease. Escrow is funded, and the provider daemon instantiates the workload through its orchestration layer.",
    short: "Escrow funded; the provider provisions.",
  },
  {
    step: "04",
    name: "Usage",
    detail:
      "The provider daemon meters running workloads and submits signed usage records to the chain on a scheduled cadence.",
    short: "The daemon meters and signs usage.",
  },
  {
    step: "05",
    name: "Settlement",
    detail:
      "After a 24-hour dispute window, the settlement module converts usage into billable line items and releases the agreed escrowed funds to the provider under the governed fee policy.",
    short: "Funds release after the dispute window.",
  },
] as const;
