import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Projects",
  description: "Administrative area.",
  path: "/admin/projects",
  index: false,
});

export default function AdminProjectsPage() {
  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="font-heading text-2xl font-semibold">
        Projects & case studies
      </h1>
      <p className="text-muted-foreground mt-2 text-sm">
        Case study CRUD with imagery, publication state and featured flag lands
        in Phase 7 (CMS). Schema in docs/CMS_SCHEMA.md.
      </p>
    </div>
  );
}
