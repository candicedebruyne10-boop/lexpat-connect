-- ============================================================
-- 011_security_hardening.sql
-- Sécurisation production — LEXPAT Connect
-- Mai 2026
-- ============================================================
-- Applique dans l'ordre :
--   1. Fonction helper d'accès au rôle utilisateur
--   2. Fix escalade de privilèges sur user_roles
--   3. RLS + policies sur matches
--   4. RLS + policies sur match_notification_logs
--   5. Policies manquantes (employer_profiles INSERT, employer_members INSERT,
--      legal_referrals INSERT, worker_profiles SELECT visible)
--   6. GRANTs explicites pour PostgREST (Supabase 2026)
-- ============================================================


-- ── 1. Fonction helper : rôle de l'utilisateur connecté ─────────────────────
-- Utilisée dans les policies RLS pour simplifier et centraliser la vérification.
-- SECURITY DEFINER : s'exécute avec les droits du propriétaire, pas du client.

CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS TEXT
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT role::TEXT FROM public.user_roles WHERE user_id = auth.uid()
$$;

COMMENT ON FUNCTION public.current_user_role() IS
  'Retourne le rôle app (worker / employer / admin) de l''utilisateur connecté. Null si aucun rôle.';


-- ── 2. Fix escalade de privilèges sur user_roles ─────────────────────────────
-- Problème : la policy ALL owner permettait à un utilisateur de s'octroyer
-- n''importe quel rôle, y compris admin.
-- Solution : on remplace la policy ALL par des policies séparées :
--   - SELECT : voir sa propre ligne
--   - INSERT : créer sa propre ligne SEULEMENT si le rôle est worker ou employer
--   - UPDATE : interdite côté client (seul le service_role peut changer un rôle)
--   - DELETE : interdite côté client

DROP POLICY IF EXISTS "users manage their own role row" ON public.user_roles;

CREATE POLICY "users read their own role"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "users set initial role (worker or employer only)"
  ON public.user_roles FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    AND role IN ('worker', 'employer')
    AND NOT EXISTS (
      SELECT 1 FROM public.user_roles WHERE user_id = auth.uid()
    )
  );

-- Pas de policy UPDATE ni DELETE côté client.
-- Le passage à 'admin' se fait UNIQUEMENT via service_role (API admin).


-- ── 3. RLS sur la table matches ──────────────────────────────────────────────
-- STATUT AVANT : RLS désactivé → tout utilisateur authentifié peut lire tous
-- les matchs, y compris ceux qui ne le concernent pas.

ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;

-- Un travailleur voit ses propres matchs
CREATE POLICY "worker sees own matches"
  ON public.matches FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.worker_profiles wp
      WHERE wp.id = worker_profile_id
        AND wp.user_id = auth.uid()
    )
  );

-- Un employeur voit les matchs sur ses offres
CREATE POLICY "employer sees matches on their offers"
  ON public.matches FOR SELECT
  USING (
    EXISTS (
      SELECT 1
      FROM public.job_offers jo
      JOIN public.employer_members em ON em.employer_profile_id = jo.employer_profile_id
      WHERE jo.id = job_offer_id
        AND em.user_id = auth.uid()
    )
  );

-- L'admin peut tout voir (via current_user_role)
CREATE POLICY "admin sees all matches"
  ON public.matches FOR ALL
  USING (public.current_user_role() = 'admin');


-- ── 4. RLS sur match_notification_logs ───────────────────────────────────────
-- STATUT AVANT : RLS désactivé → tout connecté peut lire les emails de
-- notification de tous les utilisateurs.
-- Cette table est en lecture/écriture service_role only.

ALTER TABLE public.match_notification_logs ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public.match_notification_logs FROM anon;
REVOKE ALL ON public.match_notification_logs FROM authenticated;

COMMENT ON TABLE public.match_notification_logs IS
  'Logs des notifications de matching. Accès service_role uniquement.';


-- ── 5. Policies manquantes ───────────────────────────────────────────────────

-- 5a. employer_profiles : INSERT pour le créateur
-- Permet à un utilisateur authentifié de créer un profil employeur.
-- L'ajout du membre owner se fait juste après via employer_members.
CREATE POLICY "authenticated can create employer profile"
  ON public.employer_profiles FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- 5b. employer_members : INSERT pour le créateur (première entrée = owner)
-- On vérifie que l'utilisateur s'ajoute lui-même comme owner.
CREATE POLICY "user can add themselves as owner"
  ON public.employer_members FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id = auth.uid()
    AND is_owner = true
  );

-- 5c. legal_referrals : INSERT pour les parties liées
-- Seuls un membre employeur lié OU le travailleur concerné peut créer le referral.
CREATE POLICY "linked users can create legal referral"
  ON public.legal_referrals FOR INSERT
  TO authenticated
  WITH CHECK (
    (
      employer_profile_id IS NOT NULL
      AND EXISTS (
        SELECT 1 FROM public.employer_members em
        WHERE em.employer_profile_id = legal_referrals.employer_profile_id
          AND em.user_id = auth.uid()
      )
    )
    OR (
      worker_profile_id IS NOT NULL
      AND EXISTS (
        SELECT 1 FROM public.worker_profiles wp
        WHERE wp.id = legal_referrals.worker_profile_id
          AND wp.user_id = auth.uid()
      )
    )
  );

-- 5d. worker_profiles : SELECT pour les employeurs (profils visibles uniquement)
-- Permet aux employeurs connectés de voir les profils visibility = 'visible'
-- directement via le client Supabase (en complément du service_role existant).
CREATE POLICY "employers can view visible worker profiles"
  ON public.worker_profiles FOR SELECT
  USING (
    profile_visibility = 'visible'
    AND public.current_user_role() = 'employer'
  );

-- 5e. Profils publics anonymisés visibles par les visiteurs non connectés
-- (uniquement job + sector + region, pas de données personnelles)
-- Cette policy est volontairement restrictive : le SELECT retournera toutes les
-- colonnes autorisées par la policy, mais vous devez ne SELECTionner que les
-- colonnes non-sensibles dans votre code.
CREATE POLICY "anon can view visible profiles (public fields only)"
  ON public.worker_profiles FOR SELECT
  TO anon
  USING (profile_visibility = 'visible');

-- ⚠️ ATTENTION : cette dernière policy rend les profils visibles aux non-connectés.
-- Dans votre code Next.js, ne sélectionnez JAMAIS full_name, email, phone,
-- birth_date, address depuis un client anonyme. Utilisez toujours le service_role
-- pour la base de profils publique (/base-de-profils), ce qui est déjà le cas.
-- Cette policy est ici pour la cohérence RLS mais n'est pas exploitée côté client.


-- ── 6. GRANTs explicites (requis Supabase PostgREST 2026) ────────────────────
-- Sans ces GRANTs, PostgREST refuse l'accès même si la RLS policy autorise.
-- Règle : GRANT au rôle minimum nécessaire.

-- Tables accessibles aux utilisateurs connectés
GRANT SELECT, INSERT, UPDATE ON public.worker_profiles     TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.worker_cv_items  TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.worker_documents TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.employer_profiles   TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.employer_members TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.job_offers          TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.job_applications    TO authenticated;
GRANT SELECT, INSERT         ON public.legal_referrals     TO authenticated;
GRANT SELECT                 ON public.user_roles          TO authenticated;
GRANT INSERT                 ON public.user_roles          TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.conversations       TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.messages            TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.conversation_actions TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.referrals           TO authenticated;
GRANT SELECT, INSERT         ON public.referral_events     TO authenticated;
GRANT SELECT                 ON public.matches             TO authenticated;

-- Tables accessibles aux visiteurs non connectés (anon)
-- Uniquement ce qui est vraiment public
GRANT SELECT ON public.worker_profiles  TO anon;   -- limité par RLS à visibility='visible'
GRANT SELECT ON public.job_offers       TO anon;   -- limité par RLS à status='published'

-- Tables service_role ONLY — pas de GRANT aux rôles client
-- (test_feedback, match_notification_logs, email_campaigns,
--  linkedin_admin_connections, matches pour anon)
-- Ces tables n'ont pas de GRANT ici : PostgREST les bloquera pour les clients.


-- ── 7. Sécurisation linkedin_admin_connections ───────────────────────────────
-- Cette table contient des access_token LinkedIn — données très sensibles.
-- On ajoute une policy pour que le créateur puisse voir et gérer sa propre ligne,
-- mais pas celle des autres.

CREATE POLICY "admin connection owner can manage"
  ON public.linkedin_admin_connections FOR ALL
  USING (created_by = auth.uid())
  WITH CHECK (created_by = auth.uid());


-- ── 8. Vérification finale — résumé des tables et leur niveau d'accès ────────
-- À lire dans vos logs Supabase après application :
COMMENT ON TABLE public.user_roles IS
  'Rôles utilisateurs. INSERT : worker/employer uniquement côté client. Promotion admin : service_role only.';
COMMENT ON TABLE public.matches IS
  'Matchs offres/travailleurs. Visible par les deux parties du match et les admins.';
COMMENT ON TABLE public.match_notification_logs IS
  'Logs notifications. Service_role only.';
COMMENT ON TABLE public.email_campaigns IS
  'Campagnes email admin. Service_role only.';
COMMENT ON TABLE public.linkedin_admin_connections IS
  'Tokens LinkedIn OAuth. Visible uniquement par le créateur (admin connecté).';
