/**
 * Insights — evergreen explainer and analysis articles.
 *
 * Editorial rules (see DESIGN.md):
 * - Evergreen and accurate. NO invented statistics, dates, incidents,
 *   case studies or author personas. Attribution is "Identity.org.au
 *   editorial" (an organisation, not a fabricated person).
 * - Plain English first; every term of art defined on first use.
 * - Paragraph strings may contain inline HTML links (internal cross-links
 *   into the service, help and get-started pages). They are rendered with
 *   set:html by /insights/[slug].astro — author-controlled content only.
 */

export type InsightTopic =
  | "Synthetic media"
  | "Fraud"
  | "Architecture"
  | "Cryptography"
  | "Rights and consent"
  | "Economics";

export interface InsightSection {
  heading?: string;
  /** Paragraphs may contain inline <a href> and <strong> HTML. */
  paragraphs?: string[];
  list?: string[];
  callout?: { tone: "info" | "warning" | "success"; text: string };
}

export interface InsightArticle {
  slug: string;
  title: string;
  topic: InsightTopic;
  summary: string;
  updated: string;
  /** Featured on the homepage insights strip. */
  featured?: boolean;
  sections: InsightSection[];
  related: string[];
}

export const INSIGHT_ARTICLES: InsightArticle[] = [
  {
    slug: "identity-in-the-synthetic-era",
    title: "Identity in the synthetic era",
    topic: "Synthetic media",
    summary:
      "Generative tools can now produce convincing faces, voices and documents. What breaks when seeing is no longer believing — and what verification has to become instead.",
    updated: "2026-08-03",
    featured: true,
    sections: [
      {
        paragraphs: [
          "For most of history, identity verification worked because forgery was expensive. A convincing fake passport required craft, equipment and risk. A convincing fake face required a twin. The systems we built — show a document, compare a photo, trust what you see — all assumed that producing believable evidence of a person who does not exist, or impersonating one who does, was hard.",
          "That assumption has quietly expired. Generative models can produce photorealistic faces of people who have never lived, clone a voice from a short sample, and render document images with plausible fonts, layouts and security-feature lookalikes. None of this requires specialist skill any more. The cost of producing believable fake identity evidence has collapsed, and it is not coming back.",
          "This is what we mean by the synthetic era: a period in which the marginal cost of fabricating audiovisual \"proof\" of identity approaches zero, while the human ability to detect that fabrication stays flat. Every verification system designed for the pre-synthetic world now has to answer a new question — not \"does this look right?\" but \"can this be proven right?\"",
        ],
      },
      {
        heading: "What actually breaks",
        paragraphs: [
          "It helps to be precise about which links in the verification chain fail. A photograph of a face no longer proves a person exists. A video of a person speaking no longer proves they said those words. An image of a driver licence no longer proves the licence was ever issued. What all three have in common is that they are <strong>media artefacts</strong> — recordings that were once expensive to fake and are now cheap.",
          "What does not break is cryptography and physics. A digital signature over a credential still proves the credential was issued by the holder of a signing key. A liveness challenge performed in real time still requires a live subject to respond within human reaction times. A hardware-backed biometric sensor still measures a physical body part inside tamper-resistant silicon. The synthetic era does not end verification — it ends verification by inspection of media.",
        ],
        callout: {
          tone: "info",
          text: "The organising principle: anything that can be replayed can be faked. Verification has to move from artefacts you inspect to interactions and cryptographic bindings you can test.",
        },
      },
      {
        heading: "The three responses that hold up",
        list: [
          "Challenge–response instead of static media. Active liveness — blink now, turn your head now — forces the evidence to be produced live, in response to an unpredictable prompt. Pre-rendered fakes cannot answer a challenge they did not know was coming.",
          "Hardware attestation instead of trust in software. When a fingerprint is read inside a phone's secure hardware and the device proves its own integrity (Google Play Integrity, Apple App Attest), an attacker needs to defeat physical silicon, not just generate pixels.",
          "Cryptographic provenance instead of visual inspection. A verified credential carries a signature chain back to the verification event. A service checking the signature does not care what the credential looks like — only whether the maths holds.",
        ],
        paragraphs: [
          "The <a href=\"/wallet\">Identity Wallet</a> is built on exactly these three responses. The capture flow pairs document scanning with <a href=\"/get-started/set-up-your-wallet\">active liveness challenges</a>, higher verification levels add <a href=\"/wallet/mobile-wallet\">hardware-backed biometrics and device integrity attestation</a>, and everything a service receives is a cryptographically verifiable result rather than an image to eyeball.",
        ],
      },
      {
        heading: "The trap to avoid: fighting synthesis with surveillance",
        paragraphs: [
          "There is a tempting wrong answer to the synthetic era: collect more. If fakes are getting better, the argument runs, then verification should demand more documents, more biometrics, more behavioural data, held centrally so it can be cross-checked. This trades one failure mode for a worse one. Central stores of identity evidence are the highest-value target on the internet, and every record added makes the eventual breach more damaging — the <a href=\"/insights/why-centralized-identity-databases-fail\">honeypot problem</a>.",
          "The alternative is to make verification stronger while making disclosure smaller. Prove liveness without storing the video. Derive a verification result and discard the raw evidence from circulation — in the wallet's case, evidence is <a href=\"/wallet/security\">encrypted on the device</a> before it moves anywhere, and services receive <a href=\"/help/who-can-see-your-data\">answers, never documents</a>. A system that never accumulates a honeypot cannot leak one.",
        ],
      },
      {
        heading: "Where this leaves individuals",
        paragraphs: [
          "In the synthetic era, your face and voice are no longer secrets — assume they can be copied. What can remain yours is the ability to prove that a claim about you is true: that a live, verified person consented to this specific interaction at this specific time. That ability rests on keys you control, biometric checks performed against your physical presence, and consent records you can audit.",
          "That is a genuinely different foundation from \"a photo of my licence\", and it is the foundation this service is built to provide. If you want to see what that looks like in practice, start with <a href=\"/how-it-works\">how it works</a> or the guide to <a href=\"/wallet/credentials\">what each credential proves — and what it never reveals</a>.",
        ],
      },
    ],
    related: ["deepfakes-and-identity-verification", "ai-generated-fraud-and-fake-ids", "what-is-digital-likeness"],
  },
  {
    slug: "ai-generated-fraud-and-fake-ids",
    title: "AI-generated fraud and fake IDs",
    topic: "Fraud",
    summary:
      "Generated document images and synthetic faces have industrialised identity fraud. How modern verification systems — liveness, hardware attestation, cryptographic results — are designed to answer it.",
    updated: "2026-08-03",
    featured: true,
    sections: [
      {
        paragraphs: [
          "A fake ID used to be a physical object. Someone had to print it, laminate it, and hand it over while standing in front of another human. Every step carried cost and risk, which kept identity fraud artisanal. Online onboarding changed the medium — services began accepting photographs of documents — and generative tools changed the economics. A document image with plausible layout, typeface, microprint texture and a synthetic portrait can now be produced by anyone, at effectively no cost, and submitted to a thousand services in an afternoon.",
          "The same applies to the face itself. Verification flows that ask for \"a selfie holding your ID\" were designed to bind a document to a person. When both the document image and the selfie can be generated to match each other, that binding is theatre. Fraud has industrialised; inspection has not.",
        ],
      },
      {
        heading: "Why inspection loses",
        paragraphs: [
          "Any check that examines a submitted image is playing a losing game, because the attacker controls everything about the image. Detection models can spot common generation artefacts, and they matter as one layer — but they are locked in an arms race in which each detector improvement trains the next generator. A verification system whose only defence is \"our model can tell fakes from real\" is making a promise that decays.",
          "Robust systems change the game instead of playing it better. They stop asking \"is this image real?\" and start asking questions the attacker cannot answer by generating pixels: can you respond to a challenge in real time? Can your device prove its integrity? Does your evidence carry a cryptographic chain back to a verifiable event?",
        ],
      },
      {
        heading: "The layered response",
        list: [
          "Active liveness. The capture flow issues unpredictable challenges — blink, turn your head, smile — and requires the response live. A generated video prepared in advance cannot answer a prompt it has not seen. This is why the wallet's selfie step is a challenge sequence, not a photo upload.",
          "Guided capture, not file upload. The wallet's document step uses the camera directly with edge detection and glare checks — the evidence is produced inside the session, not selected from disk, which removes the easiest injection path for generated images.",
          "Hardware-backed biometrics. At higher verification levels, fingerprint or iris capture happens inside the phone's secure hardware. Generating an image does not help an attacker who needs to defeat a physical sensor.",
          "Device integrity attestation. Google Play Integrity and Apple App Attest let the device prove the app is genuine and the operating system untampered — blocking the emulators and instrumented devices that industrial fraud depends on.",
          "Cross-checks between evidence types. Document OCR, face matching between document portrait and live selfie, and scoring across all signals mean a fraudster must defeat every layer simultaneously and consistently.",
        ],
        paragraphs: [
          "No single layer is unbeatable; the design assumption is that each layer multiplies the attacker's cost. The <a href=\"/wallet/mobile-wallet\">mobile wallet</a> implements this full stack, and the network's scoring model combines the signals into a <a href=\"/help/understanding-your-veid-score\">composite score</a> rather than a single pass/fail that one bypass could flip.",
        ],
      },
      {
        heading: "Protecting the honest user",
        paragraphs: [
          "Anti-fraud design has a second obligation that is easy to forget: it must not turn honest users into collateral. Systems that respond to fraud by hoarding evidence create breach risk for everyone; systems that respond with opaque bans create Kafkaesque appeals. The wallet's approach is to make verification strong at the moment it happens, keep the evidence <a href=\"/wallet/security\">encrypted and out of services' hands</a>, and record outcomes — not raw biometrics — on the network.",
          "A failed check is also not an accusation. Most failures are practical — lighting, glare, an expired document — and the flow is designed for retry without penalty, as the <a href=\"/get-started/if-verification-fails\">if verification fails</a> guide explains.",
        ],
        callout: {
          tone: "warning",
          text: "Fraud pressure never justifies collecting more than verification needs. A system that fights fake identities by warehousing real ones has traded a fraud problem for a breach problem.",
        },
      },
      {
        heading: "What services should take from this",
        paragraphs: [
          "If your service still verifies identity by accepting uploaded document photos, you are accepting evidence that is now trivially synthesisable. The practical alternative is to rely on a verification layer that performs challenge–response capture and hands you a cryptographically verifiable result — a tier, a score threshold, a yes/no proof — rather than media you must judge. That is precisely the interface described in <a href=\"/for-services/integration-overview\">the integration overview</a>, and the path to using it starts at <a href=\"/for-services/become-a-verifier\">becoming a verifier</a>.",
        ],
      },
    ],
    related: ["deepfakes-and-identity-verification", "identity-in-the-synthetic-era", "the-economics-of-identity-fraud"],
  },
  {
    slug: "what-is-digital-likeness",
    title: "What is digital likeness?",
    topic: "Synthetic media",
    summary:
      "Your face, voice and mannerisms can now be captured, modelled and reproduced without you. What \"likeness\" means technically, why it is not the same thing as identity, and how to keep the two separate.",
    updated: "2026-08-03",
    sections: [
      {
        paragraphs: [
          "Your likeness is the set of observable characteristics by which other people recognise you: your face, your voice, the way you move and phrase things. For all of human history, likeness was inseparable from presence — to look and sound like you, someone had to be you. Generative models have separated the two. A model trained on photographs and recordings of a person can reproduce their likeness on demand, saying and doing things the person never said or did.",
          "It is worth being precise, because the term is often used loosely. A <strong>digital likeness</strong> is a reproducible model of how you appear — not a record of anything you did, and not an identity. It is closer to a very good mask than to a passport. The synthetic era's core confusion is that masks have become good enough to pass for passports in systems that only look at faces.",
        ],
      },
      {
        heading: "Likeness is not identity",
        paragraphs: [
          "Identity, in the sense that matters to services and to the law, is not how you look. It is the durable link between a person and facts about them: this person is over 18, this person holds this account, this person consented to this action. Likeness is one historical proxy for that link — we recognise faces because for millennia faces could not be forged. When the proxy fails, the link itself does not disappear; it just needs a better anchor.",
          "This distinction is liberating rather than alarming. If identity systems stop treating \"looks like you\" as proof, then copying your appearance stops being equivalent to stealing your identity. The harm of likeness misuse remains real — reputational, emotional, financial — but the door it opens into your accounts and entitlements can be closed.",
        ],
        callout: {
          tone: "info",
          text: "A useful mental test: could this check be passed by a very good mask? If yes, it is a likeness check, not an identity check — and in the synthetic era it will eventually be passed by software.",
        },
      },
      {
        heading: "How verification separates the two",
        paragraphs: [
          "Modern verification anchors identity in things a likeness model does not have. First, <strong>presence</strong>: active liveness challenges require a live body responding in real time, which a rendered face cannot do inside a genuine capture session. Second, <strong>hardware</strong>: fingerprint and iris capture at higher levels happens inside secure silicon that measures a physical body part, with the device attesting its own integrity. Third, <strong>keys and consent</strong>: once verified, your identity is represented by cryptographic material bound to your wallet — presenting a proof requires control of the key, not resemblance to a photo.",
          "In the <a href=\"/wallet\">Identity Wallet</a>, your face is used briefly — matched against your document during <a href=\"/get-started/set-up-your-wallet\">setup</a>, under liveness challenges — and then the working representation of you becomes a verified credential. Services that rely on the credential are not trusting your appearance; they are trusting mathematics. Someone with a perfect model of your face has none of the things the system actually checks.",
        ],
      },
      {
        heading: "Protecting likeness itself",
        paragraphs: [
          "Separating likeness from identity does not make likeness worthless — it remains deeply personal, and systems that process it owe it special care. The commitments that govern this service treat biometric data as the most sensitive category it touches: templates are <a href=\"/help/how-your-biometrics-are-protected\">encrypted on your device before they move</a>, never shared with services, never written unencrypted to the chain, and never sold or traded regardless of consent.",
          "Data minimisation is the other half of protection. Every copy of your face that exists in a database is training material and breach inventory for someone else. A verification system that keeps biometric material out of circulation — deriving results and locking evidence away — shrinks the raw supply from which unauthorised likenesses are built.",
        ],
      },
      {
        heading: "What you can do",
        list: [
          "Treat your appearance as public and your keys as private. Assume images of your face exist and can be modelled; protect the credentials and devices that actually authenticate you.",
          "Prefer services that verify presence, not pictures — a service that accepts an uploaded selfie as proof is accepting your likeness, and everyone else's model of it.",
          "Use proofs instead of documents where you can. Every document photo you email is likeness plus identity data in one leakable file; a proof reveals neither.",
          "Know your revocation rights. Consent to biometric processing is revocable at any time, and revocation triggers the deletion schedule.",
        ],
        paragraphs: [
          "The deeper story about how these protections became constitutional commitments rather than product features is covered in <a href=\"/insights/digital-identity-and-human-rights\">digital identity and human rights</a>.",
        ],
      },
    ],
    related: ["identity-in-the-synthetic-era", "deepfakes-and-identity-verification", "biometrics-on-device-vs-in-the-cloud"],
  },
  {
    slug: "deepfakes-and-identity-verification",
    title: "Deepfakes and identity verification",
    topic: "Synthetic media",
    summary:
      "Face-swap and reenactment tools can defeat any check that inspects recorded video. A technical walk through the attacks — replay, injection, real-time puppeting — and the defences that survive them.",
    updated: "2026-08-03",
    sections: [
      {
        paragraphs: [
          "\"Deepfake\" covers a family of techniques — face swapping, face reenactment, full-face synthesis, voice cloning — that share one output: media in which a person appears to do or say something they did not. For identity verification, the relevant question is narrow and practical: can synthetic media pass the checks a verification flow performs? The honest answer is that against naive flows, yes, easily — and against well-designed flows, the attacker's job becomes very much harder in identifiable, testable ways.",
          "This article walks through the attack surface as a verification engineer sees it, because the defences only make sense once the attacks are concrete.",
        ],
      },
      {
        heading: "The three attack routes",
        list: [
          "Replay: presenting prepared media to a genuine camera — a screen showing a synthesised video held up to the phone. Cheapest attack; defeated by the physics of re-photographing screens (moiré, reflectance, depth cues) plus challenge unpredictability.",
          "Injection: bypassing the camera entirely and feeding synthetic frames into the capture pipeline — via a virtual camera, instrumented app or emulator. Defeats naive apps completely, which is why device and app integrity matter more than image analysis.",
          "Real-time puppeting: driving a synthetic face live, so it can respond to challenges. The most capable attack — and the one that raises the attacker's cost from \"run a script\" to \"defeat hardware attestation while rendering a challenge-consistent face with correct 3D geometry in real time\".",
        ],
      },
      {
        heading: "Defence 1: make the evidence live",
        paragraphs: [
          "Active liveness converts capture from a recording into a conversation. The app asks for actions — blink, turn your head, smile — chosen and ordered unpredictably, and verifies the response arrives with human timing and geometric consistency. Head rotation is particularly hostile to synthesis: a real head turning exposes changing 3D structure, lighting interaction and occlusion that 2D reenactment models struggle to hold consistent frame-to-frame.",
          "The <a href=\"/wallet/mobile-wallet\">wallet capture app</a> implements exactly this challenge set in its selfie stage. Liveness does not need to be perfect to be effective; it needs to force the attacker out of the replay category into real-time puppeting, where the remaining defences apply.",
        ],
      },
      {
        heading: "Defence 2: make the pipeline trustworthy",
        paragraphs: [
          "Injection attacks succeed when the verifier trusts frames without trusting their origin. The counter is attestation: the app proves it is the genuine, unmodified app running on an untampered operating system, using <a href=\"https://docs.virtengine.com/veid/hardware-attestation\" rel=\"noopener\">platform attestation APIs</a> — Google Play Integrity on Android, App Attest on iOS. An attestation-gated capture session on a device with a hardware root of trust closes the virtual-camera route; the attacker now needs a compromised physical device, not a software trick.",
          "At the <a href=\"/get-started/verification-levels\">Trusted level</a>, the wallet adds hardware biometric capture — fingerprint or iris read inside the secure enclave. No amount of rendering reaches a sensor that measures a physical finger. This layering is deliberate: each level of assurance corresponds to attacks it rules out, which is also why higher-risk actions on the network <a href=\"/wallet/verify-on-virtengine\">require higher tiers</a>.",
        ],
        callout: {
          tone: "info",
          text: "Defence in depth, stated plainly: liveness defeats replay, attestation defeats injection, hardware biometrics defeat puppeting. A successful deepfake attack must beat all three at once, live, on attested silicon.",
        },
      },
      {
        heading: "Defence 3: never re-verify by eye",
        paragraphs: [
          "The final defence is architectural. Once verification has happened under all the protections above, its output should be a <strong>cryptographic credential</strong>, not media. Services relying on the result verify a signature or a <a href=\"/insights/zero-knowledge-proofs-explained\">zero-knowledge proof</a> — checks that deepfakes cannot touch, because no imagery is being judged. The worst pattern in industry is re-performing visual verification at every service; every repetition is another camera session an attacker can target, and another pile of stored selfies to breach.",
          "Verify once, under hard conditions; reuse the result cryptographically everywhere else. That is the wallet's model — services receive <a href=\"/help/who-can-see-your-data\">answers, never images</a> — and it means the deepfake battle is fought only at the strongest point in the system rather than at every weak one.",
        ],
      },
      {
        heading: "Honest limits",
        paragraphs: [
          "No verification system should claim deepfake immunity, and this one does not. Synthesis quality improves; attestation has had bypasses; sensors have been spoofed in laboratories. What a layered design claims is different and defensible: each attack class has a specific, testable counter; the layers multiply the attacker's cost; the system's outputs are auditable; and — because the <a href=\"/about/open-source\">code is open source</a> — the defences can be inspected rather than taken on faith.",
        ],
      },
    ],
    related: ["ai-generated-fraud-and-fake-ids", "identity-in-the-synthetic-era", "biometrics-on-device-vs-in-the-cloud"],
  },
  {
    slug: "why-centralized-identity-databases-fail",
    title: "Why centralised identity databases fail",
    topic: "Architecture",
    summary:
      "Every central store of identity documents is a honeypot: maximum value to attackers, catastrophic and irreversible when breached. The structural argument for never building the archive at all.",
    updated: "2026-08-03",
    featured: true,
    sections: [
      {
        paragraphs: [
          "The conventional way to verify people online is to collect their identity documents into a database. Every service does it: scans of passports and licences, selfies, dates of birth, addresses, accumulated as a by-product of onboarding and kept indefinitely, because deleting data takes a decision and keeping it takes none. The result is thousands of independent archives of exactly the material needed to impersonate the people in them.",
          "This is not a problem of careless operators, though carelessness makes it worse. It is a structural property of the architecture. A central identity database fails not because someone administers it badly, but because of what it is: a single location whose contents are worth more to attackers than the cost of any defence its operator can economically mount.",
        ],
      },
      {
        heading: "The honeypot problem",
        paragraphs: [
          "Security economics turns on the ratio between the value of a target and the cost of defending it. An identity archive concentrates value superlinearly: each additional record makes the whole more attractive, because attackers monetise at scale. Defence costs, meanwhile, grow with complexity — every employee, integration, backup and legacy system is attack surface. Past some size, the archive is worth a level of attacker effort — including patient, well-resourced effort — that no ordinary operator's defences are priced to resist.",
          "Breach of identity evidence is also uniquely irreversible. A leaked password is rotated in a minute. A leaked face, birth date and document number are leaked for the life of the person. The blast radius of an identity archive breach is measured in decades, and the people harmed are not the ones who chose the architecture — the incentives are misaligned exactly where the stakes are highest.",
        ],
        callout: {
          tone: "warning",
          text: "The honeypot problem in one sentence: any store of identity evidence valuable enough to be worth building is valuable enough to be worth breaching — and identity evidence, once breached, cannot be rotated.",
        },
      },
      {
        heading: "Aggregation is its own harm",
        paragraphs: [
          "Breach is not the only failure mode. A central identity database is also an instrument: whoever controls it can observe, profile, exclude or coerce at population scale, and every actor who can compel the operator inherits that power. History's lesson on registries is that capability outlives intent — databases built for one purpose are repurposed under pressure. This is why the human-rights analysis of identity systems, explored in <a href=\"/insights/digital-identity-and-human-rights\">a companion article</a>, treats protection from surveillance and private capture as design requirements, not policy add-ons.",
          "Even short of misuse, centralisation concentrates operational fragility: one outage locks everyone out; one corrupted migration damages everyone's records; one vendor's pricing decision taxes every dependent service. Identity is infrastructure, and infrastructure with a single point of failure fails.",
        ],
      },
      {
        heading: "The alternative: never build the archive",
        paragraphs: [
          "The failure is architectural, so the fix must be too. The design used by the <a href=\"/wallet\">Identity Wallet</a> makes three structural moves. First, evidence is <strong>encrypted on the user's device</strong> before it goes anywhere — what the network stores are encrypted payloads it cannot browse, so there is no plaintext archive to steal. Second, verification produces <strong>results, not copies</strong>: services receive a tier and a yes/no answer, <a href=\"/help/who-can-see-your-data\">never documents</a>, so no service accumulates evidence as a side effect of checking it. Third, the record of results lives on a <strong>decentralised network</strong> with no single administrator to breach, compel or capture.",
          "Notice what this does to the honeypot maths. The high-value asset — a browsable pile of identity evidence — simply never exists. What exists is ciphertext under user-held keys, distributed results, and consent records. An attacker who compromises a service gets that service's answers (\"over 18: yes\"), not the documents of everyone who ever verified.",
        ],
      },
      {
        heading: "Objections worth answering",
        list: [
          "\"Blockchains are public — isn't that worse?\" It would be if personal data were written to the chain, which is why it never is. The chain stores encrypted references and verification results; its role is tamper-evidence for the record, not storage for the evidence.",
          "\"Doesn't decentralisation just move trust to the code?\" Yes — deliberately. Code can be audited by anyone before trusting it; a private operator's database practices cannot. The wallet's code is open source for exactly this reason.",
          "\"Central databases enable recovery when things go wrong.\" Recovery is a real requirement, met differently: re-verification against your documents on a new device, not an administrator's master key.",
        ],
        paragraphs: [
          "Deleting is also honest in this design: when you <a href=\"/help/deleting-your-identity\">delete your identity</a>, encryption keys are destroyed, making remaining ciphertext permanently unreadable — a stronger guarantee than any promise to purge rows from an archive you cannot inspect.",
        ],
      },
    ],
    related: ["self-sovereign-identity-vs-federated-login", "the-economics-of-identity-fraud", "biometrics-on-device-vs-in-the-cloud"],
  },
  {
    slug: "zero-knowledge-proofs-explained",
    title: "Zero-knowledge proofs, explained",
    topic: "Cryptography",
    summary:
      "How you can prove you are over 18 without revealing your birth date — the intuition behind zero-knowledge proofs, without the mathematics, and where the wallet uses them.",
    updated: "2026-08-03",
    sections: [
      {
        paragraphs: [
          "Here is an everyday absurdity: to prove you are old enough to buy a drink, you hand over a card that shows your exact birth date, your full name, your address and your licence number. The question needed one bit of information — over 18, yes or no — and you disclosed a dossier. Every identity interaction built on documents has this shape: the evidence over-answers the question.",
          "A <strong>zero-knowledge proof</strong> is the cryptographic fix. It lets one party (the prover) convince another (the verifier) that a statement is true — \"this verified person is over 18\" — while revealing nothing beyond the truth of the statement itself. Not the birth date. Not the document. Nothing but the yes.",
        ],
      },
      {
        heading: "The intuition, no maths required",
        paragraphs: [
          "Imagine a locked circular cave with two entrances, A and B, connected deep inside by a door only you can open. To prove you hold the key without showing it, you go in through one entrance while a verifier waits outside. They then shout which entrance you must come out of. If you cannot open the door, you have a 50% chance of already being on the right side by luck. Repeat twenty times and luck runs out: only someone with the key could keep emerging correctly. The verifier is now certain you hold the key — yet has learned nothing about the key itself.",
          "Real zero-knowledge protocols replace the cave with mathematics, and the repeated challenges with equations that would be unsatisfiable unless the hidden value truly has the claimed property. The essential trick is the same: the proof demonstrates a consequence of the secret, never the secret.",
          "Three properties make a proof \"zero-knowledge\" in the formal sense. <strong>Completeness</strong>: if the statement is true, an honest prover always convinces the verifier. <strong>Soundness</strong>: if it is false, no cheating prover can convince them except with negligible luck. <strong>Zero-knowledge</strong>: the verifier learns nothing they could not have computed on their own — the transcript of the proof is, informationally, worthless to anyone else.",
        ],
      },
      {
        heading: "Where the wallet uses them",
        paragraphs: [
          "The VEID layer that powers the <a href=\"/wallet\">Identity Wallet</a> ships zero-knowledge circuits for the questions services most commonly over-collect on. Each circuit takes private inputs that never leave your control, checks them against a commitment anchored at verification time, and produces a proof the service can verify mathematically.",
        ],
        list: [
          "Age range — proves your age is at or above a threshold (over 18, over 21) from your verified date of birth, without revealing the date itself.",
          "Residency — proves your verified address is in a given country, without revealing the address.",
          "Score range — proves your verification score exceeds a threshold a service requires, without revealing the exact score.",
        ],
      },
      {
        heading: "What this changes in practice",
        paragraphs: [
          "For you, proofs mean the everyday absurdity ends: an age-gated service gets a yes, and <a href=\"/help/proving-your-age-without-your-documents\">your birth date stays yours</a>. For services, proofs are better evidence, not just kinder evidence — a cryptographic verification is harder to fake than a document photo and easier to check than a human judgement, and it leaves the service holding nothing breachable. The catalogue of <a href=\"/wallet/credentials\">what each proof demonstrates and what it never reveals</a> is published as part of the service.",
          "There is one honest caveat. A proof binds to the moment and the question; it does not stop a service asking for more than it needs through other channels. That is a consent problem rather than a cryptography problem, and it is why proofs sit inside a <a href=\"/insights/consent-as-infrastructure\">consent framework</a> where every request states its purpose and every grant is revocable.",
        ],
        callout: {
          tone: "info",
          text: "Rule of thumb: if a service's question can be answered yes/no, a zero-knowledge proof can answer it without disclosure. Ask why any service still needs the underlying document.",
        },
      },
      {
        heading: "Why this matters beyond identity",
        paragraphs: [
          "Zero-knowledge proofs invert an assumption baked into the information age: that verifying something requires seeing it. Once verification and disclosure are separated, whole categories of data hoarding lose their justification. Identity is the sharpest application because the data is the most dangerous to hoard — but the underlying principle, prove the property and keep the data, is one of the few genuinely new tools privacy has gained in decades. The wallet exists to make it ordinary.",
        ],
      },
    ],
    related: ["verification-tiers-and-proportionality", "consent-as-infrastructure", "self-sovereign-identity-vs-federated-login"],
  },
  {
    slug: "self-sovereign-identity-vs-federated-login",
    title: "Self-sovereign identity vs federated login",
    topic: "Architecture",
    summary:
      "\"Sign in with a platform\" made identity convenient by making it someone else's asset. What self-sovereign identity changes — and what it honestly costs.",
    updated: "2026-08-03",
    sections: [
      {
        paragraphs: [
          "Most people's working digital identity today is a federated login: an account with a large platform, reused to sign in everywhere else. Federation solved a real problem — hundreds of passwords — and it solved it well. But it solved it by making one company the operator of your identity, and that arrangement has consequences that only become visible when something goes wrong.",
          "The alternative gathering momentum across standards bodies and open-source projects is <strong>self-sovereign identity</strong> (SSI): an architecture in which you hold your own credentials in a wallet you control, and prove things to services directly, without an identity provider sitting in the middle of every interaction. The Identity Wallet is an implementation of this idea. Comparing the two models honestly — including SSI's real costs — is the best way to understand why the shift matters.",
        ],
      },
      {
        heading: "What federation actually is",
        paragraphs: [
          "When you \"sign in with\" a platform, three things happen. The platform authenticates you against its records; it tells the service who you are (as an identifier it controls); and it logs the interaction. Multiply by everything you sign into and the platform holds a continuously updated map of your digital life — every service, every session — as a by-product of authentication.",
          "The failure modes follow from the structure. Your account is suspended, mistakenly or otherwise — every dependent login dies with it, with appeal processes designed for scale rather than justice. The provider is breached or compelled — the map of your logins is exposed in one place. The provider changes terms, pricing or existence — every dependent service and user absorbs the change. None of this requires bad faith; it is what happens when identity is an asset on someone else's balance sheet.",
        ],
      },
      {
        heading: "What self-sovereign identity changes",
        list: [
          "Custody: credentials live in your wallet — on your device, encrypted — not in a provider's account store. There is no account to suspend.",
          "Disclosure: you present a credential or a zero-knowledge proof directly to the service. No third party learns where you signed in, because no third party is in the loop.",
          "Verification: services check cryptographic signatures against a decentralised registry, not by calling a provider's API. Trust flows from mathematics and auditable code, not from a company's uptime.",
          "Revocation and consent: every sharing decision is explicit, purposed, and revocable in your consent record — not buried in a platform's privacy dashboard.",
        ],
        paragraphs: [
          "In the wallet's implementation, the anchor is the VirtEngine network rather than a company: verification results and consent records are held on a chain no single party administers, evidence stays <a href=\"/wallet/security\">encrypted under your keys</a>, and the <a href=\"/wallet/credentials\">credentials you present</a> reveal only what each interaction needs. The <a href=\"/insights/why-centralized-identity-databases-fail\">honeypot analysis</a> explains why removing the central operator is a security feature, not just a governance preference.",
        ],
      },
      {
        heading: "The honest costs",
        paragraphs: [
          "SSI moves responsibility to the edges, and that is not free. Key management becomes your problem: a wallet is only as recoverable as its design allows, which is why <a href=\"/get-started/lost-or-new-device\">device loss and recovery</a> deserve first-class treatment rather than fine print. Adoption is a network problem: a credential is useful where it is accepted, and acceptance builds service by service. And the user experience must reach parity with \"click the button\" federation, or convenience will keep winning — as it always does.",
          "It is also fair to say the ecosystem is young. This service describes its own maturity plainly — the wallet is <a href=\"/about/open-source\">open-source reference infrastructure</a>, not a finished consumer product with app-store listings — because an identity system that oversells itself has already failed at its one job.",
        ],
        callout: {
          tone: "info",
          text: "The test that matters: who can lock you out? In federation, the provider can. In self-sovereign identity, losing access is something that can happen to you, but not something that can be done to you.",
        },
      },
      {
        heading: "Not a purity contest",
        paragraphs: [
          "The practical future is plural: federated login will persist where its convenience outweighs its risks, and wallet-based credentials will take over where the stakes are high — age, identity, financial standing, professional qualification. The important thing is that the high-stakes path exists at all: that when a service needs to know something real about you, there is a way to prove it that does not create an account someone else controls or an archive someone else can lose. Building that path, openly and verifiably, is what <a href=\"/wallet\">this service</a> is for.",
        ],
      },
    ],
    related: ["why-centralized-identity-databases-fail", "consent-as-infrastructure", "zero-knowledge-proofs-explained"],
  },
  {
    slug: "biometrics-on-device-vs-in-the-cloud",
    title: "Biometrics: on-device vs in the cloud",
    topic: "Architecture",
    summary:
      "Where a biometric is processed matters more than how accurate it is. Why on-device capture inside secure hardware is categorically safer than cloud matching — and where the network still plays a role.",
    updated: "2026-08-03",
    sections: [
      {
        paragraphs: [
          "Two systems can both say \"we verify your fingerprint\" and be profoundly different. In one, your fingerprint is read by a sensor, matched inside a secure chip on your device, and the only thing that ever leaves is a signed \"matched\" message. In the other, an image of your fingerprint is uploaded to a server, matched against a database of stored templates, and retained. Same sentence in the marketing; opposite risk profiles in reality.",
          "The difference matters because biometrics break the most basic rule of credentials: they cannot be changed. A password caught in a breach is rotated; your face and fingerprints are yours for life. Any architecture that accumulates biometric material is accumulating unrevocable risk — so the central design question is not accuracy, but <strong>where the biometric lives and travels</strong>.",
        ],
      },
      {
        heading: "What \"on-device\" actually means",
        paragraphs: [
          "Modern phones contain a separated secure environment — Apple's Secure Enclave, Android's hardware-backed Keystore and equivalents — that the main operating system cannot read into. When biometric capture happens \"on device\" in the strong sense, the sensor hands its reading to this environment; the template is created, stored and matched inside it; and applications receive only the verdict. Even a fully compromised operating system sees results, not biometrics.",
          "Templates deserve a note of their own: a template is a mathematical summary derived from a biometric, not a photograph. Good systems store only templates, and treat even templates as sensitive — because \"cannot easily be reversed into an image\" is an engineering claim, not a law of nature, and the safe assumption is that leaked templates are harmful.",
        ],
      },
      {
        heading: "Why cloud matching concentrates risk",
        list: [
          "It builds the honeypot: a server that matches biometrics must hold templates for everyone, in one place, indefinitely — the exact structure the honeypot analysis warns against.",
          "It moves data through more hands: every upload transits networks, load balancers, logs and backups, each a place where \"we don't retain images\" can quietly fail.",
          "It invites function creep: a database built for verification can be queried for search — matching one template against everyone — which is a surveillance capability, not a security one.",
          "It centralises compulsion: whoever can compel the operator inherits the database. On-device biometrics give a compelled party nothing to hand over.",
        ],
      },
      {
        heading: "How the wallet draws the line",
        paragraphs: [
          "The <a href=\"/wallet/mobile-wallet\">wallet capture app</a> keeps the biometric pipeline at the edge. Fingerprint and iris capture at higher verification levels happens through the platform's secure hardware APIs; liveness processing runs during capture on the phone; and everything that leaves the device is <a href=\"/help/how-your-biometrics-are-protected\">encrypted before transmission</a> using envelope encryption (X25519-XSalsa20-Poly1305), with device integrity attested via Play Integrity or App Attest.",
          "The network's role is verification and record-keeping, not browsing: encrypted payloads are held in a vault the chain references but cannot read, verification produces signed results, and services receive <a href=\"/help/who-can-see-your-data\">outcomes — never templates, never images</a>. The commitments are structural and published: biometric data is never sold or traded regardless of consent, never shared raw with services, never stored unencrypted on-chain, and always optional.",
        ],
        callout: {
          tone: "success",
          text: "The one-line test for any biometric product: \"if your servers were fully breached tomorrow, what biometric material would the attacker hold?\" The only comfortable answer is: none, or ciphertext without keys.",
        },
      },
      {
        heading: "Trade-offs, stated honestly",
        paragraphs: [
          "On-device processing has real limits. It depends on device hardware quality, which varies; it makes cross-device recovery more involved, since templates do not follow you to a new phone — you <a href=\"/get-started/lost-or-new-device\">re-verify on new hardware</a> instead; and fraud systems lose the (genuinely useful, genuinely dangerous) ability to search across enrolments. The wallet accepts these costs deliberately: the alternative capabilities are exactly the ones that turn a verification system into a surveillance system.",
          "When you evaluate any identity product — including this one — ask where capture happens, where matching happens, what leaves the device, and what the operator could produce under compulsion. The answers separate systems that use biometrics from systems that collect them.",
        ],
      },
    ],
    related: ["deepfakes-and-identity-verification", "why-centralized-identity-databases-fail", "what-is-digital-likeness"],
  },
  {
    slug: "consent-as-infrastructure",
    title: "Consent as infrastructure",
    topic: "Rights and consent",
    summary:
      "Consent that lives in a policy document is decoration. Consent that lives in the protocol — scoped, purposed, expiring, revocable, auditable — is infrastructure. The difference decides who your data works for.",
    updated: "2026-08-03",
    sections: [
      {
        paragraphs: [
          "Everyone who uses the internet has performed the ritual: scroll, tick \"I agree\", continue. What was agreed to, nobody knows — the document was written to be enforceable, not readable, and the choice was fictional because the alternative was exclusion. This is consent as <strong>decoration</strong>: legally load-bearing, practically meaningless, and structurally incapable of restraining anything, because the system it decorates would work identically without it.",
          "There is another way to build it. Consent becomes <strong>infrastructure</strong> when it is enforced by the same machinery that moves the data — when a processing request without a valid, matching, unexpired consent does not merely breach a policy but simply does not execute. That is the design standard the VirtEngine consent framework implements, and it changes what consent is.",
        ],
      },
      {
        heading: "The anatomy of a real consent",
        paragraphs: [
          "For consent to be enforceable by machinery, it has to be specific enough for machinery to check. In the wallet's framework, every consent is an on-chain record with structure:",
        ],
        list: [
          "A scope — the data category it covers: biometric data (veid.biometric), document data (veid.document), basic details (veid.basic), verification history, trust score, and so on. Scopes are consented separately; agreeing to one grants nothing about another.",
          "A purpose — stated in the request and shown to you in plain language before you approve. A consent granted for age verification does not authorise marketing analysis.",
          "An optional service binding — consent can be granted to one specific service rather than generally, so removing one service's access does not disturb the rest.",
          "An expiry — consents can be time-limited and lapse on their own; nothing is forever by default.",
          "A revocation path — every grant can be withdrawn at any time, and revocation stops all future processing for that scope.",
        ],
      },
      {
        heading: "Auditability closes the loop",
        paragraphs: [
          "Infrastructure-grade consent leaves evidence. Every grant and every revocation is recorded with a timestamp in an auditable history — so \"was this processing permitted at that moment?\" has a checkable answer, and a dispute is a lookup rather than a memory contest. Your wallet shows you the full history; services see only their own grants. The <a href=\"/help/revoking-consent\">revoking consent</a> guide walks through what the record looks like from your side.",
          "Honesty requires stating the limits too. Revocation stops future processing; it does not un-ring bells. A service that lawfully received an answer while consent stood keeps that historical answer. And some records — those under legal retention rules — enter a deletion schedule rather than vanishing instantly. Systems that promise instant universal erasure are describing physics that does not exist; what a well-built system promises is that revocation is immediate in effect, recorded in evidence, and honoured in every future request.",
        ],
        callout: {
          tone: "info",
          text: "A consent you cannot revoke is not consent — it is a signature on a surrender. Revocability is what separates permission from resignation.",
        },
      },
      {
        heading: "Why services should want this",
        paragraphs: [
          "Counterintuitively, infrastructure-grade consent is a gift to honest services. It converts compliance from an interpretive exercise into a protocol property: the service can demonstrate, from records it does not control and cannot alter, exactly what it was permitted to process and when. The rules a verifier signs up to — stated purposes, minimum necessary data, respected revocation — are published in the <a href=\"/for-services/become-a-verifier\">verifier onboarding path</a>, and they price honest behaviour lower than dishonest behaviour, which is the only kind of rule that reliably holds.",
          "For individuals, the practical experience is the one shown throughout <a href=\"/how-it-works\">how it works</a>: every request names the asker, the data and the purpose; you approve or decline; approvals expire; and the whole ledger of your decisions is <a href=\"/help/using-your-wallet-with-a-service\">yours to inspect</a>. Consent as infrastructure does not make data sharing rare — it makes it deliberate.",
        ],
      },
      {
        heading: "The bigger claim",
        paragraphs: [
          "Data systems inherit the values of their plumbing. When consent is decoration, data flows by default and permission is retrofitted; when consent is infrastructure, permission is the pipe and everything else is a request. Building the second kind is slower and harder, which is why it is rare — and why the constitution of the foundation stewarding this service treats <a href=\"/insights/digital-identity-and-human-rights\">autonomy as a design requirement</a> rather than a settings page.",
        ],
      },
    ],
    related: ["digital-identity-and-human-rights", "verification-tiers-and-proportionality", "zero-knowledge-proofs-explained"],
  },
  {
    slug: "verification-tiers-and-proportionality",
    title: "Verification tiers and proportionality",
    topic: "Rights and consent",
    summary:
      "Not every action deserves a passport check. How tiered verification puts data minimisation into practice: evidence proportionate to risk, and no service able to over-ask by default.",
    updated: "2026-08-03",
    sections: [
      {
        paragraphs: [
          "A forum account and a validator role on a financial network do not carry the same risk, so they should not demand the same evidence. That intuition — obvious in the physical world, where a bar checks ID but does not fingerprint you — is routinely ignored online, where services default to collecting the maximum because collecting is cheap and asking twice is annoying. The result is the familiar pathology: photocopies of passports held by businesses that needed to know one thing about you.",
          "<strong>Proportionality</strong> is the design principle that fixes this: the intrusiveness of verification should match the risk of the action it protects. Tiered verification is proportionality made mechanical — a ladder of assurance levels, each backed by defined evidence, so that every service can ask for exactly the rung its risk requires and no more.",
        ],
      },
      {
        heading: "The ladder",
        paragraphs: [
          "The <a href=\"/get-started/verification-levels\">wallet's four levels</a> make the trade explicit. <strong>Unverified</strong> is the starting state — a wallet with no checks, fine for browsing. <strong>Basic</strong> reflects early checks: enough for low-risk activity where a service needs some confidence a real person is present. <strong>Standard</strong> — a verified government document plus a selfie under active liveness — is the workhorse level most services should target. <strong>Trusted</strong> adds hardware-backed biometrics, device integrity attestation and sustained history, and exists for genuinely sensitive roles such as validator onboarding.",
          "Under the hood, the network computes a <a href=\"/help/understanding-your-veid-score\">composite score</a> from verification signals, and tiers are score bands — which means a tier is a summary the service can rely on without ever seeing the signals beneath it. The tier is the disclosure; the evidence stays put.",
        ],
      },
      {
        heading: "Proportionality as a two-sided contract",
        list: [
          "For individuals: you invest effort and disclosure only when something actually warrants it. Nobody re-scans a passport to read a forum, and the decision to climb a tier is yours, made when a real action requires it.",
          "For services: asking for the minimum is the default path, because requests are structured around required tiers and specific proofs rather than free-form data collection. Over-asking becomes a visible, deliberate act — and one users can see and decline.",
          "For the network: eligibility checks are mechanical. An offering that requires Standard checks the tier; the marketplace approves or declines the action. Risk policy becomes code rather than judgement calls.",
        ],
        callout: {
          tone: "info",
          text: "Data minimisation, made practical: the cheapest way to protect data you don't need is to never receive it. Tiers make \"don't receive it\" the path of least resistance.",
        },
      },
      {
        heading: "Answering the objections",
        paragraphs: [
          "\"Why not just verify everyone to the maximum once and be done?\" Because evidence collected is risk created — for the person and the system — and because maximal verification imposes maximal friction on people who may lack the documents, the hardware or the ability to complete it. Proportionality is also an accessibility principle: every rung of assurance that risk does not require is a barrier someone did not have to face.",
          "\"Won't services just demand Trusted for everything anyway?\" Some will try; structure pushes back. Requests display the demanded level to the user, who can see when a chat service demands validator-grade assurance and take their custom elsewhere. The <a href=\"/for-services\">guidance for services</a> is blunt about this: over-asking erodes trust and adds nothing, and the network's own <a href=\"/wallet/verify-on-virtengine\">tier-gated actions</a> model the right behaviour — higher requirements only where the stakes rise.",
          "\"Is a tier enough for a service to trust?\" A tier is a compressed statement of evidence, published with its definition: what each level requires is <a href=\"/get-started/verification-levels\">documented</a>, the scoring model is open source, and the result arrives cryptographically. That is a stronger basis than a service's own glance at an uploaded document — which, in the synthetic era, is <a href=\"/insights/ai-generated-fraud-and-fake-ids\">no basis at all</a>.",
        ],
      },
      {
        heading: "Proportionality is a habit",
        paragraphs: [
          "The deepest value of tiers is cultural: they keep the question \"how much do we actually need to know?\" alive in every integration, every design review, every request a user sees. Systems that stop asking that question drift toward maximum collection, because nothing in their structure resists it. A tiered, minimising, consent-bound architecture resists by default — and that, more than any single feature, is what makes an identity system trustworthy over decades rather than quarters.",
        ],
      },
    ],
    related: ["zero-knowledge-proofs-explained", "consent-as-infrastructure", "digital-identity-and-human-rights"],
  },
  {
    slug: "digital-identity-and-human-rights",
    title: "Digital identity and human rights",
    topic: "Rights and consent",
    summary:
      "Identity systems distribute power. Why privacy, dignity, autonomy, equal access and protection from surveillance are engineering requirements — and how a constitution can bind a technology to them.",
    updated: "2026-08-03",
    featured: false,
    sections: [
      {
        paragraphs: [
          "An identity system decides who can prove who they are, to whom, at what cost, under whose observation. Those are questions about power before they are questions about technology — which is why the design of identity infrastructure is a human-rights subject, whether or not its designers think in those terms. A system can make privacy the default or the exception; it can make participation universal or conditional; it can make surveillance impossible or merely impolite.",
          "The service this site documents is stewarded by DETIO FOUNDATION LTD, whose constitution names the commitment directly. Clause 6.1.3 establishes, as a charitable purpose of the company, \"promoting and protecting human rights, including privacy, dignity, autonomy, equality of access, and protection from unlawful surveillance, coercion, discrimination, and private capture of essential digital infrastructure.\" This article unpacks what each of those words demands from an identity system — and what it looks like when they are engineered rather than promised.",
        ],
      },
      {
        heading: "Privacy: the right to be unobserved by default",
        paragraphs: [
          "In identity systems, privacy is decided by architecture, not policy. A system that routes every authentication through a central observer produces a life-log of everyone's interactions as exhaust; no privacy policy can un-produce it. Engineering privacy means the observer never exists: evidence <a href=\"/wallet/security\">encrypted on your device</a>, services receiving <a href=\"/insights/zero-knowledge-proofs-explained\">proofs rather than data</a>, no central party in the presentation loop. Privacy achieved this way needs no one's ongoing good behaviour — which is the only kind of privacy that survives changes of management.",
        ],
      },
      {
        heading: "Dignity and autonomy: the person is not a record",
        paragraphs: [
          "Dignity in identity means the system serves the person's account of their own life, not an administrator's. Concretely: you see everything held about you; you correct errors through <a href=\"/help/updating-your-details\">re-verification you control</a>; you are not silently scored or flagged by processes you cannot inspect; and you can <a href=\"/help/deleting-your-identity\">leave entirely</a>, with deletion that is real because encryption keys are destroyed. Autonomy is the active form of the same value: participation is voluntary, every disclosure is a <a href=\"/insights/consent-as-infrastructure\">consented, purposed, revocable act</a>, and refusing to verify costs you only what genuinely requires verification — nothing is bundled.",
          "These sound like product features. They are rights implementations. The difference shows at the edge cases: a feature can be deprecated when inconvenient; a constitutional purpose binds the steward even when honouring it costs something.",
        ],
      },
      {
        heading: "Equality of access: infrastructure must not select its users",
        paragraphs: [
          "An identity system that becomes essential and then excludes people — by device requirements, cost, disability, or documentation status — converts inequality into digital law. Engineering equal access means tiering requirements so that <a href=\"/insights/verification-tiers-and-proportionality\">low-risk participation demands little</a>, meeting accessibility standards as an obligation rather than a roadmap item, keeping the software free and open source so cost never gates identity, and being honest that document-based verification inherits the unequal distribution of documents — a limit this service <a href=\"/accessibility\">states rather than hides</a>.",
        ],
        callout: {
          tone: "info",
          text: "Clause 6.1.3 names \"private capture of essential digital infrastructure\" alongside surveillance and coercion — the constitution treats a monopoly over identity as a rights harm in itself, not merely a market failure.",
        },
      },
      {
        heading: "Protection from surveillance and capture: structure, not promises",
        paragraphs: [
          "The constitution's most distinctive move is recognising that the gravest threats to identity rights are structural: mass observation, and control of essential infrastructure falling into hands that can price, condition or weaponise it. The engineering responses are the ones this site documents throughout — <a href=\"/insights/why-centralized-identity-databases-fail\">no central database to search or seize</a>, biometrics processed <a href=\"/insights/biometrics-on-device-vs-in-the-cloud\">at the edge</a>, records distributed across a network no party administers alone.",
          "The governance responses live in the foundation itself: a not-for-profit public company limited by guarantee, a public-benefit lock over assets and intellectual property, no dividends, and winding-up provisions that pass everything to another public-benefit entity. The <a href=\"/about/who-runs-it\">patent over the verification method</a> is held inside that structure — meaning the legal instrument that could have fenced the technology off instead anchors it to public purpose.",
        ],
      },
      {
        heading: "Why write rights into a constitution?",
        paragraphs: [
          "Because intentions do not survive incentives, and technology outlives its founders. Every identity system starts with good intentions; the ones that end badly are the ones whose structures permitted it. A constitutional purpose clause, protected provisions, and a steward legally incapable of private capture are attempts to make the good outcome structurally cheaper than the bad one — to give the values a legal existence independent of whoever holds office. Whether that succeeds is a question decades will answer; that it is attempted, in public, in binding form, is what distinguishes infrastructure built for rights from infrastructure that merely mentions them.",
        ],
      },
    ],
    related: ["consent-as-infrastructure", "why-centralized-identity-databases-fail", "verification-tiers-and-proportionality"],
  },
  {
    slug: "the-economics-of-identity-fraud",
    title: "The economics of identity fraud",
    topic: "Economics",
    summary:
      "Identity fraud persists because its economics work: cheap to attempt, scalable, hard to attribute. A qualitative tour of the incentive structure — and how verification changes the maths.",
    updated: "2026-08-03",
    sections: [
      {
        paragraphs: [
          "Identity fraud is best understood not as a crime that happens but as a business that operates. It has inputs (stolen or synthesised identity data), production processes (account opening, credential stuffing, mule recruitment), distribution (marketplaces for compromised data and accounts), and margins. Like any business, it expands where returns exceed costs and contracts where they do not. That framing matters because it locates the fix: you do not end a business by disapproving of it — you end it by breaking its unit economics.",
          "This article stays deliberately qualitative. The structure of the incentives is stable and well understood, even as specific figures shift and estimates vary; it is the structure a defender can act on.",
        ],
      },
      {
        heading: "Why the attacker's costs are low",
        list: [
          "The raw material is abundant. Decades of breaches have put identity data into circulation, and it does not expire the way stolen cards do — a birth date is valid forever. Every new archive breached adds permanent supply.",
          "Attempts scale and failures are nearly free. Automated onboarding lets one operator submit thousands of applications; each rejection costs fractions of a cent and teaches the attacker which checks exist.",
          "Synthesis removed the last craft barrier. Where fraud once needed a stolen identity, generated faces and document images let it manufacture identities that belong to no one — synthetic identity fraud — with no victim to notice or report.",
          "Attribution is weak. Cross-border operation, layered infrastructure, and the gap between the fraud event and its discovery mean consequences are rare relative to attempts.",
        ],
      },
      {
        heading: "Why the defender's costs are high — and misallocated",
        paragraphs: [
          "Defence pays for review teams, detection systems, compliance obligations and customer friction — and, critically, defenders bear the cost of their own defences' failure. When a service's document-upload check is fooled, the service eats the loss, the person impersonated eats the recovery ordeal, and the check's vendor eats nothing. Worse, the standard defensive reflex — collect more evidence, store more copies — manufactures the breach inventory that supplies the next round of fraud. The conventional posture is not just losing; it is subsidising the other side, a dynamic the <a href=\"/insights/why-centralized-identity-databases-fail\">honeypot analysis</a> traces in detail.",
          "Friction is the hidden line item. Every extra check imposed on all users to catch the fraudulent few is a tax on the legitimate economy — abandoned signups, excluded customers, support load. Fraud's cost is not only what is stolen; it is what defence makes everyone else pay.",
        ],
        callout: {
          tone: "warning",
          text: "The perverse loop of document-based defence: fraud drives collection, collection creates archives, archives get breached, breaches supply fraud. Any real fix must exit the loop, not accelerate it.",
        },
      },
      {
        heading: "How strong verification rewrites the ledger",
        paragraphs: [
          "The economic purpose of the verification stack this service documents is to invert the cost asymmetry at each step. <a href=\"/get-started/set-up-your-wallet\">Liveness challenges</a> break automation: attempts stop scaling when each requires a live human performance. <a href=\"/wallet/mobile-wallet\">Device attestation</a> breaks the tooling: emulators and instrumented apps — the fraud factory's machinery — fail integrity checks. Hardware biometrics at the <a href=\"/get-started/verification-levels\">Trusted tier</a> push the marginal cost of one fake identity from cents toward defeating physical silicon. And <a href=\"/help/understanding-your-veid-score\">composite scoring</a> means no single bypass flips the outcome — the attacker must beat every layer at once, consistently.",
          "Reuse changes the defender's side of the ledger too. Verify once under hard conditions, then present <a href=\"/wallet/credentials\">cryptographic results</a> everywhere: each relying service gets assurance without running its own gauntlet, honest users face the friction once, and — because services hold <a href=\"/help/who-can-see-your-data\">answers rather than documents</a> — the breach inventory that funds future fraud is never restocked. Fraud does not need to become impossible; it needs to become a bad business. Raising the cost per attempt while cutting off the raw-material supply does both.",
        ],
      },
      {
        heading: "The honest residual",
        paragraphs: [
          "No economic analysis should promise victory. Determined, well-resourced fraud will probe every layer; coercion and insider abuse operate outside the technical ledger entirely; and any system's guarantees are only as good as its implementation — which is why this one is <a href=\"/about/open-source\">open to inspection</a>. What the economics support is a more modest, more durable claim: architectures that never accumulate evidence, price attempts in human effort and attested hardware, and let verification be reused instead of repeated, make identity fraud a structurally worse business than the one running today. That is the standard against which any identity system — including this one — should be judged.",
        ],
      },
    ],
    related: ["ai-generated-fraud-and-fake-ids", "why-centralized-identity-databases-fail", "identity-in-the-synthetic-era"],
  },
];

export function getInsight(slug: string): InsightArticle | undefined {
  return INSIGHT_ARTICLES.find((a) => a.slug === slug);
}

export const INSIGHT_TOPICS: InsightTopic[] = [
  "Synthetic media",
  "Fraud",
  "Architecture",
  "Cryptography",
  "Rights and consent",
  "Economics",
];

export const FEATURED_INSIGHTS = INSIGHT_ARTICLES.filter((a) => a.featured).slice(0, 3);
