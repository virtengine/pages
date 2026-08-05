/**
 * Help-centre articles. Content is grounded in:
 * - repos/virtengine/CONSENT_FRAMEWORK.md (scopes, grant/revoke lifecycle)
 * - repos/virtengine/BIOMETRIC_DATA_ADDENDUM.md (retention, deletion, breach)
 * - repos/virtengine/PRIVACY_POLICY.md (what is collected, retention table)
 * - repos/virtengine/docs/veid/biometric-hardware-attestation.md
 * - repos/virtengine/mobile/veid-capture-app/README.md (capture flow)
 */

export type HelpCategory =
  | "Your data and privacy"
  | "Using your wallet"
  | "Security"
  | "Support";

export interface HelpSection {
  heading?: string;
  paragraphs?: string[];
  list?: string[];
  callout?: { tone: "info" | "warning" | "success"; text: string };
  /** Optional visual embedded after the section body. */
  embed?: "lifecycle";
}

export interface HelpArticle {
  slug: string;
  title: string;
  summary: string;
  category: HelpCategory;
  updated: string;
  sections: HelpSection[];
  related: string[];
}

export const HELP_ARTICLES: HelpArticle[] = [
  {
    slug: "updating-your-details",
    title: "Updating your details",
    summary:
      "What to do when your name, address or identity document changes, and what happens to your verification level.",
    category: "Using your wallet",
    updated: "2026-07-20",
    sections: [
      {
        paragraphs: [
          "Your Identity Wallet holds verified claims about you — your name, date of birth and other details read from your identity document during verification. When something changes in real life, you update it by verifying again with the new evidence, not by editing a profile field.",
          "This is deliberate. Because every claim in your wallet was checked against evidence, a service that relies on your wallet can trust that no one — including you — has quietly changed a verified value.",
        ],
      },
      {
        heading: "When your identity document changes",
        paragraphs: [
          "If you renew your passport, get a new driver licence, or your document details change (for example after a legal name change), run the document verification flow again in the wallet app with the new document.",
        ],
        list: [
          "Open the wallet app and choose to re-verify your identity document.",
          "Scan the front and back of the new document when prompted.",
          "Complete the selfie and liveness check so the network can confirm the new document belongs to you.",
          "Review what was read from the document before anything is submitted.",
        ],
      },
      {
        heading: "What happens to your verification level",
        paragraphs: [
          "Your verification level is recalculated whenever verification evidence changes. Re-verifying with a valid new document normally keeps you at the same level. If a document expires and you have not re-verified, services may treat the related claims as stale until you do.",
        ],
        callout: {
          tone: "info",
          text: "Re-verification is always consented separately. The wallet never re-runs checks in the background without asking you first.",
        },
      },
      {
        heading: "Details you can correct without re-verifying",
        paragraphs: [
          "Contact preferences and device settings live only on your phone and can be changed at any time in the app. Anything that a service could rely on as a verified fact requires fresh evidence.",
          "If verification read a field from your document incorrectly (for example an OCR mistake in your address), re-submit the document capture. You review every extracted field before submission, so errors can be caught at that step.",
        ],
      },
    ],
    related: ["deleting-your-identity", "revoking-consent", "lost-or-new-device-summary"],
  },
  {
    slug: "revoking-consent",
    title: "Revoking consent",
    summary:
      "How to withdraw consent for any category of your data, what happens next, and the limits you should know about.",
    category: "Your data and privacy",
    updated: "2026-07-20",
    sections: [
      {
        paragraphs: [
          "Every use of your identity data is tied to a consent you granted — for a specific category of data (called a scope), for a specific purpose, and optionally for a specific service. You can withdraw any of those consents at any time, and withdrawal takes effect for all future processing.",
        ],
      },
      {
        heading: "What you can revoke",
        list: [
          "Consent for a whole data category — for example all biometric processing (the veid.biometric scope) or document data (veid.document).",
          "Consent for a specific service — remove one service's access while keeping others.",
          "Consent for verification requests — stop services from asking the network to confirm your identity.",
          "Everything at once — close your wallet and request deletion.",
        ],
      },
      {
        heading: "How to revoke",
        paragraphs: [
          "In the wallet app, open the consent screen, choose the data category or service, and switch consent off. The revocation is recorded with a timestamp, so there is an auditable record that processing was no longer permitted after that moment.",
          "You can also revoke by emailing the data protection officer at dpo@virtengine.com — for biometric consent, use the subject line “Withdraw Biometric Consent”.",
        ],
      },
      {
        heading: "What happens after you revoke",
        list: [
          "Processing for that scope stops for all future requests.",
          "If you revoke biometric consent, your biometric verification status is withdrawn and the related data enters the deletion schedule.",
          "Services you previously shared results with lose the ability to request fresh confirmations.",
          "Your verification level may drop if it depended on the revoked scope.",
        ],
        callout: {
          tone: "warning",
          text: "Revoking consent is not retroactive punishment-proofing: a service that already received a verification result (for example, “over 18 — yes”) keeps that historical answer. Revocation stops future processing and sharing.",
        },
      },
      {
        heading: "Limits to know about",
        paragraphs: [
          "Some records cannot be erased instantly. Encrypted references recorded on the blockchain cannot be rewritten — instead, the encryption keys are destroyed, which makes the data permanently unreadable. Legal retention periods (such as anti-money-laundering rules) can also require some records to be kept for a fixed time before destruction.",
        ],
      },
    ],
    related: ["deleting-your-identity", "who-can-see-your-data", "how-your-biometrics-are-protected"],
  },
  {
    slug: "how-your-biometrics-are-protected",
    title: "How your biometrics are protected",
    summary:
      "The specific technical and policy protections applied to your face, fingerprint and iris data — and the promises that never change.",
    category: "Your data and privacy",
    updated: "2026-07-20",
    sections: [
      {
        paragraphs: [
          "Biometric data is the most sensitive information the Identity Wallet handles, and it is treated differently from everything else. The protections below come from the published Biometric Data Addendum that governs the system — they are commitments, not marketing.",
        ],
      },
      {
        heading: "Four promises that never change",
        list: [
          "Your biometric data is never sold, leased or traded — regardless of consent. It is never monetised.",
          "Raw biometric data is never shared with services. Services receive verification results — a level and a pass signal — never your face template or fingerprint.",
          "Biometric data is never stored unencrypted on the blockchain. Only encrypted references exist on-chain.",
          "Collection is optional. You choose whether to complete biometric verification, and you can withdraw at any time.",
        ],
      },
      {
        heading: "How the data is secured",
        paragraphs: [
          "Templates (the mathematical representations derived from your face or fingerprint — not photos) are encrypted on your device before they leave it, using X25519-XSalsa20-Poly1305 envelope encryption. In transit, everything travels over TLS 1.3. At rest, storage uses AES-256 with key rotation.",
          "Where your phone supports it, fingerprint and iris capture happens inside the device's secure hardware, and the platform's integrity attestation (Google Play Integrity or Apple App Attest) proves the app and device have not been tampered with.",
        ],
      },
      {
        heading: "Where verification actually runs",
        paragraphs: [
          "Scoring runs inside trusted processing units — hardware-sealed enclaves (AMD SEV-SNP, Intel SGX, AWS Nitro) that the chain checks by cryptographic fingerprint before any data enters. The decryption key is derived inside the hardware and never exists outside it, so no operator, provider or foundation staff member can look in. Raw data is destroyed when scoring ends; only the result — a score and tier — remains. The full explainer is at identity.org.au/privacy/trusted-processing.",
        ],
        embed: "lifecycle",
      },
      {
        heading: "How long biometric data is kept",
        list: [
          "While your account is active — used only for verification and fraud prevention.",
          "After you close your account — up to 3 years, to prevent fraudulent re-registration.",
          "Absolute maximum — 7 years from last use, driven by know-your-customer laws.",
          "On deletion — removed from active systems within 30 days of your request, then from backups within the backup rotation period (typically 90 days). Encryption keys are destroyed, which makes any remaining encrypted copies permanently unreadable.",
        ],
      },
      {
        heading: "If something goes wrong",
        paragraphs: [
          "If a data breach ever involved biometric data, affected people would be notified within 72 hours of discovery, with a plain description of what happened, what data was involved, and what support is available. See the data breach response article for the full process.",
        ],
        callout: {
          tone: "info",
          text: "You can request a copy of the biometric data held about you at any time by emailing dpo@virtengine.com with the subject “Biometric Data Access Request”. Responses are due within 30 days.",
        },
      },
    ],
    related: ["revoking-consent", "data-breach-response", "deleting-your-identity"],
  },
  {
    slug: "who-can-see-your-data",
    title: "Who can see your data",
    summary:
      "A plain-English map of exactly who can see what: you, the network, and the services you share with.",
    category: "Your data and privacy",
    updated: "2026-07-20",
    sections: [
      {
        paragraphs: [
          "The short answer: you see everything, services see almost nothing, and the network sees only encrypted material it cannot read.",
        ],
      },
      {
        heading: "What you can see",
        paragraphs: [
          "Everything. Your wallet shows every verified claim, every consent you have granted, every service you have shared with, and your verification history. You can export a copy of your data at any time.",
        ],
      },
      {
        heading: "What a service you share with can see",
        list: [
          "Your verification level (for example, Standard).",
          "The specific answer you agreed to share — for example “over 18: yes”, or a verified name if you explicitly consented to share it.",
          "A pass/fail verification result when it asks the network to confirm your identity — only if you consented to verification requests.",
        ],
        callout: {
          tone: "success",
          text: "Services never receive your document scans, your photos, your biometric templates, or data from any scope you did not consent to. This is enforced in the protocol, not just in policy.",
        },
      },
      {
        heading: "What the network (validators) can see",
        paragraphs: [
          "Validators — the independent computers that run the network — process encrypted payloads and record encrypted references and verification results. They can see that a verification event happened and its outcome, but the underlying documents and biometrics are encrypted with keys they do not hold for browsing. Machine-learning verification runs in controlled environments, and results, not raw inputs, are what get recorded.",
        ],
      },
      {
        heading: "What is public",
        paragraphs: [
          "Like any blockchain, the VirtEngine chain has public, permanent records: wallet addresses, transaction history, and encrypted scope references. None of your personal details, documents or biometrics are ever public. Someone looking at the chain sees that an address holds verified scopes — not who you are.",
        ],
      },
      {
        heading: "Who can never see your data",
        list: [
          "Advertisers and data brokers — your data is never sold or traded.",
          "Other users of the network.",
          "Services you have not consented to share with.",
          "identity.org.au itself — this website holds no user accounts and no personal data.",
        ],
      },
    ],
    related: ["how-your-biometrics-are-protected", "revoking-consent", "using-your-wallet-with-a-service"],
  },
  {
    slug: "using-your-wallet-with-a-service",
    title: "Using your wallet with a service",
    summary:
      "The step-by-step of what happens when a website or business asks you to prove something with your Identity Wallet.",
    category: "Using your wallet",
    updated: "2026-07-20",
    sections: [
      {
        paragraphs: [
          "When a participating service needs to know something about you — that you are a real, verified person, that you are over 18, or that your identity meets a certain level — it asks your wallet, and your wallet asks you.",
        ],
      },
      {
        heading: "What the flow looks like",
        list: [
          "The service tells your wallet what it is asking for and why — for example, “verification level Standard, to open an account”.",
          "Your wallet shows you the request in plain language: exactly which data or answer will be shared, with whom, and for what purpose.",
          "You approve or decline. Nothing is shared until you approve.",
          "If you approve, the wallet shares only the agreed answer — never the underlying documents.",
          "The consent is recorded, and you can see it (and revoke it) in your consent history at any time.",
        ],
      },
      {
        heading: "What the service receives",
        paragraphs: [
          "Services receive the minimum needed for their stated purpose: your verification level, and the specific answer you approved. For age checks, the network can produce a zero-knowledge proof — a cryptographic yes/no that proves the claim without revealing your birth date or your document.",
        ],
        callout: {
          tone: "info",
          text: "If a service asks for more than it needs — for example, requesting your full document scan — that request cannot be fulfilled through the wallet. The protocol only shares verification results and consented claims.",
        },
      },
      {
        heading: "Saying no",
        paragraphs: [
          "Declining a request costs you nothing within the wallet — there is no penalty, no score change, and no record shared with the service beyond the fact that the request was not fulfilled. A service may choose not to serve you without verification, the same way a venue can decline entry without ID.",
        ],
      },
      {
        heading: "Time-limited and service-specific consent",
        paragraphs: [
          "Consent can be scoped to a single service and given an expiry date — for example, 30 days. When it expires, the service loses access automatically, without you having to remember to revoke it.",
        ],
      },
    ],
    related: ["who-can-see-your-data", "proving-your-age-without-your-documents", "revoking-consent"],
  },
  {
    slug: "proving-your-age-without-your-documents",
    title: "Proving your age without your documents",
    summary:
      "How zero-knowledge proofs let you prove you are over 18 without showing your birth date, your licence, or anything else.",
    category: "Using your wallet",
    updated: "2026-07-20",
    sections: [
      {
        paragraphs: [
          "Showing a driver licence to prove you are over 18 reveals far more than your age: your name, address, licence number and birth date, handed to a stranger. Your Identity Wallet can answer the same question while revealing none of that.",
        ],
      },
      {
        heading: "How it works, in plain terms",
        paragraphs: [
          "During verification, the network confirmed your date of birth from your identity document. That verified fact stays encrypted. When a service asks “is this person over 18?”, the network produces a zero-knowledge proof — a piece of cryptography that proves the statement “this verified person's age is at least 18” is true, without exposing the age itself or any document.",
          "The service can check the proof is genuine and current. What it learns is exactly one bit of information: yes.",
        ],
      },
      {
        heading: "What the service sees",
        list: [
          "The answer to the question it asked — for example, over 18: yes.",
          "That the answer is backed by a network-verified identity at your verification level.",
          "Nothing else. Not your birth date, not your name, not your document.",
        ],
        callout: {
          tone: "success",
          text: "The same technique works for other threshold questions — proving your identity meets a required level, without revealing your verification history or score details.",
        },
      },
      {
        heading: "Why this matters",
        paragraphs: [
          "Every document copy held by a venue, website or app is a breach waiting to happen. Proof-based sharing means there is nothing on file to steal: the service holds a yes/no answer that is useless to an identity thief.",
        ],
      },
      {
        heading: "What you need",
        paragraphs: [
          "Age proofs require Standard verification or higher, because the network must have verified your date of birth from a real document. See verification levels in the get-started guide for what each level requires.",
        ],
      },
    ],
    related: ["using-your-wallet-with-a-service", "who-can-see-your-data", "how-your-biometrics-are-protected"],
  },
  {
    slug: "device-security-checklist",
    title: "Device security checklist",
    summary:
      "Practical steps to keep the phone that holds your Identity Wallet safe — most take under a minute.",
    category: "Security",
    updated: "2026-07-20",
    sections: [
      {
        paragraphs: [
          "Your wallet's security is anchored in your phone's secure hardware, but good device habits still matter. Work through this checklist — most items take less than a minute.",
        ],
      },
      {
        heading: "Essential",
        list: [
          "Set a screen lock — a PIN of 6+ digits, or fingerprint/face unlock. The wallet relies on your device lock as its first barrier.",
          "Keep your operating system updated. Install system updates when offered; they carry security fixes the wallet depends on.",
          "Install the wallet only from source you trust. The reference app is open source; there are no official app-store listings, so treat any store listing claiming to be this wallet as suspect.",
          "Turn on your platform's find-my-device feature so you can remotely lock or wipe a lost phone.",
        ],
      },
      {
        heading: "Strongly recommended",
        list: [
          "Use biometric unlock (fingerprint or face) where your device supports it — it is both more convenient and harder to shoulder-surf than a PIN.",
          "Avoid rooted or jailbroken devices. Device integrity attestation will fail on tampered devices, and Trusted-level verification will be unavailable.",
          "Review which apps have accessibility or screen-reading permissions — malicious apps abuse these to watch other apps.",
          "Keep a record of your recovery information somewhere safe and offline, in case your device is lost.",
        ],
      },
      {
        heading: "Things the wallet does for you",
        paragraphs: [
          "The wallet encrypts identity material on-device before anything is transmitted, uses your phone's hardware-backed keystore where available, and proves its own integrity to the network through Play Integrity (Android) or App Attest (iOS). A stolen phone with a locked screen exposes encrypted data only.",
        ],
        callout: {
          tone: "warning",
          text: "No one legitimate will ever ask you to read out codes from your wallet, approve a request you did not initiate, or install a remote-access app. If that happens, stop and read the scams article.",
        },
      },
    ],
    related: ["recognising-scams-and-phishing", "lost-or-new-device-summary", "how-your-biometrics-are-protected"],
  },
  {
    slug: "recognising-scams-and-phishing",
    title: "Recognising scams and phishing",
    summary:
      "The patterns scammers use against digital-identity users, and the habits that defeat them.",
    category: "Security",
    updated: "2026-07-20",
    sections: [
      {
        paragraphs: [
          "Scammers target people, not cryptography. The wallet's design removes the most valuable prizes — there is no central password to steal and no document vault to raid — so scams against wallet users rely on tricking you into approving things or revealing things. These are the patterns to recognise.",
        ],
      },
      {
        heading: "The approval push",
        paragraphs: [
          "You get a call, text or email creating urgency: “your identity is compromised, approve this verification now to secure it.” The goal is to make you approve a consent request the scammer initiated.",
        ],
        callout: {
          tone: "warning",
          text: "Only approve requests you started yourself, moments ago, in a service you are actively using. There is no legitimate reason for anyone to phone you and ask you to approve a wallet request.",
        },
      },
      {
        heading: "The fake wallet app",
        paragraphs: [
          "A copycat app or website imitates the wallet and asks you to “verify” by scanning your documents into it. The real wallet is open source and has no official app-store listing — treat any store listing or download link sent to you as hostile. Check sources against the official repository linked from this site's about section.",
        ],
      },
      {
        heading: "The impersonated service",
        paragraphs: [
          "A phishing email pretends to be a service you use and links to a lookalike site that asks you to connect your wallet. Before approving anything, check the request details your wallet shows you: the requesting service's identity is part of the consent screen. If the name does not match who you think you are dealing with, decline.",
        ],
      },
      {
        heading: "Habits that defeat all of these",
        list: [
          "Slow down. Urgency is the scammer's only real tool. Nothing about your identity requires action in the next five minutes.",
          "Read the consent screen. Your wallet states who is asking, for what, and why — every time.",
          "Never share your screen or read out codes while dealing with your identity.",
          "Remember what can never happen: no one from identity.org.au, DETIO Foundation or VirtEngine will ever contact you asking for approvals, codes, documents or remote access.",
          "Report attempts to Scamwatch (scamwatch.gov.au) and, for wallet-related phishing, to security@virtengine.com.",
        ],
      },
    ],
    related: ["device-security-checklist", "using-your-wallet-with-a-service", "data-breach-response"],
  },
  {
    slug: "children-and-digital-identity",
    title: "Children and digital identity",
    summary:
      "Why the Identity Wallet is for adults, what that means for families, and how age rules are enforced.",
    category: "Support",
    updated: "2026-07-20",
    sections: [
      {
        paragraphs: [
          "The Identity Wallet is designed for people aged 18 and over. This is a hard rule inherited from the terms that govern the underlying network, and it exists for good reasons: identity verification involves biometric data, and children's biometric data deserves stronger protection than any general-purpose system should ask for.",
        ],
      },
      {
        heading: "What this means in practice",
        list: [
          "You must be at least 18 (or the age of legal majority where you live, if higher) to set up a wallet.",
          "Verification requires a government-issued identity document, which acts as a practical age gate.",
          "No child-specific accounts, parental-consent flows or family wallets exist in the current system.",
        ],
      },
      {
        heading: "For parents and carers",
        paragraphs: [
          "If a child has used your documents to attempt verification, contact the data protection officer at dpo@virtengine.com so any collected data can be located and deleted. Deletion requests involving minors are prioritised.",
          "If you are teaching young people about digital identity, the concepts on this site — data minimisation, consent, proving without revealing — are good foundations, and the how-it-works section is written to be readable without technical background.",
        ],
        callout: {
          tone: "info",
          text: "One of the wallet's core benefits is relevant here: age checks through the wallet mean adults can prove they are adults without websites collecting everyone's documents — a privacy improvement for households generally.",
        },
      },
      {
        heading: "Looking ahead",
        paragraphs: [
          "Digital identity for minors raises design questions — guardianship, evolving capacity, the right to a clean slate at adulthood — that are active areas of policy research. Any future change in this area would go through the Foundation's public governance process before a line of code changed.",
        ],
      },
    ],
    related: ["proving-your-age-without-your-documents", "deleting-your-identity", "who-can-see-your-data"],
  },
  {
    slug: "accessibility-support",
    title: "Accessibility support",
    summary:
      "How the wallet and this website work with assistive technology, and how to get help or report a barrier.",
    category: "Support",
    updated: "2026-07-20",
    sections: [
      {
        paragraphs: [
          "Identity infrastructure that not everyone can use is not infrastructure. Accessibility is treated as a requirement, not an enhancement, across this website and the reference wallet app.",
        ],
      },
      {
        heading: "This website",
        list: [
          "Targets WCAG 2.2 level AA, with body text aiming for AAA contrast.",
          "Works fully with keyboard only — every page can be navigated without a mouse, with visible focus indicators throughout.",
          "Uses semantic landmarks and headings for screen-reader navigation, with a skip-to-content link on every page.",
          "Respects your motion preferences: with reduced motion enabled, animation is disabled.",
          "Requires no JavaScript for any content — every page works with scripts disabled.",
        ],
      },
      {
        heading: "The wallet app",
        paragraphs: [
          "The capture flow is built with guidance prompts for framing your document and face, and works with the platform screen readers (TalkBack on Android, VoiceOver on iOS). Liveness challenges — blink, turn your head, smile — include spoken guidance. If a particular challenge is not possible for you, the flow supports alternative checks; if you hit a barrier, we want to know.",
        ],
        callout: {
          tone: "info",
          text: "The full accessibility statement, including known limitations we are honest about, is published on the accessibility page of this site.",
        },
      },
      {
        heading: "Reporting a barrier",
        paragraphs: [
          "If any part of this website or the wallet does not work with your assistive technology, email hello@det.io with the subject “Accessibility”. Include what you were trying to do, the technology you use, and what happened. Accessibility reports are treated with the same seriousness as security reports.",
        ],
      },
    ],
    related: ["using-your-wallet-with-a-service", "device-security-checklist", "updating-your-details"],
  },
  {
    slug: "data-breach-response",
    title: "Data breach response",
    summary:
      "What would happen if a breach ever involved identity data: notification within 72 hours, plain-language disclosure, and support.",
    category: "Security",
    updated: "2026-07-20",
    sections: [
      {
        paragraphs: [
          "No honest system claims breaches are impossible. What a trustworthy system can promise is that a breach would be contained quickly, disclosed honestly, and would expose as little as possible in the first place. The wallet's architecture is built around that last point.",
        ],
      },
      {
        heading: "Why a breach here is different",
        paragraphs: [
          "There is no central vault of readable documents. Identity material is encrypted on your device before transmission; the network stores encrypted payloads and verification results. An attacker who compromised network storage would obtain ciphertext — unreadable without keys that are held separately and rotated. Services you shared with hold only verification answers, not documents.",
        ],
      },
      {
        heading: "The notification commitment",
        list: [
          "Affected people are notified within 72 hours of a breach being discovered and confirmed.",
          "Authorities are notified as required by law — in Australia, under the Notifiable Data Breaches scheme.",
          "The notice states plainly what happened, what categories of data were involved, how many people are affected, what has been done, and what support is available.",
          "Where biometric data is involved, remediation includes identity-theft protection support for affected people.",
        ],
      },
      {
        heading: "What happens internally",
        list: [
          "Immediate containment of the breach.",
          "Investigation and root-cause analysis.",
          "Key rotation and destruction where compromise is suspected — destroying keys renders encrypted data permanently unreadable.",
          "Public post-incident summary, because this is open infrastructure.",
        ],
      },
      {
        heading: "What you can do right now",
        paragraphs: [
          "The best time to limit breach damage is before one happens: grant consent narrowly, set expiry dates on service access, and revoke consents you no longer need. Data that was never shared cannot leak downstream.",
        ],
        callout: {
          tone: "info",
          text: "Suspected security issues can be reported to security@virtengine.com. Acknowledgement target is 48 hours; critical issues are triaged within 24.",
        },
      },
    ],
    related: ["how-your-biometrics-are-protected", "recognising-scams-and-phishing", "revoking-consent"],
  },
  {
    slug: "deleting-your-identity",
    title: "Deleting your identity",
    summary:
      "How to delete your identity data, exactly what gets removed on what timeline, and the honest limits of deletion on a blockchain.",
    category: "Your data and privacy",
    updated: "2026-07-20",
    sections: [
      {
        paragraphs: [
          "You can leave. Deleting your identity removes your biometric data, your documents and your verified claims from active systems, on a published timeline. This article explains the process honestly — including the parts that are genuinely hard on a blockchain.",
        ],
      },
      {
        heading: "How to request deletion",
        list: [
          "In the wallet app: use the delete-my-data function, or close your account (closure triggers the deletion schedule).",
          "By email: send a request to dpo@virtengine.com. For biometric data specifically, use the subject “Withdraw Biometric Consent”.",
        ],
      },
      {
        heading: "The deletion timeline",
        list: [
          "Within 30 days: data is deleted from active systems.",
          "Within the backup rotation period (typically 90 days): data ages out of backups.",
          "Encryption keys are destroyed — this is what makes deletion work for on-chain material.",
        ],
      },
      {
        heading: "The blockchain question, answered honestly",
        paragraphs: [
          "Records written to a blockchain cannot be erased — that permanence is what makes the network trustworthy. So the system never writes your personal data to the chain in readable form. What exists on-chain is encrypted references and verification results.",
          "Deletion destroys the encryption keys. The encrypted material remains on-chain forever, but it is permanently unreadable — cryptographically equivalent to shredded. What can never be removed is the bare public record that an address once held verified scopes.",
        ],
        callout: {
          tone: "warning",
          text: "Some data has legally mandated retention: identity documents fall under 7-year know-your-customer rules, and biometric data may be retained up to 3 years after account closure to prevent fraudulent re-registration. These clocks run regardless of deletion requests; destruction is automatic when they expire.",
        },
      },
      {
        heading: "What deletion means for services you used",
        paragraphs: [
          "Services keep the historical answers they lawfully received while your consent was active (for example, that you passed an age check in March). They lose all ability to request anything new. Your verification level ceases to exist, and re-joining later means verifying from the start — deletion is real, so there is no dormant profile to reactivate.",
        ],
      },
    ],
    related: ["revoking-consent", "how-your-biometrics-are-protected", "updating-your-details"],
  },
  {
    slug: "using-my-identity-org-au",
    title: "Using my.identity.org.au",
    summary:
      "The web wallet portal: how to sign in with a passkey, what you can manage in the browser, and how it relates to the mobile wallet.",
    category: "Using your wallet",
    updated: "2026-08-03",
    sections: [
      {
        paragraphs: [
          "my.identity.org.au is the web wallet — the browser portal for your Identity Wallet. Verification itself happens on your phone, because that is where the camera and secure hardware are. Everything after verification — presenting proofs, managing consents, reviewing your history, controlling sessions — works in the portal from any browser.",
        ],
      },
      {
        heading: "Signing in",
        paragraphs: [
          "The portal has no passwords. You sign in with a passkey or device-bound credential: a cryptographic key created in your device's secure hardware during setup. Signing in means your device produces a signature — nothing secret is typed, transmitted or stored on a server, so there is nothing for a phishing site to steal.",
        ],
        list: [
          "Open https://my.identity.org.au — check the address carefully; the portal lives only at that domain.",
          "Choose sign in, and approve with your device's biometric or screen lock when prompted.",
          "Sensitive actions — approving a new consent, removing a device — ask you to re-confirm.",
        ],
        callout: {
          tone: "warning",
          text: "The portal will never ask you to type a password, email photos of documents, or sign in from a link in a message. Any of those is a scam — see recognising scams and phishing.",
        },
      },
      {
        heading: "What you can do in the portal",
        list: [
          "See your verification level and the credentials behind it.",
          "Present proofs — age-over, residency, verification level — when a service requests one.",
          "Review every consent: scope, purpose, expiry — and revoke any of them in one action.",
          "Read your full consent history, timestamped, including revocations.",
          "Manage sessions and devices, and sign out everywhere at once.",
        ],
      },
      {
        heading: "What stays on your phone",
        paragraphs: [
          "Capture and re-verification — scanning a document, liveness checks, hardware biometrics — are mobile-only, because they need the camera and secure sensors. The portal never holds document images or biometric templates; it works with verification results. If the portal ever appears to ask for your documents, you are not on the real portal.",
        ],
      },
    ],
    related: ["presenting-proofs-to-a-service", "revoking-consent", "recognising-scams-and-phishing"],
  },
  {
    slug: "becoming-an-approved-client",
    title: "Becoming an approved client",
    summary:
      "What “approved client” means on the VirtEngine network, how your verification tier gets you there, and what providers can and cannot see about you.",
    category: "Using your wallet",
    updated: "2026-08-03",
    sections: [
      {
        paragraphs: [
          "Actions on the VirtEngine network — deploying workloads, leasing provider capacity, taking on sensitive roles — carry identity requirements, because real infrastructure and real payments are involved. An approved client is simply an account whose verification tier meets the requirement of the action it is taking. There is no application form and no waiting list: approval is the mechanical result of your tier satisfying the action's requirement.",
        ],
      },
      {
        heading: "The path",
        list: [
          "Set up your wallet — every wallet starts Unverified.",
          "Complete the verification level your intended activity needs. Standard (document plus liveness) covers most marketplace activity; Trusted (hardware biometrics plus device attestation) covers sensitive roles like validator onboarding.",
          "The network computes your score and records your tier on-chain.",
          "Act on the marketplace: when your tier meets an offering's requirement, the eligibility check passes and the action proceeds.",
        ],
        callout: {
          tone: "info",
          text: "If an action needs a higher tier than you hold, your wallet shows what evidence would raise it. Climbing is always your choice, made when something you want actually requires it.",
        },
      },
      {
        heading: "What providers see about you",
        paragraphs: [
          "Providers and the marketplace see your tier and that your score met the threshold their offering requires. They never see your documents, your biometrics, your name or your score history — unless you explicitly consent to share a specific verified claim, one by one. The full walkthrough with the flow diagram is on the verify on VirtEngine page.",
        ],
      },
      {
        heading: "Losing and regaining approval",
        paragraphs: [
          "Approval tracks your tier. If evidence goes stale — an expired document you have not re-verified — or you revoke a consent your tier depended on, your tier can drop and actions that require it will decline until you re-verify. Nothing is punitive and nothing is hidden: your wallet always shows your current tier and what any action requires.",
        ],
      },
    ],
    related: ["understanding-your-veid-score", "updating-your-details", "revoking-consent"],
  },
  {
    slug: "presenting-proofs-to-a-service",
    title: "Presenting proofs to a service",
    summary:
      "What happens, screen by screen, when a service asks you to prove something — and how to read a request before you approve it.",
    category: "Using your wallet",
    updated: "2026-08-03",
    sections: [
      {
        paragraphs: [
          "When a service needs to know something about you — are you over 18, are you verified to Standard — it sends a structured request to your wallet. Nothing happens without you: the request sits in your wallet until you approve or decline, and the service receives nothing in the meantime.",
        ],
      },
      {
        heading: "Reading a request",
        paragraphs: [
          "Every request shows the same four things, and it is worth checking each one every time:",
        ],
        list: [
          "Who is asking — the service's registered name. Unregistered services cannot make requests at all.",
          "What would be proven — the specific proof or claim, in plain language: “Over 18 — yes/no”, never “your identity”.",
          "What they will never see — the request spells out what stays private (your birth date, your documents).",
          "The purpose and expiry — why they are asking, and how long the consent would last if you set a time limit.",
        ],
      },
      {
        heading: "Approving, declining, and what the service gets",
        paragraphs: [
          "Decline, and the service learns only that the request was declined. Approve, and the proof is generated and sent — a cryptographic result, not your data. For yes/no questions this is usually a zero-knowledge proof: the service can verify the answer mathematically but learns nothing beyond it.",
          "Every approval lands in your consent history with a timestamp, visible in the wallet app and at my.identity.org.au. If you granted a time-limited consent, it expires on its own; you can also revoke it early at any time.",
        ],
        callout: {
          tone: "warning",
          text: "A legitimate service never needs your documents alongside a proof — the proof is the point. A service that asks you to also email a licence photo is either misconfigured or dishonest; decline and check recognising scams and phishing.",
        },
      },
      {
        heading: "If something looks wrong",
        list: [
          "Unexpected request from a service you were not using: decline it. Requests cost you nothing to decline.",
          "Vague purpose (“account requirements”): decline, and treat it as a signal about the service.",
          "Repeated requests for the same proof: a service should store its answer, not re-ask. Consider revoking its access.",
        ],
      },
    ],
    related: ["using-my-identity-org-au", "revoking-consent", "who-can-see-your-data"],
  },
  {
    slug: "understanding-your-veid-score",
    title: "Understanding your VEID (Verifiable Electronic Identity) score",
    summary:
      "Your verification score in plain terms: what feeds it, how tiers are derived from it, who can see it, and what to do if it seems wrong.",
    category: "Your data and privacy",
    updated: "2026-08-03",
    sections: [
      {
        paragraphs: [
          "Behind your verification level sits a score: a number from 0 to 100 that the network computes from your verification evidence. You do not need to manage it — the wallet surfaces your tier, which is what services actually use — but understanding it helps the system feel less like a black box, which is exactly what an identity score must never be.",
        ],
      },
      {
        heading: "What feeds the score",
        list: [
          "Document authenticity signals — tamper checks, format validity, security features read during capture.",
          "Face match — how confidently your live selfie matched your document portrait.",
          "Liveness results — the outcome of the blink / head-turn / smile challenges.",
          "Hardware biometric and device attestation results, at the levels that include them.",
          "Verification history — sustained successful verification over time strengthens the picture.",
        ],
        paragraphs: [
          "The scoring model is part of the open-source codebase, so the weighting of these signals is public and inspectable — auditable by anyone, not asserted by us.",
        ],
      },
      {
        heading: "From score to tier",
        paragraphs: [
          "Tiers are bands over the score, recorded on-chain: reach a band's threshold and you hold that tier. Services see the tier — or, if they require a specific threshold, a yes/no or zero-knowledge proof that your score meets it. They do not see the number itself, and they never see the signals beneath it.",
        ],
        callout: {
          tone: "info",
          text: "This is deliberate layering: the evidence stays encrypted, the score summarises the evidence, the tier summarises the score — and each audience sees only the layer it needs.",
        },
      },
      {
        heading: "If your score seems wrong",
        paragraphs: [
          "Scores change only when verification evidence changes — a re-verification, an expired document, a revoked consent. If your tier dropped and you do not know why, check your wallet's history first: the triggering event is recorded. Most fixes are re-verification with current evidence.",
          "If you believe a verification outcome is genuinely incorrect, the network has an appeal path for disputed results, and failure never creates a penalty score — retrying is always safe. See if verification fails for the practical checklist.",
        ],
      },
    ],
    related: ["becoming-an-approved-client", "updating-your-details", "who-can-see-your-data"],
  },
];

/** Article referenced by slug in `related` that lives outside /help. */
export const RELATED_EXTERNAL: Record<string, { title: string; href: string }> = {
  "lost-or-new-device-summary": {
    title: "Lost or new device (get-started guide)",
    href: "/get-started/lost-or-new-device",
  },
};

export function getArticle(slug: string): HelpArticle | undefined {
  return HELP_ARTICLES.find((a) => a.slug === slug);
}

export const HELP_CATEGORIES: HelpCategory[] = [
  "Your data and privacy",
  "Using your wallet",
  "Security",
  "Support",
];
