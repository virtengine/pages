import { MODULES } from "./modules";
import { LEARN } from "./learn";
import { SOLUTIONS } from "./solutions";
import { CURRENT_POSTS } from "./blog";
import { SITE } from "./site";

export type NavLink = { label: string; href: string; description: string };
export type NavCategory = { id: string; label: string; description: string; links: NavLink[] };
export type NavGroup = {
  id: string;
  label: string;
  overview: NavLink;
  categories: NavCategory[];
  /** Single compact footer CTA for the whole menu group — never per-category. */
  footer?: NavLink;
  footerNote?: string;
};
const link = (label: string, href: string, description: string): NavLink => ({ label, href, description });
const moduleLinks = (domain: string) => MODULES.filter(m => m.domain === domain).map(m => link(m.name, `/modules/${m.slug}`, m.summary));
const solutionLinks = (slugs: string[]) => SOLUTIONS.filter(s => slugs.includes(s.slug)).map(s => link(s.label, `/solutions/${s.slug}`, s.audience));
const findLearn = (slug: string) => {
  const g = LEARN.find(l => l.slug === slug);
  return g ? link(g.label, `/learn/${g.slug}`, g.kicker) : link(slug, `/learn/${slug}`, "");
};

export const NAV_GROUPS: NavGroup[] = [
  {
    id: "technology",
    label: "Technology",
    overview: link("Explore technology", "/protocol", "Architecture, integrations, and the complete module reference."),
    categories: [
      {
        id: "core",
        label: "Core",
        description: "Architecture and trust surfaces",
        links: [
          link("Protocol overview", "/protocol", "How the chain, providers, and workloads connect."),
          link("Module reference", "/modules", "All 27 on-chain modules."),
          link("VEID identity", "/veid", "Verifiable identity and privacy."),
          link("Waldur integration", "/waldur", "Catalogue and control-plane bridge."),
          link("Staking", "/staking", "Validators, delegation and risk."),
          link("Network status", "/network", "Planned stages and availability."),
        ],
      },
      {
        id: "implementation",
        label: "Explore implementation",
        description: "Reference modules",
        links: [
          link("Marketplace module", "/modules/market", "Order, match and lease state machine."),
          link("Provider module", "/modules/provider", "Registration and attributes."),
          link("Escrow", "/modules/escrow", "Funds held against leases."),
          link("Settlement", "/modules/settlement", "Usage into payments."),
          link("HPC", "/modules/hpc", "Scheduler-backed job market."),
          link("Governance", "/learn/governance-guide", "How protocol policy changes."),
        ],
      },
    ],
    footer: link("Docs ↗", SITE.docs, "Open the external implementation documentation."),
    footerNote: "27 on-chain modules · Open-source implementation",
  },
  {
    id: "marketplace",
    label: "Marketplace",
    overview: link("Marketplace overview", "/marketplace", "What the market sells — infrastructure, platforms, software, storage and custom services."),
    categories: [
      {
        id: "understand",
        label: "Understand",
        description: "How the market works",
        links: [
          link("Marketplace overview", "/marketplace", "What can be bought or sold."),
          link("How the marketplace works", "/learn/how-the-marketplace-works", "Order → Match → Lease → Usage → Settlement."),
          link("Three ways to buy", "/learn/three-ways-to-buy", "Direct, open bid or selector."),
          link("Anatomy of a listing", "/learn/anatomy-of-a-marketplace-listing", "Provider, plan, components and evidence."),
        ],
      },
      {
        id: "services",
        label: "Service types",
        description: "Catalogue categories",
        links: [
          link("IaaS", "/marketplace/iaas", "Infrastructure you operate."),
          link("PaaS", "/marketplace/paas", "Managed platforms you deploy onto."),
          link("SaaS", "/marketplace/saas", "Software sold as plans."),
          link("GPU compute", "/marketplace/gpu-compute", "Accelerators for training and inference."),
          link("HPC", "/marketplace/hpc", "Scheduler-backed queues and allocations."),
          link("Storage", "/marketplace/storage", "Block, object and archive capacity."),
          link("Custom listings", "/marketplace/custom-listings", "Provider-defined services."),
        ],
      },
      {
        id: "participate",
        label: "Participate",
        description: "Buyer and provider paths",
        links: [
          link("For tenants", "/tenants", "Source infrastructure without a single provider."),
          link("For providers", "/providers", "Requirements and onboarding."),
        ],
      },
    ],
    footer: link("New to VirtEngine? Start with the marketplace overview →", "/marketplace", "What the market contains."),
  },
  {
    id: "solutions",
    label: "Solutions",
    overview: link("All solutions", "/solutions", "Explore the protocol by audience and use case."),
    categories: [
      {
        id: "supply",
        label: "Supply infrastructure",
        description: "List capacity",
        links: [
          ...solutionLinks(["gpu-compute-providers", "datacenter-operators", "hpc-clusters"]),
        ],
      },
      {
        id: "use",
        label: "Use infrastructure",
        description: "Run workloads",
        links: [
          ...solutionLinks(["ai-ml-workloads", "enterprises-confidential-compute", "cost-optimized-cloud"]),
        ],
      },
      {
        id: "build",
        label: "Build & secure",
        description: "Operate and extend",
        links: [
          ...solutionLinks(["validators", "staking-partners", "token-holders", "web3-developers"]),
        ],
      },
    ],
  },
  {
    id: "learn",
    label: "Learn",
    overview: link("Browse learning library →", "/learn", "Guides, reference material, and project writing."),
    categories: [
      {
        id: "start",
        label: "Start here",
        description: "First four guides",
        links: [
          findLearn("how-the-marketplace-works"),
          findLearn("iaas-paas-saas-on-virtengine"),
          findLearn("what-is-veid"),
          findLearn("escrow-and-settlement-explained"),
        ],
      },
      {
        id: "deeper",
        label: "Go deeper",
        description: "Economics and infrastructure",
        links: [
          findLearn("tokenomics-explained"),
          findLearn("governance-guide"),
          findLearn("confidential-computing-on-virtengine"),
          findLearn("hpc-on-virtengine"),
          findLearn("provider-economics"),
        ],
      },
      {
        id: "reference",
        label: "Reference",
        description: "Lookup material",
        links: [
          findLearn("anatomy-of-a-marketplace-listing"),
          findLearn("marketplace-glossary"),
          link("FAQ", "/faq", "Answers about the project and its design."),
          link("Journal", "/blog", "Current notes on the protocol."),
        ],
      },
    ],
    footer: link("Browse learning library →", "/learn", "All guides by topic."),
  },
  {
    id: "foundation",
    label: "Foundation",
    overview: link("About the Foundation", "/about", "Public purpose, stewardship, and project history."),
    categories: [
      {
        id: "foundation-main",
        label: "Foundation",
        description: "Stewardship and participation",
        links: [
          link("About", "/about", "Mission, stewardship and history."),
          link("Activities", "/activities", "Education, software and research."),
          link("Participate", "/participate", "Find your path in."),
          link("Open source & IP", "/open-source", "Licence and IP notice."),
          link("Contact", "/contact", "Reach the Foundation."),
          link("DET.io ↗", "https://det.io", "The Foundation's wider work."),
        ],
      },
    ],
  },
];
const all = [link("Home", "/", "VirtEngine's mission, activities, and current status."),...NAV_GROUPS.flatMap(g=>[g.overview, ...(g.footer ? [g.footer] : []),...g.categories.flatMap(c=>c.links)])];
export const NAV_SEARCH: NavLink[] = Array.from(new Map(all.map(l=>[l.href,l])).values());
