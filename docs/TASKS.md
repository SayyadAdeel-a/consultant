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
- **Status**: **COMPLETE (verified 2026-09-27)**
- **Files**:
  - `src/components/sections/CaseStudySpotlight.tsx`
  - `src/components/sections/ApproachSection.tsx`
  - `src/components/sections/index.ts` (barrel exports)
  - `tests/ui/case-study-approach.test.tsx` (6 tests)
- **Criteria**:
  - [x] Editorial split-screen layout for featured project.
  - [x] 4-step phased consulting methodology (Assessment -> Delineation -> Permitting -> Compliance).
  - [x] Casco Bay project with client metadata, challenge/solution copy, quantifiable results, `/contact` CTA, and mandatory disclaimer.
  - [x] Verified: `npm run typecheck`, `npm run lint`, `npm run format:check`, `npm run test` (50/50), `npm run build` (17/17).

**Status: COMPLETE (OpenCode, verified 2026-09-27)** — see `docs/HANDOFF.md` §10 for implementation details and verification results.

### Task 3.4: Team Credentials, FAQs & Consultation CTA

- **Assignee**: OpenCode
- **Status**: **COMPLETE (verified 2026-09-27)**
- **Files**:
  - `src/components/sections/TeamSection.tsx`
  - `src/components/sections/FaqSection.tsx`
  - `src/components/sections/ConsultationCta.tsx`
  - `src/components/sections/index.ts` (barrel exports)
  - `src/app/(public)/page.tsx` (nine-section assembly)
  - `tests/ui/homepage.test.tsx` (6 tests)
- **Criteria**:
  - [x] Assembles all 8 sections onto the homepage.
  - [x] Fully accessible accordion for FAQs.
  - [x] Team cards with PWS/PE/CPSS/CEP credentials and agency backgrounds (`id="team"`).
  - [x] FAQ answers 4 technical questions with full ARIA + keyboard navigation (`id="faq"`).
  - [x] High-contrast closing CTA banner with `/contact`, phone, and email channels.
  - [x] Verified: `npm run typecheck`, `npm run lint`, `npm run format:check`, `npm run test` (56/56), `npm run build` (17/17).

**Status: COMPLETE (OpenCode, verified 2026-09-27)** — see `docs/HANDOFF.md` §11 for implementation details and verification results. **Phase 3 complete.**

---

## Phase 4: Dynamic Service Pages Tasks

### Task 4.1: Service Overview & Dynamic Route Template

- **Assignee**: OpenCode
- **Status**: **COMPLETE (verified 2026-09-27)**
- **Files**:
  - `src/app/(public)/services/page.tsx`
  - `src/app/(public)/services/[slug]/page.tsx`
  - `src/config/services.ts` (shared catalog data + `hasPricingNote` guard)
  - `tests/ui/services-pages.test.tsx` (8 tests)
- **Criteria**:
  - [x] Dynamic routing with `params: Promise<{ slug: string }>`.
  - [x] Optional pricing note logic: hidden if null/empty.
  - [x] Metadata generation with canonical URLs.
  - [x] Catalog with deliverables, framework badges, links, and closing CTA.
  - [x] `generateStaticParams()` (4 slugs), `notFound()` for unknown slugs, rich editorial detail template.
  - [x] Verified: `npm run typecheck`, `npm run lint`, `npm run format:check`, `npm run test` (64/64), `npm run build` (21/21).

**Status: COMPLETE (OpenCode, verified 2026-09-27)** — see `docs/HANDOFF.md` §12 for implementation details and verification results. **Phase 4 complete.**

---

## Phase 5: Contact Experience Tasks

### Task 5.1: Interactive Consultation Request Form

- **Assignee**: OpenCode
- **Status**: **COMPLETE (verified 2026-09-27)**
- **Files**:
  - `src/components/forms/ContactForm.tsx`
  - `src/app/(public)/contact/page.tsx`
  - `src/app/actions/contact.ts`
  - `src/components/forms/index.ts` (barrel export)
  - `src/lib/validations/contact.ts` (shared `flattenContactIssues()` helper)
  - `tests/ui/contact.test.tsx` (8 tests)
- **Criteria**:
  - [x] Client-side validation using `contactInquirySchema`.
  - [x] Invisible honeypot field (`companyWebsite`) blocking bots.
  - [x] Accessible error and success states.
  - [x] Server Action with Zod validation, RLS-enforced insert, and demo-mode graceful success.
  - [x] `?service=` search-param pre-selection of `inquiryType`, pending/disabled submit, success confirmation.
  - [x] Editorial two-column contact page with office details, "What to expect" timeline, and `<Suspense>`-wrapped form.
  - [x] Verified: `npm run typecheck`, `npm run lint`, `npm run format:check`, `npm run test` (72/72), `npm run build` (21/21).

**Status: COMPLETE (OpenCode, verified 2026-09-27)** — see `docs/HANDOFF.md` §13 for implementation details and verification results. **Phase 5 complete.**

---

## Phase 6 & 7: Backend & CMS Tasks

### Task 6.1: Supabase Auth & Session Verification

- **Assignee**: OpenCode
- **Status**: **COMPLETE (verified 2026-09-27)**
- **Files**:
  - `src/lib/validations/auth.ts` (new — `adminLoginSchema`, `flattenAuthIssues()`)
  - `src/app/actions/auth.ts` (new — `loginAdmin()`, `logoutAdmin()`)
  - `src/components/forms/AdminLoginForm.tsx` (new)
  - `src/components/forms/FormField.tsx` (new — shared label/control/error field extracted from `ContactForm`)
  - `src/components/forms/ContactForm.tsx` (refactored to use shared `FormField`)
  - `src/components/forms/index.ts` (barrel exports)
  - `src/app/admin/login/page.tsx` (rewritten — mounts form, redirect for authenticated admins)
  - `src/app/admin/layout.tsx` (session header: admin email + sign-out)
  - `tests/ui/admin-auth.test.tsx` (13 tests)
- **Criteria**:
  - [x] `adminLoginSchema` (email format, non-empty password) shared by client and server so rules cannot drift.
  - [x] `loginAdmin(prevState, formData)` server action: validates → `signInWithPassword` → fail-secure `admin_profiles` check (non-admins are signed out and denied) → `redirect("/admin")`.
  - [x] `logoutAdmin()` signs out and redirects to `/admin/login`.
  - [x] `AdminLoginForm` client component using `useActionState`, inline `role="alert"` errors, disabled pending state with spinner.
  - [x] Login page mounts the form and immediately redirects already-authenticated admins to `/admin`.
  - [x] Admin layout header displays the signed-in admin's email and a sign-out button hooked to `logoutAdmin`.
  - [x] Verified: `npm run typecheck`, `npm run lint`, `npm run format:check`, `npm run test` (85/85), `npm run build` (21/21).

**Status: COMPLETE (OpenCode, verified 2026-09-27)** — see `docs/HANDOFF.md` §14 for implementation details and verification results.

### Task 7.1: CMS Dashboard & Navigation Shell

- **Assignee**: OpenCode
- **Status**: **COMPLETE (verified 2026-09-27)**
- **Files**:
  - `src/app/admin/page.tsx` (rewritten — gated live dashboard)
  - `src/components/admin/AdminNav.tsx` (new — route-aware client navigation)
  - `src/components/admin/index.ts` (barrel exports `AdminNav`, `isActiveRoute`)
  - `src/app/admin/layout.tsx` (static span list → `<AdminNav />`)
  - `src/lib/validations/contact.ts` (shared `InquiryType` + `INQUIRY_TYPE_LABELS`)
  - `src/components/forms/ContactForm.tsx` (refactored onto shared labels)
  - `tests/ui/admin-dashboard.test.tsx` (7 tests)
  - `tests/ui/admin-auth.test.tsx` (mock updates for the new layout nav)
- **Criteria**:
  - [x] `await requireAdmin()` enforced in `src/app/admin/page.tsx` — unauthorized users redirect to `/admin/login` (propagated, not swallowed).
  - [x] Demo mode: `SupabaseNotConfiguredError` renders the configuration notice instead of throwing.
  - [x] `AdminNav` client component replaces the static sidebar list, highlights the active route via `usePathname()`, and includes the specified lucide icons for all seven routes.
  - [x] Live metrics queried from Supabase: inquiries total + `new` count, services published vs total, published case studies, media assets total.
  - [x] Editorial metric cards with quick-links, "Recent Inquiries" preview (latest 3) linking to `/admin/inquiries`, and quick-action buttons (Add Service, Review Inquiries, Edit Settings).
  - [x] Verified: `npm run typecheck`, `npm run lint`, `npm run format:check`, `npm run test` (92/92), `npm run build` (21/21).

**Status: COMPLETE (OpenCode, verified 2026-09-27)** — see `docs/HANDOFF.md` §15 for implementation details and verification results.

_Note: Integravity's Task 7.1 spec re-scoped this task to the dashboard + navigation shell. The original Task 7.1 criteria ("Implement `/admin/content`, `/admin/services`, `/admin/projects`, and `/admin/inquiries`") remain pending as follow-up Phase 6 & 7 work (the `/admin/inquiries` surface was delivered by Task 7.2)._

### Task 7.2: Confidential Inquiries Management

- **Assignee**: OpenCode
- **Status**: **COMPLETE (verified 2026-09-27)**
- **Files**:
  - `src/app/admin/inquiries/page.tsx` (rewritten — gated list page)
  - `src/app/actions/inquiries.ts` (new — `updateInquiryStatus` + `updateInquiryNotes` Server Actions)
  - `src/components/admin/InquiriesTable.tsx` (new — pill filters with counts, type dropdown, semantic table)
  - `src/components/admin/InquiryDetailDrawer.tsx` (new — accessible detail dialog with status + notes editors)
  - `src/components/admin/StatusPill.tsx` (new — shared status pill)
  - `src/components/admin/inquiry-format.ts` (new — shared received-date and type-label helpers)
  - `src/components/admin/index.ts` (barrel exports `InquiriesTable`, `StatusPill`)
  - `src/lib/validations/inquiries.ts` (new — `INQUIRY_STATUSES`, `inquiryStatusSchema`, `inquiryIdSchema`, `inquiryNotesSchema`)
  - `src/app/admin/setup-panel.tsx` (new — shared fail-secure `AdminSetupPanel`)
  - `src/app/admin/page.tsx` (refactored onto shared `StatusPill` + `AdminSetupPanel`; UTC-pinned dates)
  - `src/types/cms.ts` (`InquiryRecord` column pick — excludes `ip_hash`/`user_agent`)
  - `tests/ui/admin-inquiries.test.tsx` (14 tests)
- **Criteria**:
  - [x] `/admin/inquiries` calls `await requireAdmin()` — unauthorized visitors redirect to `/admin/login`; demo mode (`SupabaseNotConfiguredError`) renders the fail-secure `AdminSetupPanel`.
  - [x] List reads use the authenticated server client (`createClient()` from `@/lib/supabase/server`) with a minimal column set under RLS — `public.inquiries` has no public SELECT path; only `public.is_admin()` reads.
  - [x] `updateInquiryStatus(inquiryId, newStatus)` — `"use server"` module, `await assertAdmin()`, Zod-validated status, RLS-enforced write via the admin session, `revalidatePath("/admin/inquiries")` + `revalidatePath("/admin")`.
  - [x] `updateInquiryNotes(inquiryId, notes)` — same gate; notes trimmed, 5000-char cap, empty clears to `NULL`; revalidates both paths.
  - [x] `InquiriesTable` — status pill filters with count badges (All/New/Reviewing/Contacted/Archived), inquiry-type dropdown, semantic `<table>` with `<time dateTime>` dates, submitter + organization, type and status pills, per-row "View details" action, distinct first-use and no-match empty states.
  - [x] `InquiryDetailDrawer` — `role="dialog"` + `aria-modal`, Escape/backdrop close, focus-on-open and Tab trap; `mailto:`/`tel:` links, full message with line breaks preserved, one-click status selector, internal notes editor with character counter.
  - [x] Verified: `npm run typecheck`, `npm run lint`, `npm run format:check`, `npm run test` (106/106), `npm run build` (21/21).

**Status: COMPLETE (OpenCode, verified 2026-09-27)** — see `docs/HANDOFF.md` §16 for implementation details and verification results.

### Task 7.3: Services & Case Studies Manager

- **Assignee**: OpenCode
- **Status**: **COMPLETE (verified 2026-09-27)**
- **Files**:
  - `src/app/admin/services/page.tsx` (rewritten — gated list page, ordered by `display_order ASC`)
  - `src/app/admin/projects/page.tsx` (rewritten — gated list page, ordered by `display_order ASC, created_at DESC`, plus fail-soft service lookup)
  - `src/app/actions/services.ts` (new — `toggleServicePublished` + `upsertService` Server Actions)
  - `src/app/actions/projects.ts` (new — `toggleProjectPublished` + `toggleProjectFeatured` + `upsertProject` Server Actions)
  - `src/lib/validations/cms.ts` (new — shared `CmsActionResult`, `cmsIdSchema`, `flattenCmsIssues`, `tagListSchema`)
  - `src/lib/validations/services.ts` (new — `SERVICE_ICON_NAMES` enum + `serviceSchema`)
  - `src/lib/validations/projects.ts` (new — `projectSchema` with optional image/service rules)
  - `src/components/admin/AdminDrawer.tsx` (new — shared accessible slide-over shell)
  - `src/components/admin/ServicesTable.tsx` (new — manager table with optimistic publish toggle)
  - `src/components/admin/ServiceEditorDrawer.tsx` (new — create/edit editor)
  - `src/components/admin/ProjectsTable.tsx` (new — manager table with publish + featured toggles)
  - `src/components/admin/ProjectEditorDrawer.tsx` (new — create/edit editor)
  - `src/components/admin/PublishPill.tsx` (new — shared Published/Draft pill)
  - `src/components/admin/service-icons.ts` (new — icon-name → Lucide component map)
  - `src/components/admin/index.ts` (barrel exports `ServicesTable`, `ProjectsTable`)
  - `src/types/cms.ts` (`ServiceRecord`, `ProjectRecord`, `ServiceOption` column picks)
  - `tests/ui/admin-services.test.tsx` (10 tests), `tests/ui/admin-projects.test.tsx` (8 tests)
- **Criteria**:
  - [x] `/admin/services` and `/admin/projects` both call `await requireAdmin()` — unauthorized visitors redirect; demo mode (`SupabaseNotConfiguredError`) renders the fail-secure `AdminSetupPanel`.
  - [x] Services list queries `public.services` ordered by `display_order ASC`; shows title, slug, icon (glyph + name), deliverables count, regulatory framework tags, optional pricing indicator (§5.5 — presence chip only, note text never rendered, blank → "—"), publication pill, display order index, and a per-row publish/unpublish quick action.
  - [x] Projects list queries `public.projects` ordered by `display_order ASC, created_at DESC`; shows title, client type, location, completed year, associated service (fail-soft lookup), featured star/badge, publication pill, and per-row publish + feature quick actions.
  - [x] Service editor drawer: title, slug, short description, full content, icon selector (curated Lucide names), pricing note (optional), display order, published toggle, deliverables (one-per-line tag list), regulatory frameworks (one-per-line tag list).
  - [x] Project editor drawer: title, slug, client type, location, completed year, summary, challenge, solution, results, featured image URL, associated service selector, featured toggle, published toggle, display order.
  - [x] `src/app/actions/services.ts` / `src/app/actions/projects.ts` — both `"use server"`; every action calls `await assertAdmin()` **first**; payloads validated with `serviceSchema` / `projectSchema`; implements `toggleServicePublished`, `upsertService`, `toggleProjectPublished`, `toggleProjectFeatured`, `upsertProject` (accepting `FormData | *Input`); each write calls `revalidatePath` for `/admin/services`, `/services`, `/admin/projects`, and `/`.
  - [x] Fail-secure: missing Supabase credentials render `<AdminSetupPanel />`; validation failures return inline field errors without touching the database; unique-slug violations map to a friendly message.
  - [x] Vitest suites cover mocked-row listing, optimistic toggles with revalidation, required-field validation errors, and pricing-note optionality.
  - [x] Verified: `npm run typecheck`, `npm run lint`, `npm run format:check`, `npm run test` (124/124), `npm run build` (21/21).

**Status: COMPLETE (OpenCode, verified 2026-09-27)** — see `docs/HANDOFF.md` §17 for implementation details and verification results.

### Task 7.4: Media Library, Homepage Content & Site Settings

- **Assignee**: OpenCode
- **Status**: **COMPLETE (verified 2026-09-27)**
- **Files**:
  - `src/app/admin/settings/page.tsx` (rewritten — gated list page, singleton `site_settings` read)
  - `src/app/admin/content/page.tsx` (rewritten — gated list page, ordered by `display_order ASC`)
  - `src/app/admin/media/page.tsx` (rewritten — gated list page, ordered by `created_at DESC`, public URLs via `storage.getPublicUrl`)
  - `src/app/actions/settings.ts` (new — `updateSiteSettings` Server Action)
  - `src/app/actions/content.ts` (new — `toggleSectionVisibility` + `updateHomepageSection` Server Actions)
  - `src/app/actions/media.ts` (new — `uploadMediaAsset` + `deleteMediaAsset` Server Actions)
  - `src/lib/validations/settings.ts` (new — `siteSettingsSchema`)
  - `src/lib/validations/content.ts` (new — `sectionSchema`)
  - `src/lib/validations/media.ts` (new — `mediaUploadSchema` + `mediaDeleteSchema` + `MEDIA_ACCEPT` / `MAX_MEDIA_UPLOAD_BYTES`)
  - `src/lib/validations/cms.ts` (extended — shared `formDataToObject()` helper, consolidating the Task 7.3 per-module copies)
  - `src/app/actions/services.ts` / `src/app/actions/projects.ts` (refactored onto the shared `formDataToObject` — behavior unchanged)
  - `src/components/admin/SettingsForm.tsx` (new — 12-field settings editor)
  - `src/components/admin/ContentSectionsTable.tsx` (new — manager table with optimistic visibility toggle)
  - `src/components/admin/SectionEditorDrawer.tsx` (new — title/subtitle/display-order editor)
  - `src/components/admin/MediaGrid.tsx` (new — asset cards with copy-URL + quick delete)
  - `src/components/admin/MediaUploadDrawer.tsx` (new — file/alt/caption upload dialog)
  - `src/components/admin/media-format.ts` (new — `formatFileSize` KB/MB helper)
  - `src/components/admin/PublishPill.tsx` (extended — optional `activeLabel`/`inactiveLabel`, defaults unchanged)
  - `src/components/admin/index.ts` (barrel exports `SettingsForm`, `ContentSectionsTable`, `MediaGrid`)
  - `src/components/forms/FormField.tsx` (extended — optional `hint` prop, backward compatible)
  - `src/types/cms.ts` (`SiteSettingsRecord`, `HomepageSectionRecord`, `MediaAssetRecord`, `MediaAssetView` picks)
  - `supabase/migrations/20260927000001_media_storage.sql` (new — `media` bucket + storage `is_admin()` RLS policies)
  - `tests/ui/admin-settings.test.tsx` (9 tests), `tests/ui/admin-content.test.tsx` (7 tests), `tests/ui/admin-media.test.tsx` (11 tests)
- **Criteria**:
  - [x] `/admin/settings` calls `await requireAdmin()`; reads the singleton `public.site_settings` row; renders `SettingsForm` with Company Name, Tagline, Description, Email, Phone, Office Address, LinkedIn URL, Twitter/X URL, and primary/secondary CTA labels + URLs.
  - [x] `updateSiteSettings(formData | SiteSettingsInput)` — `"use server"` module, `await assertAdmin()` first, validated with `siteSettingsSchema`, upserts the singleton (`onConflict: singleton_guard`), revalidates `/admin/settings`, `/`, `/contact`, and `/admin`.
  - [x] `/admin/content` calls `await requireAdmin()`; reads `public.homepage_sections` ordered by `display_order ASC`; `ContentSectionsTable` shows section key (hero, credibility, services, industries, projects, approach, team, faq, cta), Title, Subtitle, Visibility toggle (`is_visible`), and Display Order; `SectionEditorDrawer.tsx` updates title, subtitle, and display order.
  - [x] `toggleSectionVisibility(id, isVisible)` + `updateHomepageSection(formData | SectionInput)` — both `await assertAdmin()` first, revalidate `/admin/content` and `/`.
  - [x] `/admin/media` calls `await requireAdmin()`; reads `public.media_assets` ordered by `created_at DESC`; `MediaGrid` shows thumbnail preview, filename, formatted file size (KB/MB), MIME type badge, alt text, and a public-URL copy button.
  - [x] `MediaUploadDrawer.tsx` — file input restricted to JPEG/PNG/WebP/SVG at max 5MB, required alt text, optional caption; live mode uploads to the Supabase Storage `media` bucket then writes the `public.media_assets` record; demo mode gracefully logs the asset metadata.
  - [x] Quick delete action backed by `deleteMediaAsset(id, filePath)` — removes the storage object and the catalog row.
  - [x] Both media actions `await assertAdmin()` first and revalidate `/admin/media` and `/admin`.
  - [x] Fail-secure & demo mode: all three routes render `<AdminSetupPanel />` when `SupabaseNotConfiguredError` is caught at the gate.
  - [x] Vitest suites: `tests/ui/admin-settings.test.tsx`, `tests/ui/admin-content.test.tsx`, `tests/ui/admin-media.test.tsx`.
  - [x] Verified: `npm run typecheck`, `npm run lint`, `npm run format:check`, `npm run test` (151/151), `npm run build` (21/21).

**Status: COMPLETE (OpenCode, verified 2026-09-27)** — see `docs/HANDOFF.md` §18 for implementation details and verification results.

---

## Phase 8: Security Verification & Audit Tasks

### Task 8.1: Security Regression & Boundary Verification Suite

- **Assignee**: OpenCode & Integravity
- **Status**: **COMPLETE (verified 2026-09-27)**
- **Files**:
  - `tests/unit/security-audit.test.ts` (new — 28 tests: secret-isolation scan, 12 unauthenticated action gates, static RLS enforcement, honeypot, upload boundary, pricing rule)
  - `tests/mocks/server-only.ts` (new — empty stand-in for the Next.js-aliased `server-only` specifier, which is not a real dependency)
  - `vitest.config.ts` (extended — `server-only` → stub alias so tests can import the genuine `src/lib/auth/admin.ts` gate)
- **Criteria**:
  - [x] Implement automated security audit test suite in `tests/unit/security-audit.test.ts`.
  - [x] Verify zero exposure of `SUPABASE_SERVICE_ROLE_KEY` in client components, bundles, or public exports.
  - [x] Verify that unauthenticated requests to all admin Server Actions (`updateInquiryStatus`, `updateInquiryNotes`, `toggleServicePublished`, `upsertService`, `toggleProjectPublished`, `toggleProjectFeatured`, `upsertProject`, `updateSiteSettings`, `toggleSectionVisibility`, `updateHomepageSection`, `uploadMediaAsset`, `deleteMediaAsset`) reject with unauthorized errors via `assertAdmin()`.
  - [x] Verify that anonymous client queries to `public.inquiries` return zero rows or throw permission errors (RLS enforcement).
  - [x] Verify anti-spam honeypot behavior: non-empty `companyWebsite` in `submitInquiry` silently returns fake success without writing to the database.
  - [x] Verify file upload validation in `mediaUploadSchema`: blocks non-image MIME types, malformed files, and files exceeding 5MB.
  - [x] Verify CMS pricing rule enforcement: empty or whitespace-only pricing notes are never rendered in the public DOM.
  - [x] Verified: `npm run typecheck`, `npm run lint`, `npm run format:check`, `npm run test` (179/179), `npm run build` (21/21).

**Status: COMPLETE (OpenCode, verified 2026-09-27)** — see `docs/HANDOFF.md` §19 for implementation details and verification results.

---

## Phase 9: Performance Optimization & Core Web Vitals Tasks

### Task 9.1: Dynamic Sitemap, SEO Integration & Public CMS Data Binding

- **Assignee**: OpenCode
- **Status**: **COMPLETE (verified 2026-09-27)**
- **Criteria**:
  - [x] Transform `src/app/sitemap.ts` into an async function that dynamically appends published services (`/services/[slug]`) and published projects from Supabase with graceful fallback to `@/config/services`.
  - [x] Connect public layout (Header & Footer) and homepage to read dynamic `site_settings` and `homepage_sections` when configured, falling back seamlessly to static configs.
  - [x] Verify image and font loading optimization (WebP/AVIF formats, priority flags on hero elements, zero layout shift).
  - [x] Verify Core Web Vitals targets: LCP <= 2.5s, INP <= 200ms, CLS <= 0.1.
  - [x] Implement automated test suite in `tests/ui/sitemap-seo.test.tsx` verifying dynamic sitemap generation and fallback behaviors.
  - [x] Verified: `npm run typecheck`, `npm run lint`, `npm run format:check`, `npm run test` (190/190), `npm run build` (21/21).

**Status: COMPLETE (OpenCode, verified 2026-09-27)** — see `docs/HANDOFF.md` §20 for implementation details and verification results.
