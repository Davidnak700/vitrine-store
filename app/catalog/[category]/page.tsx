import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import CategoryFilter from "@/components/CategoryFilter";
import CompareBar from "@/components/CompareBar";
import ProductGrid from "@/components/ProductGrid";
import { categories, getCategory, isCategory } from "@/lib/categories";
import {
  COMPARE_PARAM,
  compareHref,
  parseForCategory,
  toggleHref,
} from "@/lib/compare";
import { getDealsByCategory, getProductsByCategory } from "@/lib/products";

type Params = {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

/**
 * `params` is a promise in this version of Next and has to be awaited — it was
 * a plain object in Next 14 and earlier.
 */

export function generateStaticParams() {
  return categories.map((category) => ({ category: category.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { category } = await params;
  if (!isCategory(category)) return {};
  const { name } = getCategory(category);
  return {
    title: `${name} — Vitrine`,
    description: `Our ${name.toLowerCase()} range: six products, chosen so there is a right answer for most people.`,
  };
}

export default async function CategoryPage({ params, searchParams }: Params) {
  const { category } = await params;

  // An unknown segment is a 404, not an empty grid.
  if (!isCategory(category)) notFound();

  const { name } = getCategory(category);
  const products = getProductsByCategory(category);
  const reduced = getDealsByCategory(category).length;

  // The comparison being built, held in this page's own address. Reading a
  // search param makes the route render on demand rather than at build time —
  // the trade for having no client state.
  const basePath = `/catalog/${category}`;
  const selection = parseForCategory((await searchParams)[COMPARE_PARAM], category);
  const selected = selection.products.map((p) => p.slug);

  return (
    <div className="mx-auto max-w-page px-6 py-12 md:py-24">
      <h1 className="font-display text-h1 font-medium text-ink">{name}</h1>
      <p className="mt-4 max-w-xl text-body-lg text-ink-muted">
        {products.length} products
        {reduced > 0 ? `, ${reduced} of them reduced this week` : ""}.
      </p>

      <div className="mt-10">
        <CategoryFilter basePath="/catalog" current={category} />
      </div>

      {selected.length === 0 && (
        <p className="mt-6 text-small text-ink-muted">
          Tick <span className="font-medium text-ink">Compare</span> on two or
          more products to put them side by side.
        </p>
      )}

      <div className="mt-12">
        <ProductGrid
          products={products}
          emptyMessage="This shelf is empty just now."
          compare={{ basePath, selected }}
        />
      </div>

      {selected.length > 0 && (
        <div className="mt-8">
          <CompareBar
            products={selection.products}
            removeHref={(slug) => toggleHref(basePath, selected, slug) ?? basePath}
            actionHref={compareHref(selected)}
            sticky
          />
        </div>
      )}

      {/* The same shelf on the other axis. */}
      {reduced > 0 && (
        <p className="mt-12 text-small text-ink-muted">
          <Link
            href={`/sale/${category}`}
            className="rounded-sm font-medium text-accent transition-opacity hover:opacity-80"
          >
            Just the {reduced} reduced {name.toLowerCase()}
          </Link>{" "}
          if you are shopping on price.
        </p>
      )}
    </div>
  );
}
