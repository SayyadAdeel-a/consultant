"use client";

import { useState, type FormEvent } from "react";
import { upsertService } from "@/app/actions/services";
import { FormField } from "@/components/forms/FormField";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { ServiceRecord } from "@/types/cms";
import {
  SERVICE_ICON_NAMES,
  type ServiceIconName,
  type ServiceInput,
} from "@/lib/validations/services";
import { AdminDrawer } from "./AdminDrawer";
import { getServiceIcon } from "./service-icons";

type Notice = { kind: "error" | "success"; text: string };

function parseLines(text: string): string[] {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

/**
 * Create/edit slide-over for a service
 * (docs/TASKS.md Task 7.3). Submits a validated `ServiceInput` object to
 * the `upsertService` Server Action; field errors returned by the shared
 * Zod schema render inline (the schema is the single source of truth —
 * no separate client-side rules to drift).
 */
export function ServiceEditorDrawer({
  service,
  onClose,
}: {
  service: ServiceRecord | null;
  onClose: () => void;
}) {
  const [form, setForm] = useState(() => ({
    title: service?.title ?? "",
    slug: service?.slug ?? "",
    short_description: service?.short_description ?? "",
    full_content: service?.full_content ?? "",
    icon: (service?.icon ?? SERVICE_ICON_NAMES[0]) as ServiceIconName,
    pricing_note: service?.pricing_note ?? "",
    display_order: String(service?.display_order ?? 0),
    is_published: service?.is_published ?? true,
    deliverables: (service?.deliverables ?? []).join("\n"),
    regulatory_frameworks: (service?.regulatory_frameworks ?? []).join("\n"),
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

    const payload: ServiceInput = {
      ...(service ? { id: service.id } : {}),
      title: form.title,
      slug: form.slug,
      short_description: form.short_description,
      full_content: form.full_content,
      icon: form.icon,
      pricing_note: form.pricing_note,
      display_order: form.display_order,
      is_published: form.is_published,
      deliverables: parseLines(form.deliverables),
      regulatory_frameworks: parseLines(form.regulatory_frameworks),
    };

    try {
      const result = await upsertService(payload);
      if (result.ok) {
        onClose();
        return;
      }
      setFieldErrors(result.fieldErrors ?? {});
      setNotice({ kind: "error", text: result.message });
    } catch {
      setNotice({
        kind: "error",
        text: "Could not save the service — your session may have expired.",
      });
    } finally {
      setPending(false);
    }
  }

  const Icon = getServiceIcon(form.icon);

  return (
    <AdminDrawer
      eyebrow={service ? "Edit service" : "New service"}
      title={service ? service.title : "New service"}
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

        <FormField id="service-title" label="Title" error={fieldErrors.title}>
          <Input
            id="service-title"
            value={form.title}
            onChange={(event) => update("title", event.target.value)}
            aria-invalid={fieldErrors.title ? true : undefined}
            aria-describedby={
              fieldErrors.title ? "service-title-error" : undefined
            }
            placeholder="Wetland Delineation"
          />
        </FormField>

        <FormField id="service-slug" label="Slug" error={fieldErrors.slug}>
          <Input
            id="service-slug"
            value={form.slug}
            onChange={(event) => update("slug", event.target.value)}
            aria-invalid={fieldErrors.slug ? true : undefined}
            aria-describedby={
              fieldErrors.slug ? "service-slug-error" : undefined
            }
            placeholder="wetland-delineation"
          />
        </FormField>

        <FormField
          id="service-short-description"
          label="Short description"
          error={fieldErrors.short_description}
        >
          <Textarea
            id="service-short-description"
            rows={2}
            value={form.short_description}
            onChange={(event) =>
              update("short_description", event.target.value)
            }
            aria-invalid={fieldErrors.short_description ? true : undefined}
            aria-describedby={
              fieldErrors.short_description
                ? "service-short-description-error"
                : undefined
            }
          />
        </FormField>

        <FormField
          id="service-full-content"
          label="Full content"
          error={fieldErrors.full_content}
        >
          <Textarea
            id="service-full-content"
            rows={6}
            value={form.full_content}
            onChange={(event) => update("full_content", event.target.value)}
            aria-invalid={fieldErrors.full_content ? true : undefined}
            aria-describedby={
              fieldErrors.full_content
                ? "service-full-content-error"
                : undefined
            }
          />
        </FormField>

        <FormField id="service-icon" label="Icon" error={fieldErrors.icon}>
          <div className="flex items-center gap-2">
            {/* False positive: getServiceIcon resolves to a statically imported Lucide component. */}
            {/* eslint-disable-next-line react-hooks/static-components */}
            <Icon aria-hidden="true" className="text-brand-forest size-5" />
            <select
              id="service-icon"
              value={form.icon}
              onChange={(event) =>
                update("icon", event.target.value as ServiceIconName)
              }
              className="border-input bg-background focus-visible:ring-ring/50 h-8 rounded-lg border px-2 text-sm focus-visible:ring-3 focus-visible:outline-none"
            >
              {SERVICE_ICON_NAMES.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>
        </FormField>

        <FormField
          id="service-pricing-note"
          label="Pricing note (optional)"
          error={fieldErrors.pricing_note}
        >
          <Textarea
            id="service-pricing-note"
            rows={2}
            value={form.pricing_note}
            onChange={(event) => update("pricing_note", event.target.value)}
            aria-invalid={fieldErrors.pricing_note ? true : undefined}
            aria-describedby={
              fieldErrors.pricing_note
                ? "service-pricing-note-error"
                : "service-pricing-note-hint"
            }
            placeholder="Leave empty to show no pricing"
          />
          <p
            id="service-pricing-note-hint"
            className="text-muted-foreground text-xs"
          >
            Strictly optional — hidden from the public site entirely when empty
            (AGENTS.md §5.5).
          </p>
        </FormField>

        <FormField
          id="service-deliverables"
          label="Deliverables (one per line)"
          error={fieldErrors.deliverables}
        >
          <Textarea
            id="service-deliverables"
            rows={4}
            value={form.deliverables}
            onChange={(event) => update("deliverables", event.target.value)}
            aria-invalid={fieldErrors.deliverables ? true : undefined}
            aria-describedby={
              fieldErrors.deliverables
                ? "service-deliverables-error"
                : undefined
            }
            placeholder={
              "Delineation report with exhibits\nGIS-ready map layers"
            }
          />
        </FormField>

        <FormField
          id="service-frameworks"
          label="Regulatory frameworks (one per line)"
          error={fieldErrors.regulatory_frameworks}
        >
          <Textarea
            id="service-frameworks"
            rows={3}
            value={form.regulatory_frameworks}
            onChange={(event) =>
              update("regulatory_frameworks", event.target.value)
            }
            aria-invalid={fieldErrors.regulatory_frameworks ? true : undefined}
            aria-describedby={
              fieldErrors.regulatory_frameworks
                ? "service-frameworks-error"
                : undefined
            }
            placeholder={"CWA §404\nNEPA"}
          />
        </FormField>

        <div className="grid gap-5 sm:grid-cols-2">
          <FormField
            id="service-display-order"
            label="Display order"
            error={fieldErrors.display_order}
          >
            <Input
              id="service-display-order"
              type="number"
              min={0}
              value={form.display_order}
              onChange={(event) => update("display_order", event.target.value)}
              aria-invalid={fieldErrors.display_order ? true : undefined}
              aria-describedby={
                fieldErrors.display_order
                  ? "service-display-order-error"
                  : undefined
              }
            />
          </FormField>

          <label className="flex items-center gap-2 self-end pb-2 text-sm">
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
            {pending ? "Saving…" : "Save service"}
          </button>
        </div>
      </form>
    </AdminDrawer>
  );
}
