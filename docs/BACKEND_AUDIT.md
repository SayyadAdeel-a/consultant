# BACKEND AND SUPABASE AUDIT: ALDERLINE ENVIRONMENTAL

## 1. Overview
This audit examines the backend infrastructure configured in `S:\Apps\consultant`, reviewing the live database state, table schemas, Row-Level Security (RLS) enforcement, migrations, and credential management.

---

## 2. Live Supabase Infrastructure
- **Connected Project:** `https://tqomvyqrhshjtdjymehv.supabase.co`
- **Region / Database:** Supabase Managed PostgreSQL 15+
- **Vercel Project ID:** `prj_p8QNUyxGogZQCVqBQ4fTFUC9HUL7`
- **Environment Separation:** `.env.local` provides local runtime secrets; production environment variables are stored in Vercel project settings.

### Table Inventory & Verified Live State
| Table Name | Live Row Count | Primary Key | Purpose |
|---|---|---|---|
| `site_settings` | 1 | `id` (UUID) | Singleton row for corporate identity, phone, address, and CTA configuration |
| `services` | 4 | `id` (UUID) | Public service catalog with markdown content, frameworks, and deliverables |
| `industries` | 4 | `id` (UUID) | Sector and practice area classification |
| `projects` | 1 | `id` (UUID) | Case studies and spotlight project documentation |
| `faqs` | 4 | `id` (UUID) | Frequently asked questions with display ordering |
| `homepage_sections` | 9 | `id` (UUID) | Section visibility toggles (`hero`, `credibility`, `services`, etc.) |
| `inquiries` | 0 | `id` (UUID) | Confidential client intake submissions from contact form |
| `admin_profiles` | 0 | `id` (UUID) | Superadmin and editor identity mapped to `auth.users` |
| `media_assets` | 0 | `id` (UUID) | Metadata records for assets uploaded to Supabase Storage |

---

## 3. Row-Level Security (RLS) Audit

### `inquiries` Table
- **RLS Enabled:** Yes (`ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;`)
- **Anonymous INSERT Policy:** `inquiries_anon_insert` allows anyone to submit an inquiry (`WITH CHECK (true)`).
- **Public SELECT Policy:** Denied. No public read policy exists.
- **Admin SELECT Policy:** `inquiries_admin_select` restricts reads to authenticated users with matching IDs in `admin_profiles`.
- **Verdict:** PASS. Public inquiries cannot be scraped or enumerated by unauthorized visitors.

### `site_settings`, `services`, `projects`, `faqs`, `homepage_sections`
- **RLS Enabled:** Yes across all public content tables.
- **Public SELECT Policy:** Restricted to `is_published = true` (or `is_visible = true`).
- **Mutation Policies:** Restricted to authenticated admin users verified against `admin_profiles`.
- **Verdict:** PASS. Unauthorized clients cannot modify public content or view unpublished drafts.

---

## 4. Migration History & Idempotence
The migration history in `supabase/migrations/` consists of:
1. `20260927000000_init_schema.sql` — Base tables, RLS enablement, extensions, triggers.
2. `20260927000001_seed_initial_content.sql` — Initial database seeding with idempotency guards (`ON CONFLICT DO NOTHING`).
3. `20260927000002_seed_homepage_sections.sql` — Idempotent seeding for all 9 section visibility keys.

All migrations execute idempotently without dropping tables or wiping data.

---

## 5. Security & Secret Handling
- **Supabase Anon Key:** Safe for client-side usage; restricted by RLS policies.
- **Supabase Service Role Key:** Used ONLY in secured Server Actions and server-only paths. Never exposed in public bundles or git commits.
- **Git Status:** `.env.local` is listed in `.gitignore` and has never been committed to git history.
