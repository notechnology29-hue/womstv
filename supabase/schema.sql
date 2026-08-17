create extension if not exists "uuid-ossp";

create table if not exists public.shows (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  slug text not null unique,
  meta text,
  description text,
  mux_playback_id text,
  featured boolean not null default false,
  tags text[] not null default '{}',
  cast text[] not null default '{}',
  director text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_shows_featured
  on public.shows (featured, created_at desc);

create index if not exists idx_shows_slug
  on public.shows (slug);

create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_shows_updated_at on public.shows;

create trigger trg_shows_updated_at
before update on public.shows
for each row
execute function public.handle_updated_at();

alter table public.shows enable row level security;

create policy "Anyone can read shows"
  on public.shows for select
  using (true);

create policy "Authenticated users can insert shows"
  on public.shows for insert
  with check (auth.role() = 'authenticated');

create policy "Authenticated users can update shows"
  on public.shows for update
  using (auth.role() = 'authenticated');

create policy "Authenticated users can delete shows"
  on public.shows for delete
  using (auth.role() = 'authenticated');
