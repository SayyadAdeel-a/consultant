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
  name: "Alderline Environmental",
  shortName: "Alderline",
  tagline: "Environmental insight. Practical solutions.",
  description:
    "Alderline Environmental helps project teams understand site constraints, navigate permitting pathways, and move forward with defensible environmental planning.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  locale: "en_US",
  ogImage: "/assets/alderline/brand/touch-icon.jpg",
  keywords: [
    "environmental consulting",
    "wetland delineation",
    "environmental permitting",
    "environmental site assessments",
    "coastal resilience",
    "ecological restoration",
  ],
  navigation: {
    public: [
      { label: "Home", href: "/" },
      { label: "About", href: "/about" },
      { label: "Services", href: "/services" },
      { label: "Insights", href: "/blog" },
      { label: "Contact", href: "/contact" },
    ],
    footerLegal: [
      { label: "Privacy Policy", href: "/utility/privacy-policy" },
      { label: "Terms & Conditions", href: "/utility/terms-conditions" },
      { label: "Media Licensing", href: "/utility/license" },
    ],
  },
};

export const isDevelopment = process.env.NODE_ENV === "development";
