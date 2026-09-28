import { requireAdmin } from "@/lib/auth/admin";
import { SupabaseNotConfiguredError } from "@/lib/env";
import { createPageMetadata } from "@/lib/seo";
import { AdminSetupPanel } from "../setup-panel";
import { VisualPartnersManager } from "@/components/admin/VisualPartnersManager";

export const metadata = createPageMetadata({
  title: "Partners & Client Logos",
  description: "Manage client and partner logos displayed in the animated marquee.",
  path: "/admin/partners",
  index: false,
});

export const DEMO_PARTNERS = [
  {
    id: "partner-1",
    name: "Pacific Rim Environmental Alliance",
    category: "Regional Ecological Consortium",
    logo_url: "/assets/alderline/brand/sector-mark-1.jpg",
    website: "https://example.com/pacific-alliance",
    display_order: 1,
    is_published: true,
  },
  {
    id: "partner-2",
    name: "Cascadia Coastal Engineering Group",
    category: "Marine Infrastructure & Coastal Defense",
    logo_url: "/assets/alderline/brand/sector-mark-2.jpg",
    website: "https://example.com/cascadia-coastal",
    display_order: 2,
    is_published: true,
  },
  {
    id: "partner-3",
    name: "Northwest Hydrologic Institute",
    category: "Watershed Modeling & Aquifer Protection",
    logo_url: "/assets/alderline/brand/sector-mark-3.jpg",
    website: "https://example.com/nw-hydrologic",
    display_order: 3,
    is_published: true,
  },
  {
    id: "partner-4",
    name: "TerraVerde Conservation Partners",
    category: "Wetland Mitigation & Land Trust Advisory",
    logo_url: "/assets/alderline/brand/sector-mark-4.jpg",
    website: "https://example.com/terra-verde",
    display_order: 4,
    is_published: true,
  },
];

export default async function AdminPartnersPage() {
  try {
    await requireAdmin();
  } catch (error) {
    if (error instanceof SupabaseNotConfiguredError) {
      return <AdminSetupPanel title="Partners" />;
    }
    throw error;
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <p className="text-eyebrow text-muted-foreground">Website</p>
        <h1 className="font-heading text-2xl font-semibold mt-1">Partners & Marquee Logos</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Manage institutional partners, technical consortia, and client logos rendered in the animated marquee.
        </p>
      </div>

      <VisualPartnersManager initialPartners={DEMO_PARTNERS} />
    </div>
  );
}
