# Vitrine

A storefront for a consumer electronics shop that does not exist. Thirty-six
invented products across six categories, with a catalogue, a deals section,
product comparison, search and a working basket.

Built as a portfolio project, so the interesting part is not the shop — it is
the decisions, and particularly the ones that were measured and then reversed.

**Live:** https://vitrine-store.vercel.app/

## Stack

Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · ESLint

No backend, no database, no payments. Product data is a static file in the
repository. No dependencies beyond what `create-next-app` installs.

## Running it

```bash
npm install
npm run dev
```

| Command | What it does |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run lint` | ESLint |
| `npm run check:data` | Validates the catalogue against the rules below |
| `npm run images:place` | Maps generated frames onto product slugs — dry run unless given `-- --go` |
| `npm run images:prepare` | Crops source photographs to the 4:3 storefront frame |
| `npm run art` | Regenerates the SVG illustration fallback |
| `npm run check:art` | Measures those illustrations |

## Decisions worth defending

### State lives in the URL

Category filters, the comparison and search all keep their state in the
address. Every one of those is shareable, bookmarkable, and steps backwards
with the browser's own button.

Search needed no JavaScript at all in the end: a plain `<form method="get">`
navigates to `/search?q=…`, and the browser does the work.

Comparison was the interesting case. The selection is built on a category
page, in that page's own query string:

```
/catalog/audio?compare=nordvale-hush-pro,cairn-tumble
```

The first design only allowed choosing from the comparison page itself, on the
reasoning that a persistent selection bar would mean threading a parameter
through every link on the site. That reasoning was too broad: a comparison can
only ever hold one category, so the selection needs to exist in exactly two
places — the shelf you are choosing on, and the comparison. Switching category
drops the parameter, which is correct, because a selection cannot cross
categories anyway.

The cost is recorded rather than hidden: reading a search parameter makes
`/catalog/[category]` render on demand instead of being prerendered.

### Server components by default, client components at the leaves

The project reached stage 7 of 9 with no `"use client"` anywhere. Not as a
score to protect — the basket needs to survive navigation and belongs in the
browser, so it is a client component, and there was no point contorting the
design to avoid it.

There are exactly four: `CartProvider`, `CartButton`, `CartDrawer`,
`AddToCart`. Every page and layout stays a server component; the shell is
rendered on the server and handed to the provider as finished children.

The basket reads `localStorage` through `useSyncExternalStore` rather than
copying it into state inside an effect. Its server snapshot is an empty
basket — exactly what the server renders — so the first paint cannot mismatch,
and the badge stays hidden rather than flashing `0` and jumping to `3`.
Cross-tab syncing comes free with it.

### Store only what cannot be derived

There is no `isNew` field and no `isSale` field. A product is reduced when it
has an `oldPrice`; "new" is a position in a list sorted by `addedAt`. Nothing
depends on today's date, so the server and the browser always agree.

The same rule caught a real bug. The basket badge counted stored lines while
the drawer counted lines matched against the catalogue, so a stale slug made
the badge read 11 items over a basket showing 9 — two sources of truth for one
number. Any count shown to a user is now derived from the same filtered list
that is rendered.

`npm run check:data` enforces what type checking cannot: six products per
category, identical specification labels within a category so the comparison
table lines up, at least two reduced items per category, and three home page
rows that can be filled without repeating a product.

## The imagery story

This took four attempts and is the part with the most measurement behind it.

**Attempt one — stock photography under a strict spec.** Light neutral
background, no visible brand marks, no people, studio shots only. Nineteen
candidates downloaded and opened; **one passed**, and it turned out to be a 3D
render rather than a photograph.

The failure was structural, not a matter of searching harder. This shop sells
ten invented brands, and product photography photographs real, branded goods.
"A photograph of this product with no identifiable brand" describes something
that does not exist.

**Attempt two — generated SVG illustrations.** Flat vector, one accent detail
each, drawn by `scripts/product-art.mjs`. Optical weight was checked by
measuring ink coverage rather than by eye, which caught two drawings that
looked fine alone and wrong in a row.

Two lessons worth keeping: horizontal slots inside a rounded rectangle read as
a document icon, and two identical facing C-shapes read as the letters "CC".

The illustrations held together at card size and read sparse at the 509px the
product page uses. A flat silhouette has least to give exactly when enlarged.

**Attempt three — photography again, with the brand-mark rule dropped.** Ten
candidates, six usable, none rejected for a logo. That one rule had been
costing eighteen rejections per pass.

**Attempt four — normalising six backdrops in code.** Six photographs meant
six backgrounds, and the tinted well behind them stopped reading as one
surface. The idea was to sample the border, grow a background region inwards,
then desaturate and lift only that region.

It does not work, and it cannot be made to work this way:

| Threshold (max per-pixel step) | 4 | 7 | 10 | 14 |
| --- | --- | --- | --- | --- |
| Magenta backdrop | 97% | 99% | 99% | 99% |
| Mid-grey backdrop | 99% | 100% | 100% | 100% |

The true background is 50–70% of those frames. The region reaches 97–100% at
every setting, so the products bleach along with the backdrop. Studio lighting
joins product to background through continuous tonal ramps — soft shadows,
feathered edges, reflections — and a threshold needs a step to stop on. There
is none. Tightening it does not separate them, it starts tearing holes in the
background instead.

Doing it properly needs model-grade segmentation or hand-cut masks. That ended
the attempt to make stock photography behave.

**Attempt five — generate all thirty-six from one model.** Which is what ships.

Every frame comes from one model, `nano-banana-2`, through one prompt template
where only the product description varies. Everything else — lighting,
backdrop, framing, the exclusions — is held constant, and that is the thing
none of the previous four attempts managed: a catalogue that looks like one
shop rather than thirty-six salvage operations. The problem was never the
individual picture. It was that twelve sources give twelve backgrounds, and no
amount of processing afterwards fixes a decision made at the source.

The descriptions do the work the prompt cannot. Two habits throughout, both
aimed at what these models get wrong: say how many of a thing there are, and
prefer plain surfaces to grilles, ports and legends wherever the product
allows it. Naming what must *not* appear backfires — "no socket" kept the word
in the prompt and produced socket holes anyway. Within a category the
silhouettes are assigned before any description is written, so six laptops do
not come back as one laptop photographed six times.

**These frames cannot be reproduced exactly.** They were generated
interactively in a chat client rather than by a script, so no seed came back.
`imageCredit` records the model and no seed, because recording a seed that
does not reproduce the image would be worse than recording none. Regenerating
would give a different, equally valid set.

`docs/image-spec.md` has the full record, including what not to retry. The SVG
illustration generator stays in the repository as a documented fallback; the
drawings themselves were deleted when the generated frames replaced them, and
`npm run art` recreates them.

## What a phone audit found

The site was responsive from the start — it never scrolled sideways and it
never broke. That is not the same as being designed for a phone, and the
difference only showed up once it was measured at 375px rather than resized
and eyeballed.

| Measured at 375px | Finding |
| --- | --- |
| Comparison table | **640px wide in a 327px window.** Neither the label column nor the header row was pinned, so scrolling right lost the row labels and scrolling down lost the product names |
| Category navigation | **Two of six categories off-screen.** "Smart Home" cut mid-word, "Accessories" entirely outside the viewport, behind a swipe with the scrollbar hidden and no snap |
| Home page | **10.6 screens tall.** Each row of four products becomes four stacked cards; 2.4 screens of scrolling to get past the bestsellers |
| Product page | Name at 0.74 screens down, Add to basket at 1.03 — both below the fold, behind the image |
| Basket panel | All ten controls under 44px. The destructive one, "Empty the basket", was the smallest target on screen at 21px tall and sat 24px from the bottom edge, where a thumb lands |

Two things the audit found already right, recorded so they don't get
"improved": the basket becomes a genuine full-screen modal on a phone with
body scroll locked, and no page scrolls sideways at any width.

The navigation and the basket hazard were fixed first, because both were bugs
rather than design questions — a category nobody can reach, and an
irreversible action that was easiest to hit by accident.

### The comparison table was transposed, not shrunk

Pinning the label column and the header row was the obvious fix and the wrong
one. It would have left the desktop layout in place with tape on it, and it
does not touch the actual problem: four products will not fit across 375px as
columns, so the page showed the labels and one product at a time — the
opposite of a comparison.

The distinction worth drawing is between removing a defect and taming one.
Pinning the columns would have made the sideways scroll easier to live with;
**the block view has no horizontal scroll container at all.** At 375px the page
now contains nothing that scrolls sideways — not a tidier scroller, none. That
was the point of measuring first: the scroll box was a symptom, and a fix aimed
at the symptom would have been indistinguishable from progress.

Below `md` the table is replaced by one block per specification, with all four
products listed down it. Stacked as rows they fit, the axis that scrolls
becomes the one a phone scrolls anyway, and every value on screen sits next to
both the specification it belongs to and the product it belongs to. Its known
weakness is that a single product's spec sheet is now spread across seven
blocks, so each product name links to its own page. Desktop is untouched above
the breakpoint.

**The rejected alternative is the more interesting one.** A card per product
with the differing values highlighted is the better-looking design, the more
phone-native one, and the one that answers the question people actually bring
to a comparison — what is different? It was rejected on the data. Within a
category these products share specification *labels* but almost never share
*values*: compare four laptops and every row differs on all four, so the
highlighting marks everything and distinguishes nothing. A feature whose value
evaporates against the real catalogue is the wrong choice however well it
demonstrates.

The measuring is the part worth showing. Every number above came from the
running site, not from reading the CSS.

## Accessibility

Audited across every route rather than assumed: one `h1` per page, no skipped
heading levels, meaningful `alt` on every image, an accessible name on every
control, a label on every input, a skip link first in the tab order, and a
visible `:focus-visible` ring that is never removed. No page scrolls sideways
at 360px — the comparison table scrolls inside its own box. Motion is disabled
under `prefers-reduced-motion`.

The audit found two faults that review by eye had missed: heading levels
skipping from `h1` to `h3` on four routes, and an `/about` page that the footer
had been linking to since stage 1 without it ever being built.

## Design

The visual direction is soft minimal: no borders anywhere in the resting
state, generous radii, depth from soft shadows and surface contrast, and one
accent colour used only for interactive state.

Every colour, radius, shadow and type step is a token declared once in
`app/globals.css` and wired into Tailwind through `@theme`. There is no
`tailwind.config.js` — in Tailwind v4 the theme is configured in CSS.

The heading ladder is fluid, `clamp()` on `display` through `h3`, so the steps
stay distinguishable at every width. Fixed sizes made `h1` and `h2` identical
on a narrow screen.

## Project structure

```
app/          routes
components/   UI, four of which are client components
lib/          data, types and pure logic
scripts/      catalogue validation, image preparation, illustration generator
docs/         image-spec.md — imagery decisions and what has been ruled out
assets/       image originals, untouched, as they came out of the generator
```

`AGENTS.md` holds the working brief: the rules the code is written against,
and the reasoning behind the ones that changed.

## Licence

Code is free to read and learn from. The product images are generated, and
Higgsfield's terms neither claim ownership of outputs nor restrict their
commercial use.
