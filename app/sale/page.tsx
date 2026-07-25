import type { Metadata } from "next";
import Link from "next/link";
import CategoryFilter from "@/components/CategoryFilter";
import ProductGrid from "@/components/ProductGrid";
import { getDeals } from "@/lib/products";

export const metadata: Metadata = {
  title: "Deals — Vitrine",
  description:
    "Everything reduced this week, across all six categories. Biggest saving first.",
};

/**
 * The second navigation axis. Same products as the catalogue, reached a
 * different way — which is why this route mirrors the category tree instead of
 * being a single flat list with a filter bolted on.
 *
 * Deals are not in the header on purpose: they are entered from the footer,
 * from the home page row, and from each category page.
 */
export default function SalePage() {
  // Sorted by deepest saving, which is what someone browsing deals is after.
  const deals = getDeals();

  return (
    <div className="mx-auto max-w-page px-6 py-12 md:py-24">
      <h1 className="font-display text-h1 font-medium text-ink">
        Reduced this week
      </h1>
      <p className="mt-4 max-w-xl text-body-lg text-ink-muted">
        {deals.length} products are down in price, biggest saving first. Every
        one is the same product at the same warranty — we do not run a separate
        clearance range.
      </p>

      <div className="mt-10">
        <CategoryFilter basePath="/sale" allLabel="All deals" />
      </div>

      <div className="mt-12">
        <ProductGrid
          products={deals}
          emptyMessage="Nothing is reduced at the moment."
        />
      </div>

      <p className="mt-12 text-small text-ink-muted">
        Looking for something that is not on offer?{" "}
        <Link
          href="/catalog"
          className="rounded-sm font-medium text-accent transition-opacity hover:opacity-80"
        >
          Browse the full catalogue
        </Link>
        .
      </p>
    </div>
  );
}
