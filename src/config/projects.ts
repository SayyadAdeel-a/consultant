/**
 * Static case-study data (docs/TASKS.md Task 10.1).
 *
 * Single source of truth for the featured (illustrative) case study —
 * shared by the homepage `CaseStudySpotlight` and the dynamic
 * `/projects/[slug]` template, so the detail page's demo-mode fallback
 * can never drift from the spotlight it mirrors.
 *
 * When Supabase is configured, published `public.projects` rows hydrate
 * the same `CaseStudyDetail` shape through `hydrateProjectDetail()`
 * (see `@/lib/data/public`) and become the authority; per-field rules
 * mirror the service catalog — empty text fields fall back to the
 * static copy for the same slug, and fields with no CMS column (`scope`)
 * always come from this config.
 */

/** Quantified outcome shown in the spotlight's results grid. */
export interface CaseStudyMetric {
  value: string;
  label: string;
}

/** View-model rendered by the `/projects/[slug]` detail template. */
export interface CaseStudyDetail {
  slug: string;
  title: string;
  /** Short lead paragraph — meta description source. */
  summary: string;
  client: string;
  location: string;
  /** Engagement scope (static-only; no CMS column). */
  scope: string;
  year: string;
  /** Challenge narrative paragraphs. */
  challenge: string[];
  /** Technical solution paragraphs. */
  solution: string[];
  /** CMS-authored outcome paragraphs (empty for the static spotlight). */
  results: string[];
  /** Metric presentation (renders only when `results` prose is empty). */
  metrics: CaseStudyMetric[];
}

/**
 * The featured (illustrative) case study rendered by the homepage
 * spotlight. Text is byte-identical to the pre-CMS Task 3.3 copy; the
 * `summary` is new lead/meta copy derived from the same facts.
 */
export const featuredCaseStudy: CaseStudyDetail = {
  slug: "casco-bay-wetland-restoration",
  title: "Casco Bay coastal wetland restoration",
  summary:
    "Tidal reconnection and joint §404/§401 permitting that returned 42 acres of fragmented salt marsh to full tidal exchange — with agency concurrence on the first submittal.",
  client: "Casco Bay Estuary Partnership",
  location: "Casco Bay, Maine",
  scope: "Delineation, design & permitting",
  year: "2024",
  challenge: [
    "Decades of tidal restriction and shoreline erosion had fragmented the marsh into open-water pans, weakening nursery habitat for Casco Bay shellfish and pushing the parcel beyond its storm-surge thresholds.",
  ],
  solution: [
    "We paired bathymetric LiDAR interpretation with fine-scale vegetation and soils surveying to re-establish historic tidal hydrology, then sequenced a joint Army Corps §404 and Maine DEP §401 authorization strategy around in-water work windows.",
  ],
  results: [],
  metrics: [
    { value: "42", label: "Acres restored" },
    { value: "100%", label: "Agency concurrence on first submittal" },
    { value: "11 months", label: "Permit timeline" },
  ],
};

/** Static case studies by slug — the demo-mode source of truth. */
export const caseStudies: Record<string, CaseStudyDetail> = {
  [featuredCaseStudy.slug]: featuredCaseStudy,
};

/** All static case studies in spotlight order (static params / fallbacks). */
export const caseStudyList: CaseStudyDetail[] = Object.values(caseStudies);
