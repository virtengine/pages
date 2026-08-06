/**
 * Research topic pages — the foundation's research program areas.
 * Grounded in: the DSEMA v1.0.5 architecture specification, the accepted
 * AU2024203136B2 granted patent claims, the multi-agent patent claims (v1.2.1),
 * the signed constitution, and the open VirtEngine repository
 * (github.com/virtengine/virtengine). Research-program framing only:
 * questions, approach, current work, artifacts — no invented results.
 */

export interface ResearchSection {
  heading: string;
  body: string[];
}

export interface ResearchArtifact {
  label: string;
  detail: string;
  href?: string;
}

export interface ResearchTopic {
  slug: string;
  title: string;
  /** The open research question, phrased as a question */
  question: string;
  summary: string;
  /** Which program(s) it belongs to */
  programs: ("VirtEngine" | "DSEMA")[];
  sections: ResearchSection[];
  artifacts: ResearchArtifact[];
  related: string[];
}

export const RESEARCH_TOPICS: ResearchTopic[] = [
  {
    slug: "decentralized-identity",
    title: "Decentralized identity",
    question: "Can a person prove who they are — strongly enough for finance-grade infrastructure — without surrendering their documents, biometrics, or behaviour to a central database?",
    summary:
      "The VEID research stream: privacy-preserving identity verification combining document capture, active liveness, biometric hardware attestation, zero-knowledge proofs, and device integrity attestation — with verification results, not personal data, recorded on-chain.",
    programs: ["VirtEngine"],
    sections: [
      {
        heading: "The question",
        body: [
          "Digital infrastructure keeps demanding stronger identity — to prevent Sybil attacks, satisfy AML/CTF obligations, and gate high-stakes operations — while every strengthening step has historically meant more personal data pooled in more central databases. The research question is whether the trade-off is real: can verification strength and data minimisation increase together?",
          "The foundation's constitution forces this question rather than merely permitting it: clause 39 mandates privacy-by-design, minimised collection, minimised central custody, encryption and selective disclosure where feasible, and independent auditability.",
        ],
      },
      {
        heading: "Approach",
        body: [
          "VEID, the VirtEngine identity layer, is the working testbed. The pipeline under research combines document capture and OCR, selfie capture with active liveness challenges, biometric hardware attestation (fingerprint and iris, attested by the device's secure hardware rather than uploaded), device integrity attestation via Play Integrity and App Attest, and encrypted payloads throughout.",
          "The critical architectural move is what reaches the chain: verification outcomes and cryptographic commitments, not source biometrics or documents. The x/veid module tree in the open repository includes a dedicated zero-knowledge proof package (x/veid/zk) for proving properties of an identity — validity, uniqueness, tier — without revealing the underlying attributes.",
        ],
      },
      {
        heading: "Current work and artifacts",
        body: [
          "The open repository carries the on-chain modules (x/veid, x/veidregistry, x/mfa, x/roles), a mobile capture reference application (mobile/veid-capture-app), and public documentation including a biometric hardware attestation design document, a consent framework, and a biometric data addendum. The identity.org.au property presents the citizen-facing account of the same work.",
          "Open problems under active study include: liveness robustness against generative-AI presentation attacks, the recoverability/unlinkability tension in credential re-issuance, and how relying services should consume tiered verification scores without re-identifying users across contexts.",
        ],
      },
    ],
    artifacts: [
      { label: "x/veid + x/veid/zk modules", detail: "on-chain identity scoring and zero-knowledge proof verification, Apache 2.0", href: "https://github.com/virtengine/virtengine" },
      { label: "Biometric hardware attestation design", detail: "docs/veid/biometric-hardware-attestation.md in the open repository" },
      { label: "VEID capture reference app", detail: "mobile/veid-capture-app — document, selfie, liveness, attestation flows" },
      { label: "Identity program page", detail: "the foundation's program account of VEID — pipeline, tiers, consent, service", href: "/research/identity" },
      { label: "identity.org.au", detail: "public plain-language home of the VEID research", href: "https://identity.org.au" },
    ],
    related: ["privacy-preserving-verification", "protocol-governance-design", "confidential-computing"],
  },
  {
    slug: "multi-agent-safety",
    title: "Multi-agent AI safety",
    question: "If a collective of AI agents can modify its own models and structure, what makes it safe, accountable, and stoppable?",
    summary:
      "The DSEMA safety stream: constitutional smart-contract layers with pre-emptive veto, sandboxed execution with syscall-level policy, verified model loading, bicameral human-machine amendment governance with mandatory time-locks, and multi-signature gates on irreversible actions.",
    programs: ["DSEMA"],
    sections: [
      {
        heading: "The question",
        body: [
          "Self-improving AI systems concentrate two risks: capability growth that outpaces oversight, and the quiet accumulation of unauditable state. The DSEMA specification's premise is that autonomy and accountability need not trade off — provided every improvement is triggered, verified, and recorded by an infrastructure the agents cannot rewrite.",
          "The research question: which control-plane properties are sufficient for a self-evolving multi-agent collective to remain within a hard constitutional envelope, even under adversarial or persuasive behaviour by the agents themselves?",
        ],
      },
      {
        heading: "The constitutional safety layer",
        body: [
          "In the specification, a Constitutional Safety Layer is implemented as a core, immutable-by-design smart contract encoding foundational principles rather than granular rules: a containment principle (all agent execution inside registered sandboxes), a resource-limitation principle (global consumption ceilings), an oversight principle (external overseer authority cannot be revoked), and an amendment-integrity principle (the constitution amends only through its own restrictive process).",
          "Enforcement is pre-emptive, not forensic: any high-stakes transaction — even one passed by an agent-governance supermajority — is checked against the constitutional contract before execution and fails atomically if it violates a principle. The spec's worked example: a proposal to 'create a copy of myself outside the secure execution environment' is vetoed by a rule preventing uncontained replication before any state changes.",
        ],
      },
      {
        heading: "Containment engineering",
        body: [
          "Below the constitutional layer sits containment: each agent runs in a Secure Execution Environment — gVisor-style user-space kernels or WASM/WASI capability sandboxes — with a syscall allow-list policy controlled by the safety layer itself. The illustrative policy in the spec restricts file writes to designated workspaces, forbids executable memory mappings, restricts GPU ioctls to compute ranges, pins network egress to a sidecar that enforces a Layer-7 allow-list, and blocks privilege-escalation and inbound-networking syscalls outright.",
          "Model weights are integrity-gated: a loader verifies the signed hash of every weight file against the on-chain registry before mapping it into accelerator memory, and revoked or mismatched models cannot load.",
        ],
      },
      {
        heading: "Amendment governance: humans stay in the loop where it counts",
        body: [
          "Changing the constitutional layer itself requires a bicameral process defined in the specification: an Agent Legislature (a minimum of 150 of the highest-reputation agents) must pass a proposal at a 95% supermajority for technical soundness; a Human Legislature — half public stakeholders, half an anonymous, credentialed Alignment Jury — must then reach a 66.7% weighted threshold on value-alignment grounds. Passage triggers a mandatory, non-cancellable 180-day time-lock during which votes may be withdrawn and the global research community can red-team the change; support falling below threshold voids it. A genesis Seed Wallet retains a final, non-overridable veto.",
          "The spec is explicit about the residual risks this design answers: the persuasive AI that socially engineers its overseers, and the compromised human whose keys are stolen or coerced — hence anonymity for jurors, time-locks for scrutiny, and multi-signature quorums for irreversible actions.",
        ],
      },
    ],
    artifacts: [
      { label: "DSEMA v1.0.5 specification", detail: "103-page architecture specification — safety layer §2.12, containment §2.2.3" },
      { label: "Multi-agent patent claims v1.2.1", detail: "computer-implemented system claims for verifiably authorized autonomous state modification" },
      { label: "DSEMA program page", detail: "the foundation's plain-language account of the architecture", href: "/research/dsema" },
      { label: "Bosun — open-source agent orchestrator", detail: "the applied engineering track: an experimental, fully open-source operating testbed whose routing, gates, and ledgers inform this research", href: "/research/bosun" },
    ],
    related: ["protocol-governance-design", "incentive-mechanism-design", "confidential-computing"],
  },
  {
    slug: "confidential-computing",
    title: "Confidential computing",
    question: "How can tenants run sensitive workloads on hardware owned by strangers — with confidentiality and integrity they can verify rather than assume?",
    summary:
      "Research on trusted execution, attestation, and encrypted data paths in a decentralized cloud: the VirtEngine enclave and encryption modules, provider attestation, and the sandboxing substrate DSEMA agents inherit.",
    programs: ["VirtEngine", "DSEMA"],
    sections: [
      {
        heading: "The question",
        body: [
          "A decentralized cloud marketplace inverts the usual trust model: instead of one audited hyperscaler, compute comes from many independent providers with heterogeneous hardware and unknown intentions. The research question is what combination of trusted execution environments, remote attestation, encryption, and protocol-level verification lets a tenant treat that fleet as trustworthy-by-verification rather than trustworthy-by-brand.",
        ],
      },
      {
        heading: "Approach in the protocol",
        body: [
          "The open VirtEngine repository carries dedicated on-chain modules for this stream: x/enclave (trusted-execution and attestation integration), x/encryption (protocol encryption and key fingerprinting), x/cert (certificates), and x/audit (provider auditing). Device and hardware attestation likewise anchors the VEID identity pipeline — the same verify-the-hardware discipline applied to a different asset.",
          "Around the modules sit operational research questions documented in the repository's HPC and provider-operations guides: how attestation evidence enters provider auditing, how encrypted payloads traverse the deployment pipeline, and how benchmark and fraud modules (x/benchmark, x/fraud) detect providers that misrepresent capacity.",
        ],
      },
      {
        heading: "Shared substrate with DSEMA",
        body: [
          "DSEMA's containment layer is a consumer of the same research: gVisor-style syscall interception, WASM/WASI capability sandboxes, verified model loading, and sidecar-enforced egress control are confidential-computing techniques applied to autonomous agents instead of tenant workloads. The specification names VirtEngine as the underlying decentralized compute layer a DSEMA collective would autonomously purchase resources from — making attestation the trust bridge between the two programs.",
        ],
      },
    ],
    artifacts: [
      { label: "x/enclave, x/encryption, x/cert, x/audit", detail: "on-chain modules in the open repository", href: "https://github.com/virtengine/virtengine" },
      { label: "HPC operations documentation", detail: "docs/hpc-provider-operations.md, docs/hpc-node-agent.md, docs/hpc-workload-publishing.md" },
      { label: "DSEMA containment specification", detail: "secure execution environments and syscall policy, spec §2.2.3" },
    ],
    related: ["multi-agent-safety", "decentralized-identity", "privacy-preserving-verification"],
  },
  {
    slug: "protocol-governance-design",
    title: "Protocol governance design",
    question: "How do you govern valuable shared infrastructure so that no amount of capital, cleverness, or patience can capture it?",
    summary:
      "Anti-capture governance as a design discipline: the constitutional separation of economic value from governance power, entrenched Protected Provisions, consent gates, and DSEMA's layered machine-and-human governance — studied as one body of work.",
    programs: ["VirtEngine", "DSEMA"],
    sections: [
      {
        heading: "The question",
        body: [
          "Token-governed protocols are routinely captured: buy the tokens, win the vote, redirect the treasury. Foundation-governed projects fail differently: boards drift, missions soften, assets are quietly licensed to insiders. The research question is whether legal entrenchment and protocol mechanism design can be composed so that each covers the other's failure modes.",
        ],
      },
      {
        heading: "The legal layer",
        body: [
          "The foundation's own constitution is the first research artifact: clause 38 requires transferable economic value to be structurally separated from governance over purposes and Protected Provisions, so that capital cannot buy control; clause 18 entrenches twenty Protected Provisions under sections 136(3)–(4) of the Corporations Act; clause 18A gates eight categories of high-stakes decisions behind written Founding Member consent; and clause 62 locks even the winding-up destination to compatible charities. The full analysis lives in this site's constitution explorer.",
        ],
      },
      {
        heading: "The protocol layer",
        body: [
          "DSEMA contributes the machine-governance half: reputation-weighted quadratic voting in place of token voting, a governance council drawn from the highest-reputation agents, multi-signature quorums for irreversible actions, and the bicameral constitutional-amendment process with a 95% agent supermajority, a 66.7% human threshold, a 180-day time-lock, and a genesis veto. The design question under study is calibration: which thresholds, time-locks, and veto placements deter capture without freezing legitimate evolution.",
          "On the VirtEngine side, the chain's governance, delegation, and issuance-policy modules (x/delegation, x/issuancepolicy, x/config) are the working implementation surface where these constraints must hold under real economic pressure.",
        ],
      },
    ],
    artifacts: [
      { label: "Constitution explorer", detail: "plain-language analysis of the entrenchment architecture", href: "/constitution" },
      { label: "DSEMA governance specification", detail: "meta-cognitive governance, amendment process — spec §2.12–2.13" },
      { label: "VirtEngine governance modules", detail: "x/delegation, x/issuancepolicy, x/config in the open repository", href: "https://github.com/virtengine/virtengine" },
    ],
    related: ["incentive-mechanism-design", "multi-agent-safety", "decentralized-identity"],
  },
  {
    slug: "incentive-mechanism-design",
    title: "Incentive mechanism design",
    question: "What economic mechanisms keep a decentralized marketplace honest — pricing, escrow, settlement, reputation — when every participant is anonymous and self-interested?",
    summary:
      "Mechanism design across the VirtEngine marketplace (escrow, settlement, burn-mint equilibrium, fraud and review modules) and DSEMA's trustless meritocracy (algorithmic reputation, ensemble consensus thresholds, adversarial evolution).",
    programs: ["VirtEngine", "DSEMA"],
    sections: [
      {
        heading: "The question",
        body: [
          "Decentralized infrastructure cannot rely on contracts and courts for everyday enforcement; it must make honesty the profitable strategy. The research stream studies the mechanism stack end to end: how workloads are priced and matched, how funds are secured while service is delivered, how usage is verified before settlement, and how reputation converts past behaviour into future opportunity.",
        ],
      },
      {
        heading: "Marketplace mechanisms in VirtEngine",
        body: [
          "The open repository implements the full loop as chain modules: x/market and x/marketplace (orders, bids, leases), x/escrow (funds locked while workloads run), x/settlement and the usage-reporting pipeline (verified usage before payment), x/bme (token supply operations), x/take (zero-commission marketplace settlement policy), and x/fraud, x/review, x/benchmark (misbehaviour detection and provider quality signals). The proposed model uses VEID-led 15-token issuance batches: 14 tokens to eligible active verified humans and 1 token to the Foundation-controlled genesis account; validator transaction fees are separate from settlement and proposed at approximately 90% below standard network transaction fees.",
        ],
      },
      {
        heading: "Meritocracy mechanisms in DSEMA",
        body: [
          "DSEMA poses the same question for AI agents: its Autonomous Reputation System derives scores algorithmically from on-chain performance records, task allocation prefers high-reputation specialists, and consensus quality is governed mathematically. The specification analyses ensemble accuracy with the Condorcet framework — for agents with independent accuracy p and an N-agent ensemble with threshold M, correctness follows the cumulative binomial distribution, with a worked example showing a 10-agent ensemble at p = 0.7 reaching ~85% accuracy under simple majority.",
          "The Adversarial Evolution Protocol extends the mechanism over time: when elite agents saturate an evaluation function, a specialist adversarial agent is tasked to evolve a harder, more discerning test — a co-evolutionary arms race that keeps the merit signal informative.",
        ],
      },
    ],
    artifacts: [
      { label: "Tokenomics analysis", detail: "docs/tokenomics-analysis.md — burn-mint equilibrium, issuance, take parameters", href: "https://github.com/virtengine/virtengine" },
      { label: "Usage reporting & settlement design", detail: "docs/usage-reporting-settlement.md in the open repository" },
      { label: "DSEMA reputation & ensemble analysis", detail: "Condorcet ensemble bounds and adversarial evolution — spec §2.2.1.1, §2.10" },
    ],
    related: ["protocol-governance-design", "multi-agent-safety", "privacy-preserving-verification"],
  },
  {
    slug: "privacy-preserving-verification",
    title: "Privacy-preserving verification",
    question: "How much can you verify about a person, a machine, or a computation while learning nothing else?",
    summary:
      "The zero-knowledge and selective-disclosure stream: ZK proofs over identity attributes in x/veid/zk, verifiable performance records and DID-signed logs in DSEMA, and the constitutional mandate for selective disclosure and independent audit.",
    programs: ["VirtEngine", "DSEMA"],
    sections: [
      {
        heading: "The question",
        body: [
          "Verification and privacy are usually purchased with each other's currency: to prove you are unique, you disclose who you are; to prove a computation happened, you reveal its inputs. Zero-knowledge proofs, selective disclosure, and hardware attestation each attack the trade-off from a different angle. The research question is where the composition of the three is practical today at infrastructure scale — and where it still is not.",
        ],
      },
      {
        heading: "Identity: prove the property, not the person",
        body: [
          "In the VEID stream, the x/veid/zk package verifies proofs about identity attributes — validity, tier, uniqueness — without placing the attributes themselves on-chain. Verification results and commitments are recorded; documents and biometrics are not. Hardware attestation (secure-element biometrics, Play Integrity, App Attest) shifts trust from uploaded evidence to device-anchored cryptographic statements, and the consent framework and biometric data addendum in the repository document the data-handling boundaries.",
        ],
      },
      {
        heading: "Computation: verifiable records without exposed internals",
        body: [
          "DSEMA applies the same discipline to machine behaviour. Every agent action is signed against its DID; structured performance records are appended to the chain with roll-up proofs; full logs are published to content-addressed storage (IPFS) with only CIDs and hashes on-chain; and verifiable credentials attest to specializations without exposing model internals. The result under study is an audit trail that is complete enough for accountability and sparse enough for confidentiality.",
          "Constitutionally, clause 39.2 requires preferring architectures that use encryption and selective disclosure where feasible and allow independent audit where safe and lawful — making this stream an obligation, not an aesthetic.",
        ],
      },
    ],
    artifacts: [
      { label: "x/veid/zk", detail: "zero-knowledge proof verification for identity attributes", href: "https://github.com/virtengine/virtengine" },
      { label: "Consent framework & biometric addendum", detail: "CONSENT_FRAMEWORK.md, BIOMETRIC_DATA_ADDENDUM.md, PRIVACY_POLICY.md in the repository" },
      { label: "DSEMA verifiable logging pipeline", detail: "DID-signed logs, IPFS publication, on-chain roll-up proofs — spec §2.3–2.4" },
    ],
    related: ["decentralized-identity", "confidential-computing", "incentive-mechanism-design"],
  },
];

export function getResearchTopic(slug: string): ResearchTopic | undefined {
  return RESEARCH_TOPICS.find((t) => t.slug === slug);
}
