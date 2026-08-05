export interface FaqItem {
  question: string;
  answer: string;
  /** Optional internal link shown after the answer. */
  more?: { label: string; href: string };
}

export interface FaqGroup {
  heading: string;
  items: FaqItem[];
}

export const FAQ_GROUPS: FaqGroup[] = [
  {
    heading: "The basics",
    items: [
      {
        question: "Is identity.org.au an Australian Government service?",
        answer:
          "No. identity.org.au is an open-source community service operated by DETIO FOUNDATION LTD, an Australian not-for-profit public company limited by guarantee (ACN 699 651 771). It is independently operated and separate from the Australian Government Digital ID System, myID and myGov. The foundation is currently applying for accreditation under the Digital ID Act 2024 Accreditation Scheme; accreditation has not been granted and none is claimed.",
        more: { label: "What is identity.org.au", href: "/about/what-is-identity-org-au" },
      },
      {
        question: "What is the Identity Wallet?",
        answer:
          "A privacy-preserving digital identity wallet: an app on your phone that holds verified claims about you — your name, your age, your verification level — and lets you prove things to services without handing over documents. It is powered by VEID, the identity layer of the open-source VirtEngine network.",
        more: { label: "How it works", href: "/how-it-works" },
      },
      {
        question: "What does it cost?",
        answer:
          "The software is free and open source under the Apache 2.0 licence. There is no subscription and no fee to set up a wallet. The project is stewarded by a not-for-profit foundation whose constitution prevents it operating for private profit.",
      },
      {
        question: "Can I download the app today?",
        answer:
          "The wallet capture app exists as an open-source reference implementation — the working blueprint that production wallets build on. There are no official app-store listings at this stage, and you should treat any store listing claiming to be this wallet as suspect. The source code is public on GitHub.",
        more: { label: "Open source", href: "/about/open-source" },
      },
      {
        question: "Do I have to use it?",
        answer:
          "No. The wallet is voluntary. Identity verification through VEID is optional even within the VirtEngine network — some activities simply require verification the same way some venues require ID. Nothing about the system compels participation.",
      },
    ],
  },
  {
    heading: "The wallet service",
    items: [
      {
        question: "What is my.identity.org.au?",
        answer:
          "The web wallet portal of the Identity Wallet service — the place where your verified identity lives in the browser. You sign in with a passkey (no passwords exist), present proofs to services, review and revoke consents, and manage your sessions. Verification itself happens in the mobile wallet; the portal is where you use the result. The portal lives only at my.identity.org.au — treat any other address claiming to be it as a scam.",
        more: { label: "The web wallet", href: "/wallet/web-wallet" },
      },
      {
        question: "What is an approved client?",
        answer:
          "An account on the VirtEngine network whose verification tier meets the requirement of the action it is taking — deploying workloads, leasing capacity, or holding sensitive roles. There is no application process: approval is mechanical. Complete the verification level an action needs, the network records your tier on-chain, and the eligibility check passes.",
        more: { label: "Verify on VirtEngine", href: "/wallet/verify-on-virtengine" },
      },
      {
        question: "Can services or providers ever see my documents?",
        answer:
          "No. Services receive your tier, a pass/fail result, or a zero-knowledge proof — never document scans, never photos, never biometric data. There is deliberately no API through which a service could request your documents. If you explicitly consent to share a specific verified claim (for example, your verified name), that single claim is shared — and nothing else.",
        more: { label: "Credentials and proofs", href: "/wallet/credentials" },
      },
      {
        question: "Is the wallet available today?",
        answer:
          "Partly, and we will not overstate it. The wallet exists as working, open-source reference software rolling out with the VirtEngine network — the code is public and you can run it. There are no app-store listings, and my.identity.org.au is the portal domain of this service as it rolls out. We publish what the code does, not availability promises.",
        more: { label: "The Identity Wallet service", href: "/wallet" },
      },
      {
        question: "What does using the wallet cost?",
        answer:
          "The wallet software is free and open source, and there is no subscription or fee to set up or hold a wallet. We do not publish pricing for network operations here: fees on the VirtEngine network (for example, for marketplace transactions) are set by the network's on-chain parameters, not by this service, and inventing figures would break our honesty rules. The technical documentation tracks current network parameters.",
      },
      {
        question: "How does my organisation become a verifier?",
        answer:
          "Follow the six-step path: decide the minimum tier or proof your risk actually requires, register your service on the network, integrate the verification request flow, handle the tier and score response, meet your consent and receipt obligations, and go live. Verifier infrastructure versions are approved through on-chain governance, and every request your service makes is shown to the user with your name on it.",
        more: { label: "Become a verifier", href: "/for-services/become-a-verifier" },
      },
    ],
  },
  {
    heading: "Setting up and verifying",
    items: [
      {
        question: "What do I need to set up a wallet?",
        answer:
          "A smartphone with a camera, a government-issued identity document (passport, driver licence or national ID), and about ten minutes. Higher verification levels also use your phone's fingerprint or face sensor.",
        more: { label: "What you need", href: "/get-started/what-you-need" },
      },
      {
        question: "What are verification levels?",
        answer:
          "Four levels — Unverified, Basic, Standard and Trusted — that describe how thoroughly your identity has been checked. Standard (document plus selfie with liveness) is what most services ask for. Trusted adds hardware-backed biometrics and device integrity attestation for sensitive roles.",
        more: { label: "Verification levels", href: "/get-started/verification-levels" },
      },
      {
        question: "Why does verification take a selfie video, not just a photo?",
        answer:
          "The selfie step includes active liveness challenges — blink, turn your head, smile — that prove a live person is present, not a photo, video replay or mask. This is one of the main defences against someone using stolen document images to impersonate you.",
      },
      {
        question: "What happens if my verification fails?",
        answer:
          "Usually nothing serious — most failures are practical: bad lighting, glare on the document, or a liveness challenge that didn't register. You can retry with better conditions. Failure doesn't create a black mark; there is no penalty score.",
        more: { label: "If verification fails", href: "/get-started/if-verification-fails" },
      },
      {
        question: "I got a new phone. Do I start again?",
        answer:
          "Your verified identity lives on the network, encrypted — not just inside one phone. On a new device you re-establish control of your wallet and re-run a fresh biometric check so the network knows the person on the new device is still you.",
        more: { label: "Lost or new device", href: "/get-started/lost-or-new-device" },
      },
    ],
  },
  {
    heading: "Privacy and data",
    items: [
      {
        question: "Where are my documents stored?",
        answer:
          "Encrypted, with encryption starting on your own device before anything is transmitted. The network stores encrypted payloads it cannot browse. Services you share with never receive documents at all — they receive verification results.",
        more: { label: "Privacy", href: "/privacy" },
      },
      {
        question: "What does a service actually see when I share?",
        answer:
          "Your verification level and the specific answer you approved — for example, “over 18: yes”. Never your document scans, never your photos, never your biometric data. This is enforced by the protocol, not just promised in a policy.",
        more: { label: "Who can see your data", href: "/help/who-can-see-your-data" },
      },
      {
        question: "Can my biometric data be sold?",
        answer:
          "No — categorically. The Biometric Data Addendum that governs the system prohibits selling, leasing or trading biometric data regardless of consent. Biometric data is never monetised, full stop.",
        more: { label: "How your biometrics are protected", href: "/help/how-your-biometrics-are-protected" },
      },
      {
        question: "Can anyone open the processing environment?",
        answer:
          "The system is designed so that no one — not operators, not providers, not the foundation — can open it. Verification runs inside hardware-sealed enclaves (trusted processing units) where the processor encrypts the memory and the decryption key is derived inside the hardware, never existing outside it. Before any data enters, the chain verifies the enclave's cryptographic fingerprint. There is no operator login, no console, no key to hand over — by design, not by policy.",
        more: { label: "Trusted processing — the lock and the key", href: "/privacy/trusted-processing" },
      },
      {
        question: "When is my data deleted?",
        answer:
          "At several points, automatically. Working copies inside the processing enclave are destroyed the moment scoring ends. Retained encrypted evidence is destroyed automatically at the end of its legal retention period — at most 7 years from last use, under know-your-customer law. If you request deletion, data leaves active systems within 30 days and backups within the rotation period (typically 90 days), and encryption keys are destroyed, which makes any remaining encrypted copy permanently unreadable. You can withdraw consent any time via dpo@virtengine.com.",
        more: { label: "How and when data is discarded", href: "/privacy/trusted-processing" },
      },
      {
        question: "What exactly is stored on the blockchain?",
        answer:
          "Verification results — your score, tier and pass/fail outcomes — plus encrypted references, consent records and enclave attestation records. Never your documents, photos or biometric data in readable form. The chain's job is to make results and consents tamper-proof, not to hold evidence; the raw material stays encrypted on your device and is destroyed after processing.",
        more: { label: "Privacy — what exists and where it lives", href: "/privacy" },
      },
      {
        question: "Can I delete my data?",
        answer:
          "Yes. Deletion removes data from active systems within 30 days, then from backups within the rotation period (typically 90 days). Encryption keys are destroyed, which makes any on-chain encrypted references permanently unreadable. Some records carry legally mandated retention (for example 7-year know-your-customer rules) before automatic destruction.",
        more: { label: "Deleting your identity", href: "/help/deleting-your-identity" },
      },
      {
        question: "Isn't putting identity on a blockchain a privacy disaster?",
        answer:
          "It would be, if personal data were written to the chain — so it never is. The chain records encrypted references and verification results only. The blockchain's job is making the verification record tamper-proof and removing the need for one central database of everyone's documents — which is precisely the thing that gets breached in conventional systems.",
        more: { label: "The technology", href: "/about/the-technology" },
      },
      {
        question: "How do age checks work without revealing my birth date?",
        answer:
          "Through zero-knowledge proofs: cryptography that proves a statement (“this verified person is over 18”) is true without revealing the underlying data. The service gets a yes/no it can verify; your birth date and document stay private.",
        more: { label: "Proving your age", href: "/help/proving-your-age-without-your-documents" },
      },
    ],
  },
  {
    heading: "Trust and governance",
    items: [
      {
        question: "Who runs identity.org.au?",
        answer:
          "DETIO FOUNDATION LTD, an Australian not-for-profit public company limited by guarantee (ACN 699 651 771), whose constitution locks its assets and technology to public-benefit purposes — no dividends, no private capture, and on winding-up all assets go to another charity or public-benefit entity.",
        more: { label: "Who runs it", href: "/about/who-runs-it" },
      },
      {
        question: "Is the technology audited or reviewed?",
        answer:
          "The code is fully open source, so anyone can review it, and the project publishes security policy, test suites and external audit evidence in the repository rather than claiming blanket certification. We do not claim government accreditation of any kind — the design aligns with the principles of data minimisation and consent-based sharing, but alignment is not accreditation and we will not blur that line.",
        more: { label: "Security", href: "/security" },
      },
      {
        question: "What is the patent, and doesn't a patent conflict with open source?",
        answer:
          "Australian patent AU2024203136B2 covers the machine-learning identity verification method the wallet uses. It is held within the Foundation's public-benefit structure: the constitution prevents the patent being captured for private profit, and the implementation is open source. The patent's practical role is defensive — it stops someone else fencing off the technique.",
        more: { label: "Patents", href: "/about/patents" },
      },
      {
        question: "What happens if the Foundation shuts down?",
        answer:
          "The constitution's winding-up provisions require all assets — including the technology and any intellectual property — to pass to another charity or public-benefit entity with similar purposes. The software itself is already open source, so the code cannot be withdrawn from the public regardless.",
      },
      {
        question: "How do I report a security problem?",
        answer:
          "Email security@virtengine.com with reproduction steps and impact. Acknowledgement target is 48 hours, and critical issues are triaged within 24. Good-faith security research is welcomed.",
        more: { label: "Security", href: "/security" },
      },
    ],
  },
];

export const FAQ_FLAT: FaqItem[] = FAQ_GROUPS.flatMap((g) => g.items);
