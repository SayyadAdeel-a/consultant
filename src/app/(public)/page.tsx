import { createPageMetadata } from "@/lib/seo";
import { siteConfig } from "@/config/site";
import { resolvePublicIdentity } from "@/lib/data/identity";
import {
  getSiteSettings,
  getVisibleHomepageSections,
  resolveVisibleSectionKeys,
} from "@/lib/data/public";
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
 * Homepage — the complete nine-section narrative:
 * hero → credibility → services → industries → case study → approach →
 * team → FAQ → consultation CTA.
 *
 * Task 9.1 (docs/TASKS.md):
 * - Section visibility is checked against `public.homepage_sections`
 *   when Supabase is configured: hidden sections (`is_visible = false`)
 *   are excluded from rendering. An unavailable or unseeded read falls
 *   back to showing all nine sections (fail-safe static default).
 * - The hero resolves its tagline and CTA pair from `site_settings`
 *   through the identity view-model; the closing banner reads the same
 *   identity. All other section copy remains static demo content —
 *   homepage copy editing (beyond visibility) is not part of this task.
 *
 * Every section is a server component; only the shared animation wrappers
 * and the FAQ accordion cross the client boundary.
 */
export default async function HomePage() {
  const [settingsRead, sectionsRead] = await Promise.all([
    getSiteSettings(),
    getVisibleHomepageSections(),
  ]);
  const identity = resolvePublicIdentity(settingsRead.data);
  const visibleSections = resolveVisibleSectionKeys(sectionsRead.data);
  const show = (key: string) => !visibleSections || visibleSections.has(key);

  return (
    <>
      <HeroSection identity={identity} />
      {show("credibility") && <CredibilitySection />}
      {show("services") && <ServicesGrid />}
      {show("industries") && <IndustriesSection />}
      {show("projects") && <CaseStudySpotlight />}
      {show("approach") && <ApproachSection />}
      {show("team") && <TeamSection />}
      {show("faq") && <FaqSection />}
      {show("cta") && <ConsultationCta identity={identity} />}
    </>
  );
}
