# Product illustration system

All 36 product images are flat SVG illustrations, drawn by
`scripts/product-art.mjs` and written to `public/img/<category>/<slug>.svg`.

There are no third-party image assets in this project. Nothing to licence,
nothing to attribute, and no trademark to avoid.

## Why not photographs

We tried. A pilot run sourced candidates from Unsplash against a strict photo
spec: light neutral background, no visible brand marks, no people, no screen
content, studio register only. Nineteen candidates were downloaded and
inspected; one passed, and it turned out to be a 3D render rather than a
photograph.

The reason is structural, not a matter of searching harder. This shop sells ten
invented brands. Product photography photographs real, branded goods — so
"a photograph of this product with no identifiable brand" describes something
that does not exist. A drawing has no such problem.

## House rules

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

## Silhouette variation is the real work

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

## Checking the work

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

| Category | Status |
| --- | --- |
| audio | 6 of 6 drawn |
| laptops | not started |
| phones | not started |
| tvs | not started |
| smart-home | not started |
| accessories | not started |

Products whose art is not yet drawn point at `/img/placeholder.svg`.
