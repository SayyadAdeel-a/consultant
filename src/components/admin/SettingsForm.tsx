"use client";

import { useState, type FormEvent } from "react";
import { updateSiteSettings } from "@/app/actions/settings";
import { FormField } from "@/components/forms/FormField";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { SiteSettingsRecord } from "@/types/cms";
import type { SiteSettingsInput } from "@/lib/validations/settings";

type Notice = { kind: "error" | "success"; text: string };

/** Mirrors the `cta_settings` column defaults for a first-run (no row). */
const CTA_DEFAULTS = {
  primaryLabel: "Request Consultation",
  primaryHref: "/contact",
  secondaryLabel: "Explore Services",
  secondaryHref: "/services",
};

/**
 * Global settings editor (docs/TASKS.md Task 7.4): company identity,
 * contact details, social links, and the primary/secondary CTA pair.
 * Submits a validated `SiteSettingsInput` to the `updateSiteSettings`
 * Server Action; returned Zod field errors render inline — the shared
 * schema is the single source of truth.
 */
export function SettingsForm({
  settings,
}: {
  settings: SiteSettingsRecord | null;
}) {
  const [form, setForm] = useState(() => ({
    company_name: settings?.company_name ?? "",
    tagline: settings?.tagline ?? "",
    description: settings?.description ?? "",
    contact_email: settings?.contact_email ?? "",
    contact_phone: settings?.contact_phone ?? "",
    office_address: settings?.office_address ?? "",
    linkedin_url: settings?.social_links.linkedin ?? "",
    twitter_url: settings?.social_links.twitter ?? "",
    primary_cta_label:
      settings?.cta_settings.primaryLabel ?? CTA_DEFAULTS.primaryLabel,
    primary_cta_url:
      settings?.cta_settings.primaryHref ?? CTA_DEFAULTS.primaryHref,
    secondary_cta_label:
      settings?.cta_settings.secondaryLabel ?? CTA_DEFAULTS.secondaryLabel,
    secondary_cta_url:
      settings?.cta_settings.secondaryHref ?? CTA_DEFAULTS.secondaryHref,
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

    try {
      const payload: SiteSettingsInput = { ...form };
      const result = await updateSiteSettings(payload);
      if (result.ok) {
        setNotice({ kind: "success", text: "Settings saved." });
        return;
      }
      setFieldErrors(result.fieldErrors ?? {});
      setNotice({ kind: "error", text: result.message });
    } catch {
      setNotice({
        kind: "error",
        text: "Could not save the settings — your session may have expired.",
      });
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
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

      <section
        aria-labelledby="settings-identity-heading"
        className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4"
      >
        <div>
          <h2
            id="settings-identity-heading"
            className="font-heading text-base font-semibold text-foreground"
          >
            Company identity
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Official company name, tagline, and brand description rendered across headers and metadata.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            id="settings-company-name"
            label="Company name"
            error={fieldErrors.company_name}
          >
            <Input
              id="settings-company-name"
              value={form.company_name}
              onChange={(event) => update("company_name", event.target.value)}
              aria-invalid={fieldErrors.company_name ? true : undefined}
              aria-describedby={
                fieldErrors.company_name
                  ? "settings-company-name-error"
                  : undefined
              }
            />
          </FormField>
          <FormField
            id="settings-tagline"
            label="Tagline"
            error={fieldErrors.tagline}
          >
            <Input
              id="settings-tagline"
              value={form.tagline}
              onChange={(event) => update("tagline", event.target.value)}
              aria-invalid={fieldErrors.tagline ? true : undefined}
              aria-describedby={
                fieldErrors.tagline ? "settings-tagline-error" : undefined
              }
            />
          </FormField>
        </div>
        <FormField
          id="settings-description"
          label="Description"
          error={fieldErrors.description}
        >
          <Textarea
            id="settings-description"
            rows={3}
            value={form.description}
            onChange={(event) => update("description", event.target.value)}
            aria-invalid={fieldErrors.description ? true : undefined}
            aria-describedby={
              fieldErrors.description ? "settings-description-error" : undefined
            }
          />
        </FormField>
      </section>

      <section
        aria-labelledby="settings-contact-heading"
        className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4"
      >
        <div>
          <h2
            id="settings-contact-heading"
            className="font-heading text-base font-semibold text-foreground"
          >
            Contact details
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Direct email, phone, and office address shown in headers, footers, and consultation forms.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            id="settings-contact-email"
            label="Email"
            error={fieldErrors.contact_email}
          >
            <Input
              id="settings-contact-email"
              type="email"
              value={form.contact_email}
              onChange={(event) => update("contact_email", event.target.value)}
              aria-invalid={fieldErrors.contact_email ? true : undefined}
              aria-describedby={
                fieldErrors.contact_email
                  ? "settings-contact-email-error"
                  : undefined
              }
            />
          </FormField>
          <FormField
            id="settings-contact-phone"
            label="Phone"
            error={fieldErrors.contact_phone}
          >
            <Input
              id="settings-contact-phone"
              type="tel"
              value={form.contact_phone}
              onChange={(event) => update("contact_phone", event.target.value)}
              aria-invalid={fieldErrors.contact_phone ? true : undefined}
              aria-describedby={
                fieldErrors.contact_phone
                  ? "settings-contact-phone-error"
                  : undefined
              }
            />
          </FormField>
        </div>
        <FormField
          id="settings-office-address"
          label="Office address"
          error={fieldErrors.office_address}
        >
          <Textarea
            id="settings-office-address"
            rows={2}
            value={form.office_address}
            onChange={(event) => update("office_address", event.target.value)}
            aria-invalid={fieldErrors.office_address ? true : undefined}
            aria-describedby={
              fieldErrors.office_address
                ? "settings-office-address-error"
                : undefined
            }
          />
        </FormField>
      </section>

      <section
        aria-labelledby="settings-social-heading"
        className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4"
      >
        <div>
          <h2
            id="settings-social-heading"
            className="font-heading text-base font-semibold text-foreground"
          >
            Social links
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Corporate profiles linked in the website footer.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            id="settings-linkedin"
            label="LinkedIn URL"
            error={fieldErrors.linkedin_url}
          >
            <Input
              id="settings-linkedin"
              type="url"
              value={form.linkedin_url}
              onChange={(event) => update("linkedin_url", event.target.value)}
              aria-invalid={fieldErrors.linkedin_url ? true : undefined}
              aria-describedby={
                fieldErrors.linkedin_url ? "settings-linkedin-error" : undefined
              }
              placeholder="https://linkedin.com/company/…"
            />
          </FormField>
          <FormField
            id="settings-twitter"
            label="Twitter / X URL"
            error={fieldErrors.twitter_url}
          >
            <Input
              id="settings-twitter"
              type="url"
              value={form.twitter_url}
              onChange={(event) => update("twitter_url", event.target.value)}
              aria-invalid={fieldErrors.twitter_url ? true : undefined}
              aria-describedby={
                fieldErrors.twitter_url ? "settings-twitter-error" : undefined
              }
              placeholder="https://x.com/…"
            />
          </FormField>
        </div>
      </section>

      <section
        aria-labelledby="settings-cta-heading"
        className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4"
      >
        <div>
          <h2
            id="settings-cta-heading"
            className="font-heading text-base font-semibold text-foreground"
          >
            Calls to action
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Primary and secondary action buttons configured across the global header and heroes.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            id="settings-primary-cta-label"
            label="Primary CTA label"
            error={fieldErrors.primary_cta_label}
          >
            <Input
              id="settings-primary-cta-label"
              value={form.primary_cta_label}
              onChange={(event) =>
                update("primary_cta_label", event.target.value)
              }
              aria-invalid={fieldErrors.primary_cta_label ? true : undefined}
              aria-describedby={
                fieldErrors.primary_cta_label
                  ? "settings-primary-cta-label-error"
                  : undefined
              }
            />
          </FormField>
          <FormField
            id="settings-primary-cta-url"
            label="Primary CTA URL"
            error={fieldErrors.primary_cta_url}
          >
            <Input
              id="settings-primary-cta-url"
              value={form.primary_cta_url}
              onChange={(event) =>
                update("primary_cta_url", event.target.value)
              }
              aria-invalid={fieldErrors.primary_cta_url ? true : undefined}
              aria-describedby={
                fieldErrors.primary_cta_url
                  ? "settings-primary-cta-url-error"
                  : undefined
              }
              placeholder="/contact"
            />
          </FormField>
          <FormField
            id="settings-secondary-cta-label"
            label="Secondary CTA label"
            error={fieldErrors.secondary_cta_label}
          >
            <Input
              id="settings-secondary-cta-label"
              value={form.secondary_cta_label}
              onChange={(event) =>
                update("secondary_cta_label", event.target.value)
              }
              aria-invalid={fieldErrors.secondary_cta_label ? true : undefined}
              aria-describedby={
                fieldErrors.secondary_cta_label
                  ? "settings-secondary-cta-label-error"
                  : undefined
              }
            />
          </FormField>
          <FormField
            id="settings-secondary-cta-url"
            label="Secondary CTA URL"
            error={fieldErrors.secondary_cta_url}
          >
            <Input
              id="settings-secondary-cta-url"
              value={form.secondary_cta_url}
              onChange={(event) =>
                update("secondary_cta_url", event.target.value)
              }
              aria-invalid={fieldErrors.secondary_cta_url ? true : undefined}
              aria-describedby={
                fieldErrors.secondary_cta_url
                  ? "settings-secondary-cta-url-error"
                  : undefined
              }
              placeholder="/services"
            />
          </FormField>
        </div>
      </section>

      <div className="border-border flex items-center justify-end gap-3 border-t pt-5">
        <button
          type="submit"
          disabled={pending}
          className={buttonVariants({ variant: "default" })}
        >
          {pending ? "Saving…" : "Save settings"}
        </button>
      </div>
    </form>
  );
}
