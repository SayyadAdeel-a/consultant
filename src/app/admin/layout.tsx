import type { Metadata } from "next";
import { LogOut } from "lucide-react";
import { logoutAdmin } from "@/app/actions/auth";
import { buttonVariants } from "@/components/ui/button";
import { getAdminUser } from "@/lib/auth/admin";
import { SupabaseNotConfiguredError } from "@/lib/env";
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
 * Admin area layout (docs/TASKS.md Task 6.1).
 *
 * This layout intentionally does NOT call requireAdmin(): /admin/login
 * must stay reachable for unauthenticated users. Each admin page below it
 * must gate itself — see src/lib/auth/admin.ts and docs/BACKEND_SECURITY.md.
 *
 * The header reads the session once (cached per request) to display the
 * signed-in admin's email and the sign-out control; signed-out visitors
 * simply see no session controls. When Supabase is unconfigured this still
 * renders the shell (plus the fail-secure setup notice).
 */
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await getAdminUser().catch((error: unknown) => {
    // Demo mode: no credentials means no session can exist.
    if (error instanceof SupabaseNotConfiguredError) return null;
    throw error;
  });

  return (
    <div className="bg-muted/30 min-h-screen">
      <AdminConfigNotice />
      <header className="border-border bg-background border-b">
        <div className="flex h-14 items-center justify-between gap-4 px-6">
          <div className="flex items-baseline gap-2">
            <span className="font-heading text-base font-semibold">
              IntegraVity
            </span>
            <span className="text-muted-foreground text-xs">Admin console</span>
          </div>
          {admin ? (
            <div className="flex items-center gap-4">
              <span
                className="text-muted-foreground max-w-48 truncate text-sm"
                title={admin.email}
              >
                {admin.email}
              </span>
              <form action={logoutAdmin}>
                <button
                  type="submit"
                  className={buttonVariants({ variant: "outline", size: "sm" })}
                >
                  <LogOut aria-hidden="true" className="size-3.5" />
                  Sign out
                </button>
              </form>
            </div>
          ) : null}
        </div>
      </header>
      <div className="flex min-h-[calc(100vh-3.5rem)]">
        <aside className="border-border bg-background hidden w-60 shrink-0 border-r lg:block">
          <nav aria-label="Admin" className="px-3 py-6 text-sm">
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
