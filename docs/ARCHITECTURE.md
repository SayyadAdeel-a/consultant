# IntegraVity — Technical Architecture & System Design

## 1. High-Level Architectural Overview

IntegraVity is built on **Next.js 16 with App Router**, operating in a hybrid Server Component (RSC) and Client Component architecture, paired with a managed **Supabase** backend (PostgreSQL 15+, Auth, Storage, and Row Level Security).

The entire system resides within a unified repository and deployment bundle. Privileged administrative CMS routes and public marketing pages share common database connections and domain types while maintaining strict server-side boundary isolation.

```
                              ┌────────────────────────┐
                              │  Internet / Client     │
                              └───────────┬────────────┘
                                          │
                                          ▼
                              ┌────────────────────────┐
                              │  Edge Layer (proxy.ts) │
                              │  • Cookie refresh      │
                              │  • Fast-path redirect  │
                              └───────────┬────────────┘
                                          │
                   ┌──────────────────────┴──────────────────────┐
                   │                                             │
                   ▼                                             ▼
       ┌────────────────────────┐                   ┌────────────────────────┐
       │ Public Routes (public) │                   │ Admin Routes (/admin)  │
       │ • Static / RSC Hybrid  │                   │ • requireAdmin() Gate  │
       │ • PublicLayout         │                   │ • AdminLayout          │
       │ • Fail-secure degraded │                   │ • Fail-secure locked   │
       └───────────┬────────────┘                   └───────────┬────────────┘
                   │                                             │
                   │  anon key (RLS: published only)             │  authenticated user
                   │                                             │  (RLS: is_admin())
                   └──────────────────────┬──────────────────────┘
                                          ▼
                              ┌────────────────────────┐
                              │   Supabase Services    │
                              │ • PostgreSQL 15+ (RLS) │
                              │ • Auth (GoTrue)        │
                              │ • Storage (S3 API)     │
                              └────────────────────────┘
```

---

## 2. Rendering Strategy & Component Hierarchy

### 2.1 Server Components by Default

In compliance with modern Next.js App Router design:

- All pages (`page.tsx`), layouts (`layout.tsx`), and static content sections are **React Server Components (RSC)**.
- Data fetching occurs directly within Server Components via `src/lib/supabase/server.ts`, minimizing client-side JavaScript payloads.
- **Client Components (`"use client"`)** are strictly isolated to leaf nodes requiring user interactivity (e.g., interactive navigation menus, contact form inputs, animated accordion toggles, admin file uploaders).

### 2.2 Route Groups & Layout Boundary

- **`src/app/(public)/`**: Group route defining the public experience. Uses `PublicLayout` containing the public navigation header, announcement banner, and footer.
- **`src/app/admin/`**: Isolated route defining the CMS experience. Uses `AdminLayout` featuring a dedicated management sidebar, administrative header, and status notifications. The public header/footer are never loaded within `/admin`.
- **`src/app/layout.tsx`**: Root HTML layout supplying base fonts, theme variables, accessibility skip-links, and JSON-LD structured data.

---

## 3. Request Lifecycle & Authentication Pipeline

IntegraVity uses a three-tier defensive authorization strategy:

1. **Edge/Proxy Tier (`src/proxy.ts`)**:
   - Executes before request processing.
   - Refreshes expiring Supabase session tokens via `@supabase/ssr` cookies.
   - Provides a fast-path redirect: if an unauthenticated user attempts to visit `/admin` routes (other than `/admin/login`), they are immediately bounced to the login page without executing heavy server code.
2. **Server Action & Route Guard Tier (`src/lib/auth/admin.ts`)**:
   - `proxy.ts` is never trusted as the ultimate security boundary.
   - Every admin page, layout, and server action explicitly calls `await requireAdmin()` (for pages) or `await assertAdmin()` (for actions).
   - This verifies the cryptographically signed JWT with Supabase Auth and queries `public.admin_profiles` to confirm the user possesses administrative clearance.
3. **Database Tier (Supabase Row Level Security)**:
   - Even if application code were compromised, PostgreSQL RLS policies enforce that non-admin database roles cannot select unpublished records or mutate any CMS data.

---

## 4. Fail-Secure Environment Architecture

During early initialization or when deploying client templates before database provisioning:

- **Public Site**: Operates gracefully. If `NEXT_PUBLIC_SUPABASE_URL` is empty, fallback content and illustrative static data are rendered without throwing exceptions.
- **Administrative Site**: Fails secure. When credentials are unconfigured, `AdminConfigNotice` alerts the developer, and pages throw `SupabaseNotConfiguredError` rather than allowing unauthenticated entry or silent failure.

---

## 5. Data Flow & Mutation Patterns

All data mutations in IntegraVity follow strict Server Action workflows:

```
[Client Form] ──(FormData)──> [Server Action] ──(Zod Validation)──> [assertAdmin() / Gate] ──> [Supabase Mutation] ──(revalidatePath)──> [RSC Re-render]
```

1. **Client Submission**: Forms submit strongly typed payloads via native React Server Actions.
2. **Input Validation**: Server actions parse input against Zod schemas in `src/lib/validations/`.
3. **Privilege Assertion**: Privileged actions call `assertAdmin()`.
4. **Database Execution**: Actions execute queries using the authenticated Supabase server client.
5. **Cache Invalidation**: `revalidatePath()` or `revalidateTag()` purges stale Next.js cache entries, ensuring immediate consistency.

---

## 6. SEO & Structured Data Architecture

Search engine optimization is built natively into the route architecture:

- **`src/lib/seo/`**: Contains metadata generation utilities (`createPageMetadata()`) ensuring standardized OpenGraph, Twitter card, canonical URL, and robots meta tags across all pages.
- **JSON-LD Schema**: Root layout injects Google-compliant `Organization` and `LocalBusiness` schemas via `src/components/seo/JsonLd.tsx`. Dynamic service pages inject `Service` structured data.
- **Dynamic Sitemap & Robots**: `src/app/sitemap.ts` and `src/app/robots.ts` generate search engine manifests adhering to indexing preferences.
