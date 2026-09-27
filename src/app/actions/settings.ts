"use server";

import { revalidatePath } from "next/cache";
import { assertAdmin } from "@/lib/auth/admin";
import { createClient } from "@/lib/supabase/server";
import {
  flattenCmsIssues,
  formDataToObject,
  type CmsActionResult,
} from "@/lib/validations/cms";
import {
  siteSettingsSchema,
  type SiteSettingsInput,
} from "@/lib/validations/settings";

/**
 * Global site settings Server Action (docs/TASKS.md Task 7.4).
 *
 * Security model (docs/BACKEND_SECURITY.md):
 * - `await assertAdmin()` runs FIRST — it throws for non-admins before
 *   any payload inspection.
 * - Payloads are validated with the shared `siteSettingsSchema`; only
 *   validated fields (plus the derived JSONB shapes) reach the database.
 * - The write runs through the anon server client under the admin
 *   session, so RLS (`is_admin()` policy on `site_settings`) governs it.
 *
 * The row is a singleton: the upsert targets the `singleton_guard`
 * unique column, so a fresh environment inserts while an existing one
 * updates — no read-modify round trip.
 */

/** Public + admin surfaces affected by a settings write (per spec). */
function revalidateSettingsPaths(): void {
  revalidatePath("/admin/settings");
  revalidatePath("/");
  revalidatePath("/contact");
  revalidatePath("/admin");
}

export async function updateSiteSettings(
  input: SiteSettingsInput | FormData,
): Promise<CmsActionResult> {
  await assertAdmin();

  const raw: unknown =
    input instanceof FormData ? formDataToObject(input) : input;
  const parsed = siteSettingsSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      message: "Please fix the highlighted fields.",
      fieldErrors: flattenCmsIssues(parsed.error),
    };
  }

  // Flatten form fields into the table's column shapes: nullable columns
  // get NULL for blanks, social links and CTA labels fold into their
  // JSONB columns (camelCase keys match the stored defaults).
  const {
    contact_phone,
    office_address,
    linkedin_url,
    twitter_url,
    primary_cta_label,
    primary_cta_url,
    secondary_cta_label,
    secondary_cta_url,
    ...identity
  } = parsed.data;

  const values = {
    ...identity,
    contact_phone: contact_phone || null,
    office_address: office_address || null,
    social_links: {
      ...(linkedin_url ? { linkedin: linkedin_url } : {}),
      ...(twitter_url ? { twitter: twitter_url } : {}),
    },
    cta_settings: {
      primaryLabel: primary_cta_label,
      primaryHref: primary_cta_url,
      secondaryLabel: secondary_cta_label,
      secondaryHref: secondary_cta_url,
    },
  };

  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from("site_settings")
      .upsert(values, { onConflict: "singleton_guard" });
    if (error) throw error;
  } catch (error) {
    console.error("[admin] site settings save failed:", error);
    return {
      ok: false,
      message: "Could not save the site settings. Please try again.",
    };
  }

  revalidateSettingsPaths();
  return { ok: true };
}
