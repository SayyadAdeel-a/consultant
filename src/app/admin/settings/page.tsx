import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Settings",
  description: "Administrative area.",
  path: "/admin/settings",
  index: false,
});

export default function AdminSettingsPage() {
  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="font-heading text-2xl font-semibold">Site settings</h1>
      <p className="text-muted-foreground mt-2 text-sm">
        Company identity, logo, contact details and social links management
        lands in Phase 7 (CMS). Backed by the site_settings table and consumed
        site-wide via server helpers (docs/CMS_SCHEMA.md).
      </p>
    </div>
  );
}
