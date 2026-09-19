/**
 * Solutions: audience & use-case pages. Powers /solutions/[slug].
 * All capability claims are grounded in repos/virtengine (modules, docs);
 * economics figures come from docs/tokenomics-analysis.md and
 * docs/usage-reporting-settlement.md. No invented statistics.
 */
import type { MediaSlug } from "@data/media";
import type { LearnDiagram } from "@data/learn";

export interface SolutionSection {
  heading: string;
  paragraphs: string[];
  /** Optional bullet list rendered after the paragraphs. */
  bullets?: string[];
}

/** One at-a-glance fact card rendered under the hero. */
export interface SolutionHighlight {
  kicker: string;
  title: string;
  body: string;
}

/** One step of the interactive "how it works" stepper. */
export interface SolutionFlowStep {
  label: string;
  title: string;
  body: string;
}

/** One page-level FAQ entry. */
export interface SolutionFaq {
  question: string;
  answer: string;
  links?: { label: string; href: string }[];
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
  /** Brand photography for the hero. */
  media: MediaSlug;
  mediaCaption: string;
  /** Three at-a-glance facts rendered under the hero. */
  highlights: SolutionHighlight[];
  /** Interactive stepper: how this audience moves through the protocol. */
  flow: SolutionFlowStep[];
  /** Page-level FAQ rendered as an accordion. */
  faqs: SolutionFaq[];
  /** Optional site diagram rendered mid-page. */
  diagram?: LearnDiagram;
  diagramCaption?: string;
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
    media: "hero-infrastructure",
    mediaCaption: "Accelerator racks, listed as measured offers.",
    highlights: [
      {
        kicker: "Payout",
        title: "Hourly settlement from escrow",
        body: "Usage meters hourly and releases from funded escrow after the 24-hour dispute window — no invoicing, no receivables, 0% marketplace commission.",
      },
      {
        kicker: "Discovery",
        title: "Benchmark-backed offers",
        body: "Published hardware benchmarks let tenants compare your capacity on measured performance instead of spec sheets.",
      },
      {
        kicker: "Trust",
        title: "Verified tenants, funded leases",
        body: "Every counterparty is VEID-verified and every lease is backed by escrow you can verify on-chain before serving a single hour.",
      },
    ],
    flow: [
      {
        label: "Verify",
        title: "Complete VEID verification",
        body: "Marketplace participation is identity-gated in both directions. Operator verification is the entry requirement for providing capacity.",
      },
      {
        label: "Register",
        title: "Register with GPU attributes",
        body: "Create your provider record on-chain with accelerator classes, region, and certifications — the attributes tenant orders filter on.",
      },
      {
        label: "Benchmark",
        title: "Publish measured performance",
        body: "Measured GPU performance data makes your offers stand out to tenants filtering on capability rather than marketing claims.",
      },
      {
        label: "Bid",
        title: "Deploy the daemon and bid",
        body: "Point the provider daemon at your Kubernetes cluster, connect your chain key, and set pricing rules. It watches open orders and bids per your strategy.",
      },
      {
        label: "Settle",
        title: "Serve, meter, get paid",
        body: "Won leases instantiate on your cluster; usage meters hourly as signed records and settles from escrow after the dispute window.",
      },
    ],
    faqs: [
      {
        question: "How is GPU usage metered?",
        answer:
          "The provider daemon meters usage per workload on an hourly cadence and submits it on-chain as signed records. Records clear a 24-hour dispute window before escrow releases payment, and anomaly detection flags outliers before submission.",
      },
      {
        question: "Who sets the price for my capacity?",
        answer:
          "You do. The daemon bids per your configured pricing strategy against open tenant orders, and benchmark data supports premium pricing for premium hardware. The protocol takes 0% marketplace commission at payout.",
        links: [{ label: "Provider economics explained", href: "/learn/provider-economics" }],
      },
      {
        question: "What happens if a tenant doesn't pay?",
        answer:
          "They can't start without paying first: every lease is backed by escrow funded before the workload starts. Settlement draws provider payouts from that escrow, so payment risk is settled before you commit capacity.",
        links: [{ label: "Escrow & settlement explained", href: "/learn/escrow-and-settlement-explained" }],
      },
      {
        question: "Do I need to rebuild my infrastructure stack?",
        answer:
          "No. The provider daemon translates on-chain leases into workloads on your existing Kubernetes infrastructure. You operate hardware; the protocol operates the exchange.",
        links: [{ label: "Provider overview", href: "/providers" }],
      },
    ],
    diagram: "lifecycle",
    diagramCaption: "From order to payout: the five stages every GPU lease passes through.",
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
    media: "provider-datacenter",
    mediaCaption: "Headroom on the floor, listed on the market.",
    highlights: [
      {
        kicker: "Operations",
        title: "Your stack stays yours",
        body: "The provider daemon translates on-chain leases into workloads on your existing Kubernetes infrastructure — the marketplace interface is software you run.",
      },
      {
        kicker: "Discovery",
        title: "Attributes and audits do the selling",
        body: "Auditor-signed attributes turn your claims into attestations, and on-chain reviews build a track record that belongs to you permanently.",
      },
      {
        kicker: "Payout",
        title: "Escrow before capacity",
        body: "Every lease is backed by escrow funded before the workload starts. Usage settles hourly with a 24-hour dispute window; marketplace commission is 0%.",
      },
    ],
    flow: [
      {
        label: "Verify",
        title: "Verify with VEID",
        body: "Operator identity verification is the entry requirement for providing. Counterparties on the other side are verified too.",
      },
      {
        label: "Register",
        title: "Register your provider record",
        body: "Declare region, hardware, and certification attributes on-chain — the filters tenants use to find capacity like yours.",
      },
      {
        label: "Attest",
        title: "Engage an auditor",
        body: "Auditor-signed attributes command trust from tenants filtering on attested claims, and convert self-claims into verifiable attestations.",
      },
      {
        label: "Connect",
        title: "Deploy the provider daemon",
        body: "Connect it to Kubernetes, configure capacity and pricing, and go live. It bids on matching orders automatically.",
      },
      {
        label: "Compound",
        title: "Serve and compound reputation",
        body: "Served leases accrue reviews and standing that win better-priced leases over time — reputation that no platform can hold hostage.",
      },
    ],
    faqs: [
      {
        question: "What do tenants actually see about my infrastructure?",
        answer:
          "Only what your provider record declares: region, tier, certifications, and hardware classes — plus auditor-signed attestations and your on-chain review history. Your internal topology stays internal.",
        links: [{ label: "x/audit module", href: "/modules/audit" }],
      },
      {
        question: "What does the provider daemon need from us?",
        answer:
          "A Kubernetes cluster to schedule into, a chain key for bidding and usage submission, and pricing rules. It watches open orders, bids, instantiates won leases, meters usage per workload, and reports signed records back to the chain.",
      },
      {
        question: "How do reviews and reputation work?",
        answer:
          "Every completed lease can carry a review between the real counterparties, recorded on-chain (x/review). Because participation is VEID identity-gated, manufacturing reputation is costly — standing compounds honestly.",
      },
      {
        question: "What if a tenant misbehaves on our hardware?",
        answer:
          "Tenants are VEID-verified and accountable, with fraud reporting and enforcement behind the marketplace if conduct goes wrong. Lease closure — voluntary, for non-payment, or through enforcement — flows through the same auditable state machine.",
        links: [{ label: "How the marketplace works", href: "/learn/how-the-marketplace-works" }],
      },
    ],
    diagram: "lifecycle",
    diagramCaption: "Every lease, from open order to settled payout.",
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
    media: "hpc-supercomputer",
    mediaCaption: "Batch capacity, priced per job on the exchange.",
    highlights: [
      {
        kicker: "Integration",
        title: "No re-platforming the cluster",
        body: "Native adapters for SLURM, MOAB, and Open OnDemand — your scheduler, partitions, and auth stay exactly as they are.",
      },
      {
        kicker: "Model",
        title: "A job marketplace, not a container shim",
        body: "On-chain HPC jobs carry resource, walltime, and partition requirements — batch work expressed natively, priced through the same exchange.",
      },
      {
        kicker: "Payout",
        title: "Standard settlement rails",
        body: "HPC usage flows into the usual pipeline: signed records, 24-hour dispute window, escrow release. Finance sees settled payments, not a new billing system.",
      },
    ],
    flow: [
      {
        label: "Review",
        title: "Review the HPC provider docs",
        body: "The HPC provider operations documentation covers the full operational model — adapters, auth, concurrency, and recovery.",
      },
      {
        label: "Register",
        title: "Register as a provider",
        body: "Declare HPC attributes on-chain: scheduler type, partitions, and hardware.",
      },
      {
        label: "Connect",
        title: "Configure the scheduler adapter",
        body: "Connect the daemon's adapter to your controller with munge or JWT auth, per-partition configuration, concurrency limits, and timeouts.",
      },
      {
        label: "Expose",
        title: "Expose partitions",
        body: "Choose which partitions and job classes the marketplace may schedule into — primary allocations stay untouched.",
      },
      {
        label: "Settle",
        title: "Serve jobs and settle",
        body: "On-chain jobs dispatch through your scheduler with crash-safe recovery; usage settles from tenant escrow.",
      },
    ],
    faqs: [
      {
        question: "Which schedulers are supported?",
        answer:
          "SLURM with munge or JWT authentication and per-partition configuration, plus MOAB and Open OnDemand adapters for existing deployments. A job lifecycle service handles polling, dispatch, tracking, and recovery, with a dedicated audit log for job and security events.",
        links: [{ label: "HPC on VirtEngine explained", href: "/learn/hpc-on-virtengine" }],
      },
      {
        question: "How are HPC jobs priced?",
        answer:
          "Facilities set their own pricing per partition and job class, offered through the same exchange economics as the rest of the marketplace. Jobs are paid from tenant escrow like any lease, with no protocol commission deducted at settlement.",
      },
      {
        question: "Will marketplace jobs disturb our primary allocations?",
        answer:
          "Only the partitions and job classes you expose are schedulable from the market. Allocation commitments to primary users stay under your scheduler's control; the marketplace sees spare cycles, nothing more.",
      },
      {
        question: "What audit trail does a job leave?",
        answer:
          "Two layers: the daemon's dedicated audit log for job events, security events, and usage, plus the on-chain record — job, usage batches, and settlement — validated by consensus and queryable by your finance and compliance teams.",
      },
    ],
    diagram: "architecture",
    diagramCaption: "Where the cluster plugs in: the daemon between chain and scheduler.",
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
      { step: "Study the launch posture", detail: "TestNet is planned for January 2027; MainNet is planned for March 2027 after TestNet exit criteria and a separate production approval. Verify formal launch confirmation before operating." },
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
    media: "network-earth",
    mediaCaption: "Consensus and identity scoring under one bonded stake.",
    highlights: [
      {
        kicker: "Mandate",
        title: "Consensus plus the VEID Network",
        body: "The same bonded set that orders blocks also decrypts identity scopes, scores them with shared ML models, and commits trust scores by consensus.",
      },
      {
        kicker: "Moat",
        title: "Patented identity consensus",
        body: "The validator identity-scoring method is covered by granted Australian patent AU2024203136B2, in force until 12 May 2044.",
      },
      {
        kicker: "Voice",
        title: "Governance is operational duty",
        body: "Validators vote on parameters, upgrades, and the approved-client list controlling which interfaces may submit identity data.",
      },
    ],
    flow: [
      {
        label: "Study",
        title: "Study the launch posture",
        body: "TestNet is planned for January 2027 and MainNet for March 2027 after TestNet exit criteria and a separate production approval. Verify formal launch confirmation before operating.",
      },
      {
        label: "Provision",
        title: "Provision secure infrastructure",
        body: "High-uptime hosts plus hardened key management for both consensus keys and VEID encryption keys.",
      },
      {
        label: "Size",
        title: "Plan for identity-network duties",
        body: "ML scoring of encrypted scopes runs alongside consensus — size compute and operations accordingly.",
      },
      {
        label: "Bond",
        title: "Bond stake and attract delegation",
        body: "Self-bond, publish your operational record, and earn delegations. Bonded stake weights voting power.",
      },
      {
        label: "Govern",
        title: "Participate in governance",
        body: "Vote on upgrades and configuration from day one — governance participation is part of the mandate.",
      },
    ],
    faqs: [
      {
        question: "What exactly are the validator's duties?",
        answer:
          "Three: propose and validate blocks under CometBFT; operate the VEID Network by decrypting sealed identity scopes, running the shared scoring models, and committing trust scores by consensus; and vote on governance — parameters, upgrades, and chain configuration.",
        links: [{ label: "What is VEID?", href: "/learn/what-is-veid" }],
      },
      {
        question: "How are validators paid for identity work?",
        answer:
          "Compensation is governed by the conservative staking and issuance policy — validator income remains governance-controlled and conservative relative to the prior model. No fixed VEID pool or fixed return is promised.",
      },
      {
        question: "What can get a validator slashed?",
        answer:
          "Double-signing and extended downtime are slashable, and slashing applies to delegated stake too — which is why delegators should choose on operational quality. Unbonding and slashing conditions are protocol parameters, not fixed-return promises.",
        links: [{ label: "Understanding slashing", href: "/learn/understanding-slashing" }],
      },
      {
        question: "When can validators start?",
        answer:
          "TestNet is planned for January 2027, followed by MainNet in March 2027 subject to testing and separate approval. Confirm the official launch decision before operating — the network page tracks the current posture.",
        links: [{ label: "Network status & genesis", href: "/network" }],
      },
    ],
    diagram: "staking",
    diagramCaption: "One bonded set, three duties: consensus, identity, governance.",
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
    media: "staking-security",
    mediaCaption: "Bonded stake, with the conditions in writing.",
    highlights: [
      {
        kicker: "Lifecycle",
        title: "Delegate to unbond, all on-chain",
        body: "Delegation, redelegation, unbonding, and reward collection are protocol state in x/delegation — standard chain messaging your product integrates once.",
      },
      {
        kicker: "Custody",
        title: "Weight, not custody",
        body: "Delegation grants validators voting weight, never custody. Client funds remain in client control — which simplifies the story for regulated partners.",
      },
      {
        kicker: "Candor",
        title: "Risk parameters are chain state",
        body: "Slashing exposure and the 21-day unbonding period are quotable from the source. Represent them plainly; the protocol supports the duty of candor.",
      },
    ],
    flow: [
      {
        label: "Model",
        title: "Decide the operating model",
        body: "Run validators, aggregate delegations to third-party validators, or both — the delegation lifecycle supports each shape.",
      },
      {
        label: "Integrate",
        title: "Integrate x/delegation",
        body: "Delegate, redelegate, unbond, and claim through standard chain messages. No bespoke custody plumbing required.",
      },
      {
        label: "Disclose",
        title: "Build risk disclosure in",
        body: "Surface slashing and the 21-day unbonding period explicitly in the client experience — during unbonding, stake earns nothing and remains slashable for prior offenses.",
      },
      {
        label: "Select",
        title: "Select validators on quality",
        body: "Uptime and standing, not just commission, drive client outcomes. On-chain performance records make quality verifiable.",
      },
      {
        label: "Serve",
        title: "Earn on aggregated stake",
        body: "Partner revenue is validator commission and/or service fees on aggregated delegations, with reward composition worth explaining to clients.",
      },
    ],
    faqs: [
      {
        question: "What do staking partners earn?",
        answer:
          "Validator commission and/or service fees on aggregated delegations. Validator selection is the product: operational quality determines both reward capture and slashing exposure.",
        links: [{ label: "Tokenomics explained", href: "/learn/tokenomics-explained" }],
      },
      {
        question: "How does unbonding work for clients?",
        answer:
          "Unbonding takes 21 days, during which stake earns nothing and remains slashable for prior offenses. Build this into product copy and timelines — it is chain state, not policy fine print.",
      },
      {
        question: "What drives delegator rewards?",
        answer:
          "Rewards derive from governance-controlled validator incentives, net of commission. The proposed staking allocation is roughly 90% lower than the prior model, and no fixed APR is promised — represent that plainly.",
      },
      {
        question: "Do client funds move to the partner?",
        answer:
          "No. Delegation grants voting weight, not custody — funds remain in client control on-chain. That separation is what makes the custodial story workable for regulated partners.",
        links: [{ label: "x/delegation module", href: "/modules/delegation" }],
      },
    ],
    diagram: "staking",
    diagramCaption: "Delegated stake flows to validators; rewards flow back minus commission.",
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
    media: "settlement-ledger",
    mediaCaption: "Every payout written from escrow — minus nothing.",
    highlights: [
      {
        kicker: "Utility",
        title: "A working asset, not a voucher",
        body: "The token prices compute, funds escrow, bonds validators, weights governance votes, and burns against marketplace demand.",
      },
      {
        kicker: "Custody",
        title: "Delegate without giving up custody",
        body: "Bonded tokens remain yours while earning a share of validator rewards — and spreading stake across smaller validators strengthens decentralization.",
      },
      {
        kicker: "Supply",
        title: "Supply that responds to usage",
        body: "Issuance policy is chain state, changeable only by governance, with burn-and-mint mechanics linking supply to real marketplace demand.",
      },
    ],
    flow: [
      {
        label: "Learn",
        title: "Understand the economics",
        body: "Read the tokenomics explainer before bonding anything — issuance, burn-and-mint, and reward composition are all documented there.",
      },
      {
        label: "Research",
        title: "Research validators",
        body: "Uptime history, self-bond, commission, and governance participation all matter. Delegated stake is slashable for your validator's misbehavior.",
      },
      {
        label: "Delegate",
        title: "Delegate",
        body: "Bond stake via x/delegation from any supported wallet or interface. You earn a share of block, VEID, and uptime rewards net of commission.",
      },
      {
        label: "Vote",
        title: "Vote",
        body: "Bonded stake votes on parameter changes, upgrades, the approved-client list, fee parameters, and issuance policy.",
      },
      {
        label: "Watch",
        title: "Monitor and redelegate",
        body: "Performance is on-chain and verifiable. Redelegate if your validator's operational quality slips — your stake, your call.",
      },
    ],
    faqs: [
      {
        question: "What does holding the token actually let me do?",
        answer:
          "Pay for compute, fund lease escrow, bond to validators for rewards, vote in governance, and hold an asset whose supply burns against marketplace demand. Passive holding alone secures nothing — delegation is the participation step.",
        links: [{ label: "Tokenomics explained", href: "/learn/tokenomics-explained" }],
      },
      {
        question: "Can I lose staked tokens to slashing?",
        answer:
          "Yes. Delegated stake is slashable for your validator's misbehavior — double-signing or extended downtime. Choose validators on operational quality, and treat any staking-service marketing that omits this as a red flag.",
        links: [{ label: "Understanding slashing", href: "/learn/understanding-slashing" }],
      },
      {
        question: "How long does unbonding take?",
        answer:
          "Twenty-one days, during which stake earns nothing and remains slashable for prior offenses. Plan exits around that window.",
      },
      {
        question: "Is there a fixed APR?",
        answer:
          "No. Rewards vary with the dynamic inflation mechanism and governance-controlled parameters. Anything marketed as guaranteed yield on this token is misrepresenting the protocol.",
      },
    ],
    diagram: "settlement",
    diagramCaption: "Usage becomes payout: meter, dispute window, escrow release.",
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
    media: "open-source-screen",
    mediaCaption: "A typed module surface, open source from day one.",
    highlights: [
      {
        kicker: "Surface",
        title: "Twenty-seven typed modules",
        body: "Query orders and bids, inspect provider records, track settlement and escrow, resolve VEID registry state — all over standard Cosmos SDK gRPC and REST.",
      },
      {
        kicker: "Client",
        title: "One binary, node and client",
        body: "Create deployments, manage mTLS certificates, fund escrow, and query lease state from the CLI or programmatically.",
      },
      {
        kicker: "Identity",
        title: "A governed path for identity apps",
        body: "Identity-data submission runs through the x/config approved-client list — study the VEID capture reference app to walk it.",
      },
    ],
    flow: [
      {
        label: "Clone",
        title: "Clone the repo",
        body: "github.com/virtengine/virtengine — Go 1.25.5, `make virtengine` builds the binary. Apache 2.0 throughout.",
      },
      {
        label: "Read",
        title: "Read the module docs",
        body: "The module reference on this site plus protocol docs at docs.virtengine.com cover every message and query surface.",
      },
      {
        label: "Run",
        title: "Run a local environment",
        body: "The development-environment guide walks through local chain setup so you can exercise the full lifecycle offline.",
      },
      {
        label: "Build",
        title: "Build against gRPC/REST",
        body: "Standard Cosmos SDK client patterns apply across all modules — wallets, dashboards, marketplaces, analytics.",
      },
      {
        label: "Ship",
        title: "Ship without permission",
        body: "Deployment tooling, provider dashboards, staking interfaces, and analytics require no approval. Only identity-data submission needs approved-client governance.",
      },
    ],
    faqs: [
      {
        question: "What stack is VirtEngine built on?",
        answer:
          "A CometBFT/Cosmos SDK chain written in Go, partly derived from the Akash Network codebase. If you have built on any Cosmos SDK chain, the client patterns — gRPC, REST, CLI — transfer directly.",
        links: [{ label: "Open source project", href: "/open-source" }],
      },
      {
        question: "Do I need permission to build?",
        answer:
          "No — except for one path. Deployment tooling, dashboards, staking interfaces, and analytics need no approval. Submitting VEID identity data requires going through approved-client governance in x/config, since validators only score submissions from approved clients.",
      },
      {
        question: "Where is the module surface documented?",
        answer:
          "Start with the module reference on this site for what each module does and how they connect, then docs.virtengine.com for message-level and API documentation.",
        links: [{ label: "Module reference", href: "/modules" }],
      },
      {
        question: "Is there a reference app for identity clients?",
        answer:
          "Yes — the VEID capture reference app in mobile/veid-capture-app/ shows the full on-device flow: capture, liveness, attestation, and encrypted scope submission. It is the fastest way to understand the approved-client path end to end.",
      },
    ],
    diagram: "architecture",
    diagramCaption: "The module surface developers build against.",
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
    media: "identity-portrait",
    mediaCaption: "Prove compliance. Reveal nothing else.",
    highlights: [
      {
        kicker: "Proof",
        title: "Attestation as marketplace state",
        body: "Hardware-signed evidence of the exact measured code running in a TEE, verified through x/enclave — orders can require it as a placement constraint.",
      },
      {
        kicker: "Secrecy",
        title: "Secrets sealed to verified targets",
        body: "Workload secrets stay encrypted until attestation verifies, and client-to-provider links authenticate mutually via chain-anchored TLS certificates.",
      },
      {
        kicker: "Assurance",
        title: "Counterparties you can underwrite",
        body: "VEID-verified providers with audited attributes, benchmarks, and on-chain reviews — plus fraud enforcement with a rule-bound consequence path.",
      },
    ],
    flow: [
      {
        label: "Define",
        title: "Define the trust requirements",
        body: "Decide which workloads need attested enclaves and which measurements you will accept — the policy your placement constraints will encode.",
      },
      {
        label: "Constrain",
        title: "Constrain orders to attested capacity",
        body: "Require enclave attributes and auditor-signed claims in placement constraints so unverified capacity can never match your orders.",
      },
      {
        label: "Verify",
        title: "Verify the attestation flow",
        body: "Confirm measurement verification and encrypted secret delivery end to end before production data moves.",
      },
      {
        label: "Contain",
        title: "Start with a contained workload",
        body: "Prove the model on a bounded dataset, then scale scope. Escrow-backed leases and hourly settlement give finance a clean, auditable cost trail throughout.",
      },
      {
        label: "Scale",
        title: "Scale under the same guarantees",
        body: "Every additional workload inherits the same verification: attested execution, sealed secrets, verified counterparties, disputable usage.",
      },
    ],
    faqs: [
      {
        question: "What actually proves the enclave is genuine?",
        answer:
          "Hardware-signed attestation evidence — measurements of the exact code and configuration running inside the TEE — verified through x/enclave. Because attestation is marketplace state, orders can demand it as a placement constraint rather than taking a vendor's word.",
        links: [{ label: "x/enclave module", href: "/modules/enclave" }],
      },
      {
        question: "Who can read our workload secrets?",
        answer:
          "Only verified targets. The encryption module releases workload secrets encrypted to specific recipients after attestation verifies, and mTLS between your clients and provider endpoints uses chain-anchored certificates from x/cert.",
        links: [{ label: "x/encryption module", href: "/modules/encryption" }],
      },
      {
        question: "What does the compliance trail look like?",
        answer:
          "On-chain attestations, auditor-signed provider attributes, published benchmarks, lease-bound reviews, and signed hourly usage records — every claim your auditors need is protocol state, queryable and timestamped.",
      },
      {
        question: "Does confidential capacity cost a vendor-style premium?",
        answer:
          "Its premium is set by open bidding, not an enterprise price list: attested enclave capability is a provider attribute, so supply and demand price it like everything else on the market.",
      },
    ],
    diagram: "veid",
    diagramCaption: "Prove the answer, keep the data: the verification pipeline behind every lease.",
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
    media: "marketplace-hardware",
    mediaCaption: "Training and inference over the same open interconnect.",
    highlights: [
      {
        kicker: "Leverage",
        title: "Demand-side market power",
        body: "Post an order; provider daemons bid against it. Competition happens per order, continuously — not per contract cycle.",
      },
      {
        kicker: "Verification",
        title: "Hardware you can check",
        body: "Benchmark records let you verify measured accelerator performance before accepting a bid — never trust the SKU alone.",
      },
      {
        kicker: "Scale",
        title: "A real HPC path for large runs",
        body: "On-chain jobs with walltime and partition requirements execute on SLURM-class clusters — supercomputing-grade interconnects included.",
      },
    ],
    flow: [
      {
        label: "Describe",
        title: "Describe the workload",
        body: "Resources, accelerator classes, region, and attribute constraints go into a deployment spec — training or inference alike.",
      },
      {
        label: "Require",
        title: "Set placement requirements",
        body: "Benchmarked hardware, audited attributes, or attested enclaves for proprietary weights and sensitive training data.",
      },
      {
        label: "Fund",
        title: "Fund escrow and post the order",
        body: "Bids arrive from matching providers; you choose the winner. Escrow you control backs the lease.",
      },
      {
        label: "Run",
        title: "Run and monitor",
        body: "Metered usage records and settlement state are queryable chain data. Idle budget returns when the deployment closes.",
      },
      {
        label: "Protect",
        title: "Protect the model itself",
        body: "Require attested enclave execution and encrypted secret delivery for proprietary work. Counterparty risk stays bounded by VEID verification and on-chain reputation.",
      },
    ],
    faqs: [
      {
        question: "Does this fit training runs, inference, or both?",
        answer:
          "Both. Interactive and inference workloads ride standard leases; large training runs fit the HPC path — on-chain jobs with walltime and partition requirements on SLURM-class clusters through native adapters.",
        links: [{ label: "HPC on VirtEngine", href: "/learn/hpc-on-virtengine" }],
      },
      {
        question: "How do we verify the GPUs behind a bid?",
        answer:
          "Through published benchmark records (x/benchmark): measured performance data attached to the provider's on-chain identity, so you accept bids on evidence rather than SKU names.",
      },
      {
        question: "How are models and training data protected?",
        answer:
          "Require attested enclave execution (x/enclave) and encrypted secret delivery (x/encryption), transact only with VEID-verified providers carrying audited attributes, and lean on lease-bound reviews for ongoing assurance.",
      },
      {
        question: "How is spend controlled?",
        answer:
          "You fund escrow; providers draw against it only as metered usage settles — hourly records, 24-hour dispute window, anomaly detection before submission. Unspent budget returns to you. Cost control is structural, not a billing alert.",
        links: [{ label: "Escrow & settlement explained", href: "/learn/escrow-and-settlement-explained" }],
      },
    ],
    diagram: "lifecycle",
    diagramCaption: "From workload spec to settled GPU-hours.",
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
    media: "closing-hands",
    mediaCaption: "Auction-set pricing instead of list pricing.",
    highlights: [
      {
        kicker: "Pricing",
        title: "Per-order price competition",
        body: "Each deployment group becomes an order providers bid against. Price discovery happens at the granularity of your actual workload, continuously.",
      },
      {
        kicker: "Audit",
        title: "Spending auditable to the hour",
        body: "Hourly usage records, a 24-hour dispute window, anomaly detection before submission — every line item traces to a signed record against a lease.",
      },
      {
        kicker: "Quality",
        title: "Price against verified quality",
        body: "Benchmarks, auditor-signed attributes, and lease-bound reviews let you trade price against measured quality deliberately.",
      },
    ],
    flow: [
      {
        label: "Port",
        title: "Start with a portable workload",
        body: "Containerized services with declarative specs port cleanly into deployment groups — the unit the market bids on.",
      },
      {
        label: "Compare",
        title: "Post an order and compare bids",
        body: "Filter on attributes and benchmarks; accept on price-per-verified-quality rather than brand or habit.",
      },
      {
        label: "Fund",
        title: "Fund escrow incrementally",
        body: "Deposit for the horizon you can forecast and top up as usage settles. Unspent budget returns when the deployment closes.",
      },
      {
        label: "Verify",
        title: "Audit as you spend",
        body: "Every settled hour traces to a signed usage record. Dispute anything anomalous inside the 24-hour window.",
      },
      {
        label: "Rebid",
        title: "Rebid periodically",
        body: "Re-run price discovery as the provider side of the market deepens. Switching providers is a redeployment, not a migration project.",
      },
    ],
    faqs: [
      {
        question: "Where do the savings actually come from?",
        answer:
          "Three structural sources: continuous per-order competition instead of list prices, 0% protocol commission at settlement, and no egress-fee ambush or commitment tiers. FinOps tooling optimizes within the menu; this changes the menu.",
      },
      {
        question: "How is cloud spend controlled here?",
        answer:
          "Escrow you fund, hourly metered records, a 24-hour dispute window with anomaly detection, and unspent budget returned on close. The agreed bid price is released only for verified usage.",
        links: [{ label: "Escrow & settlement explained", href: "/learn/escrow-and-settlement-explained" }],
      },
      {
        question: "How do we compare bids fairly?",
        answer:
          "On price-per-verified-quality: published benchmarks for measured performance, auditor-signed attributes for claimed certifications, and lease-bound reviews for lived experience. Cheap capacity from an unknown operator is only a bargain if you can verify it.",
      },
      {
        question: "What does switching providers cost?",
        answer:
          "A redeployment, not a migration. Workload descriptions are portable chain state, so moving between providers means posting a new order — no egress ransom, no re-platforming.",
        links: [{ label: "How the marketplace works", href: "/learn/how-the-marketplace-works" }],
      },
    ],
    diagram: "settlement",
    diagramCaption: "Every line item traces to a signed record against a lease.",
  },
];

export function getSolution(slug: string): SolutionEntry | undefined {
  return SOLUTIONS.find((s) => s.slug === slug);
}
