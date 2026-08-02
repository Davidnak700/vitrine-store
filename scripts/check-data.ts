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
      p.image === `/img/${p.category}/${p.slug}.png`,
  ),
);
check(
  "every product has its own image, none left on the placeholder",
  products.every((p) => p.image !== PLACEHOLDER_IMAGE),
);
// Two kinds of credit, checked separately. A missing credit and a credit
// missing its own fields are different faults, and reporting them as one line
// would say "imagery is wrong" without saying which picture or what about it.
check(
  "every image carries a credit of some kind",
  products.every((p) => p.image === PLACEHOLDER_IMAGE || p.imageCredit !== null),
);
check(
  "photograph credits name a photographer, a licensed source and a page",
  products.every(
    (p) =>
      p.imageCredit?.kind !== "photograph" ||
      (!!p.imageCredit.photographer &&
        !!p.imageCredit.url &&
        (p.imageCredit.source === "Unsplash" || p.imageCredit.source === "Pexels")),
  ),
);
// A seed is not required. The shipping set was generated interactively, which
// returns none, and a seed is only worth demanding when a script could submit
// the same job again. Where one is present it still has to be a real integer,
// so a half-filled credit cannot slip through.
check(
  "generated credits name a model, and any seed given is an integer",
  products.every(
    (p) =>
      p.imageCredit?.kind !== "generated" ||
      (!!p.imageCredit.model &&
        (p.imageCredit.seed === undefined ||
          Number.isInteger(p.imageCredit.seed))),
  ),
);
check(
  "nothing without its own image claims a credit",
  products.every((p) => p.image !== PLACEHOLDER_IMAGE || p.imageCredit === null),
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
