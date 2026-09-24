export const SITE = {
  name: "identity.org.au",
  serviceName: "Identity Wallet",
  url: "https://identity.org.au",
  title: "Private Digital Identity Wallet Australia | identity.org.au",
  description:
    "Set up a free privacy-preserving digital Identity Wallet. Prove age or ID without sharing documents. Open-source, nonprofit-run, independent of government.",
  email: "hello@det.io",
  dpoEmail: "dpo@virtengine.com",
  securityEmail: "security@virtengine.com",
  github: "https://github.com/virtengine/virtengine",
  docs: "https://docs.virtengine.com",
  walletPortal: "/launch",
  patentUrl: "https://patents.google.com/patent/AU2024203136B2/",
  patentId: "AU2024203136B2",
  foundation: "DETIO FOUNDATION LTD",
  acn: "699 651 771",
  abn: "53 699 651 771",
} as const;

export interface NavItem {
  label: string;
  href: string;
}

export const NAV: NavItem[] = [
  { label: "Wallet", href: "/wallet" },
  { label: "Get started", href: "/get-started" },
  { label: "How it works", href: "/how-it-works" },
  { label: "Insights", href: "/insights" },
  { label: "Guides", href: "/guides" },
  { label: "Help", href: "/help" },
  { label: "For services", href: "/for-services" },
  { label: "About", href: "/about" },
];

export const ECOSYSTEM: NavItem[] = [
  { label: "Identity Wallet launch updates", href: "/launch" },
  { label: "virtengine.com", href: "https://virtengine.com" },
  { label: "docs.virtengine.com", href: "https://docs.virtengine.com" },
  { label: "det.io", href: "https://det.io" },
  { label: "Identity research program at det.io", href: "https://det.io/research/identity" },
  { label: "Source code on GitHub", href: "https://github.com/virtengine/virtengine" },
];

export const FOOTER_COLUMNS: { heading: string; links: NavItem[] }[] = [
  {
    heading: "The wallet",
    links: [
      { label: "The Identity Wallet service", href: "/wallet" },
      { label: "Web wallet — my.identity.org.au", href: "/wallet/web-wallet" },
      { label: "Mobile wallet", href: "/wallet/mobile-wallet" },
      { label: "Verify on VirtEngine", href: "/wallet/verify-on-virtengine" },
      { label: "Credentials and proofs", href: "/wallet/credentials" },
      { label: "Wallet security", href: "/wallet/security" },
    ],
  },
  {
    heading: "Get started",
    links: [
      { label: "What you need", href: "/get-started/what-you-need" },
      { label: "Set up your wallet", href: "/get-started/set-up-your-wallet" },
      { label: "Verification levels", href: "/get-started/verification-levels" },
      { label: "If verification fails", href: "/get-started/if-verification-fails" },
      { label: "Lost or new device", href: "/get-started/lost-or-new-device" },
    ],
  },
  {
    heading: "Guides and terms",
    links: [
      { label: "All guides", href: "/guides" },
      { label: "Digital identity definitions", href: "/definitions" },
      { label: "How to protect your identity for free", href: "/guides/how-to-protect-your-identity-for-free" },
      { label: "Age verification explained", href: "/guides/age-verification-explained" },
      { label: "Identity verification solutions compared", href: "/guides/identity-verification-solutions-compared" },
      { label: "The Australian Government Digital ID System", href: "/guides/australian-government-digital-id-system" },
    ],
  },
  {
    heading: "Help and support",
    links: [
      { label: "Help centre", href: "/help" },
      { label: "Frequently asked questions", href: "/faq" },
      { label: "Using my.identity.org.au", href: "/help/using-my-identity-org-au" },
      { label: "Who can see your data", href: "/help/who-can-see-your-data" },
      { label: "Revoking consent", href: "/help/revoking-consent" },
      { label: "Recognising scams", href: "/help/recognising-scams-and-phishing" },
      { label: "Accessibility support", href: "/help/accessibility-support" },
    ],
  },
  {
    heading: "About",
    links: [
      { label: "What is identity.org.au", href: "/about/what-is-identity-org-au" },
      { label: "Insights and analysis", href: "/insights" },
      { label: "The technology", href: "/about/the-technology" },
      { label: "Who runs it", href: "/about/who-runs-it" },
      { label: "Open source", href: "/about/open-source" },
      { label: "Patents", href: "/about/patents" },
      { label: "For individuals", href: "/for-individuals" },
      { label: "For services", href: "/for-services" },
    ],
  },
  {
    heading: "Policies",
    links: [
      { label: "Privacy", href: "/privacy" },
      { label: "Trusted processing", href: "/privacy/trusted-processing" },
      { label: "Terms of use", href: "/terms-of-use" },
      { label: "Accessibility", href: "/accessibility" },
      { label: "Security", href: "/security" },
      { label: "Media credits", href: "/media-credits" },
    ],
  },
];
