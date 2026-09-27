"use client";

import { Star, Inbox } from "lucide-react";
import { useState } from "react";
import {
  toggleProjectFeatured,
  toggleProjectPublished,
} from "@/app/actions/projects";
import { buttonVariants } from "@/components/ui/button";
import type { ProjectRecord, ServiceOption } from "@/types/cms";
import { ProjectEditorDrawer } from "./ProjectEditorDrawer";
import { PublishPill } from "./PublishPill";

/**
 * Case studies manager table (docs/TASKS.md Task 7.3).
 * Publication and featured flags toggle optimistically (local override,
 * reverted on failure) while `revalidatePath` reconciles the list with
 * the database in the real app.
 */
export function ProjectsTable({
  projects,
  serviceOptions,
  loadError = false,
}: {
  projects: ProjectRecord[];
  serviceOptions: ServiceOption[];
  loadError?: boolean;
}) {
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editing, setEditing] = useState<ProjectRecord | null>(null);
  const [overrides, setOverrides] = useState<
    Record<string, Partial<Pick<ProjectRecord, "is_published" | "is_featured">>>
  >({});
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  function openEditor(project: ProjectRecord | null) {
    setEditing(project);
    setIsEditorOpen(true);
  }

  function setOverride(
    id: string,
    patch: Partial<Pick<ProjectRecord, "is_published" | "is_featured">>,
  ) {
    setOverrides((previous) => ({
      ...previous,
      [id]: { ...previous[id], ...patch },
    }));
  }

  function clearOverride(id: string, key: "is_published" | "is_featured") {
    setOverrides((previous) => {
      const current = { ...previous[id] };
      delete current[key];
      return { ...previous, [id]: current };
    });
  }

  async function handleToggle(
    project: ProjectRecord,
    flag: "is_published" | "is_featured",
    next: boolean,
  ) {
    setPendingId(project.id);
    setActionError(null);
    setOverride(project.id, { [flag]: next }); // optimistic flip
    try {
      const result =
        flag === "is_published"
          ? await toggleProjectPublished(project.id, next)
          : await toggleProjectFeatured(project.id, next);
      if (!result.ok) {
        clearOverride(project.id, flag);
        setActionError(result.message);
      }
    } catch {
      clearOverride(project.id, flag);
      setActionError(
        "Could not update this case study — your session may have expired.",
      );
    } finally {
      setPendingId(null);
    }
  }

  const serviceTitle = (id: string | null): string =>
    id
      ? (serviceOptions.find((option) => option.id === id)?.title ?? "—")
      : "—";

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-muted-foreground text-sm">
          {projects.length}{" "}
          {projects.length === 1 ? "case study" : "case studies"}
        </p>
        <button
          type="button"
          onClick={() => openEditor(null)}
          className={buttonVariants({ variant: "default", size: "sm" })}
        >
          New case study
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
          Could not load case studies right now. Please refresh the page — if
          the problem persists, verify the Supabase configuration.
        </div>
      ) : null}

      {!loadError && projects.length === 0 ? (
        <div className="border-border bg-muted/30 mt-4 rounded-xl border border-dashed p-10 text-center">
          <Inbox
            aria-hidden="true"
            className="text-muted-foreground/60 mx-auto size-8"
          />
          <p className="text-muted-foreground mt-3 text-sm">
            No case studies yet. Document the first project to get started.
          </p>
        </div>
      ) : null}

      {!loadError && projects.length > 0 ? (
        <div className="border-border mt-4 overflow-x-auto rounded-xl border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-border text-muted-foreground border-b text-left text-xs tracking-wide uppercase">
                <th scope="col" className="px-4 py-3 font-medium">
                  Case study
                </th>
                <th scope="col" className="px-4 py-3 font-medium">
                  Client type
                </th>
                <th scope="col" className="px-4 py-3 font-medium">
                  Location
                </th>
                <th scope="col" className="px-4 py-3 font-medium">
                  Year
                </th>
                <th scope="col" className="px-4 py-3 font-medium">
                  Service
                </th>
                <th scope="col" className="px-4 py-3 font-medium">
                  Featured
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
              {projects.map((project) => {
                const merged = { ...project, ...overrides[project.id] };
                const rowPending = pendingId === project.id;
                return (
                  <tr
                    key={project.id}
                    className="hover:bg-muted/40 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <p className="font-medium">{project.title}</p>
                      <code className="text-muted-foreground text-xs">
                        {project.slug}
                      </code>
                    </td>
                    <td className="text-muted-foreground px-4 py-3">
                      {project.client_type}
                    </td>
                    <td className="px-4 py-3">{project.location}</td>
                    <td className="px-4 py-3 tabular-nums">
                      {project.completed_year}
                    </td>
                    <td className="text-muted-foreground px-4 py-3">
                      {serviceTitle(project.service_id)}
                    </td>
                    <td className="px-4 py-3">
                      {merged.is_featured ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-800">
                          <Star
                            aria-hidden="true"
                            className="size-3 fill-amber-400"
                          />
                          Featured
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
                          aria-label={`Edit ${project.title}`}
                          onClick={() => openEditor(project)}
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
                            merged.is_featured ? "Unfeature" : "Feature"
                          } ${project.title}`}
                          disabled={rowPending}
                          onClick={() =>
                            void handleToggle(
                              project,
                              "is_featured",
                              !merged.is_featured,
                            )
                          }
                          className={buttonVariants({
                            variant: "ghost",
                            size: "sm",
                          })}
                        >
                          <Star
                            aria-hidden="true"
                            className={`size-4 ${
                              merged.is_featured ? "fill-amber-400" : ""
                            }`}
                          />
                        </button>
                        <button
                          type="button"
                          aria-label={`${
                            merged.is_published ? "Unpublish" : "Publish"
                          } ${project.title}`}
                          disabled={rowPending}
                          onClick={() =>
                            void handleToggle(
                              project,
                              "is_published",
                              !merged.is_published,
                            )
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
        <ProjectEditorDrawer
          key={editing?.id ?? "new"}
          project={editing}
          serviceOptions={serviceOptions}
          onClose={() => setIsEditorOpen(false)}
        />
      ) : null}
    </div>
  );
}
