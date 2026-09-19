/**
 * Structured-data (JSON-LD) builders for det.io.
 *
 * Base.astro emits one `@graph` per page with stable `@id`s so Google can link
 * the DETIO FOUNDATION LTD entity, the site, its pages, breadcrumbs and the
 * research/constitution articles into a single knowledge graph.
 *
 * Facts are drawn from src/data/site.ts (ACN 699 651 771, ABN 53 699 651 771,
 * Australia) and the published constitution pages. Nothing is asserted that the
 * site does not already state — in particular, no charity registration claim.
 */

import { SITE } from "@data/site";

export type SchemaNode = Record<string, unknown>;

export const ORG_ID = `${SITE.url}/#organization`;
export const WEBSITE_ID = `${SITE.url}/#website`;
export const LOGO_ID = `${SITE.url}/#logo`;

export const LOGO_URL = new URL("/images/detio-logo.png", SITE.url).href;
export const DEFAULT_IMAGE = new URL("/og.png", SITE.url).href;

export const IN_LANGUAGE = "en-AU";

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

export function imageObject(url: string, caption?: string): SchemaNode {
  return {
    "@type": "ImageObject",
    url,
    contentUrl: url,
    width: 1200,
    height: 630,
    ...(caption ? { caption } : {}),
  };
}

export function logoNode(): SchemaNode {
  return {
    "@type": "ImageObject",
    "@id": LOGO_ID,
    url: LOGO_URL,
    contentUrl: LOGO_URL,
    caption: SITE.legalName,
  };
}

/** The organisation: an Australian not-for-profit company limited by guarantee. */
export function organizationNode(): SchemaNode {
  return {
    "@type": ["Organization", "NGO"],
    "@id": ORG_ID,
    name: SITE.name,
    legalName: SITE.legalName,
    alternateName: ["DET.io", "DET.io Foundation", "Digital Elastic Technologies, Internet Organization"],
    url: SITE.url,
    description: SITE.description,
    email: SITE.email,
    slogan: "Open technology for public benefit",
    logo: { "@id": LOGO_ID },
    image: { "@id": LOGO_ID },
    identifier: [
      { "@type": "PropertyValue", propertyID: "ACN", name: "Australian Company Number", value: SITE.acn },
      { "@type": "PropertyValue", propertyID: "ABN", name: "Australian Business Number", value: SITE.abn },
    ],
    nonprofitStatus: "Nonprofit",
    // The constitution states the company is established for charitable and
    // public-benefit purposes and *may* apply for ACNC registration; until that
    // registration exists, claiming CharityStatus would be inaccurate.
    address: {
      "@type": "PostalAddress",
      addressCountry: "AU",
    },
    areaServed: { "@type": "Country", name: "Australia" },
    knowsAbout: [
      "Decentralized cloud computing",
      "Privacy-preserving digital identity",
      "Multi-agent AI safety and accountability",
      "Open-source infrastructure research",
      "Nonprofit technology stewardship",
    ],
    sameAs: [
      SITE.github,
      SITE.bosunSite,
      SITE.bosunGithub,
      SITE.bosunNpm,
      "https://virtengine.com",
      "https://docs.virtengine.com",
      "https://identity.org.au",
    ],
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
    alternateName: "DET.io",
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
  /** "WebPage" | "CollectionPage" | "AboutPage" | "ContactPage" ... */
  type?: string;
  dateModified?: string;
}

export function webPageNode({
  canonical,
  title,
  description,
  image = DEFAULT_IMAGE,
  breadcrumbs,
  type = "WebPage",
  dateModified,
}: WebPageInput): SchemaNode {
  return {
    "@type": type,
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
  section?: string;
  image?: string;
  /** "Article" for explainers, "TechArticle" for technical documentation. */
  type?: "Article" | "TechArticle";
  about?: { name: string; url?: string }[];
  dateModified?: string;
}

/** Long-form explainers: constitution topics, research topics, foundation pages. */
export function articleNode({
  canonical,
  title,
  description,
  section,
  image = DEFAULT_IMAGE,
  type = "Article",
  about,
  dateModified,
}: ArticleInput): SchemaNode {
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
    author: { "@type": "Organization", "@id": ORG_ID },
    publisher: { "@id": ORG_ID },
    image: imageObject(image, title),
    ...(section ? { articleSection: section } : {}),
    ...(about && about.length > 0
      ? { about: about.map((topic) => ({ "@type": "Thing", name: topic.name, ...(topic.url ? { url: topic.url } : {}) })) }
      : {}),
    ...(dateModified ? { dateModified } : {}),
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

/** Index pages list the site's own sub-pages, expressed as an ItemList. */
export function itemListNode(
  canonical: string,
  name: string,
  items: { name: string; href: string; description?: string }[],
): SchemaNode {
  return {
    "@type": "ItemList",
    "@id": `${canonical}#itemlist`,
    name,
    numberOfItems: items.length,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      url: abs(item.href),
      ...(item.description ? { description: item.description } : {}),
    })),
    isPartOf: { "@id": pageId(canonical) },
  };
}

export function schemaGraph(nodes: (SchemaNode | null | undefined | false)[]): SchemaNode {
  return {
    "@context": "https://schema.org",
    "@graph": nodes.filter((node): node is SchemaNode => Boolean(node)),
  };
}
