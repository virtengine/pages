/**
 * Learn: explainer guides. Powers /learn/[slug].
 * Grounded in repos/virtengine docs — tokenomics-analysis.md,
 * usage-reporting-settlement.md, hpc-*.md, veid/, README.md,
 * _docs/operations/mainnet-go-no-go-decision.md. No invented figures.
 */

export type LearnDiagram = "lifecycle" | "settlement" | "veid" | "staking" | "architecture";

export interface LearnSection {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
}

export interface LearnEntry {
  slug: string;
  title: string;
  /** Short label for cards. */
  label: string;
  metaDescription: string;
  /** Topic kicker shown above the title. */
  kicker: string;
  intro: string;
  /** Optional site diagram rendered after the intro. */
  diagram?: LearnDiagram;
  diagramCaption?: string;
  sections: LearnSection[];
  related: { label: string; href: string }[];
}

export const LEARN: LearnEntry[] = [
  {
    slug: "how-the-marketplace-works",
    title: "How the VirtEngine marketplace works",
    label: "How the marketplace works",
    metaDescription:
      "A walkthrough of VirtEngine's Waldur-connected marketplace: a multi-service catalogue, custom offerings, orders, bids, leases, usage reporting, and settlement.",
    kicker: "Marketplace fundamentals",
    intro:
      "VirtEngine combines a Waldur-connected, multi-service catalogue with a five-stage protocol lifecycle: order, bid, lease, usage, settlement. Waldur makes private clouds, storage, VMs and fully custom provider offerings available in one self-service surface; the protocol supplies identity, exchange and settlement guarantees.",
    diagram: "lifecycle",
    diagramCaption: "The five-stage marketplace lifecycle: order → bid → lease → usage → settlement",
    sections: [
      {
        heading: "Stage 1 — Order: describing what you need",
        paragraphs: [
          "A tenant can begin from a Waldur marketplace offering: a private cloud, storage service, VM, accelerator-backed service, or a provider's fully custom listing. Where a workload deployment is needed, x/deployment carries its declarative description in groups with CPU, memory, storage, accelerator and placement requirements.",
          "Creating the deployment emits orders into the market module (x/market). An order is the marketplace's demand signal: a structured, on-chain request that any qualifying provider can compete for. The tenant also funds an escrow account at this point, so the market can see the demand is backed by real budget.",
        ],
      },
      {
        heading: "Stage 2 — Bid: providers compete",
        paragraphs: [
          "Provider daemons — the off-chain agents operators run inside their datacenters, clouds, and HPC facilities — watch the chain for open orders that match their registered capacity and attributes. When one appears, the daemon prices it against the operator's configured strategy and places a bid.",
          "Bids are on-chain objects too: priced offers that must satisfy the order's resource and attribute requirements to be valid. Multiple providers bidding against the same order is the mechanism that sets prices — competition per order, not per contract cycle.",
        ],
      },
      {
        heading: "Stage 3 — Lease: the match becomes a contract",
        paragraphs: [
          "The tenant accepts a winning bid and the match becomes a lease — the on-chain contract binding one tenant, one provider, and one escrow account. The VE–Waldur API passes the agreed service into the appropriate fulfilment path. That can be Kubernetes for containerized services, a scheduler adapter (SLURM, MOAB, Open OnDemand) for HPC jobs, or a provider-defined integration for a custom offering.",
          "Off-chain communication between tenant and provider — delivering the workload manifest, fetching status — is mutually authenticated with TLS certificates anchored on-chain by x/cert.",
        ],
      },
      {
        heading: "Stage 4 — Usage: metering with signatures",
        paragraphs: [
          "While the workload runs, the provider daemon meters per-workload resource consumption on an hourly cadence. Metrics are processed into usage records, screened by anomaly detection, and submitted to the chain in signed batches (MsgRecordUsage) with retry and backoff.",
          "Reconciliation runs alongside — cross-checking reported usage against platform metrics on a six-hour default interval and flagging discrepancies above threshold.",
        ],
      },
      {
        heading: "Stage 5 — Settlement: usage becomes payment",
        paragraphs: [
          "The settlement module (x/settlement) validates each usage record against its lease and converts it into priced line items. Records sit in a 24-hour dispute window during which either party can raise corrections; after it closes, line items settle against the lease's escrow.",
          "Funds transfer from escrow to the provider at the agreed lease price. There is no protocol commission or platform fee on marketplace settlement; low validator transaction fees apply only to the on-chain messages that create, operate and settle the lease. When the deployment closes, any unspent escrow returns to the tenant. No invoices were created, and no one had to trust the other side's accounting.",
        ],
      },
      {
        heading: "Why this design holds up",
        paragraphs: [
          "Each stage hands off to the next with a verifiable artifact: orders backed by escrow, bids validated against requirements, leases binding funds, usage signed and disputable, settlement rule-bound. Both counterparties are VEID-verified before any of it starts — the marketplace's guarantees are protocol properties, not platform policies.",
        ],
      },
    ],
    related: [
      { label: "Escrow & settlement explained", href: "/learn/escrow-and-settlement-explained" },
      { label: "x/market module reference", href: "/modules/market" },
      { label: "Become a provider", href: "/providers" },
      { label: "Cost-optimized cloud", href: "/solutions/cost-optimized-cloud" },
    ],
  },
  {
    slug: "escrow-and-settlement-explained",
    title: "Escrow and settlement, explained",
    label: "Escrow & settlement",
    metaDescription:
      "How VirtEngine replaces invoicing with protocol machinery: escrow accounts, hourly usage records, the 24-hour dispute window, anomaly detection, and automatic payout.",
    kicker: "Payments architecture",
    intro:
      "The hardest problem in any compute marketplace is not matching — it's money. Who holds the funds? Who verifies the meter? What happens when the numbers are disputed? VirtEngine answers all three with protocol machinery: escrow, signed usage reporting, and windowed settlement.",
    diagram: "settlement",
    diagramCaption: "The usage-reporting and settlement pipeline, from workload meter to escrow payout",
    sections: [
      {
        heading: "Escrow: commitment without transfer",
        paragraphs: [
          "When a tenant creates a deployment, they fund an escrow account (x/escrow). The balance is provably committed — providers can verify it exists before serving a lease — but provably not yet transferred: it moves only under settlement rules, never at a counterparty's discretion.",
          "This single mechanism removes both directions of payment risk. The provider is not extending credit to a stranger, and the tenant is not prepaying a stranger. If escrow runs dry, leases close for non-payment; if the deployment closes with balance remaining, it returns to the tenant.",
        ],
      },
      {
        heading: "The metering pipeline",
        paragraphs: [
          "On the provider side, a usage meter collects per-workload resource metrics. A scheduled collector runs hourly: collect metrics, process them into usage records, run anomaly detection, and submit signed batches to the chain. Batches carry the provider's signature — the meter's output is attributable and non-repudiable.",
          "The settlement pipeline defaults are conservative and configurable: one-hour settlement intervals, batches of ten records, three retry attempts, and a reconciliation pass every six hours that cross-checks chain-reported usage against platform metrics with a configurable discrepancy threshold.",
        ],
      },
      {
        heading: "The 24-hour dispute window",
        paragraphs: [
          "No usage record settles immediately. Each sits in a 24-hour window during which either party can dispute or correct it. Anomaly detection has usually flagged outliers before submission, so the window is a backstop — but it is a real one, and disputed records escalate through support intake (x/support) and, where misconduct is alleged, fraud handling (x/fraud).",
        ],
      },
      {
        heading: "Settlement and payout",
        paragraphs: [
          "After the window closes, the settlement module converts validated records into line items priced by lease terms and draws them down from escrow. The provider receives the agreed settlement amount: VirtEngine applies no protocol take or marketplace commission. Validator transaction fees apply to chain messages and are designed to be approximately 90% lower than standard network transaction fees. The provider's revenue arrives as settled chain state, with a complete audit trail from meter to payment.",
        ],
      },
      {
        heading: "What this replaces",
        paragraphs: [
          "In conventional cloud billing, the seller runs the meter, prices the usage, issues the invoice, and adjudicates disputes — a full conflict of interest stack. VirtEngine distributes those roles: the provider meters but signs, the protocol prices and settles, both parties can dispute, and consensus adjudicates by rule. It is billing designed for counterparties who have never met.",
        ],
      },
    ],
    related: [
      { label: "x/settlement module", href: "/modules/settlement" },
      { label: "x/escrow module", href: "/modules/escrow" },
      { label: "Provider economics", href: "/learn/provider-economics" },
      { label: "How the marketplace works", href: "/learn/how-the-marketplace-works" },
    ],
  },
  {
    slug: "tokenomics-explained",
    title: "VirtEngine tokenomics, explained",
    label: "Tokenomics",
    metaDescription:
      "The proposed VirtEngine economic model: identity-led issuance, conservative staking rewards, and governance-controlled parameters.",
    kicker: "Economics",
    intro:
      "VirtEngine's proposed economic model recognizes sustained, unique verified identity while retaining a conservative staking component for network security. Parameters are governance-controlled and may change before or after launch.",
    sections: [
      {
        heading: "Identity-led allocation",
        paragraphs: [
          "When an account reaches the network-defined threshold for a unique verified identity, the protocol may unlock token minting to that account over time. The threshold is based on the network's score, tier and anti-Sybil rules; it is not a guarantee of an individual allocation.",
          "The current working illustration is a 50-year accrual period with a quarterly sign-in activity check. An account that is not active pauses future minting until it again meets the protocol rules. The threshold, activity definition and duration can be changed by consensus.",
        ],
      },
      {
        heading: "Foundation allocation",
        paragraphs: [
          "Each 15-token VEID issuance batch is split between eligible active verified humans and DETIO FOUNDATION LTD: 14 tokens are allocated to eligible humans and 1 token is allocated to the Foundation-controlled genesis account. This is not an additional token on top of the 15-token issuance batch. The Foundation operates its websites and reference services, while VEID itself remains decentralised technology operated by participating validators rather than the Foundation.",
          "The 1-in-15 Foundation genesis allocation is a governed policy parameter and can be updated through consensus in the future.",
        ],
      },
      {
        heading: "Staking remains, at a lower level",
        paragraphs: [
          "Validators and delegators continue to receive staking rewards for contributing to security. The proposed staking issuance is roughly 90% lower than in the previous model. Rates, commission, unbonding and slashing terms are governed parameters; they are not fixed yield or return promises.",
        ],
      },
      {
        heading: "Governance, not a central operator",
        paragraphs: [
          "The Foundation does not operate a central VEID identity service. VEID is protocol technology that eligible validators can join and operate under the network rules. Consensus governs economic parameters, including the identity threshold, user-allocation terms, Foundation ratio and staking schedule.",
        ],
      },
      {
        heading: "How to read this model",
        paragraphs: [
          "This is the proposed model for the January 2027 launch window, not a token offer or a promise of allocation. Final parameters and any later amendments should be checked against published governance decisions.",
        ],
      },
      {
        heading: "Proposed parameters at a glance",
        paragraphs: [],
        bullets: [
          "Identity allocation: network-defined unique-identity threshold",
          "Activity: illustrative quarterly sign-in requirement",
          "Accrual horizon: illustrative 50 years",
          "Per 15 issued through VEID: 14 to eligible humans, 1 to the Foundation genesis account",
          "Staking issuance: proposed at roughly 90% lower than the prior model",
          "All parameters: amendable through consensus",
        ],
      },
    ],
    related: [
      { label: "Staking & validators", href: "/staking" },
      { label: "x/bme module", href: "/modules/bme" },
      { label: "For token holders", href: "/solutions/token-holders" },
      { label: "Governance guide", href: "/learn/governance-guide" },
    ],
  },
  {
    slug: "what-is-veid",
    title: "What is VEID (Verifiable Electronic Identity)?",
    label: "What is VEID?",
    metaDescription:
      "VEID is VirtEngine's privacy-preserving identity layer: on-device capture, active liveness, biometric hardware attestation, validator consensus scoring, and zero-knowledge proofs.",
    kicker: "Identity layer",
    intro:
      "VEID turns identity verification into a protocol function. Instead of outsourcing KYC to a company that warehouses your documents, VirtEngine's validator set scores encrypted identity evidence by consensus — and users prove facts about the result with zero-knowledge proofs, revealing nothing else.",
    diagram: "veid",
    diagramCaption: "The VEID pipeline: capture → liveness → attestation → encryption → consensus scoring → ZK tiers",
    sections: [
      {
        heading: "Capture happens on your device",
        paragraphs: [
          "The VEID mobile wallet (reference implementation: mobile/veid-capture-app/ in the protocol repo) captures identity evidence entirely on-device: documents with OCR, a selfie with active liveness challenges that defeat photos, replays, and injection attacks, and biometric hardware attestation — fingerprint or iris — bound to trusted hardware.",
          "Device integrity attestation (Play Integrity on Android, App Attest on iOS) proves the capture ran on a genuine, unmodified device and client. The evidence is sealed into encrypted identity scopes before anything leaves the phone.",
        ],
      },
      {
        heading: "Only approved clients may submit",
        paragraphs: [
          "Identity submissions are accepted only from client interfaces on the governance-controlled approved-client list (x/config), and must be signed by both the client and the user. Validators verify both signatures before scoring anything — the capture software's integrity is a governed trust decision, not an assumption.",
        ],
      },
      {
        heading: "Validators score by consensus",
        paragraphs: [
          "Encrypted scopes are sealed to validator recipients via x/encryption. Validators decrypt with their keys, evaluate the evidence with shared machine-learning models, and commit an identity trust score to the ledger by consensus. This validator-run identity verification network is the method protected by patent AU2024203136B2; compensation is governed by the conservative incentive policy, not a fixed VEID pool.",
          "Raw documents and biometrics never appear on the public ledger: the chain carries ciphertext and committed scores, nothing else.",
        ],
      },
      {
        heading: "Zero-knowledge disclosure",
        paragraphs: [
          "Once scored, users prove what matters through the ZK subsystem (x/veid/zk): that a trust score clears a threshold, or that an attribute holds — age range, residency — without revealing the document, the biometric, or the score itself. Counterparties learn exactly the fact they need and nothing more.",
        ],
      },
      {
        heading: "Why a marketplace needs this",
        paragraphs: [
          "Marketplace access on VirtEngine is identity-gated in both directions: providers verify tenants before workloads land on their hardware, and tenants verify providers before trusting them with workloads. Reviews bind to real leases between verified counterparties, making reputation farming structurally expensive. Sensitive account operations — recovery above all — layer on-chain MFA (x/mfa) over the identity foundation.",
          "The consumer-facing identity program is presented at identity.org.au; the protocol-side documentation lives at docs.virtengine.com.",
        ],
      },
    ],
    related: [
      { label: "VEID overview page", href: "/veid" },
      { label: "x/veid module", href: "/modules/veid" },
      { label: "x/encryption module", href: "/modules/encryption" },
      { label: "For validators", href: "/solutions/validators" },
    ],
  },
  {
    slug: "understanding-slashing",
    title: "Understanding slashing on VirtEngine",
    label: "Understanding slashing",
    metaDescription:
      "What gets a VirtEngine validator slashed, how slashing affects delegators, the 21-day unbonding period, and how to evaluate validator risk before delegating.",
    kicker: "Staking risk",
    intro:
      "Slashing is the enforcement mechanism that makes proof-of-stake promises credible: misbehave with bonded stake and the protocol destroys part of it. If you delegate, your stake shares that exposure. This guide states the risks plainly — because any staking product that doesn't is selling you something.",
    diagram: "staking",
    diagramCaption: "Stake, duties, rewards — and the slashing path for misbehavior",
    sections: [
      {
        heading: "What gets slashed",
        paragraphs: [
          "Two classes of validator misbehavior carry slashing consequences: equivocation — signing two different blocks at the same height, the cardinal consensus sin — and extended downtime that degrades network liveness. The economic security framework models slashing penalties explicitly as basis-point penalties on bonded stake.",
          "Slashing is distinct from marketplace enforcement: tenant or provider misconduct flows through the fraud module (x/fraud), while slashing addresses validator protocol violations specifically.",
        ],
      },
      {
        heading: "Delegators share the consequences",
        paragraphs: [
          "Delegation bonds your tokens to a validator's stake — including its liability. If your validator equivocates or goes dark, delegated stake is slashed alongside self-bonded stake. You are not lending tokens to a validator; you are underwriting its operations.",
        ],
      },
      {
        heading: "The unbonding period is part of the risk",
        paragraphs: [
          "Unbonding takes 21 days. During that window your stake earns no rewards and remains slashable for offenses the validator committed while your stake was bonded. The delay is not bureaucracy — it is what makes long-range attacks expensive, and the tokenomics framework analyzes exactly that vulnerability class.",
        ],
      },
      {
        heading: "Evaluating a validator",
        paragraphs: [
          "Commission is the least informative number on the page. What matters is operational quality:",
        ],
        bullets: [
          "Uptime history — downtime costs you rewards even when it isn't slashable",
          "Key management posture — consensus keys plus VEID encryption keys, both hardened",
          "Self-bond — validators with skin in the game share your slashing exposure",
          "Identity-network capacity — VirtEngine validators also run ML scoring duties",
          "Governance participation — absent validators are a governance liability",
        ],
      },
      {
        heading: "The dual-duty wrinkle",
        paragraphs: [
          "VirtEngine validators run consensus and the VEID Network. The second duty brings a second reward stream (the per-epoch pool) but also a second operational surface: encryption key custody and ML scoring workloads. When you evaluate a validator here, you are evaluating both operations.",
        ],
      },
    ],
    related: [
      { label: "Staking overview", href: "/staking" },
      { label: "For staking partners", href: "/solutions/staking-partners" },
      { label: "x/staking module", href: "/modules/staking" },
      { label: "Tokenomics explained", href: "/learn/tokenomics-explained" },
    ],
  },
  {
    slug: "provider-economics",
    title: "Provider economics on VirtEngine",
    label: "Provider economics",
    metaDescription:
      "The revenue model for VirtEngine providers: bid pricing, escrow-backed leases, zero marketplace commission, low validator transaction fees, and how benchmarks, audits, and reviews raise realised prices.",
    kicker: "Economics",
    intro:
      "A provider's business on VirtEngine reduces to three questions: what does capacity earn, what does the protocol charge, and what raises realized prices over time? The answers are unusually legible, because every term is chain state.",
    sections: [
      {
        heading: "Revenue: bids you price, escrow that pays",
        paragraphs: [
          "You set bid pricing strategy in the provider daemon; the marketplace matches it against demand. Every lease you win is backed by escrow funded before the workload starts — verifiable on-chain — so revenue risk is settled before capacity is committed.",
          "Usage is metered hourly and settles automatically after the 24-hour dispute window. There is no invoicing, no collections, and no accounts-receivable aging: settled usage is settled money.",
        ],
      },
      {
        heading: "Costs: validator fees and operations",
        paragraphs: [
          "VirtEngine charges 0% marketplace commission: settlement releases the agreed lease amount from escrow without a platform deduction. Chain transaction fees for actions such as bidding and usage submission compensate validators and are proposed at approximately 90% below standard network transaction fees. The daemon can manage those fees with batching. Your real cost base remains power, hardware, bandwidth, and people.",
        ],
      },
      {
        heading: "What raises realized prices",
        paragraphs: [
          "Anonymous capacity competes on price alone. Verified capacity competes on quality:",
        ],
        bullets: [
          "Benchmarks (x/benchmark) — published measured performance lets tenants pay for verified capability",
          "Auditor-signed attributes (x/audit) — attested region, tier, and compliance claims unlock orders that require them",
          "Reviews (x/review) — lease-bound reputation compounds with every served workload and is yours permanently",
          "Confidential compute (x/enclave) — attested TEE capability is a premium, filterable attribute",
        ],
      },
      {
        heading: "The demand side you're selling into",
        paragraphs: [
          "Orders arrive from identity-verified tenants with funded escrow — from containerized services to HPC batch jobs. Attribute-constrained orders (audited claims, benchmarked hardware, enclave attestation) are where differentiated operators escape pure price competition.",
        ],
      },
      {
        heading: "A worked lifecycle",
        paragraphs: [
          "A tenant posts an order; your daemon bids your configured price; the tenant accepts. The workload runs on your Kubernetes cluster or HPC scheduler. Hourly usage records — signed, anomaly-screened — accumulate against the lease. Each clears its dispute window and settles: escrow pays the agreed lease amount, with no marketplace commission deducted. Your track record grows by one more served lease, and the next order prices a little better.",
        ],
      },
    ],
    related: [
      { label: "Become a provider", href: "/providers" },
      { label: "Escrow & settlement explained", href: "/learn/escrow-and-settlement-explained" },
      { label: "Datacenter operators", href: "/solutions/datacenter-operators" },
      { label: "GPU compute providers", href: "/solutions/gpu-compute-providers" },
    ],
  },
  {
    slug: "confidential-computing-on-virtengine",
    title: "Confidential computing on VirtEngine",
    label: "Confidential computing",
    metaDescription:
      "How VirtEngine makes confidential compute verifiable: enclave attestation on-chain via x/enclave, encrypted payload delivery via x/encryption, and attested placement constraints.",
    kicker: "Security architecture",
    intro:
      "Confidential computing — running workloads inside hardware-isolated enclaves the host cannot inspect — solves a technical problem. VirtEngine solves the adjacent marketplace problem: proving to a paying counterparty that confidentiality actually holds, before secrets are delivered.",
    sections: [
      {
        heading: "The trust gap in rented compute",
        paragraphs: [
          "When a workload runs on someone else's hardware, the operator can normally read its memory. Trusted execution environments (TEEs) close that hole in silicon, producing attestations: hardware-signed evidence of exactly what code, in exactly what configuration, is running inside the enclave.",
          "But an attestation is only useful if the counterparty can verify it and act on it. That is the part VirtEngine puts on-chain.",
        ],
      },
      {
        heading: "Attestation as chain state",
        paragraphs: [
          "The enclave module (x/enclave) records and verifies TEE attestations against the state machine's expectations. A provider's confidential-compute capability becomes a verifiable on-chain claim — and a filterable attribute. Tenants can constrain orders to attested enclave execution, so unverified capacity never even matches.",
        ],
      },
      {
        heading: "Secrets released only after proof",
        paragraphs: [
          "The encryption module (x/encryption) implements envelope encryption to specific recipients. In confidential workflows, workload secrets — keys, model weights, sensitive configuration — are sealed so they can only be delivered into an enclave whose attestation has verified. The sequence is proof first, secrets second, and it is enforced by protocol machinery rather than provider goodwill.",
        ],
      },
      {
        heading: "The rest of the assurance stack",
        paragraphs: [
          "Confidential workloads inherit the marketplace's full trust apparatus: VEID-verified counterparties, chain-anchored mTLS (x/cert) on every off-chain connection, auditor-signed provider attributes (x/audit), and fraud enforcement with dispute intake if conduct fails. For enterprises, this is the difference between a confidentiality feature and a confidentiality argument that survives procurement review.",
        ],
      },
      {
        heading: "Where to apply it",
        paragraphs: [
          "The pattern fits wherever data or models must not be exposed to the infrastructure operator: regulated datasets, proprietary model weights during training or inference, key-handling services, and multi-party computations where participants trust the enclave but not each other.",
        ],
      },
    ],
    related: [
      { label: "Enterprise confidential compute", href: "/solutions/enterprises-confidential-compute" },
      { label: "x/enclave module", href: "/modules/enclave" },
      { label: "x/encryption module", href: "/modules/encryption" },
      { label: "AI/ML workloads", href: "/solutions/ai-ml-workloads" },
    ],
  },
  {
    slug: "hpc-on-virtengine",
    title: "HPC on VirtEngine",
    label: "HPC on VirtEngine",
    metaDescription:
      "How VirtEngine brings supercomputing into the marketplace: the x/hpc job model, SLURM/MOAB/Open OnDemand adapters, job lifecycle management, and settlement for batch work.",
    kicker: "Supercomputing",
    intro:
      "HPC is the marketplace's most distinctive capability: batch supercomputing capacity, offered and settled on-chain, executing through the schedulers clusters already run. No re-platforming, no container shim around a batch queue — a native job model.",
    sections: [
      {
        heading: "Why HPC needs its own module",
        paragraphs: [
          "Supercomputing does not sell like cloud: work arrives as jobs with resource requirements, walltime limits, and partition targets, scheduled by systems like SLURM against allocation policies. Forcing that model into long-running container leases loses everything that makes HPC HPC.",
          "The x/hpc module models batch work natively: on-chain HPC jobs are first-class marketplace objects with their own lifecycle, offered and priced through the same exchange economics as everything else.",
        ],
      },
      {
        heading: "Scheduler adapters, not replacements",
        paragraphs: [
          "The provider daemon's HPC integration connects to existing cluster controllers through native adapters — SLURM with munge or JWT authentication and per-partition configuration, plus MOAB and Open OnDemand. The cluster's scheduler remains in charge of its own resources; the marketplace becomes another source of authorized work.",
        ],
      },
      {
        heading: "Job lifecycle, engineered for failure",
        paragraphs: [
          "A job lifecycle service polls on-chain jobs, dispatches them through the adapter, and tracks them to completion with configurable concurrency limits and timeouts. State recovery is crash-safe: a daemon restart does not orphan running jobs or double-dispatch queued ones. Job events, security events, and usage reports flow to a dedicated audit log.",
        ],
      },
      {
        heading: "Settlement identical to cloud workloads",
        paragraphs: [
          "HPC usage batches enter the same pipeline as container leases: signed records, the 24-hour dispute window, escrow drawdown, the governed take. For facilities, that means spare-cycle monetization lands as settled chain payments — no new billing infrastructure, no invoicing external users.",
        ],
      },
      {
        heading: "Who this serves",
        paragraphs: [
          "Facilities monetize idle cycles at prices they set per partition, without disturbing primary-user allocations. Tenants — ML teams above all — get access to scheduler-class capacity with real interconnects, through an order they can post today instead of an allocation process measured in months. The operational detail lives in docs/hpc-provider-operations.md, docs/hpc-node-agent.md, and docs/hpc-workload-publishing.md in the protocol repo.",
        ],
      },
    ],
    related: [
      { label: "HPC clusters solution", href: "/solutions/hpc-clusters" },
      { label: "x/hpc module", href: "/modules/hpc" },
      { label: "AI/ML workloads", href: "/solutions/ai-ml-workloads" },
      { label: "Provider overview", href: "/providers" },
    ],
  },
  {
    slug: "governance-guide",
    title: "Governance on VirtEngine",
    label: "Governance guide",
    metaDescription:
      "How VirtEngine is governed: bonded-stake voting, governed issuance and validator-fee parameters, roles and configuration, and Foundation stewardship.",
    kicker: "Governance",
    intro:
      "VirtEngine's answer to \"who controls this?\" has two layers: on-chain governance by bonded stake for protocol decisions, and a not-for-profit foundation whose constitution forbids private capture of the project itself. This guide covers both.",
    sections: [
      {
        heading: "Bonded stake governs",
        paragraphs: [
          "Validators and delegators vote with bonded stake on parameter changes, software upgrades, and chain configuration. Economic parameters — staking targets, validator-fee parameters and issuance policy — are chain state, adjustable by proposal rather than by decree. Marketplace commission is set to zero. If you delegate, your stake carries governance weight; using it is part of the job.",
        ],
      },
      {
        heading: "The approved-client list",
        paragraphs: [
          "The most consequential governed object is the approved-client list in x/config: the set of client interfaces permitted to submit VEID identity data. Because identity capture happens in software, the integrity of that software is a trust decision — and VirtEngine puts it to a stakeholder vote with a public proposal trail, rather than leaving it to any single party.",
        ],
      },
      {
        heading: "Governed economics",
        paragraphs: [],
        bullets: [
          "Marketplace commission — 0% of settled marketplace payments",
          "Validator transaction-fee parameters — proposed at approximately 90% below standard networks",
          "Issuance policy — VEID-led 15-token batches: 14 to eligible humans and 1 to the Foundation genesis account",
          "Chain configuration — operational parameters queryable as state",
        ],
      },
      {
        heading: "Roles and administrative power",
        paragraphs: [
          "Privileged capabilities resolve through the roles module (x/roles): auditor status, administrative operations, and configuration changes all require appropriately-roled accounts, with role grants themselves recorded as transactions. Administrative power on VirtEngine is enumerable — you can query who may do what.",
        ],
      },
      {
        heading: "The stewardship layer",
        paragraphs: [
          "Above the chain sits DETIO FOUNDATION LTD, an Australian not-for-profit public company limited by guarantee (ACN 699 651 771) that stewards the protocol, patent rights, identity system, chain, and token. Its constitution imposes a public-benefit lock: no operation for private commercial interests, no dividends, no private capture of the IP — and on winding-up, assets pass to another public-benefit entity.",
          "The division of labor is deliberate: stakeholders govern the running protocol; the foundation's constitution guarantees no one can take the protocol itself private.",
        ],
      },
    ],
    related: [
      { label: "About the foundation", href: "/about" },
      { label: "x/config module", href: "/modules/config" },
      { label: "Open source & patent", href: "/open-source" },
      { label: "Tokenomics explained", href: "/learn/tokenomics-explained" },
    ],
  },
  {
    slug: "mainnet-roadmap",
    title: "The road to mainnet",
    label: "Mainnet roadmap",
    metaDescription:
      "VirtEngine's mainnet posture: planned for the January 2027 launch window, with guidance on verifying status and release materials.",
    kicker: "Network",
    intro:
      "VirtEngine's launch posture is unusual for the industry: it is a checked-in, versioned decision record, not a marketing countdown. This guide reports exactly what the repository records and shows you how to verify it yourself.",
    sections: [
      {
        heading: "The decision record",
        paragraphs: [
          "Mainnet is planned for the January 2027 launch window. The final date and release materials will be published through the formal launch process.",
          "The network should not be described as live before formal launch confirmation. Verify current status from published release materials rather than assuming a service is available.",
        ],
      },
      {
        heading: "What is already checked in",
        paragraphs: [],
        bullets: [
          "config/mainnet/ — final canonical allocations and the genesis publication bundle",
          "_docs/operations/mainnet-go-no-go-decision.md — the formal launch decision record",
          "RELEASE.md and VERIFICATION.md — release engineering and artifact verification posture",
          "docs/COMPATIBILITY.md — version and deployment compatibility guidance",
        ],
      },
      {
        heading: "What launch means operationally",
        paragraphs: [
          "At launch, validators bring the chain up against the published bundle, with the governance-approved economic parameters active from block one: identity-led allocation, conservative staking incentives, and the marketplace settlement machinery.",
        ],
      },
      {
        heading: "How to verify before you operate",
        paragraphs: [
          "Operators preparing for launch should verify three things directly from the repository: that the release tag they intend to run has actually been published, that the target network has an approved launch or upgrade decision, and that the verification posture in VERIFICATION.md matches their deployment. Genesis materials should be validated against the published bundle in config/mainnet/.",
        ],
      },
      {
        heading: "After genesis",
        paragraphs: [
          "Post-launch, network truth is chain state: parameters are queryable from any node, governance proposals are public, and upgrades follow the coordination machinery stakeholders vote on. The repository remains the source of truth for releases and operational posture — the habit of verifying against it should outlive launch day.",
        ],
      },
    ],
    related: [
      { label: "Network status", href: "/network" },
      { label: "For validators", href: "/solutions/validators" },
      { label: "Staking overview", href: "/staking" },
      { label: "Open source project", href: "/open-source" },
    ],
  },
];

export function getLearn(slug: string): LearnEntry | undefined {
  return LEARN.find((l) => l.slug === slug);
}
