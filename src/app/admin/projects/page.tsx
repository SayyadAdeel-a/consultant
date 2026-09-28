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

export const DEMO_PROJECTS: ProjectRecord[] = [
  {
    id: "proj-1",
    slug: "casco-bay-wetland-restoration",
    title: "Casco Bay coastal wetland restoration",
    client_type: "Casco Bay Estuary Partnership",
    location: "Casco Bay, Maine",
    summary:
      "Tidal reconnection and joint §404/§401 permitting that returned 42 acres of fragmented salt marsh to full tidal exchange — with agency concurrence on the first submittal.",
    challenge:
      "Decades of tidal restriction and shoreline erosion had fragmented the marsh into open-water pans, weakening nursery habitat for Casco Bay shellfish and pushing the parcel beyond its storm-surge thresholds.",
    solution:
      "We paired bathymetric LiDAR interpretation with fine-scale vegetation and soils surveying to re-establish historic tidal hydrology, then sequenced a joint Army Corps §404 and Maine DEP §401 authorization strategy around in-water work windows.",
    results:
      "Returned 42 acres of high-value intertidal marsh habitat to full hydrodynamic exchange with zero net loss of vegetative cover.",
    featured_image_url: "/assets/alderline/services/coastal-resilience.jpg",
    service_id: null,
    completed_year: 2024,
    is_featured: true,
    is_published: true,
    display_order: 1,
  },
  {
    id: "proj-2",
    slug: "renewable-energy-corridor-permitting",
    title: "Clean Energy Transmission Corridor Permitting",
    client_type: "Horizon Clean Power Consortium",
    location: "Columbia River Basin, WA & OR",
    summary:
      "Critical areas assessment, avian collision risk modeling, and state/federal joint environmental permitting across 48 miles of transmission right-of-way.",
    challenge:
      "The linear alignment traversed multiple jurisdictional watersheds, priority shrub-steppe raptor nesting territories, and culturally sensitive tribal resource zones.",
    solution:
      "Conducted multi-season botanical and wildlife inventories, executed micro-siting re-alignments to avoid 94% of sensitive ecotones, and facilitated proactive tribal consultation.",
    results:
      "Secured Finding of No Significant Impact (FONSI) without contested administrative hearings, advancing the inter-tie 6 months ahead of schedule.",
    featured_image_url: "/assets/alderline/about/gallery-1.jpg",
    service_id: null,
    completed_year: 2024,
    is_featured: true,
    is_published: true,
    display_order: 2,
  },
  {
    id: "proj-3",
    slug: "industrial-redevelopment-esa",
    title: "Former Waterfront Industrial Terminal Phase I & II ESA",
    client_type: "Pacific Rim Industrial Trust",
    location: "Tacoma Tideflats, WA",
    summary:
      "Targeted hydrogeologic and geochemical investigation of a 28-acre decommissioned shipyard and chemical handling terminal for brownfield adaptive reuse.",
    challenge:
      "Over eight decades of unrecorded historical manufacturing created overlapping solvent, petroleum hydrocarbon, and heavy metal plumes in shallow estuarine aquifers.",
    solution:
      "Deployed low-disturbance membrane interface probe (MIP) screening coupled with high-resolution 3D plume modeling to delimit hot spots, followed by containment barrier design.",
    results:
      "Negotiated a Prospective Purchaser Agreement (PPA) with the state Department of Ecology, reducing buyer environmental liability exposure by $8.4M.",
    featured_image_url: "/assets/alderline/services/site-assessment.jpg",
    service_id: null,
    completed_year: 2023,
    is_featured: true,
    is_published: true,
    display_order: 3,
  },
  {
    id: "proj-4",
    slug: "pine-river-riparian-stabilization",
    title: "Pine River Riparian Habitat & Shoreline Stabilization",
    client_type: "Pine River Watershed Authority",
    location: "Deschutes County, OR",
    summary:
      "Bioengineered living shoreline design replacing degraded riprap with rootwads, native riparian buffers, and engineered log jams across 2.4 miles of salmonid habitat.",
    challenge:
      "Severe riverbank scour from unregulated runoff threatened adjacent recreational parkland and introduced chronic sediment loading into critical cold-water fisheries.",
    solution:
      "Modeled 2D hydrodynamic flow velocities to design anchored large woody debris (LWD) installations and deep-rooting native willow/alder revetments.",
    results:
      "Withstood historic 100-year recurrence interval spring flood events with zero structural failure, reducing stream turbidity by 78%.",
    featured_image_url: "/assets/alderline/about/gallery-2.jpg",
    service_id: null,
    completed_year: 2024,
    is_featured: false,
    is_published: true,
    display_order: 4,
  },
  {
    id: "proj-5",
    slug: "urban-wetland-mitigation-banking",
    title: "Cascadia Regional Wetland Mitigation Banking",
    client_type: "Apex Urban Development Partners",
    location: "Willamette Valley, OR",
    summary:
      "Permitting, baseline ecological characterization, and hydrologic restoration design for a 115-acre commercial wetland mitigation bank producing transferable credits.",
    challenge:
      "Drained agricultural acreage required re-establishment of historical emergent marsh and vernal pool hydrology while satisfying rigorous USACE IRT credit release schedules.",
    solution:
      "Constructed earthen berms, decommissioned subterranean tile drains, and seeded 34 native wetland plant species calibrated to seasonal groundwater tables.",
    results:
      "Achieved full Interagency Review Team (IRT) approval of the MBI with initial release of 35 wetland credits valued at over $4.2M.",
    featured_image_url: "/assets/alderline/about/gallery-3.jpg",
    service_id: null,
    completed_year: 2023,
    is_featured: false,
    is_published: true,
    display_order: 5,
  },
  {
    id: "proj-6",
    slug: "intermountain-substation-review",
    title: "Intermountain High-Voltage Substation Environmental Review",
    client_type: "Apex Infrastructure Utilities",
    location: "Ada County, Idaho",
    summary:
      "Environmental constraints analysis, geotechnical environmental review, and Spill Prevention, Control, and Countermeasure (SPCC) engineering for a 500kV substation.",
    challenge:
      "Site expansion bordered an ephemeral irrigation canal and protected sagebrush scrub habitat subject to strict county grading ordinances.",
    solution:
      "Engineered self-contained secondary containment systems for oil-filled electrical equipment and integrated zero-runoff xeriscape bio-retention basins.",
    results:
      "Secured unanimous county land-use conditional use permit (CUP) approval with zero environmental appeals or delays.",
    featured_image_url: "/assets/alderline/about/gallery-4.jpg",
    service_id: null,
    completed_year: 2024,
    is_featured: false,
    is_published: true,
    display_order: 6,
  },
];

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
    const rows = (data ?? []) as ProjectRecord[];
    if (rows.length === 0) {
      return { rows: DEMO_PROJECTS, failed: false };
    }
    return { rows, failed: false };
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
