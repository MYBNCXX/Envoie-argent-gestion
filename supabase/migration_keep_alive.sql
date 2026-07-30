-- Table dédiée uniquement au ping "keep-alive" (évite la pause Supabase free-tier).
-- Ne contient aucune donnée sensible, une seule ligne suffit.
create table if not exists public.keep_alive (
  id int primary key default 1,
  last_ping timestamptz default now(),
  constraint keep_alive_single_row check (id = 1)
);

insert into public.keep_alive (id, last_ping)
values (1, now())
on conflict (id) do nothing;

-- RLS activé mais aucune policy publique : seul le service role (client admin) peut y accéder.
alter table public.keep_alive enable row level security;
