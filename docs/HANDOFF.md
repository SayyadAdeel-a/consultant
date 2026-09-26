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

**Task 3.2: Core Services Grid & Industries Section** (`ServicesGrid`, `IndustriesSection` in `src/components/sections/`).
