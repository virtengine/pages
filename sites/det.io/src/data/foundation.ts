/**
 * Foundation pages — who we are and how the institution works in practice.
 * Grounded in the signed constitution of DETIO FOUNDATION LTD and the open
 * VirtEngine repository. No invented staff, partners, financials, or
 * charity-registration claims (registration is an intent per clause 2.2).
 */

export interface FoundationSection {
  heading: string;
  /** Optional clause citations rendered as mono chips */
  clauses?: string[];
  body: string[];
}

export interface FoundationPage {
  slug: string;
  title: string;
  eyebrow: string;
  summary: string;
  sections: FoundationSection[];
  related: { label: string; href: string }[];
}

export const FOUNDATION_PAGES: FoundationPage[] = [
  {
    slug: "who-we-are",
    title: "Who we are",
    eyebrow: "The institution",
    summary:
      "DETIO FOUNDATION LTD — Digital Elastic Technologies, Internet Organization — is a not-for-profit public company limited by guarantee (ACN 699 651 771, Australia) responsible for the VirtEngine protocol and the DSEMA multi-agent architecture in the public interest.",
    sections: [
      {
        heading: "A research foundation, stated precisely",
        clauses: ["1.1", "2.1", "2.2"],
        body: [
          "The legal entity is DETIO FOUNDATION LTD, a not-for-profit public company limited by guarantee registered in Australia with ACN 699 651 771. The name behind the acronym is Digital Elastic Technologies, Internet Organization. The company is established to operate for charitable and public-benefit purposes and may apply for registration as a charity with the ACNC. That intention is recorded in the constitution; it is not a status we claim before it exists.",
          "The foundation grew out of DET.io, the earlier private company (DET-IO Pty Ltd) whose cloud-platform work seeded the technology. The constitution records the intended transfer of that company's intellectual property and digital assets to the foundation, and permits DET-IO Pty Ltd to continue only as a subsidiary serving the charitable purposes.",
          "That predecessor's work was supported once by public funding: DET-IO Pty Ltd received a Jobs for NSW Minimum Viable Product grant (up to $27,000), disclosed in the Jobs for NSW Annual Report 2019–20 tabled in NSW Parliament, and a further NSW Government business-grant application is in progress at the time of writing. These are business grants only — no government operates, controls, or endorses the foundation or its programs.",
        ],
      },
      {
        heading: "What we actually do",
        clauses: ["6.2.1", "6.2.2", "6.2.5"],
        body: [
          "The foundation develops, publishes, operates, and maintains two flagship public-benefit technology programs: VirtEngine, a decentralized cloud computing marketplace with a privacy-preserving identity layer, published under Apache 2.0 and protected by accepted patent AU2024203136B2; and DSEMA, a patent-pending architecture for safe, accountable, auditable, self-improving multi-agent AI systems.",
          "Around the programs sits the education mandate: public research, open specifications, standards, documentation, and safety materials. This website, the protocol documentation, and the identity research site are all deliverables of that mandate.",
        ],
      },
      {
        heading: "The people, honestly scoped",
        clauses: ["11.2", "21.1", "35.1"],
        body: [
          "The constitution names the people it must name and no more. The Founding Member and first Permanent Director is Jonathan Amir Samuel Philipos. The signing page records Ordinary Members Wail Rimon Philopos and Adel John Nour, and DET-IO PTY. LTD. as a corporate signatory represented by the Founding Member. The board must include at least three directors, at least two ordinarily resident in Australia.",
          "We do not publish staff counts, adviser lists, or partner logos that do not exist. As the foundation's public record grows — regulatory filings, annual reports, program milestones — this page grows with it.",
        ],
      },
    ],
    related: [
      { label: "Mission — the four purpose pillars", href: "/mission" },
      { label: "Governance — how control is structured", href: "/governance" },
      { label: "Constitution explorer", href: "/constitution" },
    ],
  },
  {
    slug: "public-benefit-lock",
    title: "The public-benefit lock",
    eyebrow: "Deep dive",
    summary:
      "The lock is not one clause — it is a lattice of mutually reinforcing provisions: purpose restrictions, distribution prohibitions, entrenched Protected Provisions, consent gates, anti-capture protocol rules, and a charity-only winding-up destination.",
    sections: [
      {
        heading: "Six layers, one direction",
        clauses: ["2.3", "8.2", "18.2", "18A.1", "38.1", "62.1"],
        body: [
          "Layer one — type: the company must not operate for private commercial interests, shareholder profit, dividends, private extraction, or private ownership of the IP and digital assets held for its purposes (clause 2.3). Layer two — money: income and assets may only serve the purposes; distributions to insiders are prohibited (clause 8). Layer three — amendment: changes that would defeat the not-for-profit character are void, and the twenty Protected Provisions are entrenched under Corporations Act sections 136(3)–(4) (clause 18, Schedule 1). Layer four — decisions: eight categories of high-stakes decisions require prior written Founding Member Consent (clause 18A). Layer five — protocol: transferable economic value must be structurally separated from governance, so capital cannot buy control (clause 38). Layer six — exit: on winding up, surplus assets pass only to compatible ACNC-registered charities able to steward the technology under the same principles (clauses 61–62).",
        ],
      },
      {
        heading: "What it means for each audience",
        body: [
          "For the public: the patents, code, and infrastructure the foundation stewards cannot be quietly sold, licensed to insiders, or captured through the token market — and if the foundation ever ends, the assets pass to another public-benefit steward.",
          "For contributors: work contributed to VirtEngine and DSEMA lands inside a structure whose insiders are barred from privatising it — including the founder, whose salary is constitutionally capped at minimum wage and whose deferred-compensation channel is explicitly closed.",
          "For commercial partners: revenue is welcome and expressly authorised — services, licensing, infrastructure, integration — but the constitution routes every dollar back into the purposes. A partner can buy service; nobody can buy the mission.",
        ],
      },
      {
        heading: "What the lock does not do",
        clauses: ["18.4", "18A.3", "sch 1 item 20"],
        body: [
          "The lock binds private actors, not the law. Every protection yields to mandatory law, the Corporations Act, the ACNC Act, regulators, and courts. Founding Member Consent cannot be used to act for private benefit, breach duties, or cause insolvency. Entrenchment is a floor against capture — never a shield against accountability.",
        ],
      },
    ],
    related: [
      { label: "Amendments & Protected Provisions", href: "/constitution/amendments-and-protected-provisions" },
      { label: "Reserved Matters — the consent gate", href: "/constitution/reserved-matters" },
      { label: "Winding up and the charity lock", href: "/constitution/winding-up-and-the-charity-lock" },
    ],
  },
  {
    slug: "intellectual-property-stewardship",
    title: "Intellectual property stewardship",
    eyebrow: "Patents & licensing",
    summary:
      "Two patent families held for public benefit: accepted Australian patent AU2024203136B2 covering the VirtEngine system, and the patent-pending DSEMA multi-agent claims — alongside an Apache 2.0 open-source policy and constitutionally bound licensing preferences.",
    sections: [
      {
        heading: "The VirtEngine patent — AU2024203136B2",
        clauses: ["32.1.1"],
        body: [
          "Australian patent AU2024203136B2, 'Decentralized system for identification, authentication, data encryption, cloud and distributed cluster computing', has been accepted with amended claims (August 2025). The claims cover the integrated system: decentralized identity scoring from government-ID, biometric, and device signals; encrypted payload handling; a blockchain-coordinated marketplace matching tenants and providers; and distributed cluster computing under on-chain control.",
          "The constitution obliges the company to own or control this patent family — including future continuations, divisionals, and foreign equivalents — and to apply it for public benefit. Held this way, the patent works as a defensive instrument: it prevents a competitor from fencing off the invention and charging the public rent on it.",
        ],
      },
      {
        heading: "The DSEMA claims — patent pending",
        clauses: ["32.1.2"],
        body: [
          "The DSEMA claims (v1.2.1) describe a computer-implemented system for verifiably authorized autonomous state modification in multi-agent AI: DID-anchored agent identity, tamper-evident performance logging, smart-contract-triggered model adaptation, sandboxed execution with hash-verified model loading, and constitutional validation of high-stakes actions. The claims are pending; we describe them as exactly that.",
        ],
      },
      {
        heading: "Open source and the licensing test",
        clauses: ["37.1", "37.2"],
        body: [
          "The VirtEngine protocol implementation is published under Apache 2.0 in the open repository — the license's explicit patent grant means using the open code comes with a license to the patented invention as embodied in it. The directors' licensing discretion is constitutionally bound to prefer models that support safety, privacy, auditability, interoperability, and decentralisation; prevent private capture of core protocols; allow commercial services that fund the purposes; and preserve the foundation's ability to maintain the technology.",
          "Material IP decisions — transfers, exclusive licences, abandonment, litigation settlement — are Reserved Matters requiring Founding Member Consent, and the assets themselves are locked by Schedule 1.",
        ],
      },
    ],
    related: [
      { label: "Asset stewardship in the constitution", href: "/constitution/asset-stewardship-and-transferred-assets" },
      { label: "VirtEngine research program", href: "/research/virtengine" },
      { label: "DSEMA research program", href: "/research/dsema" },
    ],
  },
  {
    slug: "code-of-conduct",
    title: "Code of conduct",
    eyebrow: "Clause 10",
    summary:
      "The constitution obliges the directors to adopt and maintain a Code of Conduct that gives practical effect to the purposes, public-interest duties, confidentiality, conflict management, privacy, safety, and anti-private-capture principles — binding everyone with material system access.",
    sections: [
      {
        heading: "What clause 10 requires",
        clauses: ["10.1", "10.2", "10.3", "10.4"],
        body: [
          "Clause 10.1 makes a Code of Conduct mandatory, not optional: the directors must adopt and maintain one, and its required subject matter is enumerated — practical effect to the purposes, public-interest duties, confidentiality requirements, conflict-management requirements, privacy commitments, safety commitments, and anti-private-capture principles.",
          "Its reach is unusually wide: directors, officers, employees, contractors, volunteers, members, and any person with privileged or material access to the company's systems or Transferred Assets must comply, to the extent the directors determine and the law permits. The directors may require signed confidentiality, conflict-of-interest, access, or Code of Conduct undertakings before granting privileged access to systems, digital assets, or IP — and Schedule 1 item 18 entrenches this compliance obligation as a Protected Provision.",
        ],
      },
      {
        heading: "Why access is the trigger",
        body: [
          "In a technology foundation, the real keys are literal: repository write access, signing keys, wallet custody, deployment credentials, model weights. Clause 10 keys its obligations to material system access rather than job title — the person who can push code or move digital assets carries conduct obligations regardless of what their contract calls them. Clause 53.3's record-keeping duty (keys, custody arrangements, repositories, conflicts) is the same philosophy applied to paperwork.",
        ],
      },
      {
        heading: "Status and enforcement",
        clauses: ["50.1", "50.4"],
        body: [
          "The Code is a policy of the company and does not dilute any statutory or general-law duty. For Ordinary Members, breach can lead to warning, suspension, or expulsion — with fourteen days' written notice, disclosure of the allegations, and a reasonable opportunity to respond; the directors cannot fine a member. As board-adopted conduct documents are finalised, the transparency page will link them.",
        ],
      },
    ],
    related: [
      { label: "Mission — the public-interest duty", href: "/mission" },
      { label: "Meetings, records, and disputes", href: "/constitution/meetings-records-and-disputes" },
      { label: "Transparency commitments", href: "/transparency" },
    ],
  },
  {
    slug: "membership",
    title: "Membership",
    eyebrow: "Clause 13",
    summary:
      "Membership of DETIO FOUNDATION LTD is deliberately small and consent-gated: at most two Ordinary Members alongside the Founding Member. Here is the process as the constitution actually defines it — including why most supporters should not seek membership at all.",
    sections: [
      {
        heading: "The honest headline: membership is scarce by design",
        clauses: ["11.3", "11.5"],
        body: [
          "The company may have no more than two Ordinary Members unless the Protected Provisions themselves are amended. Members hold the constitutional levers — amendments, director elections, winding up — so the constitution keeps the group small, known, and consent-gated rather than building a mass membership whose votes could be marshalled against the public-benefit lock.",
          "If you want to support the work, membership is rarely the right instrument: contribution to the open repositories, research collaboration, provider participation in the VirtEngine network, and commercial engagement all advance the purposes without touching the governance perimeter.",
        ],
      },
      {
        heading: "The actual process",
        clauses: ["13.1", "13.2", "13.3", "15.2"],
        body: [
          "Eligibility: at least 18 years old, resident of Australia, and supportive of the company's purposes. Application: in writing to the company. Decision: the directors may accept or refuse without giving reasons — and must not accept without prior written Founding Member Consent (admission of a member is also Reserved Matter 18A.2.1). Effect: membership begins when the secretary enters your name on the register.",
          "Obligations follow: comply with the constitution, support the purposes, comply with the Code of Conduct and any required undertakings, treat others with respect, and stand behind the member guarantee — capped at $444 on winding up. Membership cannot be transferred, and voting is two votes for the Founding Member, one for each Ordinary Member.",
        ],
      },
      {
        heading: "Leaving, discipline, and fairness",
        clauses: ["17.1", "50.1", "50.2", "50.3"],
        body: [
          "An Ordinary Member may resign in writing at any time, and membership ends automatically on death, ineligibility, or winding up of a corporate member. Discipline requires procedural fairness: fourteen days' written notice of allegations and proposed action, a reasonable opportunity to respond, and no power to fine. The Founding Member's membership is permanent under clause 17.2 and cannot be ended by expulsion.",
        ],
      },
    ],
    related: [
      { label: "Members and membership — full analysis", href: "/constitution/members-and-membership" },
      { label: "Contact the foundation", href: "/contact" },
      { label: "FAQ", href: "/faq" },
    ],
  },
];

export function getFoundationPage(slug: string): FoundationPage | undefined {
  return FOUNDATION_PAGES.find((p) => p.slug === slug);
}
