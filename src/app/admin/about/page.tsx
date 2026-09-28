import { requireAdmin } from "@/lib/auth/admin";
import { SupabaseNotConfiguredError } from "@/lib/env";
import { createPageMetadata } from "@/lib/seo";
import { AdminSetupPanel } from "../setup-panel";
import { aboutIntroContent } from "@/lib/alderline-content";
import Image from "next/image";

export const metadata = createPageMetadata({
  title: "About Page Content",
  description: "Manage About page narrative, gallery images, and principles.",
  path: "/admin/about",
  index: false,
});

interface GalleryItem {
  src: string;
  alt: string;
}

const ABOUT_GALLERY: GalleryItem[] = [
  { src: "/assets/alderline/about/gallery-1.jpg", alt: "Environmental survey site inspection" },
  { src: "/assets/alderline/about/gallery-2.jpg", alt: "Wetland boundary field analysis" },
  { src: "/assets/alderline/about/gallery-3.jpg", alt: "Riparian restoration site overview" },
  { src: "/assets/alderline/about/gallery-4.jpg", alt: "Watershed habitat field documentation" },
];

interface PrincipleItem {
  title: string;
  description: string;
}

const ABOUT_PRINCIPLES: PrincipleItem[] = [
  {
    title: "Field Understanding Before Broad Conclusions",
    description: "Real-world site evaluation, vegetation transects, and hydric soil analysis ground our recommendations in tangible data.",
  },
  {
    title: "Defensible Environmental Documentation",
    description: "Every report is structured to withstand agency scrutiny and support clear project decisions without ambiguity.",
  },
  {
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
    <div className="mx-auto max-w-5xl space-y-8">
      <div>
        <p className="text-eyebrow text-muted-foreground">Website</p>
        <div className="flex flex-wrap items-center justify-between gap-4 mt-1">
          <div>
            <h1 className="font-heading text-2xl font-semibold">About Page Content</h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Manage executive mission, four-photo aerial gallery, and core practice principles.
            </p>
          </div>
          <span className="inline-flex items-center rounded-full bg-brand-sage/40 px-3 py-1 text-xs font-medium text-brand-forest">
            ● Live on Public Website
          </span>
        </div>
      </div>

      {/* Hero Narrative Section */}
      <section className="rounded-xl border border-border bg-card p-6 shadow-xs">
        <h2 className="font-heading text-lg font-semibold">Hero Narrative & Mission</h2>
        <p className="text-muted-foreground text-xs mt-1">Primary headlines displayed at /about.</p>
        <div className="mt-4 grid gap-4">
          <div>
            <label className="text-xs font-semibold uppercase text-muted-foreground">Display Headline</label>
            <input
              type="text"
              defaultValue={aboutIntroContent.heading}
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
              readOnly
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase text-muted-foreground">Mission Statement</label>
            <textarea
              defaultValue={aboutIntroContent.description}
              rows={3}
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
              readOnly
            />
          </div>
        </div>
      </section>

      {/* 4-Photo Aerial Gallery */}
      <section className="rounded-xl border border-border bg-card p-6 shadow-xs">
        <h2 className="font-heading text-lg font-semibold">Four-Photo Aerial Gallery</h2>
        <p className="text-muted-foreground text-xs mt-1">Curated aerial photography displayed across the public about view.</p>
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {ABOUT_GALLERY.map((img: GalleryItem, idx: number) => (
            <div key={img.src} className="group relative overflow-hidden rounded-lg border border-border bg-muted/20">
              <div className="relative aspect-4/3 w-full">
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-2">
                <p className="text-[11px] font-medium text-foreground truncate">Slot 0{idx + 1}</p>
                <p className="text-[10px] text-muted-foreground truncate">{img.alt}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Core Principles */}
      <section className="rounded-xl border border-border bg-card p-6 shadow-xs">
        <h2 className="font-heading text-lg font-semibold">Core Practice Principles</h2>
        <p className="text-muted-foreground text-xs mt-1">Strategic commitments displayed on the about page.</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {ABOUT_PRINCIPLES.map((p: PrincipleItem, idx: number) => (
            <div key={p.title} className="rounded-lg border border-border/80 bg-background/50 p-4">
              <span className="text-xs font-mono text-muted-foreground">0{idx + 1}</span>
              <h3 className="font-heading text-sm font-semibold mt-1">{p.title}</h3>
              <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{p.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
