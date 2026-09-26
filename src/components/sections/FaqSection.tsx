"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { ChevronDown } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  DEFAULT_DURATION,
  EASE_OUT_EXPO,
  FadeIn,
} from "@/components/animations";

/**
 * Technical pre-sales questions. Copy deliberately answers the four topics
 * required by docs/TASKS.md Task 3.4: delineation regulations, ASTM Phase I
 * triggers, permitting durations, and bespoke (never published) fee
 * proposals — aligned with the CMS pricing rule in AGENTS.md §5.5.
 */
const faqs = [
  {
    question: "Which regulations govern a wetland delineation?",
    answer:
      "Delineations follow the 1987 Corps Wetland Delineation Manual plus the applicable regional supplement — for example, the North Atlantic Coastal Plain supplement — evaluated under Section 404 of the Clean Water Act and state certifications such as Maine's §401. Boundaries are documented with vegetation, soils, and hydrology evidence an agency reviewer can verify.",
  },
  {
    question: "When is an ASTM Phase I ESA required?",
    answer:
      "Lenders and buyers typically commission a Phase I environmental site assessment to ASTM E1527-21 before closing; it also satisfies All Appropriate Inquiries, which preserves CERCLA landowner liability protections. We also recommend one ahead of redevelopment or refinancing whenever site history is unclear — recognized environmental conditions then trigger a Phase II investigation with sampling and analysis.",
  },
  {
    question: "How long does environmental permitting take?",
    answer:
      "It depends on the authorization path. Nationwide permits can be issued 60–120 days after a complete application, general permits and state §401 certifications add review cycles, and individual Section 404 permits commonly run 6–18 months with agency comment periods. We sequence federal, state, and local applications in parallel to compress the critical path.",
  },
  {
    question: "Why is there no fixed price list?",
    answer:
      "Environmental consulting scopes are bespoke: field days, agency pathways, and risk vary by site, so a published menu would misrepresent most engagements. After a scoping call we deliver a written proposal itemizing scope, deliverables, assumptions, and fee — clear enough to compare against any competitor.",
  },
];

/**
 * FAQ accordion section (docs/TASKS.md Task 3.4).
 *
 * WAI-ARIA accordion pattern: each question is a real `<button>` inside an
 * `<h3>` with `aria-expanded` / `aria-controls`, panels are labelled
 * regions, and Arrow/Home/End keys move focus between headers (Enter and
 * Space activate natively). One panel is open at a time; the first is open
 * by default so answers are present in the server-rendered HTML. Panel
 * motion honours `prefers-reduced-motion` (duration 0). Anchors the
 * homepage `#faq` nav link.
 *
 * Client component — the accordion is the only interactive surface in the
 * nine-section homepage narrative.
 */
export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const triggerRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const prefersReducedMotion = useReducedMotion();

  function focusTrigger(index: number) {
    triggerRefs.current[index]?.focus();
  }

  function handleTriggerKeyDown(
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) {
    const last = faqs.length - 1;
    let next: number | null = null;

    switch (event.key) {
      case "ArrowDown":
        next = index === last ? 0 : index + 1;
        break;
      case "ArrowUp":
        next = index === 0 ? last : index - 1;
        break;
      case "Home":
        next = 0;
        break;
      case "End":
        next = last;
        break;
      default:
        return;
    }

    if (next !== null) {
      event.preventDefault();
      focusTrigger(next);
    }
  }

  return (
    <section
      id="faq"
      aria-labelledby="faq-heading"
      className="border-border bg-background"
    >
      <div className="container-editorial grid gap-10 py-16 md:py-20 lg:grid-cols-[1fr_1.6fr] lg:gap-16 lg:py-24">
        <FadeIn>
          <p className="text-muted-foreground text-eyebrow">FAQ</p>
          <h2 id="faq-heading" className="text-display-lg mt-3 max-w-md">
            Questions, answered
          </h2>
          <p className="text-muted-foreground mt-5 max-w-md">
            Technical details clients ask before a scoping call. Anything
            specific to your site belongs in a confidential inquiry.
          </p>
        </FadeIn>

        <FadeIn delay={0.08}>
          <div className="border-border border-b">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;
              const triggerId = `faq-trigger-${index}`;
              const panelId = `faq-panel-${index}`;

              return (
                <div key={triggerId} className="border-border border-t">
                  <h3>
                    <button
                      type="button"
                      id={triggerId}
                      ref={(element) => {
                        triggerRefs.current[index] = element;
                      }}
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => setOpenIndex(isOpen ? null : index)}
                      onKeyDown={(event) => handleTriggerKeyDown(event, index)}
                      className="hover:text-brand-forest focus-visible:ring-ring/50 flex w-full items-center justify-between gap-4 rounded-lg py-5 text-left outline-none focus-visible:ring-3"
                    >
                      <span className="font-heading text-base font-semibold sm:text-lg">
                        {faq.question}
                      </span>
                      <ChevronDown
                        aria-hidden="true"
                        className={`text-muted-foreground size-5 shrink-0 motion-safe:transition-transform motion-safe:duration-300 ${isOpen ? "rotate-180" : ""}`}
                      />
                    </button>
                  </h3>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        key={panelId}
                        id={panelId}
                        role="region"
                        aria-labelledby={triggerId}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{
                          duration: prefersReducedMotion ? 0 : DEFAULT_DURATION,
                          ease: EASE_OUT_EXPO,
                        }}
                        className="overflow-hidden"
                      >
                        <p className="text-muted-foreground pr-10 pb-5 leading-relaxed">
                          {faq.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
