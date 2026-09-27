"use server";

import { isSupabaseConfigured, SupabaseNotConfiguredError } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";
import {
  contactInquirySchema,
  flattenContactIssues,
} from "@/lib/validations/contact";

/**
 * Contact intake Server Action (docs/TASKS.md Task 5.1).
 *
 * Security posture (docs/BACKEND_SECURITY.md §6):
 * - Honeypot first: any non-empty `companyWebsite` value is spam — the
 *   submission is discarded silently (fake success, so bots learn nothing)
 *   and never touches the database.
 * - Schema validation against the shared `contactInquirySchema`; field
 *   errors return to the client keyed by input `name`.
 * - Storage uses the anon server client, so Postgres RLS is always
 *   enforced. The `inquiries` public INSERT policy permits visitors to
 *   submit but never to read; the service-role key stays out of the
 *   contact path entirely (least privilege).
 * - Demo mode: when Supabase credentials are absent the submission
 *   succeeds gracefully and is logged server-side instead of stored, so
 *   the template runs without a configured backend (fail-secure, no
 *   silent security bypass — nothing privileged happens).
 */

export type ContactFormState = {
  status: "idle" | "success" | "error";
  message: string | null;
  fieldErrors: Record<string, string> | null;
};

const SUCCESS_MESSAGE =
  "Thank you — your consultation request has been received. A consultant will reply within one business day.";

const GENERIC_ERROR_MESSAGE =
  "We could not send your message right now. Please try again, or email us directly at inquiries@integravity.example.";

function asString(value: FormDataEntryValue | null): string {
  return typeof value === "string" ? value : "";
}

export async function submitInquiry(
  _prevState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  // Honeypot gate — humans never see this field (BACKEND_SECURITY §6.2).
  if (asString(formData.get("companyWebsite")).trim() !== "") {
    console.warn("[contact] Honeypot triggered; inquiry discarded.");
    return { status: "success", message: SUCCESS_MESSAGE, fieldErrors: null };
  }

  const parsed = contactInquirySchema.safeParse({
    name: asString(formData.get("name")),
    email: asString(formData.get("email")),
    phone: asString(formData.get("phone")),
    organization: asString(formData.get("organization")),
    inquiryType: asString(formData.get("inquiryType")) || "general",
    message: asString(formData.get("message")),
    consent: ["on", "true"].includes(asString(formData.get("consent"))),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Please correct the highlighted fields and try again.",
      fieldErrors: flattenContactIssues(parsed.error),
    };
  }

  try {
    if (!isSupabaseConfigured()) {
      // Demo mode: graceful success + server-side log, nothing stored.
      console.log(
        `[contact] Demo mode (Supabase not configured) — inquiry NOT stored. type=${parsed.data.inquiryType} name=${parsed.data.name}`,
      );
      return { status: "success", message: SUCCESS_MESSAGE, fieldErrors: null };
    }

    const supabase = await createClient();
    const { error } = await supabase.from("inquiries").insert({
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone || null,
      company: parsed.data.organization || null,
      inquiry_type: parsed.data.inquiryType,
      message: parsed.data.message,
    });

    if (error) {
      console.error("[contact] Failed to store inquiry:", error.message);
      return {
        status: "error",
        message: GENERIC_ERROR_MESSAGE,
        fieldErrors: null,
      };
    }

    return { status: "success", message: SUCCESS_MESSAGE, fieldErrors: null };
  } catch (error) {
    if (error instanceof SupabaseNotConfiguredError) {
      // Partially configured environment (e.g. anon key without the
      // expected server config) — treat as demo mode rather than failing
      // the visitor's submission.
      console.log(
        `[contact] Demo mode (credentials missing) — inquiry NOT stored. type=${parsed.data.inquiryType}`,
      );
      return { status: "success", message: SUCCESS_MESSAGE, fieldErrors: null };
    }
    console.error("[contact] Unexpected error storing inquiry:", error);
    return {
      status: "error",
      message: GENERIC_ERROR_MESSAGE,
      fieldErrors: null,
    };
  }
}
