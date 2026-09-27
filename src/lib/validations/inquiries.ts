import { z } from "zod";

/**
 * Inquiry status vocabulary for the admin console (docs/TASKS.md Task 7.2),
 * shared by the filter pills, status selector, server actions, and the
 * dashboard preview. Mirrors the CHECK constraint on
 * `public.inquiries.status`.
 */
export const INQUIRY_STATUSES = [
  "new",
  "reviewing",
  "contacted",
  "archived",
] as const;

export type InquiryStatus = (typeof INQUIRY_STATUSES)[number];

/** Server-action guard: rejects anything outside the allowed statuses. */
export const inquiryStatusSchema = z.enum(INQUIRY_STATUSES);

/** Row reference guard for server actions (ids are UUIDs in the DB). */
export const inquiryIdSchema = z
  .string()
  .trim()
  .min(1, "Invalid inquiry reference.")
  .max(64, "Invalid inquiry reference.");

/** Internal consultant notes — free text, bounded, trimmed. */
export const inquiryNotesSchema = z
  .string()
  .trim()
  .max(5000, "Notes are limited to 5000 characters.");
