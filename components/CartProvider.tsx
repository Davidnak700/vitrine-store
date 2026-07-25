"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";
import {
  addLine,
  CART_STORAGE_KEY,
  countItems,
  readCart,
  removeLine,
  setLineQuantity,
  writeCart,
  type CartLine,
} from "@/lib/cart";

/**
 * The basket, and whether the drawer is open.
 *
 * This is a client component because a basket has to survive navigation and
 * lives in the browser. The directive stops here: pages and layouts stay
 * server components and pass their finished output through as `children`.
 *
 * localStorage is an external store, so it is read through
 * useSyncExternalStore rather than copied into state inside an effect. That
 * matters for three reasons:
 *
 *   - `getServerSnapshot` returns an empty basket, which is exactly what the
 *     server renders, so the first paint cannot mismatch or show a stale
 *     basket. React then re-renders with the real one.
 *   - No setState in an effect, so no cascading render on every mount.
 *   - Another tab changing the basket updates this one, through the `storage`
 *     event, for free.
 *
 * The snapshot must be referentially stable or React re-renders forever, so
 * the parsed basket is cached and only re-parsed when the raw string changes.
 */

const EMPTY: CartLine[] = [];

let snapshot: CartLine[] = EMPTY;
let snapshotRaw: string | null = null;
const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener("storage", emit);
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) window.removeEventListener("storage", emit);
  };
}

function getSnapshot(): CartLine[] {
  const raw = window.localStorage.getItem(CART_STORAGE_KEY);
  if (raw !== snapshotRaw) {
    snapshotRaw = raw;
    snapshot = readCart();
  }
  return snapshot;
}

function getServerSnapshot(): CartLine[] {
  return EMPTY;
}

function update(change: (lines: CartLine[]) => CartLine[]) {
  const next = change(getSnapshot());
  writeCart(next);
  snapshot = next;
  // Read back what actually landed. If the write was refused — private
  // browsing, full quota — the raw string is unchanged, and the comparison in
  // getSnapshot then keeps serving this in-memory basket for the visit.
  snapshotRaw = window.localStorage.getItem(CART_STORAGE_KEY);
  emit();
}

/** True only once the client has taken over. */
const neverChanges = () => () => {};

type CartContextValue = {
  lines: CartLine[];
  count: number;
  hydrated: boolean;
  isOpen: boolean;
  add: (slug: string) => void;
  setQuantity: (slug: string, quantity: number) => void;
  remove: (slug: string) => void;
  clear: () => void;
  openCart: () => void;
  closeCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function useCart(): CartContextValue {
  const value = useContext(CartContext);
  if (!value) {
    throw new Error("useCart must be used inside <CartProvider>");
  }
  return value;
}

export default function CartProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const lines = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const hydrated = useSyncExternalStore(
    neverChanges,
    () => true,
    () => false,
  );

  // Drawer visibility is ordinary UI state, set from event handlers.
  const [isOpen, setIsOpen] = useState(false);

  const add = useCallback((slug: string) => {
    update((current) => addLine(current, slug));
  }, []);

  const setQuantity = useCallback((slug: string, quantity: number) => {
    update((current) => setLineQuantity(current, slug, quantity));
  }, []);

  const remove = useCallback((slug: string) => {
    update((current) => removeLine(current, slug));
  }, []);

  const clear = useCallback(() => update(() => []), []);
  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const value = useMemo<CartContextValue>(
    () => ({
      lines,
      count: countItems(lines),
      hydrated,
      isOpen,
      add,
      setQuantity,
      remove,
      clear,
      openCart,
      closeCart,
    }),
    [
      lines,
      hydrated,
      isOpen,
      add,
      setQuantity,
      remove,
      clear,
      openCart,
      closeCart,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
