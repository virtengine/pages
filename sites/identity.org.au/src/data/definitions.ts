/**
 * Definitions — the "what is X" reference pages.
 *
 * Editorial rules (see DESIGN.md §8): evergreen, plain English first, no
 * invented statistics or dates, attribution "Identity.org.au editorial".
 * Each entry maps to exactly one primary search query (see SEO-PLAN.md).
 *
 * Paragraph strings may contain inline HTML links (internal cross-links into
 * the service, guides, help and insights pages). They are rendered with
 * set:html by /definitions/[slug].astro — author-controlled content only.
 *
 * The `faq` block must also render visibly on the page: FAQPage JSON-LD is
 * emitted from it, and Google requires marked-up questions to be visible.
 */

export type DefinitionGroup =
  | "Identity documents"
  | "Verification and proofing"
  | "Wallets, cards and services";

export interface DefinitionSection {
  heading?: string;
  /** Paragraphs may contain inline <a href> and <strong> HTML. */
  paragraphs?: string[];
  list?: string[];
  /** Rendered after the list — typically cross-links back into the site. */
  after?: string[];
  callout?: { tone: "info" | "warning" | "success"; text: string };
}

export interface DefinitionFaq {
  question: string;
  answer: string;
}

export interface DefinitionEntry {
  slug: string;
  /** Page H1 and title seed. Always phrased as the query: "What is …?" */
  term: string;
  summary: string;
  group: DefinitionGroup;
  updated: string;
  sections: DefinitionSection[];
  faq: DefinitionFaq[];
  /** Slugs within this file for the related rail. */
  related: string[];
}

export const DEFINITIONS: DefinitionEntry[] = [
  {
    slug: "what-is-an-identity-document",
    term: "What is an identity document?",
    summary:
      "An identity document is an official record — a passport, licence or birth certificate — that links you to your details. What it proves, what it does not, and why copies of them are now easy to fake.",
    group: "Identity documents",
    updated: "2026-09-25",
    sections: [
      {
        paragraphs: [
          "An <strong>identity document</strong> is an official document, usually issued by a government, that records who you are. It typically carries your full name, your date of birth, a photograph and an identifier such as a document number. A passport, a driver licence and a birth certificate are all identity documents.",
          "The key idea is that the document stands in for a claim: an issuer has asserted these details, and the physical object or file is the evidence you present. In <a href=\"/definitions/what-is-digital-identity-verification\">identity verification</a>, documents have been the raw material for decades — you show one, someone compares it to you, and a decision is made.",
        ],
      },
      {
        heading: "What an identity document proves — and what it does not",
        paragraphs: [
          "An identity document proves that an authority recorded these details at the time of issue. That is genuinely useful evidence. It does not automatically prove three other things people assume it proves:",
        ],
        list: [
          "That the person presenting the document is the person named on it. A document can be stolen, borrowed or sold — verification has to test the link, not just the paperwork.",
          "That the details are still current. Addresses change, names change, documents expire. A licence issued years ago records history, not necessarily the present.",
          "That the document itself is genuine. Physical documents carry defences — holograms, microprint, machine-readable zones — but every one of those defences is defeated by a convincing copy if nobody checks the copy carefully.",
        ],
        callout: {
          tone: "info",
          text: "A document is evidence about you; identity is the link between a person and facts about them. Good verification systems test the link, not just the paperwork.",
        },
      },
      {
        heading: "Physical documents, digital copies",
        paragraphs: [
          "Physical documents are designed to be checked in person: a photograph raised to the light, a hologram that moves, a signature you compare. A <strong>digital copy</strong> — a photo or scan uploaded to a service — carries the data but flattens most of those protections. What remains checkable in a copy is limited: the layout, the typeface, the machine-readable zone's checksums, the barcode data.",
          "This is why <a href=\"/definitions/what-is-document-verification\">document verification systems</a> exist: software that reads the machine-readable data, checks consistency, inspects security features where it can, and flags what does not add up. They are useful, and they are also playing an arms race — see the next section.",
        ],
      },
      {
        heading: "Why copies are easier to fake than they used to be",
        paragraphs: [
          "Forgery used to be expensive. Producing a convincing counterfeit passport took craft, equipment and risk, which kept fake documents rare. Generative tools changed that economics: a plausible document image can now be produced at effectively no cost and submitted to a thousand services in an afternoon. The same tools can generate a matching portrait, which defeats the oldest check of all — glancing at the photo and nodding.",
          "The honest conclusion is not that documents are worthless, but that <em>inspecting a submitted image</em> is no longer sufficient. Verification has to add things a generated image cannot supply: a live response to an unpredictable challenge, hardware attestation that the capture happened on a genuine device, and ultimately a <a href=\"/definitions/what-is-digital-identity-verification\">cryptographic result</a> rather than an image to eyeball. The full argument is in <a href=\"/insights/ai-generated-fraud-and-fake-ids\">AI-generated fraud and fake IDs</a>.",
        ],
      },
      {
        heading: "Documents in a digital identity system",
        paragraphs: [
          "In a wallet-based system, the document plays one role: it is the starting evidence. You present a document once during <a href=\"/get-started/set-up-your-wallet\">setup</a>, it is checked under <a href=\"/get-started/verification-levels\">active liveness challenges</a>, and what you keep afterwards is a <strong>verified credential</strong> — a cryptographically signed record of what was proved, held in your <a href=\"/definitions/what-is-a-digital-identity-wallet\">wallet</a>, not the document scan itself. Services then receive results and <a href=\"/wallet/credentials\">proofs</a>, never documents.",
          "The document did its job once. It does not have to travel with you, be re-emailed, or accumulate in every service's storage — which is precisely the accumulation that turns into breach inventory. The structural argument for never building that archive is <a href=\"/insights/why-centralized-identity-databases-fail\">why centralised identity databases fail</a>.",
        ],
      },
    ],
    faq: [
      {
        question: "Which documents count as identity documents?",
        answer:
          "Any official document that records your identity details: passports, driver licences, proof-of-age cards, birth certificates, citizenship certificates and national identity cards. Photo identity documents are the most useful for verification because they link a photograph to your details.",
      },
      {
        question: "Is a photo of my identity document the same as the document?",
        answer:
          "No. A photo carries the data but loses the physical security features designed to be checked in person, and generated document images can now look entirely plausible. This is why verification systems add liveness, device attestation and cryptographic results on top of any image they inspect.",
      },
      {
        question: "Do I need a document to prove my identity online?",
        answer:
          "Most verification starts from a document, because something has to anchor the check. What you should not have to do is hand that document over repeatedly: after one verification you can present results or proofs instead. The wallet's verification levels show what each stage of assurance requires.",
      },
    ],
    related: [
      "what-is-document-verification",
      "what-is-digital-identity-verification",
      "what-is-biometric-identity-verification",
    ],
  },
  {
    slug: "what-is-digital-identity-verification",
    term: "What is digital identity verification?",
    summary:
      "Digital identity verification is checking online that a person is who they claim to be. How it works, how it differs from a password check, and what a service should actually receive at the end.",
    group: "Verification and proofing",
    updated: "2026-09-25",
    sections: [
      {
        paragraphs: [
          "<strong>Digital identity verification</strong> is the process of confirming, online, that a person is who they claim to be. Instead of a human comparing a card to a face across a counter, software and evidence do the work: data is captured, checked against signals, and a result is issued that a service can rely on.",
          "Three nearby terms are worth separating, because they are constantly confused. <strong>Identification</strong> asks who someone is. <strong>Authentication</strong> proves you control something — a password, a passkey, a device. <strong>Verification</strong> tests a claim about identity: this person really is the holder of this account, this age, this licence. Authentication happens every login; verification usually happens once, to a stated level of confidence.",
        ],
      },
      {
        heading: "What happens during a digital identity check",
        paragraphs: [
          "Most verification flows follow the same skeleton, whatever the brand on top of it:",
        ],
        list: [
          "Evidence is produced. A document is captured with the camera, a face is matched under a liveness challenge, or a credential is presented from a wallet.",
          "Signals are assessed. The data is read and cross-checked: does the document parse, does the portrait match the live face, does the response arrive with human timing, does the device prove its integrity?",
          "A result is issued. A tier, a score, a pass/fail answer or a proof — something a service can check and store without holding the underlying evidence.",
        ],
        after: [
          "The wallet's own flow is documented step by step in <a href=\"/how-it-works\">how it works</a>, and each method above is compared, with its trade-offs, in <a href=\"/guides/identity-verification-solutions-compared\">identity verification solutions compared</a>.",
        ],
      },
      {
        heading: "The methods, in brief",
        paragraphs: [
          "Four families of method cover almost everything on the market. <strong><a href=\"/definitions/what-is-document-verification\">Document verification</a></strong> reads and inspects an identity document. <strong>Authoritative checks</strong> query a trusted record directly — verifying details against a source of truth rather than against a piece of paper. <strong>Biometric checks</strong> confirm a live person matches a reference, usually with a liveness challenge (see <a href=\"/definitions/what-is-biometric-identity-verification\">biometric identity verification</a>). <strong>Credential presentation</strong> reuses a result that was already verified once, delivered as a signature or a <a href=\"/insights/zero-knowledge-proofs-explained\">zero-knowledge proof</a>.",
          "Real-world systems combine them. The point of combination is that each method's weakness is another's strength: a stolen document fails a liveness check, a generated face fails device attestation, a replayed video fails an unpredictable challenge.",
        ],
        callout: {
          tone: "info",
          text: "A good digital identity check ends in two things: an answer you can rely on, and no pile of identity data you now have to protect forever.",
        },
      },
      {
        heading: "What the service should receive",
        paragraphs: [
          "The most consequential design decision in any verification system is not how the check is performed but what happens to the evidence afterwards. The conventional pattern collects document images and selfies into the service's own storage, which creates the exact archive attackers want — the <a href=\"/insights/why-centralized-identity-databases-fail\">honeypot problem</a>.",
          "The alternative is structural: verification produces <strong>results, not copies</strong>. The service receives a verification level, a pass/fail answer or a proof it can verify cryptographically. It never receives documents or biometric data — not because a policy forbids it, but because no such interface exists. That is the interface described in the <a href=\"/for-services/integration-overview\">integration overview</a>, and what users see from their side is covered in <a href=\"/help/who-can-see-your-data\">who can see your data</a>.",
        ],
      },
      {
        heading: "Verification is a level, not a single yes",
        paragraphs: [
          "Not every interaction deserves the same depth of check, so verification is expressed as <strong>levels of assurance</strong> — from a light check that a real person is present, up to hardware-backed biometrics for sensitive roles. The level a service demands should match the risk of the action: that is the proportionality principle set out in <a href=\"/insights/verification-tiers-and-proportionality\">verification tiers and proportionality</a>.",
          "One well-chosen verification, performed under hard conditions, can then be reused everywhere through <a href=\"/wallet/credentials\">credentials and proofs</a> — instead of every service re-running its own camera gauntlet and re-storing its own copy.",
        ],
      },
    ],
    faq: [
      {
        question: "What is the difference between identity verification and authentication?",
        answer:
          "Verification tests a claim about who you are — that this person is the holder of this identity. Authentication proves you control something, such as a password, passkey or device. Verification usually happens once to a stated level; authentication happens every time you sign in.",
      },
      {
        question: "What is a digital identity check?",
        answer:
          "A digital identity check is one run of the verification process: evidence is produced and assessed, and a result is issued. In practice the phrase means the same thing as digital identity verification — the online equivalent of showing ID, but with the outcome recorded as a result rather than a photocopy.",
      },
      {
        question: "What should a service receive from a verification?",
        answer:
          "A result: the user's verification level, a pass/fail answer to a stated requirement, or a cryptographic proof — never document scans, photos or biometric data. Holding no evidence means having no identity archive to breach, which protects the service as much as its users.",
      },
    ],
    related: [
      "what-is-digital-identity-proofing",
      "what-is-document-verification",
      "what-is-biometric-identity-verification",
    ],
  },
  {
    slug: "what-is-digital-identity-proofing",
    term: "What is digital identity proofing?",
    summary:
      "Identity proofing is the work of establishing, to a defined level of confidence, that a claimed identity is real and belongs to the person presenting it. What proofing means, and why proportionality belongs inside it.",
    group: "Verification and proofing",
    updated: "2026-09-25",
    sections: [
      {
        paragraphs: [
          "<strong>Digital identity proofing</strong> — often just “proofing” — is the process of establishing that an identity claim is genuine: that this identity exists, and that the person presenting the claim is the person it belongs to, to a stated level of confidence. If verification is the check, proofing is the discipline of building the check: deciding what evidence is enough, and how much confidence the outcome deserves.",
          "Standards bodies phrase it slightly differently, but the plain-English substance is constant. Proofing answers “is this identity real and theirs?” before anything else can be answered about it. The evidence used is usually a mix of <a href=\"/definitions/what-is-an-identity-document\">identity documents</a>, authoritative records, and a biometric link between the person and the evidence.",
        ],
      },
      {
        heading: "Evidence, attributes and confidence",
        paragraphs: [
          "Proofing systems reason in three dimensions. <strong>Evidence</strong>: what was presented — a passport, a licence, a record lookup, a live face. <strong>Attributes</strong>: what the evidence establishes — name, date of birth, address. <strong>Confidence</strong>: how strongly the combination supports the claim. A document plus a matching live face under liveness challenge supports high confidence; a document image uploaded without any link to the presenter supports much less, however genuine the document looks.",
          "Confidence is also where the <a href=\"/definitions/what-is-digital-identity-verification\">verification</a> result gets its meaning. A level such as Standard or Trusted is a compressed statement of confidence: it says what was checked, without handing over what it was checked from. The wallet's four <a href=\"/get-started/verification-levels\">verification levels</a> work exactly this way.",
        ],
        callout: {
          tone: "info",
          text: "Proofing establishes the identity; proportionality decides how much evidence that answer is worth collecting. Both questions belong in the design.",
        },
      },
      {
        heading: "Why proportionality belongs in proofing",
        paragraphs: [
          "The failure mode of proofing is collecting more than the purpose requires — demanding passport-grade evidence to read a forum, because collecting is cheap and asking twice is annoying. Every extra document retained is breach risk created for no assurance gained, and every unnecessary hurdle is a barrier for people whose documents are harder to obtain.",
          "Proportionality fixes the direction of travel: the intrusiveness of proofing should match the risk of the action it protects. A low-risk action needs light proofing; a sensitive role justifies hardware-backed biometrics and sustained history. The reasoning, including the objections, is worked through in <a href=\"/insights/verification-tiers-and-proportionality\">verification tiers and proportionality</a>.",
        ],
      },
      {
        heading: "Proof once, reuse cryptographically",
        paragraphs: [
          "The other modern shift is treating proofing as an investment rather than a toll. When proofing produces a signed credential held in the person's <a href=\"/definitions/what-is-a-digital-identity-wallet\">wallet</a>, the hard work happens once. Later interactions present a proof of that result — a signature check, or a <a href=\"/insights/zero-knowledge-proofs-explained\">zero-knowledge proof</a> that answers the exact question asked without reopening the evidence.",
          "This changes the economics for everyone. Services get assurance without running their own gauntlet, people face friction once instead of per service, and no new archive is created at each reuse. The verifier-side path — what proofing results look like to a relying service — is set out in <a href=\"/for-services/become-a-verifier\">become a verifier</a>.",
        ],
      },
    ],
    faq: [
      {
        question: "Is identity proofing the same as identity verification?",
        answer:
          "They overlap. Proofing is the process of establishing an identity to a level of confidence — building the case from evidence. Verification is the check that tests a claim against what was established. In practice one flow performs both: proofing creates the verified identity, verification re-tests it when it is used.",
      },
      {
        question: "What evidence is used for identity proofing?",
        answer:
          "Typically three kinds together: identity documents (passport, licence), authoritative records (checking details against a trusted source), and a biometric link tying the live person to the evidence — a face match under a liveness challenge. Higher confidence comes from combining independent kinds of evidence, not from collecting more copies.",
      },
      {
        question: "How much proofing does a typical service need?",
        answer:
          "The lowest level that manages its actual risk. Most services need what the wallet calls Standard — a verified document plus a selfie under active liveness — while many need only a threshold proof such as over-18. Over-proofing costs users trust and creates data risk without adding assurance.",
      },
    ],
    related: [
      "what-is-digital-identity-verification",
      "what-is-an-identity-document",
      "what-is-biometric-identity-verification",
    ],
  },
  {
    slug: "what-is-document-verification",
    term: "What is document verification?",
    summary:
      "Document verification checks that an identity document is genuine and belongs to its presenter. The checks involved, what a document verification system does, and where the approach stops working.",
    group: "Verification and proofing",
    updated: "2026-09-25",
    sections: [
      {
        paragraphs: [
          "<strong>Document verification</strong> is the process of checking that an identity document is genuine, unaltered, and belongs to the person presenting it. A <strong>document verification system</strong> is the software that performs those checks at scale — reading the document, testing its internal consistency, and comparing what it finds against what the person has claimed.",
          "It is one component of <a href=\"/definitions/what-is-digital-identity-verification\">identity verification</a>, not a substitute for it. A perfectly genuine document presented by the wrong person still produces the wrong answer, which is why serious systems always pair document checks with a link to the presenter.",
        ],
      },
      {
        heading: "The checks, in layers",
        paragraphs: [
          "A capable document verification system runs several independent checks and scores them together:",
        ],
        list: [
          "<strong>Data-page checks.</strong> The machine-readable zone's checksums, barcode consistency, and the format of every field — document numbers, dates, check digits. Tampering almost always breaks one of these first.",
          "<strong>Authenticity checks.</strong> Fonts, layout, microprint texture and security features such as holograms or changeable ink, inspected for the properties the issuing document is known to carry.",
          "<strong>Coherence checks.</strong> Do the portrait, the name and the dates agree across the document's own surfaces? Has anything been digitally edited — resaved images, mismatched compression, altered text?",
          "<strong>Presenter checks.</strong> A live face matched against the document portrait under a liveness challenge — the only layer that connects the document to a person in front of the camera.",
          "<strong>Authoritative cross-checks.</strong> Where the issuer offers an interface, the document's details can be checked directly against the source of truth rather than only against the image.",
        ],
        after: [
          "That last layer matters more than it sounds: it verifies against a record instead of against a picture — an approach covered as one of the methods in <a href=\"/guides/identity-verification-solutions-compared\">identity verification solutions compared</a>.",
        ],
      },
      {
        heading: "Why uploaded photos weakened the whole approach",
        paragraphs: [
          "Document verification was designed around capture, but the web settled on upload: a file the user picks from disk. That single decision hands the attacker control of the evidence. A generated document image can be uploaded like any other file, and no amount of image inspection can prove the pixels came from a camera pointed at a real document.",
          "The stronger pattern is <strong>guided capture</strong>: the camera runs inside the session with edge detection and glare checks, so the evidence is produced live and cannot be selected from disk. Add device integrity attestation — the app proving it is genuine and the operating system untampered — and the virtual-camera route closes as well. The full attack-and-defence picture is in <a href=\"/insights/ai-generated-fraud-and-fake-ids\">AI-generated fraud and fake IDs</a>.",
        ],
        callout: {
          tone: "warning",
          text: "A verified document sitting in a stored database is still a stored document. How strong your check was and how much risk you now carry are two separate questions.",
        },
      },
      {
        heading: "What document verification cannot do",
        paragraphs: [
          "It cannot prove personhood on its own. Without a live presenter, a document check only proves an image is well-formed. It cannot guarantee current details — addresses and names change between renewals. And it cannot answer the question nobody asks: what happens to the scan after the check. Every retained copy is breach inventory, which is why the retention question belongs in any honest evaluation of a document verification system.",
          "In this service, document verification plays its part once — during <a href=\"/get-started/set-up-your-wallet\">wallet setup</a>, combined with active liveness at the <a href=\"/get-started/verification-levels\">Standard level</a> — and the durable output is a verified credential, not a retained image. What services receive instead of documents is spelled out in <a href=\"/help/who-can-see-your-data\">who can see your data</a>.",
        ],
      },
    ],
    faq: [
      {
        question: "Is document verification the same as identity verification?",
        answer:
          "No — it is one component of it. Document verification tests that the document itself is genuine and coherent. Identity verification is the wider process, which must also connect the document to the live presenter and decide what confidence the result deserves.",
      },
      {
        question: "What is a document verification system?",
        answer:
          "The software that performs document checks at scale: it reads the machine-readable data, validates checksums and formats, inspects security features and internal coherence, matches the portrait to the presenter, and sometimes cross-checks details against the issuing authority's records.",
      },
      {
        question: "Does document verification require sending my document to a service?",
        answer:
          "Often it does — and that is the part worth questioning. Once you have verified, you should be able to present results or proofs instead of re-sending the document. In this system services never receive documents at all: they receive verification results you approve, one request at a time.",
      },
    ],
    related: [
      "what-is-an-identity-document",
      "what-is-digital-identity-verification",
      "what-is-biometric-identity-verification",
    ],
  },
  {
    slug: "what-is-biometric-identity-verification",
    term: "What is biometric identity verification?",
    summary:
      "Biometric identity verification uses a physical trait — face, fingerprint or iris — to confirm a live person matches an identity. What it checks, on-device versus cloud, and its honest limits.",
    group: "Verification and proofing",
    updated: "2026-09-25",
    sections: [
      {
        paragraphs: [
          "<strong>Biometric identity verification</strong> uses measurements of a physical body — a face, a fingerprint, an iris, sometimes a voice — to check a claim about a person. The phrase <strong>biometric digital ID</strong> describes the same practice from the identity angle: proving who you are using your body rather than a document alone.",
          "A biometric check actually answers two separate questions, and the difference is easy to miss. <strong>Liveness</strong>: is there a real, present person responding right now? <strong>Match</strong>: does this person correspond to the reference they were enrolled against — the document portrait, the enrolment template? Both must pass; either alone can be fooled.",
        ],
      },
      {
        heading: "What biometrics can and cannot prove",
        paragraphs: [
          "Biometrics are strong because they are bound to a body rather than to something that can be handed over. Nobody can lend you their fingerprint the way they can lend a card. Two honest limits follow. First, biometrics cannot be changed: a password caught in a breach is rotated, your face is yours for life, so any system accumulating biometric material accumulates unrevocable risk. Second, a match does not prove intent — a coerced person is still a live, matching person, which is why consent records matter alongside the check.",
          "The processing location decides most of the risk. When capture, template creation and matching happen inside the phone's secure hardware, applications and servers receive only a verdict; when images are uploaded for cloud matching, the biometric travels through networks, logs and backups on the way to a central store. The trade-off, argued in full, is <a href=\"/insights/biometrics-on-device-vs-in-the-cloud\">biometrics: on-device versus in the cloud</a>.",
        ],
        callout: {
          tone: "success",
          text: "The one question that separates biometric products: if your servers were fully breached tomorrow, what biometric material would an attacker hold? The only comfortable answer is none — or ciphertext without keys.",
        },
      },
      {
        heading: "Liveness is part of verification, not a bonus",
        paragraphs: [
          "A face match against a stored photo proves nothing an attacker cannot reproduce with a printed picture or a screen. That is why serious flows issue <strong>active liveness challenges</strong> — turn your head, blink, smile — chosen unpredictably so the response must be produced live. Head rotation is particularly hostile to synthesis, because a real head turn exposes changing three-dimensional structure, lighting and occlusion that flat reenactment struggles to hold consistent.",
          "At the wallet's <a href=\"/get-started/verification-levels\">Trusted level</a>, biometric capture goes further and happens inside the phone's secure hardware, with the device attesting its own integrity. Rendering a convincing face does not help an attacker who must also defeat a physical sensor. The attack classes these layers answer are walked through in <a href=\"/insights/deepfakes-and-identity-verification\">deepfakes and identity verification</a>.",
        ],
      },
      {
        heading: "How this service treats biometrics",
        paragraphs: [
          "The commitments are published rather than implied: biometric templates are encrypted on your device before they move, never shared with services, never written to the chain unencrypted, never sold or traded regardless of consent, and always optional. The operational detail — retention, deletion, breach commitments — is in <a href=\"/help/how-your-biometrics-are-protected\">how your biometrics are protected</a>.",
          "Optionality deserves emphasis. A person should be able to reach a verification level appropriate to their risk without biometrics being forced into every interaction, and refusing a biometric check should cost only what genuinely requires one.",
        ],
      },
    ],
    faq: [
      {
        question: "Is a biometric digital ID the same as a digital identity wallet?",
        answer:
          "No. A biometric check is one method of verifying that a live person matches an identity; a wallet is where verified credentials and keys live afterwards. Biometrics are how you may be verified at setup — the wallet is what you use afterwards, so you are not re-proving yourself everywhere.",
      },
      {
        question: "Can a biometric be changed if it is stolen?",
        answer:
          "No — which is exactly why architecture matters more than promises. You cannot rotate your face or fingerprints. Systems designed around this keep templates encrypted on your device, never share raw biometrics with services, and prefer matching inside secure hardware so there is nothing central to steal.",
      },
      {
        question: "Is biometric verification compulsory?",
        answer:
          "It should not be, and it is not in this system. Biometric checks are optional, used to raise your verification level when something genuinely requires it. Verification levels are separate from authentication: your wallet is secured with passkeys, and biometrics enter only during checks you choose to run.",
      },
    ],
    related: [
      "what-is-digital-identity-verification",
      "what-is-document-verification",
      "what-is-a-digital-identity-wallet",
    ],
  },
  {
    slug: "what-is-a-digital-identity-wallet",
    term: "What is a digital identity wallet?",
    summary:
      "A digital identity wallet is an app that holds your verified identity claims and keys, and lets you prove things to services without handing over documents. What it stores — and what it never stores.",
    group: "Wallets, cards and services",
    updated: "2026-09-25",
    sections: [
      {
        paragraphs: [
          "A <strong>digital identity wallet</strong> is an application that holds your verified identity information — your name, your age threshold, your verification level — together with the cryptographic keys that let you prove those facts to services. It is called a wallet because of what it holds: credentials issued to you, which you present on your own terms.",
          "The definition worth adding is negative: what it does not hold. A wallet full of document scans and photos is not an identity wallet — it is a risk amplifier, convenience dressed as infrastructure. The point of a real wallet is that services receive <em>answers</em>, while the evidence stays with you.",
        ],
      },
      {
        heading: "What a wallet actually holds",
        list: [
          "<strong>Keys.</strong> Passkeys and cryptographic keys that authenticate the wallet itself — no password exists to phish or reuse.",
          "<strong>Verified credentials.</strong> Signed statements produced by verification: your verified name, an over-18 result, a verification tier. Each credential proves something specific and nothing more.",
          "<strong>Consent records.</strong> A history of what you approved, for whom, for what purpose — and when you revoked it.",
          "<strong>Encrypted evidence, if any.</strong> Where evidence must exist, it is encrypted on the device before it moves anywhere.",
        ],
        paragraphs: [
          "What it does not hold: copies of your documents waiting to be breached, a profile of your activity for someone else's analytics, or any way for a service to pull more than you approved. The catalogue of what each credential proves — and what it never reveals — is published at <a href=\"/wallet/credentials\">credentials and proofs</a>.",
        ],
      },
      {
        heading: "What a wallet does for you",
        paragraphs: [
          "Three verbs cover it. <strong>Presents</strong>: when a service asks a question, the wallet shows you exactly who is asking, what they want, and why — in plain language — before you approve or decline. <strong>Proves</strong>: approved answers arrive as a signature or a <a href=\"/insights/zero-knowledge-proofs-explained\">zero-knowledge proof</a>, so a service can verify the claim without seeing the data behind it. <strong>Revokes</strong>: consent can be withdrawn at any time, and revocation stops future processing for that scope.",
          "The first-run experience — what you need, what the check looks like, what each level means — is the <a href=\"/get-started\">get-started guide</a>, and the full flow is <a href=\"/how-it-works\">how it works</a>.",
        ],
        callout: {
          tone: "info",
          text: "The test of an identity wallet: if someone took your phone tomorrow, what could they prove as you? In a wallet built on passkeys and on-device keys, the honest answer is nothing useful.",
        },
      },
      {
        heading: "Not all “wallets” are the same",
        paragraphs: [
          "The word is used loosely, and the categories behave differently. A <strong>photo wallet</strong> just stores images of cards — convenient, and dangerous in exactly the way documents always were. A <strong>licence app</strong> displays a government-issued digital licence with display rules set by the issuer. A <strong>credential wallet</strong> holds signed, verifiable credentials and presents proofs — the category this service belongs to, and the one described further at <a href=\"/definitions/what-is-a-digital-identity-card\">what is a digital identity card</a>.",
          "The Identity Wallet described on this site is free, open-source software stewarded by a not-for-profit foundation — independent of government, with no app-store listings at this stage. Its service pages are <a href=\"/wallet\">the wallet section</a>, and its honesty about current status is on <a href=\"/about/open-source\">open source</a>.",
        ],
      },
    ],
    faq: [
      {
        question: "Is a digital identity wallet the same as a digital identity card?",
        answer:
          "No. A card is one credential; a wallet is the container that can hold many credentials plus your keys and consent records. You might hold a verified age proof, a verified name and a verification tier in one wallet, presenting whichever the situation requires.",
      },
      {
        question: "Does a digital identity wallet replace my passport?",
        answer:
          "No. Government documents remain the authority for the details they issue, and you will still need them for the things only they can do. A wallet changes what happens after verification: instead of re-showing that document everywhere, you present results and proofs derived from it once.",
      },
      {
        question: "What does the identity wallet cost?",
        answer:
          "The software is free and open source under the Apache 2.0 licence, with no subscription and no fee to set up a wallet. It is stewarded by a not-for-profit foundation whose constitution prevents it operating for private profit.",
      },
    ],
    related: [
      "what-is-a-digital-identity-card",
      "what-is-biometric-identity-verification",
      "what-is-a-digital-identity-service",
    ],
  },
  {
    slug: "what-is-a-digital-identity-card",
    term: "What is a digital identity card?",
    summary:
      "A digital identity card puts identity credentials on a phone instead of plastic. What the term covers, how it differs from a wallet and a digital licence, and what Australia actually has.",
    group: "Wallets, cards and services",
    updated: "2026-09-25",
    sections: [
      {
        paragraphs: [
          "A <strong>digital identity card</strong> is an identity credential — photograph, name, date of birth, an identifier — presented from a phone rather than from a piece of plastic. The phrase is used for three quite different things, and the differences matter more than the shared name suggests.",
        ],
        list: [
          "<strong>An image of a card.</strong> A photo of your licence or passport stored in your phone. It is digital only in the sense that a file is digital; it carries none of a card's physical protections and none of a credential's cryptographic ones.",
          "<strong>A government-issued digital licence.</strong> Some state and territory governments display a driver licence inside their service apps, with presentation rules set by the issuer — checkable at a counter, with the issuer able to stand behind it.",
          "<strong>A verifiable credential.</strong> A signed statement held in a credential <a href=\"/definitions/what-is-a-digital-identity-wallet\">wallet</a>, presented as a proof a service can verify cryptographically. This is the strongest of the three, because trust flows from a signature rather than from an image's appearance.",
        ],
      },
      {
        heading: "What Australia actually has",
        paragraphs: [
          "Australia does not issue a national identity card — that has been the country's consistent position across decades of debate. Digital identity in Australia instead arrives as services: the Australian Government's <a href=\"/guides/australian-government-digital-id-system\">Digital ID System</a> and its sign-in app for participating government services, state and territory digital driver licences, and independent wallets like this one.",
          "There is no single card — physical or digital — that proves identity everywhere. Instead, identity is established through a combination of documents, service credentials and verification results, which is precisely the environment in which a <a href=\"/definitions/what-is-a-digital-identity-service\">digital identity service</a> operates.",
        ],
        callout: {
          tone: "info",
          text: "A card answers “who am I?”. A wallet answers “what may I prove right now, to whom, and with what evidence?”. The second question is the one the digital era actually asks.",
        },
      },
      {
        heading: "Card versus wallet: why the distinction matters for privacy",
        paragraphs: [
          "A card is a fixed bundle: presenting it for one fact presents everything on it. Ask whether you are over 18 and the card also answers your name, your exact birth date, your address and your number. That over-answering is the privacy problem with cards — physical and digital alike — and it is the problem <a href=\"/insights/zero-knowledge-proofs-explained\">zero-knowledge proofs</a> were built to solve.",
          "A credential wallet inverts the bundle. Each question gets its own narrow answer — a threshold proof, a single verified claim, a tier — approved per request and recorded in your consent history. What each credential reveals and withholds is catalogued at <a href=\"/wallet/credentials\">credentials and proofs</a>.",
        ],
      },
      {
        heading: "Should you photograph your documents?",
        paragraphs: [
          "Practically everyone has, at some point, photographed a licence or passport to send to someone who asked. It is worth unlearning. Every such copy is identity data in a stranger's storage system, and copies leak at exactly the moment you forget they exist. Where a photo is genuinely required, treat it as a one-off; where only a fact is required — an age, a name, an address — offer the fact instead.",
          "The everyday version of this habit — locks, passkeys, breach alerts and refusing needless document circulation — is collected in <a href=\"/guides/how-to-protect-your-identity-for-free\">how to protect your identity for free</a>.",
        ],
      },
    ],
    faq: [
      {
        question: "Is a digital identity card the same as the government sign-in app?",
        answer:
          "No. The government's app exists to let people prove identity when signing in to participating government services. It is one credential from one issuer. A digital identity wallet is a separate container that can hold many credentials — including results from independent verification — and present them wherever you choose.",
      },
      {
        question: "Should I keep photos of my identity documents on my phone?",
        answer:
          "Prefer not to. A photo of a document is identity data sitting in your camera roll, your backups and any app that gets access to them. Where you only need to prove a fact — age, name, address — present the fact instead. The free checklist at how to protect your identity covers device settings that limit the blast radius if you already have copies.",
      },
      {
        question: "Does identity.org.au issue a digital identity card?",
        answer:
          "No. identity.org.au provides a digital identity wallet — the app that holds verified credentials and presents proofs — not an identity card, and not a government-issued document of any kind. It is open-source reference software stewarded by a not-for-profit foundation.",
      },
    ],
    related: [
      "what-is-a-digital-identity-wallet",
      "what-is-an-identity-document",
      "what-is-a-digital-identity-service",
    ],
  },
  {
    slug: "what-is-a-digital-identity-service",
    term: "What is a digital identity service?",
    summary:
      "A digital identity service helps people prove who they are online — wallets, verification providers, registries and trust frameworks. The four jobs such services do, and what to look for in one.",
    group: "Wallets, cards and services",
    updated: "2026-09-25",
    sections: [
      {
        paragraphs: [
          "A <strong>digital identity service</strong> is any service that helps establish, hold, or rely on digital information about who a person is. The category is broad on purpose: it covers the app on your phone, the verification performed when you open an account, and the trust infrastructure that lets unrelated services share confidence in a result.",
          "Almost every digital identity service does one or more of four jobs, and naming the job is the fastest way to understand the product.",
        ],
        list: [
          "<strong>Prove.</strong> Verification and <a href=\"/definitions/what-is-digital-identity-proofing\">proofing</a> services establish that an identity claim is genuine and issue a result — the subject of <a href=\"/definitions/what-is-digital-identity-verification\">digital identity verification</a>.",
          "<strong>Hold.</strong> Wallets store credentials, keys and consent records so the person controls presentation. See <a href=\"/definitions/what-is-a-digital-identity-wallet\">what a digital identity wallet is</a>.",
          "<strong>Decide.</strong> Policy layers translate risk into required assurance: which tier, which proof, for which action.",
          "<strong>Attest.</strong> Registries and trust frameworks publish what has been approved — which issuers, which verifier versions — so a relying service knows what it is checking against.",
        ],
      },
      {
        heading: "The question that separates them: what do they keep?",
        paragraphs: [
          "Two services can perform identical checks and have opposite risk profiles, decided entirely by what happens to the evidence. The conventional model retains document images and selfies, which turns every verification into a small archive — and archives of identity evidence are attacked precisely because they exist. That is the <a href=\"/insights/why-centralized-identity-databases-fail\">honeypot problem</a>, and it is structural rather than a matter of operator care.",
          "The alternative produces results and discards or encrypts the evidence: services receive tiers, pass/fail answers and proofs, while raw material never enters circulation. When evaluating any identity service — including this one — the useful question is not “how good are your checks?” but “what exists in your databases about me today?”",
        ],
        callout: {
          tone: "info",
          text: "The single most informative question you can ask an identity service: if you were breached tomorrow, what would an attacker hold about me? The answers sort the field instantly.",
        },
      },
      {
        heading: "What to look for, in order",
        list: [
          "<strong>Minimisation.</strong> Does the service receive less than the question requires, or the maximum by default? Threshold answers exist for most yes/no questions.",
          "<strong>Retention, stated in numbers.</strong> What is kept, for how long, and what happens at the end of it — “promptly” is not a retention policy.",
          "<strong>Consent you can see and revoke.</strong> Structured, purposed, time-limited grants with an auditable history, as described in <a href=\"/insights/consent-as-infrastructure\">consent as infrastructure</a>.",
          "<strong>Openness.</strong> Can the method be inspected? An identity system that cannot be examined asks for trust it has not earned — see <a href=\"/security\">how security claims are evidenced here</a>.",
          "<strong>Honest claims.</strong> Accreditation, availability and capabilities stated precisely, with limits named. Overclaiming identity infrastructure is itself a warning sign.",
        ],
      },
      {
        heading: "Where identity.org.au fits",
        paragraphs: [
          "This site documents one particular service: the Identity Wallet — a free, open-source digital identity wallet and the verification layer behind it, stewarded by DETIO FOUNDATION LTD, an Australian not-for-profit. It is independent of the Australian Government and claims no accreditation; it states plainly what it is as it rolls out with the VirtEngine network.",
          "For organisations, the verifier-facing side starts at <a href=\"/for-services\">for services</a> — whether the <a href=\"/for-services/become-a-verifier\">become a verifier</a> path or the <a href=\"/for-services/integration-overview\">integration overview</a> fits depends on where you are in the decision. For everyone else, the <a href=\"/get-started\">get-started guide</a> is the front door.",
        ],
      },
    ],
    faq: [
      {
        question: "What is the difference between an identity service and an identity provider?",
        answer:
          "An identity provider usually means federated sign-in: one platform authenticates you and tells other services who you are. An identity service is the broader category — anything that proves, holds, decides or attests identity. A wallet-based service is identity infrastructure you hold yourself, with no provider sitting in the middle of each interaction.",
      },
      {
        question: "Is identity.org.au a digital identity service?",
        answer:
          "Yes — a wallet and verification layer, operated by a not-for-profit foundation as open-source reference software. It is not a government service, is separate from the Australian Government Digital ID System, myID and myGov, and claims no accreditation.",
      },
      {
        question: "Are digital identity services regulated in Australia?",
        answer:
          "Partly. The Digital ID Act 2024 established an accreditation scheme for digital identity services used in certain contexts, alongside general privacy law that applies to every organisation holding personal information. The foundation is currently applying for accreditation; accreditation has not been granted and none is claimed.",
      },
    ],
    related: [
      "what-is-a-digital-identity-wallet",
      "what-is-digital-identity-proofing",
      "what-is-a-digital-identity-card",
    ],
  },
];

export const DEFINITION_GROUPS: DefinitionGroup[] = [
  "Identity documents",
  "Verification and proofing",
  "Wallets, cards and services",
];

export function getDefinition(slug: string): DefinitionEntry | undefined {
  return DEFINITIONS.find((entry) => entry.slug === slug);
}
