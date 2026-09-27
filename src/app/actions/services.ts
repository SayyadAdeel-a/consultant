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
import { serviceSchema, type ServiceInput } from "@/lib/validations/services";

/**
 * Service catalog Server Actions (docs/TASKS.md Task 7.3).
 *
 * Security model (docs/BACKEND_SECURITY.md):
 * - Every action calls `await assertAdmin()` FIRST — it throws for
 *   non-admins, before any payload inspection.
 * - Payloads are validated with the shared `serviceSchema`; only
 *   validated fields ever reach the database.
 * - Writes run through the anon server client under the admin session,
 *   so RLS (`is_admin()` policies) always governs them — no service-role
 *   key involved.
 *
 * Revalidation: every write refreshes the admin manager, the public
 * catalog/detail pages, the case studies manager (service association),
 * and the homepage (services + case study sections).
 */

/** All public + admin surfaces affected by any CMS write. */
function revalidateCmsPaths(): void {
  revalidatePath("/admin/services");
  revalidatePath("/services");
  revalidatePath("/admin/projects");
  revalidatePath("/");
}

/** Maps a submit FormData into a parseable object (arrays + booleans). */
function formDataToPayload(formData: FormData): Record<string, unknown> {
  return formDataToObject(formData, ["deliverables", "regulatory_frameworks"]);
}

function isUniqueViolation(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: unknown }).code === "23505"
  );
}

export async function toggleServicePublished(
  id: string,
  isPublished: boolean,
): Promise<CmsActionResult> {
  await assertAdmin();

  const validId = cmsIdSchema.safeParse(id);
  if (!validId.success || typeof isPublished !== "boolean") {
    return { ok: false, message: "Invalid service reference or value." };
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from("services")
      .update({ is_published: isPublished })
      .eq("id", validId.data);
    if (error) throw new Error(error.message);
  } catch (error) {
    console.error("[admin] service publication toggle failed:", error);
    return {
      ok: false,
      message: "Could not update the publication state. Please try again.",
    };
  }

  revalidateCmsPaths();
  return { ok: true };
}

export async function upsertService(
  input: ServiceInput | FormData,
): Promise<CmsActionResult> {
  await assertAdmin();

  const raw: unknown =
    input instanceof FormData ? formDataToPayload(input) : input;
  const parsed = serviceSchema.safeParse(raw);
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
      ? await supabase.from("services").update(values).eq("id", id)
      : await supabase.from("services").insert(values);
    if (error) throw error;
  } catch (error) {
    console.error("[admin] service save failed:", error);
    if (isUniqueViolation(error)) {
      return {
        ok: false,
        message: "This slug is already in use.",
        fieldErrors: { slug: "This slug is already in use." },
      };
    }
    return {
      ok: false,
      message: "Could not save the service. Please try again.",
    };
  }

  revalidateCmsPaths();
  return { ok: true };
}
