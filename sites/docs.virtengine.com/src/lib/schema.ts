/**
 * Structured-data (JSON-LD) builders for docs.virtengine.com.
 *
 * The documentation site shares its entities with virtengine.com by reusing the
 * same `@id`s (https://virtengine.com/#organization, /#website), so Google reads
 * one VirtEngine entity across both hosts rather than two unrelated sites.
 *
 * Wired up through a Starlight `Head` component override, which has access to
 * the current route's frontmatter, sidebar trail, and last-updated date.
 */

export type SchemaNode = Record<string, unknown>;

export const SITE_URL = "https://docs.virtengine.com";
/** Canonical entity ids owned by the main site. */
export const ORG_ID = "https://virtengine.com/#organization";
export const MAIN_WEBSITE_ID = "https://virtengine.com/#website";
export const WEBSITE_ID = `${SITE_URL}/#website`;
export const LOGO_ID = `${SITE_URL}/#logo`;

export const LOGO_URL = `${SITE_URL}/brand/virtengine-icon.png`;
export const DEFAULT_IMAGE = `${SITE_URL}/og.png`;
export const GITHUB = "https://github.com/virtengine/virtengine";

export const IN_LANGUAGE = "en";

export interface Crumb {
  name: string;
  href?: string;
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

export function logoNode(): SchemaNode {
  return {
    "@type": "ImageObject",
    "@id": LOGO_ID,
    url: LOGO_URL,
    contentUrl: LOGO_URL,
    caption: "VirtEngine",
  };
}

/** The VirtEngine project entity, identical to the one declared on virtengine.com. */
export function organizationNode(): SchemaNode {
  return {
    "@type": "Organization",
    "@id": ORG_ID,
    name: "VirtEngine",
    alternateName: ["VirtEngine Protocol", "VirtEngine Docs"],
    url: "https://virtengine.com",
    description:
      "VirtEngine is an open-source, patented decentralized cloud computing marketplace protocol built on CometBFT and the Cosmos SDK.",
    logo: { "@id": LOGO_ID },
    sameAs: [GITHUB, "https://det.io", "https://identity.org.au"],
    parentOrganization: {
      "@type": "Organization",
      "@id": "https://det.io/#organization",
      name: "DETIO FOUNDATION LTD",
      url: "https://det.io",
      identifier: "ACN 699 651 771",
    },
  };
}

export function webSiteNode(): SchemaNode {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: SITE_URL,
    name: "VirtEngine Docs",
    alternateName: "VirtEngine documentation",
    description:
      "Canonical documentation for the VirtEngine Protocol — a decentralized cloud computing marketplace built on CometBFT and the Cosmos SDK.",
    inLanguage: IN_LANGUAGE,
    publisher: { "@id": ORG_ID },
    isPartOf: { "@id": MAIN_WEBSITE_ID },
  };
}

export interface DocPageInput {
  canonical: string;
  title: string;
  description?: string;
  breadcrumbs?: Crumb[];
  dateModified?: string;
}

export function webPageNode({
  canonical,
  title,
  description,
  breadcrumbs,
  dateModified,
}: DocPageInput): SchemaNode {
  return {
    "@type": "TechArticle",
    "@id": articleId(canonical),
    url: canonical,
    headline: title.length > 110 ? `${title.slice(0, 107)}...` : title,
    name: title,
    ...(description ? { description } : {}),
    inLanguage: IN_LANGUAGE,
    isPartOf: { "@id": WEBSITE_ID },
    mainEntityOfPage: { "@id": articleId(canonical) },
    about: { "@id": ORG_ID },
    publisher: { "@id": ORG_ID },
    author: { "@type": "Organization", name: "VirtEngine contributors", url: GITHUB },
    image: {
      "@type": "ImageObject",
      url: DEFAULT_IMAGE,
      contentUrl: DEFAULT_IMAGE,
      width: 1200,
      height: 630,
    },
    isAccessibleForFree: true,
    ...(breadcrumbs && breadcrumbs.length > 0 ? { breadcrumb: { "@id": breadcrumbId(canonical) } } : {}),
    ...(dateModified ? { dateModified } : {}),
  };
}

export function breadcrumbNode(canonical: string, crumbs: Crumb[]): SchemaNode {
  return {
    "@type": "BreadcrumbList",
    "@id": breadcrumbId(canonical),
    itemListElement: crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: {
        "@type": "WebPage",
        "@id": crumb.href ? pageId(crumb.href) : pageId(canonical),
        url: crumb.href ?? canonical,
      },
    })),
  };
}

export function schemaGraph(nodes: (SchemaNode | null | undefined | false)[]): SchemaNode {
  return {
    "@context": "https://schema.org",
    "@graph": nodes.filter((node): node is SchemaNode => Boolean(node)),
  };
}

/** Minimal shape of Starlight's sidebar entries (structurally typed, not imported). */
interface SidebarEntry {
  type: string;
  label?: string;
  href?: string;
  isCurrent?: boolean;
  entries?: SidebarEntry[];
}

function firstHref(entry: SidebarEntry): string | undefined {
  for (const child of entry.entries ?? []) {
    if (child.type === "link" && child.href) return child.href;
    const nested = firstHref(child);
    if (nested) return nested;
  }
  return undefined;
}

function findTrail(
  entries: SidebarEntry[],
  canonical: string,
  trail: Crumb[],
): Crumb[] | null {
  for (const entry of entries) {
    if (entry.type === "link") {
      const href = entry.href ? new URL(entry.href, SITE_URL).href : undefined;
      if (entry.isCurrent || (href && href === canonical)) {
        return [...trail, { name: entry.label ?? "Documentation", href: canonical }];
      }
      continue;
    }
    const groupHref = firstHref(entry);
    const inner = findTrail(entry.entries ?? [], canonical, [
      ...trail,
      { name: entry.label ?? "Documentation", href: groupHref },
    ]);
    if (inner) return inner;
  }
  return null;
}

/**
 * Build a breadcrumb trail from Starlight's sidebar: Documentation → <group> →
 * <page>. Returns undefined when the page is not in the sidebar.
 */
export function breadcrumbsFromSidebar(sidebar: unknown, canonical: string): Crumb[] | undefined {
  const trail = findTrail((sidebar as SidebarEntry[]) ?? [], canonical, []);
  if (!trail) return undefined;
  return [{ name: "Documentation", href: `${SITE_URL}/` }, ...trail];
}
