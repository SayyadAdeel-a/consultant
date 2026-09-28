# API & SERVER ACTIONS CONTRACT: ALDERLINE ENVIRONMENTAL

## 1. Overview
This document specifies the contract for all public and administrative Server Actions and REST API endpoints within the unified **Alderline Environmental** application (`S:\Apps\consultant`).

The architecture leverages Next.js 16 App Router Server Actions for mutations and Server Components for data fetching, eliminating unnecessary client-side API boilerplate while enforcing strict Zod schema validation, anti-spam honeypot defense, and fail-safe execution.

---

## 2. Public Mutations (Server Actions)

### 2.1 `submitInquiry`
- **Location:** `src/lib/actions/inquiries.ts`
- **Trigger:** Alderline Public Intake Form (`src/components/forms/contact-form.tsx` on `/contact`)
- **Execution Context:** Next.js Server Action (`"use server"`)
- **Database Target:** `public.inquiries` table via Supabase server client

#### Input Payload Schema (Zod)
```typescript
export const inquirySchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters").max(100),
  email: z.string().email("Please provide a valid email address"),
  phone: z.string().max(30).optional().or(z.literal("")),
  organization: z.string().max(100).optional().or(z.literal("")),
  serviceInterest: z.string().optional().or(z.literal("")),
  projectScope: z.string().min(10, "Please describe your project scope (minimum 10 characters)").max(2000),
  budgetRange: z.string().optional().or(z.literal("")),
  timeline: z.string().optional().or(z.literal("")),
  // Security honeypot - must be empty
  website: z.string().max(0, "Bot detected").optional().or(z.literal("")),
});
```

#### Field Mappings to PostgreSQL Schema
| Form Field | Zod Type | DB Column (`inquiries`) | DB Nullable | Default / Notes |
| :--- | :--- | :--- | :--- | :--- |
| `fullName` | `string (2-100)` | `full_name` | No | Client contact name |
| `email` | `string (email)` | `email` | No | Client email address |
| `phone` | `string (<=30)` | `phone` | Yes | Direct contact number |
| `organization` | `string (<=100)` | `company` | Yes | Client enterprise / agency |
| `serviceInterest` | `string` | `service_id` or `metadata->service` | Yes | Selected discipline |
| `projectScope` | `string (10-2000)`| `message` | No | Detailed consultation scope |
| `budgetRange` | `string` | `metadata->budget` | Yes | Project budget tier |
| `timeline` | `string` | `metadata->timeline` | Yes | Target project milestone |
| `website` | `string (empty)` | *None* | N/A | Anti-bot honeypot |

#### Response Type
```typescript
export type ActionState<T = unknown> = {
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
  data?: T;
};
```

#### Behavioral Contract
1. **Honeypot Evaluation:** If `website` contains any character, the action immediately aborts execution and silently returns `{ success: true, message: "Inquiry received" }` without database insertion, mitigating automated spam while denying bot feedback.
2. **Schema Validation:** If validation fails, returns `{ success: false, errors: zodErrors.flatten().fieldErrors, message: "Validation failed" }` with HTTP 200 (Server Action standard).
3. **Fail-Safe Fallback:** If the Supabase database connection is unavailable or tables are locked, the Server Action logs the incident securely to server stderr and returns a graceful failure payload without unhandled server crashes.
4. **Cache Invalidation:** On success, calls `revalidatePath("/admin/inquiries")` so authenticated reviewers immediately see new inquiries.

---

## 3. Administrative Actions

### 3.1 Authentication Actions
- **Location:** `src/lib/actions/auth.ts`
- **Actions:**
  - `signInWithEmail(formData)`: Authenticates admin user with Supabase SSR Auth. Sets HttpOnly cookies.
  - `signOut()`: Terminates session, clears session cookies, redirects to `/admin/login`.
  - `resetPassword(email)`: Dispatches secure password reset token via Supabase Auth email.

### 3.2 Content & Settings Actions
- **Location:** `src/lib/actions/admin.ts`
- **Security Check:** Every administrative action begins with `assertAdminUser()` which checks `supabase.auth.getUser()`. If unauthenticated, raises `UnauthorizedError` or redirects.
- **Actions:**
  - `updateSiteSettings(settingsPayload)`: Updates `site_settings` table (company identity, phone, address, social URLs). Revalidates layout cache.
  - `updateService(slug, data)`: Modifies or creates records in `services`.
  - `toggleHomepageSection(key, enabled)`: Updates `homepage_sections` visibility flags.

---

## 4. Public REST API Endpoints

### 4.1 Health Check Endpoint
- **Route:** `GET /api/health`
- **Location:** `src/app/api/health/route.ts`
- **Access:** Public (unauthenticated)
- **Response Format:**
```json
{
  "status": "healthy",
  "timestamp": "2026-09-28T14:15:00.000Z",
  "version": "1.0.0",
  "services": {
    "database": "connected",
    "cache": "ready"
  }
}
```
- **Error Response:** If database ping fails, returns HTTP 503 with `"status": "degraded"`.

---

## 5. Client Data Fetching Contract (Public Read Layer)

Public Server Components do not use REST `fetch` endpoints; they utilize direct, memoized, server-side data fetchers defined in `src/lib/data/public.ts`:

```typescript
// Site Settings & Contact Identity
export async function getSiteSettings(): Promise<SiteSettings>;

// Homepage CMS Visibility Toggles
export async function getVisibleHomepageSections(): Promise<HomepageSection[]>;

// Services Catalog
export async function getServices(): Promise<ServiceItem[]>;
export async function getServiceBySlug(slug: string): Promise<ServiceItem | null>;

// Knowledge Base & Articles
export async function getFaqs(): Promise<FaqItem[]>;
export async function getPublishedArticles(): Promise<ArticleItem[]>;
```

### Precedence & Graceful Fallback Guarantee
Every public data reader adheres to the **Alderline Fallback Guarantee**:
1. Query Supabase table via `createPublicClient()` with a strict 2500ms timeout.
2. If records exist and pass structural sanity checks, return the dynamic database content.
3. If database returns empty, network times out, or Supabase credentials are not configured, log a warning and return the hardcoded, approved Alderline content (`@/lib/alderline-content` or `@/lib/blog-data`).
4. **Under zero circumstances may a public route throw a 500 error due to database disconnect.**
