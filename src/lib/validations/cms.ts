import { z } from "zod";

/**
 * Shared CMS write contracts (docs/TASKS.md Task 7.3).
 *
 * Client-safe: imported by both server actions and the editor drawers,
 * so it must never reference `next/cache`, `server-only`, or Supabase.
 */

/**
 * Result contract for CMS Server Actions: success, or a user-safe message
 * plus per-field Zod errors for inline editor feedback.
 */
export type CmsActionResult =
  | { ok: true }
  | { ok: false; message: string; fieldErrors?: Record<string, string> };

/** Row reference guard for CMS server actions (UUIDs in the DB). */
export const cmsIdSchema = z
  .string()
  .trim()
  .min(1, "Invalid reference.")
  .max(64, "Invalid reference.");

/**
 * Maps Zod issues to a flat `{ field: firstErrorMessage }` record so
 * editor drawers can render inline errors keyed by form field.
 * Mirrors `flattenContactIssues` for the contact form.
 */
export function flattenCmsIssues(error: z.ZodError): Record<string, string> {
  const fieldErrors: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    fieldErrors[key] ??= issue.message;
  }
  return fieldErrors;
}

/**
 * Tag/bullet list input (deliverables, regulatory frameworks, …).
 * Accepts an array of entries, a newline-separated string, or nothing —
 * blank lines are dropped and entries are trimmed, so one-per-line
 * textareas and `FormData.getAll()` payloads both validate identically.
 */
export function tagListSchema(maxItems: number, maxLength: number) {
  return z
    .preprocess(
      (value) => {
        if (typeof value === "string") {
          return value
            .split("\n")
            .map((line) => line.trim())
            .filter(Boolean);
        }
        return value;
      },
      z
        .array(z.string().trim().min(1).max(maxLength, "Entry is too long."))
        .max(maxItems, `Up to ${maxItems} entries.`),
    )
    .default([]);
}
