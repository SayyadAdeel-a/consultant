import { cn } from "@/lib/utils";
import type { InquiryStatus } from "@/lib/validations/inquiries";

/**
 * Shared inquiry status pill — dashboard preview, inquiries table, and
 * detail drawer all render statuses through this one map so the palette
 * can never drift between surfaces.
 */
const STATUS_STYLES: Record<InquiryStatus, string> = {
  new: "bg-brand-sage/40 text-brand-forest",
  reviewing: "bg-amber-100 text-amber-800",
  contacted: "bg-emerald-100 text-emerald-800",
  archived: "bg-muted text-muted-foreground",
};

export function statusLabel(status: InquiryStatus): string {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

export function StatusPill({
  status,
  className,
}: {
  status: InquiryStatus;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold",
        STATUS_STYLES[status],
        className,
      )}
    >
      {statusLabel(status)}
    </span>
  );
}
