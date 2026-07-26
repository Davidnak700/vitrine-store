/**
 * Crops the source photographs to the 4:3 frame the storefront uses.
 *
 *   npm run images:prepare
 *
 * Reads assets/photos/<category>/<slug>.jpg (the untouched download) and
 * writes public/img/<category>/<slug>.jpg.
 *
 * The crop is deliberately tight. On a storefront the product is what matters,
 * not the room around it, and a tight frame also means less of each
 * photograph's own background is visible — which is the only honest lever we
 * have over six pictures shot on six different backdrops.
 *
 * Do not try to unify those backdrops by processing. See docs/image-spec.md:
 * it was tried, measured and abandoned.
 *
 * Finding the product:
 *   The border of the frame is background, because every source is a centred
 *   product shot. Sample it, then find rows and columns where enough pixels
 *   differ from it. Counting per row and per column rather than per pixel
 *   makes this robust to noise and to a stray highlight, and it only needs to
 *   be roughly right — it chooses a crop, not a cut-out.
 */

import { createRequire } from "node:module";
import { mkdir, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const sharp = require("sharp");

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE = path.join(root, "assets", "photos");
const OUTPUT = path.join(root, "public", "img");

/** Clear space kept around the product, as a fraction of its longest side. */
const MARGIN = 0.1;
/** How far a pixel must sit from the background colour to count as product. */
const DIFFERENCE = 38;
/** Share of a row or column that must differ before it counts as product. */
const OCCUPANCY = 0.006;

/**
 * Per-image overrides, where the automatic frame needs a nudge.
 *
 * `margin`  clear space around the product, as a fraction of its longest side.
 * `scale`   multiplies the finished 4:3 box. Below 1 tightens the crop.
 * `offsetX` moves the box sideways, as a fraction of its own width. Positive
 * `offsetY` is right and down. The box stays inside the image either way.
 *
 * Offset exists because the product finder is a threshold, not a cut-out: a
 * second object in the frame counts as product, inflates the bounding box and
 * drags the centre towards itself. When that object is something we want out
 * of shot, no `margin` can help — the box is already too big and centred in
 * the wrong place. Shrink it with `scale`, then walk it off the intruder with
 * the offsets.
 *
 * This is the honest, per-image escape hatch. It is not background removal,
 * which was tried and does not work — see docs/image-spec.md.
 */
type Tweak = { margin?: number; scale?: number; offsetX?: number; offsetY?: number };

const TWEAKS: Record<string, Tweak> = {
  // Trailing cable reads as product and drags the frame right; hold it in.
  "orla-loop": { margin: 0.04 },
  // Blue tube lights behind the speakers count as product; crop past them.
  "vellum-shelf": { margin: 0.02 },
  // A USB hub shares the frame bottom-right. Tighten onto the cable and walk
  // the box up and left until the hub is outside it.
  "ferrite-cord-2m": { scale: 0.54, offsetX: -0.34, offsetY: -0.44 },
  // Two chargers in the shot. Crop to the right-hand one, which is the one
  // showing two USB-C ports, as the specification says it has.
  "ferrite-brick-65": { scale: 0.66, offsetX: 0.36, offsetY: 0.13 },
};

async function prepare(file: string, outFile: string, slug: string) {
  const { data, info } = await sharp(file)
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;

  // Background reference: median of a thin border frame.
  const frame = Math.max(4, Math.round(Math.min(width, height) * 0.02));
  const samples: number[][] = [[], [], []];
  for (let y = 0; y < height; y++) {
    const edgeRow = y < frame || y >= height - frame;
    for (let x = 0; x < width; x++) {
      if (!edgeRow && x >= frame && x < width - frame) continue;
      if ((x + y) % 3 !== 0) continue;
      const i = (y * width + x) * channels;
      samples[0].push(data[i]);
      samples[1].push(data[i + 1]);
      samples[2].push(data[i + 2]);
    }
  }
  const bg = samples.map((c) => {
    c.sort((a, b) => a - b);
    return c[Math.floor(c.length / 2)];
  });

  const rowHits = new Int32Array(height);
  const colHits = new Int32Array(width);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * channels;
      const dr = data[i] - bg[0];
      const dg = data[i + 1] - bg[1];
      const db = data[i + 2] - bg[2];
      if (Math.sqrt(dr * dr + dg * dg + db * db) > DIFFERENCE) {
        rowHits[y]++;
        colHits[x]++;
      }
    }
  }

  const span = (hits: Int32Array, across: number) => {
    const need = Math.max(3, Math.round(across * OCCUPANCY));
    let lo = 0;
    let hi = hits.length - 1;
    while (lo < hits.length && hits[lo] < need) lo++;
    while (hi > lo && hits[hi] < need) hi--;
    return [lo, hi] as const;
  };

  const [top, bottom] = span(rowHits, width);
  const [left, right] = span(colHits, height);
  const productW = right - left + 1;
  const productH = bottom - top + 1;

  const tweak = TWEAKS[slug] ?? {};
  const margin = (tweak.margin ?? MARGIN) * Math.max(productW, productH);
  let boxW = productW + margin * 2;
  let boxH = productH + margin * 2;

  // Grow the smaller side to reach 4:3.
  if (boxW / boxH > 4 / 3) boxH = (boxW * 3) / 4;
  else boxW = (boxH * 4) / 3;

  // Tighten the whole frame, for images where the box came out too generous
  // because something else in the shot counted as product.
  boxW *= tweak.scale ?? 1;
  boxH *= tweak.scale ?? 1;

  // Clamp to the image, keeping 4:3.
  const fit = Math.min(1, width / boxW, height / boxH);
  boxW = Math.floor(boxW * fit);
  boxH = Math.floor(boxH * fit);

  // Offsets are a share of the box, so they mean the same thing at any
  // source resolution. Clamping below keeps the box on the image.
  const cx = (left + right) / 2 + (tweak.offsetX ?? 0) * boxW;
  const cy = (top + bottom) / 2 + (tweak.offsetY ?? 0) * boxH;
  const cropLeft = Math.max(0, Math.min(Math.round(cx - boxW / 2), width - boxW));
  const cropTop = Math.max(0, Math.min(Math.round(cy - boxH / 2), height - boxH));

  await sharp(file)
    .extract({ left: cropLeft, top: cropTop, width: boxW, height: boxH })
    .jpeg({ quality: 86, chromaSubsampling: "4:4:4" })
    .toFile(outFile);

  const fill = ((productW * productH) / (boxW * boxH)) * 100;
  console.log(
    `  ${slug.padEnd(20)}` +
      `${width}x${height} → ${boxW}x${boxH}`.padEnd(24) +
      `aspect ${(boxW / boxH).toFixed(3)}`.padEnd(15) +
      `product fills ${fill.toFixed(0)}% of frame`,
  );
}

const categories = (await readdir(SOURCE, { withFileTypes: true }))
  .filter((e) => e.isDirectory())
  .map((e) => e.name);

for (const category of categories) {
  const dir = path.join(SOURCE, category);
  const files = (await readdir(dir)).filter((f) => /\.jpe?g$/i.test(f)).sort();
  if (files.length === 0) continue;
  await mkdir(path.join(OUTPUT, category), { recursive: true });
  console.log(`\n${category}`);
  for (const file of files) {
    const slug = file.replace(/\.jpe?g$/i, "");
    await prepare(path.join(dir, file), path.join(OUTPUT, category, `${slug}.jpg`), slug);
  }
}
