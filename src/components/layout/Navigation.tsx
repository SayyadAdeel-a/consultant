"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/config/site";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "cn";

/**
 * Desktop primary navigation.
 *
 * Renders the public links from `src/config/site.ts` with an active-page
 * indicator (`aria-current="page"`) and the prominent "Request a
 * Consultation" call-to-action in the Forest Green brand style. The CTA is
 * an anchor styled with `buttonVariants` rather than a `<Button>` nested
 * inside a `<Link>`, keeping the markup valid and screen-reader friendly.
 *
 * This component is client-side only because it reads the current path via
 * `usePathname`. It renders nothing below the `lg` breakpoint — the mobile
 * toggle and drawer live in `Header.tsx` / `MobileNav.tsx`.
 */
export function Navigation() {
  const pathname = usePathname();

  return (
    <div className="hidden items-center gap-2 lg:flex">
      <nav aria-label="Primary">
        <ul className="flex items-center gap-1">
          {siteConfig.navigation.public.map((item) => {
            // Hash links (e.g. "/#projects") can only match the home route.
            const path = item.href.split("#")[0];
            const isActive =
              path === "/"
                ? pathname === "/"
                : pathname === path || pathname.startsWith(`${path}/`);

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-ring block rounded-md px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2",
                    isActive && "bg-muted text-foreground",
                  )}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <Link
        href="/contact"
        className={buttonVariants({
          variant: "default",
          size: "lg",
          className: "ml-2",
        })}
      >
        Request a Consultation
      </Link>
    </div>
  );
}
