"use client";

import { Inbox } from "lucide-react";
import { useState } from "react";
import { toggleSectionVisibility } from "@/app/actions/content";
import { buttonVariants } from "@/components/ui/button";
import type { HomepageSectionRecord } from "@/types/cms";
import { PublishPill } from "./PublishPill";
import { SectionEditorDrawer } from "./SectionEditorDrawer";

/**
 * Homepage content manager table (docs/TASKS.md Task 7.4).
 * Visibility toggles apply optimistically (local override, reverted on
 * failure) while the Server Action's `revalidatePath` calls reconcile
 * the list with the database in the real app. Section keys are
 * immutable here — editing happens through the drawer (title, subtitle,
 * display order).
 */
export function ContentSectionsTable({
  sections,
  loadError = false,
}: {
  sections: HomepageSectionRecord[];
  loadError?: boolean;
}) {
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editing, setEditing] = useState<HomepageSectionRecord | null>(null);
  const [overrides, setOverrides] = useState<
    Record<string, Partial<Pick<HomepageSectionRecord, "is_visible">>>
  >({});
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  function openEditor(section: HomepageSectionRecord) {
    setEditing(section);
    setIsEditorOpen(true);
  }

  function clearOverride(id: string) {
    setOverrides((previous) => {
      const current = { ...previous[id] };
      delete current.is_visible;
      return { ...previous, [id]: current };
    });
  }

  async function handleToggle(section: HomepageSectionRecord, next: boolean) {
    setPendingId(section.id);
    setActionError(null);
    setOverrides((previous) => ({
      ...previous,
      [section.id]: { ...previous[section.id], is_visible: next },
    })); // optimistic flip
    try {
      const result = await toggleSectionVisibility(section.id, next);
      if (!result.ok) {
        clearOverride(section.id);
        setActionError(result.message);
      }
    } catch {
      clearOverride(section.id);
      setActionError(
        "Could not update the section visibility — your session may have expired.",
      );
    } finally {
      setPendingId(null);
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-muted-foreground text-sm">
          {sections.length}{" "}
          {sections.length === 1 ? "homepage section" : "homepage sections"} —
          hidden sections are omitted from the public homepage
        </p>
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
          Could not load homepage sections right now. Please refresh the page —
          if the problem persists, verify the Supabase configuration.
        </div>
      ) : null}

      {!loadError && sections.length === 0 ? (
        <div className="border-border bg-muted/30 mt-4 rounded-xl border border-dashed p-10 text-center">
          <Inbox
            aria-hidden="true"
            className="text-muted-foreground/60 mx-auto size-8"
          />
          <p className="text-muted-foreground mt-3 text-sm">
            No homepage sections found.
          </p>
        </div>
      ) : null}

      {!loadError && sections.length > 0 ? (
        <div className="border-border mt-4 overflow-x-auto rounded-xl border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-border text-muted-foreground border-b text-left text-xs tracking-wide uppercase">
                <th scope="col" className="px-4 py-3 font-medium">
                  Section key
                </th>
                <th scope="col" className="px-4 py-3 font-medium">
                  Title
                </th>
                <th scope="col" className="px-4 py-3 font-medium">
                  Subtitle
                </th>
                <th scope="col" className="px-4 py-3 font-medium">
                  Visibility
                </th>
                <th scope="col" className="px-4 py-3 font-medium">
                  Order
                </th>
                <th scope="col" className="px-4 py-3 font-medium">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-border divide-y">
              {sections.map((section) => {
                const merged = { ...section, ...overrides[section.id] };
                const rowPending = pendingId === section.id;
                return (
                  <tr
                    key={section.id}
                    className="hover:bg-muted/40 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <code className="bg-muted text-muted-foreground rounded px-1.5 py-0.5 text-xs">
                        {section.section_key}
                      </code>
                    </td>
                    <td className="px-4 py-3 font-medium">{section.title}</td>
                    <td className="text-muted-foreground px-4 py-3">
                      {section.subtitle ? (
                        section.subtitle
                      ) : (
                        <span aria-label="No subtitle">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <PublishPill
                        isPublished={merged.is_visible}
                        activeLabel="Visible"
                        inactiveLabel="Hidden"
                      />
                    </td>
                    <td className="text-muted-foreground px-4 py-3 text-xs tabular-nums">
                      {section.display_order}
                    </td>
                    <td className="px-4 py-3">
                      <span className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          aria-label={`Edit ${section.title}`}
                          onClick={() => openEditor(section)}
                          className={buttonVariants({
                            variant: "outline",
                            size: "sm",
                          })}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          aria-label={`${merged.is_visible ? "Hide" : "Show"} ${section.title}`}
                          disabled={rowPending}
                          onClick={() =>
                            void handleToggle(section, !merged.is_visible)
                          }
                          className={buttonVariants({
                            variant: "ghost",
                            size: "sm",
                          })}
                        >
                          {rowPending
                            ? "Saving…"
                            : merged.is_visible
                              ? "Hide"
                              : "Show"}
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

      {isEditorOpen && editing ? (
        <SectionEditorDrawer
          key={editing.id}
          section={editing}
          onClose={() => setIsEditorOpen(false)}
        />
      ) : null}
    </div>
  );
}
