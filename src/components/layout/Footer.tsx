import Link from "next/link";
import { BadgeCheck, Clock, Leaf, Mail, MapPin, Phone } from "lucide-react";
import { siteConfig } from "@/config/site";

/**
 * Demo credentials and contact details.
 *
 * These are static illustrative placeholders for the template; live
 * identity is managed through the CMS `site_settings` table once the
 * admin console (Phase 6/7) is wired up. The mandatory disclaimer at the
 * bottom of the footer clarifies their demonstration nature.
 */
const credentials = [
  "Professional Wetland Scientist (PWS) — Society of Wetland Scientists",
  "Certified Environmental Professional (CEP) — NREP",
  "ISO 14001:2015 Environmental Management Systems",
  "ISO 9001:2015 Quality Management Systems",
];

const contact = {
  addressLines: ["14 Marshview Lane, Suite 300", "Portland, Maine 04101"],
  email: "inquiries@integravity.example",
  phone: "(207) 555-0148",
  phoneHref: "tel:+12075550148",
  hours: "Monday – Friday, 8:00 AM – 5:00 PM ET",
};

/**
 * Public site footer.
 *
 * Server component (no interactivity). Dark Charcoal surface with the
 * inverted brand mark, environmental credentials, office contact details,
 * footer navigation, copyright, and the mandatory illustrative-content
 * disclaimer.
 */
export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-brand-charcoal text-brand-ivory">
      <div className="container-editorial grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1.2fr]">
        <div>
          <Link
            href="/"
            aria-label={`${siteConfig.name} — home`}
            className="focus-visible:outline-ring inline-flex items-center gap-2.5 rounded-md focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            <span className="bg-brand-sage text-brand-charcoal flex size-9 items-center justify-center rounded-lg">
              <Leaf className="size-5" aria-hidden="true" />
            </span>
            <span className="font-heading text-xl font-semibold tracking-tight">
              {siteConfig.name}
            </span>
          </Link>
          <p className="text-brand-sage mt-4 max-w-sm text-sm leading-relaxed">
            {siteConfig.tagline}. Wetland delineation, environmental permitting,
            assessments, and land-use planning for coastal and terrestrial
            ecosystems.
          </p>
          <ul className="mt-6 space-y-2.5">
            {credentials.map((credential) => (
              <li
                key={credential}
                className="text-brand-sage flex items-start gap-2.5 text-sm"
              >
                <BadgeCheck
                  className="text-brand-sage mt-0.5 size-4 shrink-0"
                  aria-hidden="true"
                />
                <span>{credential}</span>
              </li>
            ))}
          </ul>
        </div>

        <nav aria-label="Footer">
          <h2 className="text-eyebrow text-brand-sage">Explore</h2>
          <ul className="mt-4 space-y-2.5">
            {siteConfig.navigation.public.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-brand-ivory/90 hover:text-brand-ivory focus-visible:outline-ring rounded-sm text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="text-eyebrow text-brand-sage">Contact</h2>
          <address className="mt-4 text-sm not-italic">
            <ul className="text-brand-sage space-y-3">
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                <span>
                  {contact.addressLines.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </span>
              </li>
              <li>
                <a
                  href={`mailto:${contact.email}`}
                  className="hover:text-brand-ivory focus-visible:outline-ring flex items-center gap-2.5 rounded-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
                >
                  <Mail className="size-4 shrink-0" aria-hidden="true" />
                  {contact.email}
                </a>
              </li>
              <li>
                <a
                  href={contact.phoneHref}
                  className="hover:text-brand-ivory focus-visible:outline-ring flex items-center gap-2.5 rounded-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
                >
                  <Phone className="size-4 shrink-0" aria-hidden="true" />
                  {contact.phone}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Clock className="size-4 shrink-0" aria-hidden="true" />
                {contact.hours}
              </li>
            </ul>
          </address>
        </div>
      </div>

      <div className="border-brand-ivory/10 border-t">
        <div className="container-editorial text-brand-sage flex flex-col gap-4 py-6 text-sm md:flex-row md:items-center md:justify-between">
          <p>
            © {year} {siteConfig.name}. All rights reserved.
          </p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {siteConfig.navigation.footerLegal.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="hover:text-brand-ivory focus-visible:outline-ring rounded-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="container-editorial pb-8">
          <p className="text-brand-sage/70 max-w-3xl text-xs leading-relaxed">
            All illustrative statistics, certifications, and case studies shown
            are demonstrations.
          </p>
        </div>
      </div>
    </footer>
  );
}
