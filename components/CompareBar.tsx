import Link from "next/link";
import { hrefWithout, MAX_COMPARE } from "@/lib/compare";
import type { Product } from "@/lib/products";

/**
 * The current selection, with a way to drop each item.
 *
 * This sits on the comparison page rather than following you around the site.
 * A bar that accumulated while you browsed would have to remember the
 * selection between pages, and the selection lives in the URL — which other
 * pages do not carry. Adding happens here, from the picker below the table.
 */
export default function CompareBar({ products }: { products: Product[] }) {
  if (products.length === 0) return null;

  return (
    <div className="rounded-lg bg-surface-card p-4 shadow-sm">
      <div className="flex flex-wrap items-center gap-3">
        <p className="text-small text-ink-muted">
          Comparing {products.length} of {MAX_COMPARE}
        </p>
        <ul className="flex flex-wrap gap-2">
          {products.map((product) => (
            <li key={product.slug}>
              <Link
                href={hrefWithout(products, product.slug)}
                className="flex items-center gap-2 rounded-pill bg-surface-well px-3 py-1.5 text-small text-ink transition-colors hover:bg-accent-tint hover:text-accent"
              >
                {product.name}
                <span aria-hidden="true">&times;</span>
                <span className="sr-only">— remove from comparison</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
