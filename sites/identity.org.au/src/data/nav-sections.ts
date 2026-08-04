import type { NavItem } from "./site";

export const GET_STARTED_NAV: NavItem[] = [
  { label: "Overview", href: "/get-started" },
  { label: "What you need", href: "/get-started/what-you-need" },
  { label: "Set up your wallet", href: "/get-started/set-up-your-wallet" },
  { label: "Verification levels", href: "/get-started/verification-levels" },
  { label: "If verification fails", href: "/get-started/if-verification-fails" },
  { label: "Lost or new device", href: "/get-started/lost-or-new-device" },
];

export const WALLET_NAV: NavItem[] = [
  { label: "Overview", href: "/wallet" },
  { label: "Web wallet — my.identity.org.au", href: "/wallet/web-wallet" },
  { label: "Mobile wallet", href: "/wallet/mobile-wallet" },
  { label: "Verify on VirtEngine", href: "/wallet/verify-on-virtengine" },
  { label: "Credentials and proofs", href: "/wallet/credentials" },
  { label: "Wallet security", href: "/wallet/security" },
];

export const FOR_SERVICES_NAV: NavItem[] = [
  { label: "Overview", href: "/for-services" },
  { label: "Become a verifier", href: "/for-services/become-a-verifier" },
  { label: "Integration overview", href: "/for-services/integration-overview" },
];

export const ABOUT_NAV: NavItem[] = [
  { label: "Overview", href: "/about" },
  { label: "What is identity.org.au", href: "/about/what-is-identity-org-au" },
  { label: "The technology", href: "/about/the-technology" },
  { label: "Who runs it", href: "/about/who-runs-it" },
  { label: "Open source", href: "/about/open-source" },
  { label: "Patents", href: "/about/patents" },
];
