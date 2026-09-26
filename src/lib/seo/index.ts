import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { getSiteUrl } from "@/lib/env";

/**
 * Shared SEO helpers. Keep page components free of inline metadata logic —
 * they should call these utilities (see docs/ARCHITECTURE.md).
 */

export type PageSeoInput = {
  /** Page title; the site name is appended automatically. */
  title: string;
  description: string;
  /** Absolute path beginning with "/", e.g. "/services/wetland-delineation". */
  path: string;
  /** Override the default Open Graph image path. */
  ogImage?: string;
  /** Set false for pages that should stay out of search indexes. */
  index?: boolean;
};

export function createPageMetadata({
  title,
  description,
  path,
  ogImage,
  index = true,
}: PageSeoInput): Metadata {
  const url = new URL(path, getSiteUrl()).toString();
  const resolvedOgImage = new URL(
    ogImage ?? siteConfig.ogImage,
    getSiteUrl(),
  ).toString();

  return {
    title,
    description,
    alternates: { canonical: url },
    robots: index ? undefined : { index: false, follow: false },
    openGraph: {
      title: `${title} | ${siteConfig.name}`,
      description,
      url,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      type: "website",
      images: [{ url: resolvedOgImage }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${siteConfig.name}`,
      description,
      images: [resolvedOgImage],
    },
  };
}

/**
 * Structured data builders. CMS-driven builders (per-service schemas,
 * FAQPage, BreadcrumbList) will be added alongside schema implementation in
 * Phase 6; keep JSON-LD generation centralized here rather than inline.
 */

export function buildOrganizationSchema() {
  // Illustrative demo profile: fields become CMS-driven via site_settings.
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: siteConfig.name,
    description: siteConfig.description,
    url: getSiteUrl(),
    logo: new URL(siteConfig.ogImage, getSiteUrl()).toString(),
    // NOTE: demo placeholder — replace with verified client details only.
    address: undefined,
    sameAs: [],
  };
}

export function buildBreadcrumbSchema(items: { name: string; path: string }[]) {
  const base = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: new URL(item.path, base).toString(),
    })),
  };
}
