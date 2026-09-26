import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft, Check } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { FadeIn } from "@/components/animations";
import { ConsultationCta } from "@/components/sections";
import { hasPricingNote, services, serviceList } from "@/config/services";
import { createPageMetadata } from "@/lib/seo";

interface ServicePageProps {
  params: Promise<{ slug: string }>;
}

/**
 * Prerender the four known service slugs at build time. Unknown slugs are
 * still routed through the page at request time (default `dynamicParams`)
 * and rejected with `notFound()` below — once the CMS `services` table
 * lands (Phase 6-7), this returns the slugs of published services and
 * `dynamicParams` can be dropped.
 */
export function generateStaticParams() {
  return serviceList.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({
  params,
}: ServicePageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = services[slug];

  // Unknown slugs still resolve metadata (the page itself 404s below);
  // fall back to catalog-level copy rather than leaking the raw slug.
  return createPageMetadata({
    title: service ? service.title : "Services",
    description: service
      ? service.summary
      : "Environmental consulting services — wetland delineation, permitting, ASTM site assessments, and ecological planning.",
    path: `/services/${slug}`,
  });
}

/**
 * Dynamic service detail template (docs/TASKS.md Task 4.1).
 *
 * Next.js 16: `params` is a Promise and must be awaited. Renders an
 * editorial deep dive — problem context, regulatory framework badges,
 * deliverables checklist, methodology milestones — and honours the CMS
 * Pricing Rule: the optional `pricingNote` renders only through
 * `hasPricingNote()`, so null/empty values are completely hidden.
 */
export default async function ServicePage({ params }: ServicePageProps) {
  const { slug } = await params;
  const service = services[slug];

  if (!service) {
    notFound();
  }

  return (
    <>
      {/* Service hero */}
      <section className="py-16 md:py-20">
        <div className="container-editorial">
          <FadeIn>
            <Link
              href="/services"
              className="text-muted-foreground hover:text-brand-forest inline-flex items-center gap-1.5 text-sm font-medium transition-colors"
            >
              <ArrowLeft aria-hidden="true" className="size-4" />
              All services
            </Link>

            <p className="text-muted-foreground text-eyebrow mt-8">Services</p>
            <h1 className="text-display-lg mt-3 max-w-3xl">{service.title}</h1>
            <p className="text-muted-foreground mt-5 max-w-3xl text-lg">
              {service.summary}
            </p>

            <ul
              aria-label="Regulatory framework"
              className="mt-6 flex flex-wrap gap-2"
            >
              {service.framework.map((badge) => (
                <li
                  key={badge}
                  className="border-brand-sage text-brand-forest rounded-full border px-3 py-1 text-xs font-medium"
                >
                  {badge}
                </li>
              ))}
            </ul>

            {/* CMS Pricing Rule: hidden entirely unless populated. */}
            {hasPricingNote(service) && (
              <div className="border-brand-sage bg-muted mt-8 max-w-3xl rounded-xl border p-5">
                <p className="text-muted-foreground text-eyebrow">
                  Pricing note
                </p>
                <p className="mt-2 text-sm leading-relaxed">
                  {service.pricingNote}
                </p>
              </div>
            )}

            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/contact"
                className={buttonVariants({
                  variant: "default",
                  size: "lg",
                  className: "h-12 px-7 text-base",
                })}
              >
                Discuss this service
              </Link>
              <Link
                href="/services"
                className={buttonVariants({
                  variant: "outline",
                  size: "lg",
                  className: "h-12 px-7 text-base",
                })}
              >
                All services
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Problem context */}
      <section className="border-border bg-muted border-y">
        <div className="container-editorial grid gap-10 py-16 md:py-20 lg:grid-cols-[1fr_1.6fr] lg:gap-16">
          <FadeIn>
            <p className="text-muted-foreground text-eyebrow">
              Problem context
            </p>
            <h2 className="text-display-md mt-3 max-w-md">
              Why this work exists
            </h2>
          </FadeIn>

          <FadeIn delay={0.08}>
            <div className="space-y-5">
              {service.problemContext.map((paragraph) => (
                <p
                  key={paragraph}
                  className="text-muted-foreground max-w-3xl leading-relaxed"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Deliverables + methodology milestones */}
      <section className="py-16 md:py-20 lg:py-24">
        <div className="container-editorial grid gap-12 lg:grid-cols-2 lg:gap-16">
          <FadeIn>
            <p className="text-muted-foreground text-eyebrow">Deliverables</p>
            <h2 className="text-display-md mt-3">What you receive</h2>
            <ul className="mt-7 space-y-3.5">
              {service.deliverables.map((item) => (
                <li key={item} className="flex gap-3">
                  <Check
                    aria-hidden="true"
                    className="text-brand-forest mt-0.5 size-4 shrink-0"
                  />
                  <span className="text-base leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </FadeIn>

          <FadeIn delay={0.08}>
            <p className="text-muted-foreground text-eyebrow">Methodology</p>
            <h2 className="text-display-md mt-3">Milestones</h2>
            <ol className="mt-7">
              {service.milestones.map((milestone, index) => (
                <li
                  key={milestone.title}
                  className="border-brand-sage border-t py-4"
                >
                  <div className="flex items-baseline gap-3">
                    <span className="text-brand-forest text-sm font-semibold">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <h3 className="font-heading text-base font-semibold">
                      {milestone.title}
                    </h3>
                  </div>
                  <p className="text-muted-foreground mt-1.5 pl-8 text-sm leading-relaxed">
                    {milestone.description}
                  </p>
                </li>
              ))}
            </ol>
          </FadeIn>
        </div>
      </section>

      <ConsultationCta />
    </>
  );
}
