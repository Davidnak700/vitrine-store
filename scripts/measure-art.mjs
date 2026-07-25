/**
 * Measures the generated product illustrations.
 *
 *   npm run check:art            all categories
 *   npm run check:art -- audio   one category
 *
 * Prints the ink bounding box, its centre and ink coverage for each drawing.
 *
 * Read the output the way docs/image-spec.md says to: centring is a rule, so
 * fix anything that is not at 200,150. Coverage is only a flag — it cannot tell
 * a small object from a thinly drawn one, and inflating a drawing to move its
 * number into range usually makes it read worse. Look at the outlier beside its
 * neighbours and decide.
 *
 * Uses sharp, which ships with Next.js for image optimisation. Nothing is added
 * to package.json for this.
 */

import { readFile, readdir } from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

let sharp;
try {
  sharp = require("sharp");
} catch {
  console.error("sharp is not available — run npm install first.");
  process.exit(1);
}

const W = 400;
const H = 300;
const imgRoot = path.join(root, "public", "img");

const only = process.argv[2];
const categories = only
  ? [only]
  : (await readdir(imgRoot, { withFileTypes: true }))
      .filter((e) => e.isDirectory())
      .map((e) => e.name);

if (categories.length === 0) {
  console.log("No category folders in public/img yet.");
  process.exit(0);
}

for (const category of categories) {
  const dir = path.join(imgRoot, category);
  const files = (await readdir(dir)).filter((f) => f.endsWith(".svg")).sort();
  if (files.length === 0) continue;

  console.log(`\n${category}`);
  console.log(
    "  " +
      "file".padEnd(24) +
      "box".padEnd(12) +
      "centre".padEnd(12) +
      "ink",
  );

  for (const file of files) {
    const svg = await readFile(path.join(dir, file));
    const { data, info } = await sharp(svg, { density: 300 })
      .resize(W, H)
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    let minX = W;
    let minY = H;
    let maxX = -1;
    let maxY = -1;
    let ink = 0;

    for (let y = 0; y < info.height; y++) {
      for (let x = 0; x < info.width; x++) {
        if (data[(y * info.width + x) * info.channels + 3] > 24) {
          ink++;
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
        }
      }
    }

    const centre = `${((minX + maxX) / 2).toFixed(0)},${((minY + maxY) / 2).toFixed(0)}`;
    console.log(
      "  " +
        file.replace(".svg", "").padEnd(24) +
        `${maxX - minX + 1}×${maxY - minY + 1}`.padEnd(12) +
        centre.padEnd(12) +
        `${((ink / (W * H)) * 100).toFixed(1)}%`,
    );
  }
}

console.log(`\nCentre must be 200,150. Coverage is a diagnostic, not a target.`);
