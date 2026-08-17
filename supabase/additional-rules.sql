create extension if not exists "uuid-ossp";

create table if not exists public.artists (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade,
  name text not null,
  bio text,
  region text,
  genre text,
  avatar_url text,
  verified boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.uploads (
  id uuid primary key default uuid_generate_v4(),
  artist_id uuid references public.artists(id) on delete cascade,
  title text not null,
  description text,
  media_type text not null default 'video',
  mux_playback_id text,
  status text not null default 'draft',
  featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.subscriptions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade,
  plan text not null default 'free',
  status text not null default 'active',
  started_at timestamptz not null default now(),
  ends_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_artists_user_id on public.artists (user_id);
create index if not exists idx_uploads_artist_id on public.uploads (artist_id);
create index if not exists idx_uploads_featured on public.uploads (featured, created_at desc);
create index if not exists idx_subscriptions_user_id on public.subscriptions (user_id);

create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_artists_updated_at on public.artists;
drop trigger if exists trg_uploads_updated_at on public.uploads;
drop trigger if exists trg_subscriptions_updated_at on public.subscriptions;

create trigger trg_artists_updated_at
before update on public.artists
for each row
execute function public.handle_updated_at();

create trigger trg_uploads_updated_at
before update on public.uploads
for each row
execute function public.handle_updated_at();

create trigger trg_subscriptions_updated_at
before update on public.subscriptions
for each row
execute function public.handle_updated_at();

alter table public.artists enable row level security;
alter table public.uploads enable row level security;
alter table public.subscriptions enable row level security;

create policy "Anyone can read verified artists"
on public.artists for select
using (verified = true or auth.uid() = user_id);

create policy "Users can insert their own artist profile"
on public.artists for insert
with check (auth.uid() = user_id);

create policy "Users can update their own artist profile"
on public.artists for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete their own artist profile"
on public.artists for delete
using (auth.uid() = user_id);

create policy "Anyone can read public uploads"
on public.uploads for select
using (status = 'published' or status = 'live' or featured = true or auth.uid() = (
  select artist_id from public.artists where user_id = auth.uid()
));

create policy "Artists can insert their own uploads"
on public.uploads for insert
with check (
  artist_id in (
    select id from public.artists where user_id = auth.uid()
  )
);

create policy "Artists can update their own uploads"
on public.uploads for update
using (
  artist_id in (
    select id from public.artists where user_id = auth.uid()
  )
)
with check (
  artist_id in (
    select id from public.artists where user_id = auth.uid()
  )
);

create policy "Artists can delete their own uploads"
on public.uploads for delete
using (
  artist_id in (
    select id from public.artists where user_id = auth.uid()
  )
);

create policy "Users can read their own subscription"
on public.subscriptions for select
using (auth.uid() = user_id);

create policy "Users can insert their own subscription"
on public.subscriptions for insert
with check (auth.uid() = user_id);

create policy "Users can update their own subscription"
on public.subscriptions for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete their own subscription"
on public.subscriptions for delete
using (auth.uid() = user_id);
