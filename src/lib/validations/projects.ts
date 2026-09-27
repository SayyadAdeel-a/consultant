import { z } from "zod";
import { cmsIdSchema } from "./cms";

/**
 * Case study / project validation (docs/TASKS.md Task 7.3), shared by
 * the admin editor drawer (client) and the `upsertProject` Server Action.
 */

/** Lowercase-kebab slug, e.g. "casco-bay-marina". */
const slugRule = z
  .string()
  .trim()
  .min(1, "Slug is required.")
  .max(120, "Slug is too long.")
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "Use lowercase letters, numbers, and hyphens only.",
  );

/**
 * Optional URL field: empty/missing normalizes to `NULL`; otherwise it
 * must be an absolute http(s) URL or a site path starting with "/".
 */
const optionalImageRule = z
  .preprocess(
    (value) => (value === "" || value === undefined ? null : value),
    z
      .string()
      .trim()
      .max(500, "Image URL is too long.")
      .refine(
        (value) => /^https?:\/\//.test(value) || value.startsWith("/"),
        "Enter an absolute URL or a site path starting with /.",
      )
      .nullable(),
  )
  .default(null);

/** Optional service association: empty/missing normalizes to `NULL`. */
const optionalServiceRule = z.preprocess(
  (value) => (value === "" || value === undefined ? null : value),
  cmsIdSchema.nullable(),
);

export const projectSchema = z.object({
  /** Present only when editing an existing row. */
  id: cmsIdSchema.optional(),
  title: z
    .string()
    .trim()
    .min(1, "Title is required.")
    .max(140, "Title is too long."),
  slug: slugRule,
  client_type: z
    .string()
    .trim()
    .min(1, "Client type is required.")
    .max(120, "Client type is too long."),
  location: z
    .string()
    .trim()
    .min(1, "Location is required.")
    .max(160, "Location is too long."),
  completed_year: z.coerce
    .number()
    .int("Enter a valid completion year.")
    .min(1900, "Enter a valid completion year.")
    .max(2100, "Enter a valid completion year."),
  summary: z
    .string()
    .trim()
    .min(1, "Summary is required.")
    .max(1200, "Summary is too long."),
  challenge: z
    .string()
    .trim()
    .min(1, "Challenge description is required.")
    .max(6000, "Challenge description is too long."),
  solution: z
    .string()
    .trim()
    .min(1, "Solution description is required.")
    .max(6000, "Solution description is too long."),
  results: z
    .string()
    .trim()
    .min(1, "Results description is required.")
    .max(6000, "Results description is too long."),
  featured_image_url: optionalImageRule,
  service_id: optionalServiceRule,
  is_featured: z.boolean().default(false),
  is_published: z.boolean().default(true),
  display_order: z.coerce.number().int().min(0).max(9999).default(0),
});

/** What callers pass to `upsertProject` (object or FormData contents). */
export type ProjectInput = z.input<typeof projectSchema>;
