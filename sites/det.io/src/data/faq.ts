/**
 * FAQ — real questions with constitution-grounded answers.
 * `answer` is plain text (used verbatim in FAQPage JSON-LD);
 * `links` render beneath the answer on the page.
 */

export interface FaqItem {
  question: string;
  answer: string;
  links?: { label: string; href: string }[];
}

export const FAQ: FaqItem[] = [
  {
    question: "Is DET.io Foundation a charity?",
    answer:
      "Not yet, and we are careful about the word. DETIO FOUNDATION LTD is a not-for-profit public company limited by guarantee (ACN 699 651 771) established to operate for charitable and public-benefit purposes. Its constitution states that it may apply for registration as a charity with the Australian Charities and Not-for-profits Commission (ACNC). Until any such registration is granted, we describe ourselves as a not-for-profit with charitable purposes — not as a registered charity.",
    links: [{ label: "Purpose and the public-benefit lock", href: "/constitution/purpose-and-public-benefit-lock" }],
  },
  {
    question: "What is the public-benefit lock?",
    answer:
      "The constitution combines several safeguards: the company cannot operate for private commercial interests (clause 2.3); income and assets may only serve the charitable purposes and cannot be distributed to insiders (clause 8); amendments that would defeat the not-for-profit character are void and twenty Protected Provisions are entrenched under the Corporations Act (clause 18, Schedule 1); high-stakes decisions require Founding Member Consent (clause 18A); economic value is separated from governance so capital cannot buy control (clause 38); and on winding up, surplus assets can only pass to compatible charities (clauses 61–62).",
    links: [{ label: "Deep dive: the public-benefit lock", href: "/foundation/public-benefit-lock" }],
  },
  {
    question: "Who controls the foundation?",
    answer:
      "Day to day, a board of at least three directors with ordinary statutory duties. Structurally, control is deliberately split: the Founding Member (named in the constitution) holds a permanent membership with two votes, a Permanent Director seat, and written-consent rights over eight categories of Reserved Matters — but every one of those rights is subordinate to mandatory law, the Corporations Act, the ACNC Act, regulators, and courts, and none of them may be used for private benefit. No shareholder exists, because a company limited by guarantee has no shares.",
    links: [{ label: "Governance structure", href: "/governance" }],
  },
  {
    question: "What happens to the assets if the foundation winds up?",
    answer:
      "They cannot go to members. Surplus assets must be distributed to one or more ACNC-registered charities (or another charitable entity accepted by the ACNC) with compatible purposes, an equal-or-stricter prohibition on member distributions, and the legal capacity to steward the technology for public benefit. For VirtEngine and DSEMA specifically, the recipient should be capable of maintaining the same public-benefit, privacy-preserving, anti-capture principles. This is Protected Provision item 19.",
    links: [{ label: "Winding up and the charity lock", href: "/constitution/winding-up-and-the-charity-lock" }],
  },
  {
    question: "How is commercial activity constrained?",
    answer:
      "Commercial activity is expressly permitted — the foundation may charge fees, sell services, licence technology, and compete with for-profit companies — but only as a means of funding, scaling, securing, and sustaining the charitable purposes (clause 9.2). Earnings must be reinvested into research, engineering, infrastructure, security, compliance, and public-benefit delivery. The purposes cannot be traded away for revenue, because the amendment and entrenchment rules sit above every commercial decision.",
    links: [{ label: "Not-for-profit and remuneration rules", href: "/constitution/not-for-profit-and-remuneration-rules" }],
  },
  {
    question: "Does the founder profit from the foundation?",
    answer:
      "The constitution runs the other way. The Founding Member's salary for company work is capped at the lowest lawful minimum wage entitlement applicable to the work performed; sitting fees for acting as a director are prohibited; and the constitution creates no accrued-salary, deferred-compensation, interest, or back-pay entitlement. Any remuneration must be for work actually performed, approved by non-conflicted directors, documented, and reviewed as a related-party matter. The salary cap is itself an entrenched Protected Provision (Schedule 1, item 16).",
    links: [{ label: "Directors and the Permanent Director", href: "/constitution/directors-and-permanent-director" }],
  },
  {
    question: "What is VirtEngine?",
    answer:
      "VirtEngine is a decentralized cloud computing marketplace: a Cosmos SDK / CometBFT blockchain (written in Go, Apache 2.0, single virtengine binary) that connects tenants who need compute with providers who lease capacity, with identity, encryption, escrow, usage settlement, and provider auditing enforced by the chain itself. It is protected by granted Australian patent AU2024203136B2, in force until 12 May 2044, and includes VEID, a privacy-preserving decentralized identity layer.",
    links: [{ label: "VirtEngine program page", href: "/research/virtengine" }],
  },
  {
    question: "What is DSEMA?",
    answer:
      "DSEMA — the Dynamically Self-Evolving Multi-Agent architecture — is a patent-pending research program for collectives of specialized AI agents that improve their own models autonomously, with every improvement triggered, verified, and recorded by a blockchain-based control plane, every agent contained in a sandboxed execution environment, and every high-stakes action validated against an immutable constitutional safety layer before it executes.",
    links: [{ label: "DSEMA program page", href: "/research/dsema" }],
  },
  {
    question: "What is Bosun?",
    answer:
      "Bosun is the foundation's fully open-source, experimental orchestrator for autonomous software engineering — named after the boatswain, the ship's officer who coordinates deck work. It plans and routes tasks across AI coding agents (GitHub Copilot, Claude, Codex, OpenCode) with weighted distribution and automatic failover, automates the pull-request lifecycle with CI monitoring and merge-on-green behind a mandatory review gate, and recovers from failures with autofix patterns, circuit breakers, and stale-claim reclaim — while operators stay in command via Telegram and a dashboard. It is published whole under Apache-2.0, installs with npm install -g bosun, and its documentation lives at bosun.engineer.",
    links: [{ label: "Bosun program page", href: "/research/bosun" }],
  },
  {
    question: "Is Bosun the same thing as DSEMA?",
    answer:
      "No. DSEMA is a formal, patent-pending research architecture — blockchain control plane, constitutional safety layer, on-chain reputation. Bosun is working, experimental engineering software with none of those cryptographic mechanisms; its guarantees are practical ones such as review gates, execution ledgers, and human escalation. The two are related because Bosun is the applied track that informs the DSEMA research: it is an open, operating testbed where multi-agent coordination, accountability, and recovery meet real code every day. Bosun does not claim conformance with the DSEMA specification.",
    links: [
      { label: "Bosun program page", href: "/research/bosun" },
      { label: "Multi-agent safety research", href: "/research/multi-agent-safety" },
    ],
  },
  {
    question: "What is the Identity program? Is identity.org.au a government service?",
    answer:
      "The Identity program is VEID — Verifiable Electronic Identity — the identity layer of the VirtEngine protocol: multi-factor verification (document, selfie with active liveness, biometric hardware attestation, device integrity attestation) processed and encrypted on the user's own device, scored by chain consensus into verification tiers, and presented to services as zero-knowledge proofs of attributes rather than copies of documents. identity.org.au is the Foundation-operated public website; the wallet portal is planned for January 2027. VEID itself is decentralised validator-operated technology, not a Foundation-operated service. identity.org.au is not an Australian Government service.",
    links: [
      { label: "Identity program page", href: "/research/identity" },
      { label: "identity.org.au", href: "https://identity.org.au" },
    ],
  },
  {
    question: "Is there a token? Do I need one to use the technology?",
    answer:
      "The VirtEngine protocol defines a token as part of its marketplace economics, and the repository's tokenomics analysis describes its burn-mint-equilibrium design. Two constitutional facts matter more: nothing in the foundation's constitution obliges it to issue, sell, distribute, airdrop, custody, list, or operate any token (clause 38.2, Protected Provision item 7), and any transferable economic value must be structurally separated from governance over the foundation — so no quantity of tokens can buy control of the purposes or the constitution.",
    links: [{ label: "Protocol governance, privacy, and safety", href: "/constitution/protocol-governance-privacy-and-safety" }],
  },
  {
    question: "Is the VirtEngine network live?",
    answer:
      "We state exactly what the public record supports: the open repository contains a checked-in go/no-go decision recording a GO for mainnet, reaffirmed 2026-08-03 and rescheduled to the January 2027 launch window after the original 18–19 April 2026 (UTC) window did not proceed. For current network status, consult the protocol site and repository rather than this FAQ, which is updated on a slower cadence.",
    links: [{ label: "virtengine.com", href: "https://virtengine.com" }],
  },
  {
    question: "Why does a public-benefit foundation hold patents?",
    answer:
      "Defensively. A granted patent in private hands lets its owner fence off the invention and charge the public rent. The same patent held by a foundation whose constitution locks it to public benefit does the opposite: it prevents privatisation of the technique. The protocol code is simultaneously published under Apache 2.0, whose explicit patent grant gives users of the open code a licence to the patented invention as embodied in it.",
    links: [{ label: "Intellectual property stewardship", href: "/foundation/intellectual-property-stewardship" }],
  },
  {
    question: "Can I become a member of the foundation?",
    answer:
      "Possibly, but membership is deliberately scarce: at most two Ordinary Members may exist alongside the Founding Member unless the entrenched Protected Provisions are amended. An applicant must be at least 18, resident in Australia, and supportive of the purposes; admission requires a written application, a directors' decision, and prior written Founding Member Consent. Most supporters engage more effectively through open-source contribution, research collaboration, or the VirtEngine provider network.",
    links: [{ label: "Membership, honestly described", href: "/foundation/membership" }],
  },
  {
    question: "How can I verify any of this rather than take your word for it?",
    answer:
      "Almost every claim on this site cites a clause of the constitution, a patent number, or a file in the open repository. ACN 699 651 771 can be checked against the ASIC register; patent AU2024203136B2 against IP Australia and Google Patents; the code, module list, consent framework, and tokenomics analysis in the public GitHub repository. Where something is intent rather than fact — like ACNC registration — we label it as intent.",
    links: [{ label: "Transparency commitments", href: "/transparency" }],
  },
  {
    question: "How do I contact the foundation?",
    answer:
      "Email hello@det.io. Research collaboration, provider and infrastructure partnerships, protocol questions, membership inquiries, and media requests all start at the same address; the contact page explains what belongs where and what to expect in response.",
    links: [{ label: "Contact", href: "/contact" }],
  },
];
