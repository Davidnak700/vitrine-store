import type { Metadata } from "next";
import Link from "next/link";
import CategoryFilter from "@/components/CategoryFilter";
import ProductGrid from "@/components/ProductGrid";
import { categories } from "@/lib/categories";
import { getProductsByCategory } from "@/lib/products";

export const metadata: Metadata = {
  title: "Catalogue — Vitrine",
  description:
    "Everything we stock: laptops, phones, audio, TVs, smart home and accessories.",
};

export default function CatalogPage() {
  return (
    <div className="mx-auto max-w-page px-6 py-12 md:py-24">
      <h1 className="font-display text-h1 font-medium text-ink">Catalogue</h1>
      <p className="mt-4 max-w-xl text-body-lg text-ink-muted">
        Thirty-six products, six to a shelf. We stock a small range on purpose,
        so there is always someone here who has used the thing you are asking
        about.
      </p>

      <div className="mt-10">
        <CategoryFilter basePath="/catalog" />
      </div>

      {categories.map((category) => (
        <section key={category.slug} className="mt-16">
          <div className="flex flex-wrap items-baseline justify-between gap-4">
            <h2 className="font-display text-h2 font-medium text-ink">
              {category.name}
            </h2>
            <Link
              href={`/catalog/${category.slug}`}
              className="rounded-sm text-small font-medium text-accent transition-opacity hover:opacity-80"
            >
              Just {category.name.toLowerCase()}
            </Link>
          </div>
          <div className="mt-8">
            <ProductGrid products={getProductsByCategory(category.slug)} />
          </div>
        </section>
      ))}
    </div>
  );
}
