"use client";

import { useState, type FormEvent } from "react";
import { upsertProject } from "@/app/actions/projects";
import { FormField } from "@/components/forms/FormField";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { ProjectRecord, ServiceOption } from "@/types/cms";
import type { ProjectInput } from "@/lib/validations/projects";
import { AdminDrawer } from "./AdminDrawer";

type Notice = { kind: "error" | "success"; text: string };

/**
 * Create/edit slide-over for a case study
 * (docs/TASKS.md Task 7.3). Submits a validated `ProjectInput` to the
 * `upsertProject` Server Action; Zod field errors render inline. The
 * "Associated service" selector is included beyond the field list so the
 * table's service column is always settable.
 */
export function ProjectEditorDrawer({
  project,
  serviceOptions,
  onClose,
}: {
  project: ProjectRecord | null;
  serviceOptions: ServiceOption[];
  onClose: () => void;
}) {
  const [form, setForm] = useState(() => ({
    title: project?.title ?? "",
    slug: project?.slug ?? "",
    client_type: project?.client_type ?? "",
    location: project?.location ?? "",
    completed_year: String(project?.completed_year ?? ""),
    summary: project?.summary ?? "",
    challenge: project?.challenge ?? "",
    solution: project?.solution ?? "",
    results: project?.results ?? "",
    featured_image_url: project?.featured_image_url ?? "",
    service_id: project?.service_id ?? "",
    display_order: String(project?.display_order ?? 0),
    is_featured: project?.is_featured ?? false,
    is_published: project?.is_published ?? true,
  }));
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [notice, setNotice] = useState<Notice | null>(null);
  const [pending, setPending] = useState(false);

  function update<K extends keyof typeof form>(
    key: K,
    value: (typeof form)[K],
  ) {
    setForm((previous) => ({ ...previous, [key]: value }));
    setFieldErrors((previous) => {
      if (!previous[key]) return previous;
      const next = { ...previous };
      delete next[key];
      return next;
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setNotice(null);
    setFieldErrors({});

    const payload: ProjectInput = {
      ...(project ? { id: project.id } : {}),
      title: form.title,
      slug: form.slug,
      client_type: form.client_type,
      location: form.location,
      completed_year: form.completed_year,
      summary: form.summary,
      challenge: form.challenge,
      solution: form.solution,
      results: form.results,
      featured_image_url: form.featured_image_url,
      service_id: form.service_id,
      display_order: form.display_order,
      is_featured: form.is_featured,
      is_published: form.is_published,
    };

    try {
      const result = await upsertProject(payload);
      if (result.ok) {
        onClose();
        return;
      }
      setFieldErrors(result.fieldErrors ?? {});
      setNotice({ kind: "error", text: result.message });
    } catch {
      setNotice({
        kind: "error",
        text: "Could not save the case study — your session may have expired.",
      });
    } finally {
      setPending(false);
    }
  }

  return (
    <AdminDrawer
      eyebrow={project ? "Edit case study" : "New case study"}
      title={project ? project.title : "New case study"}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        {notice ? (
          <div
            role={notice.kind === "error" ? "alert" : "status"}
            className={`rounded-lg px-4 py-3 text-sm ${
              notice.kind === "error"
                ? "border-destructive/40 bg-destructive/10 text-destructive"
                : "bg-brand-sage/30 text-brand-forest"
            }`}
          >
            {notice.text}
          </div>
        ) : null}

        <FormField id="project-title" label="Title" error={fieldErrors.title}>
          <Input
            id="project-title"
            value={form.title}
            onChange={(event) => update("title", event.target.value)}
            aria-invalid={fieldErrors.title ? true : undefined}
            aria-describedby={
              fieldErrors.title ? "project-title-error" : undefined
            }
          />
        </FormField>

        <FormField id="project-slug" label="Slug" error={fieldErrors.slug}>
          <Input
            id="project-slug"
            value={form.slug}
            onChange={(event) => update("slug", event.target.value)}
            aria-invalid={fieldErrors.slug ? true : undefined}
            aria-describedby={
              fieldErrors.slug ? "project-slug-error" : undefined
            }
            placeholder="casco-bay-marina"
          />
        </FormField>

        <div className="grid gap-5 sm:grid-cols-2">
          <FormField
            id="project-client-type"
            label="Client type"
            error={fieldErrors.client_type}
          >
            <Input
              id="project-client-type"
              value={form.client_type}
              onChange={(event) => update("client_type", event.target.value)}
              aria-invalid={fieldErrors.client_type ? true : undefined}
              aria-describedby={
                fieldErrors.client_type
                  ? "project-client-type-error"
                  : undefined
              }
              placeholder="Municipal"
            />
          </FormField>

          <FormField
            id="project-location"
            label="Location"
            error={fieldErrors.location}
          >
            <Input
              id="project-location"
              value={form.location}
              onChange={(event) => update("location", event.target.value)}
              aria-invalid={fieldErrors.location ? true : undefined}
              aria-describedby={
                fieldErrors.location ? "project-location-error" : undefined
              }
              placeholder="Portland, Maine"
            />
          </FormField>
        </div>

        <div className="grid gap-5 sm:grid-cols-3">
          <FormField
            id="project-completed-year"
            label="Completed year"
            error={fieldErrors.completed_year}
          >
            <Input
              id="project-completed-year"
              type="number"
              min={1900}
              max={2100}
              value={form.completed_year}
              onChange={(event) => update("completed_year", event.target.value)}
              aria-invalid={fieldErrors.completed_year ? true : undefined}
              aria-describedby={
                fieldErrors.completed_year
                  ? "project-completed-year-error"
                  : undefined
              }
              placeholder="2025"
            />
          </FormField>

          <FormField
            id="project-display-order"
            label="Display order"
            error={fieldErrors.display_order}
          >
            <Input
              id="project-display-order"
              type="number"
              min={0}
              value={form.display_order}
              onChange={(event) => update("display_order", event.target.value)}
              aria-invalid={fieldErrors.display_order ? true : undefined}
              aria-describedby={
                fieldErrors.display_order
                  ? "project-display-order-error"
                  : undefined
              }
            />
          </FormField>

          <FormField
            id="project-service"
            label="Associated service"
            error={fieldErrors.service_id}
          >
            <select
              id="project-service"
              value={form.service_id}
              onChange={(event) => update("service_id", event.target.value)}
              className="border-input bg-background focus-visible:ring-ring/50 h-8 w-full rounded-lg border px-2 text-sm focus-visible:ring-3 focus-visible:outline-none"
            >
              <option value="">None</option>
              {serviceOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.title}
                  {option.is_published ? "" : " (draft)"}
                </option>
              ))}
            </select>
          </FormField>
        </div>

        <FormField
          id="project-summary"
          label="Summary"
          error={fieldErrors.summary}
        >
          <Textarea
            id="project-summary"
            rows={3}
            value={form.summary}
            onChange={(event) => update("summary", event.target.value)}
            aria-invalid={fieldErrors.summary ? true : undefined}
            aria-describedby={
              fieldErrors.summary ? "project-summary-error" : undefined
            }
          />
        </FormField>

        <FormField
          id="project-challenge"
          label="Challenge"
          error={fieldErrors.challenge}
        >
          <Textarea
            id="project-challenge"
            rows={4}
            value={form.challenge}
            onChange={(event) => update("challenge", event.target.value)}
            aria-invalid={fieldErrors.challenge ? true : undefined}
            aria-describedby={
              fieldErrors.challenge ? "project-challenge-error" : undefined
            }
          />
        </FormField>

        <FormField
          id="project-solution"
          label="Solution"
          error={fieldErrors.solution}
        >
          <Textarea
            id="project-solution"
            rows={4}
            value={form.solution}
            onChange={(event) => update("solution", event.target.value)}
            aria-invalid={fieldErrors.solution ? true : undefined}
            aria-describedby={
              fieldErrors.solution ? "project-solution-error" : undefined
            }
          />
        </FormField>

        <FormField
          id="project-results"
          label="Results"
          error={fieldErrors.results}
        >
          <Textarea
            id="project-results"
            rows={4}
            value={form.results}
            onChange={(event) => update("results", event.target.value)}
            aria-invalid={fieldErrors.results ? true : undefined}
            aria-describedby={
              fieldErrors.results ? "project-results-error" : undefined
            }
          />
        </FormField>

        <FormField
          id="project-featured-image"
          label="Featured image URL"
          error={fieldErrors.featured_image_url}
        >
          <Input
            id="project-featured-image"
            type="url"
            value={form.featured_image_url}
            onChange={(event) =>
              update("featured_image_url", event.target.value)
            }
            aria-invalid={fieldErrors.featured_image_url ? true : undefined}
            aria-describedby={
              fieldErrors.featured_image_url
                ? "project-featured-image-error"
                : undefined
            }
            placeholder="https://… or /images/…"
          />
        </FormField>

        <div className="flex flex-wrap items-center gap-6">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.is_featured}
              onChange={(event) => update("is_featured", event.target.checked)}
              className="size-4 accent-[#153E35]"
            />
            Featured
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.is_published}
              onChange={(event) => update("is_published", event.target.checked)}
              className="size-4 accent-[#153E35]"
            />
            Published
          </label>
        </div>

        <div className="border-border flex items-center justify-end gap-3 border-t pt-5">
          <button
            type="button"
            onClick={onClose}
            className={buttonVariants({ variant: "outline" })}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={pending}
            className={buttonVariants({ variant: "default" })}
          >
            {pending ? "Saving…" : "Save case study"}
          </button>
        </div>
      </form>
    </AdminDrawer>
  );
}
