"use client";

import React from "react";
import Image from "next/image";
import { Navbar } from "@/components/ecolia/Navbar";
import { Footer } from "@/components/ecolia/Footer";
import { FaqSection } from "@/components/ecolia/FaqSection";
import { EcoliaAnimations } from "@/components/ecolia/Animations";

const teamRoles = [
  {
    role: "Principal Ecologist",
    discipline: "Wetland Science & Ecological Review",
    image: "/assets/alderline/team/member-1.jpg",
  },
  {
    role: "Environmental Planner",
    discipline: "NEPA & Planning Analysis",
    image: "/assets/alderline/team/member-2.jpg",
  },
  {
    role: "Water Resources Specialist",
    discipline: "Hydrology & Watershed Assessment",
    image: "/assets/alderline/team/member-3.jpg",
  },
  {
    role: "Permitting Coordinator",
    discipline: "Regulatory Strategy & Documentation",
    image: "/assets/alderline/team/member-4.jpg",
  },
  {
    role: "Site Assessment Lead",
    discipline: "Phase I/II ESA & Due Diligence",
    image: "/assets/alderline/team/member-5.jpg",
  },
];

const capabilitySectors = [
  { name: "Environmental Assessment", mark: "/assets/alderline/brand/sector-mark-1.jpg" },
  { name: "Wetland Science", mark: "/assets/alderline/brand/sector-mark-2.jpg" },
  { name: "Water Resources", mark: "/assets/alderline/brand/sector-mark-3.jpg" },
  { name: "Project Planning", mark: "/assets/alderline/brand/sector-mark-4.jpg" },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#f6f2eb] text-[#15190d] flex flex-col font-sans selection:bg-[#15190d] selection:text-[#f6f2eb]">
      <EcoliaAnimations />
      <Navbar />

      <main className="flex-grow">
        {/* S10 & S11: About Hero & Mission Statement */}
        <section className="breadcrumb-section">
          <div className="w-layout-blockcontainer container w-container">
            <div className="about-hero-content-wrap">
              <div className="about-hero-title-wrap">
                <h1 className="breadcrumb-tiitle title-anim">
                  Environmental Thinking Built Around Real Project Conditions
                </h1>
              </div>
              <div className="about-hero-middle-content-wrap">
                <div className="about-hero-name fade-anim">
                  <div className="text-regular uppercase tracking-widest text-xs font-semibold text-[#81837d]">
                    ABOUT ALDERLINE
                  </div>
                </div>
                <div className="about-hero-middle-title-wrap">
                  <h2 className="about-hero-middle-title title-anim">
                    We combine environmental understanding, practical communication, and project awareness to help teams navigate complex sites with greater clarity.
                  </h2>
                </div>
                <div className="about-hero-middle-para-wrap">
                  <p className="text-regular about-hero-middle-para fade-anim text-[#81837d]">
                    Alderline Environmental is a demonstration consultancy created to show how a modern environmental firm can present its services, thinking, and expertise with clarity and confidence.
                  </p>
                </div>
              </div>

              {/* S12: 4-Image Staggered Gallery Grid */}
              <div className="about-hero-gallery-wrap">
                <div className="about-hero-gallery">
                  {/* Column 1 */}
                  <div
                    className="about-hero-gallery-banner-inner"
                    data-gallery-col="0"
                  >
                    <div className="about-hero-gallery-banner-wrap">
                      <Image
                        loading="lazy"
                        src="/assets/alderline/about/gallery-1.jpg"
                        alt="Environmental survey site inspection"
                        width={800}
                        height={600}
                        className="about-hero-gallery-banner transition-transform duration-500 hover:scale-105"
                      />
                    </div>
                    <div className="about-hero-gallery-banner-wrap">
                      <Image
                        loading="lazy"
                        src="/assets/alderline/about/gallery-2.jpg"
                        alt="Wetland boundary field analysis"
                        width={800}
                        height={600}
                        className="about-hero-gallery-banner transition-transform duration-500 hover:scale-105"
                      />
                    </div>
                  </div>

                  {/* Column 2 */}
                  <div
                    className="about-hero-gallery-banner-inner"
                    data-gallery-col="1"
                  >
                    <div className="about-hero-gallery-banner-wrap">
                      <Image
                        loading="lazy"
                        src="/assets/alderline/about/gallery-3.jpg"
                        alt="Riparian restoration site overview"
                        width={800}
                        height={600}
                        className="about-hero-gallery-banner transition-transform duration-500 hover:scale-105"
                      />
                    </div>
                    <div className="about-hero-gallery-banner-wrap">
                      <Image
                        loading="lazy"
                        src="/assets/alderline/about/gallery-4.jpg"
                        alt="Watershed habitat field documentation"
                        width={800}
                        height={600}
                        className="about-hero-gallery-banner transition-transform duration-500 hover:scale-105"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* S13: Story and Sector Marquee */}
        <section className="about-story-section">
          <div className="w-layout-blockcontainer container w-container">
            <div className="about-story-content-wrap">
              <div className="about-story-title-with-para">
                <div className="about-story-title-wrap">
                  <h2 className="about-story-title title-anim">
                    A Clearer Environmental Process Helps Projects Move Forward With Less Friction
                  </h2>
                </div>
                <div className="about-story-para-wrap">
                  <p className="text-regular about-story-para fade-anim text-[#81837d]">
                    Whether supporting early due diligence, field documentation, or broader environmental planning, our approach emphasizes helping teams understand site realities and respond with practical next steps.
                  </p>
                </div>
              </div>

              {/* Continuous Infinite CSS Marquee with Sector Marks */}
              <div className="about-story-marquee-wrap overflow-hidden py-8">
                <div className="about-story-marquee-track flex items-center gap-12">
                  {[...capabilitySectors, ...capabilitySectors].map((sector, idx) => (
                    <div key={idx} className="flex items-center gap-4 flex-shrink-0 opacity-80 hover:opacity-100 transition-opacity">
                      <Image
                        src={sector.mark}
                        alt={sector.name}
                        width={40}
                        height={40}
                        className="w-10 h-10 object-contain rounded-lg"
                        style={{ mixBlendMode: "multiply" }}
                      />
                      <span className="text-sm font-semibold tracking-wider uppercase text-[#15190d]">
                        {sector.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* S14: Multidisciplinary Team Section */}
        <section className="about-team-section">
          <div className="w-layout-blockcontainer container w-container">
            <div className="about-team-content-wrap">
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
                <div>
                  <div className="text-xs uppercase tracking-widest text-[#81837d] font-semibold mb-2">
                    ILLUSTRATIVE TEAM PROFILES
                  </div>
                  <h2 className="section-title title-anim text-3xl md:text-5xl font-semibold">
                    A Multidisciplinary Perspective
                  </h2>
                </div>
                <p className="text-sm text-[#81837d] max-w-md">
                  Demonstration profiles representing the core technical disciplines involved in environmental review, planning, and compliance.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {teamRoles.slice(0, 3).map((member, idx) => (
                  <div key={idx} className="about-team-card fade-anim group">
                    <div className="overflow-hidden rounded-2xl mb-4 border border-[#cac7c1] bg-[#15190d]">
                      <Image
                        src={member.image}
                        alt={member.role}
                        width={600}
                        height={750}
                        className="w-full aspect-[4/5] object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <h3 className="font-semibold text-lg text-[#15190d]">{member.role}</h3>
                    <p className="text-sm text-[#81837d]">{member.discipline}</p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-8 max-w-4xl mx-auto">
                {teamRoles.slice(3, 5).map((member, idx) => (
                  <div key={idx} className="about-team-card fade-anim group">
                    <div className="overflow-hidden rounded-2xl mb-4 border border-[#cac7c1] bg-[#15190d]">
                      <Image
                        src={member.image}
                        alt={member.role}
                        width={600}
                        height={750}
                        className="w-full aspect-[4/5] object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <h3 className="font-semibold text-lg text-[#15190d]">{member.role}</h3>
                    <p className="text-sm text-[#81837d]">{member.discipline}</p>
                  </div>
                ))}
              </div>

              {/* S15: Qualitative Metric Statements */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 pt-16 border-t border-[#cac7c1]">
                <div className="p-8 rounded-2xl border border-[#cac7c1] bg-[#f6f2eb] fade-anim">
                  <div className="text-xs uppercase tracking-widest text-[#81837d] font-bold mb-2">PRACTICE FOCUS</div>
                  <h3 className="text-2xl font-bold text-[#15190d] mb-2">FIELD-AWARE</h3>
                  <p className="text-sm text-[#81837d]">
                    Work informed by on-site realities, micro-topography, and genuine environmental context.
                  </p>
                </div>
                <div className="p-8 rounded-2xl border border-[#cac7c1] bg-[#f6f2eb] fade-anim">
                  <div className="text-xs uppercase tracking-widest text-[#81837d] font-bold mb-2">EXECUTION STANDARD</div>
                  <h3 className="text-2xl font-bold text-[#15190d] mb-2">PROCESS-DRIVEN</h3>
                  <p className="text-sm text-[#81837d]">
                    Structured documentation and clear communication throughout regulatory review stages.
                  </p>
                </div>
                <div className="p-8 rounded-2xl border border-[#cac7c1] bg-[#f6f2eb] fade-anim">
                  <div className="text-xs uppercase tracking-widest text-[#81837d] font-bold mb-2">DELIVERY ALIGNMENT</div>
                  <h3 className="text-2xl font-bold text-[#15190d] mb-2">PROJECT-ORIENTED</h3>
                  <p className="text-sm text-[#81837d]">
                    Environmental support aligned directly with development milestones, planning schedules, and permitting needs.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* S16: Guiding Principles & Video Showcase */}
        <section className="about-visionary-section py-20">
          <div className="w-layout-blockcontainer container w-container">
            <div className="about-visionary-content-wrap">
              <div className="text-center max-w-3xl mx-auto mb-16">
                <h2 className="section-title title-anim text-3xl md:text-5xl font-semibold mb-6">
                  Our Approach Centers On Clarity, Practicality, And Environmental Responsibility
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                <div className="p-8 rounded-2xl border border-[#cac7c1] bg-[#f6f2eb] fade-anim">
                  <div className="w-12 h-12 rounded-xl bg-[#dfe0d4] flex items-center justify-center mb-6 overflow-hidden">
                    <Image
                      src="/assets/alderline/icons/fieldwork.jpg"
                      alt="Field understanding icon"
                      width={32}
                      height={32}
                      className="w-8 h-8 object-contain"
                      style={{ mixBlendMode: "multiply" }}
                    />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Defensible Field Understanding</h3>
                  <p className="text-sm text-[#81837d] leading-relaxed">
                    Strong environmental work begins with careful observation, appropriate documentation, and a clear understanding of site conditions.
                  </p>
                </div>

                <div className="p-8 rounded-2xl border border-[#cac7c1] bg-[#f6f2eb] fade-anim">
                  <div className="w-12 h-12 rounded-xl bg-[#dfe0d4] flex items-center justify-center mb-6 overflow-hidden">
                    <Image
                      src="/assets/alderline/icons/collaboration.jpg"
                      alt="Project coordination icon"
                      width={32}
                      height={32}
                      className="w-8 h-8 object-contain"
                      style={{ mixBlendMode: "multiply" }}
                    />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Coordinated Project Support</h3>
                  <p className="text-sm text-[#81837d] leading-relaxed">
                    Environmental work is most effective when it connects clearly with planners, engineers, and project stakeholders.
                  </p>
                </div>

                <div className="p-8 rounded-2xl border border-[#cac7c1] bg-[#f6f2eb] fade-anim">
                  <div className="w-12 h-12 rounded-xl bg-[#dfe0d4] flex items-center justify-center mb-6 overflow-hidden">
                    <Image
                      src="/assets/alderline/icons/resilience.jpg"
                      alt="Environmental thinking icon"
                      width={32}
                      height={32}
                      className="w-8 h-8 object-contain"
                      style={{ mixBlendMode: "multiply" }}
                    />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Long-Term Environmental Thinking</h3>
                  <p className="text-sm text-[#81837d] leading-relaxed">
                    Responsible environmental decisions should support today&apos;s project needs without losing sight of broader ecological outcomes.
                  </p>
                </div>
              </div>

              {/* Ambient Fieldwork Looping Video Showcase */}
              <div className="about-visionary-video-wrap rounded-2xl overflow-hidden border border-[#cac7c1] shadow-lg max-h-[500px]">
                <div className="w-background-video w-background-video-atom relative w-full h-[400px] md:h-[500px]">
                  <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    poster="/assets/alderline/videos/about-poster.jpg"
                    style={{
                      backgroundImage: 'url("/assets/alderline/videos/about-poster.jpg")',
                      objectFit: "cover",
                      width: "100%",
                      height: "100%",
                    }}
                  >
                    <source
                      src="/assets/alderline/videos/about-ambient.mp4"
                      type="video/mp4"
                    />
                  </video>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* S17: Reused FAQ Section */}
        <FaqSection />
      </main>

      <Footer />
    </div>
  );
}
