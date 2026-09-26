import Link from "next/link";
import { Mail, Phone } from "lucide-react";
import { FadeIn } from "@/components/animations";
import { buttonVariants } from "@/components/ui/button";

/**
 * Demo contact channels — mirrors the values in
 * `src/components/layout/Footer.tsx` until the CMS `site_settings` table
 * (Phase 6/7) becomes the source of truth for client-editable identity.
 */
const contact = {
  email: "inquiries@integravity.example",
  phone: "(207) 555-0148",
  phoneHref: "tel:+12075550148",
};

/**
 * Closing consultation banner (docs/TASKS.md Task 3.4).
 *
 * High-contrast Forest Green finale to the homepage narrative: editorial
 * headline, primary ivory CTA to `/contact`, and direct phone / email
 * channels. Server component; reveal runs through the shared `FadeIn`
 * wrapper.
 */
export function ConsultationCta() {
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
              href="/contact"
              className={buttonVariants({
                variant: "default",
                size: "lg",
                className:
                  "bg-brand-ivory text-brand-forest hover:bg-brand-ivory/85 h-12 px-7 text-base",
              })}
            >
              Request a Consultation
            </Link>

            <a
              href={contact.phoneHref}
              className={buttonVariants({
                variant: "outline",
                size: "lg",
                className:
                  "border-brand-ivory/30 text-brand-ivory hover:border-brand-ivory/60 hover:bg-brand-ivory/10 hover:text-brand-ivory h-12 gap-2.5 bg-transparent px-6 text-base",
              })}
            >
              <Phone aria-hidden="true" />
              {contact.phone}
            </a>

            <a
              href={`mailto:${contact.email}`}
              className={buttonVariants({
                variant: "outline",
                size: "lg",
                className:
                  "border-brand-ivory/30 text-brand-ivory hover:border-brand-ivory/60 hover:bg-brand-ivory/10 hover:text-brand-ivory h-12 gap-2.5 bg-transparent px-6 text-base",
              })}
            >
              <Mail aria-hidden="true" />
              {contact.email}
            </a>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
