import ProductCard, { type CompareContext } from "@/components/ProductCard";
import type { Product } from "@/lib/products";

/**
 * The one grid used everywhere products are listed: the three home page rows,
 * the catalogue, the category pages and the deals pages.
 *
 * Four columns is the maximum at any width. A bigger catalogue never means a
 * denser page.
 *
 * `compare` is passed only by pages that let you build a comparison — the
 * category pages. Everywhere else the cards render without a toggle.
 */
export default function ProductGrid({
  products,
  emptyMessage = "Nothing here just now.",
  compare,
  headingLevel = 3,
}: {
  products: Product[];
  emptyMessage?: string;
  compare?: CompareContext;
  /** Pass 2 where the grid is the page's content and no h2 sits above it. */
  headingLevel?: 2 | 3;
}) {
  if (products.length === 0) {
    return <p className="text-body text-ink-muted">{emptyMessage}</p>;
  }

  return (
    <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard
          key={product.slug}
          product={product}
          compare={compare}
          headingLevel={headingLevel}
        />
      ))}
    </ul>
  );
}
