-- =============================================================================
-- Task 7.4: Supabase Storage provisioning for the media library.
-- Mirrors docs/BACKEND_SECURITY.md §7 — the `media` bucket is publicly
-- readable; every write (insert/update/delete) is restricted to admins
-- via public.is_admin(). The initial schema creates only the
-- `media_assets` metadata table, so the bucket and its storage RLS
-- policies are added here as a version-controlled migration
-- (AGENTS.md §7 — schema changes never happen manually in production).
-- =============================================================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('media', 'media', TRUE)
ON CONFLICT (id) DO NOTHING;

-- Public read for media objects (thumbnails / public URLs).
DROP POLICY IF EXISTS "Media library public read" ON storage.objects;
CREATE POLICY "Media library public read"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'media');

-- Admin-only writes: WITH CHECK gates inserts/updates, USING gates deletes.
DROP POLICY IF EXISTS "Media library admin writes" ON storage.objects;
CREATE POLICY "Media library admin writes"
  ON storage.objects FOR ALL
  TO authenticated
  USING (bucket_id = 'media' AND public.is_admin())
  WITH CHECK (bucket_id = 'media' AND public.is_admin());
