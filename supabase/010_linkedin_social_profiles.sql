-- ============================================================
-- 010_linkedin_social_profiles.sql
-- Profil membre/page pour la publication organique LinkedIn
-- ============================================================

ALTER TABLE public.linkedin_admin_connections
  ADD COLUMN IF NOT EXISTS member_urn TEXT,
  ADD COLUMN IF NOT EXISTS member_name TEXT,
  ADD COLUMN IF NOT EXISTS organization_snapshot JSONB NOT NULL DEFAULT '[]'::jsonb;
