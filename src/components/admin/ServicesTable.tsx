"use client";

import { Inbox } from "lucide-react";
import { useState } from "react";
import { toggleServicePublished } from "@/app/actions/services";
import { buttonVariants } from "@/components/ui/button";
import type { ServiceRecord } from "@/types/cms";
import { hasPricingNote } from "@/config/services";
import { PublishPill } from "./PublishPill";
import { ServiceEditorDrawer } from "./ServiceEditorDrawer";
import { getServiceIcon } from "./service-icons";

/**
 * Service catalog manager table
 * (docs/TASKS.md Task 7.3): publication toggles apply optimistically
 * (local override flips immediately, reverts on failure) while the
 * Server Action's `revalidatePath` calls reconcile the list with the
 * database in the real app.
 *
 * AGENTS.md §5.5: the pricing column shows a presence indicator only —
 * the note's text is never rendered in the list, and a missing/blank
 * note renders a plain "—".
 */
export function ServicesTable({
  services,
  loadError = false,
}: {
  services: ServiceRecord[];
  loadError?: boolean;
}) {
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editing, setEditing] = useState<ServiceRecord | null>(null);
  const [overrides, setOverrides] = useState<
    Record<string, Partial<Pick<ServiceRecord, "is_published">>>
  >({});
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  function openEditor(service: ServiceRecord | null) {
    setEditing(service);
    setIsEditorOpen(true);
  }

  function setOverride(
    id: string,
    patch: Partial<Pick<ServiceRecord, "is_published">>,
  ) {
    setOverrides((previous) => ({
      ...previous,
      [id]: { ...previous[id], ...patch },
    }));
  }

  function clearOverride(id: string, key: "is_published") {
    setOverrides((previous) => {
      const current = { ...previous[id] };
      delete current[key];
      return { ...previous, [id]: current };
    });
  }

  async function handleToggle(service: ServiceRecord, next: boolean) {
    setPendingId(service.id);
    setActionError(null);
    setOverride(service.id, { is_published: next }); // optimistic flip
    try {
      const result = await toggleServicePublished(service.id, next);
      if (!result.ok) {
        clearOverride(service.id, "is_published");
        setActionError(result.message);
      }
    } catch {
      clearOverride(service.id, "is_published");
      setActionError(
        "Could not update the publication state — your session may have expired.",
      );
    } finally {
      setPendingId(null);
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-muted-foreground text-sm">
          {services.length} {services.length === 1 ? "service" : "services"} in
          the catalog
        </p>
        <button
          type="button"
          onClick={() => openEditor(null)}
          className={buttonVariants({ variant: "default", size: "sm" })}
        >
          New service
        </button>
      </div>

      {actionError ? (
        <div
          role="alert"
          className="border-destructive/40 bg-destructive/10 text-destructive mt-4 rounded-lg border px-4 py-3 text-sm"
        >
          {actionError}
        </div>
      ) : null}

      {loadError ? (
        <div
          role="alert"
          className="border-destructive/40 bg-destructive/10 text-foreground mt-4 rounded-lg border px-4 py-3 text-sm"
        >
          Could not load services right now. Please refresh the page — if the
          problem persists, verify the Supabase configuration.
        </div>
      ) : null}

      {!loadError && services.length === 0 ? (
        <div className="border-border bg-muted/30 mt-4 rounded-xl border border-dashed p-10 text-center">
          <Inbox
            aria-hidden="true"
            className="text-muted-foreground/60 mx-auto size-8"
          />
          <p className="text-muted-foreground mt-3 text-sm">
            No services yet. Create the first catalog entry to get started.
          </p>
        </div>
      ) : null}

      {!loadError && services.length > 0 ? (
        <div className="border-border mt-4 overflow-x-auto rounded-xl border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-border text-muted-foreground border-b text-left text-xs tracking-wide uppercase">
                <th scope="col" className="px-4 py-3 font-medium">
                  Order
                </th>
                <th scope="col" className="px-4 py-3 font-medium">
                  Service
                </th>
                <th scope="col" className="px-4 py-3 font-medium">
                  Icon
                </th>
                <th scope="col" className="px-4 py-3 font-medium">
                  Deliverables
                </th>
                <th scope="col" className="px-4 py-3 font-medium">
                  Frameworks
                </th>
                <th scope="col" className="px-4 py-3 font-medium">
                  Pricing
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
              {services.map((service) => {
                const merged = { ...service, ...overrides[service.id] };
                const Icon = getServiceIcon(merged.icon);
                const rowPending = pendingId === service.id;
                return (
                  <tr
                    key={service.id}
                    className="hover:bg-muted/40 transition-colors"
                  >
                    <td className="text-muted-foreground px-4 py-3 text-xs tabular-nums">
                      {service.display_order}
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium">{service.title}</p>
                      <code className="text-muted-foreground text-xs">
                        {service.slug}
                      </code>
                    </td>
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-2">
                        <Icon aria-hidden="true" className="size-4" />
                        <span className="text-muted-foreground text-xs">
                          {service.icon}
                        </span>
                      </span>
                    </td>
                    <td className="px-4 py-3 tabular-nums">
                      {service.deliverables.length}
                    </td>
                    <td className="px-4 py-3">
                      <span className="flex flex-wrap gap-1">
                        {service.regulatory_frameworks.map((framework) => (
                          <span
                            key={framework}
                            className="bg-muted text-muted-foreground rounded-full px-2 py-0.5 text-xs"
                          >
                            {framework}
                          </span>
                        ))}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {hasPricingNote({ pricingNote: service.pricing_note }) ? (
                        <span className="bg-brand-sage/30 text-brand-forest rounded-full px-2 py-0.5 text-xs font-medium">
                          Pricing note
                        </span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <PublishPill isPublished={merged.is_published} />
                    </td>
                    <td className="px-4 py-3">
                      <span className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          aria-label={`Edit ${service.title}`}
                          onClick={() => openEditor(service)}
                          className={buttonVariants({
                            variant: "outline",
                            size: "sm",
                          })}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          aria-label={`${
                            merged.is_published ? "Unpublish" : "Publish"
                          } ${service.title}`}
                          disabled={rowPending}
                          onClick={() =>
                            void handleToggle(service, !merged.is_published)
                          }
                          className={buttonVariants({
                            variant: "ghost",
                            size: "sm",
                          })}
                        >
                          {rowPending
                            ? "Saving…"
                            : merged.is_published
                              ? "Unpublish"
                              : "Publish"}
                        </button>
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : null}

      {isEditorOpen ? (
        <ServiceEditorDrawer
          key={editing?.id ?? "new"}
          service={editing}
          onClose={() => setIsEditorOpen(false)}
        />
      ) : null}
    </div>
  );
}
