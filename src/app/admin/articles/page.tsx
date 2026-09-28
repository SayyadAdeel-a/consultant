import { requireAdmin } from "@/lib/auth/admin";
import { SupabaseNotConfiguredError } from "@/lib/env";
import { createPageMetadata } from "@/lib/seo";
import { AdminSetupPanel } from "../setup-panel";
import { allBlogPosts } from "@/lib/blog-data";
import Image from "next/image";
import Link from "next/link";
import { Plus } from "lucide-react";

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
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-eyebrow text-muted-foreground">Content</p>
          <h1 className="font-heading text-2xl font-semibold mt-1">Articles & Insights</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Manage published environmental insights, draft articles, and regulatory analyses.
          </p>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-lg bg-brand-forest px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-[#252B29] transition-colors"
        >
          <Plus className="size-3.5" />
          Create Article
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-xs">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border text-muted-foreground text-xs uppercase tracking-wide">
              <th className="px-4 py-3 font-medium">Article</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Read Time</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Slug</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {allBlogPosts.map((post) => (
              <tr key={post.slug} className="hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3 max-w-xs">
                  <div className="flex items-center gap-3">
                    <div className="relative size-10 overflow-hidden rounded-md border border-border bg-muted shrink-0">
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-foreground text-xs truncate">{post.title}</p>
                      <p className="text-[11px] text-muted-foreground line-clamp-1">{post.summary}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-xs text-foreground">
                    {post.category}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground">
                  {post.readTime}
                </td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center rounded-full bg-brand-sage/40 px-2 py-0.5 text-[11px] font-medium text-brand-forest">
                    Published
                  </span>
                </td>
                <td className="px-4 py-3 text-xs font-mono text-muted-foreground max-w-xs truncate">
                  /blog/{post.slug}
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/blog/${post.slug}`}
                    target="_blank"
                    className="text-xs font-semibold text-brand-forest hover:underline mr-3"
                  >
                    View ↗
                  </Link>
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
