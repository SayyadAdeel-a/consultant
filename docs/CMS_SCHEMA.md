# IntegraVity — Database Architecture & CMS Schema Specification

## 1. Overview & Principles

IntegraVity uses **PostgreSQL 15+** managed via **Supabase**. The database serves two distinct consumers:

1. **Public Visitors**: Read-only access strictly restricted by Row Level Security (RLS) to published rows (`is_published = true` / `is_visible = true`).
2. **Administrative CMS**: Full CRUD access restricted to verified administrators whose `auth.uid()` matches an active record in `public.admin_profiles`.

All schema changes are tracked in version-controlled SQL files in `supabase/migrations/`.

---

## 2. Entity Relational Model

```
                    ┌───────────────────────────┐
                    │      auth.users (Supabase)│
                    └─────────────┬─────────────┘
                                  │ 1:1
                                  ▼
                    ┌───────────────────────────┐
                    │       admin_profiles      │
                    └───────────────────────────┘

┌────────────────────────┐      ┌────────────────────────┐      ┌────────────────────────┐
│     site_settings      │      │   homepage_sections    │      │         faqs           │
│   (singleton record)   │      │ (key, order, visible)  │      │ (category, order, pub) │
└────────────────────────┘      └────────────────────────┘      └────────────────────────┘

┌────────────────────────┐      ┌────────────────────────┐      ┌────────────────────────┐
│        services        │◄─────┤        projects        ├─────►│       industries       │
│ (slug, order, pub,     │ 1:N  │ (slug, service, ind,   │ N:1  │ (slug, name, icon,     │
│  optional pricing)     │      │  order, pub, featured) │      │  order, published)     │
└────────────────────────┘      └────────────────────────┘      └────────────────────────┘

┌────────────────────────┐      ┌────────────────────────┐      ┌────────────────────────┐
│      team_members      │      │      media_assets      │      │       inquiries        │
│ (credentials, bio,     │      │ (storage_bucket, path, │      │ (inquiry_type, status, │
│  order, published)     │      │  dimensions, alt_text) │      │  NO public SELECT)     │
└────────────────────────┘      └────────────────────────┘      └────────────────────────┘
```

---

## 3. Entity Definitions & Specifications

### 3.1 `admin_profiles`

Maps Supabase authenticated users to administrative roles.

- `id` (UUID, PK, default `gen_random_uuid()`)
- `user_id` (UUID, UNIQUE, NOT NULL, FK -> `auth.users(id)` ON DELETE CASCADE)
- `email` (TEXT, NOT NULL)
- `full_name` (TEXT, NOT NULL)
- `role` (TEXT, NOT NULL, default `'admin'`, CHECK `role IN ('admin', 'editor')`)
- `created_at` / `updated_at` (TIMESTAMPTZ, NOT NULL)

### 3.2 `site_settings`

Singleton configuration holding global company identity, contact channels, and CTA labels.

- `id` (UUID, PK, default `gen_random_uuid()`)
- `singleton_guard` (BOOLEAN, NOT NULL, default `TRUE`, UNIQUE, CHECK `singleton_guard = TRUE`)
- `company_name` (TEXT, NOT NULL, default `'IntegraVity Environmental Consulting'`)
- `tagline` (TEXT, NOT NULL)
- `description` (TEXT, NOT NULL)
- `logo_url` (TEXT, nullable)
- `contact_email` (TEXT, NOT NULL)
- `contact_phone` (TEXT, nullable)
- `office_address` (TEXT, nullable)
- `social_links` (JSONB, NOT NULL, default `'{"linkedin": "...", "twitter": "..."}'`)
- `cta_settings` (JSONB, NOT NULL, default `'{"primaryLabel": "...", "primaryHref": "..."}'`)
- `created_at` / `updated_at` (TIMESTAMPTZ, NOT NULL)

### 3.3 `homepage_sections`

Structured control for homepage blocks and section ordering.

- `id` (UUID, PK)
- `section_key` (TEXT, UNIQUE, NOT NULL) — e.g. `'hero'`, `'services'`, `'industries'`, `'approach'`
- `title` (TEXT, NOT NULL)
- `subtitle` (TEXT, nullable)
- `content` (JSONB, NOT NULL, default `'{}'`)
- `is_visible` (BOOLEAN, NOT NULL, default `TRUE`)
- `display_order` (INTEGER, NOT NULL, default `0`)
- `created_at` / `updated_at` (TIMESTAMPTZ, NOT NULL)

### 3.4 `services`

Core environmental consulting capabilities and regulatory offerings.

- `id` (UUID, PK)
- `slug` (TEXT, UNIQUE, NOT NULL) — e.g. `'wetland-delineation'`
- `title` (TEXT, NOT NULL)
- `short_description` (TEXT, NOT NULL)
- `full_content` (TEXT, NOT NULL)
- `icon` (TEXT, NOT NULL, default `'Trees'`) — Lucide icon name
- `hero_image_url` (TEXT, nullable)
- `deliverables` (JSONB, NOT NULL, default `'[]'`) — List of deliverable reports
- `regulatory_frameworks` (TEXT[], NOT NULL, default `'{}'`) — e.g. `['CWA Section 404', 'NEPA']`
- `pricing_note` (TEXT, nullable) — **CRITICAL**: Optional. Hidden when null or empty.
- `is_featured` (BOOLEAN, NOT NULL, default `FALSE`)
- `is_published` (BOOLEAN, NOT NULL, default `TRUE`)
- `display_order` (INTEGER, NOT NULL, default `0`)
- `meta_title` / `meta_description` (TEXT, nullable)
- `created_at` / `updated_at` (TIMESTAMPTZ, NOT NULL)

### 3.5 `industries`

Market sectors supported by the consulting firm.

- `id` (UUID, PK)
- `slug` (TEXT, UNIQUE, NOT NULL)
- `name` (TEXT, NOT NULL)
- `description` (TEXT, NOT NULL)
- `icon` (TEXT, NOT NULL, default `'Briefcase'`)
- `is_published` (BOOLEAN, NOT NULL, default `TRUE`)
- `display_order` (INTEGER, NOT NULL, default `0`)
- `created_at` / `updated_at` (TIMESTAMPTZ, NOT NULL)

### 3.6 `projects` (Case Studies)

Proven project outcomes and environmental solutions.

- `id` (UUID, PK)
- `slug` (TEXT, UNIQUE, NOT NULL)
- `title` (TEXT, NOT NULL)
- `client_type` (TEXT, NOT NULL) — e.g. `'Municipal Water Authority'`
- `location` (TEXT, NOT NULL) — e.g. `'Casco Bay, ME'`
- `summary` / `challenge` / `solution` / `results` (TEXT, NOT NULL)
- `featured_image_url` (TEXT, nullable)
- `gallery_image_urls` (TEXT[], NOT NULL, default `'{}'`)
- `service_id` (UUID, nullable, FK -> `services(id)` ON DELETE SET NULL)
- `industry_id` (UUID, nullable, FK -> `industries(id)` ON DELETE SET NULL)
- `completed_year` (INTEGER, NOT NULL, default `2025`)
- `is_featured` (BOOLEAN, NOT NULL, default `FALSE`)
- `is_published` (BOOLEAN, NOT NULL, default `TRUE`)
- `display_order` (INTEGER, NOT NULL, default `0`)
- `created_at` / `updated_at` (TIMESTAMPTZ, NOT NULL)

### 3.7 `team_members`

Technical experts, professional engineers (PE), and certified wetland scientists (PWS).

- `id` (UUID, PK)
- `full_name` (TEXT, NOT NULL)
- `role_title` (TEXT, NOT NULL)
- `credentials` (TEXT, nullable) — e.g. `'PE, PWS, CPSS'`
- `bio` (TEXT, NOT NULL)
- `photo_url` / `linkedin_url` (TEXT, nullable)
- `is_published` (BOOLEAN, NOT NULL, default `TRUE`)
- `display_order` (INTEGER, NOT NULL, default `0`)
- `created_at` / `updated_at` (TIMESTAMPTZ, NOT NULL)

### 3.8 `faqs`

Frequently asked regulatory, procedural, and engagement questions.

- `id` (UUID, PK)
- `question` / `answer` (TEXT, NOT NULL)
- `category` (TEXT, NOT NULL, default `'General'`)
- `is_published` (BOOLEAN, NOT NULL, default `TRUE`)
- `display_order` (INTEGER, NOT NULL, default `0`)
- `created_at` / `updated_at` (TIMESTAMPTZ, NOT NULL)

### 3.9 `media_assets`

Catalog of uploaded images and PDF compliance briefs stored in Supabase Storage.

- `id` (UUID, PK)
- `filename` (TEXT, NOT NULL)
- `file_path` (TEXT, UNIQUE, NOT NULL)
- `storage_bucket` (TEXT, NOT NULL, default `'media'`)
- `mime_type` (TEXT, NOT NULL)
- `file_size` (INTEGER, NOT NULL)
- `alt_text` (TEXT, NOT NULL)
- `caption` (TEXT, nullable)
- `width` / `height` (INTEGER, nullable)
- `uploaded_by` (UUID, nullable, FK -> `auth.users(id)` ON DELETE SET NULL)
- `created_at` (TIMESTAMPTZ, NOT NULL)

### 3.10 `inquiries`

Client contact and consultation requests.

- `id` (UUID, PK)
- `name` / `email` (TEXT, NOT NULL)
- `phone` / `company` (TEXT, nullable)
- `inquiry_type` (TEXT, NOT NULL) — e.g. `'wetland-delineation'`, `'permitting'`
- `message` (TEXT, NOT NULL)
- `status` (TEXT, NOT NULL, default `'new'`, CHECK `status IN ('new', 'reviewing', 'contacted', 'archived')`)
- `admin_notes` (TEXT, nullable)
- `ip_hash` / `user_agent` (TEXT, nullable)
- `created_at` / `updated_at` (TIMESTAMPTZ, NOT NULL)

---

## 4. Migration & Version Control Workflow

1. **Migration Files**: Stored in `supabase/migrations/` prefixed with a UTC timestamp (e.g., `20260927000000_initial_schema.sql`).
2. **Applying Migrations Locally**:
   ```bash
   npx supabase db reset
   # or
   npx supabase migration up
   ```
3. **Generating TypeScript Definitions**:
   ```bash
   npx supabase gen types typescript --local > src/types/supabase.ts
   ```
4. **Never Direct Editing**: Production database schemas must never be modified by hand in the Supabase web console without a corresponding committed migration file.
