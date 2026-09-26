# IntegraVity — Backend Security Architecture

## 1. Security Principles & Threat Model

Security in IntegraVity is treated as a foundational architectural property, not a cosmetic layer:

- **Zero Client Trust**: UI visibility (hiding a button or page) is **NEVER** treated as authorization.
- **Fail-Secure Defaults**: If credentials, sessions, or profile records are missing or corrupted, operations fail closed (reject or redirect to login).
- **Defense in Depth**: Three concentric layers protect sensitive data:
  1. Edge Proxy (`src/proxy.ts`)
  2. Server Action & Layout Gates (`src/lib/auth/admin.ts`)
  3. Database Row Level Security (`public.*` RLS policies)

---

## 2. Authentication & Account Provisioning

### 2.1 Supabase Auth with Server Sessions

- Authentication uses Supabase Auth with cookie-based session persistence via `@supabase/ssr`.
- Cookies are transmitted with `HttpOnly`, `SameSite=Lax`, and `Secure` (in production).
- Session tokens are refreshed automatically on the fly by `src/proxy.ts`.

### 2.2 Public Registration Disabled

- **CRITICAL**: Public self-registration is strictly disabled.
- The `/admin/login` page only accepts pre-existing administrator credentials.
- New administrative accounts must be provisioned through a controlled backend process:
  1. User created via Supabase Auth Admin API or CLI (`supabase auth users create`).
  2. Corresponding record inserted into `public.admin_profiles`.

---

## 3. Server-Side Authorization Gates

Every administrative route and action executes verification on the server:

```typescript
// Example: Gating a server action or API route
import { assertAdmin } from "@/lib/auth/admin";

export async function updateServiceAction(formData: FormData) {
  // 1. Enforce admin identity on server
  const admin = await assertAdmin();

  // 2. Validate payload with Zod
  const validated = serviceUpdateSchema.parse(formData);

  // 3. Mutate database via authenticated client
  // ...
}
```

- `requireAdmin()`: Used in admin layouts/pages. Redirects unauthenticated visitors to `/admin/login`.
- `assertAdmin()`: Used in Server Actions and Route Handlers. Throws an unauthorized exception if the caller is not an authenticated administrator.
- `hasAdminProfile()`: Direct query checking if `user_id = auth.uid()` exists in `public.admin_profiles`. If any lookup error occurs, it returns `false` (fail secure).

---

## 4. Database Row Level Security (RLS) Policies

RLS is enabled on **all 10 tables** in `supabase/migrations/20260927000000_initial_schema.sql`:

| Table               | Public Access (anon)           | Admin Access (authenticated)             |
| :------------------ | :----------------------------- | :--------------------------------------- |
| `admin_profiles`    | **DENIED**                     | SELECT all, UPDATE own profile           |
| `site_settings`     | SELECT all                     | FULL CRUD                                |
| `homepage_sections` | SELECT (`is_visible = true`)   | FULL CRUD                                |
| `services`          | SELECT (`is_published = true`) | FULL CRUD                                |
| `industries`        | SELECT (`is_published = true`) | FULL CRUD                                |
| `projects`          | SELECT (`is_published = true`) | FULL CRUD                                |
| `team_members`      | SELECT (`is_published = true`) | FULL CRUD                                |
| `faqs`              | SELECT (`is_published = true`) | FULL CRUD                                |
| `media_assets`      | SELECT all                     | FULL CRUD                                |
| `inquiries`         | **INSERT ONLY** (No SELECT)    | FULL CRUD (View, update status, archive) |

### Inquiry Privacy Protection

The `inquiries` table contains confidential client RFP data and site locations. Public visitors have **zero read access**. An anonymous user can insert a submission, but PostgreSQL RLS blocks any attempt to list, query, or enumerate existing submissions.

---

## 5. Secrets Management & Fail-Secure Environment

Environment variables are partitioned in `src/lib/env.ts`:

- **Browser-Safe (`NEXT_PUBLIC_*`)**:
  - `NEXT_PUBLIC_SITE_URL`: Canonical site origin.
  - `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL.
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anonymous key (restricted by RLS).
- **Server-Only Secrets**:
  - `SUPABASE_SERVICE_ROLE_KEY`: Bypasses RLS. Required only for privileged server-side maintenance tasks. **Never** prefixed with `NEXT_PUBLIC_`. **Never** imported into client components.
- **Fail-Secure Fallbacks**:
  - `getSupabaseServerConfig()` and `getSupabaseServiceRoleConfig()` throw `SupabaseNotConfiguredError` with clear configuration guidance when invoked without environment credentials.

---

## 6. Input Validation & Spam Protection

### 6.1 Schema-First Validation (Zod)

All user submissions and administrative mutations are validated against strict Zod schemas:

- `contactInquirySchema` (`src/lib/validations/contact.ts`):
  - Validates full name length (2–100 chars).
  - Validates RFC-compliant email address.
  - Restricts `inquiryType` to an approved enum.
  - Enforces minimum 20-character message length to eliminate low-effort spam.
  - Requires explicit consent acknowledgment.

### 6.2 Honeypot Anti-Spam Defense

- The contact form includes an invisible `companyWebsite` field.
- Human users never see or fill this field (hidden via CSS and `aria-hidden="true"`).
- Automated spam bots predictably fill all inputs. If `companyWebsite` contains any value, the schema rejects the submission immediately without touching the database.

---

## 7. Media Upload & Storage Protection

1. **Storage Buckets**: Media is stored in Supabase Storage (`media` bucket).
2. **Size Limits**: Enforced at 10MB for photographic assets and 25MB for regulatory documents.
3. **MIME-Type Restrictions**: Restricted to `image/jpeg`, `image/png`, `image/webp`, and `application/pdf`.
4. **Storage RLS**:
   - `media` bucket: Public read allowed. Write, update, and delete restricted exclusively to users passing `public.is_admin()`.
