import { ServicesTable } from "@/components/admin";
import { requireAdmin } from "@/lib/auth/admin";
import { SupabaseNotConfiguredError } from "@/lib/env";
import { createPageMetadata } from "@/lib/seo";
import { createClient } from "@/lib/supabase/server";
import type { ServiceRecord } from "@/types/cms";
import { AdminSetupPanel } from "../setup-panel";

export const metadata = createPageMetadata({
  title: "Services",
  description: "Manage the environmental services catalog.",
  path: "/admin/services",
  index: false,
});

/**
 * Service catalog manager (docs/TASKS.md Task 7.3).
 *
 * - Gate first: `requireAdmin()` — non-admins redirect, demo builds get
 *   the fail-secure setup panel.
 * - Reads use the authenticated server client ordered by `display_order`
 *   ASC; RLS (`is_admin()`) governs visibility.
 * - Only the editable columns are selected; public catalog pages are
 *   revalidated by every Server Action write.
 */
export default async function AdminServicesPage() {
  try {
    await requireAdmin();
  } catch (error) {
    if (error instanceof SupabaseNotConfiguredError) {
      return <AdminSetupPanel title="Services" />;
    }
    throw error;
  }

  const supabase = await createClient();

  let services: ServiceRecord[] = [];
  let loadError = false;
  try {
    const { data, error } = await supabase
      .from("services")
      .select(
        "id, slug, title, short_description, full_content, icon, deliverables, regulatory_frameworks, pricing_note, is_published, display_order",
      )
      .order("display_order", { ascending: true });
    if (error) throw new Error(error.message);
    services = (data ?? []) as ServiceRecord[];
  } catch (error) {
    console.error("[admin] services query failed:", error);
    loadError = true;
  }

  return (
    <div className="mx-auto max-w-6xl">
      <p className="text-eyebrow text-muted-foreground">Admin console</p>
      <h1 className="font-heading mt-2 text-2xl font-semibold">
        Services &amp; catalog
      </h1>
      <p className="text-muted-foreground mt-1 text-sm">
        Create, edit, reorder, and publish the firm&apos;s consulting
        disciplines. Pricing notes stay strictly optional.
      </p>
      <div className="mt-6">
        <ServicesTable services={services} loadError={loadError} />
      </div>
    </div>
  );
}
