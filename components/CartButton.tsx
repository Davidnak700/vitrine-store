/**
 * Stage 1 stub: the cart icon, with no cart behind it yet.
 *
 * Deliberately has no onClick, so it stays a server component. In stage 7 it
 * gains the item-count badge and opens CartDrawer, and only then does it need
 * "use client".
 */
export default function CartButton() {
  return (
    <button
      type="button"
      aria-label="Cart"
      className="flex size-10 items-center justify-center rounded-pill bg-surface-well text-ink transition-colors hover:bg-accent-tint hover:text-accent"
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
    </button>
  );
}
