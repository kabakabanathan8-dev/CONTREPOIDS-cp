-- CONTREPOIDS Agency & Print — schéma de départ Supabase
-- À exécuter dans Supabase > SQL Editor après création d'un projet.
-- La politique interdit l'accès public direct. Les insertions doivent passer par
-- une fonction serveur/Edge Function qui valide et nettoie les champs.

create table if not exists public.contact_requests (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 120),
  phone text check (phone is null or char_length(phone) <= 40),
  service text not null check (char_length(service) between 2 and 120),
  message text not null check (char_length(message) between 2 and 3000),
  status text not null default 'nouveau'
    check (status in ('nouveau', 'en_cours', 'traite', 'archive')),
  created_at timestamptz not null default now()
);

alter table public.contact_requests enable row level security;

-- Aucun accès direct anonyme ou authentifié n'est accordé ici.
-- Ajoutez les politiques nécessaires seulement après avoir configuré
-- l'authentification et un endpoint serveur sécurisé.

create table if not exists public.site_events (
  id uuid primary key default gen_random_uuid(),
  session_id text not null check (char_length(session_id) between 8 and 100),
  event_name text not null check (char_length(event_name) between 1 and 80),
  page_path text not null check (char_length(page_path) between 1 and 300),
  created_at timestamptz not null default now()
);

alter table public.site_events enable row level security;

-- Par défaut, aucune politique publique : les événements doivent également
-- être envoyés via un endpoint serveur sécurisé. Évitez de collecter des données
-- identifiantes non nécessaires et informez les visiteurs du suivi effectué.
