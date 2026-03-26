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
