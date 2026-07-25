import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import CategoryFilter from "@/components/CategoryFilter";
import ProductGrid from "@/components/ProductGrid";
import { categories, getCategory, isCategory } from "@/lib/categories";
import { getDealsByCategory, getProductsByCategory } from "@/lib/products";

type Params = { params: Promise<{ category: string }> };

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

export default async function CategoryPage({ params }: Params) {
  const { category } = await params;

  // An unknown segment is a 404, not an empty grid.
  if (!isCategory(category)) notFound();

  const { name } = getCategory(category);
  const products = getProductsByCategory(category);
  const reduced = getDealsByCategory(category).length;

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

      <div className="mt-12">
        <ProductGrid
          products={products}
          emptyMessage="This shelf is empty just now."
        />
      </div>

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
