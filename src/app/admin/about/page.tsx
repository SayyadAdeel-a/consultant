import { requireAdmin } from "@/lib/auth/admin";
import { SupabaseNotConfiguredError } from "@/lib/env";
import { createPageMetadata } from "@/lib/seo";
import { AdminSetupPanel } from "../setup-panel";
import { aboutIntroContent } from "@/lib/alderline-content";
import {
  VisualAboutEditor,
  type GalleryPhoto,
  type PracticePrinciple,
} from "@/components/admin/VisualAboutEditor";

export const metadata = createPageMetadata({
  title: "Edit About Page",
  description: "Visual editor for About page executive narrative, aerial gallery, and principles.",
  path: "/admin/about",
  index: false,
});

const DEFAULT_GALLERY: GalleryPhoto[] = [
  {
    id: "gal-1",
    src: "/assets/alderline/about/gallery-1.jpg",
    title: "Canyon River Ecotone Survey",
    alt: "Environmental survey team inspecting riparian corridor in canyon ecosystem",
  },
  {
    id: "gal-2",
    src: "/assets/alderline/about/gallery-2.jpg",
    title: "Coastal Fjord & Bridge Infrastructure",
    alt: "Aerial perspective of coastal highway corridor crossing sensitive fjord ecology",
  },
  {
    id: "gal-3",
    src: "/assets/alderline/about/gallery-3.jpg",
    title: "Temperate Rainforest Canopy & Wetland",
    alt: "Lush forested wetland canopy evaluated for Section 404 compliance",
  },
  {
    id: "gal-4",
    src: "/assets/alderline/about/gallery-4.jpg",
    title: "Braided River Estuary & Marsh Hydrology",
    alt: "High-altitude aerial photography of dendritic tidal drainage network",
  },
];

const DEFAULT_PRINCIPLES: PracticePrinciple[] = [
  {
    id: "principle-1",
    number: "01",
    title: "Field Understanding Before Broad Conclusions",
    description: "Real-world site evaluation, vegetation transects, and hydric soil analysis ground our recommendations in tangible data.",
  },
  {
    id: "principle-2",
    number: "02",
    title: "Defensible Environmental Documentation",
    description: "Every report is structured to withstand agency scrutiny and support clear project decisions without ambiguity.",
  },
  {
    id: "principle-3",
    number: "03",
    title: "Practical Navigation Across Permitting Paths",
    description: "We align ecological protection with capital delivery milestones, coordinating directly with USACE and state bodies.",
  },
];

export default async function AdminAboutPage() {
  try {
    await requireAdmin();
  } catch (error) {
    if (error instanceof SupabaseNotConfiguredError) {
      return <AdminSetupPanel title="About Page Content" />;
    }
    throw error;
  }

  return (
    <div className="mx-auto max-w-6xl">
      <VisualAboutEditor
        initialHeading={aboutIntroContent.heading}
        initialDescription={aboutIntroContent.description}
        initialGallery={DEFAULT_GALLERY}
        initialPrinciples={DEFAULT_PRINCIPLES}
      />
    </div>
  );
}
