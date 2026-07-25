import Image from "next/image";
import Link from "next/link";
import PriceTag from "@/components/PriceTag";
import { toggleHref } from "@/lib/compare";
import { formatSaving } from "@/lib/format";
import type { Product } from "@/lib/products";

export type CompareContext = {
  /** The page the toggle links back to, e.g. "/catalog/audio". */
  basePath: string;
  /** Slugs currently selected on that page. */
  selected: string[];
};

/**
 * One product in a grid. Server component — the only interactive things here
 * are links, and links need no JavaScript.
 *
 * The card is not one big link any more. It was, until the compare toggle
 * arrived: a link inside a link is invalid HTML, so the product link now wraps
 * the image and the text, and the toggle sits beside it as a sibling. The card
 * surface and its hover shadow moved up to the <li>.
 */
export default function ProductCard({
  product,
  compare,
  headingLevel = 3,
}: {
  product: Product;
  compare?: CompareContext;
  /**
   * 3 under a section heading, as on the home page rows and the full
   * catalogue; 2 where the grid is the page's own content and there is no h2
   * above it. Hard-coding h3 skipped a level on the category, deals and
   * search pages.
   */
  headingLevel?: 2 | 3;
}) {
  const Heading = headingLevel === 2 ? "h2" : "h3";
  const onSale = product.oldPrice !== undefined;
  const isSelected = compare?.selected.includes(product.slug) ?? false;
  const href = compare
    ? toggleHref(compare.basePath, compare.selected, product.slug)
    : null;

  return (
    <li className="flex flex-col rounded-lg bg-surface-card p-4 shadow-sm transition-shadow duration-200 hover:shadow-md">
      <Link
        href={`/product/${product.slug}`}
        className="group block flex-1 rounded-lg"
      >
        <div className="relative rounded-xl bg-surface-well p-4">
          <Image
            src={product.image}
            alt={`Illustration of the ${product.name}`}
            width={400}
            height={300}
            className="h-auto w-full"
            sizes="(min-width: 1280px) 260px, (min-width: 640px) 45vw, 90vw"
            // Photographs go through the optimiser. The placeholder is an SVG,
            // which has nothing to optimise and which Next declines by default.
            unoptimized={product.image.endsWith(".svg")}
          />
          {onSale && (
            <span className="absolute left-3 top-3 rounded-pill bg-accent-tint px-3 py-1 text-label font-semibold uppercase text-accent">
              Save {formatSaving(product.price, product.oldPrice!)}
            </span>
          )}
          {!product.inStock && (
            <span className="absolute right-3 top-3 rounded-pill bg-surface-card px-3 py-1 text-label font-semibold uppercase text-ink-muted">
              Out of stock
            </span>
          )}
        </div>

        <Heading className="mt-4 text-body font-medium text-ink transition-colors group-hover:text-accent">
          {product.name}
        </Heading>
        <p className="mt-1 text-small text-ink-muted">{product.brand}</p>
        <p className="mt-2 text-small text-ink-muted">
          {product.shortDescription}
        </p>
        <div className="mt-3">
          <PriceTag product={product} />
        </div>
      </Link>

      {compare && (
        <div className="mt-4">
          {href ? (
            <Link
              href={href}
              scroll={false}
              className={`inline-flex items-center gap-2 rounded-pill px-3 py-1.5 text-small transition-colors ${
                isSelected
                  ? "bg-accent-tint font-medium text-accent"
                  : "bg-surface-well text-ink-muted hover:text-ink"
              }`}
            >
              <span aria-hidden="true">{isSelected ? "✓" : "+"}</span>
              {isSelected ? "Comparing" : "Compare"}
              <span className="sr-only">
                {isSelected
                  ? ` — remove ${product.name} from the comparison`
                  : ` — add ${product.name} to the comparison`}
              </span>
            </Link>
          ) : (
            <span className="inline-flex items-center rounded-pill bg-surface-well px-3 py-1.5 text-small text-ink-muted">
              Comparison full
            </span>
          )}
        </div>
      )}
    </li>
  );
}
