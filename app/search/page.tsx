import type { Metadata } from "next";
import Link from "next/link";
import ProductGrid from "@/components/ProductGrid";
import SearchBar from "@/components/SearchBar";
import { searchProducts } from "@/lib/products";

export const metadata: Metadata = {
  title: "Search — Vitrine",
  description: "Search the catalogue by product name or brand.",
};

type Search = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

/**
 * Results for ?q=…
 *
 * The query is read from the address and nowhere else, so a search can be
 * shared and the back button steps through searches the way it should. Same
 * principle as the category filters and the comparison.
 */
export default async function SearchPage({ searchParams }: Search) {
  const raw = (await searchParams).q;
  const query = (Array.isArray(raw) ? raw[0] : (raw ?? "")).trim();
  const results = searchProducts(query);
  const searched = query.length > 0;

  return (
    <div className="mx-auto max-w-page px-6 py-12 md:py-24">
      <h1 className="font-display text-h1 font-medium text-ink">Search</h1>
      <p className="mt-4 max-w-xl text-body-lg text-ink-muted">
        By product name or brand. Thirty-six products, so this is a short list
        either way.
      </p>

      <div className="mt-8 max-w-xl">
        <SearchBar defaultValue={query} size="full" />
      </div>

      {searched && (
        <p className="mt-8 text-small text-ink-muted" aria-live="polite">
          {results.length === 0
            ? `Nothing matches “${query}”.`
            : `${results.length} ${results.length === 1 ? "result" : "results"} for “${query}”.`}
        </p>
      )}

      {searched && results.length > 0 && (
        <div className="mt-8">
          <ProductGrid products={results} headingLevel={2} />
        </div>
      )}

      {searched && results.length === 0 && (
        <p className="mt-6 text-body text-ink-muted">
          Try a brand — Halden, Nordvale, Kestrel, Cairn, Tolvan, Vellum, Orla,
          Brisk, Sable or Ferrite — or{" "}
          <Link
            href="/catalog"
            className="rounded-sm font-medium text-accent transition-opacity hover:opacity-80"
          >
            browse the catalogue
          </Link>
          .
        </p>
      )}

      {!searched && (
        <p className="mt-8 text-body text-ink-muted">
          Type something above, or{" "}
          <Link
            href="/catalog"
            className="rounded-sm font-medium text-accent transition-opacity hover:opacity-80"
          >
            browse the catalogue
          </Link>{" "}
          instead.
        </p>
      )}
    </div>
  );
}
