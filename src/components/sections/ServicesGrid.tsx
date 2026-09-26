import Link from "next/link";
import { ArrowRight, FileCheck, Search, Sprout, Waves } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { FadeIn, SlideUp } from "@/components/animations";

interface ServiceCard {
  slug: string;
  title: string;
  description: string;
  icon: LucideIcon;
}

/**
 * Core service families. Slugs mirror the catalog data in
 * `src/config/services.ts` — keep both in sync until the CMS services
 * table (Phase 6/7) becomes the source of truth.
 */
const services: ServiceCard[] = [
  {
    slug: "wetland-delineation",
    title: "Wetland Delineation",
    description:
      "Field surveys, jurisdictional delineation, and reporting that hold up under agency review.",
    icon: Waves,
  },
  {
    slug: "environmental-permitting",
    title: "Environmental Permitting",
    description:
      "Permit strategy, applications, and agency coordination across federal, state, and local approvals.",
    icon: FileCheck,
  },
  {
    slug: "environmental-assessments",
    title: "Phase I/II ESAs",
    description:
      "Phase I and Phase II environmental site assessments with clear risk characterization for lenders and buyers.",
    icon: Search,
  },
  {
    slug: "environmental-planning",
    title: "Ecological Planning",
    description:
      "Habitat assessments, avoidance and minimization strategies, and land-use planning grounded in field science.",
    icon: Sprout,
  },
];

/**
 * Core services grid (docs/DESIGN_SYSTEM.md §5).
 *
 * White cards on a subtle muted surface: crisp 1px borders that turn Sage
 * on hover (`transition-all duration-300`), Forest Green icon tiles, and
 * whole-card links to `/services/[slug]`. Reveal is staggered through the
 * shared `SlideUp` wrapper (static markup under reduced motion).
 *
 * Server component: only the animation wrappers cross the client boundary.
 */
export function ServicesGrid() {
  return (
    <section
      aria-labelledby="services-heading"
      className="border-border bg-muted border-b"
    >
      <div className="container-editorial py-16 md:py-20 lg:py-24">
        <FadeIn>
          <p className="text-muted-foreground text-eyebrow">Core services</p>
          <h2 id="services-heading" className="text-display-lg mt-3 max-w-2xl">
            Four disciplines, one defensible record
          </h2>
          <p className="text-muted-foreground mt-5 max-w-2xl text-lg">
            Every engagement pairs field science with regulatory fluency — from
            first survey through final compliance sign-off.
          </p>
        </FadeIn>

        <ul className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:mt-12">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <li key={service.slug}>
                <SlideUp className="h-full" delay={index * 0.06}>
                  <Link
                    href={`/services/${service.slug}`}
                    className="border-border bg-card hover:border-brand-sage group block h-full rounded-xl border p-7 transition-all duration-300"
                  >
                    <span className="bg-brand-forest/10 text-brand-forest group-hover:bg-brand-forest group-hover:text-brand-ivory flex size-11 items-center justify-center rounded-lg transition-colors">
                      <Icon className="size-5" aria-hidden="true" />
                    </span>
                    <h3 className="font-heading mt-5 text-xl font-semibold">
                      {service.title}
                    </h3>
                    <p className="text-muted-foreground mt-2 text-sm">
                      {service.description}
                    </p>
                    <span className="text-brand-forest mt-5 inline-flex items-center gap-1.5 text-sm font-medium transition-transform group-hover:translate-x-1">
                      Learn more
                      <ArrowRight className="size-4" aria-hidden="true" />
                    </span>
                  </Link>
                </SlideUp>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
