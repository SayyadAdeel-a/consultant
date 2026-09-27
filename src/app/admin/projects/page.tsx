import { ProjectsTable } from "@/components/admin";
import { requireAdmin } from "@/lib/auth/admin";
import { SupabaseNotConfiguredError } from "@/lib/env";
import { createPageMetadata } from "@/lib/seo";
import { createClient } from "@/lib/supabase/server";
import type { ProjectRecord, ServiceOption } from "@/types/cms";
import { AdminSetupPanel } from "../setup-panel";

export const metadata = createPageMetadata({
  title: "Projects",
  description: "Manage case studies and project showcases.",
  path: "/admin/projects",
  index: false,
});

async function fetchProjects(
  supabase: Awaited<ReturnType<typeof createClient>>,
) {
  try {
    const { data, error } = await supabase
      .from("projects")
      .select(
        "id, slug, title, client_type, location, summary, challenge, solution, results, featured_image_url, service_id, completed_year, is_featured, is_published, display_order",
      )
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return { rows: (data ?? []) as ProjectRecord[], failed: false };
  } catch (error) {
    console.error("[admin] projects query failed:", error);
    return { rows: [] as ProjectRecord[], failed: true };
  }
}

async function fetchServiceOptions(
  supabase: Awaited<ReturnType<typeof createClient>>,
) {
  try {
    const { data, error } = await supabase
      .from("services")
      .select("id, title, is_published")
      .order("display_order", { ascending: true });
    if (error) throw new Error(error.message);
    return (data ?? []) as ServiceOption[];
  } catch (error) {
    // Fail soft: the manager still works; the association column shows "—".
    console.error("[admin] service lookup failed:", error);
    return [] as ServiceOption[];
  }
}

/**
 * Case studies manager (docs/TASKS.md Task 7.3).
 *
 * - Gate first: `requireAdmin()` — non-admins redirect, demo builds get
 *   the fail-secure setup panel.
 * - Reads use the authenticated server client ordered by
 *   `display_order ASC, created_at DESC`; RLS (`is_admin()`) governs
 *   visibility on both tables.
 * - The lightweight services lookup feeds the "Associated service"
 *   column and the editor's selector; its failure degrades to "—"
 *   without breaking the manager.
 */
export default async function AdminProjectsPage() {
  try {
    await requireAdmin();
  } catch (error) {
    if (error instanceof SupabaseNotConfiguredError) {
      return <AdminSetupPanel title="Case studies" />;
    }
    throw error;
  }

  const supabase = await createClient();

  const [{ rows: projects, failed }, serviceOptions] = await Promise.all([
    fetchProjects(supabase),
    fetchServiceOptions(supabase),
  ]);

  return (
    <div className="mx-auto max-w-6xl">
      <p className="text-eyebrow text-muted-foreground">Admin console</p>
      <h1 className="font-heading mt-2 text-2xl font-semibold">
        Projects &amp; case studies
      </h1>
      <p className="text-muted-foreground mt-1 text-sm">
        Document realized work — publication and featured flags feed the
        homepage and services surfaces directly.
      </p>
      <div className="mt-6">
        <ProjectsTable
          projects={projects}
          serviceOptions={serviceOptions}
          loadError={failed}
        />
      </div>
    </div>
  );
}
