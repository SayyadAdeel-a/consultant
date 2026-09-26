import { createPageMetadata } from "@/lib/seo";
import { siteConfig } from "@/config/site";
import {
  ApproachSection,
  CaseStudySpotlight,
  ConsultationCta,
  CredibilitySection,
  FaqSection,
  HeroSection,
  IndustriesSection,
  ServicesGrid,
  TeamSection,
} from "@/components/sections";

export const metadata = createPageMetadata({
  title: "Home",
  description: siteConfig.description,
  path: "/",
});

/**
 * Homepage — the complete Phase 3 nine-section narrative:
 * hero → credibility → services → industries → case study → approach →
 * team → FAQ → consultation CTA.
 *
 * Every section is a server component; only the shared animation wrappers
 * and the FAQ accordion cross the client boundary. Section content is
 * static demo copy — CMS wiring lands in Phase 6-7 alongside the Supabase
 * schema.
 */
export default function HomePage() {
  return (
    <>
      <HeroSection />
      <CredibilitySection />
      <ServicesGrid />
      <IndustriesSection />
      <CaseStudySpotlight />
      <ApproachSection />
      <TeamSection />
      <FaqSection />
      <ConsultationCta />
    </>
  );
}
