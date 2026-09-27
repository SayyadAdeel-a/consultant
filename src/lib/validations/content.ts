import { z } from "zod";
import { cmsIdSchema } from "./cms";

/**
 * Homepage section validation (docs/TASKS.md Task 7.4), shared by the
 * admin content manager (client) and the `updateHomepageSection` Server
 * Action. Section keys are immutable through the console — the drawer
 * edits title, subtitle, and display order only, so no key enum exists
 * here to drift from the seeded rows.
 *
 * Client-safe: imports only Zod.
 */

export const sectionSchema = z.object({
  /** Existing row — there is no create action for sections. */
  id: cmsIdSchema,
  title: z
    .string()
    .trim()
    .min(1, "Section title is required.")
    .max(160, "Title is too long."),
  subtitle: z
    .string()
    .trim()
    .max(300, "Subtitle is too long.")
    .nullish()
    .transform((value) => (value ? value : null)),
  display_order: z.coerce.number().int().min(0).max(9999).default(0),
});

/** What callers pass to `updateHomepageSection` (object or FormData). */
export type SectionInput = z.input<typeof sectionSchema>;
