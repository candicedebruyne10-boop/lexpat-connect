-- ============================================================
-- 009_linkedin_admin_connections.sql
-- Connexions LinkedIn Marketing pour le dashboard admin
-- ============================================================

CREATE TABLE IF NOT EXISTS public.linkedin_admin_connections (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by        UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  linkedin_member_id TEXT,
  access_token      TEXT NOT NULL,
  expires_at        TIMESTAMPTZ,
  scope             TEXT[] NOT NULL DEFAULT '{}',
  account_snapshot  JSONB NOT NULL DEFAULT '[]'::jsonb,
  status            TEXT NOT NULL DEFAULT 'connected'
                    CHECK (status IN ('connected', 'expired', 'error')),
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (created_by)
);

CREATE INDEX IF NOT EXISTS linkedin_admin_connections_created_by_idx
  ON public.linkedin_admin_connections (created_by);

ALTER TABLE public.linkedin_admin_connections ENABLE ROW LEVEL SECURITY;

COMMENT ON TABLE public.linkedin_admin_connections IS
  'Jetons LinkedIn Marketing et snapshot des comptes publicitaires accessibles pour le dashboard admin.';
