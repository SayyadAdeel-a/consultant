# IntegraVity — Actionable Task Backlog

This document defines discrete, prioritized implementation tasks for **OpenCode**. Each task contains explicit scopes, files to touch, and verification criteria.

---

## 🔥 IMMEDIATE FIRST TASK: TASK 2.1

### Task 2.1: Implement Design System Primitives, Public Header & Footer

- **Phase**: Phase 2 (Design System & Shared Components)
- **Assignee**: OpenCode
- **Priority**: High (Blocks Phase 3)
- **Status**: **READY TO START**

#### Objective:

Replace the placeholder header and footer in `src/app/(public)/layout.tsx` with production-grade, accessible navigation and footer components adhering strictly to `docs/DESIGN_SYSTEM.md`.

#### Files to Create / Modify:

1. `src/components/layout/Header.tsx` (Client component for mobile toggle, or server component with client nav drawer)
2. `src/components/layout/Navigation.tsx` (Desktop links, dropdown, CTA button)
3. `src/components/layout/MobileNav.tsx` (Accessible mobile drawer with backdrop blur)
4. `src/components/layout/Footer.tsx` (Environmental credentials, office location, legal disclaimer)
5. `src/app/(public)/layout.tsx` (Mount the new `Header` and `Footer`)
6. `tests/ui/navigation.test.tsx` (Vitest test verifying header links and mobile toggle accessibility)

#### Acceptance Criteria:

- [x] Header displays the company brand mark and navigation links defined in `src/config/site.ts`.
- [x] "Request a Consultation" CTA button links to `/contact` using the Forest Green brand style.
- [x] Mobile navigation opens smoothly and supports keyboard escape / aria attributes.
- [x] Footer contains the required illustrative placeholder disclaimer: _"All illustrative statistics, certifications, and case studies shown are demonstrations."_
- [x] Responsive across mobile (375px), tablet (768px), and desktop (1280px).
- [x] Passes `npm run typecheck`, `npm run lint`, and `npm run test`.

**Status: COMPLETE (OpenCode, verified 2026-09-26)** — see `docs/HANDOFF.md` §6 for implementation details and verification results.

---

## Phase 2: Subsequent Tasks

### Task 2.2: Motion Wrappers & Animation Primitives

- **Assignee**: OpenCode
- **Status**: **COMPLETE (verified 2026-09-27)**
- **Files**:
  - `src/components/animations/FadeIn.tsx`
  - `src/components/animations/SlideUp.tsx`
  - `src/components/animations/constants.ts` (shared easing/duration contract)
  - `src/components/animations/index.ts`
  - `tests/ui/animations.test.tsx` (7 tests)
- **Criteria**:
  - [x] Motion wrappers respect `useReducedMotion()`.
  - [x] When reduced motion is preferred, elements render immediately without transform or opacity delays (plain `<div>`, no motion styles).
  - [x] Timing/easing per `docs/DESIGN_SYSTEM.md` §6: default duration 0.4s (within 0.3–0.4s), ease `[0.16, 1, 0.3, 1]`, scroll reveal `y: 16px → 0px`.
  - [x] Verified: `npm run typecheck`, `npm run lint`, `npm run test` (34/34), `npm run build` (17/17), `npm run format:check` all pass.

**Status: COMPLETE (OpenCode, verified 2026-09-27)** — see `docs/HANDOFF.md` §7 for implementation details and verification results.

---

## Phase 3: Homepage Implementation Tasks

### Task 3.1: Immersive Hero & Credibility Metrics

- **Assignee**: OpenCode
- **Status**: **COMPLETE (verified 2026-09-27)**
- **Files**:
  - `src/components/sections/HeroSection.tsx`
  - `src/components/sections/CredibilitySection.tsx`
  - `src/components/sections/index.ts` (barrel exports)
  - `tests/ui/hero.test.tsx` (4 tests)
- **Criteria**:
  - [x] Editorial typography (`text-display-xl`), Nature Forest Green background or ivory contrast.
  - [x] Credibility metrics: e.g. 1,200+ Acres Delineated, 99.4% Permitting Approval Rate, 20+ Years Practice (marked as illustrative demo).
  - [x] Dual CTAs linking to `/contact` and `/services`, animated via `FadeIn` / `SlideUp`.
  - [x] Verified: `npm run typecheck`, `npm run lint`, `npm run format:check`, `npm run test` (38/38), `npm run build` (17/17).

**Status: COMPLETE (OpenCode, verified 2026-09-27)** — see `docs/HANDOFF.md` §8 for implementation details and verification results.

### Task 3.2: Core Services Grid & Industries Section

- **Assignee**: OpenCode
- **Status**: **COMPLETE (verified 2026-09-27)**
- **Files**:
  - `src/components/sections/ServicesGrid.tsx`
  - `src/components/sections/IndustriesSection.tsx`
  - `src/components/sections/index.ts` (barrel exports)
  - `tests/ui/services-industries.test.tsx` (6 tests)
- **Criteria**:
  - [x] Displays the 4 core services (Wetland, Permitting, ESAs, Planning).
  - [x] Hover states on cards use subtle Sage border transitions.
  - [x] Cards link to real `/services/[slug]` routes with icon, title, and description.
  - [x] Verified: `npm run typecheck`, `npm run lint`, `npm run format:check`, `npm run test` (44/44), `npm run build` (17/17).

**Status: COMPLETE (OpenCode, verified 2026-09-27)** — see `docs/HANDOFF.md` §9 for implementation details and verification results.

### Task 3.3: Case Study Spotlight & Approach Timeline

- **Assignee**: OpenCode
- **Files**:
  - `src/components/sections/CaseStudySpotlight.tsx`
  - `src/components/sections/ApproachSection.tsx`
- **Criteria**:
  - Editorial split-screen layout for featured project.
  - 4-step phased consulting methodology (Assessment -> Delineation -> Permitting -> Compliance).

### Task 3.4: Team Credentials, FAQs & Consultation CTA

- **Assignee**: OpenCode
- **Files**:
  - `src/components/sections/TeamSection.tsx`
  - `src/components/sections/FaqSection.tsx`
  - `src/components/sections/ConsultationCta.tsx`
  - `src/app/(public)/page.tsx`
- **Criteria**:
  - Assembles all 8 sections onto the homepage.
  - Fully accessible accordion for FAQs.

---

## Phase 4: Dynamic Service Pages Tasks

### Task 4.1: Service Overview & Dynamic Route Template

- **Assignee**: OpenCode
- **Files**:
  - `src/app/(public)/services/page.tsx`
  - `src/app/(public)/services/[slug]/page.tsx`
- **Criteria**:
  - Dynamic routing with `params: Promise<{ slug: string }>`.
  - Optional pricing note logic: hidden if null/empty.
  - Metadata generation with canonical URLs.

---

## Phase 5: Contact Experience Tasks

### Task 5.1: Interactive Consultation Request Form

- **Assignee**: OpenCode
- **Files**:
  - `src/components/forms/ContactForm.tsx`
  - `src/app/(public)/contact/page.tsx`
  - `src/app/actions/contact.ts`
- **Criteria**:
  - Client-side validation using `contactInquirySchema`.
  - Invisible honeypot field (`companyWebsite`) blocking bots.
  - Accessible error and success states.

---

## Phase 6 & 7: Backend & CMS Tasks

### Task 6.1: Supabase Auth & Session Verification

- **Assignee**: OpenCode
- **Criteria**: Wire `/admin/login` to Supabase email/password auth and verify cookies.

### Task 7.1: CMS Dashboard & Content Management

- **Assignee**: OpenCode
- **Criteria**: Implement `/admin/content`, `/admin/services`, `/admin/projects`, and `/admin/inquiries`.
