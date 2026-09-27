"use client";

import { useActionState, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/forms/FormField";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { submitInquiry } from "@/app/actions/contact";
import {
  INQUIRY_TYPES,
  INQUIRY_TYPE_LABELS,
  type InquiryType,
  contactInquirySchema,
  flattenContactIssues,
} from "@/lib/validations/contact";

/**
 * Maps `?service=` search-param values (service slugs from the detail
 * pages, or raw inquiry-type values) onto the `inquiryType` enum so the
 * contact form arrives pre-selected. Unknown values fall back to the
 * neutral "general" option.
 */
const SERVICE_TO_INQUIRY_TYPE: Record<string, InquiryType> = {
  "wetland-delineation": "wetland-delineation",
  "environmental-permitting": "permitting",
  "environmental-assessments": "assessment",
  "environmental-planning": "planning",
  general: "general",
  permitting: "permitting",
  assessment: "assessment",
  planning: "planning",
  other: "other",
};

export function resolveInquiryType(
  service: string | null | undefined,
): InquiryType {
  if (!service) return "general";
  return SERVICE_TO_INQUIRY_TYPE[service] ?? "general";
}

interface FormValues {
  name: string;
  email: string;
  phone: string;
  organization: string;
  inquiryType: InquiryType;
  message: string;
  consent: boolean;
}

const EMPTY_VALUES: FormValues = {
  name: "",
  email: "",
  phone: "",
  organization: "",
  inquiryType: "general",
  message: "",
  consent: false,
};

const inputClass = "h-10";

export function ContactForm() {
  const searchParams = useSearchParams();
  const [values, setValues] = useState<FormValues>(() => ({
    ...EMPTY_VALUES,
    inquiryType: resolveInquiryType(searchParams.get("service")),
  }));
  const [clientErrors, setClientErrors] = useState<Record<string, string>>({});
  const [state, formAction, pending] = useActionState(submitInquiry, {
    status: "idle",
    message: null,
    fieldErrors: null,
  });

  // Displayed errors merge server-returned field errors (from the last
  // action) with locally validated ones; editing a field clears its local
  // error. Derived during render — no effect needed.
  const fieldErrors = {
    ...(state.status === "error" ? (state.fieldErrors ?? {}) : {}),
    ...clientErrors,
  };

  function update<K extends keyof FormValues>(key: K, value: FormValues[K]) {
    setValues((previous) => ({ ...previous, [key]: value }));
    setClientErrors((previous) => {
      if (!(key in previous)) return previous;
      const next = { ...previous };
      delete next[key];
      return next;
    });
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    const formData = new FormData(event.currentTarget);

    // Client-side validation with the shared schema (same rules the
    // server enforces — the schema is the single source of truth).
    const parsed = contactInquirySchema.safeParse({
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      organization: String(formData.get("organization") ?? ""),
      inquiryType: String(formData.get("inquiryType") ?? "general"),
      message: String(formData.get("message") ?? ""),
      consent: ["on", "true"].includes(String(formData.get("consent") ?? "")),
    });

    if (!parsed.success) {
      // Block the submission and surface inline errors.
      event.preventDefault();
      const errors = flattenContactIssues(parsed.error);
      setClientErrors(errors);
      const firstKey = Object.keys(errors)[0];
      if (firstKey) document.getElementById(`contact-${firstKey}`)?.focus();
      return;
    }

    // Valid — do NOT preventDefault: React dispatches the form's `action`
    // inside its own transition, which keeps `pending` accurate.
    setClientErrors({});
  }

  if (state.status === "success") {
    return (
      <div
        role="status"
        aria-live="polite"
        className="border-border bg-card rounded-xl border p-6 md:p-8"
      >
        <h2 className="font-heading text-xl font-semibold">Inquiry received</h2>
        <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
          {state.message}
        </p>
        <p className="text-muted-foreground mt-4 text-sm">
          Need to add details in the meantime? Call{" "}
          <a
            href="tel:+12075550148"
            className="text-brand-forest font-medium underline-offset-4 hover:underline"
          >
            (207) 555-0148
          </a>{" "}
          or email{" "}
          <a
            href="mailto:inquiries@integravity.example"
            className="text-brand-forest font-medium underline-offset-4 hover:underline"
          >
            inquiries@integravity.example
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <form
      aria-labelledby="contact-form-title"
      noValidate
      onSubmit={handleSubmit}
      action={formAction}
      className="border-border bg-card space-y-6 rounded-xl border p-6 md:p-8"
    >
      <div>
        <h2
          id="contact-form-title"
          className="font-heading text-xl font-semibold"
        >
          Consultation request
        </h2>
        <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
          Tell us about your site and timeline — a consultant replies within one
          business day.
        </p>
      </div>

      {state.status === "error" && state.message ? (
        <div
          role="alert"
          className="border-destructive/40 bg-destructive/10 text-destructive rounded-lg border p-4 text-sm"
        >
          {state.message}
        </div>
      ) : null}

      <FormField id="contact-name" label="Full name" error={fieldErrors.name}>
        <Input
          id="contact-name"
          name="name"
          type="text"
          required
          autoComplete="name"
          value={values.name}
          onChange={(event) => update("name", event.target.value)}
          aria-invalid={fieldErrors.name ? true : undefined}
          aria-describedby={fieldErrors.name ? "contact-name-error" : undefined}
          className={inputClass}
        />
      </FormField>

      <FormField id="contact-email" label="Email" error={fieldErrors.email}>
        <Input
          id="contact-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          value={values.email}
          onChange={(event) => update("email", event.target.value)}
          aria-invalid={fieldErrors.email ? true : undefined}
          aria-describedby={
            fieldErrors.email ? "contact-email-error" : undefined
          }
          className={inputClass}
        />
      </FormField>

      <FormField
        id="contact-phone"
        label="Phone (optional)"
        error={fieldErrors.phone}
      >
        <Input
          id="contact-phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          value={values.phone}
          onChange={(event) => update("phone", event.target.value)}
          aria-invalid={fieldErrors.phone ? true : undefined}
          aria-describedby={
            fieldErrors.phone ? "contact-phone-error" : undefined
          }
          className={inputClass}
        />
      </FormField>

      <FormField
        id="contact-organization"
        label="Company / organization"
        error={fieldErrors.organization}
      >
        <Input
          id="contact-organization"
          name="organization"
          type="text"
          autoComplete="organization"
          value={values.organization}
          onChange={(event) => update("organization", event.target.value)}
          aria-invalid={fieldErrors.organization ? true : undefined}
          aria-describedby={
            fieldErrors.organization ? "contact-organization-error" : undefined
          }
          className={inputClass}
        />
      </FormField>

      <FormField
        id="contact-inquiryType"
        label="Inquiry type"
        error={fieldErrors.inquiryType}
      >
        <select
          id="contact-inquiryType"
          name="inquiryType"
          required
          value={values.inquiryType}
          onChange={(event) =>
            update("inquiryType", event.target.value as InquiryType)
          }
          aria-invalid={fieldErrors.inquiryType ? true : undefined}
          aria-describedby={
            fieldErrors.inquiryType ? "contact-inquiryType-error" : undefined
          }
          className="border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 h-10 w-full min-w-0 rounded-lg border bg-transparent px-2.5 py-1 text-base transition-colors outline-none focus-visible:ring-3 aria-invalid:ring-3 md:text-sm"
        >
          {INQUIRY_TYPES.map((type) => (
            <option key={type} value={type}>
              {INQUIRY_TYPE_LABELS[type]}
            </option>
          ))}
        </select>
      </FormField>

      <FormField
        id="contact-message"
        label="Message"
        error={fieldErrors.message}
      >
        <Textarea
          id="contact-message"
          name="message"
          required
          rows={6}
          value={values.message}
          onChange={(event) => update("message", event.target.value)}
          aria-invalid={fieldErrors.message ? true : undefined}
          aria-describedby={
            fieldErrors.message ? "contact-message-error" : undefined
          }
          placeholder="Site location, permitting body, timeline…"
        />
      </FormField>

      <div className="space-y-2">
        <div className="flex items-start gap-2.5">
          <input
            id="contact-consent"
            name="consent"
            type="checkbox"
            required
            checked={values.consent}
            onChange={(event) => update("consent", event.target.checked)}
            aria-invalid={fieldErrors.consent ? true : undefined}
            aria-describedby={
              fieldErrors.consent ? "contact-consent-error" : undefined
            }
            className="accent-primary mt-0.5 size-4 shrink-0"
          />
          <Label
            htmlFor="contact-consent"
            className="text-muted-foreground leading-relaxed font-normal"
          >
            I consent to IntegraVity storing this information to respond to my
            inquiry.
          </Label>
        </div>
        {fieldErrors.consent ? (
          <p
            id="contact-consent-error"
            role="alert"
            className="text-destructive text-sm"
          >
            {fieldErrors.consent}
          </p>
        ) : null}
      </div>

      {/* Honeypot — invisible to humans, attractive to bots (BACKEND_SECURITY §6.2). */}
      <div className="hidden" aria-hidden="true">
        <Label htmlFor="contact-companyWebsite">Company website</Label>
        <Input
          id="contact-companyWebsite"
          name="companyWebsite"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          defaultValue=""
        />
      </div>

      <Button
        type="submit"
        size="lg"
        disabled={pending}
        aria-busy={pending}
        className="h-12 w-full text-base"
      >
        {pending ? "Sending…" : "Send consultation request"}
      </Button>
    </form>
  );
}
