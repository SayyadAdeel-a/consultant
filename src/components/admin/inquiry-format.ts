import { INQUIRY_TYPE_LABELS } from "@/lib/validations/contact";

/** Display label for an inquiry_type value coming from the database. */
export function inquiryTypeLabel(type: string): string {
  return (
    INQUIRY_TYPE_LABELS[type as keyof typeof INQUIRY_TYPE_LABELS] ?? "Other"
  );
}

/**
 * Day-precision date for admin surfaces (e.g. "Sep 25, 2026").
 * Pinned to UTC so server render and client hydration always agree.
 */
export function formatReceivedDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}
