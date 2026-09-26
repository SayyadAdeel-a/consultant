"use client";

import { useEffect, useRef, type RefObject } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowUpRight, X } from "lucide-react";
import { siteConfig } from "@/config/site";
import { buttonVariants } from "@/components/ui/button";

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

interface MobileNavProps {
  /** Whether the drawer is currently open. */
  open: boolean;
  /** Closes the drawer; the header restores focus to the toggle. */
  onClose: () => void;
  /** Ref to the header toggle button, used to restore focus on close. */
  toggleRef: RefObject<HTMLButtonElement | null>;
}

/**
 * Accessible mobile navigation drawer.
 *
 * - `role="dialog"` + `aria-modal="true"` with an accessible name.
 * - Focus is moved into the drawer on open, trapped while open (Tab /
 *   Shift+Tab cycle within the panel), and returned to the header toggle
 *   on close.
 * - Escape closes the drawer and locks body scroll while open.
 * - A blurred backdrop (click-to-close) dims page content; the sticky
 *   header bar stays visible above it.
 * - All motion is disabled when the user prefers reduced motion.
 */
export function MobileNav({ open, onClose, toggleRef }: MobileNavProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    if (!panel) return;

    // Move keyboard focus into the drawer when it opens.
    panel.querySelector<HTMLElement>(FOCUSABLE_SELECTOR)?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      // Only intercept Tab while focus is inside the drawer.
      if (event.key !== "Tab" || !panel.contains(document.activeElement)) {
        return;
      }
      const focusable = Array.from(
        panel.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose, toggleRef]);

  return (
    <>
      {/* Blurred backdrop — click to close. */}
      <AnimatePresence>
        {open ? (
          <motion.div
            aria-hidden="true"
            onClick={onClose}
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={reduceMotion ? undefined : { opacity: 1 }}
            exit={reduceMotion ? undefined : { opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-brand-charcoal/40 fixed inset-0 z-30 backdrop-blur-sm lg:hidden"
          />
        ) : null}
      </AnimatePresence>

      {/* Drawer panel, anchored below the sticky header bar. */}
      <AnimatePresence>
        {open ? (
          <motion.div
            ref={panelRef}
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            initial={reduceMotion ? false : { opacity: 0, y: -12 }}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="border-border bg-background absolute inset-x-0 top-full border-b shadow-md lg:hidden"
          >
            <div className="container-editorial flex max-h-[calc(100dvh-4rem)] flex-col overflow-y-auto py-4">
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close menu"
                  className="text-foreground hover:bg-muted focus-visible:outline-ring inline-flex size-10 items-center justify-center rounded-md transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
                >
                  <X className="size-6" aria-hidden="true" />
                </button>
              </div>

              <nav aria-label="Mobile">
                <ul className="mt-2 flex flex-col">
                  {siteConfig.navigation.public.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={onClose}
                        className="text-foreground hover:bg-muted focus-visible:outline-ring block rounded-md px-3 py-3 text-base font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
                      >
                        {item.label}
                        {item.description ? (
                          <span className="text-muted-foreground mt-0.5 block text-sm font-normal">
                            {item.description}
                          </span>
                        ) : null}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>

              <Link
                href="/contact"
                onClick={onClose}
                className={buttonVariants({
                  variant: "default",
                  size: "lg",
                  className: "mt-4 w-full justify-center",
                })}
              >
                Request a Consultation
                <ArrowUpRight className="size-4" aria-hidden="true" />
              </Link>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
