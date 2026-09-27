import { cn } from "@/lib/utils";

/**
 * State pill shared by the CMS managers: emerald for active/live rows,
 * amber for inactive ones. Defaults to the services/case studies
 * Published/Draft labels; the content manager passes Visible/Hidden.
 */
export function PublishPill({
  isPublished,
  activeLabel = "Published",
  inactiveLabel = "Draft",
  className,
}: {
  isPublished: boolean;
  activeLabel?: string;
  inactiveLabel?: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold",
        isPublished
          ? "bg-emerald-100 text-emerald-800"
          : "bg-amber-100 text-amber-800",
        className,
      )}
    >
      {isPublished ? activeLabel : inactiveLabel}
    </span>
  );
}
