import type { Category } from "@/lib/categories";
import { getProduct, type Product } from "@/lib/products";

/**
 * The comparison selection lives in the URL: /compare?items=slug-a,slug-b
 *
 * No context, no localStorage, no client component. The selection is a fact
 * about the address, which means a comparison can be shared, bookmarked and
 * stepped out of with the back button — the same principle the category
 * filters already follow.
 *
 * Two rules are enforced here rather than trusted:
 *
 *   - Only one category at a time. Spec labels are identical within a
 *     category and different across them, so a mixed comparison would have
 *     rows that do not line up — the exact thing the data model exists to
 *     prevent.
 *   - At most four. The design caps product grids at four columns and a
 *     comparison table is no different; a fifth column would have to shrink
 *     the others.
 */

export const MAX_COMPARE = 4;

export type Selection = {
  products: Product[];
  /** Slugs that were asked for but left out, so the page can say why. */
  ignored: string[];
};

export function parseItems(raw: string | string[] | undefined): Selection {
  const value = Array.isArray(raw) ? raw.join(",") : (raw ?? "");
  const slugs = value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const products: Product[] = [];
  const ignored: string[] = [];
  const seen = new Set<string>();

  for (const slug of slugs) {
    if (seen.has(slug)) continue;
    seen.add(slug);

    const product = getProduct(slug);
    if (!product) {
      ignored.push(slug);
      continue;
    }
    if (products.length > 0 && product.category !== products[0].category) {
      ignored.push(slug);
      continue;
    }
    if (products.length >= MAX_COMPARE) {
      ignored.push(slug);
      continue;
    }
    products.push(product);
  }

  return { products, ignored };
}

export function compareHref(slugs: string[], category?: Category): string {
  if (slugs.length > 0) return `/compare?items=${slugs.join(",")}`;
  return category ? `/compare?category=${category}` : "/compare";
}

export function hrefWith(products: Product[], slug: string): string {
  return compareHref([...products.map((p) => p.slug), slug]);
}

export function hrefWithout(products: Product[], slug: string): string {
  const rest = products.filter((p) => p.slug !== slug).map((p) => p.slug);
  return compareHref(rest, products[0]?.category);
}
