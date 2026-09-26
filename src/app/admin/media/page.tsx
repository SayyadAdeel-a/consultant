import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Media",
  description: "Administrative area.",
  path: "/admin/media",
  index: false,
});

export default function AdminMediaPage() {
  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="font-heading text-2xl font-semibold">Media library</h1>
      <p className="text-muted-foreground mt-2 text-sm">
        Upload, replace, remove and describe imagery (Supabase Storage) lands in
        Phase 7 (CMS). Upload validation rules in docs/BACKEND_SECURITY.md.
      </p>
    </div>
  );
}
