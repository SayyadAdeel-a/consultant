-- ==============================================================================
-- IntegraVity — Initial Database Schema Migration
-- Migration: 20260927000000_initial_schema.sql
-- Description: Establishes the core CMS entities, RLS policies, indexes,
--              triggers, storage buckets, and initial illustrative seed data.
-- ==============================================================================

-- Enable UUID extension if not already present
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- -----------------------------------------------------------------------------
-- 1. Helper function: updated_at trigger
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- -----------------------------------------------------------------------------
-- 2. Entity: admin_profiles
-- Maps Supabase auth.users to administrative roles.
-- Public registration is disabled; rows are provisioned through a controlled process.
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.admin_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'editor')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER update_admin_profiles_updated_at
BEFORE UPDATE ON public.admin_profiles
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Helper function to check if current authenticated user is an active admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admin_profiles
    WHERE user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- -----------------------------------------------------------------------------
-- 3. Entity: site_settings
-- Singleton global brand, identity, contact info, and navigation CTA configurations.
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  singleton_guard BOOLEAN NOT NULL DEFAULT TRUE UNIQUE CHECK (singleton_guard = TRUE),
  company_name TEXT NOT NULL DEFAULT 'IntegraVity Environmental Consulting',
  tagline TEXT NOT NULL DEFAULT 'Environmental consulting, engineered with integrity',
  description TEXT NOT NULL DEFAULT 'Premier environmental consulting, wetland delineation, permitting, and environmental planning.',
  logo_url TEXT,
  contact_email TEXT NOT NULL DEFAULT 'info@integravity.example.com',
  contact_phone TEXT DEFAULT '+1 (555) 019-2834',
  office_address TEXT DEFAULT '100 Coastal Way, Suite 400, Portland, ME 04101',
  social_links JSONB NOT NULL DEFAULT '{"linkedin": "https://linkedin.com", "twitter": "https://twitter.com"}'::JSONB,
  cta_settings JSONB NOT NULL DEFAULT '{"primaryLabel": "Request Consultation", "primaryHref": "/contact", "secondaryLabel": "Explore Services", "secondaryHref": "/services"}'::JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER update_site_settings_updated_at
BEFORE UPDATE ON public.site_settings
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- -----------------------------------------------------------------------------
-- 4. Entity: homepage_sections
-- Structured content blocks for the public homepage.
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.homepage_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_key TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  subtitle TEXT,
  content JSONB NOT NULL DEFAULT '{}'::JSONB,
  is_visible BOOLEAN NOT NULL DEFAULT TRUE,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER update_homepage_sections_updated_at
BEFORE UPDATE ON public.homepage_sections
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- -----------------------------------------------------------------------------
-- 5. Entity: services
-- Specialized environmental consulting offerings.
-- Pricing is strictly optional and omitted when null/empty.
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  short_description TEXT NOT NULL,
  full_content TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT 'Trees',
  hero_image_url TEXT,
  deliverables JSONB NOT NULL DEFAULT '[]'::JSONB,
  regulatory_frameworks TEXT[] NOT NULL DEFAULT '{}',
  pricing_note TEXT,
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  is_published BOOLEAN NOT NULL DEFAULT TRUE,
  display_order INTEGER NOT NULL DEFAULT 0,
  meta_title TEXT,
  meta_description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER update_services_updated_at
BEFORE UPDATE ON public.services
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- -----------------------------------------------------------------------------
-- 6. Entity: industries
-- Target sectors served (e.g. Land Development, Renewable Energy, Municipal).
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.industries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT 'Briefcase',
  is_published BOOLEAN NOT NULL DEFAULT TRUE,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER update_industries_updated_at
BEFORE UPDATE ON public.industries
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- -----------------------------------------------------------------------------
-- 7. Entity: projects (Case Studies)
-- Realized environmental consulting projects demonstrating capability.
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  client_type TEXT NOT NULL,
  location TEXT NOT NULL,
  summary TEXT NOT NULL,
  challenge TEXT NOT NULL,
  solution TEXT NOT NULL,
  results TEXT NOT NULL,
  featured_image_url TEXT,
  gallery_image_urls TEXT[] NOT NULL DEFAULT '{}',
  service_id UUID REFERENCES public.services(id) ON DELETE SET NULL,
  industry_id UUID REFERENCES public.industries(id) ON DELETE SET NULL,
  completed_year INTEGER NOT NULL DEFAULT 2025,
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  is_published BOOLEAN NOT NULL DEFAULT TRUE,
  display_order INTEGER NOT NULL DEFAULT 0,
  meta_title TEXT,
  meta_description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER update_projects_updated_at
BEFORE UPDATE ON public.projects
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- -----------------------------------------------------------------------------
-- 8. Entity: team_members
-- Technical leadership, consultants, engineers, and scientists.
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  role_title TEXT NOT NULL,
  credentials TEXT,
  bio TEXT NOT NULL,
  photo_url TEXT,
  linkedin_url TEXT,
  is_published BOOLEAN NOT NULL DEFAULT TRUE,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER update_team_members_updated_at
BEFORE UPDATE ON public.team_members
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- -----------------------------------------------------------------------------
-- 9. Entity: faqs
-- Frequently asked technical and engagement questions.
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.faqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'General',
  is_published BOOLEAN NOT NULL DEFAULT TRUE,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER update_faqs_updated_at
BEFORE UPDATE ON public.faqs
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- -----------------------------------------------------------------------------
-- 10. Entity: media_assets
-- Metadata catalog for uploaded photography and documents in Supabase Storage.
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.media_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  filename TEXT NOT NULL,
  file_path TEXT NOT NULL UNIQUE,
  storage_bucket TEXT NOT NULL DEFAULT 'media',
  mime_type TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  alt_text TEXT NOT NULL,
  caption TEXT,
  width INTEGER,
  height INTEGER,
  uploaded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 11. Entity: inquiries
-- Submissions through the contact and consultation request forms.
-- Highly confidential customer data protected by strict RLS.
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  inquiry_type TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'reviewing', 'contacted', 'archived')),
  admin_notes TEXT,
  ip_hash TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER update_inquiries_updated_at
BEFORE UPDATE ON public.inquiries
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- -----------------------------------------------------------------------------
-- 12. Indexes for Performance and Filtering
-- -----------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_services_slug ON public.services(slug);
CREATE INDEX IF NOT EXISTS idx_services_published_order ON public.services(is_published, display_order);

CREATE INDEX IF NOT EXISTS idx_industries_slug ON public.industries(slug);
CREATE INDEX IF NOT EXISTS idx_industries_published_order ON public.industries(is_published, display_order);

CREATE INDEX IF NOT EXISTS idx_projects_slug ON public.projects(slug);
CREATE INDEX IF NOT EXISTS idx_projects_published_order ON public.projects(is_published, display_order);
CREATE INDEX IF NOT EXISTS idx_projects_service_id ON public.projects(service_id);
CREATE INDEX IF NOT EXISTS idx_projects_industry_id ON public.projects(industry_id);

CREATE INDEX IF NOT EXISTS idx_team_members_published_order ON public.team_members(is_published, display_order);
CREATE INDEX IF NOT EXISTS idx_faqs_published_order ON public.faqs(is_published, display_order);
CREATE INDEX IF NOT EXISTS idx_inquiries_status_created ON public.inquiries(status, created_at DESC);

-- -----------------------------------------------------------------------------
-- 13. Row Level Security (RLS) Configuration
-- -----------------------------------------------------------------------------
ALTER TABLE public.admin_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.homepage_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.industries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

-- Policy: admin_profiles
CREATE POLICY "Admins can view all admin profiles"
  ON public.admin_profiles FOR SELECT
  TO authenticated
  USING (public.is_admin());

CREATE POLICY "Admins can update their own profile"
  ON public.admin_profiles FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Policy: site_settings
CREATE POLICY "Public can view site settings"
  ON public.site_settings FOR SELECT
  TO anon, authenticated
  USING (TRUE);

CREATE POLICY "Admins can update site settings"
  ON public.site_settings FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Policy: homepage_sections
CREATE POLICY "Public can view visible homepage sections"
  ON public.homepage_sections FOR SELECT
  TO anon, authenticated
  USING (is_visible = TRUE);

CREATE POLICY "Admins have full access to homepage sections"
  ON public.homepage_sections FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Policy: services
CREATE POLICY "Public can view published services"
  ON public.services FOR SELECT
  TO anon, authenticated
  USING (is_published = TRUE);

CREATE POLICY "Admins have full access to services"
  ON public.services FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Policy: industries
CREATE POLICY "Public can view published industries"
  ON public.industries FOR SELECT
  TO anon, authenticated
  USING (is_published = TRUE);

CREATE POLICY "Admins have full access to industries"
  ON public.industries FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Policy: projects
CREATE POLICY "Public can view published projects"
  ON public.projects FOR SELECT
  TO anon, authenticated
  USING (is_published = TRUE);

CREATE POLICY "Admins have full access to projects"
  ON public.projects FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Policy: team_members
CREATE POLICY "Public can view published team members"
  ON public.team_members FOR SELECT
  TO anon, authenticated
  USING (is_published = TRUE);

CREATE POLICY "Admins have full access to team members"
  ON public.team_members FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Policy: faqs
CREATE POLICY "Public can view published FAQs"
  ON public.faqs FOR SELECT
  TO anon, authenticated
  USING (is_published = TRUE);

CREATE POLICY "Admins have full access to FAQs"
  ON public.faqs FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Policy: media_assets
CREATE POLICY "Public can view media metadata"
  ON public.media_assets FOR SELECT
  TO anon, authenticated
  USING (TRUE);

CREATE POLICY "Admins have full access to media assets"
  ON public.media_assets FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Policy: inquiries
-- Anonymous and public visitors can ONLY insert inquiries. They can NEVER read or list inquiries.
CREATE POLICY "Public can submit contact inquiries"
  ON public.inquiries FOR INSERT
  TO anon, authenticated
  WITH CHECK (TRUE);

CREATE POLICY "Admins can view and manage inquiries"
  ON public.inquiries FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- -----------------------------------------------------------------------------
-- 14. Initial Illustrative Seed Data
-- Clearly marked as illustrative placeholders.
-- -----------------------------------------------------------------------------
INSERT INTO public.site_settings (
  company_name,
  tagline,
  description,
  contact_email,
  contact_phone,
  office_address
) VALUES (
  'IntegraVity Environmental Consulting',
  'Environmental consulting, engineered with integrity',
  'Specialized environmental consulting, wetland delineation, regulatory permitting, and coastal resource management.',
  'consult@integravity.example.com',
  '+1 (555) 019-2834',
  '100 Coastal Way, Suite 400, Portland, ME 04101'
) ON CONFLICT (singleton_guard) DO NOTHING;

-- Seed: Services
INSERT INTO public.services (slug, title, short_description, full_content, icon, display_order, is_featured)
VALUES
(
  'wetland-delineation',
  'Wetland Delineation & Mapping',
  'Accurate field identification, boundary staking, GIS mapping, and regulatory jurisdictional reporting.',
  'Our certified wetland scientists provide high-precision wetland delineation in accordance with USACE 1987 Manual and regional supplements. Services include soil test pits, hydrologic assessment, vegetation surveys, GPS/GIS boundary mapping, and jurisdictional determination package preparation.',
  'Waves',
  1,
  TRUE
),
(
  'environmental-permitting',
  'Environmental Permitting & Compliance',
  'Strategic regulatory navigation across federal, state, and municipal environmental protection agencies.',
  'Navigating complex environmental permits requires deep regulatory insight and agency relationships. We prepare Section 404/401 CWA applications, NEPA environmental impact statements, coastal zone management certifications, and local conservation commission filings.',
  'FileCheck2',
  2,
  TRUE
),
(
  'environmental-assessments',
  'Phase I & II Environmental Site Assessments',
  'Rigorous ASTM-standard due diligence assessments protecting acquisitions, redevelopments, and financing.',
  'Comprehensive site inspections, historical land-use reviews, regulatory records searches, and subsurface sampling (soil, groundwater, vapor) adhering to ASTM E1527-21 and ASTM E1903 standards.',
  'SearchCheck',
  3,
  TRUE
),
(
  'environmental-planning',
  'Ecological Restoration & Land-Use Planning',
  'Sustainable natural resource management, shoreline stabilization, and sensitive habitat restoration designs.',
  'We balance development objectives with ecosystem preservation. Capabilities include native revegetation plans, living shorelines, erosion control designs, wetland mitigation bank design, and post-construction compliance monitoring.',
  'Compass',
  4,
  TRUE
)
ON CONFLICT (slug) DO NOTHING;

-- Seed: Industries
INSERT INTO public.industries (slug, name, description, icon, display_order)
VALUES
(
  'infrastructure-transportation',
  'Infrastructure & Transportation',
  'Permitting and environmental monitoring for bridges, transit corridors, and port facilities.',
  'TrainTrack',
  1
),
(
  'commercial-land-development',
  'Commercial Land Development',
  'Ecological constraints mapping and due diligence for sustainable development parcels.',
  'Building2',
  2
),
(
  'renewable-energy',
  'Renewable Energy & Utilities',
  'Environmental impact reviews and ecological footprint assessments for solar, wind, and transmission corridors.',
  'Sun',
  3
),
(
  'municipal-watershed',
  'Municipal & Watershed Authorities',
  'Stormwater compliance, wetland preservation ordinances, and regional climate resilience planning.',
  'LandPlot',
  4
)
ON CONFLICT (slug) DO NOTHING;

-- Seed: FAQs
INSERT INTO public.faqs (question, answer, category, display_order)
VALUES
(
  'What regulations govern wetland delineations?',
  'Wetland delineations follow the U.S. Army Corps of Engineers (USACE) 1987 Wetland Delineation Manual and applicable Regional Supplements, evaluating three mandatory parameters: hydrophytic vegetation, hydric soils, and wetland hydrology.',
  'Technical',
  1
),
(
  'When is a Phase I Environmental Site Assessment required?',
  'Phase I ESAs are typically required by commercial lenders and prudent purchasers prior to real estate transactions to qualify for Landowner Liability Protections under CERCLA and satisfy All Appropriate Inquiries (AAI) standards.',
  'Due Diligence',
  2
),
(
  'How long does an environmental permitting process take?',
  'Timelines depend heavily on the required permits and agency jurisdiction. Local conservation permits often take 30–60 days, while federal Section 404 permits or state coastal approvals can range from 3 to 9 months.',
  'Permitting',
  3
),
(
  'Do you provide custom fee proposals for our specific project?',
  'Yes. Environmental consulting scopes vary significantly by parcel topography, acreage, and regulatory history. We provide detailed, itemized project scopes tailored to your site following an initial consultation.',
  'Engagement',
  4
)
ON CONFLICT DO NOTHING;
