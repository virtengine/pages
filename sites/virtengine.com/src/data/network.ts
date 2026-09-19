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
  { id: "bid-a", href: "/learn/how-the-marketplace-works", label: "Bid syd-01 — 0.42 per hour", x: 14.4, y: 68.3, w: 15, h: 10.3 },
  { id: "bid-win", href: "/learn/how-the-marketplace-works", label: "Winning bid mel-gpu — 0.39 per hour", x: 42.5, y: 68.3, w: 15, h: 10.3 },
  { id: "bid-c", href: "/learn/how-the-marketplace-works", label: "Bid act-hpc — 0.51 per hour", x: 70.6, y: 68.3, w: 15, h: 10.3 },
  { id: "escrow", href: "/learn/escrow-and-settlement-explained", label: "Escrow — 0% marketplace take", x: 36.25, y: 78.3, w: 27.5, h: 13.7 },
  { id: "settle", href: "/learn/escrow-and-settlement-explained", label: "Settle — signed usage, then payout", x: 36.9, y: 92.6, w: 26.3, h: 5.2 },
];

export const overlays: NetworkOverlay[] = [
  { id: "order", kind: "rect", x: 232, y: 28, w: 176, h: 86, rx: 12 },
  { id: "veid", kind: "circle", x: 126, y: 216, r: 49 },
  { id: "attest", kind: "rect", x: 430, y: 184, w: 112, h: 80, rx: 10 },
  { id: "core", kind: "circle", x: 320, y: 340, r: 96 },
  { id: "bid-a", kind: "rect", x: 92, y: 478, w: 96, h: 52, rx: 8 },
  { id: "bid-win", kind: "rect", x: 272, y: 478, w: 96, h: 52, rx: 8 },
  { id: "bid-c", kind: "rect", x: 452, y: 478, w: 96, h: 52, rx: 8 },
  { id: "escrow", kind: "rect", x: 232, y: 548, w: 176, h: 96, rx: 10 },
  { id: "settle", kind: "rect", x: 231, y: 651, w: 178, h: 20, rx: 10 },
];

export const readouts: Record<string, string> = {
  idle: "Hover a stage. Click to open it.",
  order: "Job posted in the open. Not a private RFQ.",
  veid: "Identity scored by the validator set.",
  attest: "Capacity proven before a bid counts.",
  core: "One protocol. Compute, identity, settlement.",
  "bid-a": "Independent operator. 0.42 / hr.",
  "bid-win": "Lowest honest bid. Lease forms here.",
  "bid-c": "Independent operator. 0.51 / hr.",
  escrow: "Funds lock. Marketplace take is 0%.",
  settle: "Signed usage. Payout after the window.",
};

export const idleCopy = {
  tag: "Compute. Identity. Settlement. One verifiable protocol.",
  title: "The open infrastructure network.",
  lede: "VirtEngine is an open-source protocol for discovering, verifying and using computing infrastructure across independent providers.",
};

export const stageCopy: Record<NetworkHit["id"], NetworkStageCopy> = {
  order: {
    chip: "Order",
    tag: "Order — jobs in the open",
    title: "A market, not a private RFQ.",
    lede: "Jobs are posted in the open. Every order is protocol state, biddable by any operator running an attested machine — so capacity is discovered, not brokered.",
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
    lede: "Providers sign attestations from each machine before a bid counts. Broken or borrowed capacity never reaches the market.",
  },
  core: {
    chip: "Core",
    tag: "Core — one verifiable protocol",
    title: "Compute. Identity. Settlement.",
    lede: "Three surfaces, one chain. From order to payout the state is verifiable — the protocol is the market, the identity system, and the ledger.",
  },
  "bid-a": {
    chip: "Bid syd",
    tag: "Bid syd-01 · 0.42 / hr",
    title: "Bids land in the open.",
    lede: "Independent operators price the job. Lowest honest bid on an attested machine takes it — and every offer, win or lose, is chain state.",
  },
  "bid-win": {
    chip: "Win mel",
    tag: "Win mel-gpu · 0.39 / hr",
    title: "The lease forms here.",
    lede: "The winning offer binds into a lease under escrow. Cheapest quoting an attested machine takes the job — 0.39 / hr beats the field.",
  },
  "bid-c": {
    chip: "Bid act",
    tag: "Bid act-hpc · 0.51 / hr",
    title: "Every offer is recorded.",
    lede: "act-hpc quotes 0.51 / hr. Placed beneath the lease and stored on chain, unreserved until usage is signed and settlement runs.",
  },
  escrow: {
    chip: "Escrow",
    tag: "Escrow — zero take",
    title: "Funds lock. Take is 0%.",
    lede: "Lease funds sit in escrow against signed usage. The marketplace takes no commission — 0% is the policy, not a discount.",
  },
  settle: {
    chip: "Settle",
    tag: "Settle — signed, then paid",
    title: "Metered usage, settled honestly.",
    lede: "The provider daemon meters workloads and batches signed usage records. After the 24-hour dispute window, settlement converts them into line items and pays out.",
  },
};