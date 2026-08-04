/**
 * On-chain module reference. Source of truth: repos/virtengine/x/ and the
 * protocol docs (docs/, _docs/). Each entry powers /modules/[slug].
 */

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
    summary: "The order, bid, and lease state machine at the center of the marketplace.",
    whatItDoes: [
      "The market module implements the exchange itself. Tenants post orders describing the resources they need; provider daemons watching the chain place competing bids against open orders; and a matched bid becomes a lease — the on-chain contract under which a provider serves a workload and gets paid. All three objects are chain state, created and transitioned by transactions and validated by consensus.",
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
      { term: "Order", def: "A tenant's on-chain request for resources — compute, memory, storage, region, and required attributes." },
      { term: "Bid", def: "A provider's priced offer against an open order, placed automatically by the provider daemon." },
      { term: "Lease", def: "The matched contract between tenant and provider that authorizes a workload and its payment stream." },
    ],
  },
  {
    slug: "marketplace",
    path: "x/marketplace",
    name: "Marketplace",
    domain: "Marketplace & workloads",
    summary: "Marketplace coordination and offering surfaces layered over the core exchange.",
    whatItDoes: [
      "Where x/market implements the raw order–bid–lease state machine, the marketplace module carries the coordination surfaces around it: how offerings are presented, how marketplace-level rules are applied, and how the exchange is exposed to client interfaces as a coherent product rather than a bag of primitives.",
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
  },
  {
    slug: "bme",
    path: "x/bme",
    name: "BME",
    domain: "Economics & settlement",
    summary: "Burn-and-mint equilibrium mechanics linking token supply to marketplace demand.",
    whatItDoes: [
      "The bme module implements supply operations. The proposed primary issuance path is VEID-led: a 15-token batch is issued as eligible active verified humans accrue entitlement, with 14 tokens allocated to those humans and 1 token allocated to the Foundation-controlled genesis account. Staking rewards remain at a much lower proposed level.",
      "Together with the dynamic inflation mechanism in staking economics, BME is validated by the in-repo simulation framework (pkg/economics) covering supply dynamics, distribution fairness, and attack-cost analysis.",
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
  },
  {
    slug: "issuancepolicy",
    path: "x/issuancepolicy",
    name: "Issuance Policy",
    domain: "Economics & settlement",
    summary: "Governed controls over how and when new tokens are issued.",
    whatItDoes: [
      "The issuancepolicy module encodes the rules under which new tokens may be minted: schedules, safeguards and policy parameters that staking and identity allocations must respect. The proposed primary model uses VEID-led 15-token issuance batches: 14 tokens to eligible active verified humans and 1 token to the Foundation-controlled genesis account. All policy lives in chain state and can be changed through consensus.",
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
      { term: "Max supply", def: "The 10-billion-token hard ceiling on total supply." },
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
  },
];

export function getModule(slug: string): ModuleEntry | undefined {
  return MODULES.find((m) => m.slug === slug);
}

export function modulesByDomain(domain: ModuleDomain): ModuleEntry[] {
  return MODULES.filter((m) => m.domain === domain);
}
