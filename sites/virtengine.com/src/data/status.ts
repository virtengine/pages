/**
 * Canonical network-status source. Every surface that mentions launch posture
 * (header badge, footer rail, marketplace notes, network page) reads from here
 * so the message cannot drift between pages. Wording matches the repository
 * posture: TestNet is planned for January 2027; MainNet is planned for March
 * 2027 after TestNet exit criteria and a fresh go/no-go approval.
 *
 * Ownership: /network is the canonical explanation. All other pages render
 * at most one compact StatusBadge linking there.
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
  lastUpdated: "17 Sep 2026",
} as const;

/** Single structured status object consumed by header, footer and /network. */
export const networkStatus = {
  protocol: "development" as const,
  protocolLabel: NETWORK_STATUS.posture,
  publicTestnet: {
    status: "planned" as const,
    ...NETWORK_STATUS.testnet,
  },
  mainnet: {
    status: "not-live" as const,
    ...NETWORK_STATUS.mainnet,
  },
  lastUpdated: NETWORK_STATUS.lastUpdated,
} as const;
