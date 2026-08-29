# Kisetsu Expressions — Project Workflow

This is the working roadmap and decision record for the website. It keeps the build focused: complete the current phase before introducing work from a later one.

## Product direction

Kisetsu Expressions is a small, visual-first art and apparel storefront. The site should make it easy to discover the work, understand each offering, and start an order or enquiry without friction.

## Roadmap

| Phase | Scope | Status |
| --- | --- | --- |
| 1 | Foundation + T-Shirts | Complete |
| 2 | Shop + Paintings + Student Art + Workshops | In progress |
| 3 | Supabase database | Planned |
| 4 | Manager / Admin | Planned |
| 5 | Orders + Payment | Planned |
| 6 | Testing + Production launch | Planned |

## How we work

1. Work from the current phase only, unless a change is necessary to unblock it.
2. Keep the first version simple and customer-facing. Manual WhatsApp handling is intentional until Phase 5.
3. Record product decisions that affect price, ordering, data, or scope in the decision log below.
4. Flag ideas that are premature, duplicate an existing feature, or add ongoing maintenance without clear customer value. They are deferred rather than silently added.
5. Before a phase is marked complete, test its main customer journeys on desktop and mobile.

## Phase 2 — current focus

Outcome: customers can browse all current offerings and make a clear WhatsApp enquiry or order.

- [x] Restore the T-shirt shop and WhatsApp ordering flow.
- [x] Add adult and kids T-shirt categories, sizes, quantities, and prices.
- [x] Add a homepage feature carousel for T-shirts, paintings, student art, and workshops.
- [x] Add an original-paintings introduction and WhatsApp enquiry path.
- [ ] Add paintings as browsable products, including images, titles, prices or enquiry status, and WhatsApp context.
- [x] Add a student-art section with clear attribution and an enquiry path.
- [x] Add a workshops section with the workshop details needed before someone messages.
- [ ] Review the complete shop journey on mobile and desktop.
- [ ] Confirm the Phase 2 content is ready to show publicly.

### Best next step

Add the **paintings catalogue** next. It is the highest-value Phase 2 addition: it makes the site feel like an art destination immediately, reuses the existing product/order pattern, and does not require a database or payment system. Student art and workshops can then use the same visual and enquiry conventions.

## Decision log

| Date | Decision | Why |
| --- | --- | --- |
| 2026-08-29 | Phase 2 remains the active scope. | The shop, art offerings, and workshops need a coherent customer experience before database or admin work. |
| 2026-08-29 | T-shirts have separate adult and kids selections. | Sizes and pricing differ by category, so the order flow must make the choice explicit. |
| 2026-08-29 | Adult T-shirts are AED 60; kids T-shirts are AED 55. | Current confirmed pricing. |
| 2026-08-29 | WhatsApp is the order and enquiry channel until Phase 5. | It supports manual fulfilment without prematurely adding accounts, checkout, or payments. |
| 2026-08-30 | Homepage feature carousel includes visible controls and a pause button. | It introduces the four offerings without hiding content or forcing users to wait for a slide. |
| 2026-08-30 | Paintings and workshops use pre-filled WhatsApp enquiries. | Customers can immediately state their interest while Kisetsu keeps fulfilment personal during Phase 2. |

## Change log

| Date | Important change |
| --- | --- |
| 2026-08-29 | Added this roadmap, workflow, and decision record. |
| 2026-08-29 | Completed the Phase 2.1 T-shirt pricing update: adult AED 60, kids AED 55; size category and size are required for orders. |
| 2026-08-30 | Added the hero artwork, automatic feature carousel, and dedicated paintings, student-art, and workshop sections. |
