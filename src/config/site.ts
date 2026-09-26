import type { SiteConfig } from "@/types";

/**
 * Static, non-CMS site configuration.
 *
 * NOTE: Fields here are developer-facing defaults for the IntegraVity demo.
 * Client-editable identity (company name, contact details, social links)
 * lives in the `site_settings` table and is managed through /admin/settings.
 * This file intentionally contains no credentials and is safe to import
 * from both server and client components.
 */
export const siteConfig: SiteConfig = {
  name: "IntegraVity",
  shortName: "IntegraVity",
  tagline: "Environmental consulting, engineered with integrity",
  description:
    "Demonstration website template for environmental consulting and engineering firms: wetland delineation, permitting, assessments, and land-use planning.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  locale: "en_US",
  ogImage: "/images/og-default.png",
  keywords: [
    "environmental consulting",
    "wetland delineation",
    "environmental permitting",
    "environmental assessments",
    "coastal engineering",
    "land-use planning",
  ],
  navigation: {
    public: [
      { label: "Services", href: "/services" },
      { label: "Projects", href: "/#projects" },
      { label: "About", href: "/#approach" },
      { label: "FAQ", href: "/#faq" },
    ],
    footerLegal: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
    ],
  },
};

export const isDevelopment = process.env.NODE_ENV === "development";
