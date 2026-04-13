-- ============================================================
-- 007_referral_system.sql
-- Système de parrainage MVP — LEXPAT Connect
-- Avril 2026
-- ============================================================

-- ── 0. Fonction set_updated_at (idempotente, au cas où non présente) ─────────
-- La fonction est normalement créée dans 001_initial_schema.sql.
-- On la recrée ici avec CREATE OR REPLACE pour que cette migration
-- soit auto-suffisante et puisse tourner en isolation.

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- ── 1. Ajouter le code de parrainage au profil travailleur ──────────────────

ALTER TABLE public.worker_profiles
  ADD COLUMN IF NOT EXISTS referral_code TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS referred_by_referral_id UUID;

CREATE INDEX IF NOT EXISTS worker_profiles_referral_code_idx
  ON public.worker_profiles (referral_code)
  WHERE referral_code IS NOT NULL;

-- ── 2. Table principale des parrainages ─────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.referrals (
  id                          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Parrain
  referrer_user_id            UUID        NOT NULL REFERENCES auth.users(id) ON DELETE SET NULL,
  referrer_worker_profile_id  UUID        REFERENCES public.worker_profiles(id) ON DELETE SET NULL,

  -- Filleul (rempli après inscription)
  referee_user_id             UUID        REFERENCES auth.users(id) ON DELETE SET NULL,
  referee_worker_profile_id   UUID        REFERENCES public.worker_profiles(id) ON DELETE SET NULL,

  -- Attribution
  referral_code               TEXT        NOT NULL,
  attribution_source          TEXT        NOT NULL CHECK (attribution_source IN ('link', 'manual_code', 'manual_name', 'unknown')),
  referrer_name_input         TEXT,       -- Ce que le filleul a saisi si attribution manuelle

  -- Statut
  -- pending          : lien cliqué ou code soumis, pas encore inscrit
  -- pending_review   : saisie manuelle ambiguë, à valider admin
  -- registered       : filleul inscrit
  -- profile_completed: profil filleul >= 70%
  -- profile_visible  : profil filleul visible
  -- validated        : parrainage validé par admin
  -- invalid          : parrainage rejeté (auto-parrainage, doublon, etc.)
  status                      TEXT        NOT NULL DEFAULT 'pending'
                              CHECK (status IN ('pending', 'pending_review', 'registered',
                                               'profile_completed', 'profile_visible',
                                               'validated', 'invalid')),

  -- Timestamps de progression
  attributed_at               TIMESTAMPTZ,
  registered_at               TIMESTAMPTZ,
  profile_completed_at        TIMESTAMPTZ,
  profile_visible_at          TIMESTAMPTZ,
  validated_at                TIMESTAMPTZ,

  -- Admin
  admin_notes                 TEXT,

  -- Méta
  created_at                  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at                  TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Contrainte : un seul parrainage actif par filleul inscrit
  CONSTRAINT referrals_referee_user_unique
    UNIQUE NULLS NOT DISTINCT (referee_user_id)
);

CREATE INDEX IF NOT EXISTS referrals_referrer_user_id_idx
  ON public.referrals (referrer_user_id);
CREATE INDEX IF NOT EXISTS referrals_referee_user_id_idx
  ON public.referrals (referee_user_id);
CREATE INDEX IF NOT EXISTS referrals_referral_code_idx
  ON public.referrals (referral_code);
CREATE INDEX IF NOT EXISTS referrals_status_idx
  ON public.referrals (status);
CREATE INDEX IF NOT EXISTS referrals_created_at_idx
  ON public.referrals (created_at DESC);

-- Trigger updated_at
CREATE TRIGGER set_updated_at_referrals
  BEFORE UPDATE ON public.referrals
  FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at();

-- ── 3. Table des événements de tracking ──────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.referral_events (
  id                UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  referral_id       UUID        REFERENCES public.referrals(id) ON DELETE SET NULL,

  -- event_type : referral_link_clicked | signup_started | signup_completed |
  --              referral_attributed | profile_completed | profile_visible |
  --              referral_validated | referral_invalid | referral_duplicate
  event_type        TEXT        NOT NULL,
  referral_code     TEXT,
  attribution_source TEXT,
  raw_input         TEXT,       -- Saisie brute si manuelle

  referrer_user_id  UUID        REFERENCES auth.users(id) ON DELETE SET NULL,
  referee_user_id   UUID        REFERENCES auth.users(id) ON DELETE SET NULL,

  metadata          JSONB,      -- Données contextuelles libres

  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS referral_events_event_type_idx
  ON public.referral_events (event_type);
CREATE INDEX IF NOT EXISTS referral_events_referral_id_idx
  ON public.referral_events (referral_id);
CREATE INDEX IF NOT EXISTS referral_events_created_at_idx
  ON public.referral_events (created_at DESC);

-- ── 4. Row Level Security ────────────────────────────────────────────────────

ALTER TABLE public.referrals        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referral_events  ENABLE ROW LEVEL SECURITY;

-- Référents peuvent voir leurs propres parrainages (en tant que parrain)
CREATE POLICY "referrer sees own referrals"
  ON public.referrals FOR SELECT
  USING (auth.uid() = referrer_user_id);

-- Filleuls peuvent voir leur propre ligne de parrainage
CREATE POLICY "referee sees own referral"
  ON public.referrals FOR SELECT
  USING (auth.uid() = referee_user_id);

-- Les admins (service role) ont accès total via bypass RLS
-- Pas de policy admin nécessaire : les routes admin utilisent getServiceClient()

-- Les events ne sont visibles que par le parrain/filleul concerné
CREATE POLICY "users see their referral events"
  ON public.referral_events FOR SELECT
  USING (
    auth.uid() = referrer_user_id
    OR auth.uid() = referee_user_id
  );

-- ── 5. Fonction utilitaire : générer un code unique ───────────────────────────
-- Appelée côté applicatif (Node), pas en SQL, mais on garde cette fonction
-- pour usage futur ou triggers

CREATE OR REPLACE FUNCTION public.generate_referral_code()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  chars TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; -- Sans 0, O, 1, I pour éviter confusions
  code  TEXT := 'LP-';
  i     INT;
BEGIN
  FOR i IN 1..6 LOOP
    code := code || substr(chars, floor(random() * length(chars) + 1)::INT, 1);
  END LOOP;
  RETURN code;
END;
$$;

-- ── 6. Commentaires de documentation ─────────────────────────────────────────

COMMENT ON TABLE public.referrals IS
  'Système de parrainage MVP LEXPAT Connect — un enregistrement par filleul inscrit.';

COMMENT ON COLUMN public.referrals.attribution_source IS
  'link=lien URL cliqué, manual_code=code saisi, manual_name=nom saisi, unknown=non déterminé';

COMMENT ON COLUMN public.referrals.status IS
  'Progression : pending → registered → profile_completed → profile_visible → validated';

COMMENT ON TABLE public.referral_events IS
  'Log immuable de tous les événements liés au système de parrainage.';
