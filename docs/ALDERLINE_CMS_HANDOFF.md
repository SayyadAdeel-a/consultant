# Alderline Environmental — CMS Handoff & Schema Specification

**Document Version:** 1.0  
**Target Audience:** CMS Architects, Backend Engineers, Content Editors  
**Frontend Framework:** Next.js 16 (App Router, Server & Client Components)  

---

## 1. Executive Summary

This specification defines the headless Content Management System (CMS) architecture, data schema, content models, and visual validation constraints required to decouple Alderline Environmental from static TypeScript stores (`src/lib/alderline-content.ts` and `src/lib/blog-data.ts`).

The design language of Alderline Environmental relies on balanced typography, tight grid proportions, and delicate spacing tokens (`#f6f2eb` warm sand canvas, `#15190d` deep forest text). Strict validation rules and field length constraints must be enforced in the CMS editing studio to prevent editorial overflow from breaking frontend layout geometry.

---

## 2. Recommended Headless CMS Architecture

The front-end is natively architected for Next.js App Router. We recommend:
- **Primary Recommendation:** **Sanity.io** (or **Payload CMS 3.0** with Next.js native integration)
  - Live visual editing and real-time previews.
  - Image pipeline with focal-point cropping and automatic WebP/AVIF generation.
  - Portable Text for rich editorial insights without arbitrary HTML injection.
- **Alternative:** **Strapi v5** or **Contentful** with Webhooks targeting Next.js On-Demand Revalidation (`revalidatePath` / `revalidateTag`).

---

## 3. Schema Models & Content Collections

### Collection 1: Practice Areas & Services (`service`)

| Field Name | API Identifier | Field Type | Validation / Constraints | UI Placement |
| :--- | :--- | :--- | :--- | :--- |
| Title | `title` | String | Max 50 chars. Required. | Hero, Cards, Accordion, Mega-Menu |
| Slug | `slug` | Slug | Auto-generated from title. Unique. | URL route `/services#[slug]` |
| Category | `category` | String | Single select: `Ecological`, `Regulatory`, `Resilience`, `Remediation` | Filter badge |
| Short Description | `shortDescription` | Text | Max 120 chars. Required. | Mega-menu, Home card, Service row |
| Full Description | `fullDescription` | Text (Multi-line) | Max 350 chars. Required. | Services Catalog master row |
| Primary Image | `image` | Image | Aspect Ratio: 16:10 or 4:3, Min 1200x800. WebP/JPG. | Card preview / Visual lead |
| Deliverables | `deliverables` | Array of Strings | Min 3, Max 5 items. Max 45 chars per item. | Bulleted deliverable pill list |
| Methodology Steps | `methodology` | Array of Objects | Exactly 3 steps. Each: `stepNumber`, `title` (30 chars), `desc` (80 chars) | Detailed service accordion |
| Featured On Home | `featuredHome` | Boolean | Default: false. Max 3 true at any time. | Section S04 (Visionary) / S05 |

---

### Collection 2: Environmental Insights & Articles (`article`)

| Field Name | API Identifier | Field Type | Validation / Constraints | UI Placement |
| :--- | :--- | :--- | :--- | :--- |
| Title | `title` | String | Max 90 chars. Required. | Blog card, Article H1 |
| Slug | `slug` | Slug | Auto-generated from title. Unique. | `/blog/[slug]` |
| Publish Date | `publishDate` | Date | Required. Format: `YYYY-MM-DD`. | Metadata bar, Blog index |
| Category | `category` | String | Select: `Wetland Ecology`, `Regulatory Compliance`, `Coastal Resilience`, `Site Remediation`, `Biodiversity Strategy`, `Impact Assessment` | Badge / Filter Tab |
| Read Time | `readTime` | String | Format: `X min read`. Max 15 chars. | Metadata pill |
| Excerpt / Summary | `excerpt` | Text | Max 160 chars. Used for SEO meta-description. | Blog index card |
| Hero Banner Image | `heroImage` | Image | 16:9 ratio, Min 1920x1080. Hotspot enabled. | Article hero (S25) |
| Inline Figure Image | `inlineImage` | Image | 16:9 or 3:2, Min 1400x900. Optional. | Article body figure (S26) |
| Figure Caption | `figureCaption` | String | Max 120 chars. | Below inline figure |
| Article Body | `body` | Rich Text / Portable Text | Headings (H2, H3), Paragraphs, Blockquotes, Bullet lists. No raw H1. | Article editorial (S26) |
| Author Name | `authorName` | String | Max 50 chars. | Author byline |
| Author Role | `authorRole` | String | Max 60 chars. | Author sub-title |
| Author Avatar | `authorAvatar` | Image | 1:1 square, Min 200x200. | Author byline portrait |

---

### Collection 3: Team & Scientific Advisory (`teamMember`)

| Field Name | API Identifier | Field Type | Validation / Constraints | UI Placement |
| :--- | :--- | :--- | :--- | :--- |
| Full Name | `name` | String | Max 45 chars. Required. | Team card H3 |
| Role Title | `role` | String | Max 50 chars. Required. | Team card subline |
| Bio / Specialization | `bio` | Text | Max 110 chars. Required. | Team hover / About team card |
| Portrait Image | `portrait` | Image | 3:4 portrait or 1:1, Min 800x1000. Monochromatic / neutral tone. | Team card visual (S15) |
| Display Order | `displayOrder` | Integer | Ascending sort index (1 to 10). | Order in team grid |

---

### Collection 4: Frequently Asked Questions (`faq`)

| Field Name | API Identifier | Field Type | Validation / Constraints | UI Placement |
| :--- | :--- | :--- | :--- | :--- |
| Question | `question` | String | Max 100 chars. Required. | Accordion toggle header |
| Answer | `answer` | Text (Multi-line) | Max 300 chars. Required. Clear, plain-language text. | Accordion drawer body |
| Scope Category | `category` | String | Select: `General`, `Permitting`, `Field Surveys`, `Deliverables` | Section routing |
| Display Order | `displayOrder` | Integer | Ascending order (1 to 10). | FAQ list order |

---

### Collection 5: Global Site Settings & Brand Identity (`siteSettings`)

| Field Name | API Identifier | Field Type | Validation / Constraints | UI Placement |
| :--- | :--- | :--- | :--- | :--- |
| Brand Name | `brandName` | String | Fixed: `Alderline Environmental` | Meta titles, Navbar |
| Tagline | `tagline` | String | Fixed: `Environmental insight. Practical solutions.` | Subheaders, Footer |
| Contact Email | `contactEmail` | Email | Valid email address. | Footer, Contact page |
| Contact Phone | `contactPhone` | String | Phone format `+1 (555) 019-2834` | Footer, Contact page |
| Headquarters | `headquarters` | String | Max 80 chars. | Footer, Contact page |
| Notice / Disclaimer | `disclaimerText` | Text | Required for demonstration status notice. | Footer bottom bar |
| Navigation Links | `navLinks` | Array of Objects | Label (20 chars max), Target URL (`/about`, `/services`, etc.) | Desktop & Mobile navbar |

---

## 4. Visual Layout Constraints & Failure Risk Analysis

The Alderline Environmental design system uses proportional CSS grid structures and fixed-ratio containers. Unconstrained editorial inputs present specific layout failure modes:

### Risk 1: Hero Section Capability Pills (Section S02)
- **Constraint:** The hero bottom marquee/pill container accommodates 8 to 12 capability chips.
- **Risk:** If an editor inputs pills with >30 characters or adds >15 items, the flex wrap forces multi-line expansion that pushes the hero image/video down, creating an unwanted gap above Section S03.
- **Enforcement:** Enforce maximum 12 items in CMS; enforce `maxLength: 28` per pill.

### Risk 2: Core Expertise Card Headlines (Section S04 - Visionary Section)
- **Constraint:** Cards are arranged in a 3-column desktop grid with fixed aspect ratio image overlays (`wetlands.jpg`, `site-assessment.jpg`, `permitting.jpg`).
- **Risk:** Headline text exceeding 3 lines (>45 characters) causes card height desynchronization, leaving uneven white-space gaps across the 3 cards.
- **Enforcement:** Enforce `maxLength: 40` for card titles; `maxLength: 130` for short summaries.

### Risk 3: Testimonial & Credibility Metric Callouts (Section S06)
- **Constraint:** The two credibility cards (`FIELD-LED` and `PERMIT-FOCUSED`) rely on large stat callouts and structured 2-column comparison blocks.
- **Risk:** Injecting arbitrary paragraphs without stat badges breaks the card's asymmetric balance against the client quote.
- **Enforcement:** Strict schema with dedicated fields: `badgeTitle` (max 18 chars), `metricNumber` (max 8 chars), `description` (max 100 chars).

### Risk 4: Mega-Menu Link Labels (Section S01 - Navbar)
- **Constraint:** The desktop mega-menu dropdown is organized into 2 columns with an accent image card.
- **Risk:** Long titles cause text wrapping onto 3 lines, overflowing past the bottom of the dropdown shadow container.
- **Enforcement:** Enforce maximum 32 characters for service names in the navigation array.

---

## 5. Migration Strategy from Static Stores to Headless CMS

```
┌───────────────────────────────────────┐
│ Current State: Static Typed Data      │
│  - src/lib/alderline-content.ts       │
│  - src/lib/blog-data.ts               │
└──────────────────┬────────────────────┘
                   │
                   ▼ Phase 1: Client Schema Definition
┌───────────────────────────────────────┐
│ Sanity / Payload Schema Creation      │
│  - Migrate typescript types to schemas │
│  - Import initial JSON seed files     │
└──────────────────┬────────────────────┘
                   │
                   ▼ Phase 2: Next.js Data Fetching Layer
┌───────────────────────────────────────┐
│ lib/cms-client.ts                     │
│  - createClient() with ISR tags       │
│  - getFeaturedServices(), getArticles()│
└──────────────────┬────────────────────┘
                   │
                   ▼ Phase 3: Route Integration & ISR
┌───────────────────────────────────────┐
│ Dynamic Server Components             │
│  - /blog/[slug]/page.tsx              │
│  - /services/page.tsx                 │
│  - On-demand revalidation webhooks    │
└───────────────────────────────────────┘
```

1. **Step 1 — Export Seed Data:** Run a Node script to dump `src/lib/alderline-content.ts` and `src/lib/blog-data.ts` to `seed.json`.
2. **Step 2 — Initialize CMS Workspace:** Configure Sanity Studio (or Payload) with the collections specified above.
3. **Step 3 — Replace Imports:** Update `src/app/blog/page.tsx` and `src/app/services/page.tsx` from direct array access to `await getArticles()` with `next: { tags: ['articles'] }`.
4. **Step 4 — Add On-Demand Revalidation Route:** Add `src/app/api/revalidate/route.ts` to process CMS webhooks and purge cache tags on publish.
