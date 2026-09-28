# CMS ADMIN DASHBOARD SPECIFICATION & HANDOFF: ALDERLINE ENVIRONMENTAL

## 1. Overview & Objective
This specification serves as the blueprint for the upcoming CMS Admin Dashboard implementation phase. The unified foundation in `S:\Apps\consultant` includes the database tables, RLS policies, Server Actions, and authentication boundaries ready for administrative UI integration.

The objective of the next development phase is to construct an intuitive, secure administrative dashboard under `src/app/admin/` enabling Alderline content managers to edit site settings, manage service offerings, review incoming inquiries, and toggle homepage sections without code changes.

---

## 2. Admin Information Architecture & Route Tree

```
src/app/admin/
├── (auth)/
│   ├── login/page.tsx               # Admin authentication screen (Email / Password)
│   └── forgot-password/page.tsx     # Password recovery flow
└── (dashboard)/
    ├── layout.tsx                   # Admin sidebar, topbar, user menu, auth guard
    ├── page.tsx                     # Executive overview & key metrics
    ├── inquiries/
    │   ├── page.tsx                 # Paginated incoming inquiries table + filter by status
    │   └── [id]/page.tsx            # Inquiry detail view + status updater
    ├── services/
    │   ├── page.tsx                 # Service disciplines list + sort order drag/drop
    │   ├── new/page.tsx             # Create service entry
    │   └── [id]/edit/page.tsx       # Service editor (deliverables, frameworks, media)
    ├── projects/
    │   ├── page.tsx                 # Case studies catalog
    │   └── [id]/edit/page.tsx       # Project case study editor (metrics, challenges)
    ├── sections/
    │   └── page.tsx                 # Homepage sections manager (visibility toggle, reordering)
    └── settings/
        └── page.tsx                 # Site settings (company, phone, address, social links)
```

---

## 3. Screen Specifications & Data Contracts

### 3.1 Dashboard Overview (`/admin`)
- **Key Metrics Cards:**
  - Total New Inquiries (Last 30 Days)
  - Active Published Services (Count)
  - Active Case Studies (Count)
  - System Health Status (Database, Storage latency)
- **Recent Inquiries Table:** Latest 5 submissions with quick-action status dropdown.

### 3.2 Inquiries Manager (`/admin/inquiries`)
- **Table Columns:** Date, Client Name, Email, Organization, Discipline, Budget, Status, Actions.
- **Status Filter:** All, New, Reviewed, Contacted, Closed.
- **Search:** Instant client name, organization, or email keyword search.
- **Actions:**
  - Mark as Contacted (Server Action: `updateInquiryStatus(id, "contacted")`).
  - Archive / Delete (Soft delete or status transition to `closed`).
  - Export to CSV.

### 3.3 Services Manager (`/admin/services`)
- **Form Fields:**
  - `title`: String input (e.g., "Atmospheric & Air Quality Assessment")
  - `slug`: Auto-generated from title, editable
  - `short_description`: Textarea (max 300 chars)
  - `full_description`: Rich text / Markdown editor
  - `featured_image`: Image selector with Supabase Storage upload
  - `deliverables`: Dynamic array tag manager (e.g., "Emissions Inventories", "Dispersion Modeling")
  - `frameworks`: Dynamic array tag manager (e.g., "Clean Air Act (Title V)", "EPA AERMOD")
  - `is_published`: Switch toggle

### 3.4 Homepage Section Manager (`/admin/sections`)
- **UI:** Reorderable list of the 7 Alderline narrative sections:
  1. `hero` — Hero Video & Narrative
  2. `pillars` — Core Strategic Pillars
  3. `disciplines` — Practice Areas Grid
  4. `capabilities` — Multidisciplinary Capabilities
  5. `impact` — Quantitative Field Metrics
  6. `testimonials` — Client Validation
  7. `insights` — Articles & Case Studies
- **Controls:** Visibility Switch (`is_visible`), Sort handle (`sort_order`).
- **Persistence:** Server Action batch updating `homepage_sections`.

### 3.5 Global Site Settings (`/admin/settings`)
- **Form Sections:**
  - **Identity:** Company Name, Legal Tagline.
  - **Communications:** Primary Email, Hotline Phone, Office Address, Business Hours.
  - **Social Ecosystem:** LinkedIn URL, X/Twitter URL, Industry Directory Link.
- **Persistence:** Server Action `updateSiteSettings(formData)` updating singleton row in `site_settings`.

---

## 4. UI Component & Design System Standards for Admin

1. **Framework:** shadcn/ui components (`@/components/ui/`):
   - Table, Dialog, Form, Input, Textarea, Select, Badge, Card, DropdownMenu, Tabs, Switch.
2. **Typography & Styling:** Clean, high-density dashboard aesthetic using Tailwind slate/zinc palette paired with Alderline Forest Green accents (`#1b382b`).
3. **Form Handling:** React Hook Form + `@hookform/resolvers/zod` paired with Next.js Server Actions.
4. **Optimistic Updates:** Use React `useOptimistic` hook for instant toggle state feedback on section visibility switches.
5. **Toast Notifications:** Sonner or Radix Toast for mutation success/failure notifications.

---

## 5. Security & Permission Guard Pattern
Every administrative route and Server Action must implement the auth guard:
```typescript
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function assertAdmin() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/admin/login");
  }

  return user;
}
```
