"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Briefcase,
  FileText,
  FolderKanban,
  Image as ImageIcon,
  Inbox,
  LayoutDashboard,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Interactive admin sidebar navigation (docs/TASKS.md Task 7.1).
 *
 * Route awareness only — this is UX, never authorization: every admin
 * page still calls `requireAdmin()` server-side (src/lib/auth/admin.ts),
 * so an unsigned-in visitor who follows a link is redirected to login.
 * The active item gets an aria-current link plus a sage pill.
 */
const ADMIN_NAV_ITEMS = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Inquiries", href: "/admin/inquiries", icon: Inbox },
  { label: "Services", href: "/admin/services", icon: Briefcase },
  { label: "Projects", href: "/admin/projects", icon: FolderKanban },
  { label: "Content", href: "/admin/content", icon: FileText },
  { label: "Media", href: "/admin/media", icon: ImageIcon },
  { label: "Settings", href: "/admin/settings", icon: Settings },
] as const;

/** Exact match for the dashboard root so `/admin/x` never highlights it. */
export function isActiveRoute(pathname: string, href: string): boolean {
  if (href === "/admin") return pathname === "/admin";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Admin" className="px-3 py-6 text-sm">
      <ul className="space-y-1">
        {ADMIN_NAV_ITEMS.map(({ label, href, icon: Icon }) => {
          const active = isActiveRoute(pathname, href);
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-full px-3 py-2 font-medium transition-colors",
                  active
                    ? "bg-brand-sage/40 text-brand-forest shadow-xs"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <Icon aria-hidden="true" className="size-4 shrink-0" />
                <span>{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
      <p className="text-muted-foreground/70 mt-4 px-3 text-xs">
        Every admin page re-verifies authorization server-side.
      </p>
    </nav>
  );
}
