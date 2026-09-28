-- ==============================================================================
-- Alderline Environmental — Complete CMS Entities & Demonstration Data
-- Migration: 20260928000000_complete_cms_entities.sql
-- Description: Establishes complete CMS schema tables (testimonials, partners,
--              statistics, categories, articles) with is_demo flag, RLS policies,
--              triggers, and idempotent demonstration seed records.
-- ==============================================================================

-- -----------------------------------------------------------------------------
-- 1. Ensure updated_at trigger function exists
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- -----------------------------------------------------------------------------
-- 2. Add is_demo flag to pre-existing tables if not present
-- -----------------------------------------------------------------------------
ALTER TABLE IF EXISTS public.services ADD COLUMN IF NOT EXISTS is_demo BOOLEAN DEFAULT TRUE;
ALTER TABLE IF EXISTS public.industries ADD COLUMN IF NOT EXISTS is_demo BOOLEAN DEFAULT TRUE;
ALTER TABLE IF EXISTS public.projects ADD COLUMN IF NOT EXISTS is_demo BOOLEAN DEFAULT TRUE;
ALTER TABLE IF EXISTS public.team_members ADD COLUMN IF NOT EXISTS is_demo BOOLEAN DEFAULT TRUE;
ALTER TABLE IF EXISTS public.faqs ADD COLUMN IF NOT EXISTS is_demo BOOLEAN DEFAULT TRUE;

-- -----------------------------------------------------------------------------
-- 3. Entity: testimonials
-- Client quotes, ratings, and project associations.
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name TEXT NOT NULL,
  position TEXT,
  organization TEXT NOT NULL,
  testimonial TEXT NOT NULL,
  rating INTEGER NOT NULL DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  portrait_url TEXT,
  related_project TEXT,
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  is_published BOOLEAN NOT NULL DEFAULT TRUE,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_demo BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER update_testimonials_updated_at
BEFORE UPDATE ON public.testimonials
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- -----------------------------------------------------------------------------
-- 4. Entity: partners
-- Alliance logos, consortium memberships, and external citations.
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.partners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  logo_url TEXT NOT NULL,
  website TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT TRUE,
  is_demo BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER update_partners_updated_at
BEFORE UPDATE ON public.partners
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- -----------------------------------------------------------------------------
-- 5. Entity: statistics
-- Quantified performance indicators and impact metrics.
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.statistics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  value TEXT NOT NULL,
  suffix TEXT,
  label TEXT NOT NULL,
  description TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_visible BOOLEAN NOT NULL DEFAULT TRUE,
  is_demo BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER update_statistics_updated_at
BEFORE UPDATE ON public.statistics
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- -----------------------------------------------------------------------------
-- 6. Entity: categories
-- Taxonomic organization for technical articles and insights.
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_demo BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER update_categories_updated_at
BEFORE UPDATE ON public.categories
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- -----------------------------------------------------------------------------
-- 7. Entity: articles
-- Editorial publications, regulatory briefings, and technical guidance.
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  category_name TEXT NOT NULL,
  date_label TEXT NOT NULL DEFAULT 'Demonstration Article',
  read_time TEXT NOT NULL DEFAULT '4 mins read',
  image_url TEXT NOT NULL,
  banner_image_url TEXT,
  inline_image_url TEXT,
  summary TEXT NOT NULL,
  paragraphs TEXT[] NOT NULL DEFAULT '{}',
  sections JSONB NOT NULL DEFAULT '[]'::JSONB,
  is_published BOOLEAN NOT NULL DEFAULT TRUE,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_demo BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER update_articles_updated_at
BEFORE UPDATE ON public.articles
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- -----------------------------------------------------------------------------
-- 8. Indexes for Performance and Filtering
-- -----------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_testimonials_published_order ON public.testimonials(is_published, display_order);
CREATE INDEX IF NOT EXISTS idx_partners_published_order ON public.partners(is_published, display_order);
CREATE INDEX IF NOT EXISTS idx_statistics_visible_order ON public.statistics(is_visible, display_order);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON public.categories(slug);
CREATE INDEX IF NOT EXISTS idx_articles_slug ON public.articles(slug);
CREATE INDEX IF NOT EXISTS idx_articles_published_order ON public.articles(is_published, display_order);
CREATE INDEX IF NOT EXISTS idx_articles_category ON public.articles(category_id);

-- -----------------------------------------------------------------------------
-- 9. Row Level Security (RLS) Configuration
-- -----------------------------------------------------------------------------
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.statistics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

-- Public read policies (published/visible rows only)
CREATE POLICY "Public can view published testimonials"
  ON public.testimonials FOR SELECT
  TO anon, authenticated
  USING (is_published = TRUE);

CREATE POLICY "Public can view published partners"
  ON public.partners FOR SELECT
  TO anon, authenticated
  USING (is_published = TRUE);

CREATE POLICY "Public can view visible statistics"
  ON public.statistics FOR SELECT
  TO anon, authenticated
  USING (is_visible = TRUE);

CREATE POLICY "Public can view all categories"
  ON public.categories FOR SELECT
  TO anon, authenticated
  USING (TRUE);

CREATE POLICY "Public can view published articles"
  ON public.articles FOR SELECT
  TO anon, authenticated
  USING (is_published = TRUE);

-- Admin full-access policies
CREATE POLICY "Admins have full access to testimonials"
  ON public.testimonials FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins have full access to partners"
  ON public.partners FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins have full access to statistics"
  ON public.statistics FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins have full access to categories"
  ON public.categories FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins have full access to articles"
  ON public.articles FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- -----------------------------------------------------------------------------
-- 10. Idempotent Demonstration Data Seeding
-- -----------------------------------------------------------------------------

-- 10a. Seed Categories
INSERT INTO public.categories (name, slug, description, display_order, is_demo)
VALUES
  ('Wetlands', 'wetlands', 'Field delineation, habitat evaluation, and wetland functional assessments.', 1, TRUE),
  ('Site Assessment', 'site-assessment', 'Phase I/II due diligence, subsurface characterization, and risk reviews.', 2, TRUE),
  ('Permitting', 'permitting', 'State, federal, and local regulatory coordination and environmental clearance.', 3, TRUE),
  ('Restoration', 'restoration', 'Ecological restoration design, living shorelines, and mitigation banking.', 4, TRUE),
  ('Water Resources', 'water-resources', 'Watershed hydrology, stormwater modeling, and fluvial geomorphology.', 5, TRUE)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description;

-- 10b. Seed Team Members (5 members)
INSERT INTO public.team_members (full_name, role_title, credentials, bio, photo_url, is_published, display_order, is_demo)
VALUES
  ('Dr. Evelyn Reed, PWS', 'Principal Ecological Consultant', 'PhD, PWS', '22 years evaluating complex wetland ecotones and coordinating Section 404/401 state certifications.', '/assets/alderline/team/member-1.jpg', TRUE, 1, TRUE),
  ('Marcus Vance, PE', 'Senior Environmental Review Specialist', 'MS, PE', 'Specializes in linear infrastructure environmental impact statements and municipal coordination.', '/assets/alderline/team/member-2.jpg', TRUE, 2, TRUE),
  ('Dr. Sarah Lin, CPSS', 'Lead Hydrologist & Soil Scientist', 'PhD, CPSS', 'Expert in hydric soil taxonomy, groundwater modeling, and coastal watershed delineation.', '/assets/alderline/team/member-3.jpg', TRUE, 3, TRUE),
  ('David Campbell, AICP', 'Principal Land Planning Consultant', 'MUP, AICP', 'Advises developers and public agencies on conservation overlays and sustainable site design.', '/assets/alderline/team/member-4.jpg', TRUE, 4, TRUE),
  ('Elena Rostova, CERP', 'Restoration Strategy Advisor', 'MS, CERP', 'Focuses on stream daylighting, tidal reconnection engineering, and compensatory mitigation monitoring.', '/assets/alderline/team/member-5.jpg', TRUE, 5, TRUE)
ON CONFLICT DO NOTHING;

-- 10c. Seed Testimonials (5 testimonials)
INSERT INTO public.testimonials (client_name, position, organization, testimonial, rating, portrait_url, related_project, is_featured, is_published, display_order, is_demo)
VALUES
  ('Arthur Pendelton', 'VP of Infrastructure Planning', 'Casco Bay Regional Transit District', 'Alderline''s field delineation and NEPA documentation were delivered with exceptional precision. Their defensible reports expedited our USACE permit review by four months.', 5, '/assets/alderline/about/avatar-1.jpg', 'Casco Bay Coastal Wetland Restoration', TRUE, TRUE, 1, TRUE),
  ('Sarah Jenkins, PE', 'Director of Capital Projects', 'Horizon Clean Power Consortium', 'Navigating sensitive habitat constraints across a 40-mile transmission corridor seemed daunting. Alderline identified low-impact alignments that met strict state regulatory concurrence.', 5, '/assets/alderline/about/avatar-2.jpg', 'Clean Energy Transmission Corridor Permitting', TRUE, TRUE, 2, TRUE),
  ('Robert K. Vance', 'Chief Development Officer', 'Pacific Rim Industrial Trust', 'Their ASTM E1527-21 due diligence uncovered historical fill issues before acquisition, allowing us to restructure purchase warranties with complete clarity.', 5, '/assets/alderline/about/avatar-3.jpg', 'Former Waterfront Industrial Terminal Phase I & II ESA', TRUE, TRUE, 3, TRUE),
  ('Dr. Meredith Sloane', 'Director of Conservation', 'Pine River Watershed Authority', 'The living shoreline and bioengineering specifications prepared by Alderline successfully withstood peak 100-year storm surges with zero structural failure.', 5, '/assets/alderline/team/testimonial-placeholder.jpg', 'Pine River Riparian Habitat & Shoreline Stabilization', FALSE, TRUE, 4, TRUE),
  ('Gregory Hayes', 'Senior Project Executive', 'Apex Urban Development Partners', 'Transparent communication, deep understanding of USACE regional supplements, and pragmatic engineering. They are our trusted environmental counsel on every major parcel.', 5, '/assets/alderline/team/member-4.jpg', 'Cascadia Regional Wetland Mitigation Banking', FALSE, TRUE, 5, TRUE)
ON CONFLICT DO NOTHING;

-- 10d. Seed Partners (4 partner organizations)
INSERT INTO public.partners (name, category, logo_url, website, display_order, is_published, is_demo)
VALUES
  ('Pacific Rim Environmental Alliance', 'Regional Ecological Consortium', '/assets/alderline/brand/sector-mark-1.jpg', 'https://example.com/pacific-alliance', 1, TRUE, TRUE),
  ('Cascadia Coastal Engineering Group', 'Marine Infrastructure & Coastal Defense', '/assets/alderline/brand/sector-mark-2.jpg', 'https://example.com/cascadia-coastal', 2, TRUE, TRUE),
  ('Northwest Hydrologic Institute', 'Watershed Modeling & Aquifer Protection', '/assets/alderline/brand/sector-mark-3.jpg', 'https://example.com/nw-hydrologic', 3, TRUE, TRUE),
  ('TerraVerde Conservation Partners', 'Land Trust & Mitigation Banking Instrument Advisory', '/assets/alderline/brand/sector-mark-4.jpg', 'https://example.com/terra-verde', 4, TRUE, TRUE)
ON CONFLICT DO NOTHING;

-- 10e. Seed Statistics (4 performance metrics)
INSERT INTO public.statistics (value, suffix, label, description, display_order, is_visible, is_demo)
VALUES
  ('99.4', '%', 'Regulatory Concurrence', 'First-round approval rate across state and federal Section 404/401 and NEPA permit filings.', 1, TRUE, TRUE),
  ('180', '+', 'Completed Reviews', 'Phase I/II Environmental Site Assessments and critical areas ordinance filings delivered on schedule.', 2, TRUE, TRUE),
  ('14', '+', 'Years in Practice', 'Dedicated ecological engineering, wetland delineation, and environmental planning excellence.', 3, TRUE, TRUE),
  ('35,000', ' ac', 'Habitat Evaluated', 'Acreage surveyed for hydric soils, sensitive ecotones, and special-status species compliance.', 4, TRUE, TRUE)
ON CONFLICT DO NOTHING;

-- 10f. Seed Projects (6 case studies)
INSERT INTO public.projects (
  slug, title, client_type, location, summary, challenge, solution, results,
  featured_image_url, completed_year, is_featured, is_published, display_order, is_demo
)
VALUES
  (
    'casco-bay-wetland-restoration',
    'Casco Bay coastal wetland restoration',
    'Casco Bay Estuary Partnership',
    'Casco Bay, Maine',
    'Tidal reconnection and joint §404/§401 permitting that returned 42 acres of fragmented salt marsh to full tidal exchange — with agency concurrence on the first submittal.',
    'Decades of tidal restriction and shoreline erosion had fragmented the marsh into open-water pans, weakening nursery habitat for Casco Bay shellfish and pushing the parcel beyond its storm-surge thresholds.',
    'We paired bathymetric LiDAR interpretation with fine-scale vegetation and soils surveying to re-establish historic tidal hydrology, then sequenced a joint Army Corps §404 and Maine DEP §401 authorization strategy around in-water work windows.',
    'Returned 42 acres of high-value intertidal marsh habitat to full hydrodynamic exchange with zero net loss of vegetative cover.',
    '/assets/alderline/services/coastal-resilience.jpg',
    2024, TRUE, TRUE, 1, TRUE
  ),
  (
    'renewable-energy-corridor-permitting',
    'Clean Energy Transmission Corridor Permitting',
    'Horizon Clean Power Consortium',
    'Columbia River Basin, WA & OR',
    'Critical areas assessment, avian collision risk modeling, and state/federal joint environmental permitting across 48 miles of transmission right-of-way.',
    'The linear alignment traversed multiple jurisdictional watersheds, priority shrub-steppe raptor nesting territories, and culturally sensitive tribal resource zones.',
    'Conducted multi-season botanical and wildlife inventories, executed micro-siting re-alignments to avoid 94% of sensitive ecotones, and facilitated proactive tribal consultation.',
    'Secured Finding of No Significant Impact (FONSI) without contested administrative hearings, advancing the inter-tie 6 months ahead of schedule.',
    '/assets/alderline/about/gallery-1.jpg',
    2024, TRUE, TRUE, 2, TRUE
  ),
  (
    'industrial-redevelopment-esa',
    'Former Waterfront Industrial Terminal Phase I & II ESA',
    'Pacific Rim Industrial Trust',
    'Tacoma Tideflats, WA',
    'Targeted hydrogeologic and geochemical investigation of a 28-acre decommissioned shipyard and chemical handling terminal for brownfield adaptive reuse.',
    'Over eight decades of unrecorded historical manufacturing created overlapping solvent, petroleum hydrocarbon, and heavy metal plumes in shallow estuarine aquifers.',
    'Deployed low-disturbance membrane interface probe (MIP) screening coupled with high-resolution 3D plume modeling to delimit hot spots, followed by containment barrier design.',
    'Negotiated a Prospective Purchaser Agreement (PPA) with the state Department of Ecology, reducing buyer environmental liability exposure by $8.4M.',
    '/assets/alderline/services/site-assessment.jpg',
    2023, TRUE, TRUE, 3, TRUE
  ),
  (
    'pine-river-riparian-stabilization',
    'Pine River Riparian Habitat & Shoreline Stabilization',
    'Pine River Watershed Authority',
    'Deschutes County, OR',
    'Bioengineered living shoreline design replacing degraded riprap with rootwads, native riparian buffers, and engineered log jams across 2.4 miles of salmonid habitat.',
    'Severe riverbank scour from unregulated runoff threatened adjacent recreational parkland and introduced chronic sediment loading into critical cold-water fisheries.',
    'Modeled 2D hydrodynamic flow velocities to design anchored large woody debris (LWD) installations and deep-rooting native willow/alder revetments.',
    'Withstood historic 100-year recurrence interval spring flood events with zero structural failure, reducing stream turbidity by 78%.',
    '/assets/alderline/about/gallery-2.jpg',
    2024, FALSE, TRUE, 4, TRUE
  ),
  (
    'urban-wetland-mitigation-banking',
    'Cascadia Regional Wetland Mitigation Banking',
    'Apex Urban Development Partners',
    'Willamette Valley, OR',
    'Permitting, baseline ecological characterization, and hydrologic restoration design for a 115-acre commercial wetland mitigation bank producing transferable credits.',
    'Drained agricultural acreage required re-establishment of historical emergent marsh and vernal pool hydrology while satisfying rigorous USACE IRT credit release schedules.',
    'Constructed earthen berms, decommissioned subterranean tile drains, and seeded 34 native wetland plant species calibrated to seasonal groundwater tables.',
    'Achieved full Interagency Review Team (IRT) approval of the MBI with initial release of 35 wetland credits valued at over $4.2M.',
    '/assets/alderline/about/gallery-3.jpg',
    2023, FALSE, TRUE, 5, TRUE
  ),
  (
    'intermountain-substation-review',
    'Intermountain High-Voltage Substation Environmental Review',
    'Apex Infrastructure Utilities',
    'Ada County, Idaho',
    'Environmental constraints analysis, geotechnical environmental review, and Spill Prevention, Control, and Countermeasure (SPCC) engineering for a 500kV substation.',
    'Site expansion bordered an ephemeral irrigation canal and protected sagebrush scrub habitat subject to strict county grading ordinances.',
    'Engineered self-contained secondary containment systems for oil-filled electrical equipment and integrated zero-runoff xeriscape bio-retention basins.',
    'Secured unanimous county land-use conditional use permit (CUP) approval with zero environmental appeals or delays.',
    '/assets/alderline/about/gallery-4.jpg',
    2024, FALSE, TRUE, 6, TRUE
  )
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  client_type = EXCLUDED.client_type,
  location = EXCLUDED.location,
  summary = EXCLUDED.summary,
  challenge = EXCLUDED.challenge,
  solution = EXCLUDED.solution,
  results = EXCLUDED.results,
  featured_image_url = EXCLUDED.featured_image_url,
  completed_year = EXCLUDED.completed_year,
  is_featured = EXCLUDED.is_featured,
  is_published = EXCLUDED.is_published,
  display_order = EXCLUDED.display_order;

-- 10g. Seed Articles (10 articles)
INSERT INTO public.articles (
  slug, title, category_name, date_label, read_time, image_url, banner_image_url, inline_image_url,
  summary, paragraphs, sections, is_published, display_order, is_demo
)
VALUES
  (
    'what-wetland-delineation-means-for-project-planning',
    'What Wetland Delineation Means For Project Planning',
    'Wetlands',
    'Demonstration Article',
    '4 mins read',
    '/assets/alderline/insights/article-2.jpg',
    '/assets/alderline/insights/article-hero.jpg',
    '/assets/alderline/insights/article-inline.jpg',
    'Understanding wetland presence and boundaries helps project teams reduce uncertainty and respond effectively to site sensitivities.',
    ARRAY[
      'Wetland delineation is often one of the earliest environmental steps that influences site planning, permitting strategy, and project expectations.',
      'Understanding wetland presence and boundaries can help teams reduce uncertainty and respond more effectively to site constraints.'
    ],
    '[
      {"heading": "Understand Site Conditions Early", "body": "Early field understanding helps project teams identify sensitive areas before design assumptions become costly or difficult to change. A clear delineation process can support planning conversations, improve coordination, and help teams understand where environmental sensitivity may affect layout, access, or permitting."},
      {"heading": "Connect Field Findings To Project Decisions", "body": "Environmental findings are most useful when they are translated into practical implications for the wider project team. Rather than existing as isolated technical information, delineation outcomes should help shape design discussions, risk awareness, and permitting preparation."},
      {"heading": "Support A More Efficient Permitting Path", "body": "When environmental understanding is established early, permit-related communication can become more focused and more useful. Even when additional review is required, a clear foundation helps teams ask better questions, prepare documentation, and move forward with greater confidence."}
    ]'::JSONB,
    TRUE, 1, TRUE
  ),
  (
    'when-a-phase-i-esa-is-enough-and-when-it-isnt',
    'When A Phase I ESA Is Enough — And When It Isn''t',
    'Site Assessment',
    'Demonstration Article',
    '5 mins read',
    '/assets/alderline/insights/article-1.jpg',
    '/assets/alderline/insights/article-hero.jpg',
    '/assets/alderline/insights/article-inline.jpg',
    'Recognizing the threshold between standard due diligence and required intrusive subsurface investigations.',
    ARRAY[
      'A Phase I Environmental Site Assessment (ESA) is the foundation of site due diligence, intended to identify Recognized Environmental Conditions (RECs). However, knowing when historical records indicate a need for Phase II soil and groundwater sampling is critical for managing capital risk.',
      'By assessing historical aerial imagery, chemical storage permits, and regional hydrogeologic vulnerability early, project teams can anticipate site investigations without delaying land acquisition timelines.'
    ],
    '[
      {"heading": "Recognizing Recognized Environmental Conditions (RECs)", "body": "Understanding the distinction between historical contamination and active environmental liabilities ensures due diligence findings provide actionable risk evaluations rather than mere compliance checklists."},
      {"heading": "Scoping Targeted Phase II Investigations", "body": "When intrusive sampling is warranted, focused sampling grids based on conceptual site models keep investigation budgets targeted while delivering defensible analytical data."}
    ]'::JSONB,
    TRUE, 2, TRUE
  ),
  (
    'planning-for-permitting-earlier-in-the-project-lifecycle',
    'Planning For Permitting Earlier In The Project Lifecycle',
    'Permitting',
    'Demonstration Article',
    '4 mins read',
    '/assets/alderline/insights/article-3.jpg',
    '/assets/alderline/insights/article-hero.jpg',
    '/assets/alderline/insights/article-inline.jpg',
    'Integrating regulatory milestones into preliminary engineering prevents avoidable review bottlenecks.',
    ARRAY[
      'Permitting delays are rarely caused by agency review timelines alone; they often stem from submitting incomplete environmental baseline studies that require protracted requests for additional information (RAIs).',
      'Engaging regulatory specialists during 30% schematic design enables engineering teams to avoid sensitive resource impacts, qualify for nationwide or general permits, and streamline the administrative record.'
    ],
    '[
      {"heading": "Early Agency Pre-Application Coordination", "body": "Informal pre-application meetings clarify jurisdictional thresholds, baseline documentation expectations, and appropriate mitigation ratios prior to formal submittal."}
    ]'::JSONB,
    TRUE, 3, TRUE
  ),
  (
    'restoration-thinking-in-modern-site-development',
    'Restoration Thinking In Modern Site Development',
    'Restoration',
    'Demonstration Article',
    '4 mins read',
    '/assets/alderline/insights/article-4.jpg',
    '/assets/alderline/insights/article-hero.jpg',
    '/assets/alderline/insights/article-inline.jpg',
    'How ecological restoration principles transform regulatory mitigation obligations into functional landscape assets.',
    ARRAY[
      'Rather than treating ecological mitigation as a regulatory penalty, progressive development teams incorporate native vegetative buffers, living shorelines, and daylighted stream corridors directly into site master planning.',
      'This approach enhances stormwater retention, provides measurable biodiversity lift, and simplifies long-term compliance monitoring.'
    ],
    '[]'::JSONB,
    TRUE, 4, TRUE
  ),
  (
    'how-site-constraints-shape-better-project-decisions',
    'How Site Constraints Shape Better Project Decisions',
    'Site Assessment',
    'Demonstration Article',
    '3 mins read',
    '/assets/alderline/insights/article-1.jpg',
    '/assets/alderline/insights/article-hero.jpg',
    '/assets/alderline/insights/article-inline.jpg',
    'Viewing environmental constraints as structural design parameters improves site layout and infrastructure efficiency.',
    ARRAY[
      'Steep slopes, shallow groundwater, and ecological buffers need not be obstacles; understanding them early enables engineers to optimize grading balances and reduce costly structural interventions.'
    ],
    '[]'::JSONB,
    TRUE, 5, TRUE
  ),
  (
    'communicating-environmental-risk-more-clearly',
    'Communicating Environmental Risk More Clearly',
    'Permitting',
    'Demonstration Article',
    '4 mins read',
    '/assets/alderline/insights/article-3.jpg',
    '/assets/alderline/insights/article-hero.jpg',
    '/assets/alderline/insights/article-inline.jpg',
    'Translating complex hydrogeological and ecological findings into defensible, executive-level decision matrices.',
    ARRAY[
      'Technical environmental reports must communicate clearly across diverse stakeholders—from municipal planning boards to corporate investment committees. Clarity and defensibility are mutually reinforcing.'
    ],
    '[]'::JSONB,
    TRUE, 6, TRUE
  ),
  (
    'why-field-context-still-matters-in-digital-workflows',
    'Why Field Context Still Matters In Digital Workflows',
    'Wetlands',
    'Demonstration Article',
    '3 mins read',
    '/assets/alderline/insights/article-2.jpg',
    '/assets/alderline/insights/article-hero.jpg',
    '/assets/alderline/insights/article-inline.jpg',
    'Remote GIS and satellite data provide valuable initial screening, but on-site ground truthing remains indispensable for regulatory defensibility.',
    ARRAY[
      'Subtle hydric soil indicators, micro-topography, and localized hydrology cannot be verified solely from satellite imagery or desktop GIS overlays. Field-based observation is essential.'
    ],
    '[]'::JSONB,
    TRUE, 7, TRUE
  ),
  (
    'water-resources-considerations-before-design-advances',
    'Water Resources Considerations Before Design Advances',
    'Water Resources',
    'Demonstration Article',
    '4 mins read',
    '/assets/alderline/insights/article-4.jpg',
    '/assets/alderline/insights/article-hero.jpg',
    '/assets/alderline/insights/article-inline.jpg',
    'Analyzing watershed hydraulics and receiving water bodies before finalizing stormwater outfall configurations.',
    ARRAY[
      'Early hydrologic modeling ensures stormwater management systems account for regional climate trends, discharge temperature constraints, and downstream sediment transport.'
    ],
    '[]'::JSONB,
    TRUE, 8, TRUE
  ),
  (
    'early-ecological-review-and-its-value-for-complex-sites',
    'Early Ecological Review And Its Value For Complex Sites',
    'Restoration',
    'Demonstration Article',
    '4 mins read',
    '/assets/alderline/insights/article-2.jpg',
    '/assets/alderline/insights/article-hero.jpg',
    '/assets/alderline/insights/article-inline.jpg',
    'Identifying critical habitat and seasonal wildlife buffers before land clearing contracts are awarded.',
    ARRAY[
      'Seasonal restrictions for migratory birds or endangered species can halt active construction if not identified during initial environmental review. Early field surveys protect project schedules.'
    ],
    '[]'::JSONB,
    TRUE, 9, TRUE
  ),
  (
    'building-a-better-environmental-documentation-process',
    'Building A Better Environmental Documentation Process',
    'Permitting',
    'Demonstration Article',
    '3 mins read',
    '/assets/alderline/insights/article-1.jpg',
    '/assets/alderline/insights/article-hero.jpg',
    '/assets/alderline/insights/article-inline.jpg',
    'Standardizing field data collection, chain-of-custody protocols, and GIS deliverables to ensure regulatory submittal readiness.',
    ARRAY[
      'Rigorous quality assurance protocols across field observations, laboratory analyses, and geospatial metadata ensure environmental filings withstand legal and regulatory scrutiny.'
    ],
    '[]'::JSONB,
    TRUE, 10, TRUE
  )
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  category_name = EXCLUDED.category_name,
  date_label = EXCLUDED.date_label,
  read_time = EXCLUDED.read_time,
  image_url = EXCLUDED.image_url,
  banner_image_url = EXCLUDED.banner_image_url,
  inline_image_url = EXCLUDED.inline_image_url,
  summary = EXCLUDED.summary,
  paragraphs = EXCLUDED.paragraphs,
  sections = EXCLUDED.sections,
  is_published = EXCLUDED.is_published,
  display_order = EXCLUDED.display_order;
