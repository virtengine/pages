import { MODULES } from "./modules";
import { LEARN } from "./learn";
import { SOLUTIONS } from "./solutions";
import { CURRENT_POSTS } from "./blog";
import { SITE } from "./site";

export type NavLink = { label: string; href: string; description: string };
export type NavCategory = { id: string; label: string; description: string; links: NavLink[]; feature: NavLink };
export type NavGroup = { id: string; label: string; overview: NavLink; categories: NavCategory[] };
const link = (label: string, href: string, description: string): NavLink => ({ label, href, description });
const network = link("Check network status", "/network", "The network is in development. Read the planned launch stages and approval criteria before preparing to participate.");
const intro = link("How the marketplace works", "/learn/how-the-marketplace-works", "Follow an agreement from request and bid through to recorded usage and settlement.");
const contribute = link("Find your contribution", "/participate", "Learn, review the code, improve a guide, or discuss a public-benefit collaboration.");
const moduleLinks = (domain: string) => MODULES.filter(m => m.domain === domain).map(m => link(m.name, `/modules/${m.slug}`, m.summary));
const solutionLinks = (slugs: string[]) => SOLUTIONS.filter(s => slugs.includes(s.slug)).map(s => link(s.label, `/solutions/${s.slug}`, s.audience));
export const NAV_GROUPS: NavGroup[] = [
 { id: "technology", label: "Technology", overview: link("Explore the protocol", "/protocol", "Architecture, integrations, and the complete module reference."), categories: [
  { id: "overview", label: "Protocol overview", description: "Understand the complete system", links: [link("Architecture", "/protocol", "How the chain, providers, and workloads connect."),link("Waldur integration", "/waldur", "The bridge between marketplace agreements and service delivery."),link("VEID identity", "/veid", "Verifiable identity and privacy in the protocol."),link("All 27 modules", "/modules", "Explore every module and its role in the system."),link("Network & launch status", "/network", "Planned stages, launch evidence, and availability.")], feature: intro },
  { id: "marketplace", label: "Marketplace & workloads", description: "Orders, capacity, and delivery", links: moduleLinks("Marketplace & workloads"), feature: link("Prepare to provide", "/providers", "Review the provider daemon, infrastructure requirements, and planned onboarding workflow.") },
  { id: "identity", label: "Identity & security", description: "Verification, privacy, and trust", links: moduleLinks("Identity & security"), feature: link("Understand VEID", "/learn/what-is-veid", "Start with the guide to verifiable electronic identity and how it supports network participation.") },
  { id: "economics", label: "Economics & settlement", description: "Usage, escrow, and network policy", links: moduleLinks("Economics & settlement"), feature: link("Escrow & settlement explained", "/learn/escrow-and-settlement-explained", "Understand how the protocol records usage and handles funds under a lease.") },
  { id: "governance", label: "Quality & governance", description: "Audits, reputation, and oversight", links: moduleLinks("Quality & governance"), feature: network },
 ]},
 { id: "solutions", label: "Solutions", overview: link("All solutions", "/solutions", "Explore the protocol by audience and use case."), categories: [
  { id: "operators", label: "Infrastructure providers", description: "Datacenters, GPUs, and HPC", links: [link("Provider overview", "/providers", "Requirements and preparation for future participation."), ...solutionLinks(["gpu-compute-providers","datacenter-operators","hpc-clusters"])], feature: network },
  { id: "workloads", label: "Computing workloads", description: "AI, privacy, and cloud economics", links: solutionLinks(["ai-ml-workloads","enterprises-confidential-compute","cost-optimized-cloud"]), feature: intro },
  { id: "participants", label: "Network participants", description: "Developers, validators, and delegates", links: [link("Staking & validator overview", "/staking", "Roles, operational duties, and risks."), ...solutionLinks(["validators","staking-partners","token-holders","web3-developers"])], feature: network },
 ]},
 { id: "resources", label: "Resources", overview: link("Explore the learning library", "/learn", "Guides, reference material, and project writing."), categories: [
  { id: "start", label: "Start here", description: "A clear first path into VirtEngine", links: [intro,link("Frequently asked questions", "/faq", "Answers about the project and its design."),link("Learning library", "/learn", "Browse all explanations by topic."),link("Development updates", "/launch", "What the planned launch stages mean.")], feature: contribute },
  { id: "guides", label: "All explainers", description: "Find a guide by topic", links: LEARN.map(g=>link(g.label, `/learn/${g.slug}`, g.kicker)), feature: link("Go deeper into the implementation", "/modules", "Connect the ideas in each guide to the module reference and source.") },
  { id: "journal", label: "Journal & history", description: "Current writing and the archive", links: [link("Latest journal articles", "/blog", "Current notes on the protocol and its development."),...CURRENT_POSTS.map(p=>link(p.title,`/blog/${p.slug}`,p.description)),link("Historic archive · 2015–2016", "/blog/archive", "Earlier project writing; not current technical guidance.")], feature: link("From DET.io to the Foundation", "/about", "Learn about the project's origins and its public-benefit stewardship.") },
  { id: "developers", label: "Developer resources", description: "Build, inspect, and contribute", links: [link("Technical documentation ↗", SITE.docs, "Open the external implementation documentation."),link("Source code on GitHub ↗", SITE.github, "Inspect the repository and its contribution instructions."),link("Open-source licence & IP", "/open-source", "Understand Apache 2.0 and the project’s IP notice."),link("Contribution pathway", "/participate#developers", "How to make a useful code or documentation contribution.")], feature: link("Browse the module reference", "/modules", "Every module has its own description, concepts, and connections.") },
 ]},
 { id: "foundation", label: "Foundation", overview: link("About the Foundation", "/about", "Our public purpose, stewardship, and project history."), categories: [
  { id: "mission", label: "Mission & stewardship", description: "Who we are and why we build", links: [link("Our mission & people served", "/about", "The Foundation’s purpose, activities, and intended beneficiaries."),link("Open source & intellectual property", "/open-source", "Licensing and the relationship between open code and patents."),link("DETIO Foundation website ↗", "https://det.io", "Explore the Foundation’s wider work.")], feature: contribute },
  { id: "involved", label: "Get involved", description: "Choose a practical next step", links: [link("All participation paths", "/participate", "Find your way into the project."),link("Learn about the technology", "/participate#learners", "A starting point for students and curious readers."),link("Contribute code or documentation", "/participate#developers", "Read, review, and improve the open-source project."),link("Prepare as an operator", "/participate#operators", "Explore the requirements for future network participation."),link("Discuss a collaboration", "/participate#collaborators", "Bring a research or public-benefit question.")], feature: network },
  { id: "contact", label: "Contact & activities", description: "Our work and how to reach us", links: [link("Our activities", "/activities", "Open education, software development, and privacy research."), link("Contact the Foundation", "/contact", "General enquiries, licensing, and technical contributions."), link("Launch updates", "/launch", "Follow confirmed release and network announcements.")], feature: contribute },
 ]},
];
const all = [link("Home", "/", "VirtEngine’s mission, activities, and current status."),...NAV_GROUPS.flatMap(g=>[g.overview,...g.categories.flatMap(c=>[...c.links,c.feature])])];
export const NAV_SEARCH: NavLink[] = Array.from(new Map(all.map(l=>[l.href,l])).values());
