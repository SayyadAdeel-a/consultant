import { z } from "zod";

/**
 * Contact inquiry validation, shared by the client form and the server
 * route handler so the rules can never drift (see docs/ARCHITECTURE.md).
 *
 * The honeypot field is intentionally permissive on the client (hidden
 * input) and enforced on the server: any non-empty value is spam.
 */
export const INQUIRY_TYPES = [
  "general",
  "wetland-delineation",
  "permitting",
  "assessment",
  "planning",
  "other",
] as const;

export type InquiryType = (typeof INQUIRY_TYPES)[number];

/**
 * Human-readable inquiry labels shared by the contact form's select and
 * the admin dashboard's recent-inquiries preview, so display copy stays
 * in sync with the enum it describes.
 */
export const INQUIRY_TYPE_LABELS: Record<InquiryType, string> = {
  general: "General inquiry",
  "wetland-delineation": "Wetland delineation",
  permitting: "Environmental permitting",
  assessment: "Phase I/II environmental assessments",
  planning: "Ecological planning",
  other: "Other / not sure yet",
};

export const contactInquirySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Please enter your full name.")
    .max(120, "Name is too long."),
  email: z.email("Please enter a valid email address.").max(254),
  phone: z
    .string()
    .trim()
    .max(40, "Phone number is too long.")
    .optional()
    .or(z.literal("")),
  organization: z
    .string()
    .trim()
    .max(160, "Organization name is too long.")
    .optional()
    .or(z.literal("")),
  inquiryType: z.enum(INQUIRY_TYPES),
  message: z
    .string()
    .trim()
    .min(20, "Please provide at least 20 characters so we can help.")
    .max(5000, "Message is too long."),
  consent: z.literal(true, {
    message: "Please accept the privacy policy to continue.",
  }),
  /** Honeypot — must remain empty; humans never see this field. */
  companyWebsite: z
    .string()
    .max(0, "Spam detected.")
    .optional()
    .or(z.literal("")),
});

export type ContactInquiryInput = z.infer<typeof contactInquirySchema>;

/**
 * Maps Zod issues to a flat `{ fieldName: firstErrorMessage }` record for
 * inline form errors. Shared by the client form and the server action so
 * error keys always match input `name` attributes and can never drift.
 */
export function flattenContactIssues(
  error: z.ZodError,
): Record<string, string> {
  const fieldErrors: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    fieldErrors[key] ??= issue.message;
  }
  return fieldErrors;
}
