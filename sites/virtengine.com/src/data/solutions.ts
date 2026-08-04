/**
 * Solutions: audience & use-case pages. Powers /solutions/[slug].
 * All capability claims are grounded in repos/virtengine (modules, docs);
 * economics figures come from docs/tokenomics-analysis.md and
 * docs/usage-reporting-settlement.md. No invented statistics.
 */

export interface SolutionSection {
  heading: string;
  paragraphs: string[];
  /** Optional bullet list rendered after the paragraphs. */
  bullets?: string[];
}

export interface SolutionEntry {
  slug: string;
  /** Short label for cards and nav. */
  label: string;
  title: string;
  metaDescription: string;
  /** Who this page is for, one line. */
  audience: string;
  intro: string;
  problem: SolutionSection;
  approach: SolutionSection[];
  economics: SolutionSection;
  gettingStarted: { step: string; detail: string }[];
  related: { label: string; href: string }[];
}

export const SOLUTIONS: SolutionEntry[] = [
  {
    slug: "gpu-compute-providers",
    label: "GPU compute providers",
    title: "Monetize GPU capacity on an open marketplace",
    metaDescription:
      "How GPU operators lease accelerator capacity into the VirtEngine marketplace: on-chain bidding, benchmark-backed offers, hourly usage settlement, and escrow-secured payment.",
    audience: "Operators with GPU fleets — from a few nodes to full accelerator clusters.",
    intro:
      "GPU capacity is scarce, expensive to own, and painful to sell in small increments. VirtEngine gives GPU operators a marketplace where accelerator capacity is leased on-chain, metered hourly, and paid from escrow — without building a billing department.",
    problem: {
      heading: "The problem: GPUs earn nothing between customers",
      paragraphs: [
        "Accelerators are the most capital-intensive hardware in any datacenter, and they depreciate whether or not they are busy. Selling spare GPU-hours conventionally means marketing, sales contracts, payment risk, and per-customer billing plumbing — overhead that only makes sense at large scale.",
        "Meanwhile demand exists everywhere: teams that need training or inference capacity for days or weeks, not years, and cannot get allocation from the big clouds at acceptable prices.",
      ],
    },
    approach: [
      {
        heading: "List capacity as attribute-rich offers",
        paragraphs: [
          "Register as a provider (x/provider) with attributes describing your GPU classes, and publish hardware benchmarks (x/benchmark) so tenants compare your capacity on measured performance rather than spec sheets. Tenant orders that require your attributes are matched to your bids by the on-chain exchange (x/market).",
        ],
      },
      {
        heading: "Let the daemon run the marketplace",
        paragraphs: [
          "The provider daemon watches open orders, bids per your configured pricing strategy, and instantiates won leases on your Kubernetes cluster. Usage is metered per workload on an hourly cadence and submitted on-chain as signed records — you operate hardware, the protocol operates the exchange.",
        ],
      },
      {
        heading: "Trust the counterparty before the workload lands",
        paragraphs: [
          "Every tenant is VEID-verified before they can transact, and their lease is backed by funded escrow you can verify on-chain. Reviews and reputation (x/review) compound with every successfully served lease.",
        ],
      },
    ],
    economics: {
      heading: "Economics",
      paragraphs: [
        "Payment releases from lease escrow after each usage record clears its 24-hour dispute window — no invoicing, no accounts receivable and no marketplace commission deducted at payout. You set your own bid pricing; validator transaction fees apply only to on-chain actions and are proposed at approximately 90% below standard network transaction fees.",
      ],
    },
    gettingStarted: [
      { step: "Complete VEID verification", detail: "Marketplace participation is identity-gated in both directions." },
      { step: "Register on-chain with GPU attributes", detail: "Create your provider record with accelerator classes, region, and certifications." },
      { step: "Publish benchmarks", detail: "Measured GPU performance data makes your offers stand out to tenants filtering on capability." },
      { step: "Deploy the provider daemon", detail: "Point it at your Kubernetes cluster, connect your chain key, and set pricing rules." },
      { step: "Bid, serve, settle", detail: "The daemon bids on matching orders; usage settles hourly from escrow." },
    ],
    related: [
      { label: "Provider overview", href: "/providers" },
      { label: "Provider economics explained", href: "/learn/provider-economics" },
      { label: "x/benchmark module", href: "/modules/benchmark" },
      { label: "Escrow & settlement explained", href: "/learn/escrow-and-settlement-explained" },
    ],
  },
  {
    slug: "datacenter-operators",
    label: "Datacenter operators",
    title: "Turn datacenter headroom into settled revenue",
    metaDescription:
      "How datacenter and cloud operators lease spare capacity into the VirtEngine marketplace: provider registration, auditor-signed attributes, automated settlement, and portable reputation.",
    audience: "Datacenter and cloud operators with underutilized compute, storage, or network capacity.",
    intro:
      "Datacenters run at partial utilization by design — headroom is the product. VirtEngine lets operators sell that headroom into an open marketplace with protocol-run metering, billing, and payment, while keeping full control of their infrastructure and pricing.",
    problem: {
      heading: "The problem: stranded capacity, heavy sales motion",
      paragraphs: [
        "Between anchor tenants, every rack of provisioned-but-idle capacity is a cost center. Selling it retail means building a cloud business: portals, billing, support, payment risk, and marketing against hyperscalers.",
        "Wholesale channels exist but demand long contracts and big minimums — exactly what the spot demand side of the market doesn't want.",
      ],
    },
    approach: [
      {
        heading: "One daemon between the chain and your stack",
        paragraphs: [
          "The provider daemon translates on-chain leases into workloads on your existing Kubernetes infrastructure, meters usage per workload, and reports signed records back to the chain. Your operations stay yours; the marketplace interface is software you run.",
        ],
      },
      {
        heading: "Attributes and audits do the selling",
        paragraphs: [
          "Your provider record carries the attributes tenants filter on — region, tier, certifications, hardware classes. Auditor-signed attributes (x/audit) turn your claims into attestations, and on-chain reviews build a track record that is yours permanently, not a platform's hostage.",
        ],
      },
      {
        heading: "Identity-gated counterparties",
        paragraphs: [
          "VEID verification means workloads arriving on your hardware come from verified, accountable tenants — with fraud reporting and enforcement (x/fraud) behind the marketplace if conduct goes wrong.",
        ],
      },
    ],
    economics: {
      heading: "Economics",
      paragraphs: [
        "Every lease is backed by escrow funded before the workload starts, so payment risk is settled before you commit capacity. Usage settles on an hourly cadence with a 24-hour dispute window; the marketplace commission is 0%. Validator transaction fees apply to the chain actions, not to the settled lease payment.",
      ],
    },
    gettingStarted: [
      { step: "Verify with VEID", detail: "Operator identity verification is the entry requirement for providing." },
      { step: "Register your provider record", detail: "Declare region, hardware, and certification attributes on-chain." },
      { step: "Engage an auditor", detail: "Auditor-signed attributes command trust from tenants filtering on attested claims." },
      { step: "Deploy the provider daemon", detail: "Connect it to Kubernetes, configure capacity and pricing, and go live." },
      { step: "Compound reputation", detail: "Served leases accrue reviews and standing that win better-priced leases over time." },
    ],
    related: [
      { label: "Provider overview", href: "/providers" },
      { label: "x/audit module", href: "/modules/audit" },
      { label: "How the marketplace works", href: "/learn/how-the-marketplace-works" },
      { label: "Provider economics explained", href: "/learn/provider-economics" },
    ],
  },
  {
    slug: "hpc-clusters",
    label: "HPC clusters",
    title: "Put supercomputing capacity on the marketplace",
    metaDescription:
      "How HPC facilities running SLURM, MOAB, or Open OnDemand lease batch capacity through VirtEngine's x/hpc job marketplace — without re-platforming the cluster.",
    audience: "University, national-lab, and commercial HPC facilities running batch schedulers.",
    intro:
      "HPC clusters are among the most valuable compute assets in existence, and most run with idle cycles. VirtEngine's HPC module brings scheduler-backed batch capacity into the marketplace natively — your SLURM, MOAB, or Open OnDemand cluster stays exactly as it is.",
    problem: {
      heading: "The problem: batch capacity doesn't fit cloud leases",
      paragraphs: [
        "HPC operates on jobs, allocations, partitions, and walltime — not long-running container leases. Generic cloud marketplaces can't express that model, so cluster operators wanting to monetize spare cycles have had no marketplace that speaks their language.",
        "External users, meanwhile, face months-long allocation processes to access supercomputing capacity that may be idling right now.",
      ],
    },
    approach: [
      {
        heading: "A job marketplace, not a container shim",
        paragraphs: [
          "The x/hpc module models batch work natively: on-chain HPC jobs with resource, walltime, and partition requirements, offered and priced through the same exchange economics as the rest of the marketplace.",
        ],
      },
      {
        heading: "Native scheduler adapters",
        paragraphs: [
          "The provider daemon's HPC integration speaks to your existing controller — munge or JWT auth for SLURM, per-partition configuration — and executes on-chain jobs on your cluster with configurable concurrency limits, timeouts, and crash-safe state recovery.",
        ],
        bullets: [
          "SLURM adapter with munge/JWT authentication and per-partition configuration",
          "MOAB and Open OnDemand adapters for existing deployments",
          "Job lifecycle service with polling, dispatch, tracking, and recovery",
          "Dedicated audit log for job events, security events, and usage",
        ],
      },
      {
        heading: "Same settlement rails as everything else",
        paragraphs: [
          "HPC usage batches flow into the standard usage-settlement pipeline: signed records, 24-hour dispute window, escrow release. Your finance office sees settled payments, not a new billing system to run.",
        ],
      },
    ],
    economics: {
      heading: "Economics",
      paragraphs: [
        "Jobs are paid from tenant escrow like any lease, with no protocol commission deducted at settlement. Facilities set their own pricing per partition and job class — spare-cycle monetization at prices you control, without disturbing allocation commitments to primary users. Validator transaction fees apply only to chain operations.",
      ],
    },
    gettingStarted: [
      { step: "Review the HPC provider docs", detail: "docs/hpc-provider-operations.md covers the full operational model." },
      { step: "Register as a provider", detail: "Declare HPC attributes — scheduler type, partitions, hardware — on-chain." },
      { step: "Configure the HPC integration", detail: "Connect the daemon's scheduler adapter to your controller with munge or JWT auth." },
      { step: "Expose partitions", detail: "Choose which partitions and job classes the marketplace may schedule into." },
      { step: "Serve jobs and settle", detail: "On-chain jobs dispatch through your scheduler; usage settles from escrow." },
    ],
    related: [
      { label: "x/hpc module", href: "/modules/hpc" },
      { label: "HPC on VirtEngine explained", href: "/learn/hpc-on-virtengine" },
      { label: "Provider overview", href: "/providers" },
      { label: "Escrow & settlement explained", href: "/learn/escrow-and-settlement-explained" },
    ],
  },
  {
    slug: "validators",
    label: "Validators",
    title: "Run a validator with a dual mandate",
    metaDescription:
      "Running a VirtEngine validator: CometBFT consensus duties plus the VEID Network, reward composition, slashing risk, and how to prepare for mainnet.",
    audience: "Professional node operators and infrastructure teams considering the validator role.",
    intro:
      "VirtEngine validators do more than order blocks. The same bonded set that secures CometBFT consensus also operates the VEID Network — decrypting encrypted identity scopes, scoring them with shared ML models, and committing trust scores by consensus. Two duties, one stake, layered rewards.",
    problem: {
      heading: "The context: consensus alone is commoditized",
      paragraphs: [
        "Generic proof-of-stake validation is a race to the bottom on commission. Differentiated networks give validators real work with real reward streams attached — and demand real operational competence in exchange.",
      ],
    },
    approach: [
      {
        heading: "Duty one: consensus",
        paragraphs: [
          "Propose and validate blocks under CometBFT, with bonded stake weighting voting power. Uptime and correctness earn block rewards; double-signing and extended downtime are slashable.",
        ],
      },
      {
        heading: "Duty two: the identity network",
        paragraphs: [
          "Validators hold encryption keys that identity scopes are sealed to, run the shared machine-learning scoring models, and commit VEID trust scores by consensus — the patented method (AU2024203136B2) at the heart of the protocol. Compensation is governed by the conservative staking and issuance policy; no fixed VEID pool is promised.",
        ],
      },
      {
        heading: "Duty three: governance",
        paragraphs: [
          "Validators vote on parameter changes, upgrades, and chain configuration — including the approved-client list controlling which interfaces may submit identity data. Governance participation is part of the operational mandate.",
        ],
      },
    ],
    economics: {
      heading: "Economics",
      paragraphs: [
        "Validator income remains governance-controlled and conservative relative to the prior model. Staking rewards, commission, unbonding and slashing conditions are protocol parameters, not fixed-return promises; slashing risk applies to delegated stake too.",
      ],
    },
    gettingStarted: [
      { step: "Study the launch posture", detail: "Mainnet is planned for January 2027. Verify formal launch confirmation and release materials before operating." },
      { step: "Provision secure infrastructure", detail: "High-uptime hosts plus hardened key management for consensus and VEID encryption keys." },
      { step: "Plan for identity-network duties", detail: "ML scoring of encrypted scopes runs alongside consensus — size accordingly." },
      { step: "Bond stake and attract delegation", detail: "Self-bond, publish your operational record, and earn delegations." },
      { step: "Participate in governance", detail: "Vote on upgrades and configuration from day one." },
    ],
    related: [
      { label: "Staking & validators", href: "/staking" },
      { label: "Understanding slashing", href: "/learn/understanding-slashing" },
      { label: "Network status & genesis", href: "/network" },
      { label: "What is VEID?", href: "/learn/what-is-veid" },
    ],
  },
  {
    slug: "staking-partners",
    label: "Staking partners",
    title: "Build staking services on a first-class delegation layer",
    metaDescription:
      "For staking-as-a-service providers: how VirtEngine's x/delegation module supports client offerings, what reward streams exist, and how to represent slashing and unbonding risk.",
    audience: "Staking-as-a-service businesses, custodians, and exchanges offering staking products.",
    intro:
      "VirtEngine's delegation lifecycle is a module, not an afterthought: delegate, redelegate, unbond, and collect rewards entirely on-chain. Staking partners can operate validators, aggregate client delegations, or both — with reward streams that include the identity network's dedicated pool.",
    problem: {
      heading: "The context: differentiated staking products need differentiated chains",
      paragraphs: [
        "Staking yields on generic chains converge; products built on them compete only on fees. Networks where validators perform distinctive work — like VirtEngine's identity scoring — offer reward composition and a narrative that staking products can actually differentiate on.",
      ],
    },
    approach: [
      {
        heading: "A complete on-chain lifecycle",
        paragraphs: [
          "x/delegation manages delegation, redelegation between validators, unbonding, and reward collection as protocol state. Client funds remain in client control — delegation grants voting weight, not custody — which simplifies the custodial story for regulated partners.",
        ],
      },
      {
        heading: "Reward composition worth explaining",
        paragraphs: [
          "Delegator rewards derive from governance-controlled validator incentives, net of commission. The proposed staking allocation is roughly 90% lower than the prior model, and no fixed APR is promised.",
        ],
      },
      {
        heading: "Duty of candor, supported by the protocol",
        paragraphs: [
          "Slashing applies to delegated stake, and the 21-day unbonding period earns nothing while remaining slashable. These parameters are chain state — quote them from the source and represent them plainly to customers.",
        ],
      },
    ],
    economics: {
      heading: "Economics",
      paragraphs: [
        "Partner revenue is validator commission and/or service fees on aggregated delegations. Validator selection is the product: operational quality determines both reward capture and slashing exposure, and on-chain performance records make quality verifiable.",
      ],
    },
    gettingStarted: [
      { step: "Decide the operating model", detail: "Run validators, aggregate delegations to third-party validators, or both." },
      { step: "Integrate x/delegation", detail: "The full lifecycle — delegate, redelegate, unbond, claim — is standard chain messaging." },
      { step: "Build risk disclosure", detail: "Surface slashing and the 21-day unbonding period explicitly in the client experience." },
      { step: "Select validators on quality", detail: "Uptime and standing, not just commission, drive client outcomes." },
    ],
    related: [
      { label: "Staking & validators", href: "/staking" },
      { label: "x/delegation module", href: "/modules/delegation" },
      { label: "Tokenomics explained", href: "/learn/tokenomics-explained" },
      { label: "Understanding slashing", href: "/learn/understanding-slashing" },
    ],
  },
  {
    slug: "token-holders",
    label: "Token holders",
    title: "What holding the token actually does",
    metaDescription:
      "For VirtEngine token holders: how delegation secures the network, how burn-and-mint links supply to marketplace demand, governance rights, and the risks stated plainly.",
    audience: "Token holders deciding whether and how to participate beyond holding.",
    intro:
      "VirtEngine's token is a working asset: it prices compute, funds escrow, bonds validators, weights governance, and burns against marketplace demand. Holders who delegate contribute directly to network security — and share in the rewards that security earns.",
    problem: {
      heading: "The context: passive holding secures nothing",
      paragraphs: [
        "Proof-of-stake networks depend on validators and delegators who commit capital and operational work to security. The final security parameters are set through governance.",
      ],
    },
    approach: [
      {
        heading: "Delegate without giving up custody",
        paragraphs: [
          "Delegation bonds your tokens to a validator's stake while they remain yours. You earn a share of the validator's rewards — block proposals, VEID verification, uptime — net of commission. Spreading stake across smaller validators strengthens the network's Nakamoto coefficient.",
        ],
      },
      {
        heading: "Supply that responds to real usage",
        paragraphs: [
          "Issuance policy is chain state, changeable only by governance. The proposed model prioritises allocations to accounts that meet the network-defined unique-identity threshold and remain active, with conservative staking rewards retained for security.",
        ],
      },
      {
        heading: "Governance weight",
        paragraphs: [
          "Bonded stake votes: parameter changes, upgrades, the approved-client list, validator-fee parameters and issuance policy. Holding plus delegating equals a voice in how the protocol evolves.",
        ],
      },
    ],
    economics: {
      heading: "Risks, stated plainly",
      paragraphs: [
        "Delegated stake is slashable for your validator's misbehavior — double-signing or extended downtime. Unbonding takes 21 days, during which stake earns nothing and remains slashable for prior offenses. APR varies with the dynamic inflation mechanism. Choose validators on operational quality, not just commission, and treat any staking-service marketing that omits these facts as a red flag.",
      ],
    },
    gettingStarted: [
      { step: "Understand the economics", detail: "Read the tokenomics explainer before bonding anything." },
      { step: "Research validators", detail: "Uptime history, self-bond, commission, and governance participation all matter." },
      { step: "Delegate", detail: "Bond stake via x/delegation from any supported wallet or interface." },
      { step: "Vote", detail: "Participate in governance proposals your bonded stake entitles you to." },
    ],
    related: [
      { label: "Tokenomics explained", href: "/learn/tokenomics-explained" },
      { label: "Staking overview", href: "/staking" },
      { label: "x/bme module", href: "/modules/bme" },
      { label: "Governance guide", href: "/learn/governance-guide" },
    ],
  },
  {
    slug: "web3-developers",
    label: "Web3 developers",
    title: "Build on a chain that sells real compute",
    metaDescription:
      "For developers building on VirtEngine: the Cosmos SDK module surface, gRPC/REST access, deployment workflows, approved clients, and where to start in the open-source repo.",
    audience: "Developers building wallets, tooling, marketplaces, and applications on the protocol.",
    intro:
      "VirtEngine is a Cosmos SDK chain whose state machine runs a real economy: orders, leases, usage, settlement, identity. For developers, that means a rich, typed module surface to build against — and a marketplace whose transactions do something physical.",
    problem: {
      heading: "The context: most chains have nothing to integrate with",
      paragraphs: [
        "Generic L1s offer developers token transfers and smart-contract sandboxes. Application-specific chains offer something better: domain state machines with real workflows — but only if the module surface is coherent and documented.",
      ],
    },
    approach: [
      {
        heading: "A typed module surface",
        paragraphs: [
          "Twenty-seven modules expose the marketplace as protocol state: query orders and bids (x/market), inspect provider records and attributes (x/provider), track settlement and escrow flows, resolve identity state through the VEID registry. Standard Cosmos SDK gRPC and REST endpoints serve all of it.",
        ],
      },
      {
        heading: "Deployment tooling",
        paragraphs: [
          "The virtengine binary is both node and client: create deployments, manage certificates for mTLS with providers, fund escrow, and query lease state from the CLI or programmatically. Workloads are described declaratively and fan out to orders via deployment groups.",
        ],
      },
      {
        heading: "The approved-client path",
        paragraphs: [
          "Identity-submitting clients are governed: the x/config approved-client list controls which interfaces may submit VEID identity data, and validators verify client and user signatures before scoring. If you are building identity-capable clients, that governance process is your integration path — study the VEID capture reference app in mobile/veid-capture-app/.",
        ],
      },
    ],
    economics: {
      heading: "Economics for builders",
      paragraphs: [
        "Marketplace transactions carry standard chain fees, and services priced in tokens settle through escrow with the governed take. Building deployment tooling, provider dashboards, staking interfaces, or analytics requires no permission — the chain surface is open. Identity-data submission alone requires approved-client governance.",
      ],
    },
    gettingStarted: [
      { step: "Clone the repo", detail: "github.com/virtengine/virtengine — Go 1.25.5, make virtengine builds the binary." },
      { step: "Read the module docs", detail: "Module reference on this site plus protocol docs at docs.virtengine.com." },
      { step: "Run a local environment", detail: "_docs/development-environment.md walks through local chain setup." },
      { step: "Build against gRPC/REST", detail: "Standard Cosmos SDK client patterns apply across all modules." },
    ],
    related: [
      { label: "Module reference", href: "/modules" },
      { label: "Open source project", href: "/open-source" },
      { label: "How the marketplace works", href: "/learn/how-the-marketplace-works" },
      { label: "Protocol architecture", href: "/protocol" },
    ],
  },
  {
    slug: "enterprises-confidential-compute",
    label: "Confidential compute",
    title: "Confidential computing with proof, not promises",
    metaDescription:
      "How enterprises run sensitive workloads on VirtEngine: enclave attestation via x/enclave, end-to-end encryption via x/encryption, mTLS, and identity-verified counterparties.",
    audience: "Enterprises with regulated data, proprietary models, or confidentiality obligations.",
    intro:
      "Moving sensitive workloads to third-party infrastructure normally means trusting the operator. VirtEngine replaces that trust with verification: hardware enclave attestation recorded on-chain, payload encryption to attested targets, and identity-verified counterparties on both sides of every lease.",
    problem: {
      heading: "The problem: confidentiality claims you can't verify",
      paragraphs: [
        "Every cloud claims strong isolation; few let you cryptographically verify what actually runs where. For regulated data and proprietary models, an unverifiable claim is a compliance gap — and multi-tenant infrastructure amplifies the exposure.",
      ],
    },
    approach: [
      {
        heading: "Attestation as marketplace state",
        paragraphs: [
          "Providers offering confidential compute prove it: enclave attestations — hardware-signed evidence of the exact measured code and configuration running in a TEE — are verified through x/enclave. Orders can require attested enclave execution as a placement constraint, so unverified capacity never matches.",
        ],
      },
      {
        heading: "Secrets sealed to verified targets",
        paragraphs: [
          "The encryption module delivers workload secrets encrypted to specific recipients — released only after attestation verifies. Connections between your clients and provider endpoints authenticate mutually via chain-anchored TLS certificates (x/cert).",
        ],
      },
      {
        heading: "Counterparties you can underwrite",
        paragraphs: [
          "Providers are VEID-verified, attribute-audited (x/audit), benchmarked, and reviewed on-chain. Fraud enforcement and dispute intake give conduct violations a rule-bound consequence path — the assurance stack procurement teams actually need.",
        ],
      },
    ],
    economics: {
      heading: "Economics",
      paragraphs: [
        "Confidential capacity is priced by the same open bidding as everything else — attested enclave capability is a provider attribute, so its premium is set by supply and demand, not by a vendor's enterprise price list. Escrow-backed leases and hourly settlement give finance teams a clean, auditable cost trail.",
      ],
    },
    gettingStarted: [
      { step: "Define the trust requirements", detail: "Which workloads need attested enclaves, and what measurements you will accept." },
      { step: "Constrain orders to attested capacity", detail: "Require enclave attributes and auditor-signed claims in placement constraints." },
      { step: "Verify attestation flow", detail: "Confirm measurement verification and encrypted secret delivery end to end." },
      { step: "Start with a contained workload", detail: "Prove the model on a bounded dataset before scaling scope." },
    ],
    related: [
      { label: "Confidential computing explained", href: "/learn/confidential-computing-on-virtengine" },
      { label: "x/enclave module", href: "/modules/enclave" },
      { label: "x/encryption module", href: "/modules/encryption" },
      { label: "What is VEID?", href: "/learn/what-is-veid" },
    ],
  },
  {
    slug: "ai-ml-workloads",
    label: "AI/ML workloads",
    title: "Source training and inference capacity on-chain",
    metaDescription:
      "Running AI/ML workloads on VirtEngine: GPU capacity sourced by open bidding, benchmark-verified hardware, HPC scheduler access for large jobs, and confidential options for proprietary models.",
    audience: "ML teams that need training or inference capacity without hyperscaler lock-in.",
    intro:
      "AI teams are capacity-constrained and price-taking. VirtEngine inverts the relationship: describe what you need, let providers bid, verify hardware through published benchmarks, and pay only for metered usage from escrow you control.",
    problem: {
      heading: "The problem: allocation queues and opaque pricing",
      paragraphs: [
        "GPU allocation at major clouds means waitlists, committed-use contracts, and prices set by scarcity you can't see. Specialized GPU clouds improve price but reintroduce single-vendor risk — and rarely let you verify the hardware behind the SKU.",
      ],
    },
    approach: [
      {
        heading: "Demand-side market power",
        paragraphs: [
          "Post an order specifying accelerators, memory, region, and required attributes; provider daemons bid against it. Competition happens per order, continuously — not per contract cycle. Benchmark records (x/benchmark) let you verify measured performance before accepting a bid.",
        ],
      },
      {
        heading: "Batch jobs on real HPC",
        paragraphs: [
          "Large training runs fit the HPC path: on-chain jobs with walltime and partition requirements executing on SLURM-class clusters through native adapters — supercomputing-grade interconnects included, no re-platforming on either side.",
        ],
      },
      {
        heading: "Protect the model itself",
        paragraphs: [
          "For proprietary weights and sensitive training data, require attested enclave execution (x/enclave) and encrypted secret delivery (x/encryption). Counterparty risk is bounded by VEID verification and on-chain reputation in both directions.",
        ],
      },
    ],
    economics: {
      heading: "Economics",
      paragraphs: [
        "You fund escrow; providers draw against it only as metered usage settles — hourly records, 24-hour dispute window, anomaly detection before submission. Idle budget returns to you when the deployment closes. Cost control is structural, not a billing-alert afterthought.",
      ],
    },
    gettingStarted: [
      { step: "Describe the workload", detail: "Resources, accelerator classes, region, and attribute constraints in a deployment spec." },
      { step: "Set placement requirements", detail: "Benchmarked hardware, audited attributes, or attested enclaves as needed." },
      { step: "Fund escrow and post the order", detail: "Bids arrive from matching providers; you choose the winner." },
      { step: "Monitor usage and settlement", detail: "Metered records and settlement state are queryable chain data." },
    ],
    related: [
      { label: "GPU compute providers", href: "/solutions/gpu-compute-providers" },
      { label: "HPC on VirtEngine", href: "/learn/hpc-on-virtengine" },
      { label: "Confidential computing", href: "/learn/confidential-computing-on-virtengine" },
      { label: "Escrow & settlement explained", href: "/learn/escrow-and-settlement-explained" },
    ],
  },
  {
    slug: "cost-optimized-cloud",
    label: "Cost-optimized cloud",
    title: "Cloud economics set by open bidding",
    metaDescription:
      "How tenants cut compute costs on VirtEngine: competitive per-order bidding, escrow-metered spending, no egress lock-in games, and workload portability across providers.",
    audience: "Teams whose cloud bills grew faster than their workloads.",
    intro:
      "Cloud pricing is a menu written by the seller. VirtEngine replaces the menu with an auction: every order is bid on by competing providers, every hour of usage is metered and disputable, and unspent budget comes back. Cost optimization stops being a dashboard discipline and becomes market structure.",
    problem: {
      heading: "The problem: list prices and lock-in",
      paragraphs: [
        "Hyperscaler economics depend on list prices few pay attention to, egress fees that punish leaving, and reserved-instance commitments that convert flexibility into liability. FinOps tooling optimizes within the menu — it cannot change the menu.",
      ],
    },
    approach: [
      {
        heading: "Per-order price competition",
        paragraphs: [
          "Each deployment group becomes an order that providers bid against. Price discovery happens at the granularity of your actual workload, continuously — and switching providers is a redeployment, not a migration project, because the workload description is portable chain state.",
        ],
      },
      {
        heading: "Spending you can audit to the hour",
        paragraphs: [
          "Usage records land hourly, sit through a 24-hour dispute window, and settle from escrow you funded — with anomaly detection flagging outliers before submission. Every line item traces to a signed record against a specific lease.",
        ],
      },
      {
        heading: "Quality signals to price against",
        paragraphs: [
          "Cheap capacity from an unknown operator is only a bargain if you can verify it: published benchmarks, auditor-signed attributes, and lease-bound reviews let you trade off price against measured quality deliberately.",
        ],
      },
    ],
    economics: {
      heading: "Economics",
      paragraphs: [
        "Marketplace settlement has a 0% protocol commission. No egress-fee ambush, no commitment tiers — the agreed bid price is released from escrow for verified usage. Low validator transaction fees apply only to the relevant on-chain messages.",
      ],
    },
    gettingStarted: [
      { step: "Start with a portable workload", detail: "Containerized services with declarative specs port cleanly to deployment groups." },
      { step: "Post an order and compare bids", detail: "Filter on attributes and benchmarks; accept on price-per-verified-quality." },
      { step: "Fund escrow incrementally", detail: "Deposit for the horizon you can forecast; top up as usage settles." },
      { step: "Rebid periodically", detail: "Re-run price discovery as the provider side of the market deepens." },
    ],
    related: [
      { label: "How the marketplace works", href: "/learn/how-the-marketplace-works" },
      { label: "Escrow & settlement explained", href: "/learn/escrow-and-settlement-explained" },
      { label: "x/market module", href: "/modules/market" },
      { label: "AI/ML workloads", href: "/solutions/ai-ml-workloads" },
    ],
  },
];

export function getSolution(slug: string): SolutionEntry | undefined {
  return SOLUTIONS.find((s) => s.slug === slug);
}
