/**
 * Validates lib/products.ts against the rules in AGENTS.md.
 *
 *   npm run check:data
 *
 * Run it after any change to the catalogue data. Type checking cannot catch
 * most of what matters here: that a category has six products, that spec
 * labels line up so the comparison table works, that the three home page rows
 * can be filled without repeating a product.
 *
 * Imports are relative with explicit .ts extensions so this runs under plain
 * `node` with no extra tooling. The `@/` alias inside lib/products.ts resolves
 * fine because it is a type-only import, which type stripping erases before
 * Node ever tries to load it.
 */

import { categories } from "../lib/categories.ts";
import {
  products,
  getBestsellers,
  getDeals,
  getNewArrivals,
  getDealsByCategory,
  getProductsByCategory,
  PLACEHOLDER_IMAGE,
} from "../lib/products.ts";

let failures = 0;

function check(name: string, ok: boolean, detail = "") {
  if (!ok) failures++;
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? " — " + detail : ""}`);
}

// ---------------------------------------------------------------- catalogue
check("36 products total", products.length === 36, `got ${products.length}`);

for (const { slug } of categories) {
  const inCategory = getProductsByCategory(slug);
  check(`${slug}: 6 products`, inCategory.length === 6, `got ${inCategory.length}`);

  const labelSets = inCategory.map((p) => p.specs.map((s) => s.label).join(" | "));
  const identical = new Set(labelSets).size === 1;
  check(
    `${slug}: identical spec labels`,
    identical,
    identical ? "" : [...new Set(labelSets)].join("  ///  "),
  );

  const onSale = getDealsByCategory(slug);
  check(`${slug}: at least 2 on sale`, onSale.length >= 2, `got ${onSale.length}`);
}

// -------------------------------------------------------------------- slugs
const slugs = products.map((p) => p.slug);
check("slugs unique", new Set(slugs).size === products.length);
check("slugs are url-safe", slugs.every((s) => /^[a-z0-9-]+$/.test(s)));

// --------------------------------------------------------------------- data
check(
  "every oldPrice is above its price",
  products
    .filter((p) => p.oldPrice !== undefined)
    .every((p) => p.oldPrice! > p.price),
);
check(
  "no derived fields stored",
  products.every((p) => !("isNew" in p) && !("isSale" in p)),
);
check(
  "addedAt is an ISO date",
  products.every((p) => /^\d{4}-\d{2}-\d{2}$/.test(p.addedAt)),
);
check("prices are positive integers", products.every((p) => Number.isInteger(p.price) && p.price > 0));

// ------------------------------------------------------------------ imagery
check(
  "image paths match their own category and slug",
  products.every(
    (p) =>
      p.image === PLACEHOLDER_IMAGE ||
      p.image === `/img/${p.category}/${p.slug}.jpg` ||
      p.image === `/img/${p.category}/${p.slug}.svg`,
  ),
);
check(
  "every photograph carries a full credit",
  products.every(
    (p) =>
      !p.image.endsWith(".jpg") ||
      (p.imageCredit !== null &&
        !!p.imageCredit.photographer &&
        !!p.imageCredit.url &&
        (p.imageCredit.source === "Unsplash" || p.imageCredit.source === "Pexels")),
  ),
);
check(
  "nothing but a photograph claims a credit",
  products.every((p) => p.image.endsWith(".jpg") || p.imageCredit === null),
);

// ------------------------------------------------------- home page, 3 rows
const used = new Set<string>();
const rowNames = ["bestsellers", "deals", "new arrivals"];
const rows = [getBestsellers, getDeals, getNewArrivals].map((select) => {
  const row = select({ limit: 4, exclude: used });
  row.forEach((p) => used.add(p.slug));
  return row;
});

rows.forEach((row, i) =>
  check(`${rowNames[i]}: 4 products`, row.length === 4, `got ${row.length}`),
);
check("the three rows are disjoint", used.size === 12, `${used.size} distinct across 12 slots`);
check("deals row is all on sale", rows[1].every((p) => p.oldPrice !== undefined));
check("bestsellers row is all flagged", rows[0].every((p) => p.bestseller));

console.log("\nhome page rows:");
rows.forEach((row, i) =>
  console.log(`  ${rowNames[i]}: ${row.map((p) => p.slug).join(", ")}`),
);

console.log(
  failures === 0 ? "\nALL CHECKS PASSED" : `\n${failures} CHECK(S) FAILED`,
);
process.exit(failures === 0 ? 0 : 1);
