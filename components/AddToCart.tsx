"use client";

import { useCart } from "@/components/CartProvider";

/**
 * The one interactive control on the product page.
 *
 * Deliberately small: it takes a slug rather than a whole product, so the
 * product page stays a server component and only this leaf ships JavaScript.
 */
export default function AddToCart({
  slug,
  name,
}: {
  slug: string;
  name: string;
}) {
  const { add, openCart } = useCart();

  return (
    <button
      type="button"
      onClick={() => {
        add(slug);
        openCart();
      }}
      className="rounded-pill bg-ink px-6 py-3 text-body font-medium text-surface-card transition-opacity hover:opacity-90"
    >
      Add to basket
      <span className="sr-only"> — {name}</span>
    </button>
  );
}
