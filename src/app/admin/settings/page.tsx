import { SettingsForm } from "@/components/admin";
import { requireAdmin } from "@/lib/auth/admin";
import { SupabaseNotConfiguredError } from "@/lib/env";
import { createPageMetadata } from "@/lib/seo";
import { createClient } from "@/lib/supabase/server";
import type { SiteSettingsRecord } from "@/types/cms";
import { AdminSetupPanel } from "../setup-panel";

export const metadata = createPageMetadata({
  title: "Settings",
  description: "Manage global company identity, contact, and CTA settings.",
  path: "/admin/settings",
  index: false,
});

/**
 * Global site settings (docs/TASKS.md Task 7.4).
 *
 * - Gate first: `requireAdmin()` — non-admins redirect, demo builds get
 *   the fail-secure setup panel.
 * - Reads the singleton `site_settings` row with the authenticated
 *   server client; public SELECT RLS keeps it readable, writes are
 *   admin-only (`is_admin()`).
 * - Every `updateSiteSettings` write revalidates `/admin/settings`,
 *   `/`, `/contact`, and `/admin` (per spec).
 */
export default async function AdminSettingsPage() {
  try {
    await requireAdmin();
  } catch (error) {
    if (error instanceof SupabaseNotConfiguredError) {
      return <AdminSetupPanel title="Site settings" />;
    }
    throw error;
  }

  const supabase = await createClient();

  let settings: SiteSettingsRecord | null = null;
  let loadError = false;
  try {
    const { data, error } = await supabase
      .from("site_settings")
      .select(
        "id, company_name, tagline, description, contact_email, contact_phone, office_address, social_links, cta_settings",
      )
      .eq("singleton_guard", true)
      .limit(1);
    if (error) throw new Error(error.message);
    settings = (data?.[0] ?? null) as SiteSettingsRecord | null;
  } catch (error) {
    console.error("[admin] site settings query failed:", error);
    loadError = true;
  }

  return (
    <div className="mx-auto max-w-4xl">
      <p className="text-eyebrow text-muted-foreground">Admin console</p>
      <h1 className="font-heading mt-2 text-2xl font-semibold">
        Site settings
      </h1>
      <p className="text-muted-foreground mt-1 text-sm">
        Company identity, contact details, social links, and the primary and
        secondary homepage CTAs. Consumed site-wide once public helpers read
        this table.
      </p>
      <div className="mt-6">
        {loadError ? (
          <div
            role="alert"
            className="border-destructive/40 bg-destructive/10 text-foreground rounded-lg border px-4 py-3 text-sm"
          >
            Could not load the site settings right now. Please refresh the page
            — if the problem persists, verify the Supabase configuration.
          </div>
        ) : (
          <SettingsForm
            key={settings?.id ?? "new-settings"}
            settings={settings}
          />
        )}
      </div>
    </div>
  );
}
