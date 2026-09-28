import Link from "next/link";
import Image from "next/image";
import { requireAdmin } from "@/lib/auth/admin";
import { SupabaseNotConfiguredError } from "@/lib/env";
import { createPageMetadata } from "@/lib/seo";
import { AdminSetupPanel } from "../setup-panel";
import { ExternalLink, LayoutTemplate } from "lucide-react";

export const metadata = createPageMetadata({
  title: "My Website",
  description: "Visual editing cards for all public pages on Alderline Environmental.",
  path: "/admin/website",
  index: false,
});

interface PageCard {
  title: string;
  urlPath: string;
  editHref: string;
  badge: string;
  description: string;
  thumbnail: string;
  sectionCount: string;
  primaryAction: string;
}

const WEBSITE_PAGES: PageCard[] = [
  {
    title: "Homepage",
    urlPath: "/",
    editHref: "/admin/content",
    badge: "Primary Landing",
    description: "Hero landscape video, regulatory credibility, 4 practice areas, case studies, and consultation CTA.",
    thumbnail: "/assets/alderline/hero/hero-poster.jpg",
    sectionCount: "9 sections",
    primaryAction: "Open Visual Editor",
  },
  {
    title: "About Us",
    urlPath: "/about",
    editHref: "/admin/about",
    badge: "Company Story",
    description: "Executive mission statement, 4-photo aerial inspection gallery, and 3 core practice principles.",
    thumbnail: "/assets/alderline/about/gallery-1.jpg",
    sectionCount: "Mission & 4 Photos",
    primaryAction: "Edit Narrative",
  },
  {
    title: "Consulting Services",
    urlPath: "/services",
    editHref: "/admin/services",
    badge: "Practice Areas",
    description: "Master catalog of environmental services, deliverable checklists, and regulatory frameworks.",
    thumbnail: "/assets/alderline/services/coastal-resilience.jpg",
    sectionCount: "4 Core Disciplines",
    primaryAction: "Edit Services",
  },
  {
    title: "Projects & Case Studies",
    urlPath: "/projects",
    editHref: "/admin/projects",
    badge: "Portfolio",
    description: "Realized outcomes: coastal restoration, transmission corridors, and ASTM brownfield due diligence.",
    thumbnail: "/assets/alderline/about/gallery-2.jpg",
    sectionCount: "6 Realized Projects",
    primaryAction: "Manage Projects",
  },
  {
    title: "Insights & Blog",
    urlPath: "/blog",
    editHref: "/admin/articles",
    badge: "Articles",
    description: "Scientific perspectives, Clean Water Act commentary, and field notes categorized by practice.",
    thumbnail: "/assets/alderline/insights/article-hero.jpg",
    sectionCount: "10 Published Articles",
    primaryAction: "Manage Articles",
  },
  {
    title: "Contact & Intake",
    urlPath: "/contact",
    editHref: "/admin/contact-info",
    badge: "Inquiry Form",
    description: "Confidential scoping consultation intake form, office address, phone line, and project inbox.",
    thumbnail: "/assets/alderline/about/introduction.jpg",
    sectionCount: "Intake & Office",
    primaryAction: "Edit Contact Info",
  },
];

export default async function AdminWebsiteHubPage() {
  try {
    await requireAdmin();
  } catch (error) {
    if (error instanceof SupabaseNotConfiguredError) {
      return <AdminSetupPanel title="My Website" />;
    }
    throw error;
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-6 bg-card border border-border rounded-2xl shadow-xs">
        <div>
          <p className="text-eyebrow text-muted-foreground">Admin console</p>
          <h1 className="font-heading mt-1 text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            My Website
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-xl leading-relaxed">
            Select any page below to open its visual editor and update content or imagery.
          </p>
        </div>

        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-border text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shadow-xs"
        >
          <span>View Live Site</span>
          <ExternalLink className="size-3.5" />
        </a>
      </div>

      {/* Visual Pages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {WEBSITE_PAGES.map((page) => (
          <div
            key={page.title}
            className="group flex flex-col rounded-2xl border border-border bg-card overflow-hidden shadow-xs hover:shadow-md hover:border-brand-forest/60 transition-all duration-300"
          >
            {/* Visual Thumbnail */}
            <div className="relative aspect-16/9 w-full bg-muted/40 overflow-hidden">
              <Image
                src={page.thumbnail}
                alt={page.title}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover group-hover:scale-103 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3 flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#15190d]/80 text-[#f6f2eb] backdrop-blur-xs">
                  {page.badge}
                </span>
              </div>
              <div className="absolute bottom-3 right-3">
                <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-[#f6f2eb]/90 text-[#15190d] backdrop-blur-xs">
                  {page.sectionCount}
                </span>
              </div>
            </div>

            {/* Card Body */}
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                  <span className="font-mono text-[11px]">{page.urlPath}</span>
                  <a
                    href={page.urlPath}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-brand-forest inline-flex items-center gap-1 font-medium"
                    title="Open live page in new tab"
                  >
                    <span>Preview</span>
                    <ExternalLink className="size-3" />
                  </a>
                </div>
                <h2 className="text-lg font-bold text-foreground group-hover:text-brand-forest transition-colors">
                  {page.title}
                </h2>
                <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                  {page.description}
                </p>
              </div>

              {/* Action Button */}
              <div className="pt-3 border-t border-border">
                <Link
                  href={page.editHref}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#15190d] text-[#f6f2eb] text-xs font-semibold shadow-xs hover:bg-[#252b29] transition-colors"
                >
                  <LayoutTemplate className="size-3.5 text-[#dfe0d4]" />
                  <span>{page.primaryAction} &rarr;</span>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
