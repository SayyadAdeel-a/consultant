import { requireAdmin } from "@/lib/auth/admin";
import { SupabaseNotConfiguredError } from "@/lib/env";
import { createPageMetadata } from "@/lib/seo";
import { AdminSetupPanel } from "../setup-panel";
import Image from "next/image";
import { Users } from "lucide-react";

export const metadata = createPageMetadata({
  title: "Team Members",
  description: "Manage professional leadership profiles and scientific consultants.",
  path: "/admin/team",
  index: false,
});

const DEFAULT_TEAM = [
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

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-eyebrow text-muted-foreground">Website</p>
          <h1 className="font-heading text-2xl font-semibold mt-1">Team Members</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Manage certified scientists, engineers, and technical consultants displayed across the website.
          </p>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-lg bg-brand-forest px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-[#252B29] transition-colors"
        >
          <Users className="size-3.5" />
          Add Team Member
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-xs">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border text-muted-foreground text-xs uppercase tracking-wide">
              <th className="px-4 py-3 font-medium">Member</th>
              <th className="px-4 py-3 font-medium">Role & Practice</th>
              <th className="px-4 py-3 font-medium">Bio Summary</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Order</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {DEFAULT_TEAM.map((member) => (
              <tr key={member.id} className="hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="relative size-10 overflow-hidden rounded-full border border-border/80 bg-muted shrink-0">
                      <Image
                        src={member.image}
                        alt={member.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-medium text-foreground text-xs">{member.name}</p>
                      <p className="text-[11px] text-muted-foreground">{member.role}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-xs text-foreground">
                    {member.discipline}
                  </span>
                </td>
                <td className="px-4 py-3 max-w-xs truncate text-xs text-muted-foreground">
                  {member.bio}
                </td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center rounded-full bg-brand-sage/40 px-2 py-0.5 text-[11px] font-medium text-brand-forest">
                    Published
                  </span>
                </td>
                <td className="px-4 py-3 text-xs font-mono text-muted-foreground">
                  {member.display_order}
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    type="button"
                    className="text-xs font-semibold text-brand-forest hover:underline"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
