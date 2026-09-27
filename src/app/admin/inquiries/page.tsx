import { InquiriesTable } from "@/components/admin";
import { requireAdmin } from "@/lib/auth/admin";
import { SupabaseNotConfiguredError } from "@/lib/env";
import { createPageMetadata } from "@/lib/seo";
import { createClient } from "@/lib/supabase/server";
import type { InquiryRecord } from "@/types/cms";
import { AdminSetupPanel } from "../setup-panel";

export const metadata = createPageMetadata({
  title: "Inquiries",
  description: "Confidential client inquiry management.",
  path: "/admin/inquiries",
  index: false,
});

/**
 * Confidential inquiries console (docs/TASKS.md Task 7.2).
 *
 * - Gate first: `requireAdmin()` — non-admins are redirected, demo builds
 *   (Supabase unconfigured) get the fail-secure setup panel.
 * - Reads use the authenticated server client; RLS on `inquiries` grants
 *   SELECT only to `public.is_admin()` — there is no public read path.
 * - The list is fetched with a minimal column set (`ip_hash` and
 *   `user_agent` are intentionally never selected) and passed to the
 *   client-side table for filtering and detail inspection.
 */
export default async function AdminInquiriesPage() {
  try {
    await requireAdmin();
  } catch (error) {
    if (error instanceof SupabaseNotConfiguredError) {
      return <AdminSetupPanel title="Inquiries" />;
    }
    throw error;
  }

  const supabase = await createClient();

  let inquiries: InquiryRecord[] = [];
  let loadError = false;
  try {
    const { data, error } = await supabase
      .from("inquiries")
      .select(
        "id, name, email, phone, company, inquiry_type, message, status, admin_notes, created_at",
      )
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    inquiries = (data ?? []) as InquiryRecord[];
  } catch (error) {
    console.error("[admin] inquiries query failed:", error);
    loadError = true;
  }

  return (
    <div className="mx-auto max-w-6xl">
      <p className="text-eyebrow text-muted-foreground">Admin console</p>
      <h1 className="font-heading mt-2 text-2xl font-semibold">Inquiries</h1>
      <p className="text-muted-foreground mt-1 text-sm">
        Confidential consultation requests — readable only by verified
        administrators.
      </p>
      <div className="mt-6">
        <InquiriesTable inquiries={inquiries} loadError={loadError} />
      </div>
    </div>
  );
}
