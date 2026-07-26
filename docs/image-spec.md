# Product imagery

Audio and accessories ship **photographs**. The other four categories still
show the shared placeholder.

A parallel system of flat SVG illustrations is kept in the repository as a
working fallback — see [Illustration fallback](#illustration-fallback) below.

## How we got here

Worth reading before proposing a change, because most of the obvious ideas
have already been tried and measured.

**First attempt: photographs under a strict spec.** Light neutral background,
no visible brand marks, no people, studio register only. Nineteen candidates
inspected, one passed — and it was a 3D render, not a photograph. The blocker
was structural: this shop sells ten invented brands, and product photography
photographs real, branded goods, so "a photograph of this product with no
identifiable brand" describes something that does not exist.

**Second attempt: illustrations.** Six drawn for audio. They hold together
beautifully at card size but read sparse at the 509px the product page uses —
a flat silhouette has no detail to give when it is enlarged.

**Third attempt: photographs with the brand-mark rule dropped.** Immediately
workable: ten candidates inspected, six usable, none rejected for a logo. That
is what ships.

## Why the backgrounds are not unified

Six photographs mean six backdrops — white, mid grey, magenta, black. An
attempt was made to push them into one light register in code: sample the
border, grow a background region inwards, then desaturate and lift only that
region.

**It does not work, and it cannot be made to work this way.** Measured mask
coverage on the two hardest images, across four thresholds:

| Threshold (max per-pixel step) | 4 | 7 | 10 | 14 |
| --- | --- | --- | --- | --- |
| Kestrel Bud 2 (magenta) | 97% | 99% | 99% | 99% |
| Nordvale Hush Pro (mid grey) | 99% | 100% | 100% | 100% |

The true background is 50–70% of those frames. The region reaches 97–100% at
every setting, so the products get bleached along with the backdrop. The cause
is not tuning: studio lighting joins product to background through continuous
tonal ramps — soft shadows, feathered edges, reflections — and there is no step
anywhere for a threshold to stop on. Tightening the threshold does not separate
them, it just starts tearing holes in the background instead.

Separating them properly needs model-grade segmentation or hand-cut masks per
image. Neither is worth it here. **Do not try this again.**

What we do instead is crop tight, so less of each backdrop is on screen. See
`scripts/prepare-images.ts`.

Two things that look like fixes and are not:

- **Rounding the photo corners** to match the well. That hides the mismatch
  rather than fixing it.
- **Running images edge to edge**, removing the well. The tinted well is what
  holds the whole visual direction together; losing it to hide six backdrops is
  a bad trade.

## Photographs

Sources: Unsplash and Pexels, free licence verified on each photo page (not
Unsplash+). The photographer and page URL go in the product's `imageCredit`.

| Rule | Requirement |
| --- | --- |
| Framing | 4:3, product centred and tight in frame |
| Content | One product, whole, no people, no props, no clutter |
| Background | Clean and uncluttered. Colour and texture are allowed. |
| Brand marks | Allowed. Chasing logo-free shots cost 18 rejections for 1 pass. |
| Resolution | 2400px on the long edge before cropping |

Originals live in `assets/photos/<category>/` untouched, so the crop can be
redone without going back to the source sites. `npm run images:prepare` crops
them into `public/img/<category>/`.

When the photograph shows something other than the product as written, **change
the product, not the photograph** — the products are invented. `orla-loop` was
specified as wireless open-ear clips; no stock library has that category yet,
so the product became wired over-ear clips to match the photograph that exists.

This file is the **single source for imagery rules**. `AGENTS.md` used to
restate them and the two drifted: it forbade real trademarks outright while
this file allowed visible brand marks. Brand marks are allowed — that is
settled, and measured. `AGENTS.md` now points here rather than repeating, so
the two cannot disagree again.

### What the search actually costs, per category

Measured while collecting accessories. Both of these look like a searching
problem and are not.

**Keyboards fail on three things at once**, and the filter removes almost
everything: a visible cable, a number pad, and a non-Latin layout. Four
consecutive rejections ran Cyrillic, Cyrillic, German QWERTZ, and a full-size
wired board with a number pad. A product specified as compact and wireless on
an English-only site rules out most of what stock libraries hold. One candidate
in five passed. Search for the layout, not the word "keyboard".

**A laptop stand is never the subject of a stock photograph.** Across
`laptop stand`, `laptop riser` and `notebook stand isolated` on both libraries,
every result is a desk scene where the stand sits under a laptop with a mouse,
a plant or a mug beside it. There is no isolated product shot of a stand,
because nobody photographs one — a stand alone reads as an abstract wedge and
is not recognisable as what it is.

**Two backdrops in six come out saturated, and that is the running rate.**
Measured as mean HSL saturation over a border band of the finished crop, which
samples backdrop rather than product:

| Category | Saturated backdrops (≥40%) | Which |
| --- | --- | --- |
| audio | 2 of 6 | `kestrel-bud-2` 94%, `vellum-shelf` 77% |
| accessories | 2 of 6 | `ferrite-brick-65` 97%, `kestrel-glide` 78% |

Worth knowing before anyone proposes a fix: the accessories row is not worse
than the audio row that has been shipping since stage 4, it is identical in
ratio. Two loud frames per six is what free stock photography costs here, and
the tight crop is the only lever — see the section above on why processing the
backdrops cannot work. Do not reject an otherwise correct photograph for a
coloured backdrop alone.

So for stands, **a laptop in the frame is the expected result, not a defect**.
Judge the shot on whether the stand is whole and the background is clean, and
accept the laptop. Do not spend a budget hunting for a stand on its own; it is
the same shape of mistake as hunting for logo-free product photography.

## Illustration fallback

The six audio illustrations and the generator that draws them stay in the
repository. They are not referenced by `lib/products.ts` any more, and they
cost nothing to keep: `npm run art` regenerates them, `npm run check:art`
measures them, and pointing a product back at its `.svg` is a one-line change.

They are worth keeping for two reasons. They are a working answer if the
photography approach has to be abandoned again, and the rules below — the
cut-out rule in particular — were expensive to learn.

### House rules

Every illustration obeys all of these.

| Rule | Requirement |
| --- | --- |
| Format | SVG, `viewBox="0 0 400 300"` — 4:3 |
| Style | Flat vector. No gradients, no shadows, no outline strokes around shapes. |
| Colour | Body in `--ink`. Exactly **one** `--accent` detail per product. Nothing else. |
| Background | Transparent. The card's `--surface-well` shows through. |
| Framing | Product centred on 200,150. Roughly 15% clear margin. |
| Optical weight | Comparable across a row — but judged by eye, with ink coverage as a diagnostic. See below. |
| Silhouette | Must differ from every other product in its category. |

`--ink` and `--accent` are baked into the generated files as literal hex,
because an SVG loaded through `<img>` is a separate document and cannot read the
page's CSS variables. The generator holds the only copy of those two values —
change them at the top of `scripts/product-art.mjs` and re-run. Never hand-edit
a generated `.svg`.

### Silhouette variation is the real work

The known failure of a vector approach is six drawings that are one drawing with
a detail moved. It has to be worked at deliberately: vary the viewpoint, the
count of objects, the proportions, whether a thing is open or closed, how the
mass is distributed.

The audio six, as an example of the intended spread:

| Slug | Silhouette |
| --- | --- |
| `halden-field-one` | Front view: arch over two discs |
| `nordvale-hush-pro` | Side profile: one large disc, band sweeping back |
| `kestrel-bud-2` | Low cluster: open case with two small buds beside it |
| `orla-loop` | Twin rings, mirrored so the pair does not read as lettering |
| `cairn-tumble` | Single upright block, perforated grille |
| `vellum-shelf` | Two tall cabinets, offset, one set back |

Two lessons from drawing that set, both worth reusing:

- Horizontal slots inside a rounded rectangle read as a **document icon**. Use a
  dot grid for grilles.
- Two identical facing C-shapes read as the **letters "CC"**. Mirror a pair so
  the open sides face outward.

### Checking the illustrations

`scripts/product-art.mjs` regenerates every file:

```
node scripts/product-art.mjs
```

Render each SVG and check three numbers: the ink bounding box, its centre, and
ink coverage as a percentage of the canvas.

**Measurement informs the decision. It does not make the decision.**

Centring is a rule: every drawing belongs at 200,150. Measure it and fix it —
though note that the optical centre is not always the geometric one. The
`kestrel-bud-2` drawing measured dead centre while reading as shifted right,
because the heavy charging case outweighs the two small buds beside it. It had
to be moved against its own geometry.

Coverage is **only a flag**. It cannot tell a small object from a thinly drawn
one, and those need opposite fixes. When a drawing falls outside roughly 10–14%,
that is a prompt to look at it beside its neighbours and decide — not a number
to design towards.

Genuinely small products are allowed to sit lighter than large ones. Earbuds
are smaller than over-ear headphones; on a real shelf they would look smaller,
and a row where every product occupies identical visual mass is its own kind of
wrong. What must not happen is a drawing looking thin or unfinished.

The failure to avoid: inflating a drawing purely to move its number into range.
That fits the object to the metric and usually makes it read worse — thickening
strokes merges elements that should stay separate.

## Remaining work

| Category | Shipping | Illustration fallback |
| --- | --- | --- |
| audio | 6 photographs | 6 drawn |
| accessories | 6 photographs | — |
| laptops | placeholder | — |
| phones | placeholder | — |
| tvs | placeholder | — |
| smart-home | placeholder | — |

The remaining twenty-four images are **not tied to a stage**. All ten stages are
finished and the site is live; collecting them is ongoing work that runs after
launch, one category at a time.

This file used to say they were sourced in stage 9. That was wrong twice over:
the stage list in `AGENTS.md` never put imagery in stage 9 — that stage was
responsive, accessibility and a clean build — and stage 9 shipped without a
single new photograph. Deferring them was still the right call, because an
unbuilt basket costs a portfolio more than uneven photography does. Tying that
decision to a stage number is what did not survive contact with the work.

Products without their own image point at `/img/placeholder.svg`.
