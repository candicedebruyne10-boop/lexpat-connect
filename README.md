# LEXPAT Connect MVP

Prototype Next.js pour la plateforme LEXPAT Connect.

## Contenu actuel

- Page d'accueil
- Page Employeurs
- Page Travailleurs
- Page Metiers en penurie
- Page Accompagnement juridique
- Page Contact

## Stack

- Next.js
- React
- CSS global simple

## Lancer le projet

```bash
npm install
npm run dev
```

Le projet demarre ensuite sur `http://localhost:3000`.

## Variables d'environnement

Copier `.env.example` vers `.env.local` si vous connectez ensuite :

- Resend pour les formulaires
- Supabase pour les profils, annonces et comptes
- l'URL publique du site
- Google Analytics 4 via `NEXT_PUBLIC_GA_MEASUREMENT_ID` pour les revisites

## Analytics et IP

- `Vercel Analytics` et `Google Analytics 4` ne se chargent qu'apres acceptation du consentement analytics dans le bandeau cookies.
- Pour activer GA4, ajoutez `NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX`.
- Les formulaires incluent dans l'email recu des metadonnees serveur utiles a la qualification et a l'anti-abus: date de soumission, IP publique, user-agent, referer et langue du navigateur.
- Si vous stockez ou exploitez l'IP de facon systematique, il faut l'assumer dans votre documentation RGPD et votre politique de confidentialite.

## Prochaines etapes conseillees

1. Connecter les formulaires a Resend ou Supabase.
2. Completer les mentions legales, RGPD et cookies avant publication publique.
3. Ajouter une vraie couche de donnees pour employeurs, candidats et annonces.
4. Brancher le projet a GitHub puis le deployer sur Vercel.

## Deploiement Vercel

- Creer un repo GitHub
- Importer le repo dans Vercel
- Configurer les variables d'environnement
- Ajouter le domaine ou sous-domaine final

## Important

La plateforme facilite la mise en relation. Les prestations juridiques doivent rester presentees separement comme relevant du cabinet LEXPAT.
