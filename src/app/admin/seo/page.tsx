import { requireAdmin } from "@/lib/auth/admin";
import { SupabaseNotConfiguredError } from "@/lib/env";
import { createPageMetadata } from "@/lib/seo";
import { AdminSetupPanel } from "../setup-panel";
import { Search, Globe, Share2 } from "lucide-react";

export const metadata = createPageMetadata({
  title: "SEO Configuration",
  description: "Manage global search engine metadata and social Open Graph tags.",
  path: "/admin/seo",
  index: false,
});

export default async function AdminSeoPage() {
  try {
    await requireAdmin();
  } catch (error) {
    if (error instanceof SupabaseNotConfiguredError) {
      return <AdminSetupPanel title="SEO Configuration" />;
    }
    throw error;
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <p className="text-eyebrow text-muted-foreground">Configuration</p>
        <h1 className="font-heading text-2xl font-semibold mt-1">SEO & Social Meta Tags</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Configure search engine indexing, Open Graph social share cards, and canonical site tags.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-card p-6 shadow-xs space-y-6">
        <div>
          <label className="flex items-center gap-2 text-xs font-semibold uppercase text-muted-foreground">
            <Globe className="size-3.5" />
            Default Meta Title Template
          </label>
          <input
            type="text"
            defaultValue="%s | Alderline Environmental Consulting"
            className="mt-1.5 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
            readOnly
          />
          <p className="text-[11px] text-muted-foreground mt-1">Use %s to represent the page-specific title.</p>
        </div>

        <div>
          <label className="flex items-center gap-2 text-xs font-semibold uppercase text-muted-foreground">
            <Search className="size-3.5" />
            Default Meta Description
          </label>
          <textarea
            defaultValue="Alderline Environmental provides defensible ecological consulting, wetland delineation, environmental permitting, and due diligence site assessments across the Pacific Northwest."
            rows={3}
            className="mt-1.5 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
            readOnly
          />
        </div>

        <div>
          <label className="flex items-center gap-2 text-xs font-semibold uppercase text-muted-foreground">
            <Share2 className="size-3.5" />
            Default Open Graph Share Image
          </label>
          <input
            type="text"
            defaultValue="/assets/alderline/hero/hero-poster.jpg"
            className="mt-1.5 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
            readOnly
          />
        </div>

        <div className="border-t border-border/60 pt-4 flex justify-between items-center">
          <span className="text-xs text-muted-foreground">Sitemap: /sitemap.xml (Auto-generated)</span>
          <button
            type="button"
            className="rounded-lg bg-brand-forest px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-[#252B29] transition-colors"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}
