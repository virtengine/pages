export const SITE = {
  name: "DET.io Foundation",
  legalName: "DETIO FOUNDATION LTD",
  url: "https://det.io",
  title: "DET.io Foundation — decentralized technologies, stewarded for public benefit | det.io",
  description:
    "DETIO FOUNDATION LTD is a not-for-profit technical research organization (ACN 699 651 771, Australia) advancing decentralized technologies for public benefit. Steward of the VirtEngine protocol, the DSEMA multi-agent architecture, the open-source Bosun agent orchestrator, and the VEID identity program.",
  email: "hello@det.io",
  github: "https://github.com/virtengine/virtengine",
  bosunSite: "https://bosun.engineer",
  bosunGithub: "https://github.com/virtengine/bosun",
  bosunNpm: "https://www.npmjs.com/package/bosun",
  acn: "699 651 771",
  abn: "53 699 651 771",
  patentVe: "AU2024203136B2",
  patentVeUrl: "https://patents.google.com/patent/AU2024203136B2/",
} as const;

export interface NavItem {
  label: string;
  href: string;
}

export const NAV: NavItem[] = [
  { label: "Mission", href: "/mission" },
  { label: "Constitution", href: "/constitution" },
  { label: "Research", href: "/research" },
  { label: "Governance", href: "/governance" },
  { label: "Foundation", href: "/foundation" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
];

/** Secondary links surfaced in the footer alongside NAV. */
export const FOOTER_EXTRA: NavItem[] = [
  { label: "Transparency", href: "/transparency" },
  { label: "VirtEngine program", href: "/research/virtengine" },
  { label: "DSEMA program", href: "/research/dsema" },
  { label: "Bosun program", href: "/research/bosun" },
  { label: "Identity program", href: "/research/identity" },
];

export const ECOSYSTEM: NavItem[] = [
  { label: "virtengine.com", href: "https://virtengine.com" },
  { label: "docs.virtengine.com", href: "https://docs.virtengine.com" },
  { label: "identity.org.au", href: "https://identity.org.au" },
  { label: "bosun.engineer", href: "https://bosun.engineer" },
  { label: "GitHub", href: "https://github.com/virtengine/virtengine" },
];

/**
 * The four charitable purpose pillars, constitution clause 6.1.
 * Wording condensed from the signed instrument — do not paraphrase loosely.
 */
export const PURPOSES = [
  {
    clause: "6.1.1",
    name: "Advancing education",
    summary:
      "Public research, open technical education, open specifications, standards, documentation, safety materials, and implementation guidance for privacy-preserving digital infrastructure, distributed computing, and trustworthy artificial intelligence.",
  },
  {
    clause: "6.1.2",
    name: "Advancing public welfare",
    summary:
      "Developing, stewarding, and supporting technology that improves public access to secure, privacy-preserving, resilient, and affordable digital infrastructure.",
  },
  {
    clause: "6.1.3",
    name: "Protecting human rights",
    summary:
      "Promoting privacy, dignity, autonomy, and equality of access — and protection from unlawful surveillance, coercion, discrimination, and private capture of essential digital infrastructure.",
  },
  {
    clause: "6.1.4",
    name: "Security of Australia and the public",
    summary:
      "Research, education, standards, and public-benefit technology that improves cyber security, identity safety, AI safety, data protection, and infrastructure resilience.",
  },
] as const;
