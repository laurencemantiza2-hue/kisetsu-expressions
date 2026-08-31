# Admin editor setup

The admin page is available at `/admin`. It lets an approved editor change the homepage hero text and image, featured images, approved colors, font choice, and heading size.

## One-time Supabase setup

1. In Supabase, open **SQL Editor** and run the complete contents of `supabase/setup.sql`.
2. In **Authentication > URL Configuration**, set the Site URL to the final Vercel domain. Add these Redirect URLs:
   - `http://localhost:5173/admin`
   - `https://YOUR-VERCEL-DOMAIN/admin`
   - `https://YOUR-CUSTOM-DOMAIN/admin` (if you use one)
3. In **Authentication > Providers > Email**, make sure Email is enabled. The editor signs in through a secure email link; no shared password is needed.

## First editor

`kisetsu.expression@gmail.com` is included in `supabase/setup.sql`. After the SQL setup has run, give the client the `/admin` link. They enter this email once, use the secure link sent to their inbox, and can then edit the website.

To add another editor later, add their email to the list inside `approve_known_editor()` in `supabase/setup.sql`, then run the updated function and trigger section in Supabase SQL Editor.

## Security notes

- The public key in `.env.local` is safe to expose in a browser. Row Level Security restricts writes to approved editors.
- Never commit `.env.local`, and never use a Supabase `service_role` or secret key in this Vite website.
- Add another editor by repeating the same SQL statement with their email.
