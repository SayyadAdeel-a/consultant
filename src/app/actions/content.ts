"use server";

import { revalidatePath } from "next/cache";
import { assertAdmin } from "@/lib/auth/admin";
import { createClient } from "@/lib/supabase/server";
import {
  cmsIdSchema,
  flattenCmsIssues,
  formDataToObject,
  type CmsActionResult,
} from "@/lib/validations/cms";
import { sectionSchema, type SectionInput } from "@/lib/validations/content";

/**
 * Homepage content Server Actions (docs/TASKS.md Task 7.4).
 *
 * Security model (docs/BACKEND_SECURITY.md): `await assertAdmin()` runs
 * first (throws for non-admins), inputs are Zod-validated, and writes go
 * through the anon client under the admin's session so RLS
 * (`is_admin()` on `homepage_sections`) stays in force — no service-role
 * key. Sections are seeded rows: there is no create/delete action, only
 * visibility, headline, and ordering edits.
 *
 * Revalidation: every write refreshes the content manager and the
 * public homepage (per spec).
 */

/** Public + admin surfaces affected by any content write. */
function revalidateContentPaths(): void {
  revalidatePath("/admin/content");
  revalidatePath("/");
}

export async function toggleSectionVisibility(
  id: string,
  isVisible: boolean,
): Promise<CmsActionResult> {
  await assertAdmin();

  const validId = cmsIdSchema.safeParse(id);
  if (!validId.success || typeof isVisible !== "boolean") {
    return { ok: false, message: "Invalid section reference or value." };
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from("homepage_sections")
      .update({ is_visible: isVisible })
      .eq("id", validId.data);
    if (error) throw new Error(error.message);
  } catch (error) {
    console.error("[admin] homepage section visibility toggle failed:", error);
    return {
      ok: false,
      message: "Could not update the section visibility. Please try again.",
    };
  }

  revalidateContentPaths();
  return { ok: true };
}

export async function updateHomepageSection(
  input: SectionInput | FormData,
): Promise<CmsActionResult> {
  await assertAdmin();

  const raw: unknown =
    input instanceof FormData ? formDataToObject(input) : input;
  const parsed = sectionSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      message: "Please fix the highlighted fields.",
      fieldErrors: flattenCmsIssues(parsed.error),
    };
  }

  const { id, title, subtitle, display_order } = parsed.data;

  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from("homepage_sections")
      .update({ title, subtitle, display_order })
      .eq("id", id);
    if (error) throw new Error(error.message);
  } catch (error) {
    console.error("[admin] homepage section update failed:", error);
    return {
      ok: false,
      message: "Could not save the section. Please try again.",
    };
  }

  revalidateContentPaths();
  return { ok: true };
}
