import { Suspense } from "react";
import { ContactForm } from "@/components/forms";
import { resolvePublicIdentity, STATIC_CONTACT } from "@/lib/data/identity";
import { getSiteSettings } from "@/lib/data/public";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Contact",
  description:
    "Request a consultation with IntegraVity — wetland delineation, permitting, environmental assessments, and ecological planning inquiries are answered by a consultant within one business day.",
  path: "/contact",
});

/**
 * Office details resolve from the CMS `site_settings` row through the
 * shared identity view-model (Task 10.1), so the address, email, and
 * phone stay in lockstep with `/admin/settings`, the site header, and
 * the footer. Opening hours have no `site_settings` column and keep the
 * static default from `STATIC_CONTACT`.
 */
const expectSteps = [
  {
    title: "Submit",
    body: "Your inquiry goes straight into our confidential intake queue — never listed publicly, readable only by administrators.",
  },
  {
    title: "Review",
    body: "A consultant reviews your scope, permitting body, and timeline within one business day.",
  },
  {
    title: "Response",
    body: "We reply by email with scoping questions, recommended next steps, or a proposed call time.",
  },
];

/**
 * Contact page (docs/TASKS.md Task 5.1, identity-bound in Task 10.1).
 * Editorial two-column layout: office details and a "What to expect"
 * timeline on the left, the client `<ContactForm />` (server action +
 * honeypot intake) on the right inside a `Suspense` boundary — required
 * because the form reads `useSearchParams` for `?service=` pre-selection
 * during static prerendering.
 *
 * Office details read the CMS `site_settings` row through
 * `resolvePublicIdentity()`, so they stay in lockstep with the header,
 * footer, and `/admin/settings`; demo mode falls back to the static
 * defaults byte-identical to the previous hard-coded copy.
 */
export default async function ContactPage() {
  const settingsRead = await getSiteSettings();
  const identity = resolvePublicIdentity(settingsRead.data);
  const office = {
    addressLines: identity.addressLines,
    email: identity.email,
    phone: identity.phone,
    phoneHref: identity.phoneHref,
    hours: STATIC_CONTACT.hours,
  };

  return (
    <section className="py-16 md:py-20">
      <div className="container-editorial">
        <p className="text-eyebrow text-muted-foreground">Contact</p>
        <h1 className="text-display-lg mt-3 max-w-2xl">
          Start a conversation about your project
        </h1>
        <p className="text-muted-foreground mt-5 max-w-2xl text-lg">
          Tell us about your site, your timeline, and the approval you are
          chasing. Every inquiry is read by a consultant — not a ticket queue.
        </p>

        <div className="mt-12 grid gap-10 lg:grid-cols-2 lg:gap-14">
          {/* Left column — office details + what to expect */}
          <div className="space-y-10">
            <div>
              <h2 className="font-heading text-xl font-semibold">Office</h2>
              <address className="text-muted-foreground mt-4 space-y-3 text-sm not-italic">
                <span className="block space-y-0.5">
                  {office.addressLines.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </span>
                <span className="block">
                  <a
                    href={`mailto:${office.email}`}
                    className="text-brand-forest font-medium underline-offset-4 hover:underline"
                  >
                    {office.email}
                  </a>
                </span>
                <span className="block">
                  <a
                    href={office.phoneHref}
                    className="text-brand-forest font-medium underline-offset-4 hover:underline"
                  >
                    {office.phone}
                  </a>
                </span>
                <span className="block">{office.hours}</span>
              </address>
            </div>

            <div>
              <h2 className="font-heading text-xl font-semibold">
                What to expect
              </h2>
              <ol className="mt-4">
                {expectSteps.map((step, index) => (
                  <li
                    key={step.title}
                    className="border-brand-sage border-t py-4"
                  >
                    <div className="flex items-baseline gap-3">
                      <span className="text-brand-forest text-sm font-semibold">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <h3 className="font-heading text-sm font-semibold">
                        {step.title}
                      </h3>
                    </div>
                    <p className="text-muted-foreground mt-1.5 pl-8 text-sm leading-relaxed">
                      {step.body}
                    </p>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {/* Right column — consultation request form */}
          <div>
            <Suspense
              fallback={
                <div
                  aria-hidden="true"
                  className="border-border bg-muted/40 h-[32rem] rounded-xl border"
                />
              }
            >
              <ContactForm />
            </Suspense>
          </div>
        </div>
      </div>
    </section>
  );
}
