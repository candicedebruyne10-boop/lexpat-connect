-- ============================================================
-- 008_email_campaigns.sql
-- Historique des campagnes email admin — LEXPAT Connect
-- ============================================================

CREATE TABLE IF NOT EXISTS public.email_campaigns (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT        NOT NULL,
  segment         TEXT        NOT NULL,
  template        TEXT        NOT NULL,
  subject         TEXT        NOT NULL,
  locale          TEXT        NOT NULL DEFAULT 'fr',
  dry_run         BOOLEAN     NOT NULL DEFAULT false,
  sent_count      INTEGER     NOT NULL DEFAULT 0,
  failed_count    INTEGER     NOT NULL DEFAULT 0,
  skipped_count   INTEGER     NOT NULL DEFAULT 0,
  recipients      JSONB,              -- liste des emails envoyés
  failures        JSONB,              -- liste des erreurs
  status          TEXT        NOT NULL DEFAULT 'done'
                  CHECK (status IN ('done', 'error', 'partial')),
  error_message   TEXT,
  created_by      UUID        REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS email_campaigns_created_at_idx
  ON public.email_campaigns (created_at DESC);

CREATE INDEX IF NOT EXISTS email_campaigns_segment_idx
  ON public.email_campaigns (segment);

-- RLS : seuls les admins (via service role) accèdent à cette table
ALTER TABLE public.email_campaigns ENABLE ROW LEVEL SECURITY;

COMMENT ON TABLE public.email_campaigns IS
  'Historique de toutes les campagnes email envoyées depuis le dashboard admin LEXPAT Connect.';
