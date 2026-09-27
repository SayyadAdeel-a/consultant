"use server";

import { revalidatePath } from "next/cache";
import { assertAdmin } from "@/lib/auth/admin";
import { createClient } from "@/lib/supabase/server";
import {
  inquiryIdSchema,
  inquiryNotesSchema,
  inquiryStatusSchema,
  type InquiryStatus,
} from "@/lib/validations/inquiries";

/**
 * Confidential inquiry management Server Actions (docs/TASKS.md Task 7.2).
 *
 * Security model (docs/BACKEND_SECURITY.md):
 * - Every action calls `assertAdmin()` first — it THROWS (never redirects)
 *   when the caller is not a verified administrator, keeping privileged
 *   writes behind the same gate as the pages.
 * - Inputs are validated with the shared Zod schemas before any DB write.
 * - Writes run through the anon server client under the admin's session,
 *   so RLS (`public.is_admin()` policy on `inquiries`) is always enforced —
 *   no service-role key involved.
 * - Both actions revalidate the inquiries list and the dashboard so counts
 *   and pills refresh in the same render pass.
 */

export type InquiryActionResult = { ok: true } | { ok: false; message: string };

export async function updateInquiryStatus(
  inquiryId: string,
  newStatus: InquiryStatus,
): Promise<InquiryActionResult> {
  await assertAdmin();

  const id = inquiryIdSchema.safeParse(inquiryId);
  if (!id.success) {
    return { ok: false, message: "Invalid inquiry reference." };
  }
  const status = inquiryStatusSchema.safeParse(newStatus);
  if (!status.success) {
    return { ok: false, message: "Invalid status value." };
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from("inquiries")
      .update({ status: status.data })
      .eq("id", id.data);
    if (error) throw new Error(error.message);
  } catch (error) {
    console.error("[admin] inquiry status update failed:", error);
    return {
      ok: false,
      message: "Could not update the inquiry status. Please try again.",
    };
  }

  revalidatePath("/admin/inquiries");
  revalidatePath("/admin");
  return { ok: true };
}

export async function updateInquiryNotes(
  inquiryId: string,
  notes: string,
): Promise<InquiryActionResult> {
  await assertAdmin();

  const id = inquiryIdSchema.safeParse(inquiryId);
  if (!id.success) {
    return { ok: false, message: "Invalid inquiry reference." };
  }
  const parsedNotes = inquiryNotesSchema.safeParse(String(notes ?? ""));
  if (!parsedNotes.success) {
    return {
      ok: false,
      message: parsedNotes.error.issues[0]?.message ?? "Invalid notes content.",
    };
  }

  try {
    const supabase = await createClient();
    const trimmed = parsedNotes.data;
    const { error } = await supabase
      .from("inquiries")
      .update({ admin_notes: trimmed === "" ? null : trimmed })
      .eq("id", id.data);
    if (error) throw new Error(error.message);
  } catch (error) {
    console.error("[admin] inquiry notes update failed:", error);
    return {
      ok: false,
      message: "Could not save the notes. Please try again.",
    };
  }

  revalidatePath("/admin/inquiries");
  revalidatePath("/admin");
  return { ok: true };
}
