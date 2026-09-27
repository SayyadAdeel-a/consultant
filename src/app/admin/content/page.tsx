import { ContentSectionsTable } from "@/components/admin";
import { requireAdmin } from "@/lib/auth/admin";
import { SupabaseNotConfiguredError } from "@/lib/env";
import { createPageMetadata } from "@/lib/seo";
import { createClient } from "@/lib/supabase/server";
import type { HomepageSectionRecord } from "@/types/cms";
import { AdminSetupPanel } from "../setup-panel";

export const metadata = createPageMetadata({
  title: "Content",
  description: "Manage homepage section visibility, headlines, and order.",
  path: "/admin/content",
  index: false,
});

/**
 * Homepage content manager (docs/TASKS.md Task 7.4).
 *
 * - Gate first: `requireAdmin()` — non-admins redirect, demo builds get
 *   the fail-secure setup panel.
 * - Reads `homepage_sections` ordered by `display_order` ASC with the
 *   authenticated server client; RLS exposes visible rows publicly and
 *   everything to `is_admin()` admins.
 * - `toggleSectionVisibility` / `updateHomepageSection` revalidate
 *   `/admin/content` and `/` (per spec).
 */
export default async function AdminContentPage() {
  try {
    await requireAdmin();
  } catch (error) {
    if (error instanceof SupabaseNotConfiguredError) {
      return <AdminSetupPanel title="Homepage content" />;
    }
    throw error;
  }

  const supabase = await createClient();

  let sections: HomepageSectionRecord[] = [];
  let loadError = false;
  try {
    const { data, error } = await supabase
      .from("homepage_sections")
      .select("id, section_key, title, subtitle, is_visible, display_order")
      .order("display_order", { ascending: true });
    if (error) throw new Error(error.message);
    sections = (data ?? []) as HomepageSectionRecord[];
  } catch (error) {
    console.error("[admin] homepage sections query failed:", error);
    loadError = true;
  }

  return (
    <div className="mx-auto max-w-6xl">
      <p className="text-eyebrow text-muted-foreground">Admin console</p>
      <h1 className="font-heading mt-2 text-2xl font-semibold">
        Homepage content
      </h1>
      <p className="text-muted-foreground mt-1 text-sm">
        Toggle section visibility and edit the headlines shown on the public
        homepage. Hidden sections are omitted from the page.
      </p>
      <div className="mt-6">
        <ContentSectionsTable sections={sections} loadError={loadError} />
      </div>
    </div>
  );
}
