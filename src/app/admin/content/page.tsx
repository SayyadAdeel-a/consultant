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
    if (sections.length === 0) {
      sections = [
        { id: "sec-1", section_key: "hero", title: "Environmental insight. Practical solutions.", subtitle: "Rigorous science. Uncompromising environmental integrity.", is_visible: true, display_order: 1 },
        { id: "sec-2", section_key: "credibility", title: "Credibility, by the numbers", subtitle: "99.4% regulatory concurrence across 180+ completed reviews.", is_visible: true, display_order: 2 },
        { id: "sec-3", section_key: "services", title: "Four disciplines, one defensible record", subtitle: "Core practice areas built on scientific precision.", is_visible: true, display_order: 3 },
        { id: "sec-4", section_key: "industries", title: "Sectors we know deeply", subtitle: "Infrastructure, renewable energy, and coastal resilience.", is_visible: true, display_order: 4 },
        { id: "sec-5", section_key: "projects", title: "Casco Bay coastal wetland restoration", subtitle: "Living shoreline stabilization and marsh hydrology.", is_visible: true, display_order: 5 },
        { id: "sec-6", section_key: "approach", title: "From first records review to final monitoring", subtitle: "A structured, phased methodology.", is_visible: true, display_order: 6 },
        { id: "sec-7", section_key: "team", title: "Certified scientists and engineers", subtitle: "Senior leaders with decades of field and regulatory experience.", is_visible: true, display_order: 7 },
        { id: "sec-8", section_key: "faq", title: "Questions, answered", subtitle: "Everything you need to know about our consulting engagements.", is_visible: true, display_order: 8 },
        { id: "sec-9", section_key: "cta", title: "Tell us about your site", subtitle: "Request a confidential scoping consultation.", is_visible: true, display_order: 9 },
      ];
    }
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
