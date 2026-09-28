import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/ecolia/Navbar";
import { Footer } from "@/components/ecolia/Footer";
import { EcoliaAnimations } from "@/components/ecolia/Animations";
import { demonstrationCaseStudies } from "@/config/projects";
import { getPublishedProjects, getSiteSettings } from "@/lib/data/public";
import { createPageMetadata } from "@/lib/seo";
import { ArrowRight, MapPin, Calendar } from "lucide-react";

export const metadata = createPageMetadata({
  title: "Projects & Case Studies",
  description:
    "Realized environmental consulting outcomes — coastal wetland restoration, renewable energy corridors, brownfield due diligence, and riparian bioengineering.",
  path: "/projects",
});

const PROJECT_IMAGE_MAP: Record<string, string> = {
  "casco-bay-wetland-restoration": "/assets/alderline/services/coastal-resilience.jpg",
  "renewable-energy-corridor-permitting": "/assets/alderline/about/gallery-1.jpg",
  "industrial-redevelopment-esa": "/assets/alderline/services/site-assessment.jpg",
  "pine-river-riparian-stabilization": "/assets/alderline/about/gallery-2.jpg",
  "urban-wetland-mitigation-banking": "/assets/alderline/about/gallery-3.jpg",
  "intermountain-substation-review": "/assets/alderline/about/gallery-4.jpg",
};

export default async function ProjectsPage() {
  const [projectsRead] = await Promise.all([
    getPublishedProjects(),
    getSiteSettings(),
  ]);

  // If CMS returns published rows, use them; otherwise fall back to static catalog
  const projects =
    projectsRead.available && projectsRead.data && projectsRead.data.length > 0
      ? projectsRead.data.map((row) => {
          const fallback = demonstrationCaseStudies.find((cs) => cs.slug === row.slug);
          return {
            slug: row.slug,
            title: row.title,
            summary: row.summary || fallback?.summary || "",
            client: row.clientType || fallback?.client || "Confidential Client",
            location: row.location || fallback?.location || "Pacific Northwest",
            year: row.completedYear ? String(row.completedYear) : fallback?.year || "2024",
            scope: fallback?.scope || "Environmental Assessment & Permitting",
            metrics: fallback?.metrics || [],
            image: PROJECT_IMAGE_MAP[row.slug] || "/assets/alderline/services/coastal-resilience.jpg",
          };
        })
      : demonstrationCaseStudies.map((cs) => ({
          slug: cs.slug,
          title: cs.title,
          summary: cs.summary,
          client: cs.client,
          location: cs.location,
          year: cs.year,
          scope: cs.scope,
          metrics: cs.metrics,
          image: PROJECT_IMAGE_MAP[cs.slug] || "/assets/alderline/services/coastal-resilience.jpg",
        }));

  return (
    <div className="min-h-screen bg-[#f6f2eb] text-[#15190d] flex flex-col font-sans selection:bg-[#15190d] selection:text-[#f6f2eb]">
      <EcoliaAnimations />
      <Navbar />

      <main className="flex-grow">
        {/* Breadcrumb / Hero Section */}
        <section className="breadcrumb-section py-16 md:py-24 border-b border-[#cac7c1]">
          <div className="w-layout-blockcontainer container w-container mx-auto px-4 max-w-7xl">
            <div className="max-w-3xl">
              <span className="text-xs uppercase tracking-widest text-[#81837d] font-bold mb-3 block">
                PORTFOLIO OF REALIZED WORK
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-normal tracking-tight text-[#15190d] mb-6">
                Defensible science. Delivered outcomes.
              </h1>
              <p className="text-lg md:text-xl text-[#81837d] leading-relaxed">
                Explore our portfolio of environmental impact assessments, coastal wetland restorations, Section 404/401 regulatory authorizations, and habitat mitigation projects.
              </p>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 pt-8 border-t border-[#cac7c1]/50">
              <div className="p-4 rounded-xl border border-[#cac7c1] bg-[#f6f2eb]">
                <div className="text-2xl md:text-3xl font-bold text-[#15190d]">6</div>
                <div className="text-xs text-[#81837d] mt-1 font-medium">Detailed Case Studies</div>
              </div>
              <div className="p-4 rounded-xl border border-[#cac7c1] bg-[#f6f2eb]">
                <div className="text-2xl md:text-3xl font-bold text-[#15190d]">99.4%</div>
                <div className="text-xs text-[#81837d] mt-1 font-medium">First-Round Concurrence</div>
              </div>
              <div className="p-4 rounded-xl border border-[#cac7c1] bg-[#f6f2eb]">
                <div className="text-2xl md:text-3xl font-bold text-[#15190d]">35,000+</div>
                <div className="text-xs text-[#81837d] mt-1 font-medium">Acres Evaluated</div>
              </div>
              <div className="p-4 rounded-xl border border-[#cac7c1] bg-[#f6f2eb]">
                <div className="text-2xl md:text-3xl font-bold text-[#15190d]">14+</div>
                <div className="text-xs text-[#81837d] mt-1 font-medium">Years Active Service</div>
              </div>
            </div>
          </div>
        </section>

        {/* Case Studies Catalog Grid */}
        <section className="py-16 md:py-20">
          <div className="w-layout-blockcontainer container w-container mx-auto px-4 max-w-7xl">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project) => (
                <article
                  key={project.slug}
                  className="group flex flex-col rounded-2xl border border-[#cac7c1] bg-[#f6f2eb] overflow-hidden hover:border-[#15190d] transition-all duration-300"
                >
                  {/* Card Image */}
                  <div className="relative h-60 w-full overflow-hidden bg-[#dfe0d4]">
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-3 left-3 bg-[#15190d]/80 text-[#f6f2eb] backdrop-blur-sm text-xs px-2.5 py-1 rounded-full font-medium">
                      {project.scope}
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="flex-1 p-6 flex flex-col justify-between">
                    <div>
                      {/* Metadata row */}
                      <div className="flex items-center gap-4 text-xs text-[#81837d] mb-3">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          {project.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {project.year}
                        </span>
                      </div>

                      <h2 className="text-xl font-semibold text-[#15190d] mb-3 group-hover:underline">
                        <Link href={`/projects/${project.slug}`}>
                          {project.title}
                        </Link>
                      </h2>

                      <p className="text-sm text-[#81837d] leading-relaxed line-clamp-3 mb-6">
                        {project.summary}
                      </p>
                    </div>

                    {/* Metrics Footer */}
                    <div className="pt-4 border-t border-[#cac7c1]/50">
                      {project.metrics.length > 0 && (
                        <div className="grid grid-cols-2 gap-2 mb-4">
                          {project.metrics.slice(0, 2).map((m, i) => (
                            <div key={i} className="text-xs">
                              <span className="font-bold text-[#15190d] block">{m.value}</span>
                              <span className="text-[#81837d] text-[11px]">{m.label}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      <Link
                        href={`/projects/${project.slug}`}
                        className="inline-flex items-center gap-2 text-sm font-medium text-[#15190d] hover:text-[#81837d] transition-colors"
                      >
                        Read Case Study
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Consultation Call to Action */}
        <section className="py-20 bg-[#15190d] text-[#f6f2eb]">
          <div className="container mx-auto px-4 max-w-4xl text-center">
            <span className="text-xs uppercase tracking-widest text-[#dfe0d4]/70 font-semibold mb-3 block">
              PARTNER WITH ALDERLINE
            </span>
            <h2 className="text-3xl md:text-5xl font-normal mb-6 tracking-tight">
              Have an upcoming site review or regulatory hurdle?
            </h2>
            <p className="text-[#dfe0d4]/80 text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
              Our multidisciplinary scientists and permitting specialists help project teams identify risks early and chart defensible paths forward.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-[#f6f2eb] text-[#15190d] font-medium hover:bg-[#dfe0d4] transition-colors"
              >
                Schedule Scoping Session
              </Link>
              <Link
                href="/services"
                className="inline-flex items-center justify-center px-8 py-4 rounded-full border border-[#dfe0d4]/30 text-[#f6f2eb] font-medium hover:bg-[#f6f2eb]/10 transition-colors"
              >
                Explore Practice Areas
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
