import { Navbar } from "@/components/ecolia/Navbar";
import { HeroSection } from "@/components/ecolia/HeroSection";
import { AboutSection } from "@/components/ecolia/AboutSection";
import { VisionarySection } from "@/components/ecolia/VisionarySection";
import { ToolsSection } from "@/components/ecolia/ToolsSection";
import { TestimonialSection } from "@/components/ecolia/TestimonialSection";
import { BlogSection } from "@/components/ecolia/BlogSection";
import { FaqSection } from "@/components/ecolia/FaqSection";
import { Footer } from "@/components/ecolia/Footer";
import { EcoliaAnimations } from "@/components/ecolia/Animations";
import {
  getSiteSettings,
  getVisibleHomepageSections,
  resolveVisibleSectionKeys,
} from "@/lib/data/public";
import { resolvePublicIdentity } from "@/lib/data/identity";

export default async function HomePage() {
  const [settingsRead, sectionsRead] = await Promise.all([
    getSiteSettings(),
    getVisibleHomepageSections(),
  ]);
  const identity = resolvePublicIdentity(settingsRead.data);
  const visibleSections = resolveVisibleSectionKeys(sectionsRead.data);
  const show = (key: string) => !visibleSections || visibleSections.has(key);

  return (
    <div className="min-h-screen bg-[#f6f2eb] text-[#15190d] flex flex-col font-sans selection:bg-[#15190d] selection:text-[#f6f2eb]">
      {/* GSAP Motion & ScrollTrigger Controller */}
      <EcoliaAnimations />

      {/* Fixed Sticky Header */}
      <Navbar cta={settingsRead.data?.cta_settings ? identity.primaryCta : undefined} />

      {/* Main Flow Content */}
      <main className="flex-grow">
        {/* Hero Section with Looping Forest Video & Pill Ticker */}
        {show("hero") && (
          <HeroSection headline={settingsRead.data?.tagline || undefined} />
        )}

        {/* About Section with Customer Ratings & Modern Green Energy Transition */}
        {show("credibility") && <AboutSection />}

        {/* Visionary Section with 3 Innovation & Legal Capabilities Cards */}
        {show("approach") && <VisionarySection />}

        {/* Tools Section with 2x2 Clean Energy Infrastructure Cards */}
        {show("services") && <ToolsSection />}

        {/* Testimonials & 55% / 10k+ Impact Metric Counters */}
        {show("team") && <TestimonialSection />}

        {/* Low-Carbon Thinking Field Notes & Blog Cards */}
        {show("projects") && <BlogSection />}

        {/* FAQ Interactive Accordion */}
        {show("faq") && <FaqSection />}
      </main>

      {/* Forest Dark Footer */}
      <Footer />
    </div>
  );
}
