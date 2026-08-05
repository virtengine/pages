/**
 * Constitution explorer — plain-language topic pages derived from the signed
 * constitution of DETIO FOUNDATION LTD (draft prepared 25 June 2026, revised
 * 29 June 2026; signed by the predetermined members July 2026).
 *
 * Every clause citation refers to the actual instrument. Summaries are
 * plain-language explanations, not legal advice, and the signed constitution
 * prevails over anything written here.
 */

export interface ConstitutionSection {
  heading: string;
  /** Clause citations, e.g. "6.1.1", "18A.2", "sch 1 item 3" */
  clauses: string[];
  /** Plain-language paragraphs */
  body: string[];
}

export interface ConstitutionTopic {
  slug: string;
  title: string;
  /** Where in the instrument this topic lives, e.g. "Part 2 · clauses 6–10" */
  source: string;
  /** The plain question this topic answers */
  question: string;
  /** Index-card + meta description text */
  summary: string;
  sections: ConstitutionSection[];
  whyItMatters: string;
  related: string[];
}

export const CONSTITUTION_TOPICS: ConstitutionTopic[] = [
  {
    slug: "purpose-and-public-benefit-lock",
    title: "Purpose and the public-benefit lock",
    source: "Parts 1–2 · clauses 1–6",
    question: "What does DETIO FOUNDATION LTD exist to do — and what can it never become?",
    summary:
      "The foundation is a not-for-profit public company limited by guarantee established only for charitable, public-benefit purposes. Clause 6 defines four purpose pillars, and clause 2.3 prohibits operating for private commercial interests — before a single Protected Provision is even counted.",
    sections: [
      {
        heading: "A company built as a container for public benefit",
        clauses: ["1.1", "2.1", "2.2", "2.3"],
        body: [
          "DETIO FOUNDATION LTD is a not-for-profit public company limited by guarantee — a corporate form with no shareholders and no share capital, used in Australia for charities and public-interest institutions. The constitution states that the company is established to operate for charitable and public-benefit purposes, and that it may apply for registration as a charity with the Australian Charities and Not-for-profits Commission (ACNC).",
          "Clause 2.3 then draws the line that shapes everything else in the document: the company must not operate for private commercial interests, shareholder profit, dividends, private extraction, or private ownership of the intellectual property and digital assets held for its purposes. This is not a mission statement — it is a constitutional prohibition on the company's own type.",
        ],
      },
      {
        heading: "The four purpose pillars",
        clauses: ["6.1", "6.1.1", "6.1.2", "6.1.3", "6.1.4"],
        body: [
          "Clause 6.1 defines the company's purposes as charitable purposes for the public benefit, carried out without private commercial interests. Four pillars are enumerated: advancing education — public research, open technical education, open specifications, standards, documentation, safety materials, and implementation guidance for privacy-preserving digital infrastructure, distributed computing, and trustworthy AI; advancing social or public welfare — technology that improves public access to secure, privacy-preserving, resilient, and affordable digital infrastructure; promoting and protecting human rights — privacy, dignity, autonomy, equality of access, and protection from unlawful surveillance, coercion, discrimination, and private capture of essential digital infrastructure; and advancing the security or safety of Australia and the Australian public — cyber security, identity safety, AI safety, data protection, and infrastructure resilience.",
        ],
      },
      {
        heading: "VirtEngine and DSEMA are named in the constitution itself",
        clauses: ["6.2.1", "6.2.2", "6.2.3", "6.2.4"],
        body: [
          "Clause 6.2 lists what the company may do in carrying out its purposes — and the two flagship programs are written directly into it. Clause 6.2.1 mandates developing, stewarding, publishing, operating, maintaining, and improving VirtEngine as a public-benefit protocol for identification, authentication, privacy preservation, data encryption, cloud services, distributed computing, high-performance computing, and digital coordination. Clause 6.2.2 does the same for DSEMA as a public-benefit architecture for safe, accountable, auditable, and self-improving multi-agent systems.",
          "Clause 6.2.4 adds a structural obligation rarely seen in company constitutions: the company must design and steward protocol governance safeguards so that transferable economic value, if any, cannot buy control over the company's purposes, Protected Provisions, or constitutional governance.",
        ],
      },
      {
        heading: "An interpretive lock for uncertain cases",
        clauses: ["4.1", "4.3", "4.4"],
        body: [
          "The replaceable rules in the Corporations Act do not apply — the constitution is the complete rulebook. If the company is a registered charity, the constitution must be read so that the company remains a charity with only charitable purposes. And clause 4.4 adds a tiebreaker: any legally uncertain provision must be read in the way that most closely preserves the public-benefit purpose, not-for-profit character, permanent stewardship of the Transferred Assets, and lawful operation of the company. Ambiguity resolves toward the public, not away from it.",
        ],
      },
    ],
    whyItMatters:
      "Most technology-company pledges live in blog posts and can be reversed by the next board. Here, the public-benefit commitment is the company's constitutional type: the purposes clause, the prohibition on private operation, and the interpretive tiebreaker all point the same way, and later clauses (18, 18A, Schedule 1) make that direction structurally hard to reverse.",
    related: ["not-for-profit-and-remuneration-rules", "amendments-and-protected-provisions", "asset-stewardship-and-transferred-assets"],
  },
  {
    slug: "not-for-profit-and-remuneration-rules",
    title: "Not-for-profit and remuneration rules",
    source: "Parts 2 & 7 · clauses 8–9, 41–42",
    question: "Where is the money allowed to go — and where is it forbidden to go?",
    summary:
      "Income and assets must be applied solely to the charitable purposes. Distributions to members, directors, founders, or related parties are prohibited, commercial activity is permitted only as a funding mechanism, and the Founding Member's own salary is constitutionally capped at the minimum lawful wage.",
    sections: [
      {
        heading: "No dividends, no private extraction",
        clauses: ["8.1", "8.2"],
        body: [
          "Clause 8.1 requires the company's income and assets to be applied solely to carry out the clause 6 purposes. Clause 8.2 prohibits distributing income or assets, directly or indirectly, to members, former members, directors, former directors, employees, volunteers, founders, related parties, or private persons.",
          "The only exceptions are the ordinary mechanics of running an organization honestly: paying fair (or better-than-market for the company) rates for goods and services, reimbursing properly incurred expenses, paying reasonable and documented remuneration for services actually provided, and distributing to another charity or public-benefit entity in furtherance of the purposes.",
        ],
      },
      {
        heading: "Commercial activity is a funding mechanism, not a purpose",
        clauses: ["9.1", "9.2", "9.3", "9.4", "9.5"],
        body: [
          "The constitution does not pretend the foundation will run on goodwill. Clause 9.2 expressly permits the company to conduct commercial activities, charge fees, sell services, licence technology, and compete with for-profit companies — but only as a means of funding, scaling, securing, and sustaining the public-benefit activities and purposes. Clause 9.3 permits accumulating and reinvesting earnings into growth, resilience, engineering, compliance, infrastructure, security, research, and operational capability where the directors reasonably consider that directly advances the charitable purposes.",
          "Clauses 9.4 and 9.5 point the other direction too: the directors may run charitable, subsidised, or free-access programs — subsidised technology, subsidised services, education, public-interest infrastructure — whenever they consider them prudent, lawful, and consistent with the purposes.",
        ],
      },
      {
        heading: "The founder's salary is capped at minimum wage",
        clauses: ["41.1", "41.2", "41.3", "41.4", "41.5"],
        body: [
          "Part 7 contains one of the constitution's most unusual provisions. The Permanent Director or Founding Member may be employed by the company for real work beyond acting as a director — but clause 41.2 caps that salary at the lowest lawful minimum wage or minimum lawful employment entitlement applicable to the work performed. Clause 41.3 prohibits sitting fees for acting as a director.",
          "Clause 41.5 closes the deferred-compensation loophole: the constitution creates no entitlement to accrued salary debt, deferred founder compensation, interest, or back-pay — no private extraction mechanism can be smuggled in as an IOU. Any employment entitlement must be handled outside the constitution under ordinary employment law, solvency requirements, and conflict-of-interest procedures. The cap itself is a Protected Provision (Schedule 1, item 16).",
        ],
      },
      {
        heading: "Everyone else: fair, documented, approved",
        clauses: ["42.1", "42.2", "42.3", "42.4"],
        body: [
          "For employees, officers, contractors, and other directors, clause 42 permits reasonable remuneration and employment benefits for services actually provided — subject to five cumulative tests: fair and reasonable in the circumstances, properly documented, approved under the conflict-of-interest procedures, consistent with the not-for-profit and charitable purposes, and lawful. Clause 42.3 makes explicit that no particular person has a constitutional entitlement to any benefit.",
        ],
      },
    ],
    whyItMatters:
      "The classic failure mode of mission-driven organizations is quiet monetisation of insiders: consulting fees, deferred founder equity, above-market salaries. This constitution addresses each channel by name — and puts the founder under the strictest cap of anyone in the organization.",
    related: ["purpose-and-public-benefit-lock", "directors-and-permanent-director", "winding-up-and-the-charity-lock"],
  },
  {
    slug: "members-and-membership",
    title: "Members and membership",
    source: "Part 3 · clauses 11–17",
    question: "Who are the members, how do you become one, and why is the founder's membership permanent?",
    summary:
      "Two member classes — the Founding Member (two votes) and at most two Ordinary Members (one vote each). Admission requires written application, director acceptance, and prior Founding Member consent. Membership cannot be transferred, and the Founding Member's membership is permanent.",
    sections: [
      {
        heading: "A deliberately small membership",
        clauses: ["11.1", "11.2", "11.3", "11.5"],
        body: [
          "The company has exactly two classes of members: the Founding Member — Jonathan Philipos, named in the constitution itself — and Ordinary Members. Clause 11.3 caps Ordinary Members at two unless the Protected Provisions are amended under clause 18. Clause 11.5 requires Founding Member Consent before anyone is admitted as an Ordinary Member.",
          "This is the opposite of a mass-membership association, and deliberately so: members hold the constitutional levers (amendments, director elections, winding up), so the constitution keeps that group small, known, and consent-gated rather than exposing the public-benefit lock to a membership-drive takeover.",
        ],
      },
      {
        heading: "Becoming a member",
        clauses: ["13.1", "13.2", "13.3", "12.1"],
        body: [
          "A person at least 18 years old and resident in Australia who supports the purposes may apply in writing. The directors may accept or refuse without giving reasons, but must not accept an application without prior Founding Member Consent. Membership begins when the secretary enters the person on the register of members, which records name, address for notices, membership class, and dates.",
        ],
      },
      {
        heading: "Votes and thresholds",
        clauses: ["14.1", "14.3", "14.5", "16.1"],
        body: [
          "At a general meeting the Founding Member has two votes and each Ordinary Member has one. An ordinary resolution needs more votes in favour than against; a tie fails. Special resolutions follow the Corporations Act (at least 75% of votes cast). Membership and membership rights cannot be transferred to another person — there is no market in control of this company.",
        ],
      },
      {
        heading: "The Founding Member's membership is permanent — with honest limits",
        clauses: ["17.2", "17.3", "17.4", "17.5", "17.6"],
        body: [
          "Clause 17.2 makes the Founding Member's membership and voting class permanent: it must not be relinquished, transferred, terminated, converted, suspended, or removed except on legal death or where mandatory law requires a different result. Incapacity alone does not terminate membership.",
          "The constitution then does something careful: it plans for incapacity rather than ignoring it. If the Founding Member cannot act, their rights may be exercised by an attorney under an enduring power of attorney or a court-appointed guardian or administrator, to the extent the law and the appointing instrument permit. If no lawful representative exists, the rights are suspended only as far as necessary for legal compliance and operational continuity — and the directors may make temporary arrangements, but must not treat the membership as ended.",
        ],
      },
    ],
    whyItMatters:
      "In a company limited by guarantee, whoever controls membership eventually controls everything — including the ability to amend the constitution. Keeping membership small and consent-gated is the mechanism that makes every other protection in this document durable.",
    related: ["directors-and-permanent-director", "reserved-matters", "amendments-and-protected-provisions"],
  },
  {
    slug: "amendments-and-protected-provisions",
    title: "Amendments and Protected Provisions",
    source: "Clause 18 & Schedule 1",
    question: "Can the rules be changed — and which rules are locked?",
    summary:
      "The constitution can be amended by special resolution, but amendments that would defeat the not-for-profit character are void, and the twenty Protected Provisions in Schedule 1 are entrenched under sections 136(3)–(4) of the Corporations Act: they require both a special resolution and the Founding Member's written consent.",
    sections: [
      {
        heading: "Amendment with a constitutional immune system",
        clauses: ["18.1", "18.2"],
        body: [
          "Members may amend the constitution by special resolution — but clause 18.2 declares an amendment has no effect if it would cause the company to stop being not-for-profit, stop having charitable or public-benefit purposes, allow private distribution of income, assets, intellectual property, digital assets, or tokens, allow Transferred Assets to be used for private commercial interests, weaken a Protected Provision without satisfying clause 18.3, or breach mandatory law.",
          "This is a self-defending amendment clause: even a validly passed special resolution is void to the extent it attacks the company's charitable core.",
        ],
      },
      {
        heading: "Entrenchment under the Corporations Act",
        clauses: ["18.3", "18.4", "18.5"],
        body: [
          "Schedule 1 provisions are entrenched using section 136(3) and 136(4) of the Corporations Act 2001 (Cth) — the statutory mechanism that lets a company constitution impose further requirements on its own amendment. A Protected Provision can be amended, repealed, or replaced only if the Act's special-resolution requirements are met, the Founding Member (or a lawful representative, where mandatory law permits) gives written consent, and the amendment does not end the company's not-for-profit or public-benefit character.",
          "Clause 18.4 keeps the entrenchment honest: nothing prevents an amendment required by mandatory law, a court order, a regulator, or the ACNC as a condition of charity registration. The lock binds private actors, not the law.",
        ],
      },
      {
        heading: "What the twenty Protected Provisions actually cover",
        clauses: ["sch 1"],
        body: [
          "Schedule 1 lists twenty Protected Provisions. In plain terms they lock: the charitable-only, no-private-interest existence of the company (items 1–2); public-benefit ownership of VirtEngine, DSEMA, all present and future patent rights, and all Transferred Assets (item 3); the transfer obligations over Founder IP and DET-IO Pty Ltd assets (items 4–5); the structural separation of transferable economic value from governance — capital cannot buy control — and the explicit statement that nothing obliges the company to operate any token (items 6–7); the identity, votes, permanent seat, appointment right, and consent rights of the Founding Member (items 8–12); quorum protection (item 13); incapacity protection (item 14); the amendment procedure itself (item 15); the minimum-wage founder salary cap and remuneration integrity rules (items 16–17); code-of-conduct obligations for everyone with material system access (item 18); the charity-only destination of surplus assets on winding up (item 19); and the supremacy of mandatory law over all of it (item 20).",
        ],
      },
    ],
    whyItMatters:
      "Entrenchment is the difference between a promise and a structure. Any future board or membership that wanted to privatise the foundation would need to clear a special resolution, obtain written founder consent, survive the void-amendment rule, and satisfy the ACNC — four independent locks, each sufficient to stop the attempt.",
    related: ["reserved-matters", "purpose-and-public-benefit-lock", "winding-up-and-the-charity-lock"],
  },
  {
    slug: "reserved-matters",
    title: "Reserved Matters — the consent gate",
    source: "Clause 18A",
    question: "Which decisions can nobody make without the Founding Member's written consent?",
    summary:
      "Clause 18A enumerates eight categories of high-stakes decisions — from admitting members to disposing of Transferred Assets to restructuring subsidiaries — that require prior written Founding Member Consent, with honest carve-outs for mandatory law, courts, regulators, and the ACNC.",
    sections: [
      {
        heading: "How the gate works",
        clauses: ["18A.1", "18A.3", "18A.4"],
        body: [
          "The company, members, directors, officers, employees, contractors, volunteers, subsidiaries, and delegates must not approve, implement, or cause any Reserved Matter unless Founding Member Consent has first been obtained — except where mandatory law, a court, a regulator, or the ACNC requires otherwise.",
          "Consent may be withheld at the Founding Member's discretion — but clause 18A.3 states the limits plainly: nothing in the clause permits acting for private benefit, breaching director duties, causing insolvency, overriding mandatory law, or causing the company to stop being not-for-profit or charitable. And clause 18A.4 requires the company to give the Founding Member enough information to make an informed decision before asking.",
        ],
      },
      {
        heading: "The eight Reserved Matter categories",
        clauses: ["18A.2.1", "18A.2.2", "18A.2.3", "18A.2.4", "18A.2.5", "18A.2.6", "18A.2.7", "18A.2.8"],
        body: [
          "1 — Membership and voting structure: admitting any Ordinary Member, creating a new member class, increasing member numbers, changing voting rights or quorum rules. 2 — Board composition: appointing or filling any Temporary Director seat (outside the 60-day emergency procedure). 3 — Asset disposition: materially transferring, selling, licensing, encumbering, abandoning, open-sourcing, closing, forking, settling litigation about, or otherwise disposing of a Transferred Asset outside the ordinary course. 4 — Strategy: changing the technology-stewardship model, patent strategy, open-source strategy, token or digital-asset policy, privacy-preserving identity governance, or anti-private-capture controls. 5 — Subsidiaries: incorporating, acquiring, selling, dissolving, winding up, merging, or materially restructuring a subsidiary, including DET-IO Pty Ltd. 6 — Control transactions: any merger, reconstruction, or major asset transfer that would materially change control of the company or the Transferred Assets. 7 — Winding-up recipient: choosing where surplus assets go. 8 — The lock itself: any matter that would alter, weaken, privatise, or impair a Protected Provision, a Founding Member right, the Permanent Director seat, or the public-benefit lock.",
        ],
      },
    ],
    whyItMatters:
      "Boards change; the pressure to 'unlock value' arrives eventually at every organization holding valuable technology. Reserved Matters mean the highest-risk category of decisions cannot be taken by a transient board majority — while the mandatory-law carve-outs keep the veto subordinate to courts and regulators, not above them.",
    related: ["amendments-and-protected-provisions", "members-and-membership", "asset-stewardship-and-transferred-assets"],
  },
  {
    slug: "directors-and-permanent-director",
    title: "Directors and the Permanent Director",
    source: "Part 4 · clauses 19–30",
    question: "Who runs the company day to day, and what keeps the board honest?",
    summary:
      "A board of at least three directors — one Permanent Director seat attached to the Founding Member, plus Temporary Directors on two-year terms capped at ten consecutive years — governed by statutory duties, a conflicts regime, and an explicit duty to protect the Transferred Assets from private capture.",
    sections: [
      {
        heading: "Board structure",
        clauses: ["19.1", "19.2", "19.3", "22.1", "22.2"],
        body: [
          "The company must have at least three directors, with at least two ordinarily resident in Australia. The board comprises the Permanent Director and at least two Temporary Directors. Temporary Directors serve two-year terms, may be re-elected, and are capped at ten consecutive years unless the members resolve otherwise — a built-in renewal mechanism for every seat except one.",
        ],
      },
      {
        heading: "The Permanent Director seat — and its legal limits",
        clauses: ["21.1", "21.2", "21.4", "21.7", "21.8"],
        body: [
          "The first Permanent Director is the Founding Member, Jonathan Philipos, and the seat is attached to the Founding Member while eligible. The constitution is explicit about what the seat is not: it does not limit the mandatory director-removal provisions of the Corporations Act (sections 203D and 203E), disqualification law, ACNC Governance Standards, or any court or regulator order.",
          "If mandatory law prevents the Permanent Director from acting — including during incapacity — the seat is treated as unavailable to the extent the law requires, and the other directors may appoint an acting director or caretaker for the minimum period and scope necessary. A representative exercising the Founding Member's membership rights may never exercise director duties or board votes on their behalf: member rights are representable, director duties are personal.",
        ],
      },
      {
        heading: "Appointments and the emergency procedure",
        clauses: ["23.2", "23.3", "23.4", "23.6", "24.1"],
        body: [
          "The Founding Member may appoint (or, where the Act requires, nominate) one Founder-Appointed Temporary Director by written notice. All other Temporary Director elections and casual-vacancy appointments require prior Founding Member Consent. If the board falls below the statutory minimum and consent cannot be obtained in time, the continuing directors may make an emergency appointment — which self-destructs at the earliest of 60 days, the next general meeting, or the date consent is refused.",
          "If there are fewer than three directors, clause 24 restricts the continuing directors to emergencies, asset preservation, restoring the minimum, or calling a general meeting — an understaffed board cannot govern expansively.",
        ],
      },
      {
        heading: "Duties, conflicts, and the chair",
        clauses: ["25.3", "26.3", "29.1", "30.3", "30.4", "30.5"],
        body: [
          "Directors carry the standard statutory and general-law duties — care and diligence, good faith in the company's best interests and purposes, no misuse of position or information, disclosure of conflicts, responsible financial management, no insolvent trading — plus one purpose-built duty: to protect the Transferred Assets from private capture or misuse (clause 29.1.7).",
          "The conflicts regime has teeth where this constitution most needs it: clauses concerning the Founding Member's salary, employment benefits, IP transfer, and DET-IO Pty Ltd arrangements are related-party matters that must be reviewed by independent legal and accounting advisers before implementation, and approved by non-conflicted directors. The Permanent Director chairs while in office but has no casting vote; tied resolutions fail — at both member and board level.",
        ],
      },
    ],
    whyItMatters:
      "The design pairs a permanent founder seat (continuity of purpose) with mechanisms that stop that seat from becoming a private throne: mandatory-law supremacy, related-party review by independent advisers, non-conflicted approval, no casting vote, and a board majority the founder does not appoint unilaterally.",
    related: ["members-and-membership", "reserved-matters", "not-for-profit-and-remuneration-rules"],
  },
  {
    slug: "asset-stewardship-and-transferred-assets",
    title: "Asset stewardship and the Transferred Assets",
    source: "Part 5 · clauses 31–37",
    question: "How do the patents, code, and digital assets end up locked to the public — and stay there?",
    summary:
      "Part 5 obliges the company to own or control VirtEngine, DSEMA, and related assets for public benefit; obliges the Founding Member to transfer Founder IP (with a trust-and-licence fallback); records the intended DET-IO Pty Ltd transfer honestly; and sets binding preferences for open, capture-resistant licensing.",
    sections: [
      {
        heading: "The ownership principle",
        clauses: ["31.1", "31.2", "32.1"],
        body: [
          "The company is intended to own, steward, protect, develop, and apply the Transferred Assets for the benefit of humanity and the general public. The Transferred Assets must not be held, licensed, sold, assigned, encumbered, forked, privatised, or controlled for private commercial interests except where the directors decide a transaction is fair, reasonable, lawful, and advances the purposes.",
          "Clause 32 is exhaustive about scope: VirtEngine including all present and future patent applications, grants, continuations, divisionals, foreign equivalents, and improvements; DSEMA including its patent-pending rights; and all related digital assets, repositories, documents, keys, accounts, trademarks, know-how, and implementation materials.",
        ],
      },
      {
        heading: "The founder's transfer obligations — with a trust fallback",
        clauses: ["33.1", "33.3", "33.4", "33.5"],
        body: [
          "The Founding Member must execute all assignment deeds, licence deeds, moral-rights consents, account-transfer and custody documents reasonably required to vest Founder IP and digital assets in the company — including a present agreement to assign future IP as it arises.",
          "Clause 33.4 covers the gap between promise and paperwork: if any asset cannot be assigned immediately, the Founding Member must hold it on trust for the company to the maximum extent permitted by law, and must grant the company an irrevocable, worldwide, royalty-free, transferable licence until assignment completes. There is no window in which the founder can lawfully treat pending-transfer IP as private property.",
        ],
      },
      {
        heading: "The DET-IO Pty Ltd transfer — stated honestly",
        clauses: ["34.1", "34.3", "35.1", "35.3", "36.3"],
        body: [
          "DET-IO Pty Ltd is the pre-existing private company from the DET.io era. The constitution requires the directors to use reasonable endeavours to procure separate legal instruments transferring, licensing, or novating its IP and digital assets to the foundation — and clause 35.1 records the intended agreement that all current owners (Jonathan Philipos, 85%; Amir Saeed and Lilian Mezher, 15%) relinquish ownership claims in favour of the foundation.",
          "Unusually for a founding document, the constitution refuses to overstate its own power: clause 34.3 acknowledges that the constitution does not by itself bind DET-IO Pty Ltd or any third party — separate signed deeds are required, and until then the constitution records the intended governance position only. Whatever happens, clause 36.3 prohibits any restructure of the subsidiary from transferring assets away for private benefit.",
        ],
      },
      {
        heading: "Licensing preferences that resist capture",
        clauses: ["37.1", "37.2"],
        body: [
          "The directors may license, publish, open-source, commercialise, enforce, or restrict access to IP where doing so advances the purposes — but clause 37.2 binds their discretion to four preferences: models that support safety, privacy, security, auditability, interoperability, public trust, and decentralisation; that prevent private capture of core public-benefit protocols; that allow commercial services to fund the purposes; and that preserve the company's ability to maintain and improve VirtEngine and DSEMA. In practice, VirtEngine is published under Apache 2.0.",
        ],
      },
    ],
    whyItMatters:
      "Two patented technology programs are worth attempting to capture. Part 5 makes the capture surface as small as law allows: the assets must flow in (with a trust fallback closing timing gaps), they cannot flow out for private benefit, and even the honest limitation about third parties is written down rather than papered over.",
    related: ["purpose-and-public-benefit-lock", "reserved-matters", "protocol-governance-privacy-and-safety"],
  },
  {
    slug: "protocol-governance-privacy-and-safety",
    title: "Protocol governance, privacy, and safety",
    source: "Part 6 · clauses 38–40",
    question: "What rules bind the foundation when it operates tokens, identity systems, and AI?",
    summary:
      "Part 6 translates the public-benefit lock into protocol engineering: economic value must be structurally separated from governance so capital cannot buy control; privacy-by-design is mandatory; and safety, AML/CTF, and incident-response policies must exist before production systems ship.",
    sections: [
      {
        heading: "Capital cannot buy control — as an engineering requirement",
        clauses: ["38.1", "38.4", "38.5"],
        body: [
          "Where the company stewards any protocol token, digital asset system, or digital governance system, it must ensure transferable economic value is structurally separated from governance over the company's purposes, Protected Provisions, and constitutional governance — so that no person, holding, investor, partner, founder, director, member, subsidiary, or amount of capital can acquire control over them.",
          "Clause 38.4 applies the same rule to insiders: the company must not create any founder, director, member, investor, employee, or partner right that confers private control over the purposes. The anti-capture rule binds the people who wrote it.",
        ],
      },
      {
        heading: "No token obligation — and lawful token mechanics if there is one",
        clauses: ["38.2", "38.3"],
        body: [
          "Clause 38.2 states that no provision of the constitution obliges the company to issue, sell, distribute, airdrop, allocate, custody, list, or operate any token or digital asset — mirrored as Protected Provision item 7. If the company does operate token systems, clause 38.3 requires the mechanics — identity, distribution, custody, liveness, uniqueness, sanctions, AML/CTF, financial services, consumer law, privacy, security — to be set by board-approved policies that comply with all applicable law.",
        ],
      },
      {
        heading: "Privacy by design, in the constitution",
        clauses: ["39.1", "39.2"],
        body: [
          "The company must apply privacy-by-design principles to identification, authentication, safety, anti-fraud, and accountability systems so far as reasonably possible and lawful — and must prefer architectures that minimise personal data collection, minimise centralised data custody, use encryption and selective disclosure where feasible, and allow independent audit where safe and lawful. This is the constitutional root of the VEID identity research program.",
        ],
      },
      {
        heading: "Safety gates before production",
        clauses: ["40.1", "40.2"],
        body: [
          "The company must not knowingly develop, deploy, license, or maintain technology for unlawful mass harm, unlawful surveillance, coercion, unlawful discrimination, or private capture. And before deploying production systems that materially affect identity, digital assets, health, safety, public infrastructure, or significant economic rights, the directors must establish safety, security, privacy, financial-services, AML/CTF, sanctions, consumer-law, and incident-response policies. Deployment is gated on governance, not the other way around.",
        ],
      },
    ],
    whyItMatters:
      "Token-governed protocols are routinely captured by whoever accumulates the most tokens. Part 6 makes plutocratic capture of this foundation a constitutional impossibility rather than a parameter choice — and it obliges the privacy and safety architecture that the VirtEngine and DSEMA research programs implement in code.",
    related: ["asset-stewardship-and-transferred-assets", "purpose-and-public-benefit-lock", "amendments-and-protected-provisions"],
  },
  {
    slug: "meetings-records-and-disputes",
    title: "Meetings, records, and disputes",
    source: "Parts 8–11 · clauses 43–57",
    question: "How are decisions actually made, recorded, and challenged?",
    summary:
      "Annual accountability to members, 21 days' notice of general meetings, a quorum of more than 50% of total votes, hybrid and virtual meetings, a mediation-first dispute pathway, procedural fairness in member discipline, and a seven-year record-keeping obligation that covers keys and custody arrangements.",
    sections: [
      {
        heading: "General meetings and quorum",
        clauses: ["43.1", "44.1", "45.1", "45.2", "46.1"],
        body: [
          "The company must take reasonable steps to be accountable to members, including an annual general meeting or an annual report on activities and finances. General meetings require at least 21 days' written notice including the wording of any special resolution. The quorum is members holding more than 50 percent of total votes able to be cast — and a meeting considering a Protected Matter must include the Founding Member or their lawful representative, unless mandatory law requires otherwise. Meetings may be hybrid or fully virtual if the technology gives participants a reasonable opportunity to participate.",
        ],
      },
      {
        heading: "Directors' meetings and written resolutions",
        clauses: ["48.1", "48.2", "48.3", "48.4"],
        body: [
          "Any director may call a board meeting on reasonable notice; quorum is two. For related-party matters involving the Founding Member, DET-IO Pty Ltd, a member, or their associates, the quorum must include at least one non-conflicted director. Directors may pass resolutions in writing if all directors entitled to vote agree.",
        ],
      },
      {
        heading: "Disputes: mediation before escalation",
        clauses: ["49.2", "49.3", "49.4", "50.1", "50.2", "50.3", "50.4"],
        body: [
          "Disputes under the constitution go through a staged pathway: fourteen days of good-faith direct resolution, then mediation, with the mediator appointed by the president of the relevant state law society if the parties cannot agree. Discipline of Ordinary Members requires fourteen days' written notice of the allegations, the proposed action, and the meeting, plus a reasonable opportunity to respond. The directors cannot fine a member, and the Founding Member cannot be expelled except as clause 17 permits.",
        ],
      },
      {
        heading: "Records that match the mission",
        clauses: ["52.1", "53.1", "53.3", "53.4", "54.1"],
        body: [
          "Beyond ordinary minutes and financial records, clause 53.3 requires records of operations, Transferred Assets, IP, digital assets, assignments, licences, keys, custody arrangements, repositories, conflicts, and related-party transactions — the full audit trail of a technology steward, kept at least seven years. Members may inspect the register of members as permitted by law, and the directors may grant broader access, including redacted access where appropriate.",
        ],
      },
    ],
    whyItMatters:
      "Governance that cannot be observed cannot be trusted. The meeting, notice, quorum, and record-keeping machinery is what turns the constitution's grand locks into checkable facts — including the unusual obligation to keep records of cryptographic keys and custody arrangements.",
    related: ["members-and-membership", "directors-and-permanent-director", "winding-up-and-the-charity-lock"],
  },
  {
    slug: "winding-up-and-the-charity-lock",
    title: "Winding up and the charity lock",
    source: "Parts 12–13 · clauses 58–63",
    question: "What happens to everything if the foundation ever ends?",
    summary:
      "Even in death the lock holds: surplus assets cannot flow to members and must pass to an ACNC-registered charity with compatible purposes, capable of stewarding VirtEngine and DSEMA under the same public-benefit, privacy-preserving, anti-capture principles. Each member's liability is capped at $444.",
    sections: [
      {
        heading: "Winding up is possible — privatising is not",
        clauses: ["60.1", "61.1"],
        body: [
          "Members may wind the company up voluntarily by special resolution, in compliance with the Corporations Act, the ACNC Act, and any court, regulator, or liquidator requirement. But clause 61.1 removes the incentive that corrupts most endgames: surplus assets must not be distributed to members or former members unless the recipient is itself a charity satisfying clause 62.",
        ],
      },
      {
        heading: "Where the assets must go",
        clauses: ["62.1", "62.2", "62.3"],
        body: [
          "Surplus assets must be distributed to one or more ACNC-registered charities (or another charitable entity accepted by the ACNC) that satisfy three tests: purposes similar to, inclusive of, or compatible with the company's; a prohibition on member distributions at least as strict as the company's own; and legal capacity to steward the Transferred Assets for charitable public benefit.",
          "Clause 62.2 goes further for the technology: the recipient of VirtEngine, DSEMA, and related Transferred Assets should, where reasonably possible and lawful, be capable of maintaining the public-benefit, privacy-preserving, and anti-private-capture principles of this constitution. The recipient is chosen by special resolution (a Reserved Matter requiring Founding Member Consent); failing that, by the directors; failing that, by application to the Supreme Court for directions.",
        ],
      },
      {
        heading: "The guarantee, the indemnity, and the insurance",
        clauses: ["63.1", "63.2", "58.1", "59.1", "59.2"],
        body: [
          "As a company limited by guarantee, each member's total liability on winding up is capped at $444. The company indemnifies current and former officers against liabilities incurred in that capacity — except liabilities arising from conduct not in good faith — and may maintain directors-and-officers, cyber, professional, public-liability, and other insurance the directors consider appropriate and lawful.",
        ],
      },
    ],
    whyItMatters:
      "The most common way locked assets escape is through the exit: wind up the entity, distribute the remains. Clause 62 closes that door — the technology can only ever pass to another public-benefit steward, chosen under the same consent gate that protects it in life. Item 19 of Schedule 1 entrenches this.",
    related: ["amendments-and-protected-provisions", "asset-stewardship-and-transferred-assets", "not-for-profit-and-remuneration-rules"],
  },
];

export function getConstitutionTopic(slug: string): ConstitutionTopic | undefined {
  return CONSTITUTION_TOPICS.find((t) => t.slug === slug);
}
