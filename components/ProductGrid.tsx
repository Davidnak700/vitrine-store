import ProductCard from "@/components/ProductCard";
import type { Product } from "@/lib/products";

/**
 * The one grid used everywhere products are listed: the three home page rows,
 * the catalogue, the category pages and later the deals pages.
 *
 * Four columns is the maximum at any width. A bigger catalogue never means a
 * denser page.
 */
export default function ProductGrid({
  products,
  emptyMessage = "Nothing here just now.",
}: {
  products: Product[];
  emptyMessage?: string;
}) {
  if (products.length === 0) {
    return <p className="text-body text-ink-muted">{emptyMessage}</p>;
  }

  return (
    <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.slug} product={product} />
      ))}
    </ul>
  );
}
