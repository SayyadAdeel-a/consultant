export interface BlogPost {
  slug: string;
  title: string;
  category: "Site Assessment" | "Wetlands" | "Permitting" | "Restoration" | "Water Resources";
  date: string;
  readTime: string;
  image: string;
  bannerImage: string;
  inlineImage?: string;
  summary: string;
  paragraphs: string[];
  sections?: { heading: string; body: string }[];
}

export const allBlogPosts: BlogPost[] = [
  {
    slug: "what-wetland-delineation-means-for-project-planning",
    title: "What Wetland Delineation Means For Project Planning",
    category: "Wetlands",
    date: "Demonstration Article",
    readTime: "4 mins read",
    image: "/assets/alderline/insights/article-2.jpg",
    bannerImage: "/assets/alderline/insights/article-hero.jpg",
    inlineImage: "/assets/alderline/insights/article-inline.jpg",
    summary:
      "Understanding wetland presence and boundaries helps project teams reduce uncertainty and respond effectively to site sensitivities.",
    paragraphs: [
      "Wetland delineation is often one of the earliest environmental steps that influences site planning, permitting strategy, and project expectations.",
      "Understanding wetland presence and boundaries can help teams reduce uncertainty and respond more effectively to site constraints.",
    ],
    sections: [
      {
        heading: "Understand Site Conditions Early",
        body: "Early field understanding helps project teams identify sensitive areas before design assumptions become costly or difficult to change. A clear delineation process can support planning conversations, improve coordination, and help teams understand where environmental sensitivity may affect layout, access, or permitting.",
      },
      {
        heading: "Connect Field Findings To Project Decisions",
        body: "Environmental findings are most useful when they are translated into practical implications for the wider project team. Rather than existing as isolated technical information, delineation outcomes should help shape design discussions, risk awareness, and permitting preparation.",
      },
      {
        heading: "Support A More Efficient Permitting Path",
        body: "When environmental understanding is established early, permit-related communication can become more focused and more useful. Even when additional review is required, a clear foundation helps teams ask better questions, prepare documentation, and move forward with greater confidence.",
      },
    ],
  },
  {
    slug: "when-a-phase-i-esa-is-enough-and-when-it-isnt",
    title: "When A Phase I ESA Is Enough — And When It Isn't",
    category: "Site Assessment",
    date: "Demonstration Article",
    readTime: "5 mins read",
    image: "/assets/alderline/insights/article-1.jpg",
    bannerImage: "/assets/alderline/insights/article-hero.jpg",
    inlineImage: "/assets/alderline/insights/article-inline.jpg",
    summary:
      "Recognizing the threshold between standard due diligence and required intrusive subsurface investigations.",
    paragraphs: [
      "A Phase I Environmental Site Assessment (ESA) is the foundation of site due diligence, intended to identify Recognized Environmental Conditions (RECs). However, knowing when historical records indicate a need for Phase II soil and groundwater sampling is critical for managing capital risk.",
      "By assessing historical aerial imagery, chemical storage permits, and regional hydrogeologic vulnerability early, project teams can anticipate site investigations without delaying land acquisition timelines.",
    ],
    sections: [
      {
        heading: "Recognizing Recognized Environmental Conditions (RECs)",
        body: "Understanding the distinction between historical contamination and active environmental liabilities ensures due diligence findings provide actionable risk evaluations rather than mere compliance checklists.",
      },
      {
        heading: "Scoping Targeted Phase II Investigations",
        body: "When intrusive sampling is warranted, focused sampling grids based on conceptual site models keep investigation budgets targeted while delivering defensible analytical data.",
      },
    ],
  },
  {
    slug: "planning-for-permitting-earlier-in-the-project-lifecycle",
    title: "Planning For Permitting Earlier In The Project Lifecycle",
    category: "Permitting",
    date: "Demonstration Article",
    readTime: "4 mins read",
    image: "/assets/alderline/insights/article-3.jpg",
    bannerImage: "/assets/alderline/insights/article-hero.jpg",
    inlineImage: "/assets/alderline/insights/article-inline.jpg",
    summary:
      "Integrating regulatory milestones into preliminary engineering prevents avoidable review bottlenecks.",
    paragraphs: [
      "Permitting delays are rarely caused by agency review timelines alone; they often stem from submitting incomplete environmental baseline studies that require protracted requests for additional information (RAIs).",
      "Engaging regulatory specialists during 30% schematic design enables engineering teams to avoid sensitive resource impacts, qualify for nationwide or general permits, and streamline the administrative record.",
    ],
    sections: [
      {
        heading: "Early Agency Pre-Application Coordination",
        body: "Informal pre-application meetings clarify jurisdictional thresholds, baseline documentation expectations, and appropriate mitigation ratios prior to formal submittal.",
      },
    ],
  },
  {
    slug: "restoration-thinking-in-modern-site-development",
    title: "Restoration Thinking In Modern Site Development",
    category: "Restoration",
    date: "Demonstration Article",
    readTime: "4 mins read",
    image: "/assets/alderline/insights/article-4.jpg",
    bannerImage: "/assets/alderline/insights/article-hero.jpg",
    inlineImage: "/assets/alderline/insights/article-inline.jpg",
    summary:
      "How ecological restoration principles transform regulatory mitigation obligations into functional landscape assets.",
    paragraphs: [
      "Rather than treating ecological mitigation as a regulatory penalty, progressive development teams incorporate native vegetative buffers, living shorelines, and daylighted stream corridors directly into site master planning.",
      "This approach enhances stormwater retention, provides measurable biodiversity lift, and simplifies long-term compliance monitoring.",
    ],
  },
  {
    slug: "how-site-constraints-shape-better-project-decisions",
    title: "How Site Constraints Shape Better Project Decisions",
    category: "Site Assessment",
    date: "Demonstration Article",
    readTime: "3 mins read",
    image: "/assets/alderline/insights/article-1.jpg",
    bannerImage: "/assets/alderline/insights/article-hero.jpg",
    inlineImage: "/assets/alderline/insights/article-inline.jpg",
    summary:
      "Viewing environmental constraints as structural design parameters improves site layout and infrastructure efficiency.",
    paragraphs: [
      "Steep slopes, shallow groundwater, and ecological buffers need not be obstacles; understanding them early enables engineers to optimize grading balances and reduce costly structural interventions.",
    ],
  },
  {
    slug: "communicating-environmental-risk-more-clearly",
    title: "Communicating Environmental Risk More Clearly",
    category: "Permitting",
    date: "Demonstration Article",
    readTime: "4 mins read",
    image: "/assets/alderline/insights/article-3.jpg",
    bannerImage: "/assets/alderline/insights/article-hero.jpg",
    inlineImage: "/assets/alderline/insights/article-inline.jpg",
    summary:
      "Translating complex hydrogeological and ecological findings into defensible, executive-level decision matrices.",
    paragraphs: [
      "Technical environmental reports must communicate clearly across diverse stakeholders—from municipal planning boards to corporate investment committees. Clarity and defensibility are mutually reinforcing.",
    ],
  },
  {
    slug: "why-field-context-still-matters-in-digital-workflows",
    title: "Why Field Context Still Matters In Digital Workflows",
    category: "Wetlands",
    date: "Demonstration Article",
    readTime: "3 mins read",
    image: "/assets/alderline/insights/article-2.jpg",
    bannerImage: "/assets/alderline/insights/article-hero.jpg",
    inlineImage: "/assets/alderline/insights/article-inline.jpg",
    summary:
      "Remote GIS and satellite data provide valuable initial screening, but on-site ground truthing remains indispensable for regulatory defensibility.",
    paragraphs: [
      "Subtle hydric soil indicators, micro-topography, and localized hydrology cannot be verified solely from satellite imagery or desktop GIS overlays. Field-based observation is essential.",
    ],
  },
  {
    slug: "water-resources-considerations-before-design-advances",
    title: "Water Resources Considerations Before Design Advances",
    category: "Water Resources",
    date: "Demonstration Article",
    readTime: "4 mins read",
    image: "/assets/alderline/insights/article-4.jpg",
    bannerImage: "/assets/alderline/insights/article-hero.jpg",
    inlineImage: "/assets/alderline/insights/article-inline.jpg",
    summary:
      "Analyzing watershed hydraulics and receiving water bodies before finalizing stormwater outfall configurations.",
    paragraphs: [
      "Early hydrologic modeling ensures stormwater management systems account for regional climate trends, discharge temperature constraints, and downstream sediment transport.",
    ],
  },
  {
    slug: "early-ecological-review-and-its-value-for-complex-sites",
    title: "Early Ecological Review And Its Value For Complex Sites",
    category: "Restoration",
    date: "Demonstration Article",
    readTime: "4 mins read",
    image: "/assets/alderline/insights/article-2.jpg",
    bannerImage: "/assets/alderline/insights/article-hero.jpg",
    inlineImage: "/assets/alderline/insights/article-inline.jpg",
    summary:
      "Identifying critical habitat and seasonal wildlife buffers before land clearing contracts are awarded.",
    paragraphs: [
      "Seasonal restrictions for migratory birds or endangered species can halt active construction if not identified during initial environmental review. Early field surveys protect project schedules.",
    ],
  },
  {
    slug: "building-a-better-environmental-documentation-process",
    title: "Building A Better Environmental Documentation Process",
    category: "Permitting",
    date: "Demonstration Article",
    readTime: "3 mins read",
    image: "/assets/alderline/insights/article-1.jpg",
    bannerImage: "/assets/alderline/insights/article-hero.jpg",
    inlineImage: "/assets/alderline/insights/article-inline.jpg",
    summary:
      "Standardizing field data collection, chain-of-custody protocols, and GIS deliverables to ensure regulatory submittal readiness.",
    paragraphs: [
      "Rigorous quality assurance protocols across field observations, laboratory analyses, and geospatial metadata ensure environmental filings withstand legal and regulatory scrutiny.",
    ],
  },
];
