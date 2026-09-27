-- =============================================================================
-- Task 10.1: Seed the nine homepage section records.
-- The homepage renders its nine-section narrative whenever the read is
-- unavailable or empty (fail-safe), so `/admin/content` visibility toggles
-- were inert until rows existed (the table ships unseeded and has no admin
-- create action). These rows make the toggles immediately operational on a
-- fresh deployment. Titles mirror the rendered homepage headings so each row
-- is identifiable at a glance; subtitles stay NULL for admins to author.
-- ON CONFLICT keeps the migration idempotent — existing rows (including
-- customized titles) are never overwritten.
-- =============================================================================

INSERT INTO public.homepage_sections
  (section_key, title, subtitle, is_visible, display_order)
VALUES
  ('hero', 'Environmental consulting, engineered with integrity', NULL, TRUE, 1),
  ('credibility', 'Credibility, by the numbers', NULL, TRUE, 2),
  ('services', 'Four disciplines, one defensible record', NULL, TRUE, 3),
  ('industries', 'Sectors we know deeply', NULL, TRUE, 4),
  ('projects', 'Casco Bay coastal wetland restoration', NULL, TRUE, 5),
  ('approach', 'From first records review to final monitoring', NULL, TRUE, 6),
  ('team', 'Certified scientists and engineers', NULL, TRUE, 7),
  ('faq', 'Questions, answered', NULL, TRUE, 8),
  ('cta', 'Tell us about your site', NULL, TRUE, 9)
ON CONFLICT (section_key) DO NOTHING;
