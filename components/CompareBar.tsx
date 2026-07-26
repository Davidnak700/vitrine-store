import Link from "next/link";
import { MAX_COMPARE } from "@/lib/compare";
import type { Product } from "@/lib/products";

/**
 * The current comparison selection, with a way to drop each item.
 *
 * Used in two places, which is exactly as many places as the selection can
 * exist: on a category page, where it is being built and carries a link
 * through to the comparison; and on the comparison itself, where it is only
 * being edited.
 *
 * `removeHref` differs between the two — on a category page removal writes
 * back to that page's own query string, on /compare it rewrites ?items= — so
 * the caller supplies it rather than the component guessing.
 */
export default function CompareBar({
  products,
  removeHref,
  actionHref,
  sticky = false,
}: {
  products: Product[];
  removeHref: (slug: string) => string;
  actionHref?: string;
  sticky?: boolean;
}) {
  if (products.length === 0) return null;

  const enoughToCompare = products.length >= 2;

  return (
    <div className={sticky ? "sticky bottom-4 z-10" : undefined}>
      <div
        className={`rounded-lg bg-surface-card p-4 ${sticky ? "shadow-lg" : "shadow-sm"}`}
      >
        <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
          <p className="text-small text-ink-muted">
            Comparing {products.length} of {MAX_COMPARE}
          </p>

          <ul className="flex flex-wrap gap-2">
            {products.map((product) => (
              <li key={product.slug}>
                <Link
                  href={removeHref(product.slug)}
                  scroll={false}
                  className="flex min-h-11 items-center gap-2 rounded-pill bg-surface-well px-3 text-small text-ink transition-colors hover:bg-accent-tint hover:text-accent"
                >
                  {product.name}
                  <span aria-hidden="true">&times;</span>
                  <span className="sr-only">— remove from the comparison</span>
                </Link>
              </li>
            ))}
          </ul>

          {actionHref && (
            <div className="ml-auto">
              {enoughToCompare ? (
                <Link
                  href={actionHref}
                  className="inline-block rounded-pill bg-ink px-5 py-2.5 text-small font-medium text-surface-card transition-opacity hover:opacity-90"
                >
                  Compare {products.length}
                </Link>
              ) : (
                <p className="text-small text-ink-muted">
                  Pick one more to compare
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
