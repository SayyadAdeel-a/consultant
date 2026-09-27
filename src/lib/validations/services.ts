import { z } from "zod";
import { cmsIdSchema, tagListSchema } from "./cms";

/**
 * Service catalog validation (docs/TASKS.md Task 7.3), shared by the
 * admin editor drawer (client) and the `upsertService` Server Action so
 * the rules can never drift.
 */

/**
 * Allowed Lucide icon names for the `services.icon` column. The drawer's
 * selector offers exactly this list and the action validates against it,
 * so an arbitrary name can never reach the database.
 */
export const SERVICE_ICON_NAMES = [
  "Trees",
  "Waves",
  "Sprout",
  "Search",
  "FileCheck",
  "Leaf",
  "Map",
  "Droplets",
  "Mountain",
  "FlaskConical",
  "Compass",
  "Briefcase",
] as const;

export type ServiceIconName = (typeof SERVICE_ICON_NAMES)[number];

/** Lowercase-kebab slug, e.g. "wetland-delineation". */
const slugRule = z
  .string()
  .trim()
  .min(1, "Slug is required.")
  .max(120, "Slug is too long.")
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "Use lowercase letters, numbers, and hyphens only.",
  );

export const serviceSchema = z.object({
  /** Present only when editing an existing row. */
  id: cmsIdSchema.optional(),
  title: z
    .string()
    .trim()
    .min(1, "Title is required.")
    .max(120, "Title is too long."),
  slug: slugRule,
  short_description: z
    .string()
    .trim()
    .min(1, "Short description is required.")
    .max(300, "Keep the short description under 300 characters."),
  full_content: z
    .string()
    .trim()
    .min(1, "Full content is required.")
    .max(20000, "Content is too long."),
  icon: z.enum(SERVICE_ICON_NAMES),
  /**
   * AGENTS.md §5.5 — strictly optional. Null/empty/whitespace-only values
   * normalize to `NULL` here so the public site can never render pricing
   * the firm did not set.
   */
  pricing_note: z
    .string()
    .trim()
    .max(500, "Pricing note is too long.")
    .nullish()
    .transform((value) => (value ? value : null)),
  deliverables: tagListSchema(30, 200),
  regulatory_frameworks: tagListSchema(20, 80),
  display_order: z.coerce.number().int().min(0).max(9999).default(0),
  is_published: z.boolean().default(true),
});

/** What callers pass to `upsertService` (object or FormData contents). */
export type ServiceInput = z.input<typeof serviceSchema>;
