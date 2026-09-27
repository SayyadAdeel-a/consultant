"use client";

import { useState, type FormEvent } from "react";
import { updateHomepageSection } from "@/app/actions/content";
import { FormField } from "@/components/forms/FormField";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { HomepageSectionRecord } from "@/types/cms";
import type { SectionInput } from "@/lib/validations/content";
import { AdminDrawer } from "./AdminDrawer";

type Notice = { kind: "error" | "success"; text: string };

/**
 * Headline/ordering editor for one homepage section
 * (docs/TASKS.md Task 7.4). The section key is immutable here — shown
 * as the drawer eyebrow — and visibility is toggled from the table.
 * Submits a validated `SectionInput` to `updateHomepageSection`.
 */
export function SectionEditorDrawer({
  section,
  onClose,
}: {
  section: HomepageSectionRecord;
  onClose: () => void;
}) {
  const [form, setForm] = useState(() => ({
    title: section.title,
    subtitle: section.subtitle ?? "",
    display_order: String(section.display_order),
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

    const payload: SectionInput = {
      id: section.id,
      title: form.title,
      subtitle: form.subtitle,
      display_order: form.display_order,
    };

    try {
      const result = await updateHomepageSection(payload);
      if (result.ok) {
        onClose();
        return;
      }
      setFieldErrors(result.fieldErrors ?? {});
      setNotice({ kind: "error", text: result.message });
    } catch {
      setNotice({
        kind: "error",
        text: "Could not save the section — your session may have expired.",
      });
    } finally {
      setPending(false);
    }
  }

  return (
    <AdminDrawer
      eyebrow={`Section · ${section.section_key}`}
      title={section.title}
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

        <FormField
          id="section-title"
          label="Section title"
          error={fieldErrors.title}
        >
          <Input
            id="section-title"
            value={form.title}
            onChange={(event) => update("title", event.target.value)}
            aria-invalid={fieldErrors.title ? true : undefined}
            aria-describedby={
              fieldErrors.title ? "section-title-error" : undefined
            }
          />
        </FormField>

        <FormField
          id="section-subtitle"
          label="Subtitle (optional)"
          error={fieldErrors.subtitle}
        >
          <Textarea
            id="section-subtitle"
            rows={2}
            value={form.subtitle}
            onChange={(event) => update("subtitle", event.target.value)}
            aria-invalid={fieldErrors.subtitle ? true : undefined}
            aria-describedby={
              fieldErrors.subtitle ? "section-subtitle-error" : undefined
            }
          />
        </FormField>

        <FormField
          id="section-display-order"
          label="Display order"
          error={fieldErrors.display_order}
        >
          <Input
            id="section-display-order"
            type="number"
            min={0}
            value={form.display_order}
            onChange={(event) => update("display_order", event.target.value)}
            aria-invalid={fieldErrors.display_order ? true : undefined}
            aria-describedby={
              fieldErrors.display_order
                ? "section-display-order-error"
                : undefined
            }
          />
        </FormField>

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
            {pending ? "Saving…" : "Save section"}
          </button>
        </div>
      </form>
    </AdminDrawer>
  );
}
