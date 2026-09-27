import Link from "next/link";
import { FadeIn, SlideUp } from "@/components/animations";
import { buttonVariants } from "@/components/ui/button";
import {
  resolvePublicIdentity,
  type PublicIdentity,
} from "@/lib/data/identity";

const eyebrow = "Wetland · Permitting · Assessments · Planning";

const lead =
  "From jurisdictional delineation to federal and state permitting, we deliver defensible science and documented outcomes for developers, public agencies, and land stewards — from first survey to final compliance.";

interface HeroSectionProps {
  /**
   * Resolved `site_settings` identity (docs/TASKS.md Task 9.1): the
   * headline tagline and the CTA pair come from the CMS row when
   * provided; omitted → static defaults.
   */
  identity?: PublicIdentity;
}

/**
 * Immersive editorial hero (docs/DESIGN_SYSTEM.md).
 *
 * Deep Forest Green surface with Warm Ivory type, an editorial
 * `text-display-xl` headline, eyebrow tag, and prominent dual CTAs
 * (primary `/contact`, secondary `/services` — labels and targets from
 * the CMS `cta_settings` identity with static fallbacks). Content enters
 * with the shared `FadeIn` / `SlideUp` wrappers, which render static
 * markup for users who prefer reduced motion.
 *
 * Server component: the animation wrappers are client components that
 * receive server-rendered children.
 */
export function HeroSection({ identity }: HeroSectionProps) {
  const site = identity ?? resolvePublicIdentity(null);

  return (
    <section
      aria-labelledby="hero-heading"
      className="bg-brand-forest text-brand-ivory relative flex min-h-[calc(100svh_-_4rem)] items-center overflow-hidden"
    >
      {/* Subtle sage highlight — purely decorative. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(167,187,163,0.16),transparent_60%)]"
      />

      <div className="container-editorial relative py-24 md:py-32">
        <FadeIn>
          <p className="text-brand-sage text-eyebrow">{eyebrow}</p>
        </FadeIn>

        <SlideUp delay={0.05}>
          <h1
            id="hero-heading"
            className="text-display-xl mt-6 max-w-4xl text-balance"
          >
            {site.tagline}
          </h1>
        </SlideUp>

        <SlideUp delay={0.1}>
          <p className="text-brand-sage mt-6 max-w-2xl text-lg leading-relaxed">
            {lead}
          </p>
        </SlideUp>

        <SlideUp delay={0.15}>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              href={site.primaryCta.href}
              className={buttonVariants({
                variant: "default",
                size: "lg",
                className:
                  "bg-brand-ivory text-brand-forest hover:bg-brand-ivory/85 h-12 px-7 text-base",
              })}
            >
              {site.primaryCta.label}
            </Link>
            <Link
              href={site.secondaryCta.href}
              className={buttonVariants({
                variant: "ghost",
                size: "lg",
                className:
                  "border-brand-sage text-brand-ivory hover:bg-brand-ivory/10 hover:text-brand-ivory h-12 px-7 text-base",
              })}
            >
              {site.secondaryCta.label}
            </Link>
          </div>
        </SlideUp>
      </div>
    </section>
  );
}
