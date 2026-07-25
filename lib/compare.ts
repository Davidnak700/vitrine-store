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

/* -------------------------------------------------------------------------
 * Selecting on a category page
 *
 * The same selection, held in that page's own address:
 *
 *   /catalog/audio?compare=nordvale-hush-pro,cairn-tumble
 *
 * This does not drag a parameter through the whole site, because a comparison
 * can only ever hold one category. The selection therefore needs to exist in
 * exactly two places — the category page you are picking on, and the
 * comparison itself. Switching category drops the parameter, which is the
 * right behaviour: a selection cannot cross categories anyway.
 * ------------------------------------------------------------------------- */

export const COMPARE_PARAM = "compare";

/** Only products that exist and belong to `category`, deduped and capped. */
export function parseForCategory(
  raw: string | string[] | undefined,
  category: Category,
): Selection {
  const value = Array.isArray(raw) ? raw.join(",") : (raw ?? "");
  const products: Product[] = [];
  const ignored: string[] = [];
  const seen = new Set<string>();

  for (const slug of value.split(",").map((s) => s.trim()).filter(Boolean)) {
    if (seen.has(slug)) continue;
    seen.add(slug);

    const product = getProduct(slug);
    if (!product || product.category !== category || products.length >= MAX_COMPARE) {
      ignored.push(slug);
      continue;
    }
    products.push(product);
  }

  return { products, ignored };
}

/**
 * Where the toggle on a card points. Returns null when the slug is not
 * selected and the selection is already full — there is no href for "add a
 * fifth", so the card renders a plain full state instead of a dead link.
 */
export function toggleHref(
  basePath: string,
  selected: string[],
  slug: string,
): string | null {
  const isSelected = selected.includes(slug);
  if (!isSelected && selected.length >= MAX_COMPARE) return null;

  const next = isSelected
    ? selected.filter((s) => s !== slug)
    : [...selected, slug];

  return next.length === 0
    ? basePath
    : `${basePath}?${COMPARE_PARAM}=${next.join(",")}`;
}
