import { z } from "zod";

/**
 * Global site settings validation (docs/TASKS.md Task 7.4), shared by
 * the admin settings form (client) and the `updateSiteSettings` Server
 * Action so the rules can never drift.
 *
 * Client-safe: imports only Zod (no `next/cache`, no `server-only`).
 */

/** Absolute http(s) URL, or empty for "not provided". */
const optionalWebUrl = z
  .string()
  .trim()
  .max(300, "URL is too long.")
  .refine(
    (value) => value === "" || /^https?:\/\/.+/.test(value),
    "Enter an absolute URL (https://…).",
  );

/** Site path (`/contact`) or absolute URL — CTA targets may be either. */
const ctaUrl = z
  .string()
  .trim()
  .min(1, "CTA URL is required.")
  .max(300, "URL is too long.")
  .refine(
    (value) => value.startsWith("/") || /^https?:\/\/.+/.test(value),
    "Enter a site path (/…) or an absolute URL.",
  );

const ctaLabel = z
  .string()
  .trim()
  .min(1, "CTA label is required.")
  .max(60, "CTA label is too long.");

export const siteSettingsSchema = z.object({
  company_name: z
    .string()
    .trim()
    .min(1, "Company name is required.")
    .max(160, "Company name is too long."),
  tagline: z
    .string()
    .trim()
    .min(1, "Tagline is required.")
    .max(200, "Tagline is too long."),
  description: z
    .string()
    .trim()
    .min(1, "Description is required.")
    .max(600, "Description is too long."),
  contact_email: z.email("Enter a valid email address.").max(254),
  contact_phone: z
    .string()
    .trim()
    .max(40, "Phone number is too long.")
    .optional()
    .or(z.literal("")),
  office_address: z
    .string()
    .trim()
    .max(300, "Address is too long.")
    .optional()
    .or(z.literal("")),
  linkedin_url: optionalWebUrl,
  twitter_url: optionalWebUrl,
  primary_cta_label: ctaLabel,
  primary_cta_url: ctaUrl,
  secondary_cta_label: ctaLabel,
  secondary_cta_url: ctaUrl,
});

/** What callers pass to `updateSiteSettings` (object or FormData). */
export type SiteSettingsInput = z.input<typeof siteSettingsSchema>;
