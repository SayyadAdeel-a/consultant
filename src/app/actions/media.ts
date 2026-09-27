"use server";

import { revalidatePath } from "next/cache";
import { assertAdmin } from "@/lib/auth/admin";
import { SupabaseNotConfiguredError } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";
import { flattenCmsIssues, type CmsActionResult } from "@/lib/validations/cms";
import { mediaDeleteSchema, mediaUploadSchema } from "@/lib/validations/media";

/**
 * Media library Server Actions (docs/TASKS.md Task 7.4).
 *
 * Security model (docs/BACKEND_SECURITY.md §7):
 * - `await assertAdmin()` runs FIRST in both actions.
 * - `uploadMediaAsset` validates the file with the shared
 *   `mediaUploadSchema` (images only, ≤ 5MB, required alt text) before
 *   any storage or database access, uploads to the `media` bucket, then
 *   records metadata in `public.media_assets`. A failed record insert
 *   rolls the uploaded object back so storage never holds orphans.
 * - `deleteMediaAsset` best-effort removes the storage object, then
 *   deletes the catalog row (the row is authoritative).
 * - Both run through the anon server client under the admin session —
 *   storage RLS (`is_admin()`) and table RLS govern every operation.
 * - Demo mode (Supabase unconfigured): the metadata is logged and a
 *   graceful success is returned instead of crashing.
 *
 * Revalidation: every write refreshes `/admin/media` and `/admin`
 * (dashboard asset counts), per spec.
 */

const STORAGE_BUCKET = "media";

/** Public + admin surfaces affected by any media write (per spec). */
function revalidateMediaPaths(): void {
  revalidatePath("/admin/media");
  revalidatePath("/admin");
}

/** Filesystem-safe variant of the original filename (extension kept). */
function safeFilename(name: string): string {
  return (
    name.replace(/[^a-zA-Z0-9._-]+/g, "-").replace(/^[-.]+|[-.]+$/g, "") ||
    "asset"
  );
}

export async function uploadMediaAsset(
  formData: FormData,
): Promise<CmsActionResult> {
  await assertAdmin();

  // The file is read directly: the shared FormData helper nulls
  // non-string entries, which would discard the upload.
  const parsed = mediaUploadSchema.safeParse({
    file: formData.get("file"),
    alt: formData.get("alt") ?? "",
    caption: formData.get("caption") ?? "",
  });
  if (!parsed.success) {
    return {
      ok: false,
      message: "Please fix the highlighted fields.",
      fieldErrors: flattenCmsIssues(parsed.error),
    };
  }

  const { file, alt, caption } = parsed.data;
  const path = `${crypto.randomUUID()}-${safeFilename(file.name)}`;

  try {
    const supabase = await createClient();

    const { error: uploadError } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(path, file, { contentType: file.type, upsert: false });
    if (uploadError) throw uploadError;

    const { error: insertError } = await supabase.from("media_assets").insert({
      filename: file.name,
      file_path: path,
      storage_bucket: STORAGE_BUCKET,
      mime_type: file.type,
      file_size: file.size,
      alt_text: alt,
      caption,
    });
    if (insertError) {
      // Roll the object back so a failed record write never leaves an orphan.
      const { error: cleanupError } = await supabase.storage
        .from(STORAGE_BUCKET)
        .remove([path]);
      if (cleanupError) {
        console.warn(
          "[admin] media cleanup after failed insert also failed:",
          cleanupError,
        );
      }
      throw insertError;
    }
  } catch (error) {
    if (error instanceof SupabaseNotConfiguredError) {
      // Demo mode: gracefully record the metadata without touching storage.
      console.info("[demo] media upload recorded without storage:", {
        filename: file.name,
        size: file.size,
        mimeType: file.type,
        alt,
        caption,
      });
      return { ok: true };
    }
    console.error("[admin] media upload failed:", error);
    return {
      ok: false,
      message: "Could not upload the file. Please try again.",
    };
  }

  revalidateMediaPaths();
  return { ok: true };
}

export async function deleteMediaAsset(
  id: string,
  filePath: string,
): Promise<CmsActionResult> {
  await assertAdmin();

  const parsed = mediaDeleteSchema.safeParse({ id, file_path: filePath });
  if (!parsed.success) {
    return { ok: false, message: "Invalid media reference." };
  }

  try {
    const supabase = await createClient();

    const { error: storageError } = await supabase.storage
      .from(STORAGE_BUCKET)
      .remove([parsed.data.file_path]);
    if (storageError) {
      // The catalog row is authoritative — log and continue so the
      // manager can still forget an asset whose object already vanished.
      console.warn(
        "[admin] media object removal failed (record delete continues):",
        storageError,
      );
    }

    const { error } = await supabase
      .from("media_assets")
      .delete()
      .eq("id", parsed.data.id);
    if (error) throw error;
  } catch (error) {
    if (error instanceof SupabaseNotConfiguredError) {
      console.info(
        "[demo] media delete skipped (storage not configured):",
        parsed.data.id,
      );
      return { ok: true };
    }
    console.error("[admin] media delete failed:", error);
    return {
      ok: false,
      message: "Could not delete this asset. Please try again.",
    };
  }

  revalidateMediaPaths();
  return { ok: true };
}
