import Image from "next/image";
import Link from "next/link";
import PriceTag from "@/components/PriceTag";
import { formatSaving } from "@/lib/format";
import type { Product } from "@/lib/products";

/**
 * One product in a grid. Server component — nothing here is interactive
 * beyond the link, and a link needs no JavaScript.
 *
 * The whole card is one link rather than a link on the title, so the tap
 * target is the card. The focus ring therefore lands on the card, which is
 * why the rounded corner is on the link element itself.
 */
export default function ProductCard({ product }: { product: Product }) {
  const onSale = product.oldPrice !== undefined;

  return (
    <li>
      <Link
        href={`/product/${product.slug}`}
        className="group block h-full rounded-lg bg-surface-card p-4 shadow-sm transition-shadow duration-200 hover:shadow-md"
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

        <h3 className="mt-4 text-body font-medium text-ink transition-colors group-hover:text-accent">
          {product.name}
        </h3>
        <p className="mt-1 text-small text-ink-muted">{product.brand}</p>
        <p className="mt-2 text-small text-ink-muted">
          {product.shortDescription}
        </p>
        <div className="mt-3">
          <PriceTag product={product} />
        </div>
      </Link>
    </li>
  );
}
