/**
 * Structured-data (JSON-LD) builders for virtengine.com.
 *
 * Every page emits a single `@graph` document from Base.astro. Nodes are
 * referenced by stable `@id`s so Google can link the site entity, its pages,
 * breadcrumbs and articles into one knowledge graph instead of reading a pile
 * of unrelated blobs.
 *
 * Rules kept here:
 * - Absolute URLs only (Google ignores relative values in JSON-LD).
 * - One canonical host: every `@id` is derived from the canonical URL of the
 *   page it describes, so a page can never describe another page's entity.
 * - Facts come from src/data/site.ts and src/data/*.ts; nothing is invented.
 */

import { SITE } from "@data/site";

export type SchemaNode = Record<string, unknown>;

/** Stable entity ids. */
export const ORG_ID = `${SITE.url}/#organization`;
export const WEBSITE_ID = `${SITE.url}/#website`;
export const LOGO_ID = `${SITE.url}/#logo`;

export const LOGO_URL = new URL("/brand/virtengine-icon.png", SITE.url).href;
export const DEFAULT_IMAGE = new URL("/og.png", SITE.url).href;

export const IN_LANGUAGE = "en";

/** Resolve any site-relative path to an absolute URL on the canonical host. */
export function abs(pathOrUrl: string): string {
  return new URL(pathOrUrl, SITE.url).href;
}

export function pageId(canonical: string): string {
  return `${canonical}#webpage`;
}

export function breadcrumbId(canonical: string): string {
  return `${canonical}#breadcrumb`;
}

export function articleId(canonical: string): string {
  return `${canonical}#article`;
}

export function faqId(canonical: string): string {
  return `${canonical}#faq`;
}

export function imageObject(url: string, caption?: string, alt?: string): SchemaNode {
  return {
    "@type": "ImageObject",
    url,
    contentUrl: url,
    width: 1200,
    height: 630,
    ...(caption ? { caption } : {}),
    ...(alt ? { name: alt, description: alt } : {}),
  };
}

/** The brand logo, declared once so Organization.logo/image can reference it. */
export function logoNode(): SchemaNode {
  return {
    "@type": "ImageObject",
    "@id": LOGO_ID,
    url: LOGO_URL,
    contentUrl: LOGO_URL,
    caption: SITE.name,
  };
}

/** The publisher entity: the VirtEngine project and its parent foundation. */
export function organizationNode(): SchemaNode {
  return {
    "@type": "Organization",
    "@id": ORG_ID,
    name: SITE.name,
    alternateName: ["VirtEngine Protocol", "virtengine.com"],
    url: SITE.url,
    description: SITE.description,
    email: SITE.email,
    logo: { "@id": LOGO_ID },
    image: { "@id": LOGO_ID },
    slogan: "The open-source decentralized cloud marketplace protocol",
    knowsAbout: [
      "Decentralized cloud computing",
      "Cloud marketplace protocols",
      "Confidential computing and enclaves",
      "Verifiable identity (VEID)",
      "Escrow and usage-based settlement",
      "High-performance computing (HPC) workloads",
      "Cosmos SDK and CometBFT",
    ],
    sameAs: [SITE.github, SITE.docs, "https://det.io", "https://identity.org.au"],
    // VirtEngine is a program of DETIO FOUNDATION LTD (ACN 699 651 771).
    parentOrganization: {
      "@type": "Organization",
      "@id": "https://det.io/#organization",
      name: "DETIO FOUNDATION LTD",
      url: "https://det.io",
      identifier: "ACN 699 651 771",
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "general enquiries",
        email: SITE.email,
        availableLanguage: ["en"],
        url: abs("/contact"),
      },
    ],
  };
}

export function webSiteNode(): SchemaNode {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: SITE.url,
    name: SITE.name,
    alternateName: "VirtEngine Protocol",
    description: SITE.description,
    inLanguage: IN_LANGUAGE,
    publisher: { "@id": ORG_ID },
  };
}

export interface WebPageInput {
  canonical: string;
  title: string;
  description: string;
  image?: string;
  breadcrumbs?: { name: string; href: string }[];
  datePublished?: string;
  dateModified?: string;
  /** Extra `@type` values, e.g. ["FAQPage"] for pages that only exist as one. */
  pageType?: string[];
}

export function webPageNode({
  canonical,
  title,
  description,
  image = DEFAULT_IMAGE,
  breadcrumbs,
  datePublished,
  dateModified,
}: WebPageInput): SchemaNode {
  return {
    "@type": "WebPage",
    "@id": pageId(canonical),
    url: canonical,
    name: title,
    description,
    inLanguage: IN_LANGUAGE,
    isPartOf: { "@id": WEBSITE_ID },
    about: { "@id": ORG_ID },
    primaryImageOfPage: imageObject(image, title),
    ...(breadcrumbs && breadcrumbs.length > 0
      ? { breadcrumb: { "@id": breadcrumbId(canonical) } }
      : {}),
    ...(datePublished ? { datePublished } : {}),
    ...(dateModified ? { dateModified } : {}),
  };
}

export function breadcrumbNode(
  canonical: string,
  crumbs: { name: string; href: string }[],
): SchemaNode {
  return {
    "@type": "BreadcrumbList",
    "@id": breadcrumbId(canonical),
    itemListElement: crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: { "@type": "WebPage", "@id": pageId(abs(crumb.href)), url: abs(crumb.href) },
    })),
  };
}

export interface ArticleInput {
  canonical: string;
  title: string;
  description: string;
  datePublished: string;
  dateModified?: string;
  authorName: string;
  /** schema.org author type. Journal posts are organisation-authored. */
  authorType?: "Organization" | "Person";
  section?: string;
  image?: string;
  /** "Article" (blog), "TechArticle" (explainer/guide), "NewsArticle". */
  type?: "Article" | "TechArticle" | "NewsArticle" | "BlogPosting";
  about?: string[];
  words?: number;
}

export function articleNode({
  canonical,
  title,
  description,
  datePublished,
  dateModified,
  authorName,
  authorType = "Organization",
  section,
  image = DEFAULT_IMAGE,
  type = "Article",
  about,
}: ArticleInput): SchemaNode {
  const author: SchemaNode =
    authorType === "Organization"
      ? { "@type": "Organization", name: authorName, ...(authorName === SITE.name ? { url: SITE.url } : {}) }
      : { "@type": "Person", name: authorName };

  return {
    "@type": type,
    "@id": articleId(canonical),
    isPartOf: { "@id": pageId(canonical) },
    mainEntityOfPage: { "@id": pageId(canonical) },
    url: canonical,
    headline: title.length > 110 ? `${title.slice(0, 107)}...` : title,
    name: title,
    description,
    inLanguage: IN_LANGUAGE,
    datePublished,
    dateModified: dateModified ?? datePublished,
    author,
    publisher: { "@id": ORG_ID },
    image: imageObject(image, title),
    ...(section ? { articleSection: section } : {}),
    ...(about && about.length > 0 ? { about: about.map((topic) => ({ "@type": "Thing", name: topic })) } : {}),
    // VirtEngine content is free to read: no paywall signals needed.
    isAccessibleForFree: true,
  };
}

export function faqPageNode(
  canonical: string,
  items: { question: string; answer: string }[],
): SchemaNode {
  return {
    "@type": "FAQPage",
    "@id": faqId(canonical),
    isPartOf: { "@id": pageId(canonical) },
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

/**
 * The protocol itself, described once on the home page. Kept deliberately
 * factual: no aggregateRating, no offer, no review — those would be invented.
 */
export function softwareApplicationNode(canonical: string): SchemaNode {
  return {
    "@type": "SoftwareApplication",
    "@id": `${SITE.url}/#software`,
    name: "VirtEngine Protocol",
    applicationCategory: "BusinessApplication",
    applicationSubCategory: "Decentralized cloud compute marketplace",
    operatingSystem: "Linux, macOS, Windows (client tooling)",
    url: SITE.url,
    downloadUrl: SITE.github,
    softwareHelp: { "@type": "CreativeWork", url: SITE.docs },
    license: "https://www.apache.org/licenses/LICENSE-2.0",
    isAccessibleForFree: true,
    description: SITE.description,
    publisher: { "@id": ORG_ID },
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD", description: "Apache 2.0 open-source software" },
    mainEntityOfPage: { "@id": pageId(canonical) },
  };
}

/** Assemble the document. Falsy nodes are dropped so callers can inline conditionals. */
export function schemaGraph(nodes: (SchemaNode | null | undefined | false)[]): SchemaNode {
  return {
    "@context": "https://schema.org",
    "@graph": nodes.filter((node): node is SchemaNode => Boolean(node)),
  };
}
