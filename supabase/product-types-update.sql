-- Run this in Supabase Dashboard > SQL Editor AFTER setup.sql and
-- paintings-and-editor-update.sql have already been run.
-- Safe to run more than once.
--
-- WHY: the app already has a working, RLS-protected `paintings` table with
-- image upload/replace/delete, admin-only writes, and public read access.
-- Rather than creating separate `student_paintings` / `tshirts` tables (and
-- duplicating every policy above), this migration adds one `item_type`
-- column so the same table/storage/RLS setup can hold all three catalogs.
-- Existing rows default to 'painting', so nothing already on the live site
-- changes.

alter table public.paintings
  add column if not exists item_type text not null default 'painting';

alter table public.paintings
  drop constraint if exists paintings_item_type_check;

alter table public.paintings
  add constraint paintings_item_type_check
  check (item_type in ('painting', 'student_painting', 'tshirt'));

create index if not exists paintings_item_type_idx on public.paintings (item_type);

-- No RLS changes are needed: the existing policies on public.paintings and
-- on the site-images storage bucket already apply per-row / per-file, not
-- per-category, so they cover student paintings and t-shirts automatically.
