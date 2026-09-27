import { siteConfig } from "@/config/site";
import type { SiteSettingsRecord } from "@/types/cms";

/**
 * Public identity view-model (docs/TASKS.md Task 9.1).
 *
 * Pure, client-safe resolver that merges the CMS `site_settings` row with
 * the static fallbacks in `@/config/site` so the Header, Footer, hero, and
 * consultation banner render one consistent identity:
 * - configured CMS row → every field the row provides wins;
 * - `null` (demo mode, query failure, or a component rendered without a
 *   fetched row) → static defaults byte-identical to the pre-CMS copy.
 *
 * This module must stay free of server-only imports: client components
 * (Header / Navigation / MobileNav) import it directly.
 */

/** Demo contact channels — the static fallback for `site_settings`. */
export const STATIC_CONTACT = {
  addressLines: ["14 Marshview Lane, Suite 300", "Portland, Maine 04101"],
  email: "inquiries@integravity.example",
  phone: "(207) 555-0148",
  phoneHref: "tel:+12075550148",
  hours: "Monday – Friday, 8:00 AM – 5:00 PM ET",
} as const;

/** Static CTA pair — mirrors the `cta_settings` JSONB column defaults. */
export const STATIC_CTAS = {
  primary: { label: "Request a Consultation", href: "/contact" },
  secondary: { label: "Explore Our Services", href: "/services" },
} as const;

export interface PublicCta {
  label: string;
  href: string;
}

export interface PublicSocialLink {
  label: string;
  href: string;
}

export interface PublicIdentity {
  /** Company name from `site_settings.company_name`. */
  name: string;
  /** Editorial tagline rendered as the hero `<h1>` and footer brand line. */
  tagline: string;
  /** Long-form description (CMS identity; homepage metadata stays static). */
  description: string;
  /** Office address, split into display lines. */
  addressLines: string[];
  email: string;
  phone: string;
  /** `tel:` href derived from `phone`. */
  phoneHref: string;
  /** External social profiles (empty when the CMS row has none). */
  socialLinks: PublicSocialLink[];
  primaryCta: PublicCta;
  secondaryCta: PublicCta;
}

/** Display labels for the known `social_links` JSONB keys. */
const SOCIAL_LABELS: Record<string, string> = {
  linkedin: "LinkedIn",
  twitter: "Twitter",
  facebook: "Facebook",
  instagram: "Instagram",
};

/**
 * Builds a `tel:` href from a human phone string. Bare 10-digit US
 * numbers are normalized to `+1…` so the static demo value keeps its
 * existing `tel:+12075550148` href; anything else keeps its `+`.
 */
export function phoneToHref(phone: string): string {
  const dial = phone.replace(/[^\d+]/g, "");
  if (!dial) return STATIC_CONTACT.phoneHref;
  if (/^1\d{10}$/.test(dial)) return `tel:+${dial}`;
  if (/^\d{10}$/.test(dial)) return `tel:+1${dial}`;
  return `tel:${dial}`;
}

function splitAddressLines(address?: string | null): string[] {
  const trimmed = address?.trim();
  if (!trimmed) return [...STATIC_CONTACT.addressLines];
  return trimmed
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function collectSocialLinks(
  social?: SiteSettingsRecord["social_links"],
): PublicSocialLink[] {
  if (!social) return [];
  const links: PublicSocialLink[] = [];
  for (const [key, value] of Object.entries(social)) {
    const label = SOCIAL_LABELS[key];
    const href = typeof value === "string" ? value.trim() : "";
    if (label && href) links.push({ label, href });
  }
  return links;
}

/**
 * Resolves the public identity view-model. Pass the fetched
 * `site_settings` row when available, `null` otherwise — every field
 * degrades to its static default rather than rendering empty.
 */
export function resolvePublicIdentity(
  settings?: SiteSettingsRecord | null,
): PublicIdentity {
  const cta = settings?.cta_settings;
  const phone = settings?.contact_phone?.trim();

  return {
    name: settings?.company_name?.trim() || siteConfig.name,
    tagline: settings?.tagline?.trim() || siteConfig.tagline,
    description: settings?.description?.trim() || siteConfig.description,
    addressLines: splitAddressLines(settings?.office_address),
    email: settings?.contact_email?.trim() || STATIC_CONTACT.email,
    phone: phone || STATIC_CONTACT.phone,
    phoneHref: phone ? phoneToHref(phone) : STATIC_CONTACT.phoneHref,
    socialLinks: collectSocialLinks(settings?.social_links),
    primaryCta: {
      label: cta?.primaryLabel?.trim() || STATIC_CTAS.primary.label,
      href: cta?.primaryHref?.trim() || STATIC_CTAS.primary.href,
    },
    secondaryCta: {
      label: cta?.secondaryLabel?.trim() || STATIC_CTAS.secondary.label,
      href: cta?.secondaryHref?.trim() || STATIC_CTAS.secondary.href,
    },
  };
}
