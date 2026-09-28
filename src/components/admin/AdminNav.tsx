"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Briefcase,
  ChevronDown,
  Compass,
  FileText,
  FolderKanban,
  Globe,
  Handshake,
  HelpCircle,
  Home,
  Image as ImageIcon,
  Inbox,
  Info,
  Layers,
  LayoutDashboard,
  MessageSquareQuote,
  PanelBottom,
  PhoneCall,
  Search,
  Settings,
  ShieldCheck,
  Tags,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean | "true" | "false" }>;
  badge?: string;
}

export const PRIMARY_NAV: NavItem[] = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "My Website", href: "/admin/website", icon: Globe, badge: "6 pages" },
  { label: "Content", href: "/admin/content-hub", icon: Layers, badge: "8 sets" },
  { label: "Photos & Videos", href: "/admin/media", icon: ImageIcon },
  { label: "Messages", href: "/admin/inquiries", icon: Inbox },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

/** All direct collections for power users who want one-click jumps */
export const SECONDARY_COLLECTIONS: { category: string; items: NavItem[] }[] = [
  {
    category: "Website Pages",
    items: [
      { label: "Homepage Editor", href: "/admin/content", icon: Home },
      { label: "About Page", href: "/admin/about", icon: Info },
      { label: "Services Page", href: "/admin/services", icon: Briefcase },
      { label: "Projects Page", href: "/admin/projects", icon: FolderKanban },
      { label: "Contact Info", href: "/admin/contact-info", icon: PhoneCall },
    ],
  },
  {
    category: "Collections",
    items: [
      { label: "Team Members", href: "/admin/team", icon: Users },
      { label: "Client Reviews", href: "/admin/testimonials", icon: MessageSquareQuote },
      { label: "Articles & Blog", href: "/admin/articles", icon: FileText },
      { label: "Partners", href: "/admin/partners", icon: Handshake },
      { label: "FAQs", href: "/admin/faqs", icon: HelpCircle },
      { label: "Statistics", href: "/admin/statistics", icon: BarChart3 },
    ],
  },
];

/** Matches active route, associating sub-routes with their primary hub */
export function isActiveRoute(pathname: string, href: string): boolean {
  if (href === "/admin") return pathname === "/admin";
  if (href === "/admin/website") {
    return (
      pathname === "/admin/website" ||
      pathname === "/admin/content" ||
      pathname === "/admin/about"
    );
  }
  if (href === "/admin/content-hub") {
    return (
      pathname === "/admin/content-hub" ||
      pathname === "/admin/team" ||
      pathname === "/admin/services" ||
      pathname === "/admin/projects" ||
      pathname === "/admin/testimonials" ||
      pathname === "/admin/articles" ||
      pathname === "/admin/partners" ||
      pathname === "/admin/faqs" ||
      pathname === "/admin/statistics"
    );
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminNav() {
  const pathname = usePathname();
  const [showAllLinks, setShowAllLinks] = useState(false);

  return (
    <nav aria-label="Admin" className="px-3 py-4 text-sm space-y-6">
      {/* ─────────────────────────────────────────────────────────────
          1. Primary Simplified Navigation (The 5 Customer Hubs)
          ───────────────────────────────────────────────────────────── */}
      <div className="space-y-1">
        <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
          Navigation
        </p>
        <ul className="space-y-1">
          {PRIMARY_NAV.map(({ label, href, icon: Icon, badge }) => {
            const active = isActiveRoute(pathname, href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex items-center justify-between rounded-xl px-3 py-2 text-xs font-medium transition-colors",
                    active
                      ? "bg-brand-sage/40 text-brand-forest shadow-xs font-semibold"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon aria-hidden="true" className="size-4 shrink-0 text-brand-forest" />
                    <span className="truncate">{label}</span>
                  </div>
                  {badge && (
                    <span className="text-[10px] text-muted-foreground/80 font-mono px-1.5 py-0.2 rounded bg-muted/60">
                      {badge}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. Progressive Disclosure: All Direct Links Toggle
          ───────────────────────────────────────────────────────────── */}
      <div className="pt-2 border-t border-border/50">
        <button
          type="button"
          onClick={() => setShowAllLinks((prev) => !prev)}
          className="w-full flex items-center justify-between px-3 py-1.5 text-[11px] font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          <span>All Direct Shortcuts</span>
          <ChevronDown
            className={cn("size-3.5 transition-transform duration-200", showAllLinks && "rotate-180")}
          />
        </button>

        {showAllLinks && (
          <div className="mt-2 space-y-4 animate-in fade-in slide-in-from-top-1 duration-200">
            {SECONDARY_COLLECTIONS.map((group) => (
              <div key={group.category} className="space-y-1">
                <p className="px-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">
                  {group.category}
                </p>
                <ul className="space-y-0.5">
                  {group.items.map(({ label, href, icon: Icon }) => {
                    const active = pathname === href;
                    return (
                      <li key={href}>
                        <Link
                          href={href}
                          aria-current={active ? "page" : undefined}
                          className={cn(
                            "flex items-center gap-2 rounded-lg px-3 py-1 text-[11px] font-medium transition-colors",
                            active
                              ? "bg-brand-sage/40 text-brand-forest font-semibold"
                              : "text-muted-foreground hover:bg-muted hover:text-foreground",
                          )}
                        >
                          <Icon aria-hidden="true" className="size-3 shrink-0" />
                          <span className="truncate">{label}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer Demonstration Badge */}
      <div className="pt-2 px-3 border-t border-border/40">
        <div className="flex items-center gap-2">
          <span className="size-1.5 rounded-full bg-emerald-500" />
          <p className="text-[11px] text-muted-foreground/80 font-medium">
            Alderline Live Website
          </p>
        </div>
      </div>
    </nav>
  );
}
