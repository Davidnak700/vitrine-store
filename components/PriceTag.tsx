import { formatPrice } from "@/lib/format";
import type { Product } from "@/lib/products";

/**
 * Price, with the old price struck through when the product is on sale.
 *
 * The reduced price is not coloured with the accent: indigo is reserved for
 * interactive state, and a price is not interactive. The sale is signalled by
 * the badge on the card and by the struck-through original instead.
 */
export default function PriceTag({ product }: { product: Product }) {
  const { price, oldPrice } = product;

  return (
    <p className="flex items-baseline gap-2">
      <span className="text-body font-medium text-ink">
        {formatPrice(price)}
      </span>
      {oldPrice !== undefined && (
        <span className="text-small text-ink-muted">
          <span className="sr-only">Previously </span>
          <s>{formatPrice(oldPrice)}</s>
        </span>
      )}
    </p>
  );
}
