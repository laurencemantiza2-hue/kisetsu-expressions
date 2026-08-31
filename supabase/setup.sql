-- Run this once in Supabase Dashboard > SQL Editor.
-- Before running the last statement, replace the email with the client's email.

create table if not exists public.site_settings (
  id text primary key default 'default',
  content jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

insert into public.site_settings (id, content)
values ('default', '{}'::jsonb)
on conflict (id) do nothing;

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

-- Automatically approve the client's editor account after their first magic-link sign-in.
-- Add more approved email addresses to this list when needed.
create or replace function public.approve_known_editor()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  if new.email in ('kisetsu.expression@gmail.com') then
    insert into public.admin_users (user_id)
    values (new.id)
    on conflict do nothing;
  end if;
  return new;
end;
$$;

drop trigger if exists approve_known_editor_on_signup on auth.users;
create trigger approve_known_editor_on_signup
  after insert on auth.users
  for each row execute procedure public.approve_known_editor();

alter table public.site_settings enable row level security;
alter table public.admin_users enable row level security;

create policy "Anyone can view published site settings"
on public.site_settings for select using (true);

create policy "Approved admins can update site settings"
on public.site_settings for update
using (exists (select 1 from public.admin_users where user_id = auth.uid()))
with check (exists (select 1 from public.admin_users where user_id = auth.uid()));

create policy "Approved admins can create site settings"
on public.site_settings for insert
with check (exists (select 1 from public.admin_users where user_id = auth.uid()));

create policy "Users can see whether they are an admin"
on public.admin_users for select
using (user_id = auth.uid());

insert into storage.buckets (id, name, public)
values ('site-images', 'site-images', true)
on conflict (id) do update set public = true;

create policy "Anyone can view site images"
on storage.objects for select using (bucket_id = 'site-images');

create policy "Approved admins can upload site images"
on storage.objects for insert to authenticated
with check (
  bucket_id = 'site-images'
  and exists (select 1 from public.admin_users where user_id = auth.uid())
);

create policy "Approved admins can update site images"
on storage.objects for update to authenticated
using (
  bucket_id = 'site-images'
  and exists (select 1 from public.admin_users where user_id = auth.uid())
);

-- `kisetsu.expression@gmail.com` is automatically approved on their first magic-link sign-in.
