-- Creator upload pipeline + Admin CMS + Featured Content controller

-- app/admin/page.js and app/admin/actions.js gate access on profiles.role.
-- A `profiles (id uuid pk, role text default 'user')` table already exists
-- in this project; this block only matters for spinning up a fresh database.
-- NOTE: the real table has a check constraint only allowing role in
-- ('artist', 'admin') — there is no 'user' role, which is what broke the
-- auto-provisioning trigger below.
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'artist',
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "Users can read their own profile" on public.profiles;
create policy "Users can read their own profile"
  on public.profiles for select
  using (auth.uid() = id);

-- NOTE: an "after insert on auth.users" trigger that auto-creates a profile
-- row was tried here and removed — it broke every sign-up in this project
-- (createUser returned "Database error creating new user"). Root cause:
-- profiles.role has a check constraint allowing only 'artist'/'admin', and
-- the trigger inserted role='user', which violated it and aborted the
-- entire auth.users insert. Promote accounts to admin manually instead:
--   node scripts/promote-admin.mjs <email>

alter table public.shows
  add column if not exists status text not null default 'pending',
  add column if not exists is_featured boolean not null default false,
  add column if not exists mux_asset_id text,
  add column if not exists mux_playback_id text, -- already present in schema.sql, kept idempotent
  add column if not exists artist_id uuid references auth.users(id) on delete set null,
  add column if not exists genre text,
  add column if not exists poster_url text; -- homepage hero artwork

create index if not exists idx_shows_status on public.shows (status, created_at desc);
create index if not exists idx_shows_artist_id on public.shows (artist_id);
create index if not exists idx_shows_mux_asset_id on public.shows (mux_asset_id);

-- Carry the old is_approved flag over to the new status column so existing
-- rows aren't silently reset to 'pending'.
update public.shows
  set status = 'published'
  where is_approved = true and status = 'pending';

-- Enforce a single featured show at the database level (belt-and-suspenders
-- alongside the server action that flips every other row to false).
create unique index if not exists idx_shows_single_featured
  on public.shows (is_featured)
  where is_featured = true;

-- Tighten RLS now that shows carry an ownership + moderation status.
drop policy if exists "Anyone can read shows" on public.shows;
create policy "Anyone can read published shows or their own"
  on public.shows for select
  using (status = 'published' or auth.uid() = artist_id);

drop policy if exists "Authenticated users can insert shows" on public.shows;
create policy "Creators can insert their own shows"
  on public.shows for insert
  with check (auth.uid() = artist_id);

drop policy if exists "Authenticated users can update shows" on public.shows;
create policy "Creators can update their own shows"
  on public.shows for update
  using (auth.uid() = artist_id)
  with check (auth.uid() = artist_id);

drop policy if exists "Authenticated users can delete shows" on public.shows;
create policy "Creators can delete their own shows"
  on public.shows for delete
  using (auth.uid() = artist_id);

-- Admin approve/deny/feature actions run through the service-role key
-- (see lib/supabase/admin.js) and bypass RLS entirely, so no admin-specific
-- policy is required here.
