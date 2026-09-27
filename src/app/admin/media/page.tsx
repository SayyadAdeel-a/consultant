import { MediaGrid } from "@/components/admin";
import { requireAdmin } from "@/lib/auth/admin";
import { SupabaseNotConfiguredError } from "@/lib/env";
import { createPageMetadata } from "@/lib/seo";
import { createClient } from "@/lib/supabase/server";
import type { MediaAssetView } from "@/types/cms";
import { AdminSetupPanel } from "../setup-panel";

export const metadata = createPageMetadata({
  title: "Media",
  description: "Upload and manage the digital media asset catalog.",
  path: "/admin/media",
  index: false,
});

/**
 * Media library manager (docs/TASKS.md Task 7.4).
 *
 * - Gate first: `requireAdmin()` — non-admins redirect, demo builds get
 *   the fail-secure setup panel.
 * - Reads `media_assets` ordered by `created_at` DESC with the
 *   authenticated server client; RLS lets admins manage rows while the
 *   metadata stays publicly readable.
 * - `media_assets` stores no URL column, so each view row gets its
 *   public URL built from `storage.getPublicUrl(file_path)` (the `media`
 *   bucket is public-read per docs/BACKEND_SECURITY.md §7).
 * - Media writes revalidate `/admin/media` and `/admin` (per spec).
 */
export default async function AdminMediaPage() {
  try {
    await requireAdmin();
  } catch (error) {
    if (error instanceof SupabaseNotConfiguredError) {
      return <AdminSetupPanel title="Media library" />;
    }
    throw error;
  }

  const supabase = await createClient();

  let assets: MediaAssetView[] = [];
  let loadError = false;
  try {
    const { data, error } = await supabase
      .from("media_assets")
      .select(
        "id, filename, file_path, storage_bucket, mime_type, file_size, alt_text, caption, created_at",
      )
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);

    assets = (data ?? []).map((row) => {
      const asset = row as MediaAssetView;
      const {
        data: { publicUrl },
      } = supabase.storage
        .from(asset.storage_bucket)
        .getPublicUrl(asset.file_path);
      return { ...asset, public_url: publicUrl };
    });
  } catch (error) {
    console.error("[admin] media assets query failed:", error);
    loadError = true;
  }

  return (
    <div className="mx-auto max-w-6xl">
      <p className="text-eyebrow text-muted-foreground">Admin console</p>
      <h1 className="font-heading mt-2 text-2xl font-semibold">
        Media library
      </h1>
      <p className="text-muted-foreground mt-1 text-sm">
        Upload, describe, and remove imagery stored in Supabase Storage. Alt
        text is required for every asset so published pages stay accessible.
      </p>
      <div className="mt-6">
        <MediaGrid assets={assets} loadError={loadError} />
      </div>
    </div>
  );
}
