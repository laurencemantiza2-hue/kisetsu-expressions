# Website editor (`/admin`)

`/admin` shows the exact same public website — same layout, same design, same
components. It is **not** a separate dashboard. When an approved editor signs
in on `/admin`, the website itself becomes editable in place:

- **Text**: click directly into any editable heading, paragraph, or caption
  and type. Changes save when you click away, and go live once you press
  **Save changes** in the small floating toolbar.
- **Appearance**: switch the toolbar to **Style** mode, then click any
  editable text to open a small panel for font family, size, weight, text
  color, and background color for that element.
- **Images**: hover the hero image or any of the four featured-category
  images and use **Change image** to upload a replacement straight to
  Supabase Storage — no source code editing, no hard-coded URLs.
- **Paintings**: the Paintings section is backed by a real Supabase table.
  Each painting in the gallery gets a small **Edit** button (title,
  description, price, category, availability, image, delete), and there's a
  discreet **+ Add painting** tile to add a new one. Every change here saves
  immediately — no separate "Save" step needed for paintings.

Visitors on `/` never see any of this — the editing affordances only render
for an authenticated, approved admin viewing `/admin`.

## One-time Supabase setup

1. In Supabase, open **SQL Editor** and run the complete contents of
   `supabase/setup.sql` (creates `site_settings`, `admin_users`, and the
   `site-images` storage bucket with RLS).
2. Then run `supabase/paintings-and-editor-update.sql` (creates the
   `paintings` table with its own RLS, and adds the storage "delete" policy
   the editor needs to remove images). This file is additive and safe to run
   more than once.
3. In **Authentication > URL Configuration**, set the Site URL to the final
   Vercel domain. Add these Redirect URLs:
   - `http://localhost:5173/admin`
   - `https://YOUR-VERCEL-DOMAIN/admin`
   - `https://YOUR-CUSTOM-DOMAIN/admin` (if you use one)
4. In **Authentication > Providers > Email**, make sure Email is enabled.
   The editor signs in through a secure email link; no shared password is
   needed.

## First editor

`kisetsu.expression@gmail.com` is included in `supabase/setup.sql`. After the
SQL setup has run, give the client the `/admin` link. They enter this email
once, use the secure link sent to their inbox, and can then edit the website.

To add another editor later, add their email to the list inside
`approve_known_editor()` in `supabase/setup.sql`, then re-run that function
and trigger section in the SQL Editor.

## What "Paintings" looked like before this update

Previously the Paintings section showed a single hard-coded placeholder
image/description with no way to manage it. After running
`paintings-and-editor-update.sql`, that placeholder is gone — the section
starts empty until an admin adds real paintings via `/admin`. Nothing was
invented on the admin's behalf; add your real paintings whenever you're
ready.

## Security notes

- The public key in `.env.local` is safe to expose in a browser. Row Level
  Security restricts writes to approved editors for both `site_settings` and
  `paintings`, and restricts storage uploads/deletes the same way.
- Never commit `.env.local`, and never use a Supabase `service_role` or
  secret key in this Vite website.
- Visiting `/admin` without being signed in and approved shows a sign-in
  gate, not editable content — the URL alone grants no access.
