/**
 * Guides — long-form explainers and how-tos.
 *
 * Editorial rules (see DESIGN.md §8): evergreen, plain English first, no
 * invented statistics, market-size figures, dates, case studies or personas.
 * Attribution is "Identity.org.au editorial". Each guide maps to the search
 * queries listed in SEO-PLAN.md; one primary query per guide.
 *
 * Paragraphs and list items may contain inline HTML links (author-controlled),
 * rendered with set:html by /guides/[slug].astro. The `faq` block renders as
 * visible <details> because FAQPage JSON-LD is emitted from it.
 */

export type GuideTopic = "Staying safe" | "Verification methods" | "The Australian landscape";

export interface GuideTable {
  caption: string;
  head: string[];
  rows: string[][];
}

export interface GuideSection {
  heading?: string;
  /** Paragraphs may contain inline <a href>, <strong> and <em> HTML. */
  paragraphs?: string[];
  list?: string[];
  table?: GuideTable;
  /** Rendered after the list or table — typically cross-links back into the site. */
  after?: string[];
  callout?: { tone: "info" | "warning" | "success"; text: string };
}

export interface GuideFaq {
  question: string;
  answer: string;
}

export interface GuideEntry {
  slug: string;
  title: string;
  summary: string;
  topic: GuideTopic;
  updated: string;
  sections: GuideSection[];
  faq: GuideFaq[];
  /** Slugs within this file for the related rail. */
  related: string[];
}

export const GUIDES: GuideEntry[] = [
  {
    slug: "how-to-protect-your-identity-for-free",
    title: "How to protect your identity for free",
    summary:
      "You do not need to spend money to protect your identity. A practical, free checklist: device locks, passkeys, breach alerts, scam resistance, and sharing proofs instead of documents.",
    topic: "Staying safe",
    updated: "2026-09-25",
    sections: [
      {
        paragraphs: [
          "Most identity protection costs nothing. The tools that matter most — device encryption, passkeys, unique passwords, breach alerts — are built into the phones, browsers and accounts you already have. What you pay for instead is convenience, and much of that convenience can be skipped entirely.",
          "This guide is the free list, in the order that does the most good. Nothing here asks you to buy anything, and nothing asks you to install anything beyond what your own devices already provide.",
        ],
      },
      {
        heading: "Lock the device in your hand",
        paragraphs: [
          "Your phone holds your accounts, your messages and your recovery codes. It is the highest-value target in your digital life, and a five-digit habit protects most of it:",
        ],
        list: [
          "Set a real screen lock — a long passcode or biometrics, never nothing. Modern phones encrypt their storage as soon as a lock exists, so the lock is also what makes a lost phone unreadable to whoever finds it.",
          "Keep the operating system updating. Security patches arrive this way, and skipping them leaves known holes open for anyone who looks.",
          "Turn on the built-in location and remote-wipe features. They are free, preinstalled, and the difference between a lost phone and a lost identity.",
          "Never leave your phone unlocked in shared spaces, and treat “borrow my phone” requests with the same care you would give your wallet.",
        ],
        after: [
          "The full version of this checklist, with the reasoning behind each item, is the <a href=\"/help/device-security-checklist\">device security checklist</a> — and if a phone is already lost, start at <a href=\"/get-started/lost-or-new-device\">lost or new device</a>.",
        ],
      },
      {
        heading: "Make passwords impossible to reuse",
        paragraphs: [
          "Password reuse is the mechanism behind most account takeovers: one breached service hands an attacker the keys to everything else. The fix is free and boring, which is why it works.",
        ],
        list: [
          "Use the password manager built into your browser or phone — or any reputable free one — to generate a long, unique password for every account. You remember one phrase; the machine remembers the rest.",
          "Protect your primary email account above everything. It is the recovery path for every other account, so it gets the strongest unique password and free multi-factor authentication turned on.",
          "Adopt passkeys wherever they are offered. A passkey cannot be phished, reused or guessed, because it never leaves your device in a form a server can lose.",
          "Treat “security questions” (first school, first car) as passwords in disguise — answers that are guessable are not secret, so make them long strings only you would type.",
        ],
      },
      {
        heading: "Stop documents from circulating",
        paragraphs: [
          "Every copy of your identity document is inventory for someone else's breach. Photos of licences and passports get emailed to strangers, stored in inboxes, and forgotten in systems you have never heard of — until you have. The free defence is subtraction: share less.",
        ],
        list: [
          "Ask what is actually needed. Often the fact — “over 18: yes”, “name matches” — satisfies the request without the document ever moving.",
          "Resist photographing documents for casual verification. If a service accepts a photo of your licence, that photo now lives in their storage; the strength of their check is not your problem, but the retention is.",
          "Never send identity documents to anyone who contacted you first. Legitimate verifiers ask inside a flow you started, not over a message you did not expect — see <a href=\"/help/recognising-scams-and-phishing\">recognising scams and phishing</a>.",
          "Redact what you do not need to show: a document number rarely needs to accompany a proof of age.",
        ],
        after: [
          "A stronger version of this habit exists: prove the threshold instead of showing the document — a <a href=\"/insights/zero-knowledge-proofs-explained\">zero-knowledge proof</a> answers the yes/no question and reveals nothing else. The wallet is free and open source, and the <a href=\"/help/proving-your-age-without-your-documents\">age proof walkthrough</a> shows what that looks like in practice.",
        ],
        callout: {
          tone: "success",
          text: "The cheapest protection is the data you never share. Every document you do not send is a copy that cannot leak, be sold, or be subpoenaed from somewhere you forgot existed.",
        },
      },
      {
        heading: "Recognise the approach before it arrives",
        paragraphs: [
          "Most identity theft begins with a conversation, not a hack — someone convincing you to hand over a code, a password or a document. The patterns repeat enough to memorise:",
        ],
        list: [
          "Urgency plus authority. “Your account closes today”, “we need verification immediately”. Real institutions tolerate delays; attackers cannot afford them.",
          "Any request for a one-time code or password. No legitimate service needs yours — the code is the lock, and asking for it is the tell.",
          "Unexpected contact that ends at an unexpected link. Navigate to the service yourself instead of tapping through.",
          "Too good, too fast, too friendly. Investment pitches, romance, job offers and parcel fees all converge on the same ask: verify yourself, or pay, now.",
        ],
        after: [
          "The longer version — message-by-message examples and what to do when you have already replied — is in <a href=\"/help/recognising-scams-and-phishing\">recognising scams and phishing</a>. National scam-reporting services such as Scamwatch publish free, current guidance on the schemes circulating now.",
        ],
      },
      {
        heading: "Turn on the free early-warning systems",
        paragraphs: [
          "Detection is the part people skip, because it is quiet and free:",
        ],
        list: [
          "Enable login and recovery alerts on your email and banks. The moment an unfamiliar sign-in happens, you want the message — not the discovery weeks later.",
          "Use free breach-notification features where your providers offer them, and treat every notified exposure as a prompt to change that password everywhere it was reused.",
          "Review account recovery details: make sure the phone number and alternate address on critical accounts are ones you still control.",
          "Check your financial statements for activity you did not authorise — the earliest signal of an impersonated identity is usually a small, strange transaction.",
        ],
      },
      {
        heading: "If something has already gone wrong",
        paragraphs: [
          "Recovery is the expensive part — but it is also where free, official help exists. Start by changing the credentials the attacker could hold, then work outward from your primary email. Report the incident to the relevant service and to national reporting channels; if documents were exposed, treat every service where those documents were used as needing attention.",
          "The step-by-step version, including what to do in the first hours, is <a href=\"/help/data-breach-response\">data breach response</a>. If someone is actively using your identity, the support paths in the <a href=\"/help\">help centre</a> cover what to do and who to contact.",
        ],
      },
      {
        heading: "What the free wallet adds",
        paragraphs: [
          "The Identity Wallet on this site is free and open source, with no subscription and no fee — its contribution to the free list is structural rather than incremental. Documents are presented once during verification instead of circulating forever; services receive <a href=\"/help/who-can-see-your-data\">answers, never documents</a>; and consent for each disclosure is explicit, expiring and revocable.",
          "Honest status, as always: the wallet is open-source reference infrastructure rolling out with the VirtEngine network, with no app-store listings at this stage. What the code does today is published on <a href=\"/about/open-source\">the open-source page</a> — no availability claims beyond it.",
        ],
      },
    ],
    faq: [
      {
        question: "What is the single most effective free identity protection?",
        answer:
          "A screen lock with a strong passcode plus unique passwords from a built-in password manager, with multi-factor authentication on your primary email. Together they close the three doors attackers use most: the physical phone, reused passwords, and email-based account recovery.",
      },
      {
        question: "Do I need to pay for identity protection services?",
        answer:
          "Not to get the essentials. Device security, unique passwords, passkeys, login alerts and breach notifications are free and built in. Paid services mostly bundle monitoring you can replicate with alerts and periodic checks — worth it for convenience, not required for protection.",
      },
      {
        question: "Is photographing my identity documents ever safe?",
        answer:
          "Safer when unavoidable, but the goal is to make it unnecessary. Each photo creates another copy in someone else's system. Where only a fact is needed — age, name, address — share the fact instead; a proof answers the question without the document travelling.",
      },
    ],
    related: [
      "age-verification-explained",
      "identity-verification-solutions-compared",
      "digital-identity-in-australia",
    ],
  },
  {
    slug: "age-verification-explained",
    title: "Age verification explained",
    summary:
      "Age verification confirms someone is old enough for a service. The methods and their trade-offs, why showing your birth date should not be routine, and how threshold proofs change the question.",
    topic: "Verification methods",
    updated: "2026-09-25",
    sections: [
      {
        paragraphs: [
          "<strong>Age verification</strong> is the process of confirming that a person is old enough for something — a purchase, a platform, a place, a service. Three terms orbit it and are worth fixing precisely. <strong>Age verification</strong> checks a claim against evidence. <strong>Age estimation</strong> infers age from characteristics such as a face, with uncertainty attached. <strong>Age assurance</strong> is the umbrella for both — any means of reaching confidence about age.",
          "The reason this subject has become technical is that the conventional method — show your identification, reveal your exact birth date — over-answers the question. A yes/no question deserves a yes/no answer, and the gap between the two is where privacy is lost.",
        ],
      },
      {
        heading: "The methods, compared",
        paragraphs: [
          "Five approaches cover most age checks people encounter. Each has a genuine strength and a genuine cost:",
        ],
        table: {
          caption: "Age verification methods compared by what they ask of you and their main weakness",
          head: ["Method", "What it asks of you", "Main weakness"],
          rows: [
            [
              "Document check",
              "Show or upload identity documents showing your date of birth",
              "Discloses far more than the threshold; document images are retained and can be faked",
            ],
            [
              "Authoritative check",
              "Have your details checked directly against a trusted record",
              "Depends on coverage of the record and on someone else's data being correct and current",
            ],
            [
              "Facial age estimation",
              "Look at the camera while software estimates your age band",
              "Inference, not proof — it carries uncertainty and does not establish identity",
            ],
            [
              "Account or platform signals",
              "Let an existing account assert your age",
              "Inherits whatever that platform verified; excludes people without such accounts",
            ],
            [
              "Threshold proof (zero-knowledge)",
              "Approve a proof that you are over the threshold",
              "Requires a prior verification and a wallet that supports the proof",
            ],
          ],
        },
        after: [
          "The last row is the one that fits the question being asked. A <a href=\"/insights/zero-knowledge-proofs-explained\">zero-knowledge proof</a> answers “over 18: yes” and nothing else — no date of birth, no document number, no photograph of a card.",
        ],
      },
      {
        heading: "Why “just show your ID” is the wrong default",
        paragraphs: [
          "Showing ID works, which is why it spread — but the working is done by over-disclosure. The service learns your exact birth date, your address, your document number and whatever else the card carries, and then decides what to keep. Most keep everything, because deletion takes a decision and retention takes none.",
          "That accumulated material is the <a href=\"/insights/why-centralized-identity-databases-fail\">honeypot problem</a> in miniature: an age check should not manufacture a dossier. There is also an arms-race problem — document images are cheap to fabricate now, so the check a service trusts may be weaker than it looks. The synthesis argument is set out in <a href=\"/insights/ai-generated-fraud-and-fake-ids\">AI-generated fraud and fake IDs</a>.",
        ],
        callout: {
          tone: "info",
          text: "The right question is rarely “how old are you?” — it is “are you over this threshold?”. A system that needs the number to answer yes/no has chosen to collect more than its own question requires.",
        },
      },
      {
        heading: "Proportionality: match the check to the risk",
        paragraphs: [
          "Age checks sit inside the wider principle of <strong>proportionality</strong>: the intrusiveness of a check should match the risk of the action it gates. A low-stakes age confirmation does not justify document-grade evidence; a legally sensitive transaction might. Applying this consistently is what <a href=\"/insights/verification-tiers-and-proportionality\">verification tiers and proportionality</a> argues for, and it cuts both ways — a service demanding maximal evidence for minimal risk is over-asking.",
          "Proportionality is also an inclusion principle. Every rung of assurance that the risk does not require is a hurdle for someone who lacks documents, hardware or stable circumstances. Designing age checks around thresholds instead of documents lowers that hurdle without lowering the bar.",
        ],
      },
      {
        heading: "How the wallet answers age checks",
        paragraphs: [
          "The Identity Wallet verifies you once — a <a href=\"/definitions/what-is-document-verification\">document check</a> plus a selfie under active liveness, at the <a href=\"/get-started/verification-levels\">Standard level</a> — and anchors a commitment to the result. After that, an age question is answered with a proof generated on your device from your verified date of birth, without revealing the date itself.",
          "Services receive a proof they can verify mathematically: no document, no date, no image. Your side of the experience — approving the request, seeing who asked and why — is covered in <a href=\"/help/proving-your-age-without-your-documents\">proving your age without your documents</a>, and what each credential reveals is catalogued at <a href=\"/wallet/credentials\">credentials and proofs</a>.",
        ],
      },
      {
        heading: "Honest limits",
        paragraphs: [
          "Age assurance is only ever as strong as the verification underneath it. A flawless threshold proof still rests on the enrolment that produced the verified birth date, which is why the enrolment step deserves the scrutiny. Estimation methods, meanwhile, are honest about uncertainty and should never be presented as identity checks — they say something about a face, not about a person's records.",
          "No method is universally available: someone always lacks the document, the device or the account a given approach assumes. A fair system offers a route for each, and says plainly where the gaps are rather than pretending they do not exist.",
        ],
      },
    ],
    faq: [
      {
        question: "Is age verification the same as age assurance?",
        answer:
          "Age assurance is the umbrella term covering every way of reaching confidence about age — verification against evidence, and estimation from characteristics. Age verification specifically means checking a claim against evidence, such as a document or a cryptographic proof.",
      },
      {
        question: "Do I have to reveal my birth date to prove I am over 18?",
        answer:
          "Not with a threshold proof. A zero-knowledge proof answers “over 18: yes” and reveals nothing else — the service can verify the answer mathematically while your exact birth date stays private. Traditional document checks do reveal it, which is precisely the over-collection threshold proofs remove.",
      },
      {
        question: "Do I need a passport to prove my age?",
        answer:
          "Usually no. A driver licence or other photo identity document is typically enough to verify in the first place; after that, your wallet presents a proof instead of the document. Passports are one accepted evidence route, not a requirement for every age check you will ever face.",
      },
    ],
    related: [
      "identity-verification-solutions-compared",
      "how-to-protect-your-identity-for-free",
      "digital-identity-in-australia",
    ],
  },
  {
    slug: "australian-government-digital-id-system",
    title: "What is the Australian Government Digital ID System?",
    summary:
      "The Australian Government Digital ID System (AGDIS) lets people prove who they are to participating government services. What it is, how accreditation works, and how it differs from identity.org.au.",
    topic: "The Australian landscape",
    updated: "2026-09-25",
    sections: [
      {
        paragraphs: [
          "The <strong>Australian Government Digital ID System</strong> — commonly abbreviated <strong>AGDIS</strong> — is the Australian Government's framework for proving identity online. It lets a person establish their identity once and then use it to sign in to participating government services, rather than re-proving who they are at every counter and portal.",
          "The system pairs an app on the person's device — myID, used to sign in through the system — with identity services that are accredited under rules set by the <em>Digital ID Act 2024</em>. myGov, the government's services site, is one of the services people sign into this way. The idea underneath all of it is familiar: prove identity to a standard once, reuse the result.",
        ],
      },
      {
        heading: "How the system works, in outline",
        list: [
          "<strong>Prove identity once.</strong> A person establishes their identity with an accredited provider — evidence, checks, and an account tied to their device.",
          "<strong>Sign in through the app.</strong> When a participating service asks who you are, the app on your device answers, rather than you typing credentials into each portal.",
          "<strong>Accreditation sets the floor.</strong> Providers operating in the system meet requirements covering privacy, security, governance and quality, assessed under the <em>Digital ID Act 2024</em> Accreditation Scheme.",
          "<strong>Participation is governed.</strong> Services in the framework accept the standard because the rules, technology and accountability behind it are shared.",
        ],
        paragraphs: [
          "The exact architecture and the current list of accredited services are published by the government; this page explains the shape rather than duplicating official registers.",
        ],
      },
      {
        heading: "What accreditation means — and what it does not",
        paragraphs: [
          "Accreditation is a formal status granted to entities that meet the scheme's requirements, and it is the kind of claim that should never be paraphrased loosely. An accredited provider has been assessed; a service that merely follows similar principles has not. The two should never be presented as equivalent — blur that line and the whole concept of accreditation stops meaning anything.",
          "This is why you will see careful wording on this site about what has and has not been granted. Claims of accreditation, government endorsement or partnership are made only when they are factually true; “aligns with the principles of” is as close to the line as honest description goes.",
        ],
        callout: {
          tone: "warning",
          text: "identity.org.au is not an Australian Government service. It is independently operated and separate from the Australian Government Digital ID System, myID and myGov. Accreditation has not been granted and none is claimed.",
        },
      },
      {
        heading: "Why both can exist",
        paragraphs: [
          "The government system and independent wallets solve different problems, and Australia benefits from having both. AGDIS exists so people can access <em>government</em> services without re-proving identity at every transaction — the relying party is the state, and the trust relationship is established by the accreditation scheme.",
          "An independent wallet serves the rest of the economy: proving facts to services the person chooses — a venue, a platform, an employer, a marketplace — without creating an account someone else controls or an archive someone else can lose. The architectural argument for keeping that layer independent of any single operator is <a href=\"/insights/self-sovereign-identity-vs-federated-login\">self-sovereign identity versus federated login</a>.",
          "For how the wider Australian landscape fits together — government, documents, finance and the rules that shape them — see <a href=\"/guides/digital-identity-in-australia\">digital identity in Australia</a>.",
        ],
      },
      {
        heading: "What to check in any digital ID system",
        paragraphs: [
          "Whether a system is governmental, commercial or open source, the same questions apply:",
        ],
        list: [
          "<strong>What is collected, and kept?</strong> Minimisation and retention, stated in specifics rather than adjectives.",
          "<strong>Is participation voluntary?</strong> A system people cannot decline is not a system that protects them.",
          "<strong>Can you see and revoke consent?</strong> Structured, purposed, auditable grants — see <a href=\"/insights/consent-as-infrastructure\">consent as infrastructure</a>.",
          "<strong>Is the method inspectable?</strong> Published specifications and reviewable code beat assurances. This service's own claims are checkable at <a href=\"/about/open-source\">open source</a>.",
        ],
      },
    ],
    faq: [
      {
        question: "Is identity.org.au part of the Australian Government Digital ID System?",
        answer:
          "No. identity.org.au is independently operated by DETIO FOUNDATION LTD, a not-for-profit foundation, and is separate from the Australian Government Digital ID System, myID and myGov. Nothing on this site is a government service, and no government affiliation is claimed.",
      },
      {
        question: "Is identity.org.au accredited under the Digital ID Act 2024?",
        answer:
          "The foundation is currently in the process of applying for accreditation under the Digital ID Act 2024 Accreditation Scheme. Accreditation has not been granted and none is claimed; the Digital ID Accreditation Trustmark will only be displayed if and when accreditation is granted.",
      },
      {
        question: "Is AGDIS the same as myID?",
        answer:
          "No — myID is the app people use to sign in through the system, and myGov is the services site many sign into. AGDIS is the wider system: the framework, the accreditation scheme and the accredited providers behind those sign-ins.",
      },
    ],
    related: [
      "digital-identity-in-australia",
      "identity-verification-solutions-compared",
      "how-to-protect-your-identity-for-free",
    ],
  },
  {
    slug: "digital-identity-in-australia",
    title: "Digital identity in Australia: the landscape",
    summary:
      "Who verifies identity in Australia, the rules that shape them, and the approaches now emerging — a structural guide to the market, deliberately free of invented numbers.",
    topic: "The Australian landscape",
    updated: "2026-09-25",
    sections: [
      {
        paragraphs: [
          "“Digital identity in Australia” is not one market. It is every service that must know who it is dealing with — government, banks, telcos, hospitals, landlords, marketplaces — plus the trust infrastructure that lets them share confidence instead of copies. This guide maps that landscape structurally: who checks identity, what rules bind them, and which approaches are gaining ground.",
          "One editorial note up front: this page deliberately cites no market-size figures. Numbers of that kind shift with every report, and an evergreen guide that quotes them becomes wrong quietly. Structure is stable; statistics are not.",
        ],
      },
      {
        heading: "Who checks identity, and why",
        list: [
          "<strong>Government.</strong> Access to government services runs through the <a href=\"/guides/australian-government-digital-id-system\">Australian Government Digital ID System</a> and its accredited providers, alongside state and territory systems such as digital driver licences.",
          "<strong>Financial services.</strong> Banks and other regulated providers must know their customers before opening accounts — an obligation rooted in anti-money-laundering law, and the reason identity checks are compulsory rather than optional in that sector.",
          "<strong>Telcos, utilities and insurance.</strong> Accounts that carry value or liability are gated by identity checks, with the depth set by the risk of the product.",
          "<strong>Property.</strong> Conveyancing and registration processes rely on formal verification-of-identity steps, because transferring title is the highest-stakes identity event in ordinary life.",
          "<strong>Work, study and health.</strong> Employers, universities and providers confirm qualifications and eligibility — usually document-based, occasionally assisted by checks against authoritative records.",
          "<strong>Platforms and marketplaces.</strong> Age, authenticity and fraud risk drive verification for selling, streaming, betting and social features, with thresholds set by law or by platform policy.",
        ],
      },
      {
        heading: "The rules that shape them",
        paragraphs: [
          "Three layers of rule-making govern the landscape. <strong>Privacy law</strong> — the Australian Privacy Principles — requires organisations handling personal information to collect only what they need, secure it, and destroy or de-identify it when no longer required. That single sentence is the legal echo of the minimisation argument this site makes architecturally.",
          "<strong>The Digital ID Act 2024</strong> established an accreditation scheme for digital identity providers, creating a formal standard for what “trusted” means in this country. <strong>Sectoral duties</strong> — financial-crime law, consumer law, sector-specific regulation — add obligations where the stakes are highest. Together they mean an identity provider in Australia operates under overlapping expectations rather than a single rulebook.",
        ],
        callout: {
          tone: "info",
          text: "The Australian market is not one market: it is every service that must know its customer, plus the trust infrastructure that lets them share confidence instead of copies.",
        },
      },
      {
        heading: "The document layer underneath",
        paragraphs: [
          "Behind every digital check sits physical evidence: passports, driver licences issued by states and territories, birth and citizenship certificates. There is no national identity card — that has been Australia's consistent position — so identity infrastructure is built on a patchwork of documents and services rather than one register.",
          "That patchwork explains a lot of the friction people feel. Different documents, different issuers, different acceptance rules; copies circulated because no shared result exists. It also explains the direction of travel: because no single card can carry identity everywhere, the useful layer is one that produces <em>results</em> from those documents and lets them be reused — the subject of <a href=\"/definitions/what-is-a-digital-identity-wallet\">what a digital identity wallet is</a>.",
        ],
      },
      {
        heading: "The approaches now emerging",
        paragraphs: [
          "Four shifts distinguish the current landscape from a decade of username-and-photocopy.",
          "First, <strong>verification as a result, not a copy</strong> — services increasingly want assurance they can rely on without retaining the evidence behind it, because retention is now understood as liability rather than diligence. Second, <strong>reusable verification</strong> — prove once under hard conditions, present the outcome again, instead of re-running camera sessions per service. Third, <strong>threshold proofs</strong> — answering yes/no questions with <a href=\"/insights/zero-knowledge-proofs-explained\">zero-knowledge proofs</a> so the question can be settled without the data moving. Fourth, <strong>on-device biometrics and hardware attestation</strong>, which push verification towards a place central stores cannot reach — the reasoning is in <a href=\"/insights/biometrics-on-device-vs-in-the-cloud\">biometrics on-device versus in the cloud</a>.",
          "The pressure behind all four is the same: generated document images and synthetic faces have made inspection-only checks unreliable, as <a href=\"/insights/identity-in-the-synthetic-era\">identity in the synthetic era</a> sets out.",
        ],
      },
      {
        heading: "What it means for you",
        paragraphs: [
          "For individuals, the practical rule is to ask what happens to your document after the check. If the answer is “we keep it”, that service is converting your identity into its breach inventory — a cost you pay and it does not. The free checklist in <a href=\"/guides/how-to-protect-your-identity-for-free\">how to protect your identity for free</a> covers the habits that shrink that exposure.",
          "For services, the practical rule is proportionality: ask for the lowest level of assurance that manages your risk, and prefer answers you do not have to store. Both ideas are developed in <a href=\"/guides/identity-verification-solutions-compared\">identity verification solutions compared</a>, with the verifier-side path at <a href=\"/for-services/become-a-verifier\">become a verifier</a>.",
          "For context on this site's own position: identity.org.au is an independent, open-source wallet and verification layer stewarded by a not-for-profit foundation — not a government service, not claiming accreditation, and honest about its current stage as reference infrastructure. That framing is repeated on every page deliberately.",
        ],
      },
    ],
    faq: [
      {
        question: "Is there a national digital identity card in Australia?",
        answer:
          "No. Australia does not issue a national identity card — physical or digital. Identity is established through a combination of documents such as passports and licences, government sign-in systems, and independent wallets and verification services.",
      },
      {
        question: "Is identity verification mandatory in Australia?",
        answer:
          "It depends on the service and the law behind it. Financial institutions must verify customers under anti-money-laundering law; many other checks are driven by consumer law, sector rules or platform policy. Outside those, verification is generally a condition of a service rather than a legal obligation — you can usually decline, and then decide whether the service is worth proving yourself for.",
      },
      {
        question: "How does identity.org.au fit into the Australian landscape?",
        answer:
          "As an independent option: a free, open-source digital identity wallet and verification layer, stewarded by a not-for-profit foundation rather than a government or a company seeking profit from identity data. It is separate from the Australian Government Digital ID System and claims no accreditation; the foundation is currently applying for accreditation under the Digital ID Act 2024 scheme.",
      },
    ],
    related: [
      "australian-government-digital-id-system",
      "identity-verification-solutions-compared",
      "how-to-protect-your-identity-for-free",
    ],
  },
  {
    slug: "identity-verification-solutions-compared",
    title: "Identity verification solutions compared",
    summary:
      "Choosing an identity verification solution? Compare the approaches — document checks, authoritative checks, biometrics, video and reusable credentials — by strength, friction and what you end up storing.",
    topic: "Verification methods",
    updated: "2026-09-25",
    sections: [
      {
        paragraphs: [
          "An <strong>identity verification solution</strong> is any product or service that establishes, for a relying party, that a user is who they claim to be. The market offers many; they differ less in whether they check and more in what evidence they demand, how they behave when fake evidence arrives, and what they leave you holding afterwards.",
          "This guide compares <em>approaches</em>, not vendors. Vendor rankings age badly and depend on data no evergreen page can honestly carry; the structural properties of each method do not age, because they follow from what the method actually does. One disclosure up front: this site documents one such solution, so the bias of the author is real — which is exactly why the comparison is framed by properties you can check yourself.",
        ],
      },
      {
        heading: "The five approaches",
        table: {
          caption: "Identity verification approaches compared by mechanism, strength and what the verifier retains",
          head: ["Approach", "How it works", "Strongest against", "What you retain"],
          rows: [
            [
              "Document verification",
              "Capture an identity document in-session, parse and inspect it, match the portrait to the presenter",
              "Casual fraud; well-established and universally understood",
              "Document data and images, unless you deliberately discard them",
            ],
            [
              "Authoritative-source checks (“direct” verification)",
              "Check the person's details directly against a trusted record rather than against a picture of a card",
              "Forged documents — there is no image to fake; the record is the evidence",
              "Query logs and results; coverage depends on the records available",
            ],
            [
              "Biometric liveness and face match",
              "Challenge a live person — blink, turn, speak — and match them to a reference",
              "Stolen documents and static photos; replayed media",
              "Biometric material, unless matching happens on-device with only a verdict retained",
            ],
            [
              "Video or assisted verification",
              "A human interviews the applicant and inspects evidence in real time",
              "Novel cases and edge situations a model handles poorly",
              "Recordings and notes — the heaviest privacy footprint of the five",
            ],
            [
              "Reusable credentials and proofs",
              "Verify once under hard conditions, then present a signed result or zero-knowledge proof",
              "Repeated collection; every downstream copy that never happens",
              "The answer itself — a tier, a pass/fail, a proof — and nothing beneath it",
            ],
          ],
        },
        paragraphs: [
          "Real deployments combine rows rather than choosing one: a document check bound to a live face, backed by device attestation, is the shape most serious onboarding flows converge on. The combination matters because each layer's weakness is another's strength — see <a href=\"/definitions/what-is-document-verification\">what document verification can and cannot do</a>.",
        ],
      },
      {
        heading: "Compare on two axes, not one",
        paragraphs: [
          "The common mistake is scoring solutions on check strength alone. There are two independent axes, and a solution strong on the first can be dangerous on the second:",
        ],
        list: [
          "<strong>Strength against fraud.</strong> Can the method be passed with generated images, replayed video, or a borrowed document? In the synthetic era, methods that inspect static media score poorly here — the arms race is described in <a href=\"/insights/ai-generated-fraud-and-fake-ids\">AI-generated fraud and fake IDs</a>.",
          "<strong>Exposure after the check.</strong> What exists in your systems tomorrow, and what happens when that is breached? A method that retains document images converts every successful check into future liability — the <a href=\"/insights/why-centralized-identity-databases-fail\">honeypot problem</a> again.",
        ],
        callout: {
          tone: "warning",
          text: "The strongest check that leaves you holding the most data may still be the worst option. Verification strength and breach exposure are separate axes, and most selection frameworks score only one.",
        },
      },
      {
        heading: "Match the solution to the risk",
        paragraphs: [
          "The <a href=\"/insights/verification-tiers-and-proportionality\">proportionality principle</a> decides the rest: match assurance to the actual risk of the action. As a shape, not a rule:",
        ],
        list: [
          "Low-risk actions — gating content, light participation — need little beyond proof a person is present; a threshold proof may answer the question outright.",
          "Account opening and transactions need a full check: document, live face match, device attestation, scored together.",
          "Sensitive roles and high-value operations justify the deepest tier — hardware-backed biometrics, sustained history, and re-checking on a schedule rather than once.",
        ],
        after: [
          "The wallet's four <a href=\"/get-started/verification-levels\">verification levels</a> express exactly this ladder, and the <a href=\"/for-services\">for-services pages</a> map each level to appropriate use.",
        ],
      },
      {
        heading: "Australian considerations",
        paragraphs: [
          "Beyond fraud and friction, an Australian buyer is bound by privacy law's minimisation duty — collect only what you need, secure it, dispose of it when finished — and, in regulated sectors, by accreditation expectations for digital identity providers. Two practical consequences follow. Retention plans should be written before integration, not after. And accessibility is not optional: a solution that excludes people without particular documents or devices shifts the problem onto your support team.",
          "The wider context — who checks identity here and which rules bind them — is mapped in <a href=\"/guides/digital-identity-in-australia\">digital identity in Australia</a>.",
        ],
      },
      {
        heading: "A shortlist you can actually use",
        list: [
          "What does the relying service receive — a result, or raw evidence? Prefer answers you do not have to store.",
          "How is capture controlled? In-session guided capture resists injection; open file upload does not.",
          "Is liveness active and challenge-based, or a single passive frame?",
          "Does the device attest its integrity, closing the emulator and virtual-camera routes?",
          "What is retained, where, for how long — and what happens at the end of that period?",
          "Can consent be seen, scoped and revoked by the person, with an auditable record?",
          "Is the method inspectable? Published specifications and open code let your security team verify claims instead of trusting them.",
        ],
      },
      {
        heading: "Where this service sits",
        paragraphs: [
          "The Identity Wallet documented here is primarily approach five, executed with approach three at enrolment: verification produces signed results and proofs; services receive a tier, a pass/fail answer or a zero-knowledge proof — never documents, never biometrics — because no interface for receiving them exists. It is free, open-source reference infrastructure stewarded by a not-for-profit foundation, independent of government and claiming no accreditation.",
          "If that shape fits your risk, the next step is <a href=\"/for-services/become-a-verifier\">become a verifier</a>; if you are still architecting, start with the <a href=\"/for-services/integration-overview\">integration overview</a>. Terms used above are defined in the <a href=\"/definitions\">definitions</a> section.",
        ],
      },
    ],
    faq: [
      {
        question: "What is the best identity verification method?",
        answer:
          "The one whose assurance matches your actual risk without retaining more evidence than you need. For most services that means a document check bound to a live face under challenge, scored with device attestation — and a threshold proof where the question is a simple yes/no.",
      },
      {
        question: "What is the difference between a document verification system and an identity verification solution?",
        answer:
          "A document verification system is a component: it checks that a document is genuine and coherent. An identity verification solution is the whole flow — evidence, liveness, scoring and result — of which document verification is usually one layer.",
      },
      {
        question: "What is “direct” identity verification?",
        answer:
          "Checking a person's details directly against an authoritative record — a trusted source of truth — instead of inspecting a document image. There is no picture to forge, which is its strength; its limits are coverage of the record and whether the data behind it is current.",
      },
    ],
    related: [
      "age-verification-explained",
      "digital-identity-in-australia",
      "how-to-protect-your-identity-for-free",
    ],
  },
];

export const GUIDE_TOPICS: GuideTopic[] = [
  "Staying safe",
  "Verification methods",
  "The Australian landscape",
];

export function getGuide(slug: string): GuideEntry | undefined {
  return GUIDES.find((guide) => guide.slug === slug);
}
