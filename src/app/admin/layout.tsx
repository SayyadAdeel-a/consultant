import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo";
import { AdminConfigNotice } from "./config-notice";

export const metadata: Metadata = {
  ...createPageMetadata({
    title: "Admin",
    description: "Administrative area.",
    path: "/admin",
    index: false,
  }),
  robots: { index: false, follow: false },
};

/**
 * Admin area layout. This layout intentionally does NOT call requireAdmin():
 * /admin/login must stay reachable for unauthenticated users. Each admin
 * page below it must gate itself — see src/lib/auth/admin.ts and
 * docs/BACKEND_SECURITY.md.
 *
 * When Supabase is unconfigured this renders a fail-secure setup notice
 * instead of interactive admin UI (pages still enforce their own gates).
 */
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-muted/30 min-h-screen">
      <AdminConfigNotice />
      <div className="flex min-h-[calc(100vh-2.5rem)]">
        <aside className="border-border bg-background hidden w-60 shrink-0 border-r lg:block">
          <div className="p-6">
            <p className="font-heading text-lg font-semibold">IntegraVity</p>
            <p className="text-muted-foreground mt-1 text-xs">Admin console</p>
          </div>
          <nav aria-label="Admin" className="px-3 pb-6 text-sm">
            <ul className="space-y-1">
              {[
                ["Dashboard", "/admin"],
                ["Content", "/admin/content"],
                ["Services", "/admin/services"],
                ["Projects", "/admin/projects"],
                ["Media", "/admin/media"],
                ["Inquiries", "/admin/inquiries"],
                ["Settings", "/admin/settings"],
              ].map(([label, href]) => (
                <li key={href}>
                  <span className="text-muted-foreground block rounded-md px-3 py-2">
                    {label}
                  </span>
                </li>
              ))}
            </ul>
            <p className="text-muted-foreground/70 mt-4 px-3 text-xs">
              Interactive navigation lands with CMS implementation (Phase 7).
            </p>
          </nav>
        </aside>
        <div className="flex-1 p-6 lg:p-10">{children}</div>
      </div>
    </div>
  );
}
