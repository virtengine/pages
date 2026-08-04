/**
 * FAQ entries. Powers /faq with FAQPage JSON-LD.
 * Answers are grounded in repos/virtengine docs and the DETIO constitution.
 */

export interface FaqEntry {
  question: string;
  /** Plain-text answer (used for JSON-LD). */
  answer: string;
  /** Optional links rendered after the answer. */
  links?: { label: string; href: string }[];
  category: "General" | "Providers" | "Staking & tokens" | "Developers & identity";
}

export const FAQ: FaqEntry[] = [
  // ── General ──
  {
    category: "General",
    question: "What is VirtEngine?",
    answer:
      "VirtEngine is an open-source, decentralized cloud computing marketplace protocol. It connects tenants who need computing resources with providers who have capacity to lease, through an on-chain exchange with built-in identity verification (VEID), escrow, and usage settlement. It ships as a single Go binary containing a CometBFT-powered blockchain node built on the Cosmos SDK, licensed Apache 2.0, with certain methods protected by patent AU2024203136B2.",
    links: [
      { label: "Protocol architecture", href: "/protocol" },
      { label: "How the marketplace works", href: "/learn/how-the-marketplace-works" },
    ],
  },
  {
    category: "General",
    question: "Is the VirtEngine network live?",
    answer:
      "Mainnet is planned for the January 2027 launch window. It is not live until a formal launch confirmation is published; verify current status from the published release materials before assuming the network is available.",
    links: [{ label: "Network status", href: "/network" }],
  },
  {
    category: "General",
    question: "How is VirtEngine different from a conventional cloud?",
    answer:
      "In a conventional cloud, one company owns the exchange: it sets prices, runs the meter, issues invoices, and adjudicates its own disputes. On VirtEngine those roles are protocol functions executed by consensus — providers compete on price per order, usage records are signed and publicly disputable for 24 hours, and payment releases from escrow under rules neither party can bend.",
    links: [{ label: "Cost-optimized cloud", href: "/solutions/cost-optimized-cloud" }],
  },
  {
    category: "General",
    question: "How does VirtEngine relate to Akash Network?",
    answer:
      "VirtEngine's codebase is partly derived from the Akash Network decentralized cloud marketplace, and the project acknowledges that lineage openly. On top of it, VirtEngine adds the VEID Network, on-chain MFA, HPC scheduler integrations (SLURM, MOAB, Open OnDemand), confidential compute attestation, burn-and-mint economics, and the usage-settlement pipeline.",
    links: [{ label: "Open source project", href: "/open-source" }],
  },
  {
    category: "General",
    question: "Who is behind VirtEngine?",
    answer:
      "The protocol, software, standards, patent rights, identity system, chain, and token are stewarded by DETIO FOUNDATION LTD, an Australian not-for-profit public company limited by guarantee (ACN 699 651 771). Its constitution imposes a public-benefit lock: no operation for private commercial interests, no dividends, and no private capture of the IP or digital assets it stewards.",
    links: [{ label: "About the foundation", href: "/about" }],
  },
  {
    category: "General",
    question: "Is VirtEngine open source if it's patented?",
    answer:
      "Yes. The implementation is Apache 2.0 licensed — free to use, modify, and distribute, including commercially. The Apache 2.0 license includes a patent grant covering the patent holder's contributions to this project, so using VirtEngine as shipped is covered. Reproducing the patented methods outside that scope — for example re-implementing them in a separate system — may require separate authorization. The patent is used to keep the protocol's core methods open under foundation stewardship.",
    links: [{ label: "License & patent explained", href: "/open-source" }],
  },

  // ── Providers ──
  {
    category: "Providers",
    question: "What do I need to become a provider?",
    answer:
      "Infrastructure (a Kubernetes cluster, or an HPC cluster behind SLURM, MOAB, or Open OnDemand), a Linux or macOS host for the virtengine binary and provider daemon, a funded chain account and provider key, VEID identity verification (marketplace participation is identity-gated), and network reachability for the services you host.",
    links: [{ label: "Provider onboarding", href: "/providers" }],
  },
  {
    category: "Providers",
    question: "How and when do providers get paid?",
    answer:
      "The provider daemon meters running workloads hourly and submits signed usage records on-chain. Each record sits in a 24-hour dispute window; after it closes, the settlement module converts it into priced line items and releases the agreed payment from the lease's escrow automatically. VirtEngine charges no marketplace commission or platform fee; only low validator transaction fees apply to the on-chain actions. There is no invoicing and no accounts receivable.",
    links: [{ label: "Escrow & settlement explained", href: "/learn/escrow-and-settlement-explained" }],
  },
  {
    category: "Providers",
    question: "Can I offer HPC capacity without re-platforming my cluster?",
    answer:
      "Yes. The x/hpc module models batch jobs natively, and the provider daemon's HPC integration speaks to your existing scheduler through native adapters — SLURM with munge or JWT authentication and per-partition configuration, plus MOAB and Open OnDemand. Your scheduler stays in charge of its resources; the marketplace becomes another source of authorized work.",
    links: [{ label: "HPC on VirtEngine", href: "/learn/hpc-on-virtengine" }],
  },
  {
    category: "Providers",
    question: "What stops a tenant from disputing every bill?",
    answer:
      "Disputes are windowed and structured, not free-form: usage records are signed by the provider, screened by anomaly detection before submission, and reconciled against platform metrics. A dispute raised in the 24-hour window flows through on-chain support intake with a defined lifecycle, and alleged misconduct escalates to the fraud module — where enforcement consequences attach to the party at fault.",
    links: [{ label: "x/settlement module", href: "/modules/settlement" }],
  },
  {
    category: "Providers",
    question: "How do I make my capacity stand out from other providers?",
    answer:
      "Three on-chain instruments raise realized prices: published hardware benchmarks (x/benchmark) that let tenants verify measured performance, auditor-signed attributes (x/audit) that turn claims like datacenter tier or jurisdiction into attestations, and lease-bound reviews (x/review) that compound into portable reputation with every served workload.",
    links: [{ label: "Provider economics", href: "/learn/provider-economics" }],
  },

  // ── Staking & tokens ──
  {
    category: "Staking & tokens",
    question: "What do VirtEngine validators actually do?",
    answer:
      "Three jobs with one bonded stake: consensus (proposing and validating blocks under CometBFT), the VEID Network (decrypting encrypted identity scopes, scoring them with shared machine-learning models, and committing trust scores by consensus — the patented core of the protocol), and governance (voting on parameters, upgrades, and the approved-client list).",
    links: [{ label: "Staking & validators", href: "/staking" }],
  },
  {
    category: "Staking & tokens",
    question: "What are the staking economics?",
    answer:
      "Staking rewards remain, but the proposed allocation is roughly 90% lower than the previous model. Reward rates, commission, unbonding and slashing are governance-controlled protocol parameters, so no fixed APR or return is promised.",
    links: [{ label: "Tokenomics explained", href: "/learn/tokenomics-explained" }],
  },
  {
    category: "Staking & tokens",
    question: "Can I lose money staking?",
    answer:
      "Yes. Bonded stake — including delegated stake — can be slashed for validator misbehavior such as double-signing or extended downtime. During the 21-day unbonding period your tokens earn no rewards and remain slashable for offenses committed while bonded. Choose validators on operational quality, not just commission.",
    links: [{ label: "Understanding slashing", href: "/learn/understanding-slashing" }],
  },
  {
    category: "Staking & tokens",
    question: "What links the token's supply to actual usage?",
    answer:
      "The proposed primary issuance path mints tokens over time to accounts that satisfy the network-defined unique-identity threshold and remain active. Each 15-token VEID issuance batch allocates 14 tokens to eligible humans and 1 token to the Foundation-controlled genesis account; all issuance policy is chain state changeable only by governance.",
    links: [{ label: "x/bme module", href: "/modules/bme" }],
  },

  // ── Developers & identity ──
  {
    category: "Developers & identity",
    question: "How does VEID protect my identity documents?",
    answer:
      "Capture happens entirely on your device — documents, selfie with active liveness, biometric hardware attestation. Evidence is sealed into identity scopes with public-key encryption targeted to validator recipients before anything leaves the phone, and submissions must be signed by both you and a governance-approved client. Validators score the encrypted evidence by consensus; raw documents and biometrics never appear on the public ledger. Afterwards, zero-knowledge proofs let you prove facts (a score threshold, an age range) without revealing the underlying data.",
    links: [{ label: "What is VEID?", href: "/learn/what-is-veid" }],
  },
  {
    category: "Developers & identity",
    question: "Can I build my own client or tooling on VirtEngine?",
    answer:
      "Yes — the chain surface is open. All 27 modules expose standard Cosmos SDK gRPC and REST endpoints, and building deployment tooling, provider dashboards, staking interfaces, or analytics requires no permission. The one governed exception: submitting VEID identity data requires your client to be on the on-chain approved-client list, which is controlled by governance because capture-software integrity is a protocol trust decision.",
    links: [{ label: "For web3 developers", href: "/solutions/web3-developers" }],
  },
  {
    category: "Developers & identity",
    question: "Where do I start as a developer?",
    answer:
      "Clone github.com/virtengine/virtengine. Development targets Go 1.25.5 with a C/C++ compiler for libusb/libhid dependencies; make virtengine builds the binary into .cache/bin. Local environment setup is documented in _docs/development-environment.md, module documentation lives on this site and at docs.virtengine.com, and the VEID capture reference app is at mobile/veid-capture-app/.",
    links: [{ label: "Open source project", href: "/open-source" }],
  },
];

export const FAQ_CATEGORIES = ["General", "Providers", "Staking & tokens", "Developers & identity"] as const;
