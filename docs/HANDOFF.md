# IntegraVity — Architect Handoff Document

## 1. Project Initialization Summary

The foundational architecture for **IntegraVity** has been established and verified by **Integravity** (Lead Architect). The codebase is ready for **OpenCode** (Implementation Engineer) to begin component and interface delivery.

- **Project Name**: IntegraVity (Environmental Consulting Website Template & CMS)
- **Architecture Model**: Single-Tenant Reusable Template (NOT Multitenant SaaS)
- **Codebase Health**:
  - TypeScript Strict Checking: **PASSED (0 errors)**
  - ESLint Validation: **PASSED (0 errors, 0 warnings)**
  - Vitest Test Suites: **PASSED (15/15 tests passed)**
  - Next.js Turbopack Production Build: **PASSED (17/17 routes compiled successfully)**

---

## 2. Verified Technology Stack & Installed Packages

All core dependencies are installed and mutually compatible:

- **Next.js**: `16.3.6` (App Router, Turbopack enabled)
- **React / React DOM**: `19.2.8`
- **TypeScript**: `5.x` (Strict mode)
- **Tailwind CSS**: `v4` (`@tailwindcss/postcss: ^4`, `tailwindcss: ^4`)
- **UI Components**: `shadcn/ui` (style: `base-nova`, `@base-ui/react`, `@radix-ui/react-slot`)
- **Icons**: `lucide-react: ^1.48.0`
- **Animations**: `motion: ^13.4.4`
- **Backend & Auth**: `@supabase/ssr: ^0.12.7`, `@supabase/supabase-js: ^2.117.2`
- **Input Validation**: `zod: ^4.6.5`
- **Testing**: `vitest: ^5.0.2`, `@testing-library/react: ^16.3.3`, `jsdom: ^30.1.1`

---

## 3. Directory Scaffold & Core Architecture

```
s:/Apps/consultant/
├── docs/                     # 9 comprehensive architectural guides
│   ├── ARCHITECTURE.md       # Full system architecture and data flow
│   ├── BACKEND_SECURITY.md   # Auth, RLS, secret management, and validation
│   ├── CMS_SCHEMA.md         # 10 database entities, relationships, migrations
│   ├── DECISIONS.md          # Architectural Decision Records (ADRs)
│   ├── DESIGN_SYSTEM.md      # Tokens, typography scale, editorial containers
│   ├── EXECUTION_PLAN.md     # 10 sequential delivery phases
│   ├── HANDOFF.md            # This handoff document
│   ├── PROJECT_BRIEF.md      # Commercial goals, audience, and scope boundaries
│   └── TASKS.md              # Actionable backlog with explicit acceptance criteria
├── supabase/
│   └── migrations/
│       └── 20260927000000_initial_schema.sql  # Complete PostgreSQL schema & RLS
├── src/
│   ├── app/
│   │   ├── (public)/         # Public layout, homepage, services, contact
│   │   ├── admin/            # Administrative CMS layout, dashboard, management subroutes
│   │   ├── api/health/       # System health check route
│   │   ├── globals.css       # Tailwind v4 theme, Forest/Ivory tokens, utilities
│   │   ├── layout.tsx        # Root HTML layout, font injection, JSON-LD
│   │   ├── robots.ts         # Robots.txt generator
│   │   └── sitemap.ts        # Dynamic sitemap.xml generator
│   ├── components/
│   │   ├── admin/            # Reusable CMS tables and controls
│   │   ├── animations/       # Motion wrappers with reduced-motion support
│   │   ├── forms/            # Contact and CMS mutation forms
│   │   ├── layout/           # Header, Navigation, Footer
│   │   ├── sections/         # Reusable homepage sections
│   │   ├── seo/              # JsonLd structured data components
│   │   └── ui/               # shadcn/ui primitives (button, card, input, textarea)
│   ├── lib/
│   │   ├── auth/admin.ts     # Server-side auth gates (requireAdmin, assertAdmin)
│   │   ├── env.ts            # Fail-secure environment accessor
│   │   ├── seo/              # Metadata generators and Schema.org builders
│   │   ├── supabase/         # Server, client, and admin Supabase clients
│   │   ├── utilities/        # Formatters, slugify, truncate
│   │   └── validations/      # Zod validation schemas
│   ├── proxy.ts              # Edge cookie refresher & admin route guard
│   └── types/                # Domain models, database types, and CMS interfaces
```

---

## 4. Known Limitations & Prerequisites

1. **Supabase Environment Credentials**:
   - The project is configured with fail-secure defaults. Public routes render placeholder content; administrative routes display the setup banner and lock down actions.
   - To connect a live database prior to Phase 6, copy `.env.example` to `.env.local` and populate `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
2. **Phase 1 Boundary**:
   - The homepage sections in `src/app/(public)/page.tsx` and header/footer in `src/app/(public)/layout.tsx` are structural scaffolds awaiting Phase 2 and Phase 3 implementation.

---

## 5. Immediate Next Task for OpenCode

The very next task for **OpenCode** is **Task 2.1**:

> **Task 2.1: Implement Design System Primitives, Public Header & Footer**
>
> - Target Files: `src/components/layout/Header.tsx`, `Navigation.tsx`, `MobileNav.tsx`, `Footer.tsx`, and `src/app/(public)/layout.tsx`.
> - Specification: Follow `docs/DESIGN_SYSTEM.md` and acceptance criteria in `docs/TASKS.md`.

---

## 6. Task 2.1 Implementation Results (OpenCode)

**Status: COMPLETE — all acceptance criteria met and verified (2026-09-26).**

### 6.1 Files Created / Modified

| File                                   | Change           | Purpose                                                                                                                                                                                        |
| :------------------------------------- | :--------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/components/layout/Header.tsx`     | Created (client) | Sticky header shell: brand mark, desktop `<Navigation />`, mobile toggle (`aria-expanded` / `aria-controls`), drawer state, focus restore on close                                             |
| `src/components/layout/Navigation.tsx` | Created (client) | Desktop links from `siteConfig.navigation.public` with active-page `aria-current="page"`; "Request a Consultation" CTA in Forest Green (`buttonVariants` default)                              |
| `src/components/layout/MobileNav.tsx`  | Created (client) | Accessible drawer: `role="dialog"` + `aria-modal`, focus trap, Escape-to-close, focus restore, body scroll lock, blurred click-to-close backdrop, `useReducedMotion()` support                 |
| `src/components/layout/Footer.tsx`     | Created (server) | Charcoal footer: brand, demo credentials, office address/phone/email/hours, footer nav, legal links, copyright, mandatory illustrative-content disclaimer                                      |
| `src/app/(public)/layout.tsx`          | Modified         | Mounts `<Header />` and `<Footer />`, replacing placeholder blocks                                                                                                                             |
| `src/app/globals.css`                  | Modified         | Registered brand palette in `@theme inline` (`--color-brand-forest/ivory/sage/charcoal`) so brand utilities (`bg-brand-forest`, `text-brand-sage`, …) are first-class design-system primitives |
| `tests/ui/navigation.test.tsx`         | Created          | 12 tests: brand/nav/CTA links, active state, drawer open/Escape, focus in/out, Tab trapping (forward + backward wrap), backdrop click, footer disclaimer/credentials/address/copyright/legal   |

### 6.2 Design Decisions

- **Valid CTA markup**: CTAs are anchors styled via `buttonVariants()` instead of `<Button>` nested inside `<Link>` — avoids invalid interactive-element nesting.
- **Header stacking**: sticky header at `z-40`; blurred backdrop at `z-30` so the header bar (and toggle) stays visible/clickable above the dimmed page.
- **Motion**: drawer uses `motion/react` with the DESIGN_SYSTEM easing (`cubic-bezier(0.16, 1, 0.3, 1)`, 200–400ms) and fully disables animation under `prefers-reduced-motion`.
- **Test mocks**: `next/link` stubbed as a plain anchor and `usePathname` mocked for deterministic jsdom rendering; drawer-exit assertions use `waitFor` to account for the AnimatePresence exit animation.

### 6.3 Verification Results (2026-09-26)

| Command             | Result                                       |
| :------------------ | :------------------------------------------- |
| `npm run typecheck` | ✅ PASSED (0 errors)                         |
| `npm run lint`      | ✅ PASSED (0 errors, 0 warnings)             |
| `npm run test`      | ✅ PASSED (27/27 — 13 node + 14 UI)          |
| `npm run build`     | ✅ PASSED (17/17 routes compiled, Turbopack) |

### 6.4 Known Pre-Existing Issue (Not Introduced by This Task)

- ~~`npm run format:check` fails **repo-wide (47 files)**~~ — **RESOLVED**: Integravity applied and verified a repo-wide Prettier pass after Task 2.1 review. `npm run format:check` now passes on all files.

### 6.5 Next Task

**Task 2.2: Motion Wrappers & Animation Primitives** (`FadeIn`, `SlideUp`, `index.ts` in `src/components/animations/`) — **completed in §7 below.**

---

## 7. Task 2.2 Implementation Results (OpenCode)

**Status: COMPLETE — all acceptance criteria met and verified (2026-09-27).**

### 7.1 Files Created / Modified

| File                                     | Change           | Purpose                                                                                                                                                                         |
| :--------------------------------------- | :--------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `src/components/animations/FadeIn.tsx`   | Created (client) | Scroll-reveal wrapper: `opacity 0 → 1` on viewport entry (`whileInView`, `viewport: { once: true }`) with `useReducedMotion()` plain-`<div>` fallback                           |
| `src/components/animations/SlideUp.tsx`  | Created (client) | Scroll-reveal wrapper: `opacity 0 → 1` + `y: 16px → 0px` per DESIGN_SYSTEM §6.3, with the same reduced-motion plain-`<div>` fallback                                            |
| `src/components/animations/constants.ts` | Created          | Single source of truth for the motion contract: `EASE_OUT_EXPO = [0.16, 1, 0.3, 1]`, `DEFAULT_DURATION = 0.4` (within the required 0.3–0.4s range)                              |
| `src/components/animations/index.ts`     | Modified         | Replaced the placeholder export with `FadeIn`, `SlideUp`, and the motion-contract constants — pages never import from `motion/react` directly                                   |
| `tests/ui/animations.test.tsx`           | Created          | 7 tests: children rendering, className pass-through, initial hidden state (`opacity: 0`, `16px` transform), plain-`<div>` reduced-motion rendering (no motion styles), contract |

### 7.2 Design Decisions

- **Reduced motion = static markup, not motion props**: when `useReducedMotion()` is truthy, both wrappers early-return a plain `<div className={…}>` — no `initial`/`transition` props exist at all, so zero transform/opacity/delay can leak through.
- **Shared constants module**: easing and default duration live in `constants.ts` (not duplicated per wrapper) and are re-exported from the barrel so Phase 3 sections share one motion contract.
- **`viewport: { once: true }`**: elements reveal once and stay visible — no re-triggering on scroll-up; `amount` left at the default (`"some"`) so very tall sections (heroes) still trigger.
- **Deterministic tests**: `motion/react` is mocked with `importActual` (real components kept, `useReducedMotion` swapped for a controllable mock), and a minimal `IntersectionObserver` stub is installed because `whileInView` observes on mount.

### 7.3 Verification Results (2026-09-27)

| Command                | Result                                       |
| :--------------------- | :------------------------------------------- |
| `npm run typecheck`    | ✅ PASSED (0 errors)                         |
| `npm run lint`         | ✅ PASSED (0 errors, 0 warnings)             |
| `npm run test`         | ✅ PASSED (34/34 — 13 node + 21 UI)          |
| `npm run build`        | ✅ PASSED (17/17 routes compiled, Turbopack) |
| `npm run format:check` | ✅ PASSED (all files)                        |

### 7.4 Next Task

**Phase 3 (Task 3.1): Immersive Hero & Credibility Metrics** — first consumers of `FadeIn`/`SlideUp` in `src/components/sections/` — **completed in §8 below.**

---

## 8. Task 3.1 Implementation Results (OpenCode)

**Status: COMPLETE — all acceptance criteria met and verified (2026-09-27).**

### 8.1 Files Created / Modified

| File                                             | Change           | Purpose                                                                                                                                                                                                                                                      |
| :----------------------------------------------- | :--------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/components/sections/HeroSection.tsx`        | Created (server) | Immersive Forest Green hero: `text-eyebrow` tag, `text-display-xl` H1 (`siteConfig.tagline`), lead paragraph, dual CTAs (`/contact` ivory primary, `/services` sage-outlined), entrance via `FadeIn`/`SlideUp`, full-viewport height, decorative sage radial |
| `src/components/sections/CredibilitySection.tsx` | Created (server) | Ivory contrast surface: 4-column metric grid (1,200+ acres · 99.4% approval · 12 certifications · 20+ years) with Sage hairline rules, `text-display-md` figures, `FadeIn` reveal, mandatory disclaimer                                                      |
| `src/components/sections/index.ts`               | Modified         | Replaced placeholder with `HeroSection` / `CredibilitySection` exports                                                                                                                                                                                       |
| `tests/ui/hero.test.tsx`                         | Created          | 4 tests: eyebrow + display headline + brand background, both CTA hrefs and brand-token styles, 4-column grid values/labels/responsive classes, mandatory disclaimer text                                                                                     |

### 8.2 Design Decisions

- **Server components, client wrappers**: both sections are server components rendering the client `FadeIn`/`SlideUp` wrappers — animation never turns section content into client JS beyond the wrapper.
- **CTA hierarchy on dark**: primary CTA inverts to Warm Ivory (`bg-brand-ivory` / Forest text) for maximum prominence on the Forest surface; secondary uses a Sage ghost outline — both built on `buttonVariants` so focus rings and transitions come from the shared button system.
- **Immersive height**: `min-h-[calc(100svh_-_4rem)]` (header height accounted for) centers the hero exactly in the first viewport; a subtle sage radial gradient is decorative and `aria-hidden`.
- **Metric semantics**: metrics are an accessible `<ul>` (value + label pairs) under an `aria-labelledby`-linked `h2`, each cell with a 1px Sage top rule per the design system's "crisp borders, no shadows" elevation rule.
- **Copy source**: the H1 uses `siteConfig.tagline` so the headline stays config-driven.
- **Homepage NOT modified**: `src/app/(public)/page.tsx` still shows the Phase 1 scaffold — assembly of all 8 sections is Task 3.4 per docs/TASKS.md.

### 8.3 Verification Results (2026-09-27)

| Command                | Result                                       |
| :--------------------- | :------------------------------------------- |
| `npm run typecheck`    | ✅ PASSED (0 errors)                         |
| `npm run lint`         | ✅ PASSED (0 errors, 0 warnings)             |
| `npm run test`         | ✅ PASSED (38/38 — 13 node + 25 UI)          |
| `npm run build`        | ✅ PASSED (17/17 routes compiled, Turbopack) |
| `npm run format:check` | ✅ PASSED (all files)                        |

### 8.4 Next Task

**Task 3.2: Core Services Grid & Industries Section** (`ServicesGrid`, `IndustriesSection` in `src/components/sections/`) — **completed in §9 below.**

---

## 9. Task 3.2 Implementation Results (OpenCode)

**Status: COMPLETE — all acceptance criteria met and verified (2026-09-27).**

### 9.1 Files Created / Modified

| File                                            | Change           | Purpose                                                                                                                                                                                                                                                                                     |
| :---------------------------------------------- | :--------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `src/components/sections/ServicesGrid.tsx`      | Created (server) | 4 core service cards (Wetland Delineation, Environmental Permitting, Phase I/II ESAs, Ecological Planning): Lucide icon tile, title, description, whole-card link to `/services/[slug]`, 1px border → `hover:border-brand-sage` (`transition-all duration-300`), staggered `SlideUp` reveal |
| `src/components/sections/IndustriesSection.tsx` | Created (server) | Editorial two-column layout: heading block left, ruled index of 4 target sectors (Infrastructure, Commercial Development, Renewable Energy, Municipal/Watershed) with compliance-relevance descriptions, `FadeIn` reveal                                                                    |
| `src/components/sections/index.ts`              | Modified         | Added `ServicesGrid` / `IndustriesSection` exports                                                                                                                                                                                                                                          |
| `tests/ui/services-industries.test.tsx`         | Created          | 6 tests: 4 card headings, `/services/[slug]` hrefs, Lucide icon per card, border/hover classes, sector headings, compliance-relevance descriptions                                                                                                                                          |

### 9.2 Design Decisions

- **Real route links**: card slugs mirror the planned routes already declared in `src/app/(public)/services/page.tsx` (`wetland-delineation`, `environmental-permitting`, `environmental-assessments`, `environmental-planning`) — no broken links today, and a code comment pins both files to stay in sync until Phase 6/7 CMS data replaces them.
- **Spec display titles kept**: cards show the required titles (Phase I/II ESAs, Ecological Planning) while linking to the existing slug contract.
- **Valid list semantics**: `SlideUp` sits _inside_ each `<li>` (wrapping the card) so `<ul>` children remain `<li>` elements; `h-full` chain keeps cards equal-height per grid row.
- **Card interaction**: whole-card anchor with icon tile inverting to Forest/ivory on hover, Sage border transition, and a nudging Learn-more arrow (`group-hover:translate-x-1`) — all within the design system's 300ms / no-shadow elevation rules.
- **Section rhythm**: muted surface for services (white cards pop) → ivory surface for industries (ruled index), continuing the forest → ivory → muted → ivory editorial cadence from Tasks 3.1.

### 9.3 Verification Results (2026-09-27)

| Command                | Result                                       |
| :--------------------- | :------------------------------------------- |
| `npm run typecheck`    | ✅ PASSED (0 errors)                         |
| `npm run lint`         | ✅ PASSED (0 errors, 0 warnings)             |
| `npm run test`         | ✅ PASSED (44/44 — 13 node + 31 UI)          |
| `npm run build`        | ✅ PASSED (17/17 routes compiled, Turbopack) |
| `npm run format:check` | ✅ PASSED (all files)                        |

### 9.4 Next Task

**Task 3.3: Case Study Spotlight & Approach Timeline** (`CaseStudySpotlight`, `ApproachSection` in `src/components/sections/`) — **completed in §10 below.**

---

## 10. Task 3.3 Implementation Results (OpenCode)

**Status: COMPLETE — all acceptance criteria met and verified (2026-09-27).**

### 10.1 Files Created / Modified

| File                                             | Change           | Purpose                                                                                                                                                                                                                                                                                                                      |
| :----------------------------------------------- | :--------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/components/sections/CaseStudySpotlight.tsx` | Created (server) | Editorial split-screen on the Forest Green authoritative-callout surface: narrative column (client metadata `dl`, ecological challenge, technical solution, 3 quantifiable results — 42 acres restored / 100% concurrence / 11-month timeline, `/contact` CTA, mandatory disclaimer) beside a sticky ivory site-record plate |
| `src/components/sections/ApproachSection.tsx`    | Created (server) | Editorial 4-column grid (`ol`) with hairline Sage top rules and display-serif step numbers: 01 Desktop Constraints → 02 Field Delineation → 03 Permitting Strategy → 04 Compliance & Monitoring                                                                                                                              |
| `src/components/sections/index.ts`               | Modified         | Added `CaseStudySpotlight` / `ApproachSection` exports                                                                                                                                                                                                                                                                       |
| `tests/ui/case-study-approach.test.tsx`          | Created          | 6 tests: project metadata + `/#projects` anchor, challenge/solution copy, results metrics, CTA + disclaimer, phase order + `/#approach` anchor, step numbers/hairlines + phase descriptions                                                                                                                                  |

### 10.2 Design Decisions

- **Nav anchors wired**: the section carries `id="projects"` and `id="approach"`, making the existing `siteConfig` nav links `/#projects` and `/#approach` resolve to real targets (both IDs asserted in tests).
- **Forest Green callout surface**: the featured case study uses the design system's "authoritative callout" treatment (Forest background, ivory/sage text), breaking the ivory run — hero forest → credibility ivory → services muted → industries ivory → **case study forest** → approach ivory.
- **Split-screen without photography**: `public/images/` is empty, so the media column is a typographic "site record" plate (coordinates, site type, hydrology, works window) styled as a field-notebook spec sheet — sticky on `lg` so it stays in view while reading the narrative.
- **Copy placed in JS constants**: all prose lives in typed consts (not inline JSX text), which avoids entity/quote pitfalls and keeps test regexes stable.
- **Disclaimer**: uses the canonical mandatory string verbatim: "All illustrative statistics, certifications, and case studies shown are demonstrations."
- **Approach semantics**: rendered as an ordered list (`<ol>`) — sequence is part of the methodology — with `border-t border-brand-sage` hairlines per step, matching the credibility-section rule language.

### 10.3 Verification Results (2026-09-27)

| Command                | Result                                       |
| :--------------------- | :------------------------------------------- |
| `npm run typecheck`    | ✅ PASSED (0 errors)                         |
| `npm run lint`         | ✅ PASSED (0 errors, 0 warnings)             |
| `npm run test`         | ✅ PASSED (50/50 — 13 node + 37 UI)          |
| `npm run build`        | ✅ PASSED (17/17 routes compiled, Turbopack) |
| `npm run format:check` | ✅ PASSED (all files)                        |

### 10.4 Next Task

**Task 3.4: Team Credentials, FAQs & Consultation CTA** (`TeamSection`, `FaqSection`, `ConsultationCta` in `src/components/sections/` + homepage assembly in `src/app/(public)/page.tsx`) — **completed in §11 below. Phase 3 complete.**

---

## 11. Task 3.4 Implementation Results (OpenCode)

**Status: COMPLETE — all acceptance criteria met and verified (2026-09-27). Phase 3 (Homepage Sections) finished.**

### 11.1 Files Created / Modified

| File                                          | Change           | Purpose                                                                                                                                                                                                                                                                                                                                                                      |
| :-------------------------------------------- | :--------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/components/sections/TeamSection.tsx`     | Created (server) | `id="team"` section on the muted surface: 4 editorial white cards — initials monogram, name, role, Sage-hairline credential chips (**PWS, PE, CPSS, CEP**), and agency background summaries (Army Corps, state DOT, NRCS, planning commission); staggered `SlideUp` reveal                                                                                                   |
| `src/components/sections/FaqSection.tsx`      | Created (client) | `id="faq"` split-layout accessible accordion: 4 technical answers (delineation regulations, ASTM E1527-21/AAI triggers, permitting durations, bespoke fee proposals), WAI-ARIA pattern with `aria-expanded`/`aria-controls`, labelled regions, Arrow/Home/End key navigation, single-open panels with first open by default, `prefers-reduced-motion`-aware height animation |
| `src/components/sections/ConsultationCta.tsx` | Created (server) | High-contrast Forest Green closing banner: headline, ivory `/contact` CTA, plus direct `tel:` and `mailto:` channel buttons (contact values mirrored from the Footer until Phase 6/7 CMS wiring)                                                                                                                                                                             |
| `src/components/sections/index.ts`            | Modified         | Added `TeamSection` / `FaqSection` / `ConsultationCta` exports                                                                                                                                                                                                                                                                                                               |
| `src/app/(public)/page.tsx`                   | Modified         | Scaffold replaced by the complete 9-section narrative (hero → credibility → services → industries → case study → approach → team → FAQ → CTA); metadata description now reuses `siteConfig.description`                                                                                                                                                                      |
| `tests/ui/homepage.test.tsx`                  | Created          | 6 tests: 9-section structure + nav anchor ids + heading order, team credentials/agency backgrounds, accordion ARIA toggle + `aria-controls` wiring, Arrow/Home/End keyboard navigation, CTA banner channels                                                                                                                                                                  |

### 11.2 Design Decisions

- **Anchor contract completed**: homepage now provides all four nav anchor targets — `#projects`, `#approach`, `#faq` (nav-linked), plus the requested `#team`; every id is asserted in tests.
- **FaqSection is the only fully client section**: it carries `"use client"` for the accordion; everything else stays a server component with client animation wrappers only. The accordion is hand-built (no `ui/accordion` primitive exists in the component set) following the WAI-ARIA accordion pattern — real `<button>` inside `<h3>`, `aria-controls` → panel region `aria-labelledby` back to the trigger, focus moved by Arrow keys with Home/End wrapping.
- **Accordion details**: one panel open at a time, **first open by default** so answers exist in the prerendered HTML (SEO/no-JS content); panel height/opacity animation reuses the shared `DEFAULT_DURATION`/`EASE_OUT_EXPO` contract with `duration: 0` under `prefers-reduced-motion`; chevron indicator uses `motion-safe:` transitions.
- **Pricing-rule alignment**: the fourth FAQ explicitly explains why no fixed price list is published (bespoke scopes → written itemized proposals), mirroring the AGENTS.md §5.5 CMS pricing rule.
- **Surface rhythm finalized**: forest hero → ivory credibility → muted services → ivory industries → forest case study → ivory approach → muted team → ivory FAQ → **forest CTA** → charcoal footer.
- **Contact channel duplication**: `ConsultationCta` mirrors the Footer's demo contact constants with a comment pinning both to Phase 6/7 `site_settings` (same sync-comment pattern as the service slugs).
- **CTA variant overrides**: all three banner links styled via `buttonVariants()` (verified `cn` is the shadcn clsx+tailwind-merge package, so class overrides resolve correctly — consistent with Task 3.1/3.3 precedent).

### 11.3 Verification Results (2026-09-27)

| Command                | Result                                       |
| :--------------------- | :------------------------------------------- |
| `npm run typecheck`    | ✅ PASSED (0 errors)                         |
| `npm run lint`         | ✅ PASSED (0 errors, 0 warnings)             |
| `npm run test`         | ✅ PASSED (56/56 — 13 node + 43 UI)          |
| `npm run build`        | ✅ PASSED (17/17 routes compiled, Turbopack) |
| `npm run format:check` | ✅ PASSED (all files)                        |

### 11.4 Next Task

Awaiting Integravity's review of Phase 3 completion. Next assigned work per `docs/TASKS.md`: **Phase 4 (Service Detail Pages)** — Task 4.1 completed in §12 below.

---

## 12. Task 4.1 Implementation Results (OpenCode)

**Status: COMPLETE — all acceptance criteria met and verified (2026-09-27). Phase 4 (Dynamic Service Pages) complete.**

### 12.1 Files Created / Modified

| File                                        | Change             | Purpose                                                                                                                                                                                                                                                                                                                                                                            |
| :------------------------------------------ | :----------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/config/services.ts`                    | Created            | Single source of truth for the service catalog: `ServiceDetail` records for all 4 slugs (summary, framework badges, deliverables, problem-context paragraphs, methodology milestones, optional `pricingNote`), slug-keyed `services` lookup, `serviceList` array, and the `hasPricingNote()` pricing-rule guard                                                                    |
| `src/app/(public)/services/page.tsx`        | Rewritten          | Comprehensive catalog: header block + 2-column card grid — framework badge pills, linked discipline titles, summaries, key-deliverables checklists, "View service →" links — closing with the shared `ConsultationCta` banner                                                                                                                                                      |
| `src/app/(public)/services/[slug]/page.tsx` | Rewritten          | Next 16 dynamic template: awaited `params`, `generateStaticParams()` returning the 4 known slugs, `notFound()` for unrecognized slugs, `generateMetadata()` with per-slug title/description/canonical/OG, editorial deep dive (hero + framework badges + conditional pricing note + problem-context band + deliverables checklist + numbered methodology milestones) + closing CTA |
| `src/components/sections/ServicesGrid.tsx`  | Modified (comment) | Sync-comment retargeted from the old `plannedServices` scaffold to `src/config/services.ts` — no behavioral change (Task 3.2 component untouched otherwise)                                                                                                                                                                                                                        |
| `tests/ui/services-pages.test.tsx`          | Created            | 8 tests: catalog headings/links/deliverables/badges, catalog CTA banner, detail deep-dive content, pricing-note visibility for populated vs. null, `hasPricingNote()` null/empty/whitespace unit cases, `notFound()` rejection, `generateStaticParams` slugs, dynamic metadata + canonical + OpenGraph                                                                             |

### 12.2 Design Decisions

- **Shared catalog module**: slugs/content now live in `src/config/services.ts` instead of being duplicated per page — the catalog, the detail template, and (via the updated sync comment) the homepage `ServicesGrid` all reference one source. This becomes the natural adapter for the Phase 6-7 CMS `services` table.
- **Pricing Rule enforcement**: rendering goes exclusively through `hasPricingNote()` (`Boolean(note?.trim())`), so `null`, `""`, and whitespace-only values render **nothing** — no empty box, no "Pricing note" label. The wetland service ships a populated note (demonstrates display); the other three are `null`. Both paths are tested, plus unit coverage of the empty-string CMS edge case.
- **`notFound()` over silent fallback**: unknown slugs throw Next's `notFound()` (default `dynamicParams` still routes them through the page at request time), replacing the old fail-safe placeholder copy; `generateMetadata` returns catalog-level fallback copy for unknown slugs rather than leaking the raw slug into titles.
- **SSG proof**: the build now prerenders all 4 detail pages (`● /services/...` under `/services/[slug]`), taking the route count from 17 to 21.
- **Editorial detail template**: alternating ivory → muted (problem context) → ivory (deliverables + milestones) bands; milestones rendered as an `<ol>` with hairline top rules and zero-padded numbers, echoing the homepage approach grid; hero carries `buttonVariants` CTAs ("Discuss this service" / "All services").
- **Badge content**: framework pills cover the required references — CWA (delineation/permitting), NEPA (permitting/planning), ASTM (assessments) — and are asserted by tests on both pages.
- **Test approach**: `next/navigation` mocked so `notFound()` throws a deterministic `NEXT_NOT_FOUND` error asserted via `rejects.toThrow`; detail page invoked directly with `Promise.resolve({ slug })` (async RSC functions return plain element trees — no server needed).

### 12.3 Verification Results (2026-09-27)

| Command                | Result                                                      |
| :--------------------- | :---------------------------------------------------------- |
| `npm run typecheck`    | ✅ PASSED (0 errors)                                        |
| `npm run lint`         | ✅ PASSED (0 errors, 0 warnings)                            |
| `npm run test`         | ✅ PASSED (64/64 — 13 node + 51 UI)                         |
| `npm run build`        | ✅ PASSED (21/21 routes — 4 service pages SSG'd, Turbopack) |
| `npm run format:check` | ✅ PASSED (all files)                                       |

### 12.4 Next Task

Awaiting Integravity's review of Task 4.1. **Phase 4 has no remaining tasks** — next assigned work per `docs/TASKS.md`: **Task 5.1: Interactive Consultation Request Form** (Phase 5) — completed in §13 below.

---

## 13. Task 5.1 Implementation Results (OpenCode)

**Status: COMPLETE — all acceptance criteria met and verified (2026-09-27). Phase 5 (Contact Experience) complete.**

### 13.1 Files Created / Modified

| File                                   | Change    | Purpose                                                                                                                                                                                                                                                                                                                                          |
| :------------------------------------- | :-------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/app/actions/contact.ts`           | Created   | `"use server"` intake action: honeypot gate → `contactInquirySchema` validation (field errors keyed by input `name`) → RLS-enforced insert into `public.inquiries`; demo-mode graceful success with server logging when Supabase is unconfigured                                                                                                 |
| `src/components/forms/ContactForm.tsx` | Created   | Client form: 7 labeled fields (name, email, phone, organization, inquiryType select, message, consent) + hidden `companyWebsite` honeypot, `?service=` pre-selection via `resolveInquiryType()`, client-side schema validation with inline `role="alert"` errors, `useActionState` pending/disabled submit button, `role="status"` success panel |
| `src/app/(public)/contact/page.tsx`    | Rewritten | Editorial two-column layout — left: office details (mirrored from Footer with sync comment) + numbered "What to expect" timeline; right: `<ContactForm />` in a `Suspense` boundary (required for `useSearchParams` static prerendering); updated metadata                                                                                       |
| `src/components/forms/index.ts`        | Updated   | Replaced placeholder export with `export { ContactForm }`                                                                                                                                                                                                                                                                                        |
| `src/lib/validations/contact.ts`       | Extended  | Added `flattenContactIssues()` — shared Zod-issues → `{ field: message }` mapper so client and server error keys can never drift (no behavior change to the schema)                                                                                                                                                                              |
| `tests/ui/contact.test.tsx`            | Created   | 8 tests: field rendering/defaults, honeypot presence (name/tabindex/autocomplete/aria-hidden), `?service=` pre-selection + unknown-slug fallback, inline validation errors blocking the server call, pending/disabled button + FormData assertions + success confirmation, server-returned field errors, page two-column layout                  |

### 13.2 Design Decisions

- **Least-privilege storage path**: the action uses the **anon server client** (`@/lib/supabase/server`), so Postgres RLS is always enforced — the migration's public `INSERT ... WITH CHECK (TRUE)` policy on `inquiries` covers submission, and visitors still have zero `SELECT`. The service-role key stays out of the contact path entirely; `admin.ts`'s "contact intake" allowance remains available for future privileged maintenance but is not needed here. _(Flagged for Integravity review: this deviates from the looser reading of `admin.ts`'s allowed-uses comment.)_
- **Honeypot returns fake success**: a filled `companyWebsite` is discarded silently _before_ schema parsing and DB access (per BACKEND_SECURITY §6.2), returning the normal success message so bots learn nothing; only a `console.warn` records the event.
- **Demo mode**: `isSupabaseConfigured()` false (or `SupabaseNotConfiguredError` caught) → success response + `console.log` stating the inquiry was NOT stored — graceful template behavior without bypassing anything privileged.
- **Validation gate pattern**: `onSubmit` runs the shared schema client-side; invalid → `preventDefault()` + inline errors + focus first invalid field. Valid → **no** `preventDefault`, letting React dispatch the form's `action` inside its own transition (initially a manual `formAction(formData)` call was used; React's "called outside of a transition" warning showed `pending` never updated — fixed to the canonical pattern).
- **No effect-based error sync**: server-returned `fieldErrors` are _derived_ during render (`{ ...serverErrors, ...clientErrors }`) rather than copied in a `useEffect` — satisfies the `react-hooks/set-state-in-effect` rule; per-field edits still clear local errors immediately.
- **`ReadonlyURLSearchParams`**: tests build values through a small `searchParams()` helper with a cast (Next's readonly type rejects plain `URLSearchParams` in `mockReturnValue`).
- **Consent/company mapping**: schema field `organization` maps to the DB `company` column; consent checkbox submits `on` → `z.literal(true)` server-side.
- **`?service=` mapping**: service slugs map to inquiry types (`environmental-permitting`→`permitting`, `environmental-assessments`→`assessment`, `environmental-planning`→`planning`, `wetland-delineation`→`wetland-delineation`); raw enum values accepted too; unknown → `general`. Wiring service-page CTAs to `/contact?service=…` was out of scope — recommendation for a follow-up task.

### 13.3 Verification Results (2026-09-27)

| Command                | Result                                                       |
| :--------------------- | :----------------------------------------------------------- |
| `npm run typecheck`    | ✅ PASSED (0 errors)                                         |
| `npm run lint`         | ✅ PASSED (0 errors, 0 warnings)                             |
| `npm run test`         | ✅ PASSED (72/72 — 13 node + 59 UI)                          |
| `npm run build`        | ✅ PASSED (21/21 routes — `/contact` statically prerendered) |
| `npm run format:check` | ✅ PASSED (all files)                                        |

### 13.4 Next Task

Awaiting Integravity's review of Task 5.1. **Phase 5 has no remaining tasks** — next assigned work per `docs/TASKS.md`: **Task 6.1: Supabase Auth & Session Verification** (Phase 6 & 7).

---

## 14. Task 6.1 Implementation Results (OpenCode)

**Status: COMPLETE — all acceptance criteria met and verified (2026-09-27). Phase 6 & 7 kickoff: administrative sign-in, session establishment, and sign-out wiring.**

### 14.1 Files Created / Modified

| File                                      | Change     | Purpose                                                                                                                                                                                                                                                                                                                             |
| :---------------------------------------- | :--------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/lib/validations/auth.ts`             | Created    | `adminLoginSchema` (email format + non-empty password, password deliberately untrimmed) and `flattenAuthIssues()` — Zod issues → `{ field: firstMessage }` for inline errors, shared by form and action                                                                                                                             |
| `src/app/actions/auth.ts`                 | Created    | `"use server"`: `loginAdmin(prevState, formData)` — schema validation → `signInWithPassword` → fail-secure `admin_profiles` check → `redirect("/admin")`; `logoutAdmin()` — best-effort `signOut()` → `redirect("/admin/login")`                                                                                                    |
| `src/components/forms/AdminLoginForm.tsx` | Created    | Client form with `useActionState(loginAdmin, …)`: shared-schema client gate, merged server/client `fieldErrors` derived at render, `role="alert"` server message, pending → disabled button + `motion-safe:animate-spin` loader + `aria-busy`, security footnote                                                                    |
| `src/components/forms/FormField.tsx`      | Created    | Shared `Label` + control + inline `role="alert"` error wiring (`htmlFor` + `<id>-error`), extracted from `ContactForm`'s private `Field` so admin and Phase 7 CMS forms reuse identical markup                                                                                                                                      |
| `src/components/forms/ContactForm.tsx`    | Refactored | Local `Field` removed in favor of shared `FormField` — DOM output byte-identical; all 8 contact tests unchanged and green                                                                                                                                                                                                           |
| `src/components/forms/index.ts`           | Updated    | Added `AdminLoginForm` and `FormField` exports                                                                                                                                                                                                                                                                                      |
| `src/app/admin/login/page.tsx`            | Rewritten  | Async page: `getAdminUser()` → authenticated admins `redirect("/admin")`; otherwise renders `<AdminLoginForm />` centered in the editorial card shell; metadata kept `index: false`                                                                                                                                                 |
| `src/app/admin/layout.tsx`                | Updated    | Async layout with session header: brand + admin email + sign-out (`<form action={logoutAdmin}>` with `buttonVariants` styling); brand block moved from sidebar into the header; sidebar nav and `AdminConfigNotice` retained; still intentionally does **not** call `requireAdmin()`                                                |
| `tests/ui/admin-auth.test.tsx`            | Created    | 13 tests: form rendering, client-side validation blocking dispatch, server invalid-credentials feedback, pending/disabled state with recovery, `loginAdmin` success redirect, non-admin fail-secure, profile-lookup-error fail-secure, `logoutAdmin`, login-page redirect/render, layout email/sign-out/signed-out/unconfigured (3) |

### 14.2 Design Decisions

- **Fail-secure admin check inside the action**: after `signInWithPassword`, `loginAdmin` mirrors `hasAdminProfile()` from `src/lib/auth/admin.ts` (`.from("admin_profiles").select("user_id").eq("user_id", …).maybeSingle()`) using the **anon** client — the RLS `is_admin()` policy filters non-admins down to zero rows, so no service-role key is involved. Missing row **or** lookup error → `signOut()` + access-denied message (a valid password alone never grants `/admin`). The query is inlined rather than imported because `admin.ts` carries `import "server-only"`, which would break the jsdom test graph; a sync comment ties it to the canonical helper. _(Consistent with Task 5.1's least-privilege direction — flagged for Integravity review.)_
- **`redirect()` outside `try/catch`**: Next throws a control-flow exception on redirect, which a catch-all would swallow. Every failure path therefore `return`s a state object; `redirect("/admin")` sits after the `try/catch` and is reached only on full success. `logoutAdmin()` always redirects (even on sign-out failure/unconfigured mode) so the admin can never get stuck.
- **Graceful demo mode**: login page and layout call `getAdminUser().catch(…)` mapping `SupabaseNotConfiguredError` → `null` (the guard throws fail-secure before ever touching `cookies()`), so the shell and form render in unconfigured demo builds; submitting then returns the action's "not configured" error. `logoutAdmin` swallows only `SupabaseNotConfiguredError`.
- **Admin routes are now dynamic (`ƒ`)**: the layout/session reads call `cookies()`, so `/admin`* flipped from static `○` to server-rendered `ƒ` in the build — expected and desirable for an authenticated area (login page included).
- **Layout stays ungated**: per its original contract, the layout never calls `requireAdmin()` (that would loop `/admin/login` through itself); it only _displays_ session state. Each admin page keeps gating itself — enforced again for Phase 7 pages.
- **Shared `FormField`**: three-plus forms arrive in Phase 7, so the label/control/error wiring was extracted once; `ContactForm` was refactored onto it (identical markup — regression suite green).
- **Validation gate pattern** reused from `ContactForm`: invalid client input → `preventDefault()` + inline errors + focus first invalid field; valid → no `preventDefault`, letting React dispatch `action` in its own transition so `pending` stays accurate. Server `fieldErrors` merge with client ones at render (no `useEffect`).
- **Password handling**: schema never trims passwords (spaces are legal credentials); `z.string().min(1).max(1024)`.
- **Test graph mocks**: `@/lib/auth/admin` mocked (module has `import "server-only"`), `@/lib/supabase/server` mocked with a chainable fake (`from().select().eq().maybeSingle()`), and `next/navigation.redirect` mocked to throw a `NEXT_REDIRECT:<url>` marker — mirroring Next's control-flow throw so success paths assert as rejections. The real actions are imported (not module-mocked), so form tests exercise the real `loginAdmin`.
- **`tests/ui/contact.test.tsx` reformat**: `format:check` caught line-break drift in that file (pre-existing, non-semantic); re-run through Prettier and the full suite re-verified green.

### 14.3 Verification Results (2026-09-27)

| Command                | Result                                                        |
| :--------------------- | :------------------------------------------------------------ |
| `npm run typecheck`    | ✅ PASSED (0 errors)                                          |
| `npm run lint`         | ✅ PASSED (0 errors, 0 warnings)                              |
| `npm run test`         | ✅ PASSED (85/85 — 13 node + 72 UI, incl. 13 new admin tests) |
| `npm run build`        | ✅ PASSED (21/21 routes — `/admin`* now dynamic `ƒ`)          |
| `npm run format:check` | ✅ PASSED (all files)                                         |

### 14.4 Next Task

Awaiting Integravity's review of Task 6.1 — specifically the anon-client fail-secure admin check (RLS-filtered, mirrored from `hasAdminProfile()`), the inlined profile query, and the static→dynamic shift of `/admin`* routes. Next assigned work per `docs/TASKS.md`: **Task 7.1: CMS Dashboard & Content Management** (Phase 6 & 7).
