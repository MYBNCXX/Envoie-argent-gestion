# Dossiers & Liens — Suivi de paiement (Next.js + Supabase)

Application Next.js (App Router) pour générer des liens de suivi de
dossiers de paiement, avec administrateurs de lien (inscription libre +
quota attribué par le super administrateur) et une page publique de
validation par code à 4 chiffres. Les données sont stockées dans Supabase
(Postgres).

## 1. Créer le projet Supabase

1. Sur [supabase.com](https://supabase.com), créez un projet.
2. Ouvrez l'éditeur SQL du projet et exécutez le contenu de
   `supabase/schema.sql` (crée les tables `users` et `links`, et insère le
   compte super administrateur de démonstration).
3. Dans **Project Settings → API**, récupérez l'URL du projet et la clé
   **service_role** (pas la clé `anon` — la clé service role est nécessaire
   pour que le serveur puisse lire/écrire sans policy RLS).

## 2. Configurer les variables d'environnement

Copiez `.env.example` vers `.env.local` et renseignez :

```
SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

⚠️ Cette clé reste strictement côté serveur (jamais de préfixe
`NEXT_PUBLIC_`) : elle n'est utilisée que dans les routes API (`app/api/**`),
jamais dans du code exécuté dans le navigateur.

## 3. Démarrer

```bash
npm install
npm run dev
```

Puis ouvrez http://localhost:3000

Compte super administrateur de démonstration :
- Identifiant : `admin`
- Mot de passe : `admin123`

## Fonctionnement

- **Inscription libre** (`/register`) : un administrateur de lien crée son
  propre compte. Son quota démarre à **0** — il ne peut générer aucun lien
  tant que le super administrateur ne lui a pas attribué de quota.
- **Super administrateur** (`/superadmin`) : voit tous les administrateurs
  inscrits, leur quota restant et leur nombre de liens générés, et peut
  leur ajouter du quota directement.
- **Administrateur de lien** (`/admin`) : une fois le quota attribué,
  génère des dossiers (nom, prénom, montant total, numéro, réseau, montant,
  frais de dossier, motif, code à 4 chiffres) et suit leur statut (vu / non
  vu, validé / en attente).
- **Page publique** (`/dossier/[id]`) : le destinataire voit toutes les
  informations renseignées par l'administrateur (nom, prénom, numéro,
  réseau, montant total, montant, motif), avec les **frais du dossier à
  payer** mis en évidence dans un cadre distinct en bas de la fiche. Il
  valide directement avec le code à 4 chiffres — une animation de
  vérification (3 à 5 secondes) précède le résultat (badge de succès ou
  erreur avec possibilité de réessayer).

## Déploiement

Comme les données vivent désormais dans Supabase (et non plus sur le
système de fichiers du serveur), l'application peut être déployée sans
problème sur une plateforme serverless comme Vercel : ajoutez simplement
`SUPABASE_URL` et `SUPABASE_SERVICE_ROLE_KEY` dans les variables
d'environnement du projet déployé.

## Sécurité — à renforcer avant une mise en production réelle

- La session est un simple cookie non chiffré (`lib/auth.js`) : à
  remplacer par une solution de session/JWT signée, ou par Supabase Auth.
- Les mots de passe sont stockés en clair dans la table `users` : à
  remplacer par un hachage (bcrypt/argon2) avant toute mise en production.
