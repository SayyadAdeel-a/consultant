"use client";

import { useCallback, useRef, useState } from "react";
import Link from "next/link";
import { Leaf, Menu, X } from "lucide-react";
import {
  resolvePublicIdentity,
  type PublicIdentity,
} from "@/lib/data/identity";
import { Navigation } from "./Navigation";
import { MobileNav } from "./MobileNav";

interface HeaderProps {
  /**
   * Resolved `site_settings` identity from the public layout
   * (docs/TASKS.md Task 9.1). Omitted → static defaults, keeping the
   * header renderable in isolation (tests, storybook-style usage).
   */
  identity?: PublicIdentity;
}

/**
 * Public site header.
 *
 * Sticky editorial header with the brand mark, desktop navigation, a mobile
 * toggle, and the accessible `MobileNav` drawer. This is a client component
 * because it owns the drawer open/close state; the drawer handles its own
 * focus management and returns focus to `toggleRef` when it closes.
 *
 * Brand name and the primary CTA resolve from the CMS identity passed by
 * the server layout, falling back to `@/config/site`.
 */
export function Header({ identity }: HeaderProps) {
  const site = identity ?? resolvePublicIdentity(null);
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);

  const closeMenu = useCallback(() => {
    setOpen(false);
    // Return keyboard focus to the toggle once the drawer closes.
    toggleRef.current?.focus();
  }, []);

  return (
    <header className="border-border bg-background/95 sticky top-0 z-40 border-b backdrop-blur">
      <div className="container-editorial flex h-16 items-center justify-between gap-4">
        <Link
          href="/"
          aria-label={`${site.name} — home`}
          className="focus-visible:outline-ring flex items-center gap-2.5 rounded-md focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          <span className="bg-brand-forest text-brand-ivory flex size-9 items-center justify-center rounded-lg">
            <Leaf className="size-5" aria-hidden="true" />
          </span>
          <span className="font-heading text-foreground text-xl font-semibold tracking-tight">
            {site.name}
          </span>
        </Link>

        <Navigation identity={site} />

        <button
          ref={toggleRef}
          type="button"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close navigation" : "Open menu"}
          onClick={() => setOpen((prev) => !prev)}
          className="text-foreground hover:bg-muted focus-visible:outline-ring inline-flex size-10 items-center justify-center rounded-md transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 lg:hidden"
        >
          {open ? (
            <X className="size-6" aria-hidden="true" />
          ) : (
            <Menu className="size-6" aria-hidden="true" />
          )}
        </button>
      </div>

      <MobileNav
        open={open}
        onClose={closeMenu}
        toggleRef={toggleRef}
        identity={site}
      />
    </header>
  );
}
