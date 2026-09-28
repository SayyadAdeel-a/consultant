import { requireAdmin } from "@/lib/auth/admin";
import { SupabaseNotConfiguredError } from "@/lib/env";
import { createPageMetadata } from "@/lib/seo";
import { AdminSetupPanel } from "../setup-panel";
import { Tags, Plus } from "lucide-react";

export const metadata = createPageMetadata({
  title: "Article Categories",
  description: "Manage editorial topics and categories.",
  path: "/admin/categories",
  index: false,
});

export const DEMO_CATEGORIES = [
  { id: "cat-1", name: "Site Assessment", slug: "site-assessment", count: 2, description: "Phase I & II due diligence and ASTM standards." },
  { id: "cat-2", name: "Wetlands", slug: "wetlands", count: 3, description: "Delineation, hydric soils, and USACE manual compliance." },
  { id: "cat-3", name: "Permitting", slug: "permitting", count: 2, description: "Section 404/401 CWA and NEPA environmental reviews." },
  { id: "cat-4", name: "Restoration", slug: "restoration", count: 2, description: "Living shorelines, riparian buffers, and compensatory mitigation." },
  { id: "cat-5", name: "Water Resources", slug: "water-resources", count: 1, description: "Watershed hydrology, aquifer protection, and stormwater." },
];

export default async function AdminCategoriesPage() {
  try {
    await requireAdmin();
  } catch (error) {
    if (error instanceof SupabaseNotConfiguredError) {
      return <AdminSetupPanel title="Categories" />;
    }
    throw error;
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-eyebrow text-muted-foreground">Content</p>
          <h1 className="font-heading text-2xl font-semibold mt-1">Categories & Topics</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Organize insights and technical articles into searchable practice categories.
          </p>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-lg bg-brand-forest px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-[#252B29] transition-colors"
        >
          <Plus className="size-3.5" />
          Add Category
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-xs">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border text-muted-foreground text-xs uppercase tracking-wide">
              <th className="px-4 py-3 font-medium">Category Name</th>
              <th className="px-4 py-3 font-medium">Slug</th>
              <th className="px-4 py-3 font-medium">Description</th>
              <th className="px-4 py-3 font-medium">Articles Count</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {DEMO_CATEGORIES.map((cat) => (
              <tr key={cat.id} className="hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Tags className="size-3.5 text-muted-foreground" />
                    <span className="font-medium text-foreground text-xs">{cat.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-xs font-mono text-muted-foreground">
                  {cat.slug}
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground">
                  {cat.description}
                </td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-xs text-foreground font-medium">
                    {cat.count} articles
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
