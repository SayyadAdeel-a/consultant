import { requireAdmin } from "@/lib/auth/admin";
import { SupabaseNotConfiguredError } from "@/lib/env";
import { createPageMetadata } from "@/lib/seo";
import { AdminSetupPanel } from "../setup-panel";
import { VisualTestimonialsManager } from "@/components/admin/VisualTestimonialsManager";

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
      <div>
        <p className="text-eyebrow text-muted-foreground">Website</p>
        <h1 className="font-heading text-2xl font-semibold mt-1">Client Testimonials</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Manage client reviews, satisfaction ratings, and quotes displayed on the homepage and case studies.
        </p>
      </div>

      <VisualTestimonialsManager initialTestimonials={DEMO_TESTIMONIALS} />
    </div>
  );
}
