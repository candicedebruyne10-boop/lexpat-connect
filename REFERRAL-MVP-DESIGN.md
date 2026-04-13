# Système de parrainage MVP — LEXPAT Connect
> Document de conception et d'implémentation · Avril 2026

---

## PARTIE 1 — RECOMMANDATION NETTE

### Approche retenue : Lien de parrainage + code URL + fallback champ manuel

**Architecture hybride à deux niveaux :**

1. **Niveau 1 (principal)** : lien de parrainage unique avec paramètre `?ref=CODE`
   → ex. `https://lexpat-connect.be/inscription?ref=LP-A7K2MN`

2. **Niveau 2 (fallback)** : champ manuel dans le formulaire d'inscription
   → "Qui vous a recommandé LEXPAT Connect ? (code ou prénom + nom)"

### Pourquoi ce choix maintenant

Le lien est la méthode la plus fiable en early stage : il est traçable à 100% côté serveur, il ne dépend d'aucune saisie, et il est naturel à partager par WhatsApp, email ou LinkedIn. Le champ manuel est le filet de sécurité pour les cas où le lien n'a pas été cliqué mais la recommandation a bien eu lieu (voisin, collègue, conversation orale).

### Ce qu'on gagne

- Attribution automatique sans effort côté filleul
- Persistance du code en cookie (30 jours) → résistant au délai entre clic et inscription
- UX irréprochable : le filleul arrive sur le formulaire avec le champ pré-rempli
- Côté admin : traçabilité parfaite, source d'attribution claire

### Ce qu'on sacrifie

- Pas de tableau de bord gamifié pour le parrain (pour l'instant)
- Pas de codes promotionnels ou de campagnes marketing avancées
- Pas de multi-parrainage ou de leaderboard

### Ce qu'on pourra améliorer plus tard

- Ajouter des QR codes pour les événements physiques
- Ajouter une logique de récompense (badge, priorité dans les matchings)
- Permettre à l'admin de créer des codes de campagne (ex: `MINGA2026`)
- Analytics Vercel enrichis sur les conversions par parrain

---

## PARTIE 2 — EXPÉRIENCE UTILISATEUR

### A. Côté membre actuel (parrain)

**Où il trouve son lien :**
Dans son espace travailleur (`/travailleurs/espace`), une section "Parrainage" apparaît en bas du tableau de bord avec son lien personnel et un bouton "Copier".

**Ce qu'il voit :**
```
🎁 Invitez un contact sur LEXPAT Connect
Votre lien personnel : https://lexpat-connect.be/inscription?ref=LP-A7K2MN
[Copier le lien]   [Partager par email]

Vos filleuls : 3 invités · 2 inscrits · 1 profil visible
```

**Message qu'il peut copier (voir Bonus) :**
Inclus dans la bannière, prêt à copier.

### B. Côté nouveau talent (filleul)

**Si il arrive via lien :**
1. Le paramètre `?ref=CODE` est lu dès l'arrivée sur la page d'inscription
2. Le code est stocké en cookie (`lexpat_ref`, 30 jours) + localStorage (`lexpat_ref`)
3. Le champ "Qui vous a recommandé ?" est automatiquement rempli et verrouillé (lecture seule avec message : "Lien de parrainage détecté ✓")
4. Après inscription, le parrainage est attribué automatiquement sans action supplémentaire

**Si il arrive sans lien :**
Le champ "Qui vous a recommandé ?" est affiché vide, facultatif, avec le placeholder :
`Prénom et nom de votre contact, ou code de parrainage (ex : LP-A7K2MN)`

**Si il oublie le code :**
Il peut saisir le prénom + nom de la personne. L'API fait une recherche approximative dans les profils (full_name insensible à la casse). Si aucun résultat exact → statut "à vérifier manuellement" côté admin.

**Si le cookie a expiré ou changement d'appareil :**
Le champ est vide. On affiche un message doux : "Vous avez été recommandé ? Indiquez le nom ou le code de votre contact."

### C. Côté admin

**Où il voit les parrainages :**
Onglet "Parrainages" dans le tableau de bord admin (`/admin`), avec vue tabulaire.

**Colonnes de la vue admin :**
| Parrain | Filleul | Source | Statut | Inscrit le | Profil visible |
|---------|---------|--------|--------|-----------|----------------|

**Actions disponibles :**
- Filtrer par statut (pending / registered / profile_visible / validated / invalid)
- Valider manuellement un parrainage ambigu
- Invalider avec note
- Exporter CSV

---

## PARTIE 3 — LOGIQUE MÉTIER

### Identification du parrain

Un parrain est identifié par son `referral_code` unique (ex: `LP-A7K2MN`), généré automatiquement à la création de son compte (rôle worker uniquement). Ce code est stocké dans `worker_profiles.referral_code`.

### Moment d'attribution

Le parrainage est attribué **au moment du bootstrap** (`/api/auth/bootstrap`), juste après la création du compte Supabase. C'est le premier moment où on dispose d'un `user_id` confirmé pour le filleul.

### Événements comptables

| Événement | Moment | Statut résultant |
|-----------|--------|-----------------|
| `referral_link_clicked` | Arrivée sur /inscription avec ?ref= | — (pre-signup) |
| `signup_started` | Ouverture formulaire | — |
| `signup_completed` | Création compte Supabase réussie | `pending` → `registered` |
| `referral_attributed` | Bootstrap avec code valide | `registered` |
| `profile_completed` | completion >= 70% | `profile_completed` |
| `profile_visible` | profile_visibility = 'visible' | `profile_visible` |
| `referral_validated` | Validation admin | `validated` |

### Règle de priorité si plusieurs sources

**Ordre strict :**
1. Cookie `lexpat_ref` (lien cliqué) → source `link`
2. Code saisi dans le champ → source `manual_code`
3. Nom saisi dans le champ (lookup) → source `manual_name`
4. Aucun → pas de parrainage

La première source valide gagne. On ne surécrit pas une attribution existante.

### Gestion des doublons

Si un `referral` existe déjà pour ce `referee_user_id` avec statut > `pending`, on n'en crée pas un nouveau. On log l'événement et on continue sans erreur.

### Empêcher l'auto-parrainage

Au moment de l'attribution : si `referrer_user_id === referee_user_id`, on rejette silencieusement et on log `status = 'invalid'` avec note "auto-parrainage détecté".

### Erreurs de saisie (faute dans le nom)

Si la recherche par nom échoue (aucun résultat exact ou >1 résultat) : on crée le referral avec `status = 'pending_review'` et `referrer_name_input = [ce qui a été saisi]`. L'admin voit l'entrée comme "à vérifier".

### Utilisateur déjà existant

Si l'email est déjà en base au moment de l'inscription → Supabase bloque avec une erreur `User already registered`. Pas de parrainage créé, pas d'erreur silencieuse. L'admin ne voit rien.

### Changement d'email

Si un utilisateur change d'email après inscription, le parrainage reste attaché à son `user_id` (non à son email). Aucun impact.

### Plusieurs clics sur plusieurs liens

Le dernier cookie écrit gagne. Si l'utilisateur clique sur le lien de Marie puis sur le lien de Paul, c'est Paul qui est crédité (cookie écrasé). C'est acceptable pour le MVP. On logge les deux clics pour audit.

---

## PARTIE 4 — DONNÉES ET TRACKING

### Champ ajouté à `worker_profiles`

| Champ | Type | Utilité | Obligatoire |
|-------|------|---------|-------------|
| `referral_code` | TEXT UNIQUE | Code personnel du membre parrain | Non (généré auto) |
| `referred_by_referral_id` | UUID FK | Lien vers le referral qui a parrainé ce worker | Non |

### Table `referrals`

| Champ | Type | Utilité | Obligatoire |
|-------|------|---------|-------------|
| `id` | UUID PK | Identifiant | Oui |
| `referrer_user_id` | UUID FK auth.users | Le parrain | Oui |
| `referrer_worker_profile_id` | UUID FK worker_profiles | Profil du parrain | Non |
| `referee_user_id` | UUID FK auth.users | Le filleul (post-inscription) | Non |
| `referee_worker_profile_id` | UUID FK worker_profiles | Profil du filleul | Non |
| `referral_code` | TEXT | Code utilisé | Oui |
| `attribution_source` | TEXT | `link` / `manual_code` / `manual_name` / `unknown` | Oui |
| `referrer_name_input` | TEXT | Ce que le filleul a saisi (si manuel) | Non |
| `status` | TEXT | `pending` / `pending_review` / `registered` / `profile_completed` / `profile_visible` / `validated` / `invalid` | Oui |
| `attributed_at` | TIMESTAMPTZ | Quand le parrainage a été lié à un user_id | Non |
| `registered_at` | TIMESTAMPTZ | Quand le filleul s'est inscrit | Non |
| `profile_completed_at` | TIMESTAMPTZ | Quand le profil a atteint 70%+ | Non |
| `profile_visible_at` | TIMESTAMPTZ | Quand le profil est devenu visible | Non |
| `validated_at` | TIMESTAMPTZ | Validation admin | Non |
| `admin_notes` | TEXT | Notes libres admin | Non |
| `created_at` | TIMESTAMPTZ | Création | Oui |
| `updated_at` | TIMESTAMPTZ | Mise à jour | Oui |

### Table `referral_events`

| Champ | Type | Utilité | Obligatoire |
|-------|------|---------|-------------|
| `id` | UUID PK | Identifiant | Oui |
| `referral_id` | UUID FK | Lien vers referral si connu | Non |
| `event_type` | TEXT | Type d'événement | Oui |
| `referral_code` | TEXT | Code utilisé | Non |
| `attribution_source` | TEXT | Source d'attribution | Non |
| `raw_input` | TEXT | Input brut si saisie manuelle | Non |
| `referrer_user_id` | UUID | Parrain si connu | Non |
| `referee_user_id` | UUID | Filleul si connu | Non |
| `metadata` | JSONB | Données contextuelles supplémentaires | Non |
| `created_at` | TIMESTAMPTZ | Timestamp | Oui |

### Événements minimaux à tracker

| Événement | Source | Données clés |
|-----------|--------|-------------|
| `referral_link_clicked` | Client (cookie set) | referral_code, timestamp, user_agent |
| `signup_started` | Client | referral_code si présent |
| `signup_completed` | Bootstrap API | referee_user_id, referral_code, source |
| `referral_attributed` | Bootstrap API | referral_id, referrer_user_id, referee_user_id |
| `profile_completed` | Profile API | referee_user_id, completion_score |
| `profile_visible` | Profile API | referee_user_id |
| `referral_validated` | Admin API | referral_id, admin action |

---

## PARTIE 5 — IMPLÉMENTATION TECHNIQUE SUR VERCEL

### Fichiers créés ou modifiés

```
supabase/
  007_referral_system.sql          ← NOUVEAU : migrations SQL complètes

lib/
  referral.js                      ← NOUVEAU : logique métier centrale

app/api/
  referral/
    generate/route.js              ← NOUVEAU : générer code parrain
    validate/route.js              ← NOUVEAU : valider code/nom saisi
    my-referrals/route.js          ← NOUVEAU : filleuls du parrain connecté
  admin/
    referrals/route.js             ← NOUVEAU : vue admin parrainages

components/
  ReferralBanner.js                ← NOUVEAU : bannière WorkerSpace
  ReferralInput.js                 ← NOUVEAU : champ dans formulaire

components/AuthForm.js             ← MODIFIÉ : lecture ?ref= + champ parrainage
app/api/auth/bootstrap/route.js   ← MODIFIÉ : capture et attribution referral
components/WorkerSpace.js          ← MODIFIÉ : intégration ReferralBanner
components/AdminDashboard.js       ← MODIFIÉ : onglet Parrainages
```

### Persistance du referrer entre visite et inscription

```
1. Utilisateur clique sur https://lexpat-connect.be/inscription?ref=LP-A7K2MN
2. AuthForm.js lit le param ?ref= à l'effet useEffect (côté client)
3. Stockage dual-write :
   - cookie: lexpat_ref=LP-A7K2MN; max-age=2592000; SameSite=Lax; path=/
   - localStorage: { key: 'lexpat_ref', code: 'LP-A7K2MN', ts: Date.now() }
4. Le champ du formulaire est pré-rempli et verrouillé
5. À l'inscription, le code est envoyé dans le body du POST /api/auth/bootstrap
6. Si le délai > 0 (retour plus tard) : la lecture prioritise cookie > localStorage > param URL
```

### Protections anti-fraude minimales

- Empêcher l'auto-parrainage (check serveur : referrer_user_id !== referee_user_id)
- Rate limiting sur `/api/referral/generate` : max 3 appels/minute/user
- Un seul referral par filleul (unique constraint sur referee_user_id dans referrals)
- Les codes sont opaques (8 chars aléatoires) et non-devinables
- Pas de récompense automatique → validation admin obligatoire avant tout avantage

### Messages UX à afficher

| Contexte | Message FR | Message EN |
|----------|-----------|-----------|
| Lien détecté | "Lien de parrainage détecté ✓" (champ verrouillé) | "Referral link detected ✓" |
| Code valide (API) | "Parrainage reconnu 🎉" | "Referral recognized 🎉" |
| Code invalide | "Code non reconnu. Laissez vide si vous n'avez pas de code." | "Code not recognized. Leave blank if you don't have one." |
| Nom ambigu | "Nom non trouvé exactement. Notre équipe vérifiera." | "Name not found exactly. Our team will verify." |
| Auto-parrainage | "Vous ne pouvez pas vous parrainer vous-même." | "You cannot refer yourself." |

---

## PARTIE 6 — PLAN D'EXÉCUTION

### Niveau 1 : MVP en 24h

**Inclus :**
- Migration SQL (referral_code dans worker_profiles + table referrals basique)
- Génération automatique du code parrain à la création du compte worker
- Lecture du param `?ref=` dans AuthForm + stockage cookie
- Envoi du code dans le bootstrap + attribution basique
- Bannière simple dans WorkerSpace avec le lien à copier
- Route `/api/referral/my-referrals` avec comptage brut

**Exclus :**
- Champ manuel (fallback nom)
- Table referral_events
- Vue admin complète
- Emails de notification

**Dépendances :**
- Accès Supabase (migration SQL)
- Variables d'env Resend (optionnel à ce stade)

**Risques :**
- Le code de parrainage ne se génère pas si le bootstrap fail → ajouter retry
- Les cookies peuvent être bloqués (navigateurs restrictifs) → localStorage en backup

**Définition du "done" :**
Un membre inscrit peut copier son lien → un nouveau talent arrive via ce lien → l'inscription crédite le parrain → le parrain voit "+1 filleul inscrit" dans son espace.

---

### Niveau 2 : Version propre en 3 jours

**Inclus :**
- Tout le niveau 1
- Champ manuel dans le formulaire (code OU prénom + nom)
- Validation côté API du code saisi (route `/api/referral/validate`)
- Table `referral_events` complète
- Mise à jour du statut quand le profil passe à `visible`
- Email de notification au parrain quand son filleul s'inscrit
- Onglet "Parrainages" dans l'admin avec vue tabulaire

**Exclus :**
- Export CSV
- Logique de récompense ou priorité
- Analytics avancés

**Risques :**
- Lookup par nom approximatif peut générer des faux positifs → limiter à exact match pour MVP

**Définition du "done" :**
Tous les cas limites couverts (cf. liste ci-dessous). L'admin peut voir et agir sur chaque parrainage.

---

### Niveau 3 : Version solide en 7 jours

**Inclus :**
- Tout le niveau 2
- Export CSV des parrainages depuis l'admin
- Email de rappel J+3 au parrain si son filleul n'a pas complété son profil
- KPI dashboard (vue journalière)
- RLS Supabase affinée pour la table referrals
- Tests de régression manuels sur tous les cas limites
- Monitoring d'erreurs (console.error + log structuré)

**Définition du "done" :**
Système stable en production, observable, avec un process admin documenté.

---

## BONUS

### 1. Texte UX optimisé pour le formulaire

**Libellé du champ :**
> Vous avez été recommandé(e) ?

**Placeholder :**
> Prénom et nom de votre contact, ou son code (ex : LP-A7K2MN)

**Texte d'aide sous le champ :**
> Facultatif · Aide à reconnaître votre recommandation

**Pourquoi cette formulation :** "Vous avez été recommandé(e) ?" est une question directe qui crée un lien émotionnel avec la recommandation, sans jargon technique. Elle est plus engageante que "Qui vous a recommandé ?" et évite la confusion entre parrain/filleul pour les non-initiés.

---

### 2. Message de partage pour le parrain

**Version courte (WhatsApp / SMS) :**
```
👋 Je suis sur LEXPAT Connect, une plateforme belge pour trouver un emploi en Belgique si tu es travailleur international qualifié.

Ça vaut vraiment le coup de créer un profil — les employeurs cherchent des profils comme le tien.

Inscris-toi directement via mon lien : https://lexpat-connect.be/inscription?ref=LP-XXXX
```

**Version email / LinkedIn :**
```
Bonjour [Prénom],

Je pense à toi en voyant LEXPAT Connect — c'est une plateforme belge qui met en relation des employeurs et des talents internationaux, en particulier pour les métiers en pénurie et les dossiers de permis unique.

Si tu cherches à travailler en Belgique ou si tu veux structurer ta recherche d'emploi, je te conseille de créer un profil. C'est gratuit, et les profils visibles sont directement proposés aux employeurs.

Mon lien d'invitation : https://lexpat-connect.be/inscription?ref=LP-XXXX

N'hésite pas si tu as des questions, je suis passé par là aussi.

Bonne chance,
[Ton prénom]
```

---

### 3. Message admin si parrainage invalide

**Template admin :**
```
⚠️ Parrainage invalide — Action requise

Filleul : [email du filleul]
Parrain saisi : [ce que le filleul a saisi]
Source : saisie manuelle (nom)
Date : [date]

Raison probable : nom non trouvé en base, ou faute d'orthographe.

Actions possibles :
→ [Valider manuellement] en sélectionnant le bon parrain
→ [Invalider] si la recommandation ne peut pas être vérifiée
→ [Contacter le filleul] pour demander le bon code

Note : aucune récompense ne sera déclenchée tant que ce parrainage est au statut "pending_review".
```

---

### 4. KPI minimum à suivre chaque matin

| Métrique | Comment | Seuil d'alerte |
|----------|---------|----------------|
| Nouveaux liens cliqués (J-1) | COUNT referral_events WHERE event_type = 'referral_link_clicked' | < 0 = normal, surveiller tendance |
| Nouveaux inscrits via parrainage (J-1) | COUNT referrals WHERE registered_at > yesterday | Alerter si chute soudaine |
| Taux conversion clic→inscription | registered / clicked | < 15% = UX à revoir |
| Filleuls avec profil visible | COUNT WHERE status = 'profile_visible' | KPI de qualité |
| Parrainages en attente de validation | COUNT WHERE status = 'pending_review' | > 5 = action admin requise |
| Top 3 parrains du mois | GROUP BY referrer_user_id, ORDER BY count DESC | Pour identifier ambassadeurs |

---

## CAS LIMITES COUVERTS

| Cas | Traitement |
|-----|-----------|
| Clic lien → inscription plus tard | Cookie 30 jours + localStorage. Si cookie valide au moment du bootstrap → attribution OK |
| Arrivée sans lien mais saisie nom | Lookup exact (insensible casse) dans worker_profiles.full_name. Si trouvé → attribution `manual_name`. Sinon → `pending_review` |
| Faute d'orthographe dans le nom | Statut `pending_review`, champ `referrer_name_input` conservé, admin valide |
| Deux parrains revendiquent le même filleul | Premier attribué gagne (unique constraint referee_user_id). Second ignoré + logué |
| Filleul déjà en base | Supabase retourne erreur `User already registered` → pas de parrainage créé |
| Parrain recommande son propre email | Check serveur referrer_user_id !== referee_user_id → rejeté, log `invalid` |
| Filleul ne complète pas son profil | Statut reste `registered`. Admin voit. Pas de récompense déclenchée |
| Filleul profil rempli mais non visible | Statut `profile_completed`, pas `profile_visible`. Admin voit la distinction |
| Cookie expiré | Fallback localStorage (même durée). Si expiré aussi → champ vide, saisie manuelle |
| Changement d'appareil avant inscription | Cookie perdu. Si localStorage aussi perdu → champ vide. User peut saisir le code manuellement |

---

## Ma recommandation MVP

**Lien `?ref=CODE` + cookie 30 jours + fallback champ manuel.**

C'est la seule approche qui combine : attribution automatique fiable (lien), résilience au délai (cookie), et filet de sécurité humain (champ). Elle est implémentable en 24h, compréhensible par l'admin, et n'introduit aucune dépendance externe.

## Ce que je coderais aujourd'hui

1. La migration SQL (referral_code dans worker_profiles, table referrals)
2. La génération automatique du code dans le bootstrap
3. La lecture du `?ref=` dans AuthForm + stockage cookie/localStorage
4. L'envoi du code dans le bootstrap + création du referral
5. La bannière WorkerSpace avec le lien + message copiable

## Ce que je repousserais à plus tard

- Le champ manuel avec lookup par nom (J+2)
- La vue admin complète avec filtres (J+3)
- Les emails de notification parrain (J+3)
- L'export CSV (J+7)
- La logique de récompense (après validation business)
