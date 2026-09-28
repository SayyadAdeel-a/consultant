import { requireAdmin } from "@/lib/auth/admin";
import { SupabaseNotConfiguredError } from "@/lib/env";
import { createPageMetadata } from "@/lib/seo";
import { createClient } from "@/lib/supabase/server";
import { AdminSetupPanel } from "../setup-panel";
import { VisualTeamManager, type TeamMemberItem } from "@/components/admin/VisualTeamManager";

export const metadata = createPageMetadata({
  title: "Team Members",
  description: "Manage professional leadership profiles and scientific consultants.",
  path: "/admin/team",
  index: false,
});

const DEFAULT_TEAM: TeamMemberItem[] = [
  {
    id: "team-1",
    name: "Dr. Evelyn Reed, PWS",
    role: "Principal Ecological Consultant",
    discipline: "Ecological Assessment & Permitting",
    image: "/assets/alderline/team/member-1.jpg",
    bio: "22 years evaluating complex wetland ecotones and coordinating Section 404/401 state certifications.",
    is_published: true,
    display_order: 1,
  },
  {
    id: "team-2",
    name: "Marcus Vance, PE",
    role: "Senior Environmental Review Specialist",
    discipline: "Environmental Review & Compliance",
    image: "/assets/alderline/team/member-2.jpg",
    bio: "Specializes in linear infrastructure environmental impact statements and municipal coordination.",
    is_published: true,
    display_order: 2,
  },
  {
    id: "team-3",
    name: "Dr. Sarah Lin, CPSS",
    role: "Lead Hydrologist & Soil Scientist",
    discipline: "Wetland Science & Hydrology",
    image: "/assets/alderline/team/member-3.jpg",
    bio: "Expert in hydric soil taxonomy, groundwater modeling, and coastal watershed delineation.",
    is_published: true,
    display_order: 3,
  },
  {
    id: "team-4",
    name: "David Campbell, AICP",
    role: "Principal Land Planning Consultant",
    discipline: "Land-Use Strategy & Due Diligence",
    image: "/assets/alderline/team/member-4.jpg",
    bio: "Advises developers and public agencies on conservation overlays and sustainable site design.",
    is_published: true,
    display_order: 4,
  },
  {
    id: "team-5",
    name: "Elena Rostova, CERP",
    role: "Restoration Strategy Advisor",
    discipline: "Habitat & Wetland Restoration",
    image: "/assets/alderline/team/member-5.jpg",
    bio: "Directs living shoreline design, compensatory mitigation banking, and multi-year post-construction monitoring.",
    is_published: true,
    display_order: 5,
  },
];

export default async function AdminTeamPage() {
  try {
    await requireAdmin();
  } catch (error) {
    if (error instanceof SupabaseNotConfiguredError) {
      return <AdminSetupPanel title="Team Members" />;
    }
    throw error;
  }

  let members: TeamMemberItem[] = DEFAULT_TEAM;
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("team_members")
      .select("id, full_name, role_title, bio, photo_url, credentials, linkedin_url, is_published, display_order")
      .order("display_order", { ascending: true });

    if (!error && data && data.length > 0) {
      members = data.map((row) => ({
        id: row.id,
        name: row.full_name,
        role: row.role_title,
        discipline: row.credentials || "Ecological Consulting",
        image: row.photo_url || "/assets/alderline/team/member-1.jpg",
        bio: row.bio,
        credentials: row.credentials || "",
        linkedin_url: row.linkedin_url || "",
        is_published: row.is_published ?? true,
        display_order: row.display_order ?? 1,
      }));
    }
  } catch (err) {
    console.error("[admin] team query fell back to demonstration roster:", err);
  }

  return (
    <div className="mx-auto max-w-7xl">
      <VisualTeamManager initialMembers={members} />
    </div>
  );
}
