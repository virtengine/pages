import { CONSTITUTION_TOPICS } from "./constitution";
import { FOUNDATION_PAGES } from "./foundation";
import { RESEARCH_TOPICS } from "./research";

const link = (label: string, href: string, description: string) => ({ label, href, description });
const mission = link("Our mission", "/mission", "Education, digital rights, secure infrastructure, and technology safety.");
const activities = link("What we do", "/activities", "See our current activities, available resources, and intended public benefit.");
const participate = link("Find your contribution", "/participate", "Learn, improve open-source work, or discuss a research question.");
const transparency = link("Our public record", "/transparency", "Published materials, funding disclosures, and the limits of current evidence.");
const programs = [
  link("VirtEngine", "/research/virtengine", "Open cloud infrastructure and transparent computing markets."),
  link("DSEMA", "/research/dsema", "Research into accountable, self-evolving multi-agent AI."),
  link("Bosun", "/research/bosun", "Experimental open-source tools for supervised agent engineering."),
  link("Identity & VEID", "/research/identity", "Verifiable identity and privacy-preserving protocol design."),
];
const constitution = CONSTITUTION_TOPICS.map(t => link(t.title, `/constitution/${t.slug}`, t.question));
export const NAV_GROUPS = [
  { id: "foundation", label: "Foundation", overview: mission, categories: [
    { id: "purpose", label: "Purpose & people", description: "Understand the institution", links: [mission, activities, link("Who we are", "/foundation/who-we-are", "Our legal identity, origins, and people identified in the constitution."), link("Foundation overview", "/foundation", "Explore how the organisation works.")], feature: participate },
    { id: "accountability", label: "Governance & transparency", description: "How decisions are made", links: [link("Governance", "/governance", "The board, membership, consent gates, and public-benefit commitments."), transparency, ...FOUNDATION_PAGES.filter(p => ["public-benefit-lock", "intellectual-property-stewardship", "code-of-conduct"].includes(p.slug)).map(p => link(p.title, `/foundation/${p.slug}`, p.summary))], feature: mission },
  ]},
  { id: "work", label: "Our work", overview: activities, categories: [
    { id: "programs", label: "Technology programs", description: "Four connected areas of work", links: programs, feature: activities },
    { id: "research", label: "Research questions", description: "Explore the underlying ideas", links: RESEARCH_TOPICS.map(t => link(t.title, `/research/${t.slug}`, t.question)), feature: link("Research portfolio", "/research", "Follow the questions, methods, and published artifacts across our programs.") },
  ]},
  { id: "resources", label: "Resources", overview: link("Explore our resources", "/activities#education", "Open learning materials, software, and constitutional explanations."), categories: [
    { id: "learning", label: "Learn & build", description: "Public resources to use today", links: [link("Learning pathways", "/participate#learn", "Start with an accessible guide or a research question."), link("VirtEngine learning library ↗", "https://virtengine.com/learn", "Guides to cloud marketplaces, identity, and settlement."), link("Technical documentation ↗", "https://docs.virtengine.com", "Implementation and operator documentation."), link("VirtEngine source ↗", "https://github.com/virtengine/virtengine", "Explore the protocol implementation."), link("Bosun source ↗", "https://github.com/virtengine/bosun", "Inspect the experimental agent orchestrator."), link("Frequently asked questions", "/faq", "Plain-language answers about the Foundation and its work.")], feature: participate },
    { id: "constitution", label: "Constitution explorer", description: "All ten topics in plain language", links: constitution, feature: link("Start with the constitution", "/constitution", "Read topic summaries with references to the underlying clauses.") },
    { id: "records", label: "Records & updates", description: "Check status and evidence", links: [transparency, link("Launch updates", "/launch", "Subscribe for confirmed VirtEngine launch and release updates."), link("Program status", "/activities#progress", "Separate research, experimental software, and planned network services.")], feature: mission },
  ]},
  { id: "involved", label: "Get involved", overview: participate, categories: [
    { id: "contribute", label: "Learn & contribute", description: "Choose a practical next step", links: [participate, link("For learners", "/participate#learn", "Read, compare, and question the published designs."), link("For developers", "/participate#contribute", "Improve code, tests, documentation, or a reproducible issue."), link("For researchers", "/participate#collaborate", "Bring a defined question and a public-benefit objective."), link("For infrastructure operators", "/participate#operators", "Study integration requirements and planned network availability.")], feature: activities },
    { id: "contact", label: "Contact & membership", description: "Reach the Foundation", links: [link("Contact us", "/contact", "Research enquiries, project questions, and Foundation correspondence."), link("Membership explained", "/foundation/membership", "Eligibility, application requirements, and constitutional limits."), link("Membership rules", "/constitution/members-and-membership", "Read the distinction between contribution and formal membership.")], feature: transparency },
  ]},
];
export const NAV_SEARCH = Array.from(new Map([link("Home", "/", "DET.io Foundation: open technology for public benefit."), ...NAV_GROUPS.flatMap(g => [g.overview, ...g.categories.flatMap(c => [...c.links, c.feature])])].map(l => [l.href, l])).values());
