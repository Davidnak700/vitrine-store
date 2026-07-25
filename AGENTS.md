<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

---

# Project Brief: Consumer Electronics Storefront

## What this is

A portfolio learning project: a storefront site for an electronics shop.
I'm a beginner — no programming experience at all.

**Structural reference: bestbuy.com.** Take its information architecture:
shallow top-level navigation, a second navigation axis via deals,
product comparison, and a footer organized by customer task.

**Do NOT take its visual design.** Best Buy is a utilitarian big-box
retail site; its look won't work in a portfolio.

Never use Best Buy's logos, copy, photos, or brand colors. The yellow
and blue tag is a registered trademark.

## Communication

- **Always reply to me in Russian**, regardless of what language I write in.
- I have no React experience. Explain new concepts in plain language
  the first time they appear in the code.
- One step at a time. Never rewrite the whole project.
- After each stage, briefly explain what was done and why.
- If I ask for something wrong, say so directly and propose an alternative.
- I work in the desktop app, not a terminal. Run all commands yourself.

## Stack

- Next.js, App Router, TypeScript, Tailwind CSS.
- No backend, no database, no real payments. Cart is client-side only.
- Product data lives in a static file in the repo.
- Do not add new dependencies without discussing it with me first.

## Navigation: two axes

Top nav is the six categories directly, with Search and Cart on the right:
`Laptops` · `Phones` · `Audio` · `TVs` · `Smart Home` · `Accessories` — then
Search and Cart.

The catalogue is small enough that hiding categories behind a `Catalog`
link would cost a click for nothing. Deals and About are not in the header;
they live in the footer.

Categories: laptops, phones, audio, TVs, smart home, accessories.
6 products each, 36 in total.

Six per category, not three or four: the home page shows three rows of four,
and with a smaller catalogue those rows would repeat the same products and
make the range look thinner than it is.

One name for one thing: `phones` is the data key, the slug, the URL segment
and the visible label. There is no slug-to-label lookup table anywhere.

Every product is still reachable two ways: by category (`/catalog/laptops`)
and through deals (`/sale/laptops`). The deals section mirrors the
category tree but only shows products that have `oldPrice` set; it is
entered from the footer rather than the header.

## Product model

```ts
type Product = {
  slug: string
  name: string
  brand: string
  category: Category
  price: number
  oldPrice?: number      // presence means the product is on sale
  addedAt: string        // '2026-07-25' — new arrivals derive from this
  bestseller: boolean
  image: string
  imageCredit: ImageCredit | null   // null while the photo is still a placeholder
  shortDescription: string
  description: string
  specs: { label: string; value: string }[]
  inStock: boolean
}
```

```ts
type ImageCredit = {
  photographer: string
  source: 'Unsplash' | 'Pexels'
  url: string
}
```

Store only what can't be derived. No `isNew` or `isSale` fields.
Within a category, every product must use the same set of spec `label`
values, otherwise the comparison table won't line up row by row.

**Run `npm run check:data` after any change to `lib/products.ts`.** It
validates the rules above — six per category, matching spec labels, at least
two on sale per category, and three disjoint home page rows. Type checking
cannot catch any of them.

## Structure

```
app/
  layout.tsx                  — shell, header and footer
  page.tsx                    — home
  globals.css                 — tokens and base styles
  catalog/page.tsx            — full catalog
  catalog/[category]/page.tsx — single category
  sale/page.tsx               — all deals
  sale/[category]/page.tsx    — deals within a category
  product/[slug]/page.tsx     — product page
  compare/page.tsx            — compare selected products
  search/page.tsx             — search results, query read from ?q=
  about/page.tsx
components/
  Header.tsx  Footer.tsx  Nav.tsx
  ProductCard.tsx  ProductGrid.tsx  CategoryFilter.tsx
  SpecTable.tsx  CompareBar.tsx  PriceTag.tsx
  CartButton.tsx  CartDrawer.tsx  SearchBar.tsx
lib/
  products.ts  categories.ts  cart.ts  compare.ts  format.ts
public/img/                   — product images as served, by category
assets/photos/                — untouched photograph originals, by category
scripts/
  prepare-images.ts           — crops originals to 4:3 (npm run images:prepare)
  check-data.ts               — validates the catalogue (npm run check:data)
  product-art.mjs             — illustration fallback (npm run art)
  measure-art.mjs             — measures illustrations (npm run check:art)
docs/
  image-spec.md               — imagery decisions, and what has been ruled out
```

## React rules

- Server components by default. Add `"use client"` only where real
  interactivity is needed (cart, compare, mobile menu).
- Explicitly tell me why any given component had to become a client one.
- Filters and category selection go through the URL, not in-memory state.
  Links must be shareable and the back button must work.
- Clean URLs: `/catalog/laptops`, `/product/nova-15-pro`.
  No technical IDs in the path.
- Images via `next/image`, links via `next/link`, fonts via `next/font`.
- Format prices in one place (`lib/format.ts`), never inline in components.
  Locale `en-GB`, currency `GBP`. Prices are stored as plain numbers; the
  currency exists only in the formatter.
- Cart and compare list: React Context + localStorage. Remember that
  localStorage is unavailable during server rendering — don't crash on it.
- Never call `Date.now()` in a client component (hydration mismatch).

## Home page

1. Promo bar with the current offer
2. Hero
3. Bestsellers
4. Category tiles
5. Deals — four products that have `oldPrice` set, linking through to `/sale`
6. New arrivals
7. Trust block (warranty, shipping, returns)
8. Footer

Blocks 3, 5 and 6 are the same `ProductGrid` component with different data.
The three rows must be genuinely disjoint — no product appears in two of them.

Block 5 is where the second navigation axis surfaces on the home page, since
Deals is not in the header.

## Footer

Organized by customer task, not by product type:
`Deals` · `Orders & Shipping` · `Payment` · `Support` · `About`

Deals and About sit here because they were dropped from the header.

## Content and images

- Site content is English-only. No internationalisation, no RTL support,
  no locale switcher, and no notes about possible future languages.
- All copy must be original. Don't copy descriptions from real stores.
- Product and brand names are invented. Do not use real trademarks
  or their product photography.
- Product imagery is **photography**, from Unsplash and Pexels under their
  free licences. Verify the licence on the photo page — Unsplash+ is a paid
  tier and is not usable. Record photographer, source and page URL in the
  product's `imageCredit`.
- Visible brand marks in photographs are fine. Requiring logo-free shots was
  tried and cost eighteen rejections for one usable image.
- Originals go in `assets/photos/<category>/` untouched;
  `npm run images:prepare` crops them tight to 4:3 into
  `public/img/<category>/`.
- **Read `docs/image-spec.md` before changing anything about imagery.** It
  records what has already been tried and measured — in particular that
  unifying the photo backgrounds in code cannot work, and why.
- If a photograph shows something other than the product as written, change
  the product. The products are invented; the photograph is not.
- A generated-SVG illustration system is kept as a documented fallback
  (`scripts/product-art.mjs`, `npm run art`). It is not referenced by
  `lib/products.ts`.
- Products without their own image point at `/img/placeholder.svg`.

## Visual direction

**Direction: "Vitrine" — soft minimal, calm consumer.**
The store is named **Vitrine**.

### Palette

| Token | Value | Use |
| --- | --- | --- |
| `--surface-page` | `#F6F7F9` | page background |
| `--surface-card` | `#FFFFFF` | cards, header |
| `--surface-well` | `#E7E9ED` | product image wells, muted fills |
| `--ink` | `#1D2026` | primary text, primary buttons |
| `--ink-muted` | `#5A5E69` | secondary text, captions, spec labels, placeholders |
| `--accent` | `#5B5BD6` | indigo — links, focus, active states |
| `--focus-ring` | `2px solid var(--accent)` | keyboard focus outline, `outline-offset: 3px` |

Secondary text always uses `--ink-muted` as a solid colour. Never produce it
by putting opacity on `--ink` — translucent ink reacts to whatever surface is
behind it and goes muddy over the tinted wells.

The pale indigo badge ("New this month") is not a sixth colour: it is
`rgba(91,91,214,.10)` background with `--accent` text. Derived tints like this
keep the one-accent rule intact.

### Fonts

Both are on Google Fonts; load them via `next/font/google`.

- Display / headings: **Space Grotesk**
- UI / body: **Instrument Sans**, weights 400 / 500 / 600

These two are the final choice. Do not substitute or add a third family.

### Layout

- Container: max-width `1120px`, `24px` gutters.
- Product grid: 4 columns on desktop, 3 at `1024px`, 2 at `640px`.
- Section padding: `96px` desktop, `48px` mobile.
- Spacing: Tailwind's default 4px scale, unchanged.

### Radii

| Token | Value | Use |
| --- | --- | --- |
| `--radius-sm` | `8px` | badges, chips |
| `--radius-md` | `12px` | inputs |
| `--radius-lg` | `16px` | cards, panels |
| `--radius-xl` | `24px` | image wells, hero blocks |
| `--radius-pill` | `999px` | buttons, nav pills, cart badge |

### Shadows

Tinted with the ink colour, never pure black.

| Token | Value |
| --- | --- |
| `--shadow-sm` | `0 1px 3px rgba(29,32,38,.06)` |
| `--shadow-md` | `0 2px 4px rgba(29,32,38,.04), 0 4px 12px rgba(29,32,38,.06)` |
| `--shadow-lg` | `0 4px 8px rgba(29,32,38,.04), 0 12px 32px rgba(29,32,38,.08)` |

### Type scale

Space Grotesk for `display`, Instrument Sans for everything else.

| Step | Size | Line height | Tracking |
| --- | --- | --- | --- |
| `display` | `clamp(40px, 7vw, 72px)` | `1.05` | `-0.02em` — hero only |
| `h1` | `clamp(32px, 5vw, 48px)` | `1.10` | `-0.01em` |
| `h2` | `clamp(24px, 3.5vw, 32px)` | `1.20` | — |
| `h3` | `clamp(20px, 2.5vw, 24px)` | `1.30` | — |
| `body-lg` | `18px` | `1.60` | — |
| `body` | `16px` | `1.60` | — |
| `small` | `14px` | `1.50` | — |
| `label` | `13px` | `1.40` | uppercase, `0.08em` |

The whole heading ladder is fluid so the steps stay distinguishable at every
width. Desktop lands on 48 / 32 / 24, mobile on 32 / 24 / 20.

### Motion

- `150ms ease-out` for hover and colour changes.
- `200ms ease-out` for anything that moves or resizes.
- All motion is disabled under `prefers-reduced-motion`.

### Focus

`--focus-ring` is applied through `:focus-visible`, never plain `:focus`, so
the ring appears for keyboard navigation but not on mouse click.

The focus ring is a permanent exception to the no-borders rule and is never
removed, dimmed, or replaced for visual reasons.

### Design rules

These matter more than the colours.

- No borders anywhere in the resting state. Depth comes from soft shadows
  and surface contrast, never from rules or outlines. The keyboard focus
  ring is the one permanent exception — see **Focus** below.
- Generous border radii throughout, including buttons and inputs.
- Product images sit in pale tinted wells (`--surface-well`), not on
  white, so cheap and expensive products look equally dignified.
- The indigo is the only accent. Every interactive state uses it.
  Do not introduce a second accent colour.
- Copy tone: plain language for non-experts. Never lead with a spec.
- A bigger catalogue never means a denser page. Product grids stop at four
  columns at any width, whitespace stays generous, and no grid is ever
  compressed to fit more in. Big-box retail density comes from having
  millions of SKUs; this shop has 36. The one row that goes wider is the
  six category tiles, which are navigation, not products.

### How the tokens are wired

This project uses Tailwind v4, which is configured in CSS, not in JavaScript.

- Declare the tokens in the `@theme` block in `globals.css`.
- **Do not create `tailwind.config.js` or `tailwind.config.ts`.** Its absence
  is deliberate, not an oversight — do not "fix" it later.

No colour or size may bypass a token.

## Quality baseline

- Responsive from 360px up to desktop.
- Visible `:focus-visible` ring for keyboard navigation, using
  `--focus-ring`. Never removed.
- Meaningful `alt` on every image.
- Respect `prefers-reduced-motion`.
- The build passes with no errors and no lint warnings.

## Stages

1. Design tokens + layout, Header, Footer, home page. Search is a stub
   icon in the header at this stage — appearance only, no logic.
2. `lib/products.ts` and `lib/categories.ts` — data and types.
3. Catalog: ProductGrid, ProductCard, categories via URL.
4. Product page + SpecTable.
5. Deals section as the second navigation axis.
6. Product comparison: CompareBar, `/compare` page.
7. Cart: Context, localStorage, CartDrawer.
8. Search: `/search?q=…`, query read from the URL, filtering the static
   product array by name and brand. Shareable link, working back button —
   the same URL-driven principle as the category filters.
9. Responsive, accessibility, clean build.
10. Deploy to Vercel.

Current stage: **1**
