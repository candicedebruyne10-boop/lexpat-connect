# Checklist de test — Système de parrainage MVP LEXPAT Connect

> À exécuter manuellement avant mise en production et après chaque déploiement majeur.

---

## Pré-requis

- [ ] Migration `007_referral_system.sql` appliquée sur Supabase (Studio → SQL Editor)
- [ ] Variables d'environnement présentes : `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_SITE_URL`
- [ ] Au moins 1 compte travailleur existant en base pour servir de parrain test

---

## BLOC 1 — Génération du code parrain

**T-01** : Connexion avec un compte travailleur existant → espace travailleur
- [ ] La `ReferralBanner` s'affiche dans le tableau de bord
- [ ] Le code de parrainage au format `LP-XXXXXX` est affiché
- [ ] L'URL complète `https://.../inscription?ref=LP-XXXXXX` est affichée
- [ ] Le bouton "Copier le lien" copie l'URL dans le presse-papier
- [ ] Le bouton "Copier le message" copie le texte de partage complet

**T-02** : Appel direct `POST /api/referral/generate`
- [ ] Retourne `{ referral_code, referral_url }` pour un worker valide
- [ ] Appel répété retourne le même code (idempotent)
- [ ] Retourne 404 pour un utilisateur non-worker

---

## BLOC 2 — Parcours filleul via lien

**T-03** : Clic sur lien de parrainage
- [ ] Accéder à `/inscription?ref=LP-XXXXXX`
- [ ] Le champ "Vous avez été recommandé(e) ?" est verrouillé avec "Lien de parrainage détecté ✓"
- [ ] Le code `LP-XXXXXX` est visible sous le champ verrouillé
- [ ] Cookie `lexpat_ref` est posé (vérifier DevTools → Application → Cookies)
- [ ] LocalStorage `lexpat_ref` est posé (vérifier DevTools → Application → Storage)

**T-04** : Inscription via lien de parrainage
- [ ] Compléter le formulaire et créer un compte travailleur
- [ ] Vérifier dans Supabase Table `referrals` : une ligne créée avec `status='registered'`, `attribution_source='link'`, `referee_user_id` correct
- [ ] Vérifier `referral_events` : event `referral_attributed` présent
- [ ] Vérifier `worker_profiles` du nouveau compte : un `referral_code` lui a été attribué
- [ ] Le parrain voit "+1 inscrit" dans la `ReferralBanner`

---

## BLOC 3 — Parcours filleul sans lien (champ manuel)

**T-05** : Saisie d'un code valide manuellement
- [ ] Accéder à `/inscription` (sans paramètre `?ref=`)
- [ ] Saisir un code `LP-XXXXXX` existant dans le champ
- [ ] Après 600ms, le feedback "Parrainage reconnu 🎉" apparaît
- [ ] Inscription → vérifier `referrals` avec `attribution_source='manual_code'`

**T-06** : Saisie d'un nom valide
- [ ] Saisir le prénom + nom exact d'un parrain existant
- [ ] Feedback "Contact trouvé — [Nom] 🎉" apparaît
- [ ] Inscription → vérifier `referrals` avec `attribution_source='manual_name'`, `status='registered'`

**T-07** : Saisie d'un nom avec faute d'orthographe
- [ ] Saisir un nom légèrement erroné (ex: "Marie Duponds" au lieu de "Marie Dupont")
- [ ] Feedback "Nom non trouvé exactement. Notre équipe vérifiera." apparaît
- [ ] Inscription → vérifier `referrals` avec `status='pending_review'`, `referrer_name_input` contient la saisie brute
- [ ] L'entrée apparaît dans la vue admin avec indicateur "À vérifier"

**T-08** : Aucun parrainage (champ vide)
- [ ] Inscription sans saisie dans le champ
- [ ] Vérifier `referral_events` : event `signup_completed` avec `attribution_source='unknown'`
- [ ] Aucune ligne créée dans `referrals`

---

## BLOC 4 — Cas limites

**T-09** : Cookie expiré + changement d'appareil
- [ ] Supprimer manuellement le cookie `lexpat_ref` (DevTools → Cookies → Delete)
- [ ] Accéder à `/inscription` → champ vide (pas de lien auto-détecté) ✓

**T-10** : Clic sur lien, puis retour J+2 pour s'inscrire
- [ ] Cliquer le lien de parrainage, vérifier que le cookie est posé
- [ ] Ne pas s'inscrire immédiatement
- [ ] Revenir sur `/inscription` directement (sans param `?ref=`) → le champ est pré-rempli depuis le cookie ✓
- [ ] S'inscrire → parrainage attribué correctement avec `source='link'`

**T-11** : Auto-parrainage
- [ ] Connecté en tant que parrain A, copier le code `LP-XXXXXX`
- [ ] Se déconnecter
- [ ] Créer un nouveau compte avec l'email du parrain A → _(normalement Supabase bloque "User already registered")_
- [ ] Simuler via API : envoyer `referral_code` du parrain A lors du bootstrap d'un compte DIFFÉRENT mais avec le même `user_id` → vérifier le rejet dans `referral_events` avec `reason: 'self_referral'`

**T-12** : Filleul déjà en base
- [ ] Essayer de s'inscrire avec un email déjà utilisé
- [ ] Supabase retourne "User already registered"
- [ ] Aucune ligne créée dans `referrals` ✓

**T-13** : Deux parrains revendiquent le même filleul
- [ ] Filleul X inscrit via lien du parrain A → `referrals` contient une ligne
- [ ] Simuler un deuxième appel bootstrap avec le code du parrain B pour le même `referee_user_id`
- [ ] Vérifier : la contrainte unique bloque l'insertion, `referral_events` contient `referral_duplicate` ✓

**T-14** : Filleul ne complète pas son profil
- [ ] Laisser le profil du filleul à 0% de complétion
- [ ] Vérifier : `status` reste `'registered'` dans `referrals` ✓

**T-15** : Filleul complète son profil mais ne le rend pas visible
- [ ] Compléter le profil du filleul à ≥70% sans passer en `visible`
- [ ] Vérifier : `status` passe à `'profile_completed'`, mais pas à `'profile_visible'` ✓

**T-16** : Filleul complète + rend visible
- [ ] Mettre `profile_visibility = 'visible'` via PUT /api/profile
- [ ] Vérifier : `status` passe à `'profile_visible'` dans `referrals`
- [ ] `referral_events` contient `profile_visible` ✓

---

## BLOC 5 — Vue admin

**T-17** : Accès à la vue admin
- [ ] Connecté avec compte admin → `/admin` (ou appel `GET /api/admin/referrals`)
- [ ] Tous les parrainages sont listés avec colonnes : parrain, filleul, source, statut, dates

**T-18** : Filtrage par statut
- [ ] `GET /api/admin/referrals?status=pending_review` → ne retourne que les lignes ambiguës

**T-19** : Validation admin
- [ ] `PATCH /api/admin/referrals` avec `{ referral_id, action: 'validate' }`
- [ ] Vérifier : `status` passe à `'validated'`, `validated_at` est rempli
- [ ] `referral_events` contient `referral_validated` avec `admin_user_id` ✓

**T-20** : Invalidation admin
- [ ] `PATCH /api/admin/referrals` avec `{ referral_id, action: 'invalidate', admin_notes: '...' }`
- [ ] Vérifier : `status` passe à `'invalid'`, `admin_notes` rempli ✓

---

## BLOC 6 — Route `/api/referral/validate`

**T-21** : Code LP- valide → retourne `{ valid: true, source: 'manual_code', display_name }`
**T-22** : Code LP- invalide → retourne `{ valid: false, message: 'Code non reconnu...' }`
**T-23** : Nom exact → retourne `{ valid: true, source: 'manual_name', display_name }`
**T-24** : Nom ambigu → retourne `{ valid: true, source: 'manual_name_unresolved', message: 'Notre équipe vérifiera.' }`

---

## BLOC 7 — Sécurité basique

**T-25** : Appel non authentifié à `/api/referral/generate` → 401 ✓
**T-26** : Appel non-admin à `/api/admin/referrals` → 401 ✓
**T-27** : `/api/referral/validate` accessible sans authentification (normal, endpoint public) ✓

---

## BLOC 8 — Régression sur les fonctionnalités existantes

**T-28** : L'inscription normale (sans aucun parrainage) fonctionne toujours correctement
**T-29** : L'inscription employeur n'est pas affectée par le système de parrainage
**T-30** : Le matching employeur/travailleur n'est pas impacté
**T-31** : Les emails existants (incomplete profile, match) fonctionnent toujours

---

## KPI quotidiens à surveiller (export SQL)

```sql
-- Clics sur liens de parrainage (dernières 24h)
SELECT COUNT(*) as link_clicks
FROM referral_events
WHERE event_type = 'referral_link_clicked'
  AND created_at > NOW() - INTERVAL '24 hours';

-- Nouvelles inscriptions parrainées (dernières 24h)
SELECT COUNT(*) as new_referrals
FROM referrals
WHERE registered_at > NOW() - INTERVAL '24 hours';

-- Taux conversion (lien cliqué → inscrit)
-- À calculer manuellement : new_referrals / link_clicks

-- Parrainages en attente de validation admin
SELECT COUNT(*) as pending_review
FROM referrals
WHERE status = 'pending_review';

-- Top 5 parrains du mois
SELECT referrer_user_id, COUNT(*) as referral_count
FROM referrals
WHERE registered_at > DATE_TRUNC('month', NOW())
  AND status != 'invalid'
GROUP BY referrer_user_id
ORDER BY referral_count DESC
LIMIT 5;

-- Profils filleuls visibles
SELECT COUNT(*) as visible_referees
FROM referrals
WHERE status IN ('profile_visible', 'validated');
```

---

## Définition du "done" pour le MVP 24h

- [ ] Un parrain peut copier son lien depuis son espace travailleur
- [ ] Un filleul arrivant via ce lien voit le champ pré-rempli verrouillé
- [ ] L'inscription attribue correctement le parrainage dans la table `referrals`
- [ ] Le parrain voit le compteur mis à jour dans la bannière
- [ ] Zéro régression sur les fonctionnalités existantes (T-28 à T-31)
