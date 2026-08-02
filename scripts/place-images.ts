/**
 * Places the generated images into public/img/<category>/<slug>.png
 *
 *   npm run images:place          show the mapping, change nothing
 *   npm run images:place -- --go  actually copy
 *
 * The generator names files by timestamp, so the only thing tying a file to a
 * product is the order it was made in. That is a fragile link: one missing or
 * one extra file and everything after it shifts by one, silently, and the
 * result is a catalogue where every product after the gap shows the wrong
 * thing. So this prints the whole mapping and does nothing until asked twice.
 *
 * Three guards, all of which stop the run rather than warn:
 *   - every source folder must hold exactly six PNGs
 *   - every slug must exist in the catalogue
 *   - nothing is copied unless --go is passed
 *
 * It copies rather than moves. assets/photos holds the originals in this
 * project and public/img holds what is served; keeping that split means a
 * mistake here is undone by running it again, not by regenerating.
 */

import { copyFile, mkdir, readdir, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { products } from "../lib/products.ts";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE = path.join(root, "assets", "photos");
const OUTPUT = path.join(root, "public", "img");

const go = process.argv.includes("--go");

/**
 * Source folder → category, and the slugs in generation order.
 *
 * The order within each category is the order of the table these images were
 * generated from. It is written out in full rather than derived from
 * lib/products.ts, because the catalogue order and the generation order are
 * two different facts and quietly assuming they match is exactly the mistake
 * this script exists to prevent.
 */
const PLAN: { folder: string; category: string; slugs: string[] }[] = [
  {
    folder: "accessories",
    category: "accessories",
    // NOT the table order. The mouse was generated on its own first — its
    // file is seven minutes ahead of the other five, which then ran through
    // the list without it. Every image in every folder was identified by
    // looking at it; this is the only folder where the order differs, and
    // trusting the timestamps here would have mislabelled four products.
    slugs: [
      "kestrel-glide", // mouse
      "ferrite-cord-2m", // braided USB-C cable
      "ferrite-brick-65", // white charger, two USB-C openings
      "vellum-rise", // aluminium stand, Z profile
      "halden-press", // compact keyboard, blank keycaps
      "sable-carry-14", // grey felt sleeve on its edge
    ],
  },
  {
    folder: "audio",
    category: "audio",
    slugs: [
      "halden-field-one",
      "nordvale-hush-pro",
      "kestrel-bud-2",
      "orla-loop",
      "cairn-tumble",
      "vellum-shelf",
    ],
  },
  {
    folder: "Smart home",
    category: "smart-home",
    slugs: [
      "brisk-glow-a1",
      "brisk-socket-mini",
      "ferrite-sense",
      "halden-dial",
      "orla-chime",
      "cairn-hub-one",
    ],
  },
  {
    folder: "Notebook",
    category: "laptops",
    slugs: [
      "halden-slate-14",
      "nordvale-drift-13",
      "kestrel-forge-16",
      "cairn-field-15",
      "tolvan-loom-14",
      "vellum-arc-13",
    ],
  },
  {
    folder: "Phones",
    category: "phones",
    slugs: [
      "orla-pulse-7",
      "halden-ridge-5",
      "kestrel-vega-x",
      "tolvan-note-4",
      "brisk-ember-3",
      "sable-quill-2",
    ],
  },
  {
    folder: "TV",
    category: "tvs",
    slugs: [
      "nordvale-vista-43",
      "halden-pane-50",
      "kestrel-lumen-55",
      "cairn-broad-65",
      "tolvan-frame-32",
      "sable-reel-75",
    ],
  },
];

const bySlug = new Map(products.map((p) => [p.slug, p]));
const problems: string[] = [];
const moves: { from: string; to: string; slug: string; stamp: string; kb: number }[] = [];

for (const { folder, category, slugs } of PLAN) {
  const dir = path.join(SOURCE, folder);

  let files: string[];
  try {
    files = (await readdir(dir))
      .filter((f) => f.toLowerCase().endsWith(".png"))
      // The filename begins with the timestamp, so a plain sort is
      // chronological. No date parsing, nothing to get wrong across timezones.
      .sort();
  } catch {
    problems.push(`${folder}: folder not found`);
    continue;
  }

  if (files.length !== slugs.length) {
    problems.push(
      `${folder}: ${files.length} PNGs but ${slugs.length} products — order cannot be trusted`,
    );
    continue;
  }

  for (let i = 0; i < slugs.length; i++) {
    const slug = slugs[i];
    if (!bySlug.has(slug)) {
      problems.push(`${slug}: not in the catalogue`);
      continue;
    }
    const product = bySlug.get(slug)!;
    if (product.category !== category) {
      problems.push(
        `${slug}: catalogue says ${product.category}, plan says ${category}`,
      );
      continue;
    }
    const from = path.join(dir, files[i]);
    const { size } = await stat(from);
    moves.push({
      from,
      to: path.join(OUTPUT, category, `${slug}.png`),
      slug,
      stamp: files[i].replace(/^hf_(\d{8}_\d{6})_.*$/, "$1"),
      kb: Math.round(size / 1024),
    });
  }
}

let currentCategory = "";
for (const move of moves) {
  const category = path.basename(path.dirname(move.to));
  if (category !== currentCategory) {
    currentCategory = category;
    console.log(`\n${category}`);
  }
  console.log(
    `  ${move.stamp}  →  ${`${move.slug}.png`.padEnd(24)} ${String(move.kb).padStart(5)} KB`,
  );
}

console.log(`\n${moves.length} of 36 mapped`);

if (problems.length > 0) {
  console.error(`\nSTOPPED — ${problems.length} problem(s):`);
  for (const problem of problems) console.error(`  ${problem}`);
  process.exit(1);
}

if (!go) {
  console.log("\nDry run. Nothing copied. Re-run with --go to place these files.");
  process.exit(0);
}

for (const move of moves) {
  await mkdir(path.dirname(move.to), { recursive: true });
  await copyFile(move.from, move.to);
}
console.log(`\nCopied ${moves.length} files into public/img/.`);
