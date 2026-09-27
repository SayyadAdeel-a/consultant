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
import { projectSchema, type ProjectInput } from "@/lib/validations/projects";

/**
 * Case study / project Server Actions (docs/TASKS.md Task 7.3).
 *
 * Same security model as the service actions: `await assertAdmin()` runs
 * first (throws for non-admins), payloads are validated with the shared
 * `projectSchema`, and writes go through the anon client under the
 * admin's session so RLS stays in force — no service-role key.
 *
 * Revalidation: every write refreshes the admin manager, the homepage
 * (case study spotlight), and the services surfaces (association lists).
 */

/** All public + admin surfaces affected by any CMS write. */
function revalidateCmsPaths(): void {
  revalidatePath("/admin/services");
  revalidatePath("/services");
  revalidatePath("/admin/projects");
  revalidatePath("/");
}

function isUniqueViolation(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: unknown }).code === "23505"
  );
}

async function setProjectFlag(
  table: "is_published" | "is_featured",
  id: string,
  value: boolean,
  failureMessage: string,
): Promise<CmsActionResult> {
  await assertAdmin();

  const validId = cmsIdSchema.safeParse(id);
  if (!validId.success || typeof value !== "boolean") {
    return { ok: false, message: "Invalid project reference or value." };
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from("projects")
      .update({ [table]: value })
      .eq("id", validId.data);
    if (error) throw new Error(error.message);
  } catch (error) {
    console.error(`[admin] project ${table} toggle failed:`, error);
    return { ok: false, message: failureMessage };
  }

  revalidateCmsPaths();
  return { ok: true };
}

export async function toggleProjectPublished(
  id: string,
  isPublished: boolean,
): Promise<CmsActionResult> {
  return setProjectFlag(
    "is_published",
    id,
    isPublished,
    "Could not update the publication state. Please try again.",
  );
}

export async function toggleProjectFeatured(
  id: string,
  isFeatured: boolean,
): Promise<CmsActionResult> {
  return setProjectFlag(
    "is_featured",
    id,
    isFeatured,
    "Could not update the featured state. Please try again.",
  );
}

export async function upsertProject(
  input: ProjectInput | FormData,
): Promise<CmsActionResult> {
  await assertAdmin();

  const raw: unknown =
    input instanceof FormData ? formDataToObject(input) : input;
  const parsed = projectSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      message: "Please fix the highlighted fields.",
      fieldErrors: flattenCmsIssues(parsed.error),
    };
  }

  const { id, ...values } = parsed.data;

  try {
    const supabase = await createClient();
    const { error } = id
      ? await supabase.from("projects").update(values).eq("id", id)
      : await supabase.from("projects").insert(values);
    if (error) throw error;
  } catch (error) {
    console.error("[admin] project save failed:", error);
    if (isUniqueViolation(error)) {
      return {
        ok: false,
        message: "This slug is already in use.",
        fieldErrors: { slug: "This slug is already in use." },
      };
    }
    return {
      ok: false,
      message: "Could not save the case study. Please try again.",
    };
  }

  revalidateCmsPaths();
  return { ok: true };
}
