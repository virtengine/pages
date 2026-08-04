/**
 * VEID verification levels, plain-language.
 * Source: repos/virtengine/x/veid/alias.go (IdentityTierUnverified / Basic /
 * Standard / Trusted) and x/veid/types/identity.go (score-derived tiers).
 * Evidence requirements follow the capture flow in
 * repos/virtengine/mobile/veid-capture-app/README.md and
 * docs/veid/biometric-hardware-attestation.md.
 */
export interface Tier {
  name: string;
  level: number;
  plain: string;
  evidence: string[];
  unlocks: string[];
}

export const TIERS: Tier[] = [
  {
    name: "Unverified",
    level: 0,
    plain: "You have a wallet, but no identity checks have been completed yet.",
    evidence: ["None — this is where every wallet starts."],
    unlocks: [
      "Browsing services that accept the wallet",
      "Activities that do not need identity checks",
    ],
  },
  {
    name: "Basic",
    level: 1,
    plain:
      "Early checks have passed. Enough for low-risk activity where a service just needs some confidence you are a real person.",
    evidence: [
      "Basic identity details you enter yourself",
      "A verification session that passes the network's early checks",
    ],
    unlocks: [
      "Low-risk services and small transactions",
      "Services that only need a real-person signal, not a strong identity",
    ],
  },
  {
    name: "Standard",
    level: 2,
    plain:
      "Your identity document and your face have been checked and verified by the network. This is the level most services ask for.",
    evidence: [
      "A government-issued identity document, scanned front and back",
      "A selfie with active liveness checks (blink, head turn, smile)",
      "Automated document reading (OCR) that matches the document to your details",
    ],
    unlocks: [
      "Most participating services",
      "Age and attribute proofs (for example, proving you are over 18)",
      "Marketplace activity that requires a verified identity",
    ],
  },
  {
    name: "Trusted",
    level: 3,
    plain:
      "The strongest level: everything in Standard, plus hardware-backed biometric checks, device integrity attestation, and a sustained verification history.",
    evidence: [
      "Everything required for Standard",
      "Fingerprint or iris capture through your phone's secure hardware",
      "Device integrity attestation (Google Play Integrity or Apple App Attest)",
      "A history of successful verification over time",
    ],
    unlocks: [
      "Sensitive, high-trust roles — for example validator onboarding on the VirtEngine network",
      "High-value transactions where the counterparty requires the strongest assurance",
    ],
  },
];
