import { cn } from "@/lib/utils";

/**
 * Publication state pill shared by the services and case studies
 * managers (docs/TASKS.md Task 7.3): emerald for live rows, amber for
 * drafts still in the queue.
 */
export function PublishPill({
  isPublished,
  className,
}: {
  isPublished: boolean;
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
      {isPublished ? "Published" : "Draft"}
    </span>
  );
}
