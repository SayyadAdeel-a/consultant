# IntegraVity — Architectural Decision Records (ADR Log)

## ADR-001: Next.js 16 App Router with Server Components

### Context

We needed a modern, high-performance web framework capable of delivering near-instant page loads for public marketing pages while supporting a secure, integrated administrative CMS.

### Decision

Adopt **Next.js 16 with App Router and Turbopack**. All pages and layouts default to React Server Components (RSC), restricting Client Components (`"use client"`) strictly to leaf interactive components.

### Alternatives Considered

- _Remix / React Router v7_: Strong data loaders, but smaller ecosystem for drop-in headless component primitives and Vercel-native optimization.
- _Separate Express API + Vite SPA_: Introduces cross-origin authentication complexity, two deployment targets, and worse initial SEO for public pages.

### Consequences

- **Positive**: Blazing fast initial server rendering, minimal client JavaScript bundles, native streaming, and co-located Server Actions.
- **Negative**: Strict adherence to Next.js 16 async conventions (e.g. `await params`, `await cookies()`).

---

## ADR-002: Single-Tenant Reusable Template Architecture (Not Multitenant SaaS)

### Context

Commercial environmental consulting firms require isolated, compliant data storage and custom domain deployments. Multitenant SaaS applications introduce complex cross-tenant security risks, tenant routing overhead, and billing dependencies.

### Decision

Engineer IntegraVity as a **reusable, single-tenant commercial template**. Each client deployment receives an isolated Next.js deployment and dedicated Supabase project.

### Alternatives Considered

- _Multitenant SaaS with subdomain routing_: Excessive complexity, billing overhead, and high regulatory concern for clients handling proprietary site assessments.

### Consequences

- **Positive**: Clean architecture, zero tenant leakage risk, simple client handover, zero recurring SaaS platform infrastructure costs.
- **Negative**: Requires independent deployment steps per client.

---

## ADR-003: Supabase for PostgreSQL, Auth, Storage, and Row Level Security

### Context

The project requires a relational database, administrative authentication, persistent object storage for photography and PDF reports, and robust authorization boundaries.

### Decision

Standardize on **Supabase** (PostgreSQL 15+, Supabase Auth with SSR cookies, Supabase Storage, and Row Level Security).

### Alternatives Considered

- _Prisma + Custom PostgreSQL + AWS S3 + NextAuth_: Requires configuring and maintaining four disparate services and custom RLS integration.
- _Headless CMS (Sanity / Contentful)_: Adds third-party monthly costs, external API rate limits, and breaks direct relational linking between inquiries and services.

### Consequences

- **Positive**: Unified developer experience, enterprise-grade PostgreSQL with RLS, built-in storage and authentication, generous free tier.
- **Negative**: Requires configuring a Supabase project when deploying live instances.

---

## ADR-004: Tailwind CSS v4 & shadcn/ui (base-nova) for Editorial Styling

### Context

We require a bespoke, nature-inspired visual design that feels editorial and high-end rather than generic SaaS.

### Decision

Use **Tailwind CSS v4** with `@tailwindcss/postcss`, declared theme variables in `src/app/globals.css`, and **shadcn/ui** with the `base-nova` preset.

### Alternatives Considered

- _Tailwind v3_: Legacy config files; Tailwind v4 native CSS-first configuration is faster and cleanly isolates theme variables.
- _Chakra UI / MUI_: Heavy runtime CSS-in-JS overhead, generic aesthetics that are difficult to customize into an editorial style.

### Consequences

- **Positive**: Zero runtime CSS overhead, full control over design tokens, accessible ARIA primitives.
- **Negative**: Tailwind v4 uses `@theme inline` and modern CSS selectors requiring modern build tools.

---

## ADR-005: Fail-Secure Architecture for Unconfigured Environments

### Context

When developers or CI pipelines clone the repository without live Supabase API keys, the public marketing pages should remain inspectable, while administrative interfaces must remain locked down.

### Decision

Implement `src/lib/env.ts` and `src/app/admin/config-notice.tsx` such that public pages render static fallback content, while administrative actions throw `SupabaseNotConfiguredError` and display configuration notices.

### Alternatives Considered

- _Crashing the entire app on missing env vars_: Prevents frontend developers from inspecting or working on public UI without full backend setup.
- _Defaulting to mock admin bypass_: Severe security vulnerability that could accidentally ship to production.

### Consequences

- **Positive**: Excellent local developer experience paired with rock-solid security.

---

## ADR-006: Zod Schema-First Validation & Honeypot Spam Defense

### Context

Inbound inquiries represent high-value RFPs, but public forms are frequent targets for automated spam.

### Decision

Validate all form submissions using **Zod** (`contactInquirySchema`) and include an invisible honeypot field (`companyWebsite`). Submissions with filled honeypots are dropped immediately before database contact. Furthermore, RLS strictly prohibits public `SELECT` on inquiries.

### Alternatives Considered

- _Google reCAPTCHA_: Adds third-party tracking scripts, cookie consent requirements, and degrades performance.

### Consequences

- **Positive**: Zero external tracking scripts, immediate spam elimination, strong TypeScript inference.
