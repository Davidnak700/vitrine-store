"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { useCart } from "@/components/CartProvider";
import { cartTotal, MAX_QUANTITY, resolveLines } from "@/lib/cart";
import { formatPrice } from "@/lib/format";

/**
 * The basket panel.
 *
 * Rendered once, from the root layout, and closed by default — so its first
 * render matches the server's and nothing has to be guessed before hydration.
 *
 * Products are looked up from the catalogue by slug, not read out of storage,
 * so a basket saved weeks ago shows today's prices and quietly drops anything
 * that has since left the range.
 */
export default function CartDrawer() {
  const { lines, isOpen, closeCart, setQuantity, remove, clear } = useCart();
  const panelRef = useRef<HTMLDivElement>(null);
  const returnFocusTo = useRef<HTMLElement | null>(null);

  // Escape closes. Registered only while open, so nothing listens needlessly.
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeCart();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen, closeCart]);

  // Move focus into the panel on open and hand it back on close, so a keyboard
  // user is not dropped at the top of the document.
  useEffect(() => {
    if (isOpen) {
      returnFocusTo.current = document.activeElement as HTMLElement | null;
      panelRef.current?.focus();
    } else {
      returnFocusTo.current?.focus();
      returnFocusTo.current = null;
    }
  }, [isOpen]);

  // Stop the page behind from scrolling under the panel.
  useEffect(() => {
    if (!isOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const resolved = resolveLines(lines);
  const total = cartTotal(lines);

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop. Clicking outside the panel closes it; screen readers skip it
          because the panel below is the dialog. */}
      <button
        type="button"
        aria-label="Close basket"
        onClick={closeCart}
        className="absolute inset-0 bg-ink/30"
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-heading"
        tabIndex={-1}
        className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-surface-card shadow-lg outline-none"
      >
        <div className="flex items-center justify-between p-6">
          <h2
            id="cart-heading"
            className="font-display text-h3 font-medium text-ink"
          >
            Your basket
          </h2>
          <button
            type="button"
            onClick={closeCart}
            className="flex size-10 items-center justify-center rounded-pill bg-surface-well text-ink transition-colors hover:bg-accent-tint hover:text-accent"
          >
            <span aria-hidden="true" className="text-body">
              &times;
            </span>
            <span className="sr-only">Close basket</span>
          </button>
        </div>

        {resolved.length === 0 ? (
          <div className="flex-1 px-6">
            <p className="text-body text-ink-muted">
              Nothing in it yet.{" "}
              <Link
                href="/catalog"
                onClick={closeCart}
                className="rounded-sm font-medium text-accent transition-opacity hover:opacity-80"
              >
                Have a look at the catalogue
              </Link>
              .
            </p>
          </div>
        ) : (
          <ul className="flex-1 overflow-y-auto px-6">
            {resolved.map(({ product, quantity }) => (
              <li key={product.slug} className="flex gap-4 py-4">
                <div className="size-20 shrink-0 rounded-md bg-surface-well p-2">
                  <Image
                    src={product.image}
                    alt=""
                    width={400}
                    height={300}
                    sizes="80px"
                    className="h-auto w-full"
                    unoptimized={product.image.endsWith(".svg")}
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <Link
                    href={`/product/${product.slug}`}
                    onClick={closeCart}
                    className="rounded-sm text-small font-medium text-ink transition-colors hover:text-accent"
                  >
                    {product.name}
                  </Link>
                  <p className="mt-1 text-small text-ink-muted">
                    {formatPrice(product.price)}
                  </p>

                  <div className="mt-2 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setQuantity(product.slug, quantity - 1)}
                      className="flex size-8 items-center justify-center rounded-pill bg-surface-well text-ink transition-colors hover:bg-accent-tint hover:text-accent"
                    >
                      <span aria-hidden="true">&minus;</span>
                      <span className="sr-only">
                        Reduce quantity of {product.name}
                      </span>
                    </button>

                    <span className="min-w-6 text-center text-small font-medium text-ink">
                      <span className="sr-only">Quantity: </span>
                      {quantity}
                    </span>

                    <button
                      type="button"
                      disabled={quantity >= MAX_QUANTITY}
                      onClick={() => setQuantity(product.slug, quantity + 1)}
                      className="flex size-8 items-center justify-center rounded-pill bg-surface-well text-ink transition-colors hover:bg-accent-tint hover:text-accent disabled:opacity-40"
                    >
                      <span aria-hidden="true">+</span>
                      <span className="sr-only">
                        Increase quantity of {product.name}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => remove(product.slug)}
                      className="ml-auto rounded-sm text-small text-ink-muted transition-colors hover:text-accent"
                    >
                      Remove
                      <span className="sr-only"> {product.name}</span>
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}

        <div className="bg-surface-well p-6">
          <div className="flex items-baseline justify-between">
            <span className="text-body text-ink-muted">Total</span>
            <span className="text-h3 font-medium text-ink">
              {formatPrice(total)}
            </span>
          </div>

          <p className="mt-4 text-small text-ink-muted">
            Vitrine is a portfolio project. Nothing here is for sale and no
            order can be placed.
          </p>

          {resolved.length > 0 && (
            <button
              type="button"
              onClick={clear}
              className="mt-4 rounded-sm text-small text-ink-muted transition-colors hover:text-accent"
            >
              Empty the basket
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
