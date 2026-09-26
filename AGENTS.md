<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# INTEGRAVITY — AGENT INSTRUCTION & ARCHITECTURE GUIDE

Welcome to **IntegraVity**, a high-end, production-ready website template and CMS designed specifically for environmental consulting, ecological engineering, and natural resource management firms.

This document is the **primary instruction file** for all AI coding agents (such as **OpenCode** and **Integravity**) and human developers contributing to this codebase. You must read and strictly adhere to this guide.

---

## 1. PROJECT OVERVIEW & BUSINESS OBJECTIVES

### 1.1 What the Project Is

IntegraVity is a premium, single-tenant commercial website template featuring an integrated Content Management System (CMS). It empowers environmental consulting businesses to present an authoritative, sophisticated online presence while allowing nontechnical business owners to manage website content, branding, services, case studies, media, and client inquiries without modifying source code.

### 1.2 Target Industries

- Wetland consulting, mapping, and jurisdictional delineation
- Federal, state, and municipal environmental permitting
- Coastal and ecological engineering
- Environmental assessments (Phase I & II ESAs, NEPA reviews)
- Soil taxonomy, mapping, and geotechnical integration
- Ecological restoration and land-use planning
- Environmental natural resource management

### 1.3 Critical Architectural Mandate: Single-Tenant Only

- **CRITICAL**: This is **NOT** a multitenant SaaS platform.
- **DO NOT** implement multi-tenant databases, tenant isolation logic, customer self-registration, subscription billing (Stripe), or drag-and-drop website builders.
- Every client receives an independent code deployment and an isolated Supabase database instance.
- Branding and content are customized through CMS tables and environment configuration.

---

## 2. APPROVED TECHNOLOGY STACK

Stick strictly to the approved stack below. Do not swap libraries or introduce unapproved frameworks:

| Layer                 | Approved Technology                               | Purpose / Notes                                                   |
| :-------------------- | :------------------------------------------------ | :---------------------------------------------------------------- |
| **Framework**         | Next.js 16 (App Router with Turbopack)            | Server Components by default, SSR/SSG hybrid                      |
| **Runtime / Library** | React 19 + TypeScript (Strict Mode)               | Type-safe components, async server components                     |
| **Styling**           | Tailwind CSS v4 + `@tailwindcss/postcss`          | Modern CSS variables, design tokens in `globals.css`              |
| **UI Components**     | shadcn/ui (`base-nova` style)                     | Reusable, unstyled-first accessible components                    |
| **Icons**             | Lucide React                                      | Clean, scalable SVG icons                                         |
| **Animations**        | Motion (`motion`)                                 | Carefully selected micro-interactions with reduced-motion support |
| **Backend / DB**      | Supabase (PostgreSQL 15+)                         | Managed PostgreSQL, Row Level Security, Storage, Auth             |
| **Auth / SSR**        | `@supabase/ssr` + `@supabase/supabase-js`         | Secure cookie-based server authentication                         |
| **Validation**        | Zod                                               | Schema-first input validation across forms and API routes         |
| **Code Quality**      | ESLint + Prettier + `prettier-plugin-tailwindcss` | Automated linting and formatting                                  |
| **Testing**           | Vitest + Testing Library + jsdom                  | Unit and component testing across Node and DOM                    |

---

## 3. PROJECT DIRECTORY CONVENTIONS

```
s:/Apps/consultant/
├── docs/                     # Architectural documentation, schemas, and task specs
│   ├── ARCHITECTURE.md       # High-level architecture, data flow, SSR strategy
│   ├── BACKEND_SECURITY.md   # Auth, RLS, secret management, and validation
│   ├── CMS_SCHEMA.md         # Database entities, relationships, fields, migrations
│   ├── DECISIONS.md          # Architectural Decision Records (ADR log)
│   ├── DESIGN_SYSTEM.md      # Typography, tokens, editorial layout utilities
│   ├── EXECUTION_PLAN.md     # 10-phase milestone plan
│   ├── HANDOFF.md            # Immediate project state and next steps
│   ├── PROJECT_BRIEF.md      # Commercial positioning, audience, exclusions
│   └── TASKS.md              # Actionable task backlog with acceptance criteria
├── public/                   # Public static assets
│   ├── icons/                # SVG icons and favicon assets
│   └── images/               # Curated photography and illustrations
├── src/
│   ├── app/
│   │   ├── (public)/         # Public route group (wrapped in PublicLayout)
│   │   │   ├── page.tsx      # Homepage (editorial sections)
│   │   │   ├── services/     # Service catalog & dynamic [slug] pages
│   │   │   ├── contact/      # Business inquiry consultation route
│   │   │   └── layout.tsx    # Public header, navigation, and footer
│   │   ├── admin/            # CMS administrative console (isolated layout)
│   │   │   ├── login/        # Administrator authentication page
│   │   │   ├── content/      # Homepage sections manager
│   │   │   ├── services/     # Service creation & editing
│   │   │   ├── projects/     # Case studies manager
│   │   │   ├── media/        # Image & document library
│   │   │   ├── inquiries/    # Confidential client inquiry manager
│   │   │   ├── settings/     # Global company & branding settings
│   │   │   └── layout.tsx    # Admin sidebar & header shell
│   │   ├── api/              # Route handlers (e.g., /api/health)
│   │   ├── globals.css       # Tailwind v4 theme, design tokens, utility classes
│   │   ├── layout.tsx        # Root HTML shell, fonts, SEO schema
│   │   ├── not-found.tsx     # Custom 404 page
│   │   ├── robots.ts         # Search engine robots definition
│   │   └── sitemap.ts        # Dynamic XML sitemap generator
│   ├── components/
│   │   ├── admin/            # Admin-specific tables, inputs, and drawers
│   │   ├── animations/       # Motion wrappers with prefers-reduced-motion
│   │   ├── forms/            # Contact and CMS mutation forms
│   │   ├── layout/           # Shared headers, footers, breadcrumbs
│   │   ├── sections/         # Reusable homepage and landing sections
│   │   ├── seo/              # JsonLd and metadata components
│   │   └── ui/               # shadcn/ui components (button, card, input, etc.)
│   ├── config/               # Static site configuration and typography
│   ├── hooks/                # Custom React client hooks
│   ├── lib/
│   │   ├── auth/             # Server-side auth gates (requireAdmin, assertAdmin)
│   │   ├── env.ts            # Fail-secure environment variable accessor
│   │   ├── seo/              # Metadata generators and schema helpers
│   │   ├── supabase/         # Server, client, and admin Supabase clients
│   │   ├── utilities/        # String, date, and formatting utilities
│   │   ├── utils.ts          # Classname merger (cn)
│   │   └── validations/      # Zod validation schemas
│   ├── proxy.ts              # Edge cookie refresher & admin route guard
│   └── types/                # Domain models, CMS types, and database interfaces
├── supabase/
│   └── migrations/           # Version-controlled SQL migration scripts
└── tests/                    # Vitest unit and UI test suites
```

---

## 4. UI & DESIGN SYSTEM GUIDELINES

1. **Aesthetic Direction**:
   - Editorial, nature-inspired, and authoritative. Avoid generic tech-startup vibes or vibrant SaaS dashboards.
   - Core Palette:
     - **Forest Green** (`#153E35`): Trust, ecology, depth.
     - **Warm Ivory** (`#F8F7F2`): Natural paper-like canvas, avoiding sterile `#ffffff`.
     - **Sage** (`#A7BBA3`): Soft vegetation, accents, borders.
     - **Charcoal** (`#252B29`): High-contrast typography and structural darks.
2. **Typography**:
   - Headings: Serif or refined editorial typography via `--font-heading`.
   - Body: Clean, highly legible grotesque sans via `--font-sans`.
3. **Motion Guidelines**:
   - Keep interactions subtle (200–400ms ease-out). No spinning 3D objects, jittery loops, or aggressive parallax.
   - **MANDATORY**: Always support `prefers-reduced-motion: reduce`. Use the helpers in `src/components/animations/`.
4. **Layout Utilities**:
   - Use `.container-editorial` (max 80rem) for content grids and hero sections.
   - Use `.container-prose` (max 44rem) for case study reads and article bodies.

---

## 5. BACKEND, CMS & SECURITY MANDATES

1. **Server-Side Authorization**:
   - Client-side visibility (hiding a button) is **NEVER** security.
   - Every administrative page and server action must call `requireAdmin()` or `assertAdmin()` from `src/lib/auth/admin.ts`.
   - Admin access is restricted to verified users with records in `public.admin_profiles`.
2. **Row Level Security (RLS)**:
   - RLS is enabled on **every** Supabase table.
   - Public visitors have `SELECT` access strictly on rows where `is_published = true` (or `is_visible = true`).
   - The `inquiries` table allows public `INSERT`, but public `SELECT` is **strictly forbidden**. Only authenticated admins can read inquiries.
3. **Fail-Secure Architecture**:
   - When Supabase credentials are not configured (e.g., during fresh local setup), public placeholder pages must render cleanly without crashes.
   - Privileged operations must throw `SupabaseNotConfiguredError` rather than silently bypassing security.
4. **Secret Management**:
   - Never prefix server-only keys (e.g., `SUPABASE_SERVICE_ROLE_KEY`) with `NEXT_PUBLIC_`.
   - Never import `@/lib/supabase/admin` or `SUPABASE_SERVICE_ROLE_KEY` into client components.
5. **CMS Pricing Rule**:
   - Environmental consulting scopes are bespoke. Never force consulting firms to display prices.
   - The `pricing_note` field is strictly optional and must remain hidden when null or empty.

---

## 6. DEVELOPMENT COMMANDS & TESTING WORKFLOW

All agents must verify their changes locally before submitting their work:

```bash
# Start local development server (http://localhost:3000)
npm run dev

# Run TypeScript strict typecheck
npm run typecheck

# Run ESLint validation
npm run lint

# Format codebase with Prettier
npm run format:check

# Run Vitest test suites (Node + UI)
npm run test

# Run production build (validates SSG, routes, Turbopack)
npm run build
```

---

## 7. PROHIBITED ACTIONS FOR AGENTS

Agents working on this repository are strictly prohibited from:

- ❌ Refactoring this project into a multi-tenant SaaS application.
- ❌ Adding subscription billing or payment gateways (Stripe, LemonSqueezy) without direct user approval.
- ❌ Introducing heavy paid UI component libraries or proprietary closed-source dependencies.
- ❌ Committing real credentials, `.env`, or `.env.local` files to git.
- ❌ Committing untested code or declaring tasks complete without running `npm run typecheck`, `npm run lint`, and `npm run test`.
- ❌ Modifying database tables manually in production instead of version-controlled migrations in `supabase/migrations/`.
- ❌ Removing the Next.js agent warning banner at the top of this file.

---

## 8. MULTI-AGENT HANDOFF CONVENTIONS

- **Integravity** is the Lead Architect, Task Planner, and Quality Reviewer.
- **OpenCode** is the Lead Implementation Engineer.
- When OpenCode finishes an assigned task from `docs/TASKS.md`:
  1. Run all verification commands.
  2. Document changes and test results in `docs/HANDOFF.md`.
  3. Signal Integravity for architectural review.
