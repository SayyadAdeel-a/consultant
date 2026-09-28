import Link from "next/link";
import { requireAdmin } from "@/lib/auth/admin";
import { SupabaseNotConfiguredError } from "@/lib/env";
import { createPageMetadata } from "@/lib/seo";
import { AdminSetupPanel } from "../setup-panel";
import {
  BarChart3,
  Briefcase,
  FileText,
  FolderKanban,
  Handshake,
  HelpCircle,
  MessageSquareQuote,
  Users,
} from "lucide-react";

export const metadata = createPageMetadata({
  title: "Content Library",
  description: "Organized library for repeatable website content collections.",
  path: "/admin/content-hub",
  index: false,
});

interface CollectionCard {
  title: string;
  href: string;
  badge: string;
  count: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

const COLLECTIONS: CollectionCard[] = [
  {
    title: "Team Members",
    href: "/admin/team",
    badge: "Leadership",
    count: "5 profiles",
    description: "Certified scientists, PE engineers, hydrologists, and restoration advisors with portraits and credentials.",
    icon: Users,
  },
  {
    title: "Consulting Services",
    href: "/admin/services",
    badge: "Practice Areas",
    count: "4 disciplines",
    description: "Wetland delineation, Section 404/401 permitting, ASTM site assessments, and habitat restoration.",
    icon: Briefcase,
  },
  {
    title: "Projects & Case Studies",
    href: "/admin/projects",
    badge: "Portfolio",
    count: "6 case studies",
    description: "Realized project outcomes including Casco Bay restoration and transmission corridor permitting.",
    icon: FolderKanban,
  },
  {
    title: "Client Reviews & Quotes",
    href: "/admin/testimonials",
    badge: "Testimonials",
    count: "5 reviews",
    description: "Verified client feedback, 5-star satisfaction ratings, and project references displayed sitewide.",
    icon: MessageSquareQuote,
  },
  {
    title: "Blog Posts & Field Notes",
    href: "/admin/articles",
    badge: "Articles",
    count: "10 articles",
    description: "Technical perspectives, regulatory updates, and field methodologies organized into categories.",
    icon: FileText,
  },
  {
    title: "Partner & Agency Logos",
    href: "/admin/partners",
    badge: "Alliances",
    count: "4 partners",
    description: "Industry consortia, technical alliances, and regulatory compliance body credentials.",
    icon: Handshake,
  },
  {
    title: "Frequently Asked Questions",
    href: "/admin/faqs",
    badge: "FAQs",
    count: "5 Q&As",
    description: "Helpful answers to common client questions about scoping, timelines, and regulatory concurrence.",
    icon: HelpCircle,
  },
  {
    title: "Numbers & Statistics",
    href: "/admin/statistics",
    badge: "Track Record",
    count: "4 counters",
    description: "99.4% regulatory concurrence, 35,000+ acres evaluated, and 14+ years active service counters.",
    icon: BarChart3,
  },
];

export default async function AdminContentHubPage() {
  try {
    await requireAdmin();
  } catch (error) {
    if (error instanceof SupabaseNotConfiguredError) {
      return <AdminSetupPanel title="Content Library" />;
    }
    throw error;
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      {/* Header */}
      <div className="p-6 bg-card border border-border rounded-2xl shadow-xs">
        <p className="text-eyebrow text-muted-foreground">Admin console</p>
        <h1 className="font-heading mt-1 text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Content Library
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-xl leading-relaxed">
          Manage repeatable collections that appear across your website. Select any collection to view, add, or edit items.
        </p>
      </div>

      {/* 8 Collections Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {COLLECTIONS.map((c) => {
          const Icon = c.icon;
          return (
            <Link
              key={c.title}
              href={c.href}
              className="group flex flex-col rounded-2xl border border-border bg-card p-5 shadow-xs hover:shadow-md hover:border-brand-forest/60 transition-all duration-300"
            >
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="p-2.5 rounded-xl bg-brand-sage/40 text-brand-forest group-hover:bg-brand-forest group-hover:text-white transition-colors">
                  <Icon className="size-5" />
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-muted text-muted-foreground">
                  {c.count}
                </span>
              </div>

              <h2 className="text-base font-bold text-foreground group-hover:text-brand-forest transition-colors">
                {c.title}
              </h2>
              <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed flex-1">
                {c.description}
              </p>

              <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-xs font-semibold text-brand-forest">
                <span>Manage items</span>
                <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
