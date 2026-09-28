/**
 * Central Content Store for Alderline Environmental
 * Structured for future headless CMS / backend integration.
 */

export const siteConfig = {
  name: "Alderline Environmental",
  tagline: "Environmental insight. Practical solutions.",
  description:
    "Alderline Environmental helps project teams understand site constraints, navigate permitting pathways, and move forward with defensible environmental planning.",
  disclaimer:
    "Alderline Environmental is a demonstration portfolio website representing specialized environmental consulting services.",
  contactEmail: "inquiries@alderline-demo.com",
  contactPhone: "(800) 555-0194",
  contactAddress: "Demonstration Office — Pacific Northwest & Intermountain Regions",
};

export const navigationConfig = {
  brand: "Alderline Environmental",
  logoDark: "/assets/alderline/brand/logo-dark.svg",
  logoLight: "/assets/alderline/brand/logo-light.svg",
  logoDarkJpg: "/assets/alderline/brand/logo-dark.jpg",
  logoLightJpg: "/assets/alderline/brand/logo-light.jpg",
  links: [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Services", href: "/services" },
    { name: "Insights", href: "/blog" },
    { name: "Contact", href: "/contact" },
  ],
  dropdown: {
    label: "Practice Areas",
    columns: [
      {
        title: "Core Services",
        items: [
          { name: "Overview", href: "/services" },
          { name: "Site Assessment & Due Diligence", href: "/services#assessment" },
          { name: "Wetland & Ecological Services", href: "/services#wetlands" },
          { name: "Regulatory Permitting", href: "/services#permitting" },
          { name: "Restoration & Water Resources", href: "/services#restoration" },
        ],
      },
      {
        title: "Company",
        items: [
          { name: "About Alderline", href: "/about" },
          { name: "Our Multidisciplinary Team", href: "/about#team" },
          { name: "Core Principles", href: "/about#principles" },
          { name: "Contact Project Team", href: "/contact" },
        ],
      },
      {
        title: "Resources & Legal",
        items: [
          { name: "Environmental Insights", href: "/blog" },
          { name: "Privacy Policy", href: "/utility/privacy-policy" },
          { name: "Terms & Conditions", href: "/utility/terms-conditions" },
          { name: "Media Licenses", href: "/utility/license" },
        ],
      },
    ],
  },
  cta: {
    label: "Request a Consultation",
    href: "/contact",
  },
};

export const heroContent = {
  heading: "Environmental Consulting And Permitting For Complex Projects",
  description:
    "Alderline Environmental helps project teams understand site constraints, navigate permitting pathways, and move forward with defensible environmental planning.",
  fallbackImage: "/assets/alderline/hero/hero-fallback.jpg",
  posterImage: "/assets/alderline/hero/hero-poster.jpg",
  videoMp4: "/assets/alderline/videos/hero-ambient.mp4",
  pills: [
    "Wetland Delineation",
    "Environmental Site Assessments",
    "Regulatory Permitting",
    "Restoration Planning",
    "NEPA Support",
    "Water Resources",
    "Coastal Resilience",
    "GIS & Mapping",
    "Site Due Diligence",
    "Agency Coordination",
    "Environmental Compliance",
  ],
};

export const aboutIntroContent = {
  heading:
    "Helping Project Teams Move From Site Constraints To Clear Environmental Action",
  description:
    "We support public and private sector projects with practical environmental guidance, field-informed analysis, and clear reporting that helps teams make confident decisions.",
  image: "/assets/alderline/about/introduction.jpg",
  supportingCard: {
    tag: "FIELD-TO-PERMIT",
    title:
      "Integrated support across site review, technical documentation, and agency coordination.",
  },
  avatars: [
    "/assets/alderline/about/avatar-1.jpg",
    "/assets/alderline/about/avatar-2.jpg",
    "/assets/alderline/about/avatar-3.jpg",
  ],
  illustrativeNote: "Multidisciplinary Project Team",
};

export const coreExpertiseContent = {
  eyebrow: "BUILT FOR COMPLEX ENVIRONMENTAL WORK",
  heading:
    "Specialized expertise for projects that require clear environmental analysis, credible documentation, and practical coordination.",
  cards: [
    {
      title: "Wetland & Ecological Services",
      description:
        "Field-based delineation, habitat review, ecological documentation, and restoration-oriented environmental support for sensitive sites.",
      icon: "/assets/alderline/icons/wetlands.jpg",
    },
    {
      title: "Site Assessment & Due Diligence",
      description:
        "Environmental site assessments, investigation support, and risk-aware site understanding that helps projects move forward with fewer surprises.",
      icon: "/assets/alderline/icons/site-assessment.jpg",
    },
    {
      title: "Permitting & Compliance Strategy",
      description:
        "Planning and documentation support for regulatory submissions, approvals, and agency coordination across complex project environments.",
      icon: "/assets/alderline/icons/permitting.jpg",
    },
  ],
};

export const serviceHighlightsContent = {
  heading: "Core Services That Support Responsible Development",
  intro:
    "From site assessments to restoration planning, we help clients understand environmental constraints, align with regulatory expectations, and make informed project decisions.",
  cards: {
    card1: {
      type: "image",
      title: "Environmental Site Assessments For Smarter Project Starts",
      description:
        "Support for site understanding, due diligence, and early-stage environmental review that helps reduce uncertainty before critical project decisions.",
      image: "/assets/alderline/services/site-assessment.jpg",
    },
    card2: {
      type: "text",
      title: "Wetland Delineation And Ecological Field Documentation",
      description:
        "Field-based review of wetland boundaries, habitat conditions, and site sensitivities with documentation structured for practical project use.",
      buttonText: "Learn More",
      link: "/services",
    },
    card3: {
      type: "image",
      title: "Coastal And Watershed Planning With Long-Term Resilience In Mind",
      description:
        "Planning support for dynamic landscapes, hydrologic context, and environmentally sensitive project areas where long-term performance matters.",
      image: "/assets/alderline/services/coastal-resilience.jpg",
    },
    card4: {
      type: "text",
      title: "Permitting Support And Environmental Coordination",
      description:
        "Clear technical communication and permit-oriented documentation that helps project teams coordinate with agencies and keep work moving.",
      buttonText: "Learn More",
      link: "/services",
    },
  },
};

export const approachCredibilityContent = {
  eyebrow: "DESIGNED TO SUPPORT REAL PROJECT DECISIONS",
  heading: "Thoughtful Investigation. Practical Recommendations.",
  description:
    "A strong environmental process helps teams understand risk early, communicate clearly, and move through project requirements with greater confidence.",
  portrait: "/assets/alderline/team/testimonial-placeholder.jpg",
  representative: {
    note: "Demonstration Project Perspective",
    body: "Effective environmental consulting requires balancing scientific rigor with practical project milestones. We focus on defensible documentation that advances both compliance and design.",
  },
  card1: {
    tag: "FIELD-LED",
    description: "Site understanding grounded in real-world environmental conditions.",
  },
  card2: {
    tag: "PERMIT-FOCUSED",
    description: "Documentation and coordination designed to support project progress.",
  },
};

export const homepageInsightsContent = {
  heading: "Environmental Insights For Evolving Projects",
  buttonText: "Read More",
  articles: [
    {
      title: "When A Phase I ESA Is Enough — And When It Isn't",
      date: "Demonstration Article",
      slug: "when-a-phase-i-esa-is-enough-and-when-it-isnt",
      image: "/assets/alderline/insights/article-1.jpg",
    },
    {
      title: "What Wetland Delineation Means For Project Planning",
      date: "Demonstration Article",
      slug: "what-wetland-delineation-means-for-project-planning",
      image: "/assets/alderline/insights/article-2.jpg",
    },
    {
      title: "Planning For Permitting Earlier In The Project Lifecycle",
      date: "Demonstration Article",
      slug: "planning-for-permitting-earlier-in-the-project-lifecycle",
      image: "/assets/alderline/insights/article-3.jpg",
    },
    {
      title: "Restoration Thinking In Modern Site Development",
      date: "Demonstration Article",
      slug: "restoration-thinking-in-modern-site-development",
      image: "/assets/alderline/insights/article-4.jpg",
    },
  ],
};

export const faqContent = {
  heading: "Frequently Asked Questions",
  description:
    "Practical answers to common environmental consulting questions for project teams, developers, and public-sector clients.",
  items: [
    {
      q: "What types of projects does Alderline Environmental support?",
      a: "Our demonstration service set represents environmental support for public and private development, infrastructure, land planning, environmental review, and restoration-oriented work.",
    },
    {
      q: "Do you provide wetland delineation and ecological field support?",
      a: "The services represented in this demonstration include wetland delineation, ecological documentation, and field-based environmental support for sensitive sites. Actual availability will depend on the consultancy using this website.",
    },
    {
      q: "Can you help with regulatory permitting and agency coordination?",
      a: "The demonstration includes technical documentation and coordination support for environmental review and permitting workflows. Services must be confirmed for each real client.",
    },
    {
      q: "Do you only work on large projects?",
      a: "Environmental consulting needs vary by site and project stage. Engagements may involve early due diligence, focused technical reviews, or broader environmental planning.",
    },
    {
      q: "How do I start a conversation about my project?",
      a: "Use the inquiry form to share your project type, location, and current stage. The form will become operational once the production backend and contact details are connected.",
    },
  ],
};

export const footerContent = {
  brand: "Alderline Environmental",
  tagline: "Environmental insight. Practical solutions.",
  supporting:
    "Alderline Environmental is a demonstration of how clear design and thoughtful content can support modern environmental consulting businesses.",
  ctaBox: {
    heading: "DISCUSS YOUR PROJECT",
    description:
      "Share your site review, permitting, or restoration needs with our project team.",
    buttonText: "Request a Consultation",
    link: "/contact",
  },
  linksMain: [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Services", href: "/services" },
    { name: "Insights", href: "/blog" },
    { name: "Contact", href: "/contact" },
  ],
  linksInfo: [
    { name: "Privacy Policy", href: "/utility/privacy-policy" },
    { name: "Terms & Conditions", href: "/utility/terms-conditions" },
    { name: "Media Licensing", href: "/utility/license" },
  ],
  copyright: "© Alderline Environmental. Demonstration Portfolio Website.",
};
