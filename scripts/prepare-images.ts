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

/** Per-image overrides, where the automatic frame needs a nudge. */
const TWEAKS: Record<string, { margin?: number }> = {
  // Trailing cable reads as product and drags the frame right; hold it in.
  "orla-loop": { margin: 0.04 },
  // Blue tube lights behind the speakers count as product; crop past them.
  "vellum-shelf": { margin: 0.02 },
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

  const margin = (TWEAKS[slug]?.margin ?? MARGIN) * Math.max(productW, productH);
  let boxW = productW + margin * 2;
  let boxH = productH + margin * 2;

  // Grow the smaller side to reach 4:3.
  if (boxW / boxH > 4 / 3) boxH = (boxW * 3) / 4;
  else boxW = (boxH * 4) / 3;

  // Clamp to the image, keeping 4:3.
  const scale = Math.min(1, width / boxW, height / boxH);
  boxW = Math.floor(boxW * scale);
  boxH = Math.floor(boxH * scale);

  const cx = (left + right) / 2;
  const cy = (top + bottom) / 2;
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
