"use client";

import { Inbox } from "lucide-react";
import { useState } from "react";
import { buttonVariants } from "@/components/ui/button";
import type { InquiryRecord } from "@/types/cms";
import { type InquiryStatus } from "@/lib/validations/inquiries";
import { InquiryDetailDrawer } from "./InquiryDetailDrawer";
import { StatusPill } from "./StatusPill";
import { formatReceivedDate, inquiryTypeLabel } from "./inquiry-format";

/**
 * Confidential inquiries list with client-side filtering
 * (docs/TASKS.md Task 7.2). Rows are fetched server-side under the admin
 * session; status pills double as filter buttons with count badges, and a
 * dropdown narrows by inquiry type. Clicking a row opens the detail
 * drawer — status and notes edits happen there via Server Actions.
 */

type StatusFilter = "all" | InquiryStatus;

const STATUS_FILTERS: ReadonlyArray<{ value: StatusFilter; label: string }> = [
  { value: "all", label: "All" },
  { value: "new", label: "New" },
  { value: "reviewing", label: "Reviewing" },
  { value: "contacted", label: "Contacted" },
  { value: "archived", label: "Archived" },
];

const TYPE_FILTERS: ReadonlyArray<{ value: string; label: string }> = [
  { value: "all", label: "All inquiry types" },
  { value: "general", label: "General" },
  { value: "wetland-delineation", label: "Wetland Delineation" },
  { value: "permitting", label: "Permitting" },
  { value: "assessment", label: "Assessment" },
  { value: "planning", label: "Planning" },
  { value: "other", label: "Other" },
];

export function InquiriesTable({
  inquiries,
  loadError = false,
}: {
  inquiries: InquiryRecord[];
  loadError?: boolean;
}) {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const counts: Record<InquiryStatus, number> = {
    new: 0,
    reviewing: 0,
    contacted: 0,
    archived: 0,
  };
  for (const item of inquiries) {
    counts[item.status] += 1;
  }

  const filtered = inquiries.filter(
    (item) =>
      (statusFilter === "all" || item.status === statusFilter) &&
      (typeFilter === "all" || item.inquiry_type === typeFilter),
  );

  // Derive the open row from the latest props so the drawer never shows a
  // stale copy after a Server Action revalidates the list.
  const selected = selectedId
    ? (inquiries.find((item) => item.id === selectedId) ?? null)
    : null;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div
          role="group"
          aria-label="Filter inquiries by status"
          className="flex flex-wrap gap-2"
        >
          {STATUS_FILTERS.map((filter) => {
            const active = statusFilter === filter.value;
            const count =
              filter.value === "all" ? inquiries.length : counts[filter.value];
            return (
              <button
                key={filter.value}
                type="button"
                aria-pressed={active}
                onClick={() => setStatusFilter(filter.value)}
                className={`focus-visible:ring-ring/50 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium transition-colors focus-visible:ring-3 focus-visible:outline-none ${
                  active
                    ? "bg-brand-forest text-brand-ivory"
                    : "border-border bg-card text-muted-foreground hover:text-foreground border"
                }`}
              >
                {filter.label}
                <span
                  className={`rounded-full px-1.5 py-0.5 text-xs ${
                    active
                      ? "bg-brand-ivory/20 text-brand-ivory"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <label
            htmlFor="inquiry-type-filter"
            className="text-muted-foreground text-sm"
          >
            Type
          </label>
          <select
            id="inquiry-type-filter"
            value={typeFilter}
            onChange={(event) => setTypeFilter(event.target.value)}
            className="border-border bg-background focus-visible:ring-ring/50 h-9 rounded-md border px-2 text-sm focus-visible:ring-3 focus-visible:outline-none"
          >
            {TYPE_FILTERS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loadError ? (
        <div
          role="alert"
          className="border-destructive/40 bg-destructive/10 text-foreground mt-6 rounded-lg border px-4 py-3 text-sm"
        >
          Could not load inquiries right now. Please refresh the page — if the
          problem persists, verify the Supabase configuration.
        </div>
      ) : null}

      {!loadError && inquiries.length === 0 ? (
        <div className="border-border bg-muted/30 mt-6 rounded-xl border border-dashed p-10 text-center">
          <Inbox
            aria-hidden="true"
            className="text-muted-foreground/60 mx-auto size-8"
          />
          <p className="text-muted-foreground mt-3 text-sm">
            No inquiries yet. Confidential submissions from the contact form
            will appear here.
          </p>
        </div>
      ) : null}

      {!loadError && inquiries.length > 0 && filtered.length === 0 ? (
        <div className="border-border bg-muted/30 mt-6 rounded-xl border border-dashed p-10 text-center">
          <p className="text-sm">No inquiries match the selected filters.</p>
          <button
            type="button"
            onClick={() => {
              setStatusFilter("all");
              setTypeFilter("all");
            }}
            className={`${buttonVariants({ variant: "outline", size: "sm" })} mt-4`}
          >
            Clear filters
          </button>
        </div>
      ) : null}

      {filtered.length > 0 ? (
        <div className="border-border mt-4 overflow-x-auto rounded-xl border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-border text-muted-foreground border-b text-left text-xs tracking-wide uppercase">
                <th scope="col" className="px-4 py-3 font-medium">
                  Received
                </th>
                <th scope="col" className="px-4 py-3 font-medium">
                  Submitter
                </th>
                <th scope="col" className="px-4 py-3 font-medium">
                  Type
                </th>
                <th scope="col" className="px-4 py-3 font-medium">
                  Status
                </th>
                <th scope="col" className="px-4 py-3 font-medium">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-border divide-y">
              {filtered.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-muted/40 transition-colors"
                >
                  <td className="px-4 py-3 whitespace-nowrap">
                    <time
                      dateTime={item.created_at}
                      className="text-muted-foreground text-xs"
                    >
                      {formatReceivedDate(item.created_at)}
                    </time>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-muted-foreground text-xs">
                      {item.company ?? "—"}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <span className="bg-brand-sage/30 text-brand-forest inline-flex rounded-full px-2 py-0.5 text-xs font-medium">
                      {inquiryTypeLabel(item.inquiry_type)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <StatusPill status={item.status} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      aria-label={`View details for ${item.name}`}
                      onClick={() => setSelectedId(item.id)}
                      className={buttonVariants({
                        variant: "outline",
                        size: "sm",
                      })}
                    >
                      View details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      {selected ? (
        <InquiryDetailDrawer
          key={selected.id}
          inquiry={selected}
          onClose={() => setSelectedId(null)}
        />
      ) : null}
    </div>
  );
}
