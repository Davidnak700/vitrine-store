/**
 * Where stored values become the text a person reads.
 *
 * Prices are stored as plain numbers; the currency lives here and nowhere
 * else, so changing it is a one-line edit rather than a hunt through the
 * components.
 *
 * The formatter is built once at module load rather than per call — Intl
 * formatters are expensive to construct and this runs for every card in
 * every grid.
 */

import type { Product } from "./products";

const priceFormatter = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
  // Every price in the catalogue is a whole number of pounds.
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

export function formatPrice(amount: number): string {
  return priceFormatter.format(amount);
}

/** How much is knocked off, for products with an oldPrice. */
export function formatSaving(price: number, oldPrice: number): string {
  return formatPrice(oldPrice - price);
}

/**
 * The only place a product image becomes alt text.
 *
 * Deliberately says nothing about the medium. The three call sites used to
 * hard-code "Illustration of the …", which was already false for the six
 * audio photographs and would have been false for all thirty-six once the
 * remaining photography lands. Naming the medium means every alt string has
 * to be revisited each time a batch of images changes — so it is not named.
 *
 * The product name is what the image depicts under any medium, which is what
 * alt text is for. It stays correct for the placeholder too: the frame still
 * stands in for that product, and "no photograph yet" is a fact about the
 * project, not something a shopper needs read out.
 */
export function productImageAlt(product: Pick<Product, "name">): string {
  return product.name;
}
