export interface NetworkHit {
  id: string;
  href: string;
  label: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface NetworkOverlay {
  id: string;
  kind: "rect" | "circle";
  x: number;
  y: number;
  w?: number;
  h?: number;
  r?: number;
  rx?: number;
}

export interface NetworkStageCopy {
  chip: string;
  tag: string;
  title: string;
  lede: string;
}

export const hits: NetworkHit[] = [
  { id: "order", href: "/learn/how-the-marketplace-works", label: "Order — open GPU job", x: 36.25, y: 4, w: 27.5, h: 12.3 },
  { id: "veid", href: "/veid", label: "VEID — identity scored by validators", x: 12.2, y: 24, w: 15, h: 16 },
  { id: "attest", href: "/providers", label: "Attest — capacity proven on the machine", x: 67.2, y: 25.1, w: 17.5, h: 14.9 },
  { id: "core", href: "/protocol", label: "Protocol — compute, identity, settlement", x: 35.6, y: 35.4, w: 28.8, h: 26.3 },
  { id: "bid-a", href: "/learn/how-the-marketplace-works", label: "Bid syd-01 — 0.42 per hour", x: 14.4, y: 63, w: 15, h: 10 },
  { id: "bid-win", href: "/learn/how-the-marketplace-works", label: "Winning bid mel-gpu — 0.39 per hour", x: 42.5, y: 63, w: 15, h: 10 },
  { id: "bid-c", href: "/learn/how-the-marketplace-works", label: "Bid act-hpc — 0.51 per hour", x: 70.6, y: 63, w: 15, h: 10 },
  { id: "escrow", href: "/learn/escrow-and-settlement-explained", label: "Escrow — funds held for the lease", x: 34.4, y: 78.6, w: 31.25, h: 14.4 },
  { id: "settle", href: "/learn/escrow-and-settlement-explained", label: "Settle — signed usage, then payout", x: 36.1, y: 94, w: 27.8, h: 6 },
];

export const overlays: NetworkOverlay[] = [
  { id: "order", kind: "rect", x: 232, y: 28, w: 176, h: 86, rx: 12 },
  { id: "veid", kind: "circle", x: 126, y: 216, r: 49 },
  { id: "attest", kind: "rect", x: 430, y: 184, w: 112, h: 80, rx: 10 },
  { id: "core", kind: "circle", x: 320, y: 340, r: 96 },
  { id: "bid-a", kind: "rect", x: 92, y: 472, w: 96, h: 52, rx: 8 },
  { id: "bid-win", kind: "rect", x: 272, y: 472, w: 96, h: 52, rx: 8 },
  { id: "bid-c", kind: "rect", x: 452, y: 472, w: 96, h: 52, rx: 8 },
  { id: "escrow", kind: "rect", x: 220, y: 588, w: 200, h: 104, rx: 10 },
  { id: "settle", kind: "rect", x: 231, y: 711, w: 178, h: 20, rx: 10 },
];

export const readouts: Record<string, string> = {
  idle: "A lease forming, live — order → match → escrow → settle. Hover a stage; click opens its guide.",
  order: "Demand with budget behind it — a named offering, or open for bids.",
  veid: "Identity scored by the validator set.",
  attest: "Capacity proven on the machine before it can serve.",
  core: "One protocol: market, identity, ledger.",
  "bid-a": "Ask 0.42 / hr on attested capacity.",
  "bid-win": "Matched at 0.39 / hr — lease forms here.",
  "bid-c": "Ask 0.51 / hr — recorded either way.",
  escrow: "Funds lock against signed usage. Fees are protocol parameters.",
  settle: "Signed usage. Payout after the window.",
};

export const idleCopy = {
  tag: "Buy from providers you choose, or open your demand to bids — settled on-chain.",
  title: "The open marketplace for infrastructure and services.",
  lede: "Independent providers list compute, platforms, software and custom services. Buyers order directly at published prices, let providers compete for the work, or describe what they need and get matched. Identity, escrow and metered settlement are protocol state — not platform promises.",
};

export const stageCopy: Record<NetworkHit["id"], NetworkStageCopy> = {
  order: {
    chip: "Order",
    tag: "Order — name it or open it",
    title: "Demand, with budget behind it.",
    lede: "Post a named offering to buy it outright, or open demand providers can bid on. Either way the order is escrow-backed protocol state — never a private RFQ.",
  },
  veid: {
    chip: "VEID",
    tag: "VEID — identity, verified",
    title: "Identity, scored by validators.",
    lede: "Encrypted identity scopes are scored by the validator set. Participants prove facts with zero-knowledge proofs and reveal nothing more. The Foundation runs no central VEID verification service.",
  },
  attest: {
    chip: "Attest",
    tag: "Attest — proof on the machine",
    title: "Capacity, proven where it runs.",
    lede: "Providers sign attestations from each machine before they can serve. Broken or borrowed capacity never reaches the market.",
  },
  core: {
    chip: "Protocol",
    tag: "Protocol — one verifiable chain",
    title: "One chain, three guarantees.",
    lede: "The protocol is the market, the identity system, and the ledger — from order to payout, the state is verifiable.",
  },
  "bid-a": {
    chip: "Bid 0.42",
    tag: "Ask 0.42 / hr — Provider A",
    title: "One provider's ask.",
    lede: "An independent operator prices the job at 0.42 / hr on attested capacity. Asks compete only on orders opened for bidding.",
  },
  "bid-win": {
    chip: "Match 0.39",
    tag: "Matched — 0.39 / hr",
    title: "The lease forms here.",
    lede: "A direct purchase or the accepted bid binds into a lease under escrow. This one matched Provider B at 0.39 / hr.",
  },
  "bid-c": {
    chip: "Bid 0.51",
    tag: "Ask 0.51 / hr — Provider C",
    title: "Every offer is recorded.",
    lede: "Provider C asks 0.51 / hr. Win or lose, every offer is chain state — unreserved until usage is signed and settlement runs.",
  },
  escrow: {
    chip: "Escrow",
    tag: "Escrow — funds held for the lease",
    title: "Funds lock against signed usage.",
    lede: "Lease funds sit in escrow against signed usage records. Marketplace fees are protocol parameters set by governance — not a private operator's margin.",
  },
  settle: {
    chip: "Settle",
    tag: "Settle — signed, then paid",
    title: "Metered usage, settled honestly.",
    lede: "The provider daemon meters workloads and batches signed usage records. After the 24-hour dispute window, settlement converts them into line items and pays out.",
  },
};