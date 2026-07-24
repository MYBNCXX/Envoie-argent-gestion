-- À exécuter dans l'éditeur SQL de votre projet Supabase.

create table if not exists users (
  username text primary key,
  password text not null,
  role text not null check (role in ('admin', 'superadmin')),
  quota integer not null default 0,
  quota_initial integer not null default 0,
  links_generated integer not null default 0,
  created_at bigint not null default 0
);

create table if not exists links (
  id text primary key,
  nom text not null,
  prenom text not null,
  montant_total numeric not null,
  numero text not null,
  reseau text not null,
  montant numeric not null,
  frais_dossier numeric not null,
  devise text not null default 'XOF',
  motif text not null,
  code text not null,
  created_by text not null references users(username),
  viewed boolean not null default false,
  viewed_at bigint,
  validated boolean not null default false,
  validated_at bigint,
  created_at bigint not null
);

-- Migration : si la table `links` existe déjà (base déployée avant l'ajout
-- de la devise), cette instruction ajoute la colonne sans rien casser.
alter table links add column if not exists devise text not null default 'XOF';

-- Compte super administrateur de démonstration
insert into users (username, password, role, quota, quota_initial, links_generated, created_at)
values ('admin', 'admin123', 'superadmin', 0, 0, 0, 0)
on conflict (username) do nothing;

-- RLS activé, sans policy : seule la clé "service role" (utilisée uniquement
-- côté serveur, dans les routes API) peut lire/écrire. La clé publique
-- (anon) n'a aucun accès direct à ces tables.
alter table users enable row level security;
alter table links enable row level security;
