import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { createPageMetadata } from "@/lib/seo";
import { FadeIn, SlideUp } from "@/components/animations";
import { ConsultationCta } from "@/components/sections";
import { serviceList } from "@/config/services";

export const metadata = createPageMetadata({
  title: "Services",
  description:
    "Environmental consulting services — wetland delineation, permitting, ASTM site assessments, and ecological planning for regulated sites.",
  path: "/services",
});

/**
 * Service catalog (docs/TASKS.md Task 4.1).
 *
 * Lists the four core disciplines from `src/config/services.ts` with
 * regulatory framework badges, key deliverables, and links into the
 * dynamic `/services/[slug]` template. Closes with the shared
 * consultation banner. CMS-backed service records replace this data in
 * Phase 6-7.
 *
 * Server component; reveals run through the shared animation wrappers.
 */
export default function ServicesIndexPage() {
  return (
    <>
      <section className="py-16 md:py-20">
        <div className="container-editorial">
          <FadeIn>
            <p className="text-muted-foreground text-eyebrow">Services</p>
            <h1 className="text-display-lg mt-3 max-w-2xl">
              Consulting services that move projects forward
            </h1>
            <p className="text-muted-foreground mt-5 max-w-2xl text-lg">
              Four disciplines that cover the full environmental approval path —
              from first field survey through permit issuance and
              post-construction compliance.
            </p>
          </FadeIn>

          <ul className="mt-12 grid gap-6 md:grid-cols-2">
            {serviceList.map((service, index) => (
              <li key={service.slug}>
                <SlideUp className="h-full" delay={index * 0.06}>
                  <article className="border-border bg-card flex h-full flex-col rounded-xl border p-7">
                    <ul
                      aria-label={`Regulatory framework for ${service.title}`}
                      className="flex flex-wrap gap-1.5"
                    >
                      {service.framework.map((badge) => (
                        <li
                          key={badge}
                          className="border-brand-sage text-brand-forest rounded-full border px-2.5 py-0.5 text-xs font-medium"
                        >
                          {badge}
                        </li>
                      ))}
                    </ul>

                    <h2 className="font-heading mt-5 text-xl font-semibold">
                      <Link
                        href={`/services/${service.slug}`}
                        className="hover:text-brand-forest transition-colors"
                      >
                        {service.title}
                      </Link>
                    </h2>
                    <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                      {service.summary}
                    </p>

                    <p className="text-muted-foreground text-eyebrow mt-6">
                      Key deliverables
                    </p>
                    <ul className="mt-3 space-y-2">
                      {service.deliverables.map((item) => (
                        <li
                          key={item}
                          className="text-muted-foreground flex gap-2.5 text-sm"
                        >
                          <Check
                            aria-hidden="true"
                            className="text-brand-forest mt-0.5 size-4 shrink-0"
                          />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>

                    <Link
                      href={`/services/${service.slug}`}
                      className="group hover:text-brand-forest mt-6 inline-flex items-center gap-1.5 text-sm font-medium transition-colors"
                    >
                      View service
                      <ArrowRight
                        aria-hidden="true"
                        className="size-4 transition-transform group-hover:translate-x-1"
                      />
                    </Link>
                  </article>
                </SlideUp>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <ConsultationCta />
    </>
  );
}
