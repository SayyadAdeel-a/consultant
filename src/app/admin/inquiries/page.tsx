import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Inquiries",
  description: "Administrative area.",
  path: "/admin/inquiries",
  index: false,
});

export default function AdminInquiriesPage() {
  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="font-heading text-2xl font-semibold">Inquiries</h1>
      <p className="text-muted-foreground mt-2 text-sm">
        Reviewing and status-tracking of contact submissions lands in Phase 7
        (CMS). Access is restricted to authenticated administrators; RLS keeps
        inquiry data private (docs/BACKEND_SECURITY.md).
      </p>
    </div>
  );
}
