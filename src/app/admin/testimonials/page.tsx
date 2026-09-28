import { requireAdmin } from "@/lib/auth/admin";
import { SupabaseNotConfiguredError } from "@/lib/env";
import { createPageMetadata } from "@/lib/seo";
import { AdminSetupPanel } from "../setup-panel";
import Image from "next/image";
import { MessageSquareQuote, Star } from "lucide-react";

export const metadata = createPageMetadata({
  title: "Testimonials & Reviews",
  description: "Manage client reviews, ratings, and quotes.",
  path: "/admin/testimonials",
  index: false,
});

export const DEMO_TESTIMONIALS = [
  {
    id: "test-1",
    client_name: "Arthur Pendelton",
    position: "VP of Infrastructure Planning",
    organization: "Casco Bay Regional Transit District",
    testimonial: "Alderline's field delineation and NEPA documentation were delivered with exceptional precision. Their defensible reports expedited our USACE permit review by four months.",
    rating: 5,
    portrait_url: "/assets/alderline/about/avatar-1.jpg",
    related_project: "Casco Bay Coastal Wetland Restoration",
    is_featured: true,
    is_published: true,
    display_order: 1,
  },
  {
    id: "test-2",
    client_name: "Sarah Jenkins, PE",
    position: "Director of Capital Projects",
    organization: "Horizon Clean Power Consortium",
    testimonial: "Navigating sensitive habitat constraints across a 40-mile transmission corridor seemed daunting. Alderline identified low-impact alignments that met strict state regulatory concurrence.",
    rating: 5,
    portrait_url: "/assets/alderline/about/avatar-2.jpg",
    related_project: "Renewable Energy Corridor Permitting",
    is_featured: true,
    is_published: true,
    display_order: 2,
  },
  {
    id: "test-3",
    client_name: "Robert K. Vance",
    position: "Chief Development Officer",
    organization: "Pacific Rim Industrial Trust",
    testimonial: "Their ASTM E1527-21 due diligence uncovered historical fill issues before acquisition, allowing us to restructure purchase warranties with complete clarity.",
    rating: 5,
    portrait_url: "/assets/alderline/about/avatar-3.jpg",
    related_project: "Phase I & II Industrial Redevelopment ESA",
    is_featured: true,
    is_published: true,
    display_order: 3,
  },
  {
    id: "test-4",
    client_name: "Dr. Meredith Sloane",
    position: "Director of Conservation",
    organization: "Pine River Watershed Authority",
    testimonial: "The living shoreline and bioengineering specifications prepared by Alderline successfully withstood peak 100-year storm surges with zero structural failure.",
    rating: 5,
    portrait_url: "/assets/alderline/team/testimonial-placeholder.jpg",
    related_project: "Pine River Riparian Stabilization",
    is_featured: false,
    is_published: true,
    display_order: 4,
  },
  {
    id: "test-5",
    client_name: "Gregory Hayes",
    position: "Senior Project Executive",
    organization: "Apex Urban Development Partners",
    testimonial: "Transparent communication, deep understanding of USACE regional supplements, and pragmatic engineering. They are our trusted environmental counsel on every major parcel.",
    rating: 5,
    portrait_url: "/assets/alderline/team/member-4.jpg",
    related_project: "Urban Wetland Mitigation Banking",
    is_featured: false,
    is_published: true,
    display_order: 5,
  },
];

export default async function AdminTestimonialsPage() {
  try {
    await requireAdmin();
  } catch (error) {
    if (error instanceof SupabaseNotConfiguredError) {
      return <AdminSetupPanel title="Testimonials" />;
    }
    throw error;
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-eyebrow text-muted-foreground">Website</p>
          <h1 className="font-heading text-2xl font-semibold mt-1">Client Testimonials</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Manage client reviews, satisfaction ratings, and quotes displayed on the homepage and case studies.
          </p>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-lg bg-brand-forest px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-[#252B29] transition-colors"
        >
          <MessageSquareQuote className="size-3.5" />
          Add Testimonial
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-xs">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border text-muted-foreground text-xs uppercase tracking-wide">
              <th className="px-4 py-3 font-medium">Client</th>
              <th className="px-4 py-3 font-medium">Organization & Role</th>
              <th className="px-4 py-3 font-medium">Rating</th>
              <th className="px-4 py-3 font-medium">Testimonial Quote</th>
              <th className="px-4 py-3 font-medium">Featured</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {DEMO_TESTIMONIALS.map((item) => (
              <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="relative size-9 overflow-hidden rounded-full border border-border bg-muted shrink-0">
                      <Image
                        src={item.portrait_url}
                        alt={item.client_name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <span className="font-medium text-foreground text-xs">{item.client_name}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <p className="text-xs font-medium text-foreground">{item.organization}</p>
                  <p className="text-[11px] text-muted-foreground">{item.position}</p>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center text-amber-500">
                    {Array.from({ length: item.rating }).map((_, i) => (
                      <Star key={i} className="size-3 fill-current" />
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3 max-w-sm text-xs text-muted-foreground line-clamp-2">
                  &ldquo;{item.testimonial}&rdquo;
                </td>
                <td className="px-4 py-3">
                  {item.is_featured ? (
                    <span className="inline-flex items-center rounded-md bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-800">
                      Featured
                    </span>
                  ) : (
                    <span className="text-xs text-muted-foreground/60">—</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center rounded-full bg-brand-sage/40 px-2 py-0.5 text-[11px] font-medium text-brand-forest">
                    Published
                  </span>
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
