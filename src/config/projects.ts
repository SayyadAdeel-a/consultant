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

export const additionalCaseStudies: Record<string, CaseStudyDetail> = {
  "renewable-energy-corridor-permitting": {
    slug: "renewable-energy-corridor-permitting",
    title: "Clean Energy Transmission Corridor Permitting",
    summary:
      "Critical areas assessment, avian collision risk modeling, and state/federal joint environmental permitting across 48 miles of renewable energy transmission right-of-way.",
    client: "Horizon Clean Power Consortium",
    location: "Columbia River Basin, WA & OR",
    scope: "NEPA Environmental Assessment & Section 106 Compliance",
    year: "2024",
    challenge: [
      "The proposed linear transmission alignment traversed multiple jurisdictional watersheds, priority shrub-steppe raptor nesting territories, and culturally sensitive tribal resource zones.",
    ],
    solution: [
      "Alderline conducted multi-season botanical and wildlife inventories, executed micro-siting re-alignments to avoid 94% of identified sensitive ecotones, and facilitated proactive tribal consultation.",
    ],
    results: [
      "Secured Finding of No Significant Impact (FONSI) without contested administrative hearings, advancing the transmission inter-tie 6 months ahead of initial project schedule.",
    ],
    metrics: [
      { value: "48 mi", label: "Linear corridor assessed" },
      { value: "94%", label: "Sensitive wetland avoidance" },
      { value: "FONSI", label: "NEPA clearance achieved" },
    ],
  },
  "industrial-redevelopment-esa": {
    slug: "industrial-redevelopment-esa",
    title: "Former Waterfront Industrial Terminal Phase I & II ESA",
    summary:
      "Targeted hydrogeologic and geochemical investigation of a 28-acre decommissioned shipyard and chemical handling terminal for brownfield adaptive reuse.",
    client: "Pacific Rim Industrial Trust",
    location: "Tacoma Tideflats, WA",
    scope: "ASTM E1527-21 Due Diligence & Subsurface Characterization",
    year: "2023",
    challenge: [
      "Over eight decades of unrecorded historical manufacturing created complex overlapping solvent, petroleum hydrocarbon, and heavy metal plumes in shallow estuarine aquifers.",
    ],
    solution: [
      "Deployed low-disturbance membrane interface probe (MIP) screening coupled with high-resolution 3D plume modeling to delimit hot spots, followed by engineered containment barrier design.",
    ],
    results: [
      "Negotiated a Prospective Purchaser Agreement (PPA) with the state Department of Ecology, reducing buyer environmental liability exposure by $8.4M.",
    ],
    metrics: [
      { value: "28 ac", label: "Brownfield parcel evaluated" },
      { value: "$8.4M", label: "Liability exposure mitigated" },
      { value: "0", label: "Third-party indemnity claims" },
    ],
  },
  "pine-river-riparian-stabilization": {
    slug: "pine-river-riparian-stabilization",
    title: "Pine River Riparian Habitat & Shoreline Stabilization",
    summary:
      "Bioengineered living shoreline design replacing degraded riprap with rootwads, native riparian buffers, and engineered log jams across 2.4 miles of designated salmonid habitat.",
    client: "Pine River Watershed Authority",
    location: "Deschutes County, OR",
    scope: "Bioengineering Design & Fluvial Geomorphology",
    year: "2024",
    challenge: [
      "Severe riverbank scour from unregulated runoff threatened adjacent recreational parkland and introduced chronic sediment loading into critical cold-water fisheries.",
    ],
    solution: [
      "Modeled 2D hydrodynamic flow velocities to design anchored large woody debris (LWD) installations and deep-rooting native willow/alder revetments that dissipate high-flow energy.",
    ],
    results: [
      "Withstood historic 100-year recurrence interval spring flood events with zero structural failure, reducing stream turbidity by 78% downstream of the project reach.",
    ],
    metrics: [
      { value: "2.4 mi", label: "Riverfront stabilized" },
      { value: "78%", label: "Turbidity reduction" },
      { value: "100-Yr", label: "Storm event resilience" },
    ],
  },
  "urban-wetland-mitigation-banking": {
    slug: "urban-wetland-mitigation-banking",
    title: "Cascadia Regional Wetland Mitigation Banking",
    summary:
      "Permitting, baseline ecological characterization, and hydrologic restoration design for a 115-acre commercial wetland mitigation bank producing transferable credits.",
    client: "Apex Urban Development Partners",
    location: "Willamette Valley, OR",
    scope: "Mitigation Banking Instrument (MBI) & Ecological Design",
    year: "2023",
    challenge: [
      "Drained agricultural acreage required re-establishment of historical emergent marsh and vernal pool hydrology while satisfying rigorous USACE IRT credit release schedules.",
    ],
    solution: [
      "Constructed earthen berms, decommissioned subterranean tile drains, and seeded 34 native wetland plant species calibrated to monitored seasonal groundwater tables.",
    ],
    results: [
      "Achieved full Interagency Review Team (IRT) approval of the MBI with initial release of 35 wetland credits valued at over $4.2M.",
    ],
    metrics: [
      { value: "115 ac", label: "Total bank acreage" },
      { value: "35", label: "Initial credits released" },
      { value: "100%", label: "IRT milestone compliance" },
    ],
  },
  "intermountain-substation-review": {
    slug: "intermountain-substation-review",
    title: "Intermountain High-Voltage Substation Environmental Review",
    summary:
      "Environmental constraints analysis, geotechnical environmental review, and Spill Prevention, Control, and Countermeasure (SPCC) engineering for a 500kV substation.",
    client: "Apex Infrastructure Utilities",
    location: "Ada County, Idaho",
    scope: "Critical Areas Review, Stormwater & Spill Prevention (SPCC)",
    year: "2024",
    challenge: [
      "Site expansion bordered an ephemeral irrigation canal and protected sagebrush scrub habitat subject to strict county grading ordinances.",
    ],
    solution: [
      "Engineered self-contained secondary containment systems for oil-filled electrical equipment and integrated zero-runoff xeriscape bio-retention basins.",
    ],
    results: [
      "Secured unanimous county land-use conditional use permit (CUP) approval with zero environmental appeals or delays.",
    ],
    metrics: [
      { value: "500 kV", label: "Substation capacity" },
      { value: "0", label: "Offsite runoff discharge" },
      { value: "100%", label: "Unanimous CUP approval" },
    ],
  },
};

/** Static case studies by slug — the demo-mode source of truth. */
export const caseStudies: Record<string, CaseStudyDetail> = {
  [featuredCaseStudy.slug]: featuredCaseStudy,
};

/** All static case studies in spotlight order (static params / fallbacks). */
export const caseStudyList: CaseStudyDetail[] = Object.values(caseStudies);

/** Complete 6-project demonstration catalog for public and admin showcases. */
export const demonstrationCaseStudies: CaseStudyDetail[] = [
  featuredCaseStudy,
  ...Object.values(additionalCaseStudies),
];
