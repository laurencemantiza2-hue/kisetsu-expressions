-- Run this in Supabase Dashboard > SQL Editor AFTER supabase/setup.sql has already been run once.
-- Safe to run more than once (uses "if not exists" / "or replace" / "drop ... if exists" everywhere).
--
-- This adds:
--   1. A real `paintings` table so the admin can add/edit/delete paintings from the live site.
--   2. A storage DELETE policy on the existing `site-images` bucket (needed so an admin can
--      remove an image, not just upload/replace one).

-- =========================================================
-- 1. PAINTINGS TABLE
-- =========================================================

create table if not exists public.paintings (
  id uuid primary key default gen_random_uuid(),
  title text not null default 'Untitled painting',
  description text not null default '',
  price_text text not null default '',
  category text not null default '',
  status text not null default 'available', -- 'available' | 'sold' | 'reserved' | 'hidden'
  image_url text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.paintings enable row level security;

-- Public visitors can see every painting except ones the admin has marked "hidden".
drop policy if exists "Public can view visible paintings" on public.paintings;
create policy "Public can view visible paintings"
on public.paintings for select
using (status <> 'hidden');

-- Approved admins can see everything, including hidden paintings.
drop policy if exists "Admins can view all paintings" on public.paintings;
create policy "Admins can view all paintings"
on public.paintings for select
using (exists (select 1 from public.admin_users where user_id = auth.uid()));

drop policy if exists "Admins can add paintings" on public.paintings;
create policy "Admins can add paintings"
on public.paintings for insert to authenticated
with check (exists (select 1 from public.admin_users where user_id = auth.uid()));

drop policy if exists "Admins can update paintings" on public.paintings;
create policy "Admins can update paintings"
on public.paintings for update to authenticated
using (exists (select 1 from public.admin_users where user_id = auth.uid()))
with check (exists (select 1 from public.admin_users where user_id = auth.uid()));

drop policy if exists "Admins can delete paintings" on public.paintings;
create policy "Admins can delete paintings"
on public.paintings for delete to authenticated
using (exists (select 1 from public.admin_users where user_id = auth.uid()));

-- Keep updated_at current automatically.
create or replace function public.set_painting_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_painting_updated_at on public.paintings;
create trigger set_painting_updated_at
  before update on public.paintings
  for each row execute procedure public.set_painting_updated_at();

-- =========================================================
-- 2. STORAGE: allow approved admins to delete images
-- =========================================================
-- (setup.sql already created the bucket + public read + admin insert/update policies.)

drop policy if exists "Approved admins can delete site images" on storage.objects;
create policy "Approved admins can delete site images"
on storage.objects for delete to authenticated
using (
  bucket_id = 'site-images'
  and exists (select 1 from public.admin_users where user_id = auth.uid())
);
