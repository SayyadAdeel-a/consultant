# IntegraVity — Client Handover Manual

Welcome to your new website. This manual is written for **business owners and
office administrators** — no programming knowledge is assumed. Everything you
need to run the site day to day is in this document.

If you can log in to a website and fill in a form, you can manage this site.

> **Important:** while the site still shows the demonstration content that
> ships with the template, every page that displays sample statistics,
> certifications, or case studies must keep this line visible:
>
> _"All illustrative statistics, certifications, and case studies shown are
> demonstrations."_
>
> Replace the sample content with your firm's real material — or keep the
> disclaimer — before you promote the site publicly.

---

## 1. What you have

Your website has two halves:

| Half              | Address                | Who uses it       | What it does                                          |
| :---------------- | :--------------------- | :---------------- | :---------------------------------------------------- |
| **Public site**   | `yourdomain.com`       | Your visitors     | Showcases services, case studies, and takes inquiries |
| **Admin console** | `yourdomain.com/admin` | You and your team | Edits everything the public site shows                |

Your content lives in a **Supabase** database (a secure cloud database). The
website reads from it automatically — you never need to touch code or redeploy
the site to change content.

**What can be edited in the console:** company identity and contact details,
homepage section visibility, services, case studies, media, and incoming
inquiries.

**What is fixed in the design** (changing it needs a developer): the
team biographies, FAQ questions, process/approach steps, industries list, and
the narrative copy inside the homepage sections. Section _titles_ and
_subtitles_ in the console act as internal labels for your team — the visible
homepage wording itself is part of the design.

---

## 2. First-time setup (one-time, ~30 minutes)

Do these steps in order. You will need your Supabase and Vercel accounts.

### Step 1 — Create the database

1. Create a project at [supabase.com](https://supabase.com).
2. Open **SQL Editor** in Supabase.
3. Run the migration files from the `supabase/migrations/` folder of your
   code repository, **in order** (they are named by date):
   1. `20260927000000_initial_schema.sql` — tables, security rules, demo data
   2. `20260927000001_media_storage.sql` — the media (file upload) storage
   3. `20260927000002_seed_homepage_sections.sql` — homepage section records
      (makes the visibility switches in **Admin → Content** work immediately)
4. Copy your project keys: **Project Settings → API** — you need the
   **Project URL**, the **anon/public key**, and the **service_role key**.

### Step 2 — Connect and deploy the website

1. Import your code repository into [vercel.com](https://vercel.com)
   (Import Project → paste the repository URL). Vercel detects Next.js
   automatically — accept the defaults.
2. Before the first deploy, add these under **Project Settings → Environment
   Variables**:

   | Variable                        | Where it comes from                                  |
   | :------------------------------ | :--------------------------------------------------- |
   | `NEXT_PUBLIC_SUPABASE_URL`      | Supabase → Project Settings → API                    |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Project Settings → API (anon/public key)  |
   | `SUPABASE_SERVICE_ROLE_KEY`     | Supabase → Project Settings → API (service_role key) |
   | `NEXT_PUBLIC_SITE_URL`          | Your live address, e.g. `https://yourdomain.com`     |

   > The `service_role` key unlocks admin-only operations. **Never** publish it
   > anywhere public, and never rename it to start with `NEXT_PUBLIC_`.

3. Click **Deploy**. When it finishes, open the site — you should see the
   demonstration content.

### Step 3 — Create your administrator account

For security, the site has **no "sign up" button** — accounts are created
deliberately, one person at a time.

1. In Supabase, open **Authentication → Users → Add user** (or
   **Add users → Email**). Enter the administrator's email and a strong
   password, and mark the user as confirmed.
2. Still in Supabase, open **SQL Editor** and run this once, replacing the
   email with the address you just created:

   ```sql
   INSERT INTO public.admin_profiles (user_id)
   SELECT id FROM auth.users WHERE email = 'owner@yourfirm.com';
   ```

   (Both steps are required: the login checks the account **and** the
   `admin_profiles` record. A valid password alone will not grant access.)

3. Visit `yourdomain.com/admin/login` and sign in.

### Step 4 — Make the site yours

Immediately go to **Admin → Settings** and replace the demonstration identity
(see section 4). The demo company name, address, and phone number are visible
to every visitor until you do.

---

## 3. Daily access

- **Sign in page:** `yourdomain.com/admin/login`
- **Sessions last a while, then expire** — you will simply be sent back to the
  login page; sign in again.
- **Forgotten password:** an administrator with Supabase access can reset it
  under **Authentication → Users → (the person) → Reset password**, or you can
  use the reset link on the login page if password recovery is enabled.
- **Adding a teammate:** repeat Step 3 above (create their Supabase user, then
  insert the `admin_profiles` row with _their_ email).
- **Removing a teammate:** delete their row from **Authentication → Users**
  (this signs them out everywhere). Access is checked on every admin action,
  so a removed account loses access immediately.

There is no self-service registration and no public account area — by design.

---

## 4. Company identity and contact details

**Location: Admin → Settings**

Every field here flows to the whole site automatically: the site header and
footer, the homepage hero, the contact page's office block, the consultation
banners, and the buttons that invite visitors to get in touch.

| Field                  | Where visitors see it                                                      |
| :--------------------- | :------------------------------------------------------------------------- |
| **Company name**       | Site header, footer, browser tab                                           |
| **Tagline**            | The large headline on the homepage                                         |
| **Description**        | Search engine listings                                                     |
| **Email**              | Contact page, footer, consultation banner (`mailto:` link)                 |
| **Phone**              | Contact page, footer, consultation banner (tap-to-call on phones)          |
| **Office address**     | Contact page and footer (each line of the address = one line in the field) |
| **LinkedIn / Twitter** | Footer icons — leave blank to hide them                                    |
| **Primary CTA**        | The main “call to action” button in the header and banners                 |
| **Secondary CTA**      | The secondary button beside it                                             |

**Saving:** click **Save settings**. The homepage and contact page update
right away; other pages refresh within about **5 minutes**.

**Changing the phone number?** The site turns it into a dial link
automatically — just enter it the way you want it displayed.

---

## 5. The homepage switches

**Location: Admin → Content**

Your homepage is nine sections in order: hero (headline), credibility
(numbers), services, industries, featured project, approach, team, questions,
and the closing consultation banner.

Each row has a **visibility switch**:

- **On** — the section appears on the homepage.
- **Off** — the section disappears (great for hiding the team section until
  real bios arrive, or hiding the numbers section until your stats are ready).

Switches take effect within about 5 minutes. **The headline (hero) and the
closing banner should normally stay on** — they are how visitors contact you.

The **title**, **subtitle**, and **display order** columns are internal labels
and sorting aids for your team; the visible homepage wording is part of the
design.

---

## 6. Services catalog

**Location: Admin → Services**

Each service becomes a page at `yourdomain.com/services/[your-slug]` plus a
card on the services overview.

| Field                     | Guidance                                                                                                                 |
| :------------------------ | :----------------------------------------------------------------------------------------------------------------------- |
| **Title**                 | The service name visitors see (e.g. “Wetland Delineation”)                                                               |
| **Slug**                  | The URL word — lowercase, hyphens only. **Changing it later changes the URL** and breaks existing links, so set it once. |
| **Short description**     | The card blurb and search-result text — keep it under 300 characters                                                     |
| **Full content**          | The long explanation. Separate paragraphs with a blank line                                                              |
| **Icon**                  | The card icon name (ask your developer for the list)                                                                     |
| **Pricing note**          | **Optional — leave empty to show nothing.** Consulting work is bespoke; the site never forces a price to appear          |
| **Deliverables**          | One item per line — renders as the checklist on the service page                                                         |
| **Regulatory frameworks** | One per line (e.g. `CWA §404`) — renders as badges                                                                       |
| **Display order**         | Lower numbers appear first                                                                                               |
| **Published**             | Unpublish to remove the service from the public site without deleting it                                                 |

---

## 7. Case studies (project records)

**Location: Admin → Projects**

Each published case study gets its own page at
`yourdomain.com/projects/[your-slug]`, listed in the site's XML sitemap for
search engines automatically.

- **Title, Slug** — same rules as services (the slug becomes the URL; set it
  once).
- **Client type / Location / Completed year** — the metadata strip at the top
  of the case study.
- **Summary** — the lead paragraph under the title (also used in search
  results).
- **Challenge, Solution, Results** — the three narrative sections. Separate
  paragraphs with a blank line. _Results_ is the “outcome” section.
- **Associated service** — links the case study to a service for your own
  organization.
- **Featured image URL** — paste a full URL (upload the file in the media
  library first, copy its URL, then paste).
- **Display order / Published** — same as services.

**Tip:** write the way you would answer a prospect's question: what was wrong
with the site, what you did about it, and what changed. Concrete numbers make
case studies credible.

---

## 8. Media (photos and files)

**Location: Admin → Media**

1. Click the upload button and choose a file.
2. **Alt text** — describe the image in words (e.g. “Delineation crew wading
   a tidal channel”). This is required for accessibility and helps search
   engines.
3. **Caption** — optional.
4. Save. The library shows every file; click a file to **copy its URL**.

**Upload rules:** images only — JPEG, PNG, WebP, or SVG — up to **5 MB** each.
Files are stored in a dedicated public bucket, so a copied URL can be pasted
anywhere a URL is accepted (for example a case study's featured image field).

---

## 9. Managing incoming inquiries

**Location: Admin → Dashboard (recent list) and Admin → Inquiries**

The public contact form feeds a **confidential inbox** inside the admin
console. Inquiries are never listed publicly; only signed-in administrators
can read them.

- Open an inquiry to see the full message and contact details.
- **Status flow:** `new` → `reviewing` → `contacted` → `archived`.
  Use the filter pills at the top to see only what you need.
- Add **internal notes** (visible only to your team) to record call outcomes.

> There are **no email notifications** — make it a habit to open
> **Admin → Inquiries** each morning (or check the dashboard's recent list).
> Replying is done from your normal email program, directly to the address
> shown on the inquiry.

---

## 10. Search engines, sitemaps, and links

- The site publishes **`/sitemap.xml`** automatically (search engines use it
  to discover your services and case studies) and a **`robots.txt`** that
  keeps admin and API areas out of search results.
- You rarely need to do anything — after publishing several pages, you can
  paste `yourdomain.com/sitemap.xml` into **Google Search Console** to speed
  up discovery.
- **Meta title/description:** each service and case study lets you override
  the text search engines show; if you leave it blank, the site uses the
  title and summary you already typed.

---

## 11. Deploying updates

There are two kinds of updates:

### A. Content updates (settings, services, case studies, inquiries)

Nothing to deploy. Save in the admin console and the site picks it up
(immediately for the homepage and contact page, within ~5 minutes
elsewhere).

### B. Code updates (new features, design changes, database migrations)

1. Push your changes to the main branch of your repository.
2. Vercel builds and deploys automatically (every push gets a private preview
   URL first; merge to main to go live).
3. **Database changes** are never made by hand in production. New
   `supabase/migrations/*.sql` files that arrive with an update must be run in
   the Supabase **SQL Editor in filename order** (or with the Supabase CLI:
   `supabase db push`).

### Going live on your own domain

- Add the domain in **Vercel → Project → Domains** and point your DNS as
  instructed.
- Update `NEXT_PUBLIC_SITE_URL` to the final `https://` address (it feeds
  canonical URLs and the sitemap), then redeploy.

---

## 12. Troubleshooting

| Symptom                                         | What to do                                                                                            |
| :---------------------------------------------- | :---------------------------------------------------------------------------------------------------- |
| “My change isn't showing”                       | Wait ~5 minutes and hard-refresh (Ctrl/Cmd + Shift + R). Homepage and contact page should be instant. |
| Still not showing                               | Sign out and back in (expired session), then confirm the save actually reported success.              |
| Can't sign in                                   | The account must exist in Supabase Auth **and** have an `admin_profiles` row (section 2, Step 3).     |
| Site shows the demonstration company everywhere | You haven't saved your own identity yet — Admin → Settings (section 4).                               |
| No inquiries arriving                           | Open Admin → Inquiries — they land here, not in your email. Also check the form isn't marked as spam. |
| Case study or service URL shows 404             | It is unpublished, deleted, or its slug was changed (changing a slug changes the URL).                |
| An image won't upload                           | Must be JPEG/PNG/WebP/SVG and ≤ 5 MB.                                                                 |
| Page looks unstyled after a deploy              | It's usually a cached old file — hard-refresh; if it persists, contact your developer.                |

---

## 13. Where to get help

- **Day-to-day content questions** — this manual first; most tasks are one
  screen each (sections 4–9).
- **Anything involving code, design, or database structure** — your
  developer, who has the repository and this project's documentation
  (`docs/` in the repo: `ARCHITECTURE.md`, `CMS_SCHEMA.md`,
  `BACKEND_SECURITY.md`, and `TASKS.md` for the build plan).
- **Hosting/billing** — Vercel (site) and Supabase (database) dashboards.

---

_This manual covers IntegraVity as delivered: a single-tenant website with an
integrated admin console. It intentionally describes no multi-tenant or
billing features — none exist, by design._
