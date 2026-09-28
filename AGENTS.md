<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# ALDERLINE ENVIRONMENTAL — AGENT INSTRUCTION & ARCHITECTURE GUIDE

Welcome to **Alderline Environmental** (`S:\Apps\consultant`), an integrated, production-ready enterprise website and Content Management System (CMS) designed specifically for ecological consulting, natural resource management, and regulatory compliance.

This document is the **primary instruction file** for all AI coding agents (such as **Integravity** and **OpenCode**) and human engineers contributing to this codebase. You must read and strictly adhere to this guide.

---

## 1. PROJECT OVERVIEW & ARCHITECTURE STATUS

### 1.1 What the Project Is
The codebase unifies:
1. **The Alderline Environmental Frontend:** Approved, high-end responsive environmental consulting frontend featuring Webflow-grade design parity, 48 custom high-resolution assets, 3 ambient looping videos, and GSAP ScrollTrigger motion interactions.
2. **The Supabase CMS & Server Backend:** PostgreSQL database integration (`site_settings`, `services`, `industries`, `projects`, `faqs`, `homepage_sections`, `inquiries`), Row-Level Security (RLS) enforcement, Zod-validated Server Actions, anti-spam honeypot defense, and admin authentication.

### 1.2 Unified Repository & Branching
- **Active Working Repository:** `S:\Apps\consultant`
- **Active Feature Branch:** `feature/unified-alderline-integration`
- **Original Projects Preserved:**
  - Project A (Frontend source): `S:\Apps\ai-website-cloner` preserved at commit `d586e4f`.
  - Project B (Backend source): `S:\Apps\consultant` backup branch `backup-consultant-main` at commit `fda55ae`.

### 1.3 Critical Mandates
- **Single-Tenant Architecture:** This is an independent corporate website and CMS for Alderline Environmental. Do NOT introduce multi-tenant SaaS complexity, subscription billing, or generic site builders.
- **Fail-Safe Content Precedence:** Public routes hydrate dynamically from Supabase tables (`site_settings`, `services`, `homepage_sections`, `faqs`), but **ALWAYS** fall back gracefully to the authoritative Alderline content in `@/lib/alderline-content` and `@/lib/blog-data` if the database is unreachable or empty. Under zero circumstances may a public route fail or throw a 500 due to a database disconnect.
- **Visual & Interaction Parity:** Do not remove or alter Alderline's approved visual design, typography, GSAP animations, or asset paths in `public/assets/alderline/` and `public/images/ecolia/`.

---

## 2. APPROVED TECHNOLOGY STACK

| Layer | Approved Technology | Purpose / Notes |
| :--- | :--- | :--- |
| **Framework** | Next.js 16.3.6 (App Router + Turbopack) | Server Components default, SSR/SSG hybrid |
| **Runtime / Library** | React 19 + TypeScript (Strict Mode) | Type-safe components, async server components |
| **Styling** | Tailwind CSS + Custom CSS Variables | Design tokens in `globals.css` and `ecolia.css` |
| **UI Components** | shadcn/ui primitives | Radix primitives with accessible ARIA standards |
| **Motion & Interactivity** | GSAP 3.15 + ScrollTrigger & Motion | SSR-safe, test-safe (`NODE_ENV === "test"` bypass) |
| **Backend & Database** | Supabase (PostgreSQL 15+) | Managed PostgreSQL, Row Level Security (RLS) |
| **Auth & SSR** | `@supabase/ssr` + `@supabase/supabase-js` | Secure cookie-based server authentication |
| **Form Mutations** | Next.js Server Actions + Zod | Schema-validated, CSRF-protected, honeypot-defended |
| **Testing** | Vitest 5.0 + Testing Library + jsdom | 21 test files, 203 automated test cases |

---

## 3. PROJECT DIRECTORY STRUCTURE

```
S:\Apps\consultant/
├── docs/                     # Comprehensive architecture and integration documentation
│   ├── INTEGRATION_ARCHITECTURE.md   # Unified system architecture & component hierarchy
│   ├── BACKEND_AUDIT.md              # Supabase tables, RLS, and Server Actions audit
│   ├── API_CONTRACT.md               # Server Action schemas, Zod rules, REST endpoints
│   ├── DATABASE_INTEGRATION.md       # PostgreSQL schema, RLS policies, client isolation
│   ├── SECURITY_REVIEW.md            # Threat model, credential isolation, RLS proofs
│   ├── CMS_HANDOFF.md                # Admin dashboard specs for upcoming implementation
│   ├── INTEGRATION_TEST_REPORT.md    # Automated test metrics and verification proofs
│   ├── FINAL_HANDOFF.md              # Executive summary and deployment operations
│   ├── ALDERLINE_ASSET_MANIFEST.md   # 48 visual assets catalog and mapping
│   ├── ALDERLINE_VIDEO_INTEGRATION.md # Ambient video playback & optimization guide
│   └── ALDERLINE_CONTENT_MAP.md      # Content inventory and copy mapping
├── public/
│   ├── assets/alderline/     # 48 curated high-res Alderline brand, hero, team & video files
│   ├── images/ecolia/        # Optimized Webflow-parity image mappings
│   ├── favicon.ico
│   └── site.webmanifest
├── src/
│   ├── app/
│   │   ├── (public)/         # Public Alderline routes
│   │   │   ├── page.tsx      # Homepage (7-section narrative + CMS visibility integration)
│   │   │   ├── about/        # Multidisciplinary team, mission, aerial gallery
│   │   │   ├── services/     # 4 core practice areas catalog
│   │   │   │   └── [slug]/   # Dynamic deep-dive service detail pages
│   │   │   ├── blog/         # Articles & case studies catalog
│   │   │   │   └── [slug]/   # Dynamic article detail pages
│   │   │   ├── contact/      # Intake consultation form wired to submitInquiry
│   │   │   ├── utility/      # Terms, privacy, and style guide
│   │   │   └── layout.tsx    # Public layout with Alderline Navbar & Footer
│   │   ├── admin/            # Administrative route shells and future CMS dashboard
│   │   ├── api/health/       # System health check endpoint
│   │   ├── globals.css       # Merged Alderline design tokens and utilities
│   │   └── layout.tsx        # Root HTML layout with font definitions
│   ├── components/
│   │   ├── ecolia/           # Alderline presentation components (Navbar, Hero, About, etc.)
│   │   ├── forms/            # ContactForm with honeypot & server action binding
│   │   ├── sections/         # Modular public sections
│   │   └── ui/               # shadcn/ui primitives
│   ├── config/               # Site configuration, navigation, services, typography
│   ├── lib/
│   │   ├── actions/          # Server Actions (inquiries, auth, admin)
│   │   ├── data/             # Public fail-safe data readers (public.ts, identity.ts)
│   │   ├── supabase/         # Server, client, and admin Supabase clients
│   │   ├── alderline-content.ts # Authoritative fallback content store
│   │   └── blog-data.ts      # Authoritative articles and case studies store
│   └── types/                # Domain models, CMS schemas, and TypeScript interfaces
└── tests/                    # 21 Vitest test suites (Admin + Public UI)
```

---

## 4. PUBLIC DATA LAYER & FAIL-SAFE RULES

1. **Always Use `src/lib/data/public.ts`:**
   - Use `getSiteSettings()`, `getVisibleHomepageSections()`, `getServices()`, `getServiceBySlug()`, `getFaqs()`, and `getPublishedArticles()` in public Server Components.
2. **Never Allow Unhandled Exceptions in Data Fetching:**
   - Every fetcher contains a try/catch block that defaults to `@/lib/alderline-content` or `@/lib/blog-data` if the database query fails or returns empty.
3. **Contact Submissions:**
   - Handled exclusively via `submitInquiry` (`src/lib/actions/inquiries.ts`).
   - Validated against `inquirySchema`.
   - Silent anti-spam honeypot defense on the `website` field.

---

## 5. DEVELOPMENT COMMANDS & VERIFICATION WORKFLOW

Every agent must run and pass all verification checks before submitting work:

```bash
# Start local development server (http://localhost:3000)
npm run dev

# Run TypeScript strict typecheck (0 errors required)
npm run typecheck

# Run automated test suites (21 files, 203 tests)
npm test

# Run production build via Turbopack (41 routes prerendered)
npm run build

# Run complete verification pipeline
npm run check
```

---

## 6. PROHIBITED ACTIONS FOR AGENTS

- ❌ Never commit secrets, `.env`, or `.env.local` files to git.
- ❌ Never expose `SUPABASE_SERVICE_ROLE_KEY` to client components.
- ❌ Never delete or overwrite the original Project A or Project B backup branches.
- ❌ Never remove `NODE_ENV === "test"` guards in `src/components/ecolia/Animations.tsx`.
- ❌ Never use raw `<img>` tags on public routes; always use Next.js `<Image>` from `next/image`.
- ❌ Never remove the Next.js agent warning banner at the top of this file.
