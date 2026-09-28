"use client";

import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { AdminNav } from "./index";
import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * Mobile sidebar drawer for the admin CMS layout.
 * Only visible on screens narrower than the lg breakpoint.
 * Closes automatically on route change.
 */
export function MobileAdminSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [prevPathname, setPrevPathname] = useState(pathname);

  // Close on route change
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setOpen(false);
  }

  // Prevent body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      {/* Hamburger trigger — hidden on lg+ */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="lg:hidden inline-flex items-center justify-center size-8 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        aria-label="Open navigation menu"
        aria-expanded={open}
        aria-controls="admin-mobile-nav"
      >
        <Menu aria-hidden="true" className="size-4" />
      </button>

      {/* Overlay */}
      {open && (
        <div
          className="admin-mobile-sidebar-overlay lg:hidden"
          aria-hidden="true"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Slide-in sidebar panel */}
      <nav
        id="admin-mobile-nav"
        aria-label="Admin mobile navigation"
        className={`admin-mobile-sidebar lg:hidden ${open ? "open" : ""}`}
      >
        <div className="flex h-14 items-center justify-between gap-4 px-4 border-b border-border">
          <Link href="/admin" className="flex items-baseline gap-2" onClick={() => setOpen(false)}>
            <span className="font-heading text-base font-semibold tracking-tight text-brand-forest">
              Alderline
            </span>
            <span className="text-muted-foreground text-xs font-mono">CMS</span>
          </Link>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="inline-flex items-center justify-center size-8 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            aria-label="Close navigation menu"
          >
            <X aria-hidden="true" className="size-4" />
          </button>
        </div>
        <AdminNav />
      </nav>
    </>
  );
}
