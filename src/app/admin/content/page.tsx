import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Content",
  description: "Administrative area.",
  path: "/admin/content",
  index: false,
});

export default function AdminContentPage() {
  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="font-heading text-2xl font-semibold">Homepage content</h1>
      <p className="text-muted-foreground mt-2 text-sm">
        Editing for homepage sections, headlines, CTAs and section visibility
        lands in Phase 7 (CMS). Structure is defined in docs/CMS_SCHEMA.md
        (homepage_sections table).
      </p>
    </div>
  );
}
