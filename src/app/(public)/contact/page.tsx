import React, { Suspense } from "react";
import { Navbar } from "@/components/ecolia/Navbar";
import { Footer } from "@/components/ecolia/Footer";
import { EcoliaAnimations } from "@/components/ecolia/Animations";
import { ContactForm } from "@/components/forms";
import { resolvePublicIdentity, STATIC_CONTACT } from "@/lib/data/identity";
import { getSiteSettings } from "@/lib/data/public";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Contact",
  description:
    "Start a conversation with Alderline Environmental — wetland delineation, permitting, environmental assessments, and ecological planning inquiries are answered by a senior consultant within one business day.",
  path: "/contact",
});

const expectSteps = [
  {
    title: "Submit",
    body: "Your inquiry goes directly into our confidential intake queue — never listed publicly, readable only by project administrators.",
  },
  {
    title: "Review",
    body: "A senior environmental consultant reviews your site constraints, permitting body, and project timeline within one business day.",
  },
  {
    title: "Response",
    body: "We reply with scoping recommendations, preliminary regulatory checklists, or a proposed project kickoff call.",
  },
];

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
    <div className="min-h-screen bg-[#f6f2eb] text-[#15190d] flex flex-col font-sans selection:bg-[#15190d] selection:text-[#f6f2eb]">
      <EcoliaAnimations />
      <Navbar />

      <main className="flex-grow">
        <section className="breadcrumb-section contact-secton py-16 md:py-24">
          <div className="w-layout-blockcontainer container w-container">
            <div className="contact-content-wrap">
              <div className="contact-title-with-form">
                <div className="contact-title-wrap mb-10">
                  <h1 className="section-title contact-title title-anim text-4xl md:text-6xl font-bold tracking-tight">
                    Start A Conversation About Your Project
                  </h1>
                  <p className="text-muted-text mt-4 max-w-2xl text-lg fade-anim">
                    Tell us about your site, your timeline, and the environmental approvals you are pursuing. Every inquiry is reviewed directly by a technical specialist.
                  </p>
                </div>

                <div className="contact-form-wrap w-form border border-[#cac7c1] rounded-2xl p-6 md:p-8 bg-[#f6f2eb]">
                  <Suspense
                    fallback={
                      <div
                        aria-hidden="true"
                        className="border border-[#cac7c1] bg-[#dfe0d4]/30 h-[32rem] rounded-xl animate-pulse"
                      />
                    }
                  >
                    <ContactForm />
                  </Suspense>
                </div>
              </div>

              {/* S30: Office Contact Information & What to Expect */}
              <div className="contact-address-inner box-visible space-y-8 mt-10 lg:mt-0">
                <div className="visible-item border border-[#cac7c1] rounded-2xl p-6 bg-[#f6f2eb]">
                  <h2 className="text-xl font-semibold mb-4 text-[#15190d]">Office</h2>
                  <address className="not-italic space-y-3 text-sm text-[#81837d]">
                    <div className="space-y-0.5">
                      {office.addressLines.map((line) => (
                        <div key={line} className="text-[#15190d] font-medium">
                          {line}
                        </div>
                      ))}
                    </div>
                    <div>
                      <span className="block text-xs uppercase tracking-wider text-[#81837d] font-semibold mb-0.5">Direct Inquiry Line</span>
                      <a
                        href={office.phoneHref}
                        className="text-[#15190d] font-semibold hover:underline"
                      >
                        {office.phone}
                      </a>
                    </div>
                    <div>
                      <span className="block text-xs uppercase tracking-wider text-[#81837d] font-semibold mb-0.5">Project Inbox</span>
                      <a
                        href={`mailto:${office.email}`}
                        className="text-[#15190d] font-semibold hover:underline"
                      >
                        {office.email}
                      </a>
                    </div>
                    <div className="pt-1 text-xs text-[#81837d]">
                      {office.hours}
                    </div>
                  </address>
                </div>

                <div className="visible-item border border-[#cac7c1] rounded-2xl p-6 bg-[#f6f2eb]">
                  <h2 className="text-xl font-semibold mb-4 text-[#15190d]">
                    What to expect
                  </h2>
                  <ol className="space-y-4">
                    {expectSteps.map((step, index) => (
                      <li
                        key={step.title}
                        className="border-t border-[#cac7c1] pt-3 first:border-0 first:pt-0"
                      >
                        <div className="flex items-baseline gap-2 mb-1">
                          <span className="text-xs font-mono font-bold text-[#81837d]">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                          <h3 className="text-sm font-semibold text-[#15190d]">
                            {step.title}
                          </h3>
                        </div>
                        <p className="text-xs text-[#81837d] leading-relaxed pl-6">
                          {step.body}
                        </p>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
