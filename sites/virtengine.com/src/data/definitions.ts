/**
 * Definitions - the "what is X" hub powering /definitions/[slug].
 *
 * Editorial rules (SEO-PLAN.md; DESIGN.md 10): evergreen, neutral-factual in
 * the definition sections, no invented statistics or dates, engineering candor.
 * Each entry maps to exactly one primary search query (see SEO-PLAN.md
 * "Keyword -> page map"). Paragraph strings may contain inline HTML links
 * (internal cross-links only) - rendered with set:html by
 * /definitions/[slug].astro, author-controlled content from this file.
 *
 * The `faq` block must render visibly on the page: FAQPage JSON-LD is emitted
 * from it, and Google requires marked-up questions to be visible on the page.
 */
import type { MediaSlug } from "@data/media";
import { DEFINITIONS_GSC } from "./definitions-gsc";
import { DEFINITIONS_TIER_A } from "./definitions-tier-a";
import { DEFINITIONS_TIER_B } from "./definitions-tier-b";

export type DefinitionGroup =
  | "Open source & hybrid cloud"
  | "Service models"
  | "Infrastructure"
  | "AI & GPU compute"
  | "HPC"
  | "Marketplace & protocol";

export interface DefinitionSection {
  /** Omit on the first (definition) block - it opens the article bare. */
  heading?: string;
  /** Paragraphs may contain inline <a href> and <strong> HTML. */
  paragraphs?: string[];
  list?: string[];
  /** Rendered after the list - typically the cross-links out. */
  after?: string[];
}

export interface DefinitionFaq {
  question: string;
  answer: string;
}

export interface DefinitionEntry {
  slug: string;
  /** Page H1 and title seed, phrased as the query: "What is ... ?" */
  term: string;
  /** Meta description, unique, <=158 chars (fitTitle/metaDescription shape it). */
  summary: string;
  group: DefinitionGroup;
  /** Hero photography (brand media manifest). */
  media: MediaSlug;
  mediaCaption: string;
  sections: DefinitionSection[];
  faq: DefinitionFaq[];
  /** Slugs within this hub for the related rail (3-5). */
  related: string[];
  /** The money page this definition funnels into. */
  funnel: { label: string; href: string };
  /** 1-2 entry-specific sentences for the "in practice" box - never boilerplate. */
  practice: string;
}

/** Hub sections, in render order. */
export const DEFINITION_GROUPS: { group: DefinitionGroup; blurb: string }[] = [
  {
    group: "Open source & hybrid cloud",
    blurb:
      "Platforms you run yourself, private cloud, hybrid patterns, and the open control plane that manages them.",
  },
  {
    group: "Service models",
    blurb: "IaaS, PaaS, SaaS and serverless - what you operate versus what the provider runs.",
  },
  {
    group: "Infrastructure",
    blurb: "Virtual machines, containers, storage and bare metal - the building blocks under every listing.",
  },
  {
    group: "AI & GPU compute",
    blurb: "Inference, training and GPU-as-a-service - the workloads driving the compute market.",
  },
  {
    group: "HPC",
    blurb: "Batch schedulers and cluster computing - supercomputing bought by the job.",
  },
  {
    group: "Marketplace & protocol",
    blurb: "Compute marketplaces, usage-based billing and the decentralised cloud category VirtEngine sits in.",
  },
];

export const DEFINITIONS: DefinitionEntry[] = [
  ...DEFINITIONS_GSC,
  ...DEFINITIONS_TIER_A,
  ...DEFINITIONS_TIER_B,
];

export function getDefinition(slug: string): DefinitionEntry | undefined {
  return DEFINITIONS.find((entry) => entry.slug === slug);
}
