import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import CategoryFilter from "@/components/CategoryFilter";
import ProductGrid from "@/components/ProductGrid";
import { categories, getCategory, isCategory } from "@/lib/categories";
import { getDealsByCategory, getProductsByCategory } from "@/lib/products";

type Params = { params: Promise<{ category: string }> };

export function generateStaticParams() {
  return categories.map((category) => ({ category: category.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { category } = await params;
  if (!isCategory(category)) return {};
  const { name } = getCategory(category);
  return {
    title: `${name} deals — Vitrine`,
    description: `${name} reduced this week at Vitrine.`,
  };
}

export default async function SaleCategoryPage({ params }: Params) {
  const { category } = await params;

  if (!isCategory(category)) notFound();

  const { name } = getCategory(category);
  const deals = getDealsByCategory(category);
  const total = getProductsByCategory(category).length;

  return (
    <div className="mx-auto max-w-page px-6 py-12 md:py-24">
      <h1 className="font-display text-h1 font-medium text-ink">
        {name} deals
      </h1>
      <p className="mt-4 max-w-xl text-body-lg text-ink-muted">
        {deals.length} of our {total} {name.toLowerCase()} are reduced this
        week.
      </p>

      <div className="mt-10">
        <CategoryFilter
          basePath="/sale"
          current={category}
          allLabel="All deals"
        />
      </div>

      <div className="mt-12">
        <ProductGrid
          products={deals}
          emptyMessage={`Nothing in ${name.toLowerCase()} is reduced at the moment.`}
          headingLevel={2}
        />
      </div>

      {/* The same shelf on the other axis. */}
      <p className="mt-12 text-small text-ink-muted">
        <Link
          href={`/catalog/${category}`}
          className="rounded-sm font-medium text-accent transition-opacity hover:opacity-80"
        >
          See all {total} {name.toLowerCase()}
        </Link>{" "}
        including the ones at full price.
      </p>
    </div>
  );
}
