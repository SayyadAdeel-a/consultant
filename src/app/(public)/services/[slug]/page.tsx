import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft, Check } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { FadeIn } from "@/components/animations";
import { ConsultationCta } from "@/components/sections";
import {
  hasPricingNote,
  services,
  serviceList,
  type ServiceDetail,
} from "@/config/services";
import { resolvePublicIdentity } from "@/lib/data/identity";
import {
  getPublishedService,
  getPublishedServices,
  getSiteSettings,
  hydrateServiceDetail,
} from "@/lib/data/public";
import { createPageMetadata } from "@/lib/seo";

interface ServicePageProps {
  params: Promise<{ slug: string }>;
}

/**
 * Prerender published service slugs at build time. Task 9.1: the slugs
 * come from `public.services` when Supabase is configured (published
 * rows only), falling back to the static catalog in demo mode. Unknown
 * slugs still route through the page at request time (default
 * `dynamicParams`) and are rejected with `notFound()` below.
 */
export async function generateStaticParams() {
  const read = await getPublishedServices();
  const rows = read.data ?? [];
  if (rows.length > 0) {
    return rows.map((service) => ({ slug: service.slug }));
  }
  return serviceList.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({
  params,
}: ServicePageProps): Promise<Metadata> {
  const { slug } = await params;
  const read = await getPublishedService(slug);
  const fallback = services[slug];
  // CMS rows win when configured (`meta_title`/`meta_description` first);
  // unconfigured → static config. Unknown slugs still resolve metadata
  // (the page itself 404s below); fall back to catalog-level copy rather
  // than leaking the raw slug.
  const cms = read.available ? read.data : undefined;
  const title = cms
    ? (cms.metaTitle ?? cms.title)
    : (fallback?.title ?? "Services");
  const description = cms
    ? (cms.metaDescription ?? cms.summary)
    : (fallback?.summary ??
      "Environmental consulting services — wetland delineation, permitting, ASTM site assessments, and ecological planning.");

  return createPageMetadata({
    title,
    description,
    path: `/services/${slug}`,
  });
}

/**
 * Dynamic service detail template (docs/TASKS.md Task 4.1, hydrated in
 * Task 9.1).
 *
 * Next.js 16: `params` is a Promise and must be awaited. Renders an
 * editorial deep dive — problem context, regulatory framework badges,
 * deliverables checklist, methodology milestones — and honours the CMS
 * Pricing Rule: the optional `pricingNote` renders only through
 * `hasPricingNote()`, so null/empty values are completely hidden.
 *
 * Data source (Task 9.1):
 * - Supabase configured → the published `public.services` row is the
 *   authority; a slug without a published row is `notFound()` (an
 *   unpublished service can never be resurrected from static config).
 * - Supabase unavailable (demo mode / query failure) → static config.
 * - The closing banner resolves contact channels from `site_settings`.
 */
export default async function ServicePage({ params }: ServicePageProps) {
  const { slug } = await params;
  const [serviceRead, settingsRead] = await Promise.all([
    getPublishedService(slug),
    getSiteSettings(),
  ]);
  const staticService = services[slug];

  let service: ServiceDetail;
  if (serviceRead.available) {
    if (!serviceRead.data) {
      notFound();
    }
    service = hydrateServiceDetail(serviceRead.data);
  } else if (staticService) {
    service = staticService;
  } else {
    notFound();
  }

  const identity = resolvePublicIdentity(settingsRead.data);

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

      <ConsultationCta identity={identity} />
    </>
  );
}
