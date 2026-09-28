import { requireAdmin } from "@/lib/auth/admin";
import { SupabaseNotConfiguredError } from "@/lib/env";
import { createPageMetadata } from "@/lib/seo";
import { AdminSetupPanel } from "../setup-panel";
import { allBlogPosts } from "@/lib/blog-data";
import { VisualArticlesManager } from "@/components/admin/VisualArticlesManager";

export const metadata = createPageMetadata({
  title: "Articles & Editorial CMS",
  description: "Manage technical environmental articles and thought leadership.",
  path: "/admin/articles",
  index: false,
});

export default async function AdminArticlesPage() {
  try {
    await requireAdmin();
  } catch (error) {
    if (error instanceof SupabaseNotConfiguredError) {
      return <AdminSetupPanel title="Articles" />;
    }
    throw error;
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <p className="text-eyebrow text-muted-foreground">Content</p>
        <h1 className="font-heading text-2xl font-semibold mt-1">Articles & Insights</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Manage published environmental insights, draft articles, and regulatory analyses.
        </p>
      </div>

      <VisualArticlesManager initialArticles={allBlogPosts} />
    </div>
  );
}
