# Kisetsu Expressions — Client meeting update

This is an updated copy of your uploaded project. It has not been deployed and no live database data was changed.

## 1. Apply the combined update in your existing Cursor project

1. Extract this ZIP and open its extracted project folder.
2. Back up the existing project folder you normally use in Cursor.
3. Copy the extracted **src** and **public** folders into that existing project folder, beside package.json. Merge folders and replace matching files when Windows asks.
4. Keep using your existing project in Cursor. Its environment configuration and Git connection remain in place.
5. Run `npm run dev` in Cursor's terminal and open the printed localhost address.
6. Test `/admin` with your existing account before publishing. Saving on localhost uses your configured Supabase database.

No dependency changes or new SQL are needed for this merge. The complete source is included for reference. If you choose a fresh extracted folder instead, copy your existing `.env.local` beside package.json and run `npm install` first.

## 2. What changed

- The header is dark navy with a white tagline and navigation, a light divider, and sticky positioning. On scroll it becomes translucent with a background blur. Carousel images fill the section width. A picture-only carousel starts with Live With Purpose, followed by paintings, creative studio and workshops. It crossfades every 2 seconds, with manual controls and a pause button. Reduced-motion preferences start the carousel paused and disable transitions; Play remains available.
- The complete T-shirt grid is directly below the carousel. The earlier storefront features listed below are retained. No duplicate T-shirt carousel slide is included.
- Live With Purpose is featured first in the T-shirt collection as L.P 01. Its 12 supplied mockups are grouped into four actual shirt/print combinations. No extra artwork was invented.
- Customers select shirt color, print color, adult/kids, size and quantity. Invalid or disabled combinations cannot be chosen. The photo gallery changes with the selection, and WhatsApp includes all selected details and the product code.
- Adult sizes XS–6XL and kids sizes 22–40 match the supplied charts. “Size guide” displays the appropriate chart in centimeters. These are inquiry options, not a claim of live stock availability.
- Live With Purpose prices are blank until you enter them. Its inquiry asks for a price. Original K.E 01–04 prices remain AED 60 adult / AED 55 kids. Uploaded catalog items use their price text or configured per-category prices; no numeric price is inferred from a description.
- Original products use K.E 01–04. Uploaded products receive their own collection codes: titles containing “Live With Purpose” use L.P; other T-shirts use K.E. You can change the prefix/code in Storefront settings. Automatic codes are assigned in creation order, including hidden items. They become permanent when an approved admin saves site content; saved codes remain reserved after deletion. Sorting and hiding saved products does not renumber them.
- MAGNATE uses the supplied original PNG in a larger light-backed display. CSS frames the logo's existing transparent margins without altering its artwork. Website dimensions adapt to the screen rather than guaranteeing a physical two inches.
- A floating green WhatsApp button with a black icon stays in a bottom corner. Scroll prompts are dismissible and are suppressed while public panels are open. “Talk to Us” cycles from navy to cream and back every 1.5 seconds while hovered or keyboard-focused; reduced-motion mode uses a static color change.
- Facebook, telephone and WhatsApp use labeled icon links in the footer. Existing contact destinations are preserved.
- A feedback section accepts inquiries through WhatsApp and displays only approved testimonials. No sample testimonials are included.
- The existing promotion pop-up remains, but waits 12 seconds after content loads. The existing promotion manager, workshop panel, image uploads and catalog editor are retained.

## 3. Admin guide

### Live With Purpose and uploaded T-shirt options

1. Sign in at `/admin` with an already approved email.
2. Click **Storefront** in the editing toolbar.
3. Choose Live With Purpose or an uploaded T-shirt.
4. Set the product code, adult/kids prices and sizes offered. For the featured Live With Purpose item, you can also edit its name, description, visibility and status.
5. Enable color selections if needed. Add actual photos to each available combination, and disable combinations you do not offer. Removing a photo here removes it from the gallery; it does not delete the stored file.
6. Click **Save changes** and wait for the saved message.

To add another product, use the existing T-shirt catalog manager first, then configure its options in Storefront. If you add a differently named collection, explicitly assign a suitable supported K.E or L.P code; this version supports these two requested collections.

If your database already contains this exact Live With Purpose product, choose one listing to keep visible before publishing. The supplied files did not contain live catalog rows, so duplicate detection against the actual database was not possible.

### Carousel

Navigate between slides on `/admin`, pause the slideshow, then use **Change image** on the selected slide. Save using the admin toolbar. Carousel images have separate settings from product photos and the lower offering sections, so changing a banner does not alter a product gallery. The supplied banners are approximately 16:9 PNG files, not exact 1920 × 1080 exports.

### Feedback

Under **Storefront → Feedback**, add the customer's display name and their genuine feedback. Mark it approved only with permission to display it publicly, then save. Unapproved or incomplete testimonials are not displayed. Visitors submit feedback through WhatsApp; this is not an anonymous public form.

## 4. Checks before publishing

- Confirm which sizes and color combinations are actually offered; disable unavailable ones.
- Enter confirmed Live With Purpose prices, or keep price inquiries enabled.
- Check original and new T-shirts, paintings, student art, workshop details and promotions on your phone.
- Test the size guide and WhatsApp inquiry; opening a link does not send the message automatically.
- Test your real approved-admin login, one image upload, and a save/reload. These live-service operations were not performed here.

## 5. Bring the update into your original Git project

After previewing, make a backup of your original project. Copy these from the extracted folder into the original project and replace matching files:

- `src/`
- `public/`
- `tests/`
- `package.json` and `package-lock.json`
- `vite.config.js`
- `vercel.json`
- `.gitignore`
- `START-HERE.md`

Keep your original `.env.local`, `.git` directory and deployment settings. No new SQL migration is required for this update; it uses the existing `site_settings.content` field and existing catalog/image permissions. Do not reapply old `.patch` files from the original project.

Then run:

```bash
npm install
npm test
npm run build
npm run dev
```

When you are satisfied with the local review, commit the changed files on a feature branch and review a Vercel preview before merging into main.

## Validation performed

- Combined production build passed. Carousel autoplay, first slide, grid order, footer icons, Magnate frame and WhatsApp scroll prompts passed browser checks.
- Product logic tests passed: four variant combinations, blocked same-color combinations, stable/reserved codes, complete inquiry details and unknown prices.
- Browser checks passed on desktop and mobile for product selection, size charts, inquiry URLs and modal closing, with no runtime errors.
- The earlier admin components were retained; real admin login and saves were not re-tested against your live database in this merge.
- Real Supabase login, upload/save permissions and Vercel deployment still need validation using your existing account and configuration.

## Latest visual update

Sticky navy header with a divider and translucent blur on scroll; full-width cover images (edges can crop to fit the screen); 2-second autoplay with visible play/pause; 1.5-second navy/cream Talk to Us hover cycle. Build and targeted desktop/mobile browser checks passed. All previous combined storefront features remain included.
