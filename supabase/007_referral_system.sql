-- ============================================================
-- 007_referral_system.sql
-- Système de parrainage MVP — LEXPAT Connect
-- Avril 2026
-- ============================================================

-- ── 0. Fonction set_updated_at (idempotente) ──────────────────────────────────
-- CREATE OR REPLACE garantit que la migration est auto-suffisante
-- même si elle est exécutée sans avoir appliqué 001_initial_schema.sql.

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- ── 1. Colonnes de parrainage sur worker_profiles ────────────────────────────

ALTER TABLE public.worker_profiles
  ADD COLUMN IF NOT EXISTS referral_code TEXT,
  ADD COLUMN IF NOT EXISTS referred_by_referral_id UUID;

-- Contrainte unique sur referral_code (séparée pour compatibilité IF NOT EXISTS)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes
    WHERE tablename = 'worker_profiles'
      AND indexname = 'worker_profiles_referral_code_key'
  ) THEN
    CREATE UNIQUE INDEX worker_profiles_referral_code_key
      ON public.worker_profiles (referral_code)
      WHERE referral_code IS NOT NULL;
  END IF;
END;
$$;

-- ── 2. Table principale des parrainages ──────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.referrals (
  id                          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Parrain (nullable : si le parrain supprime son compte)
  referrer_user_id            UUID        REFERENCES auth.users(id) ON DELETE SET NULL,
  referrer_worker_profile_id  UUID        REFERENCES public.worker_profiles(id) ON DELETE SET NULL,

  -- Filleul (rempli après inscription)
  referee_user_id             UUID        REFERENCES auth.users(id) ON DELETE SET NULL,
  referee_worker_profile_id   UUID        REFERENCES public.worker_profiles(id) ON DELETE SET NULL,

  -- Attribution
  referral_code               TEXT        NOT NULL,
  attribution_source          TEXT        NOT NULL
                              CHECK (attribution_source IN ('link', 'manual_code', 'manual_name', 'unknown')),
  referrer_name_input         TEXT,

  -- Statut
  status                      TEXT        NOT NULL DEFAULT 'pending'
                              CHECK (status IN (
                                'pending', 'pending_review', 'registered',
                                'profile_completed', 'profile_visible',
                                'validated', 'invalid'
                              )),

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
  updated_at                  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index standard
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

-- Contrainte unicité filleul : compatible PG12+ (pas besoin de NULLS NOT DISTINCT)
-- Un seul parrainage actif par referee_user_id non nul.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes
    WHERE tablename = 'referrals'
      AND indexname = 'referrals_referee_user_unique_idx'
  ) THEN
    CREATE UNIQUE INDEX referrals_referee_user_unique_idx
      ON public.referrals (referee_user_id)
      WHERE referee_user_id IS NOT NULL;
  END IF;
END;
$$;

-- Trigger updated_at (EXECUTE FUNCTION = syntaxe correcte PG11+)
DROP TRIGGER IF EXISTS set_updated_at_referrals ON public.referrals;
CREATE TRIGGER set_updated_at_referrals
  BEFORE UPDATE ON public.referrals
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ── 3. Table des événements de tracking ──────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.referral_events (
  id                UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  referral_id       UUID        REFERENCES public.referrals(id) ON DELETE SET NULL,
  event_type        TEXT        NOT NULL,
  referral_code     TEXT,
  attribution_source TEXT,
  raw_input         TEXT,
  referrer_user_id  UUID        REFERENCES auth.users(id) ON DELETE SET NULL,
  referee_user_id   UUID        REFERENCES auth.users(id) ON DELETE SET NULL,
  metadata          JSONB,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS referral_events_event_type_idx
  ON public.referral_events (event_type);
CREATE INDEX IF NOT EXISTS referral_events_referral_id_idx
  ON public.referral_events (referral_id);
CREATE INDEX IF NOT EXISTS referral_events_created_at_idx
  ON public.referral_events (created_at DESC);

-- ── 4. Row Level Security ─────────────────────────────────────────────────────

ALTER TABLE public.referrals        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referral_events  ENABLE ROW LEVEL SECURITY;

-- Parrain voit ses propres parrainages
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'referrals' AND policyname = 'referrer sees own referrals'
  ) THEN
    CREATE POLICY "referrer sees own referrals"
      ON public.referrals FOR SELECT
      USING (auth.uid() = referrer_user_id);
  END IF;
END;
$$;

-- Filleul voit son propre parrainage
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'referrals' AND policyname = 'referee sees own referral'
  ) THEN
    CREATE POLICY "referee sees own referral"
      ON public.referrals FOR SELECT
      USING (auth.uid() = referee_user_id);
  END IF;
END;
$$;

-- Events visibles par les deux parties
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'referral_events' AND policyname = 'users see their referral events'
  ) THEN
    CREATE POLICY "users see their referral events"
      ON public.referral_events FOR SELECT
      USING (
        auth.uid() = referrer_user_id
        OR auth.uid() = referee_user_id
      );
  END IF;
END;
$$;

-- ── 5. Commentaires ──────────────────────────────────────────────────────────

COMMENT ON TABLE public.referrals IS
  'Système de parrainage MVP LEXPAT Connect — un enregistrement par filleul inscrit.';
COMMENT ON TABLE public.referral_events IS
  'Log immuable de tous les événements liés au système de parrainage.';
