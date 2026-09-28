import type { Metadata } from "next";
import Link from "next/link";
import { LogOut } from "lucide-react";
import { logoutAdmin } from "@/app/actions/auth";
import { AdminNav } from "@/components/admin";
import { MobileAdminSidebar } from "@/components/admin/MobileAdminSidebar";
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
    <div className="admin-area bg-muted/30 min-h-screen">
      <AdminConfigNotice />
      <header className="border-border bg-background border-b sticky top-0 z-30">
        <div className="flex h-14 items-center justify-between gap-4 px-4 sm:px-6">
          <div className="flex items-center gap-3">
            {/* Mobile hamburger — only visible below lg */}
            <MobileAdminSidebar />
            <Link href="/admin" className="flex items-baseline gap-2">
              <span className="font-heading text-base font-semibold tracking-tight text-brand-forest">
                Alderline
              </span>
              <span className="text-muted-foreground text-xs font-mono hidden sm:inline">CMS Console</span>
            </Link>
            <span className="hidden sm:inline-flex items-center rounded-full bg-brand-sage/30 px-2 py-0.5 text-[11px] font-medium text-brand-forest">
              Demo Active
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-medium text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors px-2 py-1 rounded-md hover:bg-muted"
            >
              <span className="hidden sm:inline">View Live Website</span>
              <span className="sm:hidden">Live</span>
              <span aria-hidden="true" className="text-[10px]">↗</span>
            </Link>

            {admin ? (
              <div className="flex items-center gap-2 sm:gap-3 border-l border-border/60 pl-2 sm:pl-3">
                <span
                  className="text-muted-foreground max-w-32 sm:max-w-48 truncate text-xs font-medium hidden md:inline"
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
                    <span className="hidden sm:inline">Sign out</span>
                  </button>
                </form>
              </div>
            ) : null}
          </div>
        </div>
      </header>
      <div className="flex min-h-[calc(100vh-3.5rem)]">
        <aside className="border-border bg-background hidden w-60 shrink-0 border-r lg:block">
          <AdminNav />
        </aside>
        <div className="flex-1 p-4 sm:p-6 lg:p-10 min-w-0">{children}</div>
      </div>
    </div>
  );
}
