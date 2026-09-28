import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/ecolia/Navbar";
import { Footer } from "@/components/ecolia/Footer";
import { TestimonialSection } from "@/components/ecolia/TestimonialSection";
import { EcoliaAnimations } from "@/components/ecolia/Animations";
import { serviceList } from "@/config/services";
import { resolvePublicIdentity } from "@/lib/data/identity";
import {
  getPublishedServices,
  getSiteSettings,
  hydrateServiceDetail,
} from "@/lib/data/public";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Services",
  description:
    "Environmental consulting services — wetland delineation, permitting, ASTM site assessments, and ecological planning for regulated sites.",
  path: "/services",
});

export default async function ServicesPage() {
  const settingsRead = await getSiteSettings();
  const list = serviceList;
  const identity = resolvePublicIdentity(settingsRead.data);

  return (
    <div className="min-h-screen bg-[#f6f2eb] text-[#15190d] flex flex-col font-sans selection:bg-[#15190d] selection:text-[#f6f2eb]">
      <EcoliaAnimations />
      <Navbar />

      <main className="flex-grow">
        {/* S18 & S19: Service Hero Section & Video Showcase */}
        <section className="breadcrumb-section service-hero-section">
          <div className="w-layout-blockcontainer container w-container">
            <div className="service-hero-content-wrap">
              <div className="service-hero-title-wrap">
                <h1 className="breadcrumb-tiitle service-hero-title title-anim">
                  Consulting services that move projects forward
                </h1>
              </div>
              <div className="service-hero-para-counter-with-vidio">
                <div id="w-node-f808cc2b-bef2-8229-2803-19b6f77a95b6-45ceeb8e" className="service-hero-para-with-counter">
                  <p className="text-regular service-hero-para fade-anim text-[#81837d] leading-relaxed">
                    Our services are designed to help project teams understand environmental conditions, define practical next steps, and support informed progress through planning and permitting stages.
                  </p>
                  <div className="about-team-counter-item service-breadcrumb-counter-item fade-anim p-6 rounded-2xl border border-[#cac7c1] bg-[#f6f2eb]">
                    <div className="text-xs uppercase tracking-widest text-[#81837d] font-bold mb-1">
                      DELIVERY MODEL
                    </div>
                    <div className="text-2xl font-bold text-[#15190d] mb-1">
                      INTEGRATED SUPPORT
                    </div>
                    <p className="text-sm text-[#81837d]">
                      Environmental review, field understanding, and practical project coordination.
                    </p>
                  </div>
                </div>
                <div id="w-node-_7f6c971e-65c0-7216-58ae-4481888add5e-45ceeb8e" className="service-hero-video-inner fade-anim rounded-2xl overflow-hidden border border-[#cac7c1]">
                  <div className="service-hero-video w-background-video w-background-video-atom">
                    <video
                      autoPlay
                      loop
                      muted
                      playsInline
                      poster="/assets/alderline/videos/services-poster.jpg"
                      style={{
                        backgroundImage: 'url("/assets/alderline/videos/services-poster.jpg")',
                        objectFit: "cover",
                        width: "100%",
                        height: "100%",
                      }}
                    >
                      <source
                        src="/assets/alderline/videos/services-ambient.mp4"
                        type="video/mp4"
                      />
                    </video>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* S20: Master Services Catalog */}
        <section className="services-section py-16">
          <div className="w-layout-blockcontainer container w-container">
            <div className="services-content-wrap space-y-12">
              {list.map((svc, idx) => (
                <div
                  key={svc.slug}
                  id={svc.slug}
                  className={`services-item border border-[#cac7c1] rounded-2xl p-8 bg-[#f6f2eb] hover:shadow-md transition-shadow ${
                    idx === 0 ? "services-item-first" : ""
                  } ${idx === list.length - 1 ? "services-item-last" : ""}`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-8">
                    <div className="services-item-title-with-para max-w-xl">
                      <div className="flex flex-wrap gap-2 mb-4">
                        {svc.framework.map((badge) => (
                          <span
                            key={badge}
                            className="text-xs uppercase tracking-wider font-semibold text-[#15190d] bg-[#dfe0d4] px-3 py-1 rounded-full"
                          >
                            {badge}
                          </span>
                        ))}
                      </div>
                      <h2 className="services-item-title title-anim text-2xl md:text-3xl font-semibold mb-3">
                        <Link
                          href={`/services/${svc.slug}`}
                          className="hover:text-[#303820] transition-colors"
                        >
                          {svc.title}
                        </Link>
                      </h2>
                      <p className="text-regular services-item-para fade-anim text-[#81837d] leading-relaxed mb-6">
                        {svc.summary}
                      </p>
                      <Link
                        href={`/services/${svc.slug}`}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-[#15190d] hover:underline"
                      >
                        View service &rarr;
                      </Link>
                    </div>

                    <div className="services-item-menu box-visible border-t lg:border-t-0 lg:border-l border-[#cac7c1] pt-6 lg:pt-0 lg:pl-8 min-w-[280px]">
                      <div className="text-xs uppercase tracking-widest text-[#81837d] font-bold mb-3">
                        Key Deliverables
                      </div>
                      <ul className="space-y-2">
                        {svc.deliverables.map((item, itemIdx) => (
                          <li
                            key={itemIdx}
                            className="text-sm text-[#15190d] flex items-baseline gap-2"
                          >
                            <span className="text-xs font-mono font-bold text-[#81837d]">
                              &bull;
                            </span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Closing Consultation CTA Banner */}
        <section className="consultation-banner-section py-16 bg-[#dfe0d4]/40 border-t border-b border-[#cac7c1]">
          <div className="w-layout-blockcontainer container w-container text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-semibold text-[#15190d] mb-4">
              Tell us about your site
            </h2>
            <p className="text-[#81837d] mb-8">
              Discuss permitting pathways, wetland boundaries, and regulatory schedules with our technical specialists.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href={identity.primaryCta.href}
                className="button-link-box inline-block px-8 py-3 rounded-full bg-[#15190d] text-[#f6f2eb] font-semibold hover:opacity-90 transition-opacity"
              >
                {identity.primaryCta.label}
              </Link>
              <a
                href={identity.phoneHref}
                className="text-sm font-semibold text-[#15190d] hover:underline"
              >
                {identity.phone}
              </a>
            </div>
          </div>
        </section>

        {/* S21: Reusable Approach & Credibility Section */}
        <TestimonialSection />
      </main>

      <Footer />
    </div>
  );
}
