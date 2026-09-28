import { requireAdmin } from "@/lib/auth/admin";
import { SupabaseNotConfiguredError } from "@/lib/env";
import { createPageMetadata } from "@/lib/seo";
import { AdminSetupPanel } from "../setup-panel";
import Image from "next/image";
import { Handshake } from "lucide-react";

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
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-eyebrow text-muted-foreground">Website</p>
          <h1 className="font-heading text-2xl font-semibold mt-1">Partners & Marquee Logos</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Manage institutional partners, technical consortia, and client logos rendered in the animated marquee.
          </p>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-lg bg-brand-forest px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-[#252B29] transition-colors"
        >
          <Handshake className="size-3.5" />
          Add Partner Logo
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-xs">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border text-muted-foreground text-xs uppercase tracking-wide">
              <th className="px-4 py-3 font-medium">Logo</th>
              <th className="px-4 py-3 font-medium">Organization Name</th>
              <th className="px-4 py-3 font-medium">Sector Category</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Order</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {DEMO_PARTNERS.map((partner) => (
              <tr key={partner.id} className="hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3">
                  <div className="relative h-10 w-16 overflow-hidden rounded-md border border-border bg-muted/40 p-1 flex items-center justify-center">
                    <Image
                      src={partner.logo_url}
                      alt={partner.name}
                      width={64}
                      height={32}
                      className="object-contain max-h-full"
                    />
                  </div>
                </td>
                <td className="px-4 py-3">
                  <p className="font-medium text-foreground text-xs">{partner.name}</p>
                  <a
                    href={partner.website}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] text-muted-foreground hover:underline"
                  >
                    {partner.website}
                  </a>
                </td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-xs text-foreground">
                    {partner.category}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center rounded-full bg-brand-sage/40 px-2 py-0.5 text-[11px] font-medium text-brand-forest">
                    Published
                  </span>
                </td>
                <td className="px-4 py-3 text-xs font-mono text-muted-foreground">
                  {partner.display_order}
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
