/**
 * Canonical network-status strings. Every surface that mentions launch posture
 * (footer rail, marketplace notes, new service pages) reads from here so the
 * message cannot drift between pages. Wording matches the repository posture:
 * TestNet is planned for January 2027; MainNet is planned for March 2027 after
 * TestNet exit criteria and a fresh go/no-go approval.
 */
export const NETWORK_STATUS = {
  /** One-line posture used on hero rails and page notes. */
  posture: "Protocol in development",
  /** Short form for dense surfaces (badges, rails). */
  short: "In development — the network is not live.",
  /** The full sentence used in body copy. */
  body:
    "The network is not live. These pages describe the protocol design; production services depend on testing and a separate launch approval.",
  testnet: {
    label: "Public TestNet",
    timing: "Planned January 2027",
    detail: "Pre-production validation; state may reset and does not automatically carry into MainNet.",
  },
  mainnet: {
    label: "MainNet",
    timing: "Planned March 2027, subject to approval",
    detail: "Requires TestNet exit evidence, remediation, final artifacts, and a fresh go/no-go decision.",
  },
} as const;
