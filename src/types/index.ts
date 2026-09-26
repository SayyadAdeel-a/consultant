/**
 * Global TypeScript type definitions for IntegraVity.
 *
 * CMS entity types (services, projects, media assets, etc.) will be defined
 * alongside the Supabase schema in Phase 6 (see docs/CMS_SCHEMA.md and
 * src/types/cms.ts once entities are implemented). Keep runtime shapes in
 * sync with Zod validation schemas in src/lib/validations/.
 */

export interface NavItem {
  label: string;
  href: string;
  /** Optional description shown in navigation menus or cards. */
  description?: string;
}

export interface SiteConfig {
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  url: string;
  locale: string;
  ogImage: string;
  keywords: string[];
  navigation: {
    public: NavItem[];
    footerLegal: NavItem[];
  };
}

export interface CtaButton {
  label: string;
  href: string;
  variant?: "primary" | "secondary" | "ghost";
}

export * from "./cms";
