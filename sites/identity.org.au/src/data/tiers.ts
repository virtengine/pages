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
      "Early checks have passed. This level can support a limited claim when a specific service asks for it and you choose to present it.",
    evidence: [
      "Basic identity details you enter yourself",
      "A verification session that passes the network's early checks",
    ],
    unlocks: [
      "A specific offer's disclosed proof request, when the current service supports it",
      "Other services that do not require VEID remain available",
    ],
  },
  {
    name: "Standard",
    level: 2,
    plain:
      "A verification scope has been completed. Original identity document images and full OCR output stay on your device; only separately approved derived data may be submitted.",
    evidence: [
      "Local document capture and OCR; the source images stay on your device",
      "User-reviewed, minimum derived fields only if separately approved for submission",
      "Any separately requested biometric scope follows its own consent notice",
    ],
    unlocks: [
      "Age and attribute proofs (for example, proving you are over 18)",
      "An individual marketplace offer's disclosed proof request, where supported",
      "Listings that do not require VEID remain available",
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
      "Protocol roles or services with separately disclosed, supported proof requirements",
      "A specific offer's disclosed higher-assurance proof request; not a universal marketplace gate",
    ],
  },
];
