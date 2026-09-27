import { z } from "zod";

/**
 * Administrative authentication validation (docs/TASKS.md Task 6.1).
 * Shared by the client login form and the `loginAdmin` server action so
 * the two gates can never drift.
 *
 * The password is intentionally NOT trimmed: leading/trailing spaces are
 * legal credentials and must reach Supabase Auth untouched.
 */
export const adminLoginSchema = z.object({
  email: z.email("Please enter a valid email address.").max(254),
  password: z
    .string()
    .min(1, "Please enter your password.")
    .max(1024, "Password is too long."),
});

export type AdminLoginInput = z.infer<typeof adminLoginSchema>;

/** Maps Zod issues to `{ field: firstMessage }` for inline form errors. */
export function flattenAuthIssues(error: z.ZodError): Record<string, string> {
  const fieldErrors: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    fieldErrors[key] ??= issue.message;
  }
  return fieldErrors;
}
