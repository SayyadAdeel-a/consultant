/**
 * IntegraVity CMS Domain Models & Database Types
 * Directly aligns with supabase/migrations/20260927000000_initial_schema.sql
 */

export interface AdminProfile {
  id: string;
  user_id: string;
  email: string;
  full_name: string;
  role: "admin" | "editor";
  created_at: string;
  updated_at: string;
}

export interface SiteSettings {
  id: string;
  singleton_guard: boolean;
  company_name: string;
  tagline: string;
  description: string;
  logo_url: string | null;
  contact_email: string;
  contact_phone: string | null;
  office_address: string | null;
  social_links: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
    instagram?: string;
  };
  cta_settings: {
    primaryLabel: string;
    primaryHref: string;
    secondaryLabel: string;
    secondaryHref: string;
  };
  created_at: string;
  updated_at: string;
}

export interface HomepageSection {
  id: string;
  section_key: string;
  title: string;
  subtitle: string | null;
  content: Record<string, unknown>;
  is_visible: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface ServiceItem {
  id: string;
  slug: string;
  title: string;
  short_description: string;
  full_content: string;
  icon: string;
  hero_image_url: string | null;
  deliverables: string[];
  regulatory_frameworks: string[];
  pricing_note: string | null; // Optional; hidden when null or empty
  is_featured: boolean;
  is_published: boolean;
  display_order: number;
  meta_title: string | null;
  meta_description: string | null;
  created_at: string;
  updated_at: string;
}

export interface IndustryItem {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: string;
  is_published: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface ProjectItem {
  id: string;
  slug: string;
  title: string;
  client_type: string;
  location: string;
  summary: string;
  challenge: string;
  solution: string;
  results: string;
  featured_image_url: string | null;
  gallery_image_urls: string[];
  service_id: string | null;
  industry_id: string | null;
  completed_year: number;
  is_featured: boolean;
  is_published: boolean;
  display_order: number;
  meta_title: string | null;
  meta_description: string | null;
  created_at: string;
  updated_at: string;
}

export interface TeamMemberItem {
  id: string;
  full_name: string;
  role_title: string;
  credentials: string | null;
  bio: string;
  photo_url: string | null;
  linkedin_url: string | null;
  is_published: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  is_published: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface MediaAssetItem {
  id: string;
  filename: string;
  file_path: string;
  storage_bucket: string;
  mime_type: string;
  file_size: number;
  alt_text: string;
  caption: string | null;
  width: number | null;
  height: number | null;
  uploaded_by: string | null;
  created_at: string;
}

export interface ContactInquiryItem {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  inquiry_type: string;
  message: string;
  status: "new" | "reviewing" | "contacted" | "archived";
  admin_notes: string | null;
  ip_hash: string | null;
  user_agent: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Columns surfaced in the admin inquiries console (docs/TASKS.md Task 7.2).
 * Deliberately excludes `ip_hash` / `user_agent` — the management UI never
 * needs them, so they are never fetched or rendered.
 */
export type InquiryRecord = Pick<
  ContactInquiryItem,
  | "id"
  | "name"
  | "email"
  | "phone"
  | "company"
  | "inquiry_type"
  | "message"
  | "status"
  | "admin_notes"
  | "created_at"
>;

/**
 * Editable columns surfaced in the admin services manager
 * (docs/TASKS.md Task 7.3). Unedited columns (`hero_image_url`,
 * `is_featured`, `meta_*`) are intentionally not fetched.
 */
export type ServiceRecord = Pick<
  ServiceItem,
  | "id"
  | "slug"
  | "title"
  | "short_description"
  | "full_content"
  | "icon"
  | "deliverables"
  | "regulatory_frameworks"
  | "pricing_note"
  | "is_published"
  | "display_order"
>;

/**
 * Editable columns surfaced in the admin case studies manager
 * (docs/TASKS.md Task 7.3). Gallery, industry, and meta columns are
 * managed elsewhere and intentionally not fetched here.
 */
export type ProjectRecord = Pick<
  ProjectItem,
  | "id"
  | "slug"
  | "title"
  | "client_type"
  | "location"
  | "summary"
  | "challenge"
  | "solution"
  | "results"
  | "featured_image_url"
  | "service_id"
  | "completed_year"
  | "is_featured"
  | "is_published"
  | "display_order"
>;

/**
 * Lightweight service lookup used by the case studies manager for the
 * "Associated service" column and editor selector.
 */
export type ServiceOption = Pick<ServiceItem, "id" | "title" | "is_published">;

/**
 * Editable columns surfaced in the admin settings form
 * (docs/TASKS.md Task 7.4). `logo_url` is not part of the spec'd form
 * and is intentionally not fetched.
 */
export type SiteSettingsRecord = Pick<
  SiteSettings,
  | "id"
  | "company_name"
  | "tagline"
  | "description"
  | "contact_email"
  | "contact_phone"
  | "office_address"
  | "social_links"
  | "cta_settings"
>;

/**
 * Editable columns surfaced in the admin content manager
 * (docs/TASKS.md Task 7.4). The `content` JSONB block is edited
 * elsewhere and intentionally not fetched here.
 */
export type HomepageSectionRecord = Pick<
  HomepageSection,
  "id" | "section_key" | "title" | "subtitle" | "is_visible" | "display_order"
>;

/**
 * Columns surfaced in the admin media library (docs/TASKS.md Task 7.4).
 * Dimensions and uploader are not displayed and are not fetched.
 */
export type MediaAssetRecord = Pick<
  MediaAssetItem,
  | "id"
  | "filename"
  | "file_path"
  | "storage_bucket"
  | "mime_type"
  | "file_size"
  | "alt_text"
  | "caption"
  | "created_at"
>;

/**
 * Media row plus the storage public URL — `media_assets` stores no URL
 * column; the page constructs it via `storage.getPublicUrl(file_path)`.
 */
export type MediaAssetView = MediaAssetRecord & { public_url: string };
