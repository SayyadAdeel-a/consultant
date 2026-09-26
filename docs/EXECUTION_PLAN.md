# IntegraVity — Master Execution Plan & Milestone Roadmap

## 1. Execution Philosophy & Phased Delivery

IntegraVity follows a strict sequential dependency model. Early phases establish design tokens and public showcase components, while later phases layer the Supabase database wiring, authentication gates, and CMS administrative interfaces.

```
┌─────────────────────────────────┐
│ Phase 1: Project Initialization │ (Architect / Integravity - COMPLETED)
└────────────────┬────────────────┘
                 ▼
┌──────────────────────────────────────────┐
│ Phase 2: Design System & Core Components │ (First OpenCode task)
└────────────────┬─────────────────────────┘
                 ▼
┌─────────────────────────────────┐
│ Phase 3: Homepage Implementation│
└────────────────┬────────────────┘
                 ▼
┌─────────────────────────────────┐
│ Phase 4: Dynamic Service Pages  │
└────────────────┬────────────────┘
                 ▼
┌─────────────────────────────────┐
│ Phase 5: Dedicated Contact Route│
└────────────────┬────────────────┘
                 ▼
┌─────────────────────────────────┐
│ Phase 6: Supabase Auth & Schema │
└────────────────┬────────────────┘
                 ▼
┌─────────────────────────────────┐
│ Phase 7: Administrative CMS     │
└────────────────┬────────────────┘
                 ▼
┌─────────────────────────────────┐
│ Phase 8: Security Verification  │
└────────────────┬────────────────┘
                 ▼
┌─────────────────────────────────┐
│ Phase 9: Performance & SEO Audit│
└────────────────┬────────────────┘
                 ▼
┌─────────────────────────────────┐
│ Phase 10: Final Prep & Handoff  │
└─────────────────────────────────┘
```

---

## 2. Phase Breakdown & Deliverables

### Phase 1: Project Initialization & Architecture _(STATUS: COMPLETE)_

- **Owner**: Integravity (Architect)
- **Deliverables**:
  - Next.js 16 + React 19 + TypeScript + Tailwind v4 + shadcn/ui scaffold.
  - Fail-secure Supabase environment and proxy architecture.
  - Complete database migration (`20260927000000_initial_schema.sql`).
  - Unit and UI test suite configuration with Vitest.
  - Comprehensive architectural and agent instruction suite (`AGENTS.md` and `docs/*`).
- **Dependencies**: None.

### Phase 2: Design System & Shared Components _(STATUS: READY FOR OPENCODE)_

- **Owner**: OpenCode (Implementation Engineer)
- **Deliverables**:
  - Reusable Header with desktop & mobile navigation drawer.
  - Public Footer with regulatory disclaimer, certifications, and quick links.
  - Motion wrapper components with `prefers-reduced-motion` compliance.
  - Core card, badge, and section container primitives adhering to `docs/DESIGN_SYSTEM.md`.
- **Dependencies**: Phase 1.

### Phase 3: Premium Editorial Homepage Implementation

- **Owner**: OpenCode
- **Deliverables**:
  - Immersive Hero section with nature typography and dual CTAs.
  - Credibility metrics (years of experience, completed reviews, regulatory accuracy).
  - Core environmental services grid (Wetland, Permitting, ESAs, Planning).
  - Industries supported section.
  - Featured case study deep dive card.
  - Working approach & methodology timeline (Phases 1–4).
  - Technical team and credentials section.
  - Frequently Asked Questions accordion.
  - Consultation request banner.
- **Dependencies**: Phase 2.

### Phase 4: Dynamic Service Pages Architecture

- **Owner**: OpenCode
- **Deliverables**:
  - Service index overview page (`/services`).
  - Reusable dynamic service template (`/services/[slug]`).
  - Scopes, deliverables list, and regulatory framework badges.
  - Optional pricing note display logic (completely suppressed when null/empty).
  - Service-specific JSON-LD schema injection.
- **Dependencies**: Phase 3.

### Phase 5: Dedicated Consultation & Contact Experience

- **Owner**: OpenCode
- **Deliverables**:
  - Dedicated `/contact` page with consultation intake form.
  - Client-side and server-side Zod validation (`contactInquirySchema`).
  - Anti-spam honeypot defense (`companyWebsite`).
  - Accessible feedback states (loading spinners, success confirmation, validation errors).
- **Dependencies**: Phase 4.

### Phase 6: Supabase Database & Authentication Wiring

- **Owner**: OpenCode (with Integravity review)
- **Deliverables**:
  - Connect live Supabase project credentials.
  - Execute schema migration and verify tables, RLS policies, and triggers.
  - Admin login implementation (`/admin/login`) with Supabase email/password auth.
  - Session cookie persistence and verification in `src/proxy.ts`.
- **Dependencies**: Phase 5 + Live Supabase Credentials.

### Phase 7: Administrative CMS Implementation

- **Owner**: OpenCode
- **Deliverables**:
  - CMS Dashboard metrics overview (`/admin`).
  - Content editor for homepage sections (`/admin/content`).
  - Service management CRUD (`/admin/services`).
  - Case studies / Projects manager (`/admin/projects`).
  - Media library upload & metadata editor (`/admin/media`).
  - Confidential inquiries review and status tracking (`/admin/inquiries`).
  - Global site settings and branding manager (`/admin/settings`).
- **Dependencies**: Phase 6.

### Phase 8: Security Verification & Audit

- **Owner**: Integravity & OpenCode
- **Deliverables**:
  - Verify that anonymous users cannot read inquiries via direct Supabase API calls.
  - Verify that unauthenticated requests to `/admin/*` are strictly blocked.
  - Verify file upload size and MIME-type restrictions.
  - Confirm zero exposure of `SUPABASE_SERVICE_ROLE_KEY` in client bundles.
- **Dependencies**: Phase 7.

### Phase 9: Performance Optimization & Core Web Vitals

- **Owner**: OpenCode
- **Deliverables**:
  - Image optimization via `next/image` with WebP/AVIF formats.
  - Core Web Vitals verification: LCP <= 2.5s, INP <= 200ms, CLS <= 0.1.
  - Static site generation (SSG) validation for published services.
  - Sitemap and robots generation audit.
- **Dependencies**: Phase 8.

### Phase 10: Final Verification & Production Deployment Prep

- **Owner**: Integravity
- **Deliverables**:
  - Full end-to-end regression testing.
  - Vercel deployment configuration check.
  - Production documentation and client handover manual.
- **Dependencies**: Phase 9.
