"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Briefcase,
  Compass,
  FileText,
  FolderKanban,
  Handshake,
  HelpCircle,
  Home,
  Image as ImageIcon,
  Inbox,
  Info,
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

export interface NavGroup {
  category: string;
  items: {
    label: string;
    href: string;
    icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean | "true" | "false" }>;
  }[];
}

export const ADMIN_NAV_GROUPS: NavGroup[] = [
  {
    category: "Overview",
    items: [
      { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    ],
  },
  {
    category: "Website",
    items: [
      { label: "Homepage", href: "/admin/content", icon: Home },
      { label: "About", href: "/admin/about", icon: Info },
      { label: "Services", href: "/admin/services", icon: Briefcase },
      { label: "Projects", href: "/admin/projects", icon: FolderKanban },
      { label: "Team", href: "/admin/team", icon: Users },
      { label: "Testimonials", href: "/admin/testimonials", icon: MessageSquareQuote },
      { label: "Partners", href: "/admin/partners", icon: Handshake },
      { label: "Statistics", href: "/admin/statistics", icon: BarChart3 },
      { label: "FAQs", href: "/admin/faqs", icon: HelpCircle },
    ],
  },
  {
    category: "Content",
    items: [
      { label: "Articles", href: "/admin/articles", icon: FileText },
      { label: "Categories", href: "/admin/categories", icon: Tags },
      { label: "Media Library", href: "/admin/media", icon: ImageIcon },
    ],
  },
  {
    category: "Business",
    items: [
      { label: "Inquiries", href: "/admin/inquiries", icon: Inbox },
      { label: "Contact Info", href: "/admin/contact-info", icon: PhoneCall },
    ],
  },
  {
    category: "Configuration",
    items: [
      { label: "Settings", href: "/admin/settings", icon: Settings },
      { label: "SEO", href: "/admin/seo", icon: Search },
      { label: "Navigation", href: "/admin/navigation", icon: Compass },
      { label: "Footer", href: "/admin/footer", icon: PanelBottom },
      { label: "Account", href: "/admin/account", icon: ShieldCheck },
    ],
  },
];

/** Exact match for the dashboard root so `/admin/x` never highlights it. */
export function isActiveRoute(pathname: string, href: string): boolean {
  if (href === "/admin") return pathname === "/admin";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Admin" className="px-3 py-4 text-sm space-y-6">
      {ADMIN_NAV_GROUPS.map((group) => (
        <div key={group.category} className="space-y-1">
          <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
            {group.category}
          </p>
          <ul className="space-y-0.5">
            {group.items.map(({ label, href, icon: Icon }) => {
              const active = isActiveRoute(pathname, href);
              return (
                <li key={href}>
                  <Link
                    href={href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex items-center gap-2.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
                      active
                        ? "bg-brand-sage/40 text-brand-forest shadow-xs font-semibold"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                  >
                    <Icon aria-hidden="true" className="size-3.5 shrink-0" />
                    <span>{label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
      <div className="pt-2 px-3 border-t border-border/40">
        <p className="text-[11px] text-muted-foreground/70 leading-relaxed">
          Demonstration Mode Active
        </p>
      </div>
    </nav>
  );
}
