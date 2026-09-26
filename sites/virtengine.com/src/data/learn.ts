/**
 * Learn: explainer guides. Powers /learn/[slug].
 * Grounded in repos/virtengine docs — tokenomics-analysis.md,
 * usage-reporting-settlement.md, hpc-*.md, veid/, README.md,
 * _docs/operations/mainnet-go-no-go-decision.md. No invented figures.
 */
import type { MediaSlug } from "@data/media";
import { MARKETPLACE_LEARN } from "./learn-marketplace";

export type LearnDiagram = "lifecycle" | "settlement" | "veid" | "staking" | "architecture" | "waldur";

/**
 * A visual rendered in the article body, above the prose sections. These are
 * the interactive figures the marketplace layer is built from; each one has a
 * complete text alternative and renders semantic HTML underneath.
 */
export type LearnVisualKind =
  | "lifecycle"
  | "acquisition"
  | "atlas"
  | "listing-anatomy"
  | "service-comparison"
  | "settlement-rail"
  | "order-anatomy"
  | "responsibility"
  | "fulfilment"
  | "meters";

export interface LearnVisual {
  kind: LearnVisualKind;
  /** Full text alternative for the figure (required). */
  label: string;
  caption?: string;
  /** Fulfilment-flow nodes when kind is "fulfilment". */
  nodes?: string[];
  kinds?: Record<string, "protocol" | "provider">;
  meters?: { label: string; value: string; percent: number }[];
}

export interface LearnScreenshot {
  src: string;
  alt: string;
  title: string;
  caption: string;
  sourceHref: string;
}

export interface LearnSource {
  label: string;
  detail: string;
  href: string;
}

export interface LearnSection {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
}

/** One page-level FAQ entry. */
export interface LearnFaq {
  question: string;
  answer: string;
  links?: { label: string; href: string }[];
}

/**
 * One step of the interactive overview stepper. The panel links into the
 * full article section via `href` (a `#section-id` anchor), so the stepper
 * is a navigable map rather than duplicated prose.
 */
export interface LearnJourneyStep {
  label: string;
  title: string;
  body: string;
  href: string;
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
  /** Interactive marketplace visuals rendered after the intro. */
  visuals?: LearnVisual[];
  /** Render the marketplace glossary (definition list) instead of prose. */
  glossary?: boolean;
  screenshots?: LearnScreenshot[];
  sources?: LearnSource[];
  sections: LearnSection[];
  related: { label: string; href: string }[];
  /** Brand photography for the hero. */
  media: MediaSlug;
  mediaCaption: string;
  /** Four key takeaways rendered as a checklist card under the hero. */
  takeaways: string[];
  /** Page-level FAQ rendered as an accordion. */
  faqs: LearnFaq[];
  /** Optional overview stepper for pipeline-structured guides. */
  journey?: LearnJourneyStep[];
}

export const LEARN: LearnEntry[] = [
  {
    slug: "how-the-marketplace-works",
    title: "How the VirtEngine marketplace works",
    label: "How the marketplace works",
    metaDescription:
      "How VirtEngine's Waldur-connected marketplace works: multi-service catalogue, three acquisition paths (direct, bid, selector), leases, usage reporting and settlement.",
    kicker: "Marketplace fundamentals",
    intro:
      "VirtEngine combines a Waldur-connected, multi-service catalogue with a five-stage protocol lifecycle: order, match, lease, usage, settlement. Waldur makes private clouds, storage, VMs and fully custom provider offerings available in one self-service surface; the protocol supplies identity, exchange and settlement guarantees. Match runs three acquisition paths: buy a named offering outright at its listed price (direct), open the order to competitive bids, or describe requirements and get matched to the best eligible listing (selector).",
    diagram: "lifecycle",
    diagramCaption: "The five-stage marketplace lifecycle: order → match → lease → usage → settlement",
    visuals: [
      {
        kind: "lifecycle",
        label:
          "Interactive five-stage lifecycle rail. Order: the tenant describes demand and funds escrow. Match: direct purchase at a listed price, competing bids, or attribute matching. Lease: the match binds tenant, provider and escrow. Usage: the provider measures and signs consumption. Settlement: validated usage releases escrowed funds after the dispute window. Selecting a stage shows what the tenant does, what the provider does, what becomes protocol state, and what stays off-chain.",
        caption: "The five stages, with the responsibility split at each one.",
      },
      {
        kind: "acquisition",
        label:
          "Interactive comparison of the three acquisition paths — direct order, open bid and selector — with an illustrative figure per path and a comparison table covering who chooses the provider, how price is set, whether bids are awaited and the best use of each path.",
        caption: "Match runs three ways. One market rail.",
      },
      {
        kind: "settlement-rail",
        label:
          "One settlement rail diagram: GPU VMs, managed Kubernetes, databases, HPC jobs, software plans, support services and custom listings all feed a single path from usage or agreed component through validated signed records to settlement and escrow release.",
        caption: "Many service types, one settlement rail.",
      },
    ],
    sections: [
      {
        heading: "Stage 1 — Order: describing what you need",
        paragraphs: [
          "A tenant can begin from a catalogue offering: a private cloud, storage service, VM, accelerator-backed service, or a provider's fully custom listing. Where a workload deployment is needed, x/deployment carries its declarative description in groups with CPU, memory, storage, accelerator and placement requirements.",
          "The order is the demand signal: a structured, on-chain request that either names one offering at its listed price or opens demand providers can bid on. Escrow is funded at this point, so the market can see the demand is backed by real budget.",
        ],
      },
      {
        heading: "Stage 2 — Match: three acquisition paths",
        paragraphs: [
          "Direct orders resolve immediately against the named offering — no waiting, no auction. Open orders collect bids from provider daemons, which price the work against their configured strategy; valid bids must satisfy the order's resource and attribute requirements.",
          "The tenant can accept a bid, or let the matching engine auto-resolve to the best-ranked offer when the bidding window closes. Selector orders name no provider at all: category, region, minimum specifications and a maximum price are resolved deterministically within that cap.",
        ],
        bullets: [
          "Direct — published price, immediate match, no bidding window.",
          "Open bid — competing on-chain bids, accepted or auto-resolved.",
          "Selector — request-for-quote semantics without the negotiation round-trip.",
        ],
      },
      {
        heading: "Stage 3 — Lease: the match becomes a contract",
        paragraphs: [
          "The match becomes a lease: the on-chain contract binding one tenant, one provider, and one escrow account. The Waldur integration passes the agreed service into the appropriate fulfilment path — Kubernetes for containerized services, a scheduler adapter (SLURM, MOAB, Open OnDemand) for HPC jobs, or a provider-defined integration for a custom offering.",
          "Off-chain communication between tenant and provider — delivering the workload manifest, fetching status — is mutually authenticated with TLS certificates anchored on-chain by x/cert.",
        ],
      },
      {
        heading: "Stage 4 — Usage: metering with signatures",
        paragraphs: [
          "The provider daemon meters per-workload consumption on an hourly cadence. Metrics become usage records, screened by anomaly detection and submitted in signed batches (MsgRecordUsage) with retry and backoff.",
          "Reconciliation runs alongside — cross-checking reported usage against platform metrics on a six-hour default interval and flagging discrepancies above threshold. A record that never gets signed never becomes billable.",
        ],
      },
      {
        heading: "Stage 5 — Settlement: usage becomes payment",
        paragraphs: [
          "The settlement module (x/settlement) validates each record against its lease and converts it into priced line items. Records sit in a 24-hour dispute window where either party can raise corrections; after it closes, line items settle against the lease's escrow.",
          "Funds transfer to the provider at the agreed lease price at the full agreed amount — with no protocol deduction. When the deployment closes, unspent escrow returns to the tenant.",
        ],
      },
      {
        heading: "Fulfilment",
        paragraphs: [
          "The chain does not provision infrastructure. After the lease binds tenant, provider and escrow, the provider daemon routes the matched request into the provider control plane, which invokes the configured backend.",
          "Provision, resize, suspend, resume and terminate are asynchronous. Each outcome returns as an authenticated callback before it becomes correlated lease state. Operational dashboards remain views; protocol payout follows the lease.",
        ],
      },
      {
        heading: "Why this design holds up",
        paragraphs: [
          "Each stage hands off with a verifiable artifact: orders backed by escrow, matches validated against requirements, leases binding funds, usage signed and disputable, settlement rule-bound. VEID is optional for general participation; any provider-set proof requirement should be disclosed on the individual offer before an order.",
        ],
      },
    ],
    related: [
      { label: "Escrow & settlement explained", href: "/learn/escrow-and-settlement-explained" },
      { label: "x/market module reference", href: "/modules/market" },
      { label: "Become a provider", href: "/providers" },
      { label: "Cost-optimized cloud", href: "/solutions/cost-optimized-cloud" },
    ],
    media: "marketplace-hardware",
    mediaCaption: "Demand meets capacity on one exchange.",
    takeaways: [
      "Five stages, one lifecycle: order → match → lease → usage → settlement.",
      "Match runs three ways: direct at a listed price, open to competing bids, or resolved by attributes.",
      "Every stage produces a verifiable artifact — orders backed by escrow, signed usage, rule-bound settlement.",
      "A provider may set a clearly disclosed VEID requirement for an individual offer; other marketplace offers can be used without VEID.",
      "Settlement fees are governance-set protocol parameters; unspent escrow returns to the tenant.",
    ],
    faqs: [
      {
        question: "Where do I start — Waldur or the chain?",
        answer:
          "Either. Tenants can begin from a Waldur offering and buy it outright at its listed price; the protocol client creates the verifiable market order and the lease is correlated with a Waldur order for fulfilment. Open bidding is available when you want price discovery instead, and selector orders match eligible listings by attribute and price cap. Match selection and escrow never leave the chain.",
        links: [{ label: "Waldur + VirtEngine", href: "/waldur" }],
      },
      {
        question: "Who sets the price?",
        answer:
          "The offering's published price for direct orders; competing providers for open bid orders; the best eligible listing within your cap for selector orders. Bids must satisfy the order's resource and attribute requirements, and multiple bids against one order is the price-setting mechanism for that mode — competition per order, not per contract cycle.",
      },
      {
        question: "What happens when usage numbers are disputed?",
        answer:
          "Records sit in a 24-hour window where either party can raise corrections. Disputes escalate through support intake, and to fraud handling where misconduct is alleged — while anomaly detection screens records before they ever reach the chain.",
        links: [{ label: "Escrow & settlement explained", href: "/learn/escrow-and-settlement-explained" }],
      },
      {
        question: "How do tenant and provider communicate off-chain?",
        answer:
          "Through mutually authenticated channels: delivering manifests, fetching status, and reaching services all ride TLS connections anchored on-chain by x/cert.",
        links: [{ label: "x/cert module", href: "/modules/cert" }],
      },
    ],
    journey: [
      {
        label: "Order",
        title: "Post demand backed by budget",
        body: "A deployment emits a structured on-chain order; the tenant funds escrow so the market sees real budget behind the demand.",
        href: "#stage-1-order-describing-what-you-need",
      },
      {
        label: "Match",
        title: "Direct purchase or competitive bid",
        body: "Named offerings match immediately at the listed price; open orders collect bids and resolve to the best-ranked offer.",
        href: "#stage-2-match-three-acquisition-paths",
      },
      {
        label: "Lease",
        title: "The match becomes a contract",
        body: "One tenant, one provider, one escrow account — fulfilment routes to Kubernetes, a scheduler adapter, or a custom integration.",
        href: "#stage-3-lease-the-match-becomes-a-contract",
      },
      {
        label: "Usage",
        title: "Metered, signed, screened",
        body: "Hourly metering with anomaly detection, signed batches with retry and backoff, and six-hour reconciliation against platform metrics.",
        href: "#stage-4-usage-metering-with-signatures",
      },
      {
        label: "Settlement",
        title: "Records become payment",
        body: "Line items priced by lease terms, a 24-hour dispute window, escrow payout at the full agreed amount — and unspent funds return.",
        href: "#stage-5-settlement-usage-becomes-payment",
      },
    ],
  },
  {
    slug: "escrow-and-settlement-explained",
    title: "Escrow & Settlement Explained: No Invoices",
    label: "Escrow & settlement",
    metaDescription:
      "How VirtEngine replaces invoicing: escrow accounts, hourly usage records, 24-hour dispute window, anomaly detection and automatic payout.",
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
          "After the window closes, the settlement module converts validated records into line items priced by lease terms and draws them down from escrow. The provider receives the agreed settlement amount at the full agreed amount — protocol parameters set by governance, not a private platform take. Validator transaction fees apply to chain messages and are designed to be approximately 90% lower than standard network transaction fees. The provider's revenue arrives as settled chain state, with a complete audit trail from meter to payment.",
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
    media: "settlement-ledger",
    mediaCaption: "Metered usage, settled from escrow.",
    takeaways: [
      "Escrow is commitment without transfer — provably funded, movable only under settlement rules.",
      "Meters collect hourly; records are signed, anomaly-screened, and reconciled every six hours.",
      "Every record waits out a 24-hour dispute window before it can settle.",
      "Payout transfers the full agreed ACT amount to the provider; unspent escrow returns to the tenant.",
    ],
    faqs: [
      {
        question: "What happens if escrow runs dry?",
        answer:
          "Leases close for non-payment and service stops. If a deployment closes with balance remaining, it returns to the tenant — funds are committed, never stranded.",
      },
      {
        question: "What are the metering pipeline defaults?",
        answer:
          "One-hour settlement intervals, batches of ten records, three retry attempts, and a reconciliation pass every six hours cross-checking chain-reported usage against platform metrics with a configurable discrepancy threshold.",
        links: [{ label: "x/settlement module", href: "/modules/settlement" }],
      },
      {
        question: "Who can dispute a usage record?",
        answer:
          "Either party, inside the 24-hour window. Disputed records escalate through support intake, and to fraud handling where misconduct is alleged.",
        links: [{ label: "x/escrow module", href: "/modules/escrow" }],
      },
      {
        question: "What does the provider actually receive?",
        answer:
          "The agreed settlement amount from escrow at the full agreed amount — with no protocol deduction. Only chain-message transaction fees otherwise apply, proposed at approximately 90% below standard network transaction fees.",
      },
    ],
    journey: [
      {
        label: "Escrow",
        title: "Fund commitment, not payment",
        body: "The tenant funds x/escrow at deployment creation; providers verify collateral exists before serving a single hour.",
        href: "#escrow-commitment-without-transfer",
      },
      {
        label: "Meter",
        title: "Hourly signed records",
        body: "The collector runs hourly; anomaly detection screens output; signed batches submit with retry and backoff.",
        href: "#the-metering-pipeline",
      },
      {
        label: "Dispute",
        title: "24 hours to correct",
        body: "Nothing settles immediately. Corrections come from either party; misconduct escalates to fraud handling.",
        href: "#the-24-hour-dispute-window",
      },
      {
        label: "Settle",
        title: "Line items become payout",
        body: "Validated records price into line items and draw down escrow at the full agreed amount — full audit trail from meter to payment.",
        href: "#settlement-and-payout",
      },
    ],
  },
  {
    slug: "tokenomics-explained",
    title: "VirtEngine Tokenomics: Supply & Rewards",
    label: "Tokenomics",
    metaDescription:
      "VirtEngine tokenomics 2026: identity-led issuance from zero supply, conservative staking rewards and governance-controlled parameters.",
    kicker: "Economics",
    intro:
      "VirtEngine's proposed economic model recognizes sustained, unique verified identity while retaining a conservative staking component for network security. Parameters are governance-controlled and may change before or after launch.",
    sections: [
      {
        heading: "Initial and maximum supply",
        paragraphs: [
          "Initial supply is 0 tokens. New tokens are issued only when unique human identities are verified. There is no fixed maximum supply or hard cap: issuance follows verified human participation and continues as new identities are verified and the human population grows.",
          "The Foundation-controlled genesis account starts with zero tokens; its allocation comes from eligible VEID issuance batches, not a premine. Staking rewards do not independently authorize new token issuance.",
        ],
      },
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
          "Validators and delegators continue to receive staking rewards for contributing to security. The proposed staking reward allocation is roughly 90% lower than in the previous model. Rates, commission, unbonding and slashing terms are governed parameters; they are not fixed yield or return promises.",
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
          "This is the proposed model for the March 2027 MainNet launch window, not a token offer or a promise of allocation. TestNet is planned for January 2027, but TestNet parameters, tokens, and state are pre-production and are not guaranteed to carry into MainNet. Final parameters and any later amendments should be checked against published governance decisions.",
        ],
      },
      {
        heading: "Proposed parameters at a glance",
        paragraphs: [],
        bullets: [
          "Initial supply: 0 tokens",
          "Maximum supply: no cap; issuance follows verified human identities and population growth",
          "Identity allocation: network-defined unique-identity threshold",
          "Activity: illustrative quarterly sign-in requirement",
          "Accrual horizon: illustrative 50 years",
          "Per 15 issued through VEID: 14 to eligible humans, 1 to the Foundation genesis account",
          "Staking reward allocation: proposed at roughly 90% lower than the prior model",
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
    media: "identity-document",
    mediaCaption: "Issuance that follows verified humans, not a schedule.",
    takeaways: [
      "Initial supply is zero; issuance follows verified human identities — no premine, no cap.",
      "VEID batches mint 15 tokens: 14 to eligible humans, 1 to the Foundation genesis account.",
      "Staking rewards continue at a proposed ~90% lower level — governed, never promised yield.",
      "Every parameter — threshold, activity rules, ratios, schedules — is amendable by consensus.",
    ],
    faqs: [
      {
        question: "Is there a fixed maximum supply?",
        answer:
          "No. New tokens issue only as unique human identities verify, and continue as the verified population grows — supply follows participation, not a schedule.",
      },
      {
        question: "What is the 50-year illustration?",
        answer:
          "The working illustration for allocation accrual: a 50-year horizon with a quarterly sign-in activity check. Inactive accounts pause future minting until they again meet the protocol rules — and the threshold, activity definition, and duration can all change by consensus.",
      },
      {
        question: "Does the Foundation get a premine?",
        answer:
          "No. The genesis account starts at zero; its allocation comes from eligible VEID issuance batches — 1 token in each 15-token batch — a governed parameter updatable through consensus.",
        links: [{ label: "x/bme module", href: "/modules/bme" }],
      },
      {
        question: "Do TestNet tokens carry into MainNet?",
        answer:
          "No guarantee. TestNet parameters, tokens, and state are pre-production. Final parameters should be checked against published governance decisions.",
        links: [{ label: "Mainnet roadmap", href: "/learn/mainnet-roadmap" }],
      },
    ],
  },
  {
    slug: "what-is-veid",
    title: "What is VEID (Verifiable Electronic Identity)?",
    label: "What is VEID?",
    metaDescription:
      "VEID explained: VirtEngine's privacy-preserving identity layer with on-device capture, liveness, hardware attestation, validator scoring and ZK proofs.",
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
          "VEID is not a universal marketplace gate. Providers may choose a clearly disclosed proof requirement for an individual offer, while tenants can choose offers that do not require VEID. Reviews bind to protocol leases, and escrow and dispute processes address transaction risk; identity verification alone does not prove that a listing or service is genuine. Sensitive account operations — recovery above all — layer on-chain MFA (x/mfa) over the identity foundation.",
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
    media: "identity-liveness",
    mediaCaption: "Proof of a present human, computed on-device.",
    takeaways: [
      "Evidence is captured on-device — documents, liveness, biometrics, device integrity — and sealed before it leaves the phone.",
      "Only governance-approved clients may submit; client and user both sign.",
      "Validators decrypt, score with shared models, and commit trust scores by consensus (patent AU2024203136B2).",
      "Counterparties learn only ZK-proven facts — never documents, biometrics, or scores.",
    ],
    faqs: [
      {
        question: "What actually leaves my phone?",
        answer:
          "Only encrypted identity scopes — never raw documents or biometrics. The public ledger carries ciphertext and committed scores, nothing else.",
      },
      {
        question: "What is active liveness?",
        answer:
          "Challenge–response selfie checks that defeat photos, replays, and injection attacks — proven on-device before anything is sealed into a scope.",
      },
      {
        question: "Can anyone build a VEID client?",
        answer:
          "Anyone can build, but only governance-approved clients on the x/config list may submit identity data — capture-software integrity is a stakeholder vote, not an assumption.",
        links: [{ label: "x/veid module", href: "/modules/veid" }],
      },
      {
        question: "Where is the consumer program?",
        answer:
          "Presented at identity.org.au; protocol-side documentation lives at docs.virtengine.com. The reference wallet implementation is mobile/veid-capture-app/ in the protocol repo.",
        links: [{ label: "VEID overview page", href: "/veid" }],
      },
    ],
    journey: [
      {
        label: "Capture",
        title: "Evidence on-device",
        body: "Documents with OCR, active-liveness selfie, biometric and device attestation — sealed into encrypted scopes before anything leaves the phone.",
        href: "#capture-happens-on-your-device",
      },
      {
        label: "Submit",
        title: "Approved clients only",
        body: "Submissions need the governance-approved client list and dual signatures — client and user — verified before any scoring.",
        href: "#only-approved-clients-may-submit",
      },
      {
        label: "Score",
        title: "Consensus scoring",
        body: "Validators decrypt with their keys, evaluate with shared ML models, and commit trust scores — the patented identity-consensus method.",
        href: "#validators-score-by-consensus",
      },
      {
        label: "Prove",
        title: "Zero-knowledge disclosure",
        body: "Prove a threshold or attribute — age range, residency — without revealing the document, the biometric, or the score itself.",
        href: "#zero-knowledge-disclosure",
      },
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
    media: "staking-security",
    mediaCaption: "Bonded stake, and the conditions that guard it.",
    takeaways: [
      "Equivocation and extended downtime are the slashable offenses — basis-point penalties on bonded stake.",
      "Delegators underwrite their validator: delegated stake slashes alongside self-bond.",
      "Unbonding takes 21 days — no rewards, still slashable for prior offenses.",
      "Commission is the least informative number; evaluate uptime, key custody, self-bond, ML capacity, and governance.",
    ],
    faqs: [
      {
        question: "What is equivocation?",
        answer:
          "Signing two different blocks at the same height — the cardinal consensus sin — carrying slashing penalties on bonded stake.",
      },
      {
        question: "Does slashing touch delegators?",
        answer:
          "Yes. Delegation is underwriting, not lending: your stake shares the validator's liability for equivocation and extended downtime.",
        links: [{ label: "For staking partners", href: "/solutions/staking-partners" }],
      },
      {
        question: "Why does unbonding take 21 days?",
        answer:
          "It makes long-range attacks expensive. During the window your stake earns no rewards and remains slashable for offenses the validator committed while your stake was bonded.",
      },
      {
        question: "How is slashing different from fraud enforcement?",
        answer:
          "Slashing punishes validator protocol violations. Tenant and provider misconduct flows through the fraud module instead.",
        links: [{ label: "x/fraud module", href: "/modules/fraud" }],
      },
    ],
  },
  {
    slug: "provider-economics",
    title: "Provider Economics: Revenue & Pricing",
    label: "Provider economics",
    metaDescription:
      "The revenue model for VirtEngine providers: listing and bid pricing, escrow-backed leases, full agreed provider payouts, low chain fees, plus how benchmarks and audits lift prices.",
    kicker: "Economics",
    intro:
      "A provider's business on VirtEngine reduces to three questions: what does capacity earn, what do chain actions cost, and what raises realized prices over time? The answers are unusually legible, because every term is chain state.",
    sections: [
      {
        heading: "Revenue: prices you set, escrow that pays",
        paragraphs: [
          "You publish list prices for direct orders, and configure bid strategy in the provider daemon for orders opened to competition; the marketplace matches both against demand. Every lease you win is backed by escrow funded before the workload starts — verifiable on-chain — so revenue risk is settled before capacity is committed.",
          "Usage is metered hourly and settles automatically after the 24-hour dispute window. There is no invoicing, no collections, and no accounts-receivable aging: settled usage is settled money.",
        ],
      },
      {
        heading: "Costs: transaction fees and operations",
        paragraphs: [
          "Lease settlements have no platform or validator fee deduction: the full agreed amount is paid to the provider in ACT. Chain transaction fees for actions such as bidding and usage submission compensate validators and are proposed at approximately 90% below standard network transaction fees. The daemon can manage those fees with batching. Your real cost base remains power, hardware, bandwidth, and people.",
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
          "A tenant posts an order; a direct order matches your published price, or your daemon bids your configured price and the tenant accepts. The workload runs on your Kubernetes cluster or HPC scheduler. Hourly usage records — signed, anomaly-screened — accumulate against the lease. Each clears its dispute window and settles: escrow pays the agreed lease amount at the full agreed amount. Your track record grows by one more served lease, and the next order prices a little better.",
        ],
      },
    ],
    related: [
      { label: "Become a provider", href: "/providers" },
      { label: "Escrow & settlement explained", href: "/learn/escrow-and-settlement-explained" },
      { label: "Datacenter operators", href: "/solutions/datacenter-operators" },
      { label: "GPU compute providers", href: "/solutions/gpu-compute-providers" },
    ],
    media: "provider-technician",
    mediaCaption: "The economics of serving capacity.",
    takeaways: [
      "You price the bids; funded escrow pays them — revenue risk settles before capacity commits.",
      "Settlement fees are governance-set; chain fees run ~90% below standard networks and batch well.",
      "Benchmarks, audits, reviews, and enclave capability move you from price competition to quality competition.",
      "Demand arrives verified and funded — containers to HPC batch — and every served lease raises the next price.",
    ],
    faqs: [
      {
        question: "What does the protocol charge providers?",
        answer:
          "Settlement fees are governance-set protocol parameters, not a private platform margin. Only chain-message transaction fees otherwise apply — proposed at approximately 90% below standard network transaction fees, manageable with batching. Your real cost base stays power, hardware, bandwidth, and people.",
      },
      {
        question: "How do we escape pure price competition?",
        answer:
          "Publish benchmarks for measured capability, get attributes auditor-signed, compound lease-bound reviews, and offer attested enclave capacity. Attribute-constrained orders pay for verified quality instead of the lowest sticker price.",
      },
      {
        question: "What does “no accounts receivable” mean in practice?",
        answer:
          "Usage meters hourly and settles automatically after the dispute window. No invoicing, no collections, no aging — settled usage is settled money.",
        links: [{ label: "Escrow & settlement explained", href: "/learn/escrow-and-settlement-explained" }],
      },
      {
        question: "Who are we selling to?",
        answer:
          "Identity-verified tenants with funded escrow — from containerized services to HPC batch jobs. Attribute-constrained orders from buyers who need audited, benchmarked, or attested capacity are where differentiated operators win.",
        links: [{ label: "Datacenter operators", href: "/solutions/datacenter-operators" }],
      },
    ],
  },
  {
    slug: "confidential-computing-on-virtengine",
    title: "Confidential Computing: Enclaves & Proof",
    label: "Confidential computing",
    metaDescription:
      "Confidential computing on VirtEngine: enclave attestation on-chain, encrypted payloads and attested placement. Run sensitive workloads verifiably.",
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
          "Confidential workloads can use attested execution, chain-anchored mTLS (x/cert) on supported off-chain connections, auditor-signed provider attributes (x/audit), and fraud/dispute processes. VEID may be an offer-specific risk signal, but it does not establish workload confidentiality or service quality by itself.",
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
    media: "identity-portrait",
    mediaCaption: "Confidentiality you can verify, not just trust.",
    takeaways: [
      "TEEs close the memory-reading hole in silicon; attestations prove exactly what runs inside.",
      "Attestation is chain state — orders can require attested execution, so unverified capacity never matches.",
      "Secrets deliver only into verified enclaves: proof first, secrets second, enforced by protocol.",
      "Confidential workloads inherit the full stack: VEID, mTLS, audits, fraud enforcement.",
    ],
    faqs: [
      {
        question: "What is an attestation?",
        answer:
          "Hardware-signed evidence of exactly what code, in exactly what configuration, runs inside the enclave — verifiable by any counterparty, not just the operator's claim.",
        links: [{ label: "x/enclave module", href: "/modules/enclave" }],
      },
      {
        question: "When do our secrets move?",
        answer:
          "Only after attestation verifies. Envelope-encrypted payloads deliver into the proven enclave — proof first, secrets second — enforced by protocol machinery rather than provider goodwill.",
        links: [{ label: "x/encryption module", href: "/modules/encryption" }],
      },
      {
        question: "What can we show procurement?",
        answer:
          "On-chain attestations, auditor-signed provider attributes, optional VEID proofs where an offer requires them, mTLS channels, and signed metered usage — evidence to examine as part of a confidentiality review.",
      },
      {
        question: "Which workloads fit this pattern?",
        answer:
          "Wherever data or models must not be exposed to the infrastructure operator: regulated datasets, proprietary weights in training or inference, key-handling services, and multi-party computations where participants trust the enclave but not each other.",
      },
    ],
  },
  {
    slug: "hpc-on-virtengine",
    title: "HPC on VirtEngine: SLURM Jobs On-Chain",
    label: "HPC on VirtEngine",
    metaDescription:
      "HPC on VirtEngine: the x/hpc job model, SLURM, MOAB and Open OnDemand adapters, job lifecycle and settlement for batch supercomputing work.",
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
    media: "hpc-supercomputer",
    mediaCaption: "Batch capacity, scheduled and settled.",
    takeaways: [
      "Jobs — resources, walltime, partitions — are first-class marketplace objects, not container leases.",
      "Native adapters (SLURM with munge/JWT, MOAB, Open OnDemand); the scheduler stays in charge.",
      "Crash-safe lifecycle tracking with a dedicated audit log for job, security, and usage events.",
      "Settlement is identical to cloud leases: signed records, dispute window, escrow drawdown.",
    ],
    faqs: [
      {
        question: "Do we replace our scheduler?",
        answer:
          "No. Adapters connect the provider daemon to your existing controller; the scheduler keeps its resources and the marketplace becomes another source of authorized work.",
      },
      {
        question: "What survives a daemon crash?",
        answer:
          "Running jobs are not orphaned and queued jobs are not double-dispatched — state recovery is crash-safe by design, with concurrency limits and timeouts.",
      },
      {
        question: "How are partitions exposed to the market?",
        answer:
          "Through per-partition configuration: facilities choose which partitions and job classes the market may schedule into, without disturbing primary-user allocations.",
        links: [{ label: "HPC clusters solution", href: "/solutions/hpc-clusters" }],
      },
      {
        question: "Where is the operator detail?",
        answer:
          "In docs/hpc-provider-operations.md, docs/hpc-node-agent.md, and docs/hpc-workload-publishing.md in the protocol repo — scheduler auth, job lifecycle, and workload publishing end to end.",
        links: [{ label: "x/hpc module", href: "/modules/hpc" }],
      },
    ],
  },
  {
    slug: "governance-guide",
    title: "Governance: Voting, Upgrades & Control",
    label: "Governance guide",
    metaDescription:
      "VirtEngine governance guide: bonded-stake voting, issuance and fee parameters, roles and config, plus Foundation stewardship. Learn who controls what.",
    kicker: "Governance",
    intro:
      "VirtEngine's answer to \"who controls this?\" has two layers: on-chain governance by bonded stake for protocol decisions, and a not-for-profit foundation whose constitution forbids private capture of the project itself. This guide covers both.",
    sections: [
      {
        heading: "Bonded stake governs",
        paragraphs: [
          "Validators and delegators vote with bonded stake on parameter changes, software upgrades, and chain configuration. Economic parameters — staking targets, validator-fee parameters, marketplace settlement fees and issuance policy — are chain state, adjustable by proposal rather than by decree. If you delegate, your stake carries governance weight; using it is part of the job.",
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
          "Marketplace settlement fees — governed parameters applied to settled payments",
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
    media: "closing-hands",
    mediaCaption: "Decisions made with the stakeholders who carry them.",
    takeaways: [
      "Bonded stake votes on parameters, upgrades, and configuration — delegating carries governance weight.",
      "The approved-client list is the most consequential governed object: capture-software integrity by stakeholder vote.",
      "Settlement fees are governed parameters, chain fees ~90% below standard, issuance VEID-led — all chain state, all amendable.",
      "The Foundation's constitution locks the project to public benefit: no private operation, no dividends, no capture.",
    ],
    faqs: [
      {
        question: "What can governance change?",
        answer:
          "Economic parameters — staking targets, fee parameters, issuance policy — plus the approved-client list, chain configuration, and software upgrades. Anything protocol runs by proposal and vote.",
      },
      {
        question: "Why is the approved-client list so important?",
        answer:
          "Identity capture happens in software, so that software's integrity is a trust decision — made by stakeholders with a public proposal trail, rather than left to any single party.",
        links: [{ label: "x/config module", href: "/modules/config" }],
      },
      {
        question: "What does the Foundation control?",
        answer:
          "Stewardship of the protocol, patent rights, identity system, chain, and token under a public-benefit lock — not operation of the network or a central VEID service. Stakeholders govern the running protocol; the constitution guarantees no one can take the protocol itself private.",
        links: [{ label: "About the foundation", href: "/about" }],
      },
      {
        question: "Are settlement fees deducted from provider payouts?",
        answer:
          "Settlement fees are governed protocol parameters, set and changed only by stakeholder vote — not a private platform margin.",
      },
    ],
  },
  {
    slug: "mainnet-roadmap",
    title: "Road to MainNet: TestNet 2027 to Launch",
    label: "Mainnet roadmap",
    metaDescription:
      "Road to VirtEngine MainNet: TestNet January 2027, MainNet March 2027, validation gates and promotion criteria. Track the launch posture.",
    kicker: "Network",
    intro:
      "VirtEngine's launch posture is unusual for the industry: it is a checked-in, versioned decision record, not a marketing countdown. This guide reports exactly what the repository records and shows you how to verify it yourself.",
    sections: [
      {
        heading: "The launch sequence",
        paragraphs: [
          "TestNet is planned for the January 2027 launch window. It is the public pre-production environment for multi-operator validation and may be reset; its tokens have no production value and its state is not guaranteed to migrate to MainNet.",
          "MainNet is planned for the March 2027 launch window. It is the persistent production network and requires TestNet exit evidence, final artifacts, and a fresh go/no-go approval. Exact dates will be published through the formal launch process, and neither network should be described as live before confirmation.",
        ],
      },
      {
        heading: "Why the windows are separated",
        paragraphs: [
          "January provides real public TestNet evidence across consensus, validator and provider operations, VEID, marketplace and settlement flows, upgrades, monitoring, recovery, and incident response.",
          "February is reserved for observing results, remediating and re-testing defects, completing security and operational reviews, freezing production artifacts, and coordinating validators. March is the MainNet window only after those exit criteria are accepted; TestNet success is not automatic MainNet approval.",
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
    media: "hero-infrastructure",
    mediaCaption: "From TestNet to MainNet, stage by stage.",
    takeaways: [
      "TestNet January 2027: public pre-production validation; state may reset, tokens have no production value.",
      "February is remediation and review; March MainNet needs fresh go/no-go approval — TestNet success is not automatic promotion.",
      "The decision record is checked in: config/mainnet/, the go/no-go doc, RELEASE.md, VERIFICATION.md.",
      "After genesis, chain state is the truth — and the repo stays the source for releases and posture.",
    ],
    faqs: [
      {
        question: "Do TestNet tokens or state carry into MainNet?",
        answer:
          "No guarantee. TestNet is pre-production and may reset; MainNet needs TestNet exit evidence, final artifacts, and a fresh approval.",
      },
      {
        question: "What happens in February?",
        answer:
          "Observing results, remediating and re-testing defects, completing security and operational reviews, freezing production artifacts, and coordinating validators — the unglamorous work between evidence and approval.",
      },
      {
        question: "What should operators verify before running?",
        answer:
          "That their release tag is actually published, that the target network has an approved launch or upgrade decision, and that VERIFICATION.md matches their deployment — with genesis materials validated against the published bundle in config/mainnet/.",
        links: [{ label: "Network status", href: "/network" }],
      },
      {
        question: "Where do launch dates get published?",
        answer:
          "Through the formal launch process. Neither network should be described as live before confirmation - exact dates arrive through official announcements, not this guide.",
      },
    ],
  },
  ...MARKETPLACE_LEARN,
];

export function getLearn(slug: string): LearnEntry | undefined {
  return LEARN.find((l) => l.slug === slug);
}
