/**
 * The integrated research architecture — single source of truth.
 *
 * DET.io's four programs are presented as parts of one architecture for
 * human–machine coexistence, not as four unrelated products. Every page that
 * states the central question, a component's role, or a maturity status reads
 * it from here so the claims cannot drift apart.
 *
 * Maturity is deliberately conservative. "In public source" means code exists
 * in an open repository; it does not mean the network is live, that the code is
 * audited, or that components are integrated with one another. Nothing in this
 * file is "integrated" or "independently validated", because nothing has been.
 * Reviewed 10 October 2026 against virtengine/virtengine main, the DSEMA
 * specification v1.0.5, and virtengine/bosun.
 */

export const ARCHITECTURE_REVIEWED = "10 October 2026";
export const ARCHITECTURE_REVIEWED_ISO = "2026-10-10";

export const CENTRAL_QUESTION =
  "Can people and increasingly autonomous AI systems share infrastructure and make consequential decisions within an architecture that keeps human authority verifiable and prevents either side from exercising unchecked control?";

export const CENTRAL_QUESTION_SHORT = "Can people stay in authority as machines gain autonomy?";

/** Ordered weakest to strongest. A claim may only cite the level it has reached. */
export const MATURITY = {
  designed: {
    label: "Published design",
    short: "Design",
    meaning: "Specified in a public document. No implementation is claimed.",
  },
  source: {
    label: "In public source",
    short: "Source",
    meaning: "Code exists in an open repository. The network is not live and the code is not independently audited.",
  },
  operating: {
    label: "In operating use",
    short: "Operating",
    meaning: "Used in practice by its maintainers. Experimental, configuration-dependent, and not independently evaluated.",
  },
  inforce: {
    label: "Institutional instrument",
    short: "In force",
    meaning: "A signed legal instrument binding the Foundation. It does not bind networks, agents, or external systems.",
  },
  integrated: {
    label: "Integrated end to end",
    short: "Integrated",
    meaning: "Demonstrated working across components on one task. Not yet reached by any part of the architecture.",
  },
  validated: {
    label: "Independently validated",
    short: "Validated",
    meaning: "Evaluated by parties outside the Foundation under adversarial conditions. Not yet reached.",
  },
} as const;

export type MaturityKey = keyof typeof MATURITY;

const GH = "https://github.com/virtengine/virtengine/tree/main";

/** What each part of the architecture is responsible for. */
export const COMPONENTS = [
  {
    id: "identity",
    name: "Identity & VEID",
    href: "/research/identity",
    role: "Who may authorise",
    question: "Can a person prove they are entitled to act without handing over more than the purpose needs?",
    provides: "Purpose-specific, minimal-disclosure proofs and consent records.",
    needs: "Governance to decide what a proof entitles; a market where proofs are requested only when needed.",
    maturity: "source" as MaturityKey,
    evidence: { label: "x/veid module source", href: `${GH}/x/veid` },
  },
  {
    id: "dsema",
    name: "DSEMA",
    href: "/research/dsema",
    role: "What agents may do and change",
    question: "Can agents adapt while every action and amendment stays inside verifiable limits?",
    provides: "Pre-execution gates, containment, reputation from recorded work, and a delayed, two-house amendment process.",
    needs: "Accountable people to grant authority; real infrastructure where resource limits are enforced.",
    maturity: "designed" as MaturityKey,
    evidence: { label: "DSEMA specification v1.0.5 (patent pending)", href: "/research/dsema" },
  },
  {
    id: "virtengine",
    name: "VirtEngine",
    href: "/research/virtengine",
    role: "Where work runs and is paid for",
    question: "Can resources be acquired from independent providers on terms anyone can inspect?",
    provides: "Orders, bids, leases, escrow, usage records, hardware attestation, settlement, and billing disputes.",
    needs: "Identity for accountable participants; governance for protocol rules; agents that respect ceilings.",
    maturity: "source" as MaturityKey,
    evidence: { label: "VirtEngine protocol source", href: "https://github.com/virtengine/virtengine" },
  },
  {
    id: "bosun",
    name: "Bosun",
    href: "/research/bosun",
    role: "What supervision looks like in practice",
    question: "Which lessons from supervised agents doing real engineering work transfer to the wider design?",
    provides: "An operating testbed: scoped tasks, review gates, recovery, and execution records.",
    needs: "Published DSEMA questions to test against; honest separation from DSEMA claims.",
    maturity: "operating" as MaturityKey,
    evidence: { label: "Bosun source", href: "https://github.com/virtengine/bosun" },
  },
] as const;

export type ComponentId = (typeof COMPONENTS)[number]["id"];

/**
 * "One task, end to end" — the integration test the architecture has to pass.
 * Toggleable parts are finer-grained than programs: attestation is part of
 * VirtEngine and stewardship spans the Foundation, network and DSEMA.
 */
export const E2E_PARTS = [
  { id: "identity", label: "Identity proofs", program: "Identity & VEID" },
  { id: "controls", label: "Agent controls", program: "DSEMA" },
  { id: "market", label: "Compute market", program: "VirtEngine" },
  { id: "attestation", label: "Attestation", program: "VirtEngine" },
  { id: "governance", label: "Governance & challenge", program: "Foundation · network · DSEMA" },
] as const;

export type E2EPartId = (typeof E2E_PARTS)[number]["id"];

export interface E2EStep {
  label: string;
  actor: string;
  action: string;
  requires: E2EPartId[];
  /** What the step yields when every required part is present. */
  yields: string;
  /** What happens when one of the required parts is missing. */
  without: string;
  /** The weakest level among the parts the step relies on. */
  maturity: MaturityKey;
  status: string;
  source: { label: string; href: string };
}

export const E2E_TASK =
  "A researcher asks an AI agent to analyse a sensitive dataset within a budget, and to report back.";

export const E2E_STEPS: E2EStep[] = [
  {
    label: "Authorise",
    actor: "Person → agent",
    action: "The researcher grants a scoped mandate: which data, which actions, what budget, until when. A purpose-specific proof shows they hold the authority to grant it.",
    requires: ["identity", "governance"],
    yields: "A mandate tied to an accountable, eligible person, revealing only the attribute the purpose needs.",
    without: "The mandate traces only to a key. Either nobody accountable stands behind it, or the person must disclose far more than the task requires.",
    maturity: "designed",
    status: "VEID consent and credential records are in public source; DSEMA's authority-granting process is published design. The two are not connected.",
    source: { label: "x/veid consent records", href: `${GH}/x/veid/keeper` },
  },
  {
    label: "Check",
    actor: "Agent controls",
    action: "Before acting, the agent's request is checked against three independent gates: authority, resource ceiling, and containment.",
    requires: ["controls"],
    yields: "Only actions inside the mandate proceed. Being able to pay is not permission to act.",
    without: "Nothing compares the action with the mandate before execution. The ability to pay becomes the only gate.",
    maturity: "designed",
    status: "Published DSEMA design with patent-pending claims for chain-verified instruction gating. Bosun's review gates are a narrower, operating analogue for code changes.",
    source: { label: "DSEMA safety research", href: "/research/multi-agent-safety" },
  },
  {
    label: "Acquire",
    actor: "Agent → providers",
    action: "The agent places an order. Independent providers bid; a lease is formed and the budget is held in escrow.",
    requires: ["market"],
    yields: "Resource terms anyone can inspect, from a provider the agent did not have to trust in advance.",
    without: "The agent depends on one operator's private terms. The resource ceiling has no shared record to be enforced against.",
    maturity: "source",
    status: "Market, escrow, and provider modules are in public source. The network is not live; public TestNet is planned for January 2027.",
    source: { label: "x/market and x/escrow", href: `${GH}/x/market` },
  },
  {
    label: "Execute",
    actor: "Provider hardware",
    action: "The workload runs in a hardware-isolated environment. Attestation reports what environment ran and who could reach the data.",
    requires: ["market", "attestation"],
    yields: "Evidence of the execution environment, so sensitive data is not exposed to the provider's operators.",
    without: "The researcher must take the provider's word for what ran and who could see the data.",
    maturity: "source",
    status: "SGX, SEV-SNP, and Nitro attestation verification is in public source. Attestation shows the environment, not that the output is correct.",
    source: { label: "x/enclave attestation", href: `${GH}/x/enclave/keeper` },
  },
  {
    label: "Settle",
    actor: "Protocol",
    action: "Usage is recorded, the provider is paid from escrow, and the record links mandate, gate decision, lease, and attestation.",
    requires: ["market", "controls"],
    yields: "A record connecting what was authorised to what was spent, without storing personal documents.",
    without: "Payment happens, but nothing ties the spending back to the mandate that allowed it.",
    maturity: "designed",
    status: "Usage, settlement, and payout paths are in public source. Linking settlement to a DSEMA gate decision is not implemented.",
    source: { label: "x/escrow settlement", href: `${GH}/x/escrow/keeper` },
  },
  {
    label: "Challenge",
    actor: "Person → governance",
    action: "The researcher disputes the bill or the result. Separately, anyone may contest the rule that allowed the action.",
    requires: ["governance", "market"],
    yields: "A defined route to contest an outcome and, more slowly, to change the rules — with delay and human ratification.",
    without: "There is no route to contest the outcome or the rule. Whoever controls the system decides alone.",
    maturity: "designed",
    status: "Billing dispute workflows are in public source. DSEMA's two-house amendment process is published design. The Foundation constitution is in force but binds only the Foundation.",
    source: { label: "Escrow dispute workflow", href: `${GH}/x/escrow/keeper/dispute.go` },
  },
];

/** Questions an independent reviewer should be able to answer from the final record. */
export const E2E_AUDIT = [
  { question: "Who authorised this, and were they entitled to?", requires: ["identity", "governance"] as E2EPartId[] },
  { question: "Did the agent stay inside its mandate?", requires: ["controls", "market"] as E2EPartId[] },
  { question: "Who supplied the compute, on what terms?", requires: ["market"] as E2EPartId[] },
  { question: "What environment ran it, and who could see the data?", requires: ["market", "attestation"] as E2EPartId[] },
  { question: "Can the outcome — or the rule — be contested?", requires: ["governance", "market"] as E2EPartId[] },
  { question: "Was more personal information exposed than the task needed?", requires: ["identity"] as E2EPartId[] },
];

export const E2E_STATUS =
  "No end-to-end run of this task has been performed. The components marked “in public source” have not been integrated with DSEMA, which is a published design. This walkthrough states what the integration would have to demonstrate.";

/** What combining two parts is meant to make possible that neither does alone. */
export interface CapabilityPair {
  pair: string;
  enables: string;
  whyNeither: string;
  status: string;
  maturity: MaturityKey[];
  next: string;
}

export const CAPABILITY_PAIRS: CapabilityPair[] = [
  {
    pair: "Identity + governance",
    enables: "People exercise legitimate oversight without exposing personal information they do not need to.",
    whyNeither: "A proof without governance entitles nothing. Governance without identity counts keys, which one actor can multiply.",
    status: "VEID consent and credential records are in source; DSEMA's human oversight bodies are design only. Not connected.",
    maturity: ["source", "designed"],
    next: "Measure duplicate enrolment, false rejection, and coercion against a working authority grant.",
  },
  {
    pair: "Autonomous agents + open compute",
    enables: "Agents acquire resources from many providers, while resource ceilings bind where execution happens.",
    whyNeither: "Agents without infrastructure cannot act. Infrastructure without agent controls sells to anyone who can pay.",
    status: "The VirtEngine market is in source; DSEMA resource gating is design. No agent-side integration exists.",
    maturity: ["source", "designed"],
    next: "Attempt requests above a ceiling, forged usage, and execution outside the governed market.",
  },
  {
    pair: "Self-improvement + constitutional limits",
    enables: "Adaptive systems evolve while proposed changes pass protected rules, delay, and human ratification.",
    whyNeither: "Evolution without limits drifts. Fixed limits without evolution leave a static system that cannot improve.",
    status: "Both halves are within the DSEMA specification and are published design only.",
    maturity: ["designed"],
    next: "Simulate amendment capture, persuasive agents, and compromised overseer keys.",
  },
  {
    pair: "Attestation + accountability",
    enables: "Human and machine activity becomes auditable without trusting one administrator.",
    whyNeither: "Attestation without a shared record is a private receipt. A record without attestation can describe work that never ran.",
    status: "Enclave attestation and audit-related modules are in source; no independent audit has been performed.",
    maturity: ["source"],
    next: "Test compromised attestation, replayed reports, and the gap between attestation and correctness.",
  },
  {
    pair: "Machine payment + protocol controls",
    enables: "Agents take part in resource markets with transaction limits that are enforced, not requested.",
    whyNeither: "Payment without controls is unbounded spending. Controls without payment have nothing to limit.",
    status: "Escrow and settlement are in source; conversion handlers for the compute credit return pending; DSEMA budgets are design.",
    maturity: ["source", "designed"],
    next: "Model spending ceilings across escrow, refunds, and reissuance; complete conversion before claiming limits.",
  },
  {
    pair: "Open-source engineering + operating feedback",
    enables: "Experience of supervised agents doing real work informs the formal safety and governance research.",
    whyNeither: "A specification without operation is untested. Operation without a specification has no question to answer.",
    status: "Bosun is in operating use by its maintainers. Transfer of its lessons to DSEMA has not been demonstrated.",
    maturity: ["operating", "designed"],
    next: "Publish versioned failure and recovery evidence from Bosun before generalising it to DSEMA.",
  },
];

/**
 * Related work. Each entry was checked against its primary source on
 * 10 October 2026. Summaries are paraphrased; "differs" states DET.io's
 * proposal and "notShown" states what DET.io has not demonstrated.
 */
export interface RelatedWork {
  area: string;
  work: { label: string; href: string }[];
  addresses: string;
  differs: string;
  notShown: string;
}

export const RELATED_WORK: RelatedWork[] = [
  {
    area: "Training-time alignment",
    work: [{ label: "Bai et al. (2022), Constitutional AI", href: "https://arxiv.org/abs/2212.08073" }],
    addresses: "Shapes a model's behaviour by training it against a written list of principles.",
    differs: "DSEMA's constitution is enforced outside the model, at the point of action and amendment. The two are complementary: one shapes what a model tends to do, the other limits what a system is permitted to do.",
    notShown: "That runtime limits hold against a capable model trying to evade them.",
  },
  {
    area: "AI control",
    work: [{ label: "Greenblatt et al. (2023), AI Control", href: "https://arxiv.org/abs/2312.06942" }],
    addresses: "Tests safety protocols that must hold even when a capable model is deliberately trying to subvert them.",
    differs: "DSEMA applies the same premise — do not rely on the model's good intent — to agents that also evolve, hold reputation, and buy resources.",
    notShown: "Any control-style red-team evaluation. It is the evaluation method DSEMA's gates most need.",
  },
  {
    area: "Agent governance and infrastructure",
    work: [
      { label: "Shavit et al. (2023), Practices for Governing Agentic AI Systems", href: "https://cdn.openai.com/papers/practices-for-governing-agentic-ai-systems.pdf" },
      { label: "Chan et al. (2024), Visibility into AI Agents", href: "https://arxiv.org/abs/2401.13138" },
      { label: "Chan et al. (2025), Infrastructure for AI Agents", href: "https://arxiv.org/abs/2501.10114" },
    ],
    addresses: "Proposes practices and shared infrastructure for agents: constrained actions, approval, monitoring, attribution, interruptibility, identifiers, and activity logs.",
    differs: "DET.io proposes a concrete binding of several of these functions — attribution, scoped authority, resource limits, and remedies — to a compute market and a privacy-preserving identity layer.",
    notShown: "A deployment. These proposals are mostly frameworks; so, today, is DET.io's integration.",
  },
  {
    area: "Delegated authority for agents",
    work: [{ label: "South et al. (2025), Authenticated Delegation and Authorized AI Agents", href: "https://arxiv.org/abs/2501.09674" }],
    addresses: "Lets people authenticate, scope, and audit the authority they delegate to agents, by extending OAuth 2.0 and OpenID Connect.",
    differs: "The architecture's authorise step addresses the same need, with the delegator proven through a minimal-disclosure identity proof and the mandate checked again before every action.",
    notShown: "A working mandate format, or interoperability with existing delegation standards.",
  },
  {
    area: "Personhood and verifiable credentials",
    work: [
      { label: "Adler et al. (2024), Personhood credentials", href: "https://arxiv.org/abs/2408.07892" },
      { label: "W3C Verifiable Credentials Data Model 2.0 (2025)", href: "https://www.w3.org/TR/vc-data-model-2.0/" },
    ],
    addresses: "Lets a person prove they are real, or hold an attribute, without revealing who they are.",
    differs: "VEID is one design in this space. The architecture gives it a specific job: the proof is what makes human authority over agents accountable.",
    notShown: "Inclusion, recovery, and coercion resistance. These are open problems for the whole field, and VEID shares them.",
  },
  {
    area: "Decentralised compute markets",
    work: [{ label: "Akash Network architecture", href: "https://akash.network/docs/architecture/overview" }],
    addresses: "An open market where independent providers lease computing resources through a reverse auction on a Cosmos SDK chain.",
    differs: "VirtEngine is partly derived from Akash. It adds identity, hardware attestation, settlement, and disputes, and is designed to be where agent resource limits are enforced.",
    notShown: "A live network. Public TestNet is planned for January 2027.",
  },
  {
    area: "Zero trust and confidential computing",
    work: [
      { label: "NIST SP 800-207 (2020), Zero Trust Architecture", href: "https://doi.org/10.6028/NIST.SP.800-207" },
      { label: "Confidential Computing Consortium", href: "https://confidentialcomputing.io/" },
    ],
    addresses: "Removes implicit trust based on network location, and protects data in use inside hardware-based, attested execution environments.",
    differs: "The architecture applies per-request verification to agents, not only to users and devices, and treats attestation as one piece of evidence in a wider record.",
    notShown: "Resistance to compromised attestation. Attestation also never shows that an output is correct.",
  },
  {
    area: "Multi-agent frameworks",
    work: [{ label: "Wu et al. (2023), AutoGen", href: "https://arxiv.org/abs/2308.08155" }],
    addresses: "Builds applications from multiple conversing agents that combine models, tools, and human input.",
    differs: "Bosun sits closest to this category, specialised for supervised software engineering. DSEMA adds what frameworks generally leave out: constitutional limits, recorded reputation, and governed evolution.",
    notShown: "That DSEMA's additions improve outcomes over a well-supervised framework.",
  },
];

/**
 * NIST AI RMF 1.0 (NIST AI 100-1, January 2023) alignment. Category text is
 * paraphrased from the framework. This is DET.io's own mapping, not a NIST
 * assessment, endorsement, or certification; the RMF is voluntary.
 */
export const NIST_RMF = {
  title: "NIST AI Risk Management Framework 1.0 (NIST AI 100-1)",
  href: "https://doi.org/10.6028/NIST.AI.100-1",
  profile: { label: "NIST AI 600-1, Generative AI Profile (2024)", href: "https://doi.org/10.6028/NIST.AI.600-1" },
};

export interface RmfFunction {
  id: string;
  name: string;
  purpose: string;
  categories: string[];
  architecture: { text: string; href: string; maturity: MaturityKey }[];
  gap: string;
}

export const NIST_FUNCTIONS: RmfFunction[] = [
  {
    id: "govern",
    name: "Govern",
    purpose: "Policies, accountability, culture, engagement, and third-party risk across the organisation.",
    categories: [
      "GOVERN 1 · Risk policies and processes are in place and followed",
      "GOVERN 2 · Accountability structures assign authority and responsibility",
      "GOVERN 4 · A culture that considers and communicates risk",
      "GOVERN 6 · Third-party and supply-chain risks are covered",
    ],
    architecture: [
      { text: "Signed constitution: the public-benefit lock, reserved matters, and protected provisions bind the Foundation.", href: "/constitution", maturity: "inforce" },
      { text: "DSEMA two-house amendment with delay: no single body can change the rules agents operate under.", href: "/research/dsema", maturity: "designed" },
      { text: "Foundation, network, and DSEMA authority are kept separate rather than conflated.", href: "/learn/governance-and-public-benefit", maturity: "designed" },
    ],
    gap: "Network governance is stake-weighted and not yet tested for capture. Diversity and accessibility of oversight (GOVERN 3) are not yet addressed.",
  },
  {
    id: "map",
    name: "Map",
    purpose: "Establish context, categorise the system, and characterise its impacts on people and society.",
    categories: [
      "MAP 1 · Context is established and understood",
      "MAP 3 · Capabilities, uses, benefits, and costs are understood",
      "MAP 4 · Risks are mapped for every component, including third parties",
      "MAP 5 · Impacts on individuals, communities, and society are characterised",
    ],
    architecture: [
      { text: "Component roles and dependencies are mapped, with integrations marked as unbuilt.", href: "/research/human-machine-symbiosis#map", maturity: "designed" },
      { text: "Outside systems, scarcity, and capture are stated as boundaries of the claim.", href: "/research/human-machine-symbiosis#limits", maturity: "designed" },
      { text: "Post-labour economics is treated as a stress scenario, not a prediction.", href: "/learn/human-ai-economy", maturity: "designed" },
    ],
    gap: "No characterisation yet of impacts on specific communities, such as people excluded by identity checks.",
  },
  {
    id: "measure",
    name: "Measure",
    purpose: "Identify metrics, evaluate trustworthiness, track risks over time, and check that measurement works.",
    categories: [
      "MEASURE 1 · Appropriate methods and metrics are applied",
      "MEASURE 2 · Systems are evaluated for trustworthy characteristics",
      "MEASURE 3 · Risks are tracked over time",
      "MEASURE 4 · Feedback on measurement is gathered",
    ],
    architecture: [
      { text: "A public maturity ladder: every claim cites the level it has reached.", href: "/research/human-machine-symbiosis#maturity", maturity: "designed" },
      { text: "Seven research questions, each with a named metric such as false rejection, correlated failure, or unauthorised execution.", href: "/research/human-machine-symbiosis#research-agenda", maturity: "designed" },
      { text: "Bosun execution ledgers and review gates produce operating evidence for engineering tasks.", href: "/research/bosun", maturity: "operating" },
    ],
    gap: "The metrics are defined but not yet measured. No independent evaluation has been performed.",
  },
  {
    id: "manage",
    name: "Manage",
    purpose: "Prioritise and respond to risks, manage third parties, and document response and recovery.",
    categories: [
      "MANAGE 1 · Mapped and measured risks are prioritised and treated",
      "MANAGE 2 · Strategies maximise benefit and minimise harm",
      "MANAGE 3 · Third-party risks are managed",
      "MANAGE 4 · Response, recovery, and communication are documented and monitored",
    ],
    architecture: [
      { text: "Pre-execution gates: authority, resource ceiling, and containment must each pass.", href: "/learn/agent-safety", maturity: "designed" },
      { text: "Escrow, attestation, and billing disputes give remedies against provider failure.", href: "/research/virtengine", maturity: "source" },
      { text: "Bosun recovery: autofix, circuit breakers, and human escalation for failed agent work.", href: "/research/bosun", maturity: "operating" },
    ],
    gap: "There is no published incident-response plan for a live network, because the network is not live.",
  },
];

export const NIST_CHARACTERISTICS: { name: string; architecture: string; status: string }[] = [
  { name: "Valid and reliable", architecture: "Reputation from recorded, held-out task performance; Bosun's reviewed-diff evidence.", status: "Designed · Bosun operating" },
  { name: "Safe", architecture: "Independent authority, budget, and containment gates before any agent action.", status: "Designed" },
  { name: "Secure and resilient", architecture: "Hardware attestation; many independent providers rather than one operator.", status: "In source" },
  { name: "Accountable and transparent", architecture: "Open source, a record linking mandate to settlement, and a signed constitution.", status: "Partly in source · record linkage designed" },
  { name: "Explainable and interpretable", architecture: "Decisions are recorded and can be replayed. Model internals are not addressed.", status: "Gap" },
  { name: "Privacy-enhanced", architecture: "On-device processing and minimal, purpose-specific identity proofs.", status: "In source" },
  { name: "Fair, with harmful bias managed", architecture: "False rejection and access barriers are named metrics for the identity research.", status: "Gap · not yet measured" },
];
