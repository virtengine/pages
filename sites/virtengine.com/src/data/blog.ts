import legacyPosts from "./legacy-blog.json";

export interface BlogArticle {
  slug: string;
  title: string;
  description: string;
  author: string;
  publishedAt: string;
  readingTime: string;
  originalUrl?: string;
  legacyIndexPage?: number;
  kind: "current" | "legacy";
  html: string;
}

export const CURRENT_POSTS: BlogArticle[] = [
  {
    slug: "from-cloud-platform-to-decentralized-marketplace",
    title: "From Cloud Platform to Decentralized Marketplace (2026)",
    description:
      "How VirtEngine's early cloud-management work evolved into an open DePIN protocol for verifiable GPU and cloud infrastructure markets.",
    author: "VirtEngine Foundation",
    publishedAt: "2026-09-01T00:00:00.000Z",
    readingTime: "6 minutes",
    kind: "current",
    html: `
      <p>VirtEngine began with a practical question: how can infrastructure from many providers feel like one usable cloud? The historic posts in this journal document that first chapter—service catalogues, billing, orchestration, and the operational work required to connect heterogeneous systems.</p>
      <p>The protocol being built today carries that experience into a different architecture. Instead of asking one platform operator to own the catalogue, matching, settlement, and trust layer, VirtEngine defines those responsibilities as open protocol surfaces.</p>
      <h2>The marketplace is a state machine</h2>
      <p>A tenant describes the resources it needs in an order — naming a listing at its published price, opening demand to competing bids, or resolving by attribute match. The match becomes a lease, usage records are submitted, and escrowed funds settle after the dispute window. These stages are explicit on-chain state rather than private records held by a marketplace operator.</p>
      <p>That distinction matters. A provider can participate without handing its commercial relationship to a central intermediary, while a tenant gets an auditable record of what was ordered, supplied, and settled.</p>
      <h2>Operations still happen where infrastructure lives</h2>
      <p>Decentralization does not make hypervisors, Kubernetes clusters, schedulers, or support desks disappear. Provider daemons translate agreed leases into work on those systems. Integrations such as Waldur provide the service-management layer around fulfilment, accounting, and provider operations.</p>
      <p>The chain coordinates the agreement; provider-side systems perform the work. Keeping that boundary clear makes the protocol useful across public cloud, private cloud, edge, GPU, storage, and HPC environments.</p>
      <h2>Trust becomes evidence</h2>
      <p>Open participation needs more than a wallet address. VirtEngine combines provider attributes, audits, benchmarks, encrypted identity verification, usage records, reviews, and dispute processes. The aim is not to eliminate trust, but to make the evidence behind trust portable and inspectable.</p>
      <h2>One history, one home</h2>
      <p>The legacy VirtEngine blog is now preserved in this journal alongside current protocol writing. The old articles remain unchanged as a historical record, with a clear archive notice because their commands, dependencies, products, and security guidance may no longer be current.</p>
      <p>For the current system, start with the <a href="/protocol">protocol overview</a>, explore the <a href="/modules">module map</a>, or use the <a href="https://docs.virtengine.com" target="_blank" rel="noopener noreferrer">technical documentation</a>.</p>
    `,
  },
  {
    slug: "why-cloud-marketplace-settlement-belongs-on-chain",
    title: "Why Cloud Settlement Belongs On-Chain: Escrow & Proof",
    description:
      "Orders, bids, leases, metered usage and escrow: why transparent on-chain settlement beats operator-run billing in open GPU and cloud markets.",
    author: "VirtEngine Foundation",
    publishedAt: "2026-08-28T00:00:00.000Z",
    readingTime: "7 minutes",
    kind: "current",
    html: `
      <p>Most cloud marketplaces combine discovery, contracting, metering, and payment inside one company's database. That can be convenient, but every participant must accept the operator's view of the transaction—and the operator becomes the commercial gatekeeper.</p>
      <p>VirtEngine separates those responsibilities. The protocol records the agreement and settlement lifecycle, while providers retain control of the infrastructure that fulfils it.</p>
      <h2>Agreement before execution</h2>
      <p>The lifecycle begins with an order that expresses required resources and attributes — it can name a provider's listing at its published price, open demand to competing bids, or resolve by attribute matching. However the match is made, the resulting lease fixes the relationship between the parties before a workload is provisioned.</p>
      <p>This creates a shared reference point. The provider daemon, tenant tooling, and chain all work from the same lease rather than reconciling separate private order records later.</p>
      <h2>Metered usage, signed at the source</h2>
      <p>Running infrastructure produces usage records. Provider-side software submits signed measurements against the lease, allowing settlement to follow the actual service delivered. Different execution environments can keep their native operational tooling while presenting a consistent accounting surface to the protocol.</p>
      <h2>Escrow changes the risk model</h2>
      <p>Escrow reserves funds for an active lease. After usage is submitted, a dispute window gives participants time to challenge the record before the agreed amount is released. This does not remove commercial risk, but it makes the payment path and its timing explicit.</p>
      <h2>Transparent economics</h2>
      <p>The marketplace settlement policy is a governed protocol parameter, not a private platform toll — providers keep the agreed amount minus whatever rate stakeholders have voted. Network transaction fees and the costs of operating infrastructure still exist, but the protocol does not need an operator's percentage skim on every lease to coordinate the market.</p>
      <p>The result is a marketplace primitive that can sit underneath many experiences: a developer-facing deployment interface, an enterprise service catalogue, an HPC queue, or a specialised regional cloud exchange.</p>
      <p>See the complete <a href="/learn/how-the-marketplace-works">marketplace walkthrough</a> and the <a href="/learn/tokenomics-explained">tokenomics explainer</a> for the surrounding mechanics.</p>
    `,
  },
  {
    slug: "verifiable-identity-for-decentralized-infrastructure",
    title: "Verifiable Identity for Decentralized Cloud (VEID)",
    description:
      "Why open GPU and cloud markets need privacy-preserving identity: active liveness, scoped verification, validator scoring and ZK proofs.",
    author: "VirtEngine Foundation",
    publishedAt: "2026-08-21T00:00:00.000Z",
    readingTime: "6 minutes",
    kind: "current",
    html: `
      <p>Infrastructure is a high-consequence market. Tenants may run sensitive workloads, providers expose valuable capacity, and validators help secure settlement. Pseudonymous accounts alone cannot answer every question participants need to ask about counterparties.</p>
      <p>At the same time, publishing identity documents to a public ledger would be a serious privacy failure. VirtEngine's identity layer, VEID, is designed around evidence and scoped verification rather than public document storage.</p>
      <h2>Capture should prove presence</h2>
      <p>Identity assurance starts before a document is analysed. On-device capture and active liveness checks help establish that a real person is present and responding during the verification flow. This reduces the value of replayed media and static submissions.</p>
      <h2>Sensitive inputs stay encrypted</h2>
      <p>Identity material is encrypted for the validators authorised to assess it. Validators evaluate required scopes and submit results; the public protocol records the resulting verification state and trust signals, not a readable copy of the applicant's documents.</p>
      <p>That separation lets the network use identity evidence without turning the chain into a central repository of personal data.</p>
      <h2>Verification is scoped</h2>
      <p>Different roles need different evidence. A tenant account, an infrastructure provider, and a validator do not necessarily require the same checks. Scoped verification makes the policy legible: participants can see which requirements were satisfied without assuming that one universal score answers every risk question.</p>
      <h2>Identity is one signal among many</h2>
      <p>Identity does not replace provider audits, hardware benchmarks, performance history, reviews, or dispute records. It complements them. A resilient trust model combines who a participant has proven itself to be with evidence about what it can deliver and how it has behaved.</p>
      <p>Explore the <a href="/veid">VEID overview</a> or read the <a href="https://docs.virtengine.com" target="_blank" rel="noopener noreferrer">implementation documentation</a> for the technical path.</p>
    `,
  },
];

export const LEGACY_POSTS: BlogArticle[] = legacyPosts.map((post) => ({
  ...post,
  kind: "legacy" as const,
}));

export const ALL_POSTS = [...CURRENT_POSTS, ...LEGACY_POSTS].sort(
  (a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt),
);

export const ARCHIVE_PAGE_SIZE = 5;
export const ARCHIVE_PAGES = Array.from(
  { length: Math.ceil(LEGACY_POSTS.length / ARCHIVE_PAGE_SIZE) },
  (_, index) => LEGACY_POSTS.slice(index * ARCHIVE_PAGE_SIZE, (index + 1) * ARCHIVE_PAGE_SIZE),
);

export function formatBlogDate(value: string): string {
  return new Intl.DateTimeFormat("en-AU", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(value));
}
