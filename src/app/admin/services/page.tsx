import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Services",
  description: "Administrative area.",
  path: "/admin/services",
  index: false,
});

export default function AdminServicesPage() {
  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="font-heading text-2xl font-semibold">Services</h1>
      <p className="text-muted-foreground mt-2 text-sm">
        CRUD for services (title, slug, summary, imagery, display order,
        optional pricing) lands in Phase 7 (CMS). Schema in docs/CMS_SCHEMA.md.
      </p>
    </div>
  );
}
