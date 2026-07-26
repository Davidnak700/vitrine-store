"use client";

import { useCart } from "@/components/CartProvider";

/**
 * Opens the drawer, and carries the item count.
 *
 * The count only appears once the saved basket has been read. Before that it
 * would either be wrong or would have to be guessed, and a badge that flashes
 * 0 and then jumps to 3 is worse than a badge that arrives a moment late.
 */
export default function CartButton() {
  const { count, hydrated, openCart } = useCart();

  return (
    <button
      type="button"
      onClick={openCart}
      aria-haspopup="dialog"
      aria-label={
        hydrated && count > 0
          ? `Basket, ${count} ${count === 1 ? "item" : "items"}`
          : "Basket"
      }
      className="relative flex size-11 items-center justify-center rounded-pill bg-surface-well text-ink transition-colors hover:bg-accent-tint hover:text-accent"
    >
      <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className="size-5">
        <path
          d="M3 4h2l1.6 8.4a1.5 1.5 0 0 0 1.5 1.2h6.3a1.5 1.5 0 0 0 1.5-1.2L17 7H5.5"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="8.5" cy="16.5" r="1.2" fill="currentColor" />
        <circle cx="14.5" cy="16.5" r="1.2" fill="currentColor" />
      </svg>

      {hydrated && count > 0 && (
        <span
          aria-hidden="true"
          className="absolute -right-1 -top-1 flex min-w-5 items-center justify-center rounded-pill bg-accent px-1.5 py-0.5 text-label font-semibold text-surface-card"
        >
          {count}
        </span>
      )}
    </button>
  );
}
