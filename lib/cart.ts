import { getProduct, type Product } from "@/lib/products";

/**
 * Cart storage and arithmetic. No React here, so both sides can use it.
 *
 * Only the slug and a quantity are stored. Names and prices are looked up from
 * the catalogue when the cart is rendered, so a basket left in localStorage for
 * a month cannot show last month's price, and a product that no longer exists
 * simply drops out.
 */

export type CartLine = {
  slug: string;
  quantity: number;
};

export type ResolvedLine = {
  product: Product;
  quantity: number;
};

/** Versioned, so a future change of shape can ignore old baskets instead of choking on them. */
export const CART_STORAGE_KEY = "vitrine.cart.v1";

export const MAX_QUANTITY = 9;

/**
 * Reads the saved basket. Returns [] anywhere there is no window — this runs
 * during server rendering too, where localStorage does not exist — and also on
 * anything malformed, because a corrupt basket must not break the shop.
 */
export function readCart(): CartLine[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(
        (line): line is CartLine =>
          !!line &&
          typeof line === "object" &&
          typeof (line as CartLine).slug === "string" &&
          Number.isInteger((line as CartLine).quantity),
      )
      .map((line) => ({
        slug: line.slug,
        quantity: clampQuantity(line.quantity),
      }))
      .filter((line) => line.quantity > 0)
      // A slug that is no longer in the catalogue is dropped here rather than
      // later, so the badge count and the drawer contents cannot disagree —
      // they did, briefly: the count included a product the basket refused to
      // show.
      .filter((line) => getProduct(line.slug) !== undefined);
  } catch {
    return [];
  }
}

export function writeCart(lines: CartLine[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(lines));
  } catch {
    // Private browsing and full quotas both throw. A basket that cannot be
    // saved is still a working basket for this visit.
  }
}

export function clampQuantity(quantity: number): number {
  return Math.max(0, Math.min(MAX_QUANTITY, Math.trunc(quantity)));
}

export function addLine(lines: CartLine[], slug: string): CartLine[] {
  const existing = lines.find((line) => line.slug === slug);
  if (!existing) return [...lines, { slug, quantity: 1 }];
  return lines.map((line) =>
    line.slug === slug
      ? { ...line, quantity: clampQuantity(line.quantity + 1) }
      : line,
  );
}

export function setLineQuantity(
  lines: CartLine[],
  slug: string,
  quantity: number,
): CartLine[] {
  const next = clampQuantity(quantity);
  if (next === 0) return lines.filter((line) => line.slug !== slug);
  return lines.map((line) =>
    line.slug === slug ? { ...line, quantity: next } : line,
  );
}

export function removeLine(lines: CartLine[], slug: string): CartLine[] {
  return lines.filter((line) => line.slug !== slug);
}

export function countItems(lines: CartLine[]): number {
  return lines.reduce((total, line) => total + line.quantity, 0);
}

/** Drops any slug that is no longer in the catalogue. */
export function resolveLines(lines: CartLine[]): ResolvedLine[] {
  const resolved: ResolvedLine[] = [];
  for (const line of lines) {
    const product = getProduct(line.slug);
    if (product) resolved.push({ product, quantity: line.quantity });
  }
  return resolved;
}

export function cartTotal(lines: CartLine[]): number {
  return resolveLines(lines).reduce(
    (total, line) => total + line.product.price * line.quantity,
    0,
  );
}
