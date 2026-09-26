/**
 * Service catalog data (docs/TASKS.md Task 4.1).
 *
 * Static demo content shared by the catalog (`/services`), the dynamic
 * detail template (`/services/[slug]`), and — for slugs/titles — the
 * homepage `ServicesGrid`. This file is the sync point until the CMS
 * `services` table (Phase 6-7) becomes the source of truth; keep the
 * homepage cards aligned with `serviceList`.
 *
 * PRICING RULE (AGENTS.md §5.5): `pricingNote` is strictly optional.
 * Rendering must go through `hasPricingNote()` so null, empty, and
 * whitespace-only values are never displayed.
 */

export interface ServiceMilestone {
  title: string;
  description: string;
}

export interface ServiceDetail {
  slug: string;
  title: string;
  /** Short catalog blurb and meta description source. */
  summary: string;
  /** Regulatory framework badges, e.g. CWA / NEPA / ASTM references. */
  framework: string[];
  /** Key deliverables — shown as checklists on both pages. */
  deliverables: string[];
  /** Editorial problem context paragraphs for the detail page. */
  problemContext: string[];
  /** Service-specific methodology milestones (detail page). */
  milestones: ServiceMilestone[];
  /**
   * Optional fee/engagement note. NEVER rendered when null, empty, or
   * whitespace-only — see `hasPricingNote()`.
   */
  pricingNote: string | null;
}

export const serviceList: ServiceDetail[] = [
  {
    slug: "wetland-delineation",
    title: "Wetland Delineation",
    summary:
      "Jurisdictional delineation, boundary documentation, and agency concurrence for projects that cross — or may cross — waters of the United States.",
    framework: [
      "CWA §404",
      "CWA §401",
      "1987 Corps Manual",
      "Regional Supplements",
    ],
    deliverables: [
      "Delineation report with boundary exhibits and coordinates",
      "Wetland resource map layers (CAD/GIS) ready for design",
      "Joint permit application package support",
      "Agency concurrence tracking and comment responses",
    ],
    problemContext: [
      "Wetland boundaries decide whether a project needs a federal permit, how much mitigation it will require, and how long the approval path will be. Delineate them late — or defend them badly — and the schedule absorbs months of agency comment cycles.",
      "Our field teams apply the 1987 Corps Wetland Delineation Manual and the applicable regional supplement on site, documenting vegetation, soils, and hydrology evidence to a standard reviewers can verify without a site revisit.",
    ],
    milestones: [
      {
        title: "Records review & AWT mapping",
        description:
          "Desktop analysis of NWI, SSURGO soils, and agency records to pre-map apparently jurisdictional features.",
      },
      {
        title: "Field delineation",
        description:
          "On-site vegetation, soils, and hydrology investigation across all candidate features.",
      },
      {
        title: "Boundary documentation",
        description:
          "Report, exhibits, and coordinates formatted to the reviewing office's submittal requirements.",
      },
      {
        title: "Concurrence & handoff",
        description:
          "Agency concurrence follow-up, then a clean data handoff to permitting and design teams.",
      },
    ],
    pricingNote:
      "Delineation fees are quoted per project after a records review — field days, feature count, and agency path drive the final number.",
  },
  {
    slug: "environmental-permitting",
    title: "Environmental Permitting",
    summary:
      "Permit strategy, applications, and agency coordination across federal, state, and local approvals — sequenced to protect the critical path.",
    framework: [
      "NEPA",
      "CWA §404/§401",
      "Coastal Zone Management",
      "Local Land Use",
    ],
    deliverables: [
      "Permit matrix with agencies, timelines, and dependencies",
      "Complete application packages (federal, state, municipal)",
      "Public notice and hearing support materials",
      "Comment response letters and concurrence tracking",
    ],
    problemContext: [
      "Permitting rarely fails on science; it fails on sequencing. Overlapping federal, state, and municipal reviews each carry their own completeness rules, comment windows, and appeal exposure — and one missed dependency can stall an otherwise shovel-ready project.",
      "We build the authorization path backward from your construction window: identifying every approval, the dependencies between them, and the evidence each reviewer needs before the first application is filed.",
    ],
    milestones: [
      {
        title: "Authorization path analysis",
        description:
          "Every required approval mapped with dependencies, review clocks, and completeness criteria.",
      },
      {
        title: "Application assembly",
        description:
          "Technical exhibits, forms, and supporting documentation prepared to each agency's checklist.",
      },
      {
        title: "Agency coordination",
        description:
          "Pre-application meetings, scoping calls, and comment-period management.",
      },
      {
        title: "Approval & conditions",
        description:
          "Permits issued, conditions tracked, and compliance obligations handed to the project team.",
      },
    ],
    pricingNote: null,
  },
  {
    slug: "environmental-assessments",
    title: "Phase I/II ESAs",
    summary:
      "ASTM-standard environmental site assessments that characterize risk clearly for lenders, buyers, and regulators — from desktop review to subsurface sampling.",
    framework: ["ASTM E1527-21", "AAI / CERCLA", "ASTM E1903"],
    deliverables: [
      "Phase I ESA report with registry and imagery review",
      "Clear recognized-environmental-condition conclusions with next steps",
      "Phase II scope, sampling plan, and laboratory data",
      "Lender-ready reports with data-quality objectives",
    ],
    problemContext: [
      "Transactions stall when environmental risk is ambiguous. A Phase I that misses a historical use — or a Phase II that samples the wrong medium — leaves buyers exposed to CERCLA liability and lenders unable to close.",
      "We deliver assessments to ASTM E1527-21 with All Appropriate Inquiries compatibility, and escalate to Phase II sampling with a defined conceptual site model the moment recognized environmental conditions appear.",
    ],
    milestones: [
      {
        title: "Desktop & registry review",
        description:
          "Historical records, aerial imagery, databases, and agency files reviewed for prior site conditions.",
      },
      {
        title: "Site reconnaissance",
        description:
          "Visual inspection, interviews, and feature sampling decisions documented per standard.",
      },
      {
        title: "Subsurface investigation",
        description:
          "Phase II borings, sampling, and laboratory analysis against a defined conceptual site model.",
      },
      {
        title: "Risk characterization",
        description:
          "Findings, uncertainty, and recommended actions presented in language stakeholders can act on.",
      },
    ],
    pricingNote: null,
  },
  {
    slug: "environmental-planning",
    title: "Ecological Planning",
    summary:
      "Habitat assessments, avoidance and minimization strategies, and land-use planning that keep development defensible through review and into operation.",
    framework: ["NEPA", "Endangered Species Act", "Local Land Use"],
    deliverables: [
      "Habitat and species constraint mapping (GIS)",
      "Avoidance and minimization alternatives analysis",
      "NEPA and local comprehensive plan documentation",
      "Mitigation and monitoring frameworks",
    ],
    problemContext: [
      "The cheapest environmental risk is the one designed out before permitting. Early habitat and constraint analysis gives planners room to avoid impacts entirely — instead of negotiating mitigation after boundaries are locked.",
      "We translate ecological constraints into site plans reviewers support: avoiding and minimizing first, sequencing field constraints into the design, and documenting rationale so every decision survives public comment.",
    ],
    milestones: [
      {
        title: "Constraint mapping",
        description:
          "Habitat, species, hydrology, and land-use constraints layered into a single planning GIS.",
      },
      {
        title: "Alternatives analysis",
        description:
          "Avoidance and minimization options scored against cost, schedule, and ecological value.",
      },
      {
        title: "Plan integration",
        description:
          "Selected alternative folded into site plans with documented environmental rationale.",
      },
      {
        title: "Monitoring framework",
        description:
          "Post-approval success criteria and reporting the operator can maintain.",
      },
    ],
    pricingNote: null,
  },
];

/** Slug-keyed lookup for the dynamic `/services/[slug]` template. */
export const services: Record<string, ServiceDetail> = Object.fromEntries(
  serviceList.map((service) => [service.slug, service]),
);

/**
 * CMS Pricing Rule guard (AGENTS.md §5.5). A pricing note is displayable
 * only when it contains non-whitespace text; null, empty, and
 * whitespace-only values must render nothing at all.
 */
export function hasPricingNote(
  service: Pick<ServiceDetail, "pricingNote">,
): boolean {
  return Boolean(service.pricingNote?.trim());
}
