# Rapport d'architecture — LEXPAT Connect MVP

*Analyse produite le 5 juin 2026 — lecture seule, aucune modification du projet*

---

## Table des matières

1. [Synthèse en 5 lignes](#1-synthèse-en-5-lignes)
2. [Stack technique](#2-stack-technique)
3. [Structure du projet](#3-structure-du-projet)
4. [Architecture applicative](#4-architecture-applicative)
5. [Modèle de données](#5-modèle-de-données)
6. [Logique métier clé](#6-logique-métier-clé)
7. [Intégrations externes](#7-intégrations-externes)
8. [Authentification & sécurité](#8-authentification--sécurité)
9. [Déploiement & infrastructure](#9-déploiement--infrastructure)
10. [Tests & qualité](#10-tests--qualité)
11. [Points forts](#11-points-forts)
12. [Risques, dette technique et incohérences](#12-risques-dette-technique-et-incohérences)
13. [Zones d'ombre / questions ouvertes](#13-zones-dombre--questions-ouvertes)
14. [Recommandations d'architecture](#14-recommandations-darchitecture)
15. [Repères chiffrés](#repères-chiffrés)

---

## 1. Synthèse en 5 lignes

LEXPAT Connect est une plateforme B2B/B2C belge de mise en relation entre employeurs belges et travailleurs internationaux qualifiés dans les métiers en pénurie, couplée au cabinet d'avocats LEXPAT pour le volet juridique (permis unique). Elle cible deux audiences simultanément : les employeurs (accès à une base de profils, offres d'emploi, simulateur d'éligibilité) et les travailleurs internationaux (création de profil, candidatures). Le projet est un **monolithe Next.js en stade MVP actif** — fonctionnel en production, mais avec une dette technique croissante concentrée dans un composant admin de 5 700 lignes. L'architecture est pragmatique et cohérente pour une équipe solo, avec des choix solides côté base de données (Supabase + RLS), mais fragile côté testabilité et maintenabilité à long terme.

---

## 2. Stack technique

| Couche | Technologie | Version |
|---|---|---|
| Framework web | Next.js (App Router) | 15.5.14 |
| UI | React | 19.1.0 |
| Langage | JavaScript (ES modules) | — aucun TypeScript |
| Base de données | Supabase (PostgreSQL hébergé) | `@supabase/supabase-js` 2.100.1 |
| Auth | Supabase Auth (magic link + OAuth) | via Supabase |
| Storage | Supabase Storage | via Supabase |
| CSS | Tailwind CSS | 3.4.17 |
| Emails transactionnels | Resend + react-email | resend 6.12.0 |
| IA — primaire | Anthropic Claude Haiku | `claude-haiku-4-5-20251001` |
| IA — fallback | OpenAI GPT-4o-mini | via API |
| Analytics | Google Analytics 4 + Vercel Analytics | `@vercel/analytics` 2.0.1 |
| LinkedIn | OAuth2 + Marketing API | version `202506` |
| Gestionnaire de paquets | npm | — |
| Déploiement | Vercel | région `cdg1` (Paris) |

**Bibliothèques structurantes :** `pptxgenjs` (génération PPTX), `@react-email/components` (templates email), `tsx` (scripts Node).

**Absence notable :** aucun ORM (requêtes Supabase directes), aucune couche GraphQL, pas de file de messages.

---

## 3. Structure du projet

```
lexpat-connect-mvp/
├── app/                        # Next.js App Router — pages et API routes
│   ├── api/                    # 47 route handlers (API REST)
│   │   ├── admin/              # Routes admin (campagnes, LinkedIn, Coach IA, RGPD…)
│   │   ├── auth/               # Callbacks OAuth
│   │   ├── conversations/      # Messagerie interne
│   │   ├── matches/            # Moteur de matching
│   │   ├── member/             # Espace membre (profil, CV, offres)
│   │   ├── profile/            # Profil travailleur
│   │   ├── offers/             # Offres d'emploi
│   │   ├── public/             # Endpoints publics (compteurs, etc.)
│   │   ├── referral/           # Système de parrainage
│   │   └── ...
│   ├── [locale]/               # Arbre /en/ — miroir complet en anglais
│   ├── admin/                  # Page admin (FR + EN)
│   ├── simulateur-eligibilite/ # Simulateur permis unique
│   ├── base-de-profils/        # Marketplace publique des travailleurs
│   ├── employeurs/             # Pages employeurs + espaces régionaux
│   ├── travailleurs/           # Pages travailleurs + espace membre
│   ├── layout.js               # Layout racine (fonts, metadata, analytics)
│   └── globals.css             # Design system CSS
├── components/                 # 25 composants React
│   ├── AdminDashboard.js       # Dashboard admin (5 691 lignes, client-only)
│   ├── Sections.js             # Sections homepage/landing (2 217 lignes)
│   ├── SiteChrome.js           # Header + footer + nav (505 lignes)
│   ├── SimulateurEligibilite.js# Wizard 4 étapes (1 593 lignes)
│   ├── TravailleurWizard.js    # Onboarding travailleur
│   ├── EmployeurWizard.js      # Onboarding employeur
│   ├── WorkerSpace.js          # Espace membre travailleur
│   ├── EmployerSpace.js        # Espace membre employeur
│   ├── Messagerie.js           # Interface messagerie interne
│   └── ...
├── lib/                        # Logique métier partagée (server-side)
│   ├── supabase/               # Clients Supabase (browser + server)
│   ├── shortageJobs2026.js     # Listes métiers en pénurie FR/EN (Actiris/Forem/VDAB)
│   ├── flandreKnelpuntberoepen.js # Sets VDAB : 21 professions exonérées + 227 test 9 sem.
│   ├── matching.js             # Calcul score matching offre/profil
│   ├── email-generator.js      # Génération email IA (Claude→OpenAI→fallback)
│   ├── linkedin-post-generator.js # Génération post LinkedIn IA
│   ├── linkedin-marketing.js   # Client LinkedIn API (OAuth, posts, version)
│   ├── referral.js             # Logique parrainage (codes LP-XXXXXX)
│   ├── i18n.js                 # Détection locale + chaînes FR/EN
│   └── ...
├── emails/                     # Templates react-email
├── supabase/                   # Migrations SQL (001 → 011)
├── scripts/                    # Scripts Node (envoi emails, génération PPTX)
├── public/                     # Assets statiques (images, vidéos, podcast)
├── CLAUDE.md                   # Documentation architecture pour IA
├── CHECKLIST-RGPD-LEXPAT-CONNECT.md
└── vercel.json                 # Config déploiement (région cdg1)
```

---

## 4. Architecture applicative

**Style :** monolithe modulaire serverless (Next.js App Router sur Vercel). Pas de microservices, pas de conteneurs.

**Couches :**

```
Navigateur
    │
    ├── Pages RSC (Server Components) ──→ Supabase (lecture SSR)
    │
    ├── Pages Client Components ──→ API Routes (fetch /api/*)
    │                                       │
    │                        ┌──────────────┼──────────────┐
    │                        ▼              ▼              ▼
    │                   Supabase       Anthropic/      Resend
    │                 (PostgreSQL)      OpenAI         (email)
    │
    └── Middleware : aucun (i18n géré manuellement par pathname)
```

**Flux d'une requête type (simulation éligibilité) :**

```
Utilisateur → GET /simulateur-eligibilite
    → page.js (RSC, metadata SEO)
    → SimulateurEligibilite.js (Client Component, wizard 4 étapes)
    → lib/shortageJobs2026.js (données locales, pas d'API)
    → lib/flandreKnelpuntberoepen.js (ensembles JS en mémoire)
    → Résultat affiché côté client (pas de round-trip serveur pour l'analyse)
    → POST /api/eligibility-lead (capture lead si email saisi)
        → Supabase INSERT
        → Resend (email de confirmation)
```

**Flux d'une requête authentifiée (espace membre) :**

```
Utilisateur → GET /travailleurs/espace
    → WorkerSpace.js (Client Component)
    → AuthProvider.js → getSupabaseBrowserClient() → session Supabase
    → fetch /api/profile → getUserFromRequest() → getServiceClient()
    → Supabase RLS (service role bypass)
    → Données renvoyées au composant
```

**Points d'entrée principaux :**
- `app/layout.js` — racine globale, polices, analytics, CookieBanner
- `app/page.js` — homepage (HeroPremium + profils mis en avant)
- `app/admin/page.js` → `components/AdminLoader.js` → `AdminDashboard.js`
- `app/api/` — 47 route handlers

---

## 5. Modèle de données

**~20 tables PostgreSQL** réparties en 11 migrations séquentielles (`supabase/001` à `011`).

### Entités principales

| Table | Rôle | Relations clés |
|---|---|---|
| `auth.users` | Comptes Supabase Auth | racine de toutes les identités |
| `user_roles` | Rôle applicatif (worker/employer/admin) | → auth.users |
| `worker_profiles` | Profil complet travailleur | → auth.users, visibility enum |
| `worker_cv_items` | Items CV (expérience, formation, compétences) | → worker_profiles |
| `worker_documents` | Fichiers CV uploadés (Supabase Storage) | → worker_profiles |
| `employer_profiles` | Profil entreprise | indépendant de auth.users |
| `employer_members` | Lien user↔entreprise + rôle (is_owner) | → auth.users + employer_profiles |
| `job_offers` | Offres d'emploi | → employer_profiles, status enum |
| `job_applications` | Candidatures | → job_offers + worker_profiles |
| `matches` | Scores de matching calculés | → job_offers + worker_profiles, score 0-100 |
| `legal_referrals` | Dossiers transmis au cabinet LEXPAT | → employer/worker/offer/application |
| `conversations` | Fils de messagerie | → employer + worker profiles |
| `messages` | Messages individuels | → conversations |
| `referrals` | Codes de parrainage LP-XXXXXX | → auth.users |
| `referral_events` | Événements du funnel parrainage | → referrals |
| `email_campaigns` | Historique campagnes email admin | autonome (JSONB recipients/failures) |
| `linkedin_admin_connections` | Token OAuth LinkedIn admin | → auth.users |
| `test_feedback` | Retours bêta-testeurs | autonome |
| `match_notification_logs` | Logs notifications matching | → matches |

### Choix de conception notables

- **RLS activée sur toutes les tables** de `001` — bonne pratique défensive.
- **JSONB utilisé** dans `email_campaigns` (recipients, failures) et `linkedin_admin_connections` (account_snapshot) — pragmatique pour des données semi-structurées variables.
- **Enum PostgreSQL** pour statuts critiques (profile_visibility, offer_status, application_status, region_code) — garantit l'intégrité sans validation applicative.
- **profile_completion** : entier 0-100 calculé côté application, pas de trigger DB.
- **Pas de table dédiée** pour les résultats du simulateur — intentionnel (pas de persistence, lead capturé séparément via `eligibility-lead`).

---

## 6. Logique métier clé

**Source principale :** `lib/matching.js`, `lib/shortageJobs2026.js`, `lib/flandreKnelpuntberoepen.js`, `components/SimulateurEligibilite.js`.

1. **Éligibilité permis unique (simulateur)** : croisement du métier saisi avec trois listes régionales (Actiris/Bruxelles, Forem/Wallonie, VDAB/Flandre). Le résultat est calculé entièrement en mémoire côté client — aucune API n'est appelée. Le code métier de rattachement est la clé, pas l'intitulé littéral.

2. **Régime VDAB à deux vitesses** : `FLANDRE_MB_21` (31 titres → exemption totale du test marché AM 1/12/2025) vs `FLANDRE_VDAB_227` (227 titres → test marché 9 semaines). La correspondance est en `Set` JavaScript avec matching exact sur chaîne normalisée — fragile si un intitulé change de graphie.

3. **Score de matching offre/profil** (`lib/matching.js`) : algorithme additif simple (secteur +X, métier +X, région +X, visibilité +10, profil_completion proportionnel). Pas de ML. Score 0-100 stocké en DB.

4. **Système de parrainage** : génération de codes `LP-XXXXXX` (32^6 combinaisons) sans collision DB via `isMissingReferralColumnError` graceful fallback. Funnel : code généré → partagé → utilisé → événement enregistré.

5. **Visibilité des profils** : enum `{visible, review, hidden}`. Seuls les profils `visible` apparaissent dans la marketplace publique (`base-de-profils`). Le passage en `visible` est manuel (admin) ou automatique selon `profile_completion >= 60` (logique applicative dans `worker-profile-visibility.js`).

6. **Renvoi légal** (`legal_referrals`) : quand un recrutement nécessite accompagnement juridique, un enregistrement est créé pointant vers employer + worker + offre + candidature. Le cabinet LEXPAT intervient manuellement sur ces dossiers.

7. **Génération IA à trois niveaux** (email + LinkedIn + réponse commentaire) : Claude Haiku → OpenAI GPT-4o-mini → template local. L'ordre est figé dans le code, sans configuration dynamique.

8. **Campagnes email admin** : segmentation par type d'utilisateur (worker_all, employer_all, etc.), envoi par batch via Resend, tracking des opens via pixel, historique stocké en `email_campaigns` avec liste JSON des succès/échecs.

9. **Version LinkedIn API** : sanitisation stricte dans `lib/linkedin-marketing.js` — suppression des caractères non-numériques, truncature YYYYMMDD→YYYYMM, fallback hardcodé `202506`.

10. **i18n sans middleware** : la locale est détectée à chaque render par `detectLocaleFromPathname(pathname)`. L'arbre `/en/` est un miroir manuel de l'arbre FR — doublons explicites des pages.

---

## 7. Intégrations externes

| Service | Usage | Mécanisme |
|---|---|---|
| **Supabase** | Base de données, Auth, Storage | SDK `@supabase/supabase-js`, deux clients (browser anon + server service role) |
| **Anthropic Claude** | Génération email, post LinkedIn, réponses commentaires, Coach IA | REST API `/v1/messages`, clé `ANTHROPIC_API_KEY` |
| **OpenAI** | Fallback IA + génération images LinkedIn (DALL-E/GPT-image-1) | REST API, clé `OPENAI_API_KEY` |
| **Resend** | Emails transactionnels + campagnes | SDK `resend`, clé `RESEND_API_KEY` |
| **LinkedIn** | OAuth2 login + publication posts organiques | OAuth2 PKCE + REST API v202506, scopes `openid profile w_member_social` |
| **Google Analytics 4** | Tracking visites | `gtag` injecté conditionnellement via `ConsentAwareAnalytics` |
| **Vercel Analytics** | Métriques performances | `@vercel/analytics`, même gate consentement |
| **Google Search Console** | SEO | fichier de vérification `public/google7fecb50167219bd1.html` |

**Absent :** webhook entrant, file de messages (Kafka/SQS), CDN images tiers (images servies depuis Vercel/public/).

---

## 8. Authentification & sécurité

### Modèle d'authentification

- **Supabase Auth** : magic link email (flux principal) + OAuth social possible.
- **Session** : JWT stocké dans cookie HttpOnly par Supabase, validé via `getUserFromRequest(request)` dans chaque API route (extraction du Bearer token de l'header `Authorization`).
- **Deux clients Supabase** : `getSupabaseBrowserClient()` (anon key, respecte RLS) côté client ; `getServiceClient()` (service role, bypass RLS) côté serveur uniquement. La séparation est documentée et respectée.

### Rôles et permissions

- **Table `user_roles`** : enum `worker | employer | admin`.
- **Admin** : double check — liste emails hardcodée (`ADMIN_EMAILS`) OU entrée en `user_roles`. Robuste mais pas scalable.
- **`assertAdmin()`** est copié-collé dans chaque route admin (~15 occurrences) — risque de divergence.
- **Exception connue** : `app/api/admin/overview/route.js` utilise `assertAdminAccess()` qui retourne un booléen au lieu de lever une exception — pattern divergent, risque d'oubli du check.

### Gestion des secrets

- Secrets serveur (`SUPABASE_SERVICE_ROLE_KEY`, `ANTHROPIC_API_KEY`, etc.) : jamais exposés en `NEXT_PUBLIC_*`. ✓
- `.env.local` présent dans le repo (`.gitignore` à vérifier).
- `.env.local.save` présent — fichier de backup qui ne devrait pas être versionné.

### RLS

- Activée sur toutes les tables de `001_initial_schema.sql`. ✓
- Migration `011_security_hardening.sql` suggère un durcissement ultérieur.
- **Zone d'ombre** : `test_feedback` est signalée dans `CHECKLIST-RGPD-LEXPAT-CONNECT.md` comme nécessitant vérification RLS.

### Consentement cookies

- `ConsentAwareAnalytics.js` gate GA4 et Vercel Analytics derrière le consentement cookie. ✓
- Consent stocké cookie `lexpat_cookie_consent` + localStorage `lexpat-cookie-consent`, 180 jours.

---

## 9. Déploiement & infrastructure

| Élément | Valeur |
|---|---|
| Plateforme | Vercel (serverless) |
| Région | `cdg1` — Paris (RGPD EU) |
| Config | `vercel.json` minimal : `{"regions":["cdg1"],"framework":"nextjs"}` |
| CI/CD | **Aucun** — déploiement déclenché manuellement par `git push` ou via dashboard Vercel |
| Branch principale | `main` |
| Environnements | Un seul : production. Pas de staging. |
| Netlify | `netlify.toml` présent + `@netlify/plugin-nextjs` en devDependencies — résidu non supprimé, non utilisé en production |
| Sauvegardes DB | Gérées par Supabase (politique interne Supabase) — non configurées explicitement |
| Assets statiques | Servis depuis Vercel CDN (dossier `public/`) — inclut fichiers vidéo (1,3 MB) et audio (3,3 MB) |

**Note :** La variable `LINKEDIN_API_VERSION` doit être maintenue à jour manuellement (expiration ~12-24 mois). Actuellement `202506`.

---

## 10. Tests & qualité

| Aspect | État |
|---|---|
| Tests unitaires | **Aucun** |
| Tests d'intégration | **Aucun** |
| Tests E2E | **Aucun** |
| Linting | ESLint via `next lint` (config Next.js par défaut) |
| TypeScript | **Absent** — JavaScript pur, pas de JSDoc non plus |
| Typage des props | Aucun (ni PropTypes ni TypeScript) |
| CI | **Aucune** pipeline automatisée |

La qualité repose entièrement sur la revue manuelle et les retours en production. Le déploiement direct sur `main` sans staging augmente le risque de régressions en production.

---

## 11. Points forts

1. **Modèle de données robuste** (`001_initial_schema.sql`) : entités bien séparées, enums PostgreSQL, triggers `updated_at`, RLS dès le départ — fondation solide.

2. **Séparation client/serveur Supabase** : le pattern deux-clients (anon browser vs service role server) est documenté (`CLAUDE.md`) et cohérent dans tout le codebase. Évite les fuites de service role key.

3. **Simulateur entièrement client-side** : données de pénurie embarquées en JS, pas de latence API, fonctionne offline. Bon choix pour un outil de découverte.

4. **Génération IA avec fallback à trois niveaux** : robustesse opérationnelle sans dépendance dure à un fournisseur unique.

5. **Documentation CLAUDE.md** : présence d'un fichier de contexte architectural maintenu — rare pour un projet solo, facilite l'intégration de nouveaux contributeurs (humains ou IA).

6. **Consentement cookies correctement implémenté** : pas d'analytics sans consentement explicite, stockage 180 jours, source unique de vérité (`lib/analytics-consent.js`).

7. **SEO soigné** : metadata complètes par page, JSON-LD Organization/Service/WebSite, sitemap.js, robots.js, og-image.

8. **i18n fonctionnel** sans dépendance externe : détection par pathname, copie UI centralisée dans `lib/i18n.js`.

---

## 12. Risques, dette technique et incohérences

### Risques critiques

**R1 — `AdminDashboard.js` : fichier monolithique de 5 700 lignes**
Composant client unique gérant 10 onglets, ~60 `useState`, toutes les intégrations admin. Tout rerender parent re-rend tout. Un bug affecte potentiellement toutes les fonctionnalités admin simultanément. Maintenabilité dégradée.
*Preuves : `components/AdminDashboard.js`, 5 691 lignes.*

**R2 — Absence totale de tests**
Aucun test unitaire, intégration ou E2E. Les régressions ne sont détectées qu'en production. La logique métier critique (simulateur, matching, parrainage) n'est pas couverte.

**R3 — `.env.local` et `.env.local.save` potentiellement versionnés**
Si ces fichiers ne sont pas dans `.gitignore`, les secrets de production sont exposés dans l'historique Git.
*À vérifier immédiatement : `cat .gitignore | grep env`.*

**R4 — Déploiement direct sur `main` sans staging**
Un `git push` mal maîtrisé peut casser la production immédiatement. Pas de filet.

### Dette technique significative

**D1 — JavaScript sans typage**
Aucun TypeScript, aucun JSDoc. Les interfaces entre composants et API routes ne sont pas contractualisées. Les erreurs de type sont détectées uniquement au runtime.

**D2 — `assertAdmin()` copié-collé ~15 fois**
Risque de divergence si le comportement doit changer. Un middleware ou une utility partagée s'impose.
*Preuves : grep `assertAdmin` dans `app/api/admin/*/route.js`.*

**D3 — Pattern divergent dans `overview/route.js`**
`assertAdminAccess()` retourne un booléen là où tous les autres routes lèvent une exception. Risque de bypass accidentel si un développeur copie ce pattern.
*Preuve : `app/api/admin/overview/route.js`.*

**D4 — Pages `/en/` miroir manuel**
67 pages dont ~35 doublons `/en/`. Toute modification de contenu doit être répliquée manuellement dans les deux arbres. Pas de mécanisme de synchronisation.

**D5 — `test_feedback` accessible en production**
Page `/retours-test` redirige vers `/admin` mais la table `test_feedback` n't a pas de RLS vérifiée selon la checklist RGPD.
*Preuve : `CHECKLIST-RGPD-LEXPAT-CONNECT.md`.*

**D6 — Netlify résiduel**
`netlify.toml`, `@netlify/plugin-nextjs` en devDependencies, dossier `.netlify/` présent. Crée de la confusion sur la cible de déploiement réelle. À nettoyer.

**D7 — Historique admin en localStorage**
Historique des posts LinkedIn et emails stocké en `localStorage` — perdu si l'utilisateur change de navigateur ou vide son cache. Pas de persistance serveur.

**D8 — Matching score non recalculé**
Les scores de matching en `matches` sont calculés au moment de la création. Si un profil ou une offre est mis à jour, les scores ne sont pas recalculés automatiquement.

---

## 13. Zones d'ombre / questions ouvertes

1. **`.gitignore` pour `.env.local`** : non vérifiable sans accès Git. À confirmer : ces fichiers sont-ils exclus du versioning ?

2. **Politique de sauvegarde Supabase** : quelle est la fréquence des backups et le RTO/RPO en cas d'incident ?

3. **Gestion des tokens LinkedIn expirés** : le token OAuth LinkedIn a une durée de vie limitée. Quel est le mécanisme de renouvellement automatique ou d'alerte à l'expiration ?

4. **Volume de données réel** : combien de `worker_profiles`, `employer_profiles`, `job_offers` en production ? Cela conditionne les besoins d'indexation.

5. **Qui peut créer un compte employeur ?** : la table `employer_profiles` n'est pas liée à `auth.users` directement — elle passe par `employer_members`. Qui crée le profil initial et comment ?

6. **Sécurité de `worker-documents` (Supabase Storage)** : les fichiers CV sont-ils accessibles uniquement au travailleur ou aussi aux employeurs ? La politique RLS Storage ne couvre que le propriétaire.

7. **`supabase/011_security_hardening.sql`** : contenu non lu — que durcit-il exactement ?

8. **Scalabilité du simulateur** : les données de pénurie sont hardcodées en JS (`shortageJobs2026.js`). Comment sont-elles mises à jour quand les listes officielles changent (publication annuelle) ?

---

## 14. Recommandations d'architecture

*Priorisées par impact × effort. ★ = quick win, ★★★ = chantier de fond.*

---

**R1 ★ — Vérifier et corriger immédiatement les fichiers `.env` dans Git**
*Problème :* `.env.local` et `.env.local.save` présents dans le répertoire projet.
*Action :* `git check-ignore -v .env.local` ; si non ignorés, supprimer de l'historique (`git filter-repo`), révoquer et régénérer tous les secrets exposés, ajouter au `.gitignore`.
*Bénéfice :* Élimine un risque de sécurité critique immédiat.

---

**R2 ★ — Mettre en place un environnement de staging**
*Problème :* Déploiement direct sur `main` = production.
*Action :* Créer une branche `develop` + un projet Vercel Preview lié. Fusionner `develop`→`main` uniquement après validation manuelle sur staging.
*Bénéfice :* Filet de sécurité avant chaque livraison. Effort : 2h.

---

**R3 ★ — Extraire `assertAdmin()` en middleware partagé**
*Problème :* Fonction copiée ~15 fois, pattern divergent dans `overview/route.js`.
*Action :* Créer `lib/admin-auth.js` avec une unique implémentation, l'importer partout. Aligner `overview/route.js` sur le pattern throwing.
*Bénéfice :* Cohérence de sécurité, maintenabilité. Effort : 2-3h.

---

**R4 ★★ — Ajouter TypeScript progressivement**
*Problème :* Pas de typage = bugs de type détectés uniquement en runtime.
*Action :* Activer TypeScript en mode `"strict": false` d'abord, migrer `lib/` puis les API routes. Les composants en dernier.
*Bénéfice :* Détection précoce d'erreurs, autocomplétion, documentation vivante des interfaces.

---

**R5 ★★ — Écrire des tests pour la logique métier critique**
*Problème :* Simulateur, matching, parrainage — zéro couverture.
*Action :* Vitest (compatible Next.js 15) pour les fonctions pures de `lib/` (matching, referral, shortageJobs). 20-30 tests suffiront pour les cas les plus critiques.
*Bénéfice :* Confiance lors des mises à jour des listes pénurie 2027.

---

**R6 ★★ — Décomposer `AdminDashboard.js`**
*Problème :* 5 700 lignes, ~60 useState, 10 onglets dans un seul fichier.
*Action :* Extraire chaque onglet en composant lazy-loaded indépendant (`React.lazy` + `Suspense`). Partager l'état global via Context ou Zustand.
*Bénéfice :* Performance (code splitting), maintenabilité, débogage isolé par onglet.

---

**R7 ★★ — Supprimer les résidus Netlify**
*Problème :* Confusion sur la cible de déploiement, dépendances dev inutiles.
*Action :* Supprimer `netlify.toml`, retirer `@netlify/plugin-nextjs` du `package.json`, supprimer le dossier `.netlify/`.
*Bénéfice :* Clarté, réduction de la surface d'ambiguïté.

---

**R8 ★★★ — Internationalisation via next-intl ou i18next**
*Problème :* ~35 pages dupliquées manuellement en `/en/`, risque de désynchronisation permanent.
*Action :* Migrer vers `next-intl` avec un seul arbre de routes et des fichiers de traduction JSON (`messages/fr.json`, `messages/en.json`).
*Bénéfice :* Une seule page à maintenir par route, ajout de langues facilité.

---

**R9 ★★★ — Externaliser les données de pénurie vers la base de données**
*Problème :* `shortageJobs2026.js` et `flandreKnelpuntberoepen.js` sont des fichiers JS statiques — mise à jour nécessite une recompilation et un redéploiement.
*Action :* Créer une table `shortage_jobs` en DB (ou un CMS headless léger), avec une interface admin de mise à jour. Listes chargées au runtime via API.
*Bénéfice :* Mise à jour annuelle des listes sans déploiement technique. Critique pour la crédibilité du simulateur.

---

**R10 ★★★ — Monitoring et alerting en production**
*Problème :* Aucune visibilité sur les erreurs runtime, les lenteurs API ou les échecs silencieux (IA, LinkedIn, email).
*Action :* Intégrer Sentry (erreurs) + Uptime Kuma ou Better Uptime (disponibilité). Les logs Vercel ne persistent pas.
*Bénéfice :* Détection proactive des incidents, réduction du MTTR.

---

## Repères chiffrés

| Indicateur | Valeur |
|---|---|
| Lignes de code JS (hors node_modules/.next) | ~15 000 estimées |
| Composants React | 25 |
| Routes API (`route.js`) | 47 |
| Pages (`page.js`) | 67 (dont ~35 doublons `/en/`) |
| Tables PostgreSQL | ~20 |
| Migrations SQL | 11 |
| Dépendances directes | 8 |
| Dépendances dev | 7 |
| Tests | 0 |
| Langages détectés | JavaScript, SQL, CSS |
| TypeScript | Absent |
| Plus grand fichier | `AdminDashboard.js` — 5 691 lignes |
| Intégrations externes actives | 7 (Supabase, Anthropic, OpenAI, Resend, LinkedIn, GA4, Vercel Analytics) |
| Déploiement | Vercel, région Paris cdg1 |
| Environnements | 1 (production uniquement) |
