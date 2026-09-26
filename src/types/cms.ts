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
