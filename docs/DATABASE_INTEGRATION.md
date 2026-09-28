# DATABASE INTEGRATION & SCHEMA SPECIFICATION: ALDERLINE ENVIRONMENTAL

## 1. Overview
This document outlines the database schema, Row-Level Security (RLS) policies, client connection boundaries, and fail-safe hydration rules for **Alderline Environmental** integrated with Supabase PostgreSQL (`https://tqomvyqrhshjtdjymehv.supabase.co`).

---

## 2. Supabase Client Architecture

The unified application employs three distinct Supabase client interfaces to maintain strict least-privilege security boundaries:

```
                  ┌──────────────────────────────────────────────┐
                  │          Next.js App Router (16.3.6)         │
                  └──────┬──────────────────┬─────────────────┬──┘
                         │                  │                 │
                         ▼                  ▼                 ▼
             ┌─────────────────────┐┌───────────────┐┌──────────────────┐
             │ Public Client       ││ Server Client ││ Admin Client     │
             │ (Anon Read)         ││ (SSR Cookies) ││ (Service Role)   │
             │ src/lib/supabase/   ││ src/lib/      ││ src/lib/supabase/│
             │ client.ts           ││ server.ts     ││ admin.ts         │
             └──────────┬──────────┘└───────┬───────┘└────────┬─────────┘
                        │                   │                 │
                        │ anon key          │ anon key + auth │ service_role key
                        │ RLS Read-only     │ RLS User Scope  │ RLS Bypass (Internal)
                        ▼                   ▼                 ▼
             ┌──────────────────────────────────────────────────────────┐
             │             Supabase PostgreSQL 15 Database              │
             └──────────────────────────────────────────────────────────┘
```

1. **Public Client (`src/lib/supabase/client.ts` / `createPublicClient()`):**
   - Uses `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
   - Used for public Server Component queries (`getSiteSettings`, `getServices`, `getFaqs`).
   - Subject to RLS `SELECT` policies for `anon` role.
2. **Server SSR Client (`src/lib/supabase/server.ts` / `createClient()`):**
   - Manages authenticated sessions via encrypted cookie storage using `@supabase/ssr`.
   - Used in Server Actions and authenticated route handlers.
   - Evaluates RLS policies using `auth.uid()`.
3. **Admin Service Client (`src/lib/supabase/admin.ts` / `createAdminClient()`):**
   - Uses privileged `SUPABASE_SERVICE_ROLE_KEY`.
   - Bypasses RLS for automated background worker processes, migrations, or automated integrity checks.
   - Strictly forbidden from being imported or invoked in client-facing components.

---

## 3. PostgreSQL Table Schemas

### 3.1 `site_settings`
Stores singleton global brand identity, contact channels, office location, and SEO metadata.
```sql
CREATE TABLE public.site_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_name TEXT NOT NULL DEFAULT 'Alderline Environmental',
    tagline TEXT DEFAULT 'Rigorous Science. Uncompromising Environmental Integrity.',
    phone TEXT DEFAULT '+1 (555) 382-4190',
    email TEXT DEFAULT 'inquiries@alderline-env.com',
    address TEXT DEFAULT '1420 Harborview Boulevard, Suite 800, Seattle, WA 98101',
    business_hours TEXT DEFAULT 'Monday - Friday: 8:00 AM - 5:30 PM PST',
    social_links JSONB DEFAULT '{"linkedin": "https://linkedin.com/company/alderline-environmental", "twitter": "https://x.com/alderline_env"}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);
```

### 3.2 `services`
Stores public service disciplines and deliverables.
```sql
CREATE TABLE public.services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    short_description TEXT NOT NULL,
    full_description TEXT,
    icon TEXT,
    featured_image TEXT,
    deliverables JSONB DEFAULT '[]'::jsonb,
    frameworks JSONB DEFAULT '[]'::jsonb,
    sort_order INT DEFAULT 0,
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);
```

### 3.3 `industries`
Stores industry sectors served (Energy, Infrastructure, Municipal, Mining, Industrial).
```sql
CREATE TABLE public.industries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    summary TEXT NOT NULL,
    icon TEXT,
    sort_order INT DEFAULT 0,
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);
```

### 3.4 `projects`
Stores case studies and portfolio engagements.
```sql
CREATE TABLE public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    client TEXT,
    industry_id UUID REFERENCES public.industries(id),
    service_id UUID REFERENCES public.services(id),
    challenge TEXT,
    solution TEXT,
    outcome TEXT,
    metrics JSONB DEFAULT '[]'::jsonb,
    hero_image TEXT,
    is_featured BOOLEAN DEFAULT false,
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);
```

### 3.5 `faqs`
Stores regulatory and engagement FAQs.
```sql
CREATE TABLE public.faqs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    category TEXT DEFAULT 'General',
    sort_order INT DEFAULT 0,
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);
```

### 3.6 `homepage_sections`
Stores homepage section configuration, sort ordering, and visibility toggles.
```sql
CREATE TABLE public.homepage_sections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    section_key TEXT UNIQUE NOT NULL,
    section_name TEXT NOT NULL,
    is_visible BOOLEAN DEFAULT true,
    sort_order INT DEFAULT 0,
    content_override JSONB,
    updated_at TIMESTAMPTZ DEFAULT now()
);
```

### 3.7 `inquiries`
Stores lead captures from `/contact`.
```sql
CREATE TABLE public.inquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    company TEXT,
    service_id UUID REFERENCES public.services(id),
    message TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    status TEXT DEFAULT 'new' CHECK (status IN ('new', 'reviewed', 'contacted', 'closed')),
    created_at TIMESTAMPTZ DEFAULT now()
);
```

---

## 4. Row-Level Security (RLS) Policy Matrix

| Table | Operation | Role | Policy Condition | Enforcement |
| :--- | :--- | :--- | :--- | :--- |
| `site_settings` | SELECT | `anon`, `authenticated` | `true` | Public read allowed |
| `site_settings` | ALL | `authenticated` | `auth.role() = 'authenticated'` | Admin only write |
| `services` | SELECT | `anon`, `authenticated` | `is_published = true` | Only published services visible |
| `services` | ALL | `authenticated` | `auth.role() = 'authenticated'` | Admin full control |
| `industries` | SELECT | `anon`, `authenticated` | `is_published = true` | Only published industries visible |
| `projects` | SELECT | `anon`, `authenticated` | `is_published = true` | Only published projects visible |
| `faqs` | SELECT | `anon`, `authenticated` | `is_published = true` | Only published FAQs visible |
| `homepage_sections` | SELECT | `anon`, `authenticated` | `true` | Section visibility state readable |
| `inquiries` | INSERT | `anon`, `authenticated` | `true` | Public lead generation |
| `inquiries` | SELECT | `authenticated` | `auth.role() = 'authenticated'` | Admin-only lead access |
| `inquiries` | UPDATE/DELETE | `authenticated` | `auth.role() = 'authenticated'` | Admin lead management |

---

## 5. Fail-Safe Data Hydration Rules

To protect uptime and prevent UI regressions:
1. **Fallback Priority:** If Supabase is inaccessible or the target table contains 0 rows, the query reader returns static constants from:
   - `@/lib/alderline-content` (Disciplines, Hero copy, Pillars, Impact Metrics, Testimonial, FAQs)
   - `@/lib/blog-data` (Case studies, Articles, Insights)
2. **Deterministic Layout:** Component layouts never rely on dynamic data array length without a fallback guard (e.g. `data?.length ? data : fallbackData`).
3. **No Mixed State Confusion:** If custom database content is loaded, it supplements or overrides specific fields without breaking CSS grid alignments or image aspect ratios.
