import Link from "next/link";
import { Mail, Phone } from "lucide-react";
import { FadeIn } from "@/components/animations";
import { buttonVariants } from "@/components/ui/button";
import {
  resolvePublicIdentity,
  type PublicIdentity,
} from "@/lib/data/identity";

interface ConsultationCtaProps {
  /**
   * Resolved `site_settings` identity (docs/TASKS.md Task 9.1): phone,
   * email, and the primary CTA come from the CMS row when provided;
   * omitted → the static demo contact channels.
   */
  identity?: PublicIdentity;
}

/**
 * Closing consultation banner (docs/TASKS.md Task 3.4).
 *
 * High-contrast Forest Green finale to the homepage narrative: editorial
 * headline, primary ivory CTA to `/contact`, and direct phone / email
 * channels — all resolved from the CMS identity with static fallbacks.
 * Server component; reveal runs through the shared `FadeIn` wrapper.
 */
export function ConsultationCta({ identity }: ConsultationCtaProps) {
  const site = identity ?? resolvePublicIdentity(null);

  return (
    <section
      aria-labelledby="consultation-heading"
      className="bg-brand-forest text-brand-ivory"
    >
      <div className="container-editorial py-16 md:py-20 lg:py-24">
        <FadeIn>
          <p className="text-brand-sage text-eyebrow">Start a conversation</p>
          <h2
            id="consultation-heading"
            className="text-display-lg mt-3 max-w-3xl text-balance"
          >
            Tell us about your site
          </h2>
          <p className="text-brand-sage mt-5 max-w-2xl text-lg">
            Send a confidential inquiry or call the Portland office directly — a
            principal responds within one business day.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
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

            <a
              href={site.phoneHref}
              className={buttonVariants({
                variant: "outline",
                size: "lg",
                className:
                  "border-brand-ivory/30 text-brand-ivory hover:border-brand-ivory/60 hover:bg-brand-ivory/10 hover:text-brand-ivory h-12 gap-2.5 bg-transparent px-6 text-base",
              })}
            >
              <Phone aria-hidden="true" />
              {site.phone}
            </a>

            <a
              href={`mailto:${site.email}`}
              className={buttonVariants({
                variant: "outline",
                size: "lg",
                className:
                  "border-brand-ivory/30 text-brand-ivory hover:border-brand-ivory/60 hover:bg-brand-ivory/10 hover:text-brand-ivory h-12 gap-2.5 bg-transparent px-6 text-base",
              })}
            >
              <Mail aria-hidden="true" />
              {site.email}
            </a>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
