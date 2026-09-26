/**
 * Structured-data (JSON-LD) builders for identity.org.au.
 *
 * The site is operated by DETIO FOUNDATION LTD, so the organisation entity is
 * declared with the *same* `@id` that det.io uses (https://det.io/#organization).
 * Two hosts describing one entity with one identifier is exactly how Google's
 * entity reconciliation is meant to work; inventing a second organisation node
 * here would split the entity instead.
 *
 * Facts come from src/data/site.ts. The site states plainly that this is an
 * independent community service, not a government service, and that the
 * foundation does not operate a central VEID verification service — the
 * markup repeats that framing rather than inventing a "government" provider.
 */

import { SITE } from "@data/site";

export type SchemaNode = Record<string, unknown>;

/** The operator entity, canonicalised on det.io. */
export const FOUNDATION_ID = "https://det.io/#organization";
export const ORG_ID = FOUNDATION_ID;
export const WEBSITE_ID = `${SITE.url}/#website`;
export const LOGO_ID = `${SITE.url}/#logo`;
export const WALLET_ID = `${SITE.url}/#wallet`;

export const LOGO_URL = new URL("/brand/logo.png", SITE.url).href;
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
    caption: "identity.org.au",
  };
}

/** DETIO FOUNDATION LTD — same entity, same @id as on det.io. */
export function organizationNode(): SchemaNode {
  return {
    "@type": ["Organization", "NGO"],
    "@id": FOUNDATION_ID,
    name: "DET.io Foundation",
    legalName: SITE.foundation,
    alternateName: ["DETIO FOUNDATION LTD", "DET.io"],
    url: "https://det.io",
    description:
      "Australian not-for-profit technology research organisation developing decentralized systems, including the VirtEngine protocol and the identity.org.au Identity Wallet.",
    email: SITE.email,
    slogan: "Open technology for public benefit",
    logo: { "@id": LOGO_ID },
    image: { "@id": LOGO_ID },
    identifier: [
      { "@type": "PropertyValue", propertyID: "ACN", name: "Australian Company Number", value: SITE.acn },
      { "@type": "PropertyValue", propertyID: "ABN", name: "Australian Business Number", value: SITE.abn },
    ],
    nonprofitStatus: "Nonprofit",
    address: { "@type": "PostalAddress", addressCountry: "AU" },
    areaServed: { "@type": "Country", name: "Australia" },
    sameAs: [
      "https://det.io",
      "https://virtengine.com",
      "https://docs.virtengine.com",
      SITE.github,
    ],
    knowsAbout: [
      "Privacy-preserving digital identity",
      "Verifiable credentials",
      "Zero-knowledge proofs",
      "Decentralized infrastructure",
    ],
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "general enquiries",
        email: SITE.email,
        availableLanguage: ["en"],
      },
      {
        "@type": "ContactPoint",
        contactType: "data protection enquiries",
        email: SITE.dpoEmail,
        availableLanguage: ["en"],
        url: abs("/privacy"),
      },
      {
        "@type": "ContactPoint",
        contactType: "security reports",
        email: SITE.securityEmail,
        availableLanguage: ["en"],
        url: abs("/security"),
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
    alternateName: "Identity Wallet",
    description: SITE.description,
    inLanguage: IN_LANGUAGE,
    publisher: { "@id": FOUNDATION_ID },
    about: { "@id": WALLET_ID },
  };
}

/**
 * The Identity Wallet itself. This is the site's primary subject, so it is
 * declared once and referenced by wallet pages rather than repeated per page.
 */
export function walletNode(): SchemaNode {
  return {
    "@type": ["SoftwareApplication", "WebApplication"],
    "@id": WALLET_ID,
    name: SITE.serviceName,
    alternateName: "identity.org.au Identity Wallet",
    applicationCategory: "UtilitiesApplication",
    applicationSubCategory: "Digital identity wallet",
    operatingSystem: "Web (my.identity.org.au), Android, iOS",
    url: SITE.url,
    description: SITE.description,
    disambiguatingDescription:
      "An independent community identity wallet operated by the not-for-profit DETIO FOUNDATION LTD. It is not a service of the Australian Government.",
    publisher: { "@id": FOUNDATION_ID },
    provider: { "@id": FOUNDATION_ID },
    license: "https://www.apache.org/licenses/LICENSE-2.0",
    isAccessibleForFree: true,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "AUD",
      description: "Free to use; no payment or subscription is required.",
    },
    featureList: [
      "Verify identity without handing over identity documents",
      "Selective disclosure and zero-knowledge proofs",
      "Consent management and revocation",
      "Reusable proofs for services on the VirtEngine network",
    ],
    softwareHelp: { "@type": "CreativeWork", url: abs("/help") },
    privacyPolicy: { "@type": "PrivacyPolicy", url: abs("/privacy") },
    termsOfService: abs("/terms-of-use"),
    sameAs: [SITE.github, SITE.patentUrl],
  };
}

export interface WebPageInput {
  canonical: string;
  title: string;
  description: string;
  image?: string;
  breadcrumbs?: { name: string; href: string }[];
  type?: string;
  dateModified?: string;
  /** What the page is about. Defaults to the wallet for service pages, else the operator. */
  aboutId?: string;
}

export function webPageNode({
  canonical,
  title,
  description,
  image = DEFAULT_IMAGE,
  breadcrumbs,
  type = "WebPage",
  dateModified,
  aboutId = WALLET_ID,
}: WebPageInput): SchemaNode {
  return {
    "@type": type,
    "@id": pageId(canonical),
    url: canonical,
    name: title,
    description,
    inLanguage: IN_LANGUAGE,
    isPartOf: { "@id": WEBSITE_ID },
    about: { "@id": aboutId },
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
  dateModified?: string;
  section?: string;
  image?: string;
  /** Insight articles are editorial explainers; help articles are documentation. */
  type?: "Article" | "TechArticle";
  about?: string[];
}

export function articleNode({
  canonical,
  title,
  description,
  dateModified,
  section,
  image = DEFAULT_IMAGE,
  type = "Article",
  about,
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
    // The site is clear that authorship is organisational, not a persona.
    // Google's author guidance: give the name, not an @id that could be merged
    // into another entity's name.
    author: { "@type": "Organization", name: "Identity.org.au editorial", url: SITE.url },
    publisher: { "@id": FOUNDATION_ID },
    image: imageObject(image, title),
    ...(dateModified ? { dateModified } : {}),
    ...(section ? { articleSection: section } : {}),
    ...(about && about.length > 0
      ? { about: about.map((topic) => ({ "@type": "Thing", name: topic })) }
      : {}),
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

/** ContactPage helpers: how to reach the operator and its data-protection contact. */
export function contactPageNode(canonical: string): SchemaNode {
  return {
    "@type": "ContactPage",
    "@id": pageId(canonical),
    url: canonical,
    name: "Contact identity.org.au",
    isPartOf: { "@id": WEBSITE_ID },
    mainEntity: { "@id": FOUNDATION_ID },
  };
}

export function schemaGraph(nodes: (SchemaNode | null | undefined | false)[]): SchemaNode {
  return {
    "@context": "https://schema.org",
    "@graph": nodes.filter((node): node is SchemaNode => Boolean(node)),
  };
}
