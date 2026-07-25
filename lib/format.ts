/**
 * The only place a price becomes text.
 *
 * Prices are stored as plain numbers; the currency lives here and nowhere
 * else, so changing it is a one-line edit rather than a hunt through the
 * components.
 *
 * The formatter is built once at module load rather than per call — Intl
 * formatters are expensive to construct and this runs for every card in
 * every grid.
 */

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
