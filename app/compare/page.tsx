import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import CompareBar from "@/components/CompareBar";
import PriceTag from "@/components/PriceTag";
import { categories, getCategory, isCategory } from "@/lib/categories";
import { hrefWith, MAX_COMPARE, parseItems } from "@/lib/compare";
import { getProductsByCategory } from "@/lib/products";

export const metadata: Metadata = {
  title: "Compare — Vitrine",
  description:
    "Put two to four products side by side. The comparison lives in the address, so you can send someone the link.",
};

type Search = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function ComparePage({ searchParams }: Search) {
  const query = await searchParams;
  const { products, ignored } = parseItems(query.items);

  // Which shelf the picker offers. Taken from the selection when there is one,
  // otherwise from ?category= so an empty comparison can still start somewhere.
  const rawCategory = Array.isArray(query.category)
    ? query.category[0]
    : query.category;
  const category =
    products[0]?.category ??
    (rawCategory && isCategory(rawCategory) ? rawCategory : undefined);

  const candidates = category
    ? getProductsByCategory(category).filter(
        (p) => !products.some((chosen) => chosen.slug === p.slug),
      )
    : [];

  const labels = products[0]?.specs.map((s) => s.label) ?? [];
  const valueFor = (slug: string, label: string) =>
    products
      .find((p) => p.slug === slug)
      ?.specs.find((s) => s.label === label)?.value ?? "—";

  return (
    <div className="mx-auto max-w-page px-6 py-12 md:py-24">
      <h1 className="font-display text-h1 font-medium text-ink">Compare</h1>
      <p className="mt-4 max-w-xl text-body-lg text-ink-muted">
        Up to {MAX_COMPARE} products from one shelf, side by side. The selection
        is in the address, so you can send this page to someone and they will
        see exactly what you see.
      </p>

      {ignored.length > 0 && (
        <p className="mt-6 rounded-lg bg-accent-tint px-4 py-3 text-small text-accent">
          Left out: {ignored.join(", ")}. A comparison holds up to{" "}
          {MAX_COMPARE} products from a single category — specifications only
          line up within one shelf.
        </p>
      )}

      {products.length > 0 && (
        <div className="mt-8">
          <CompareBar products={products} />
        </div>
      )}

      {/* No selection yet: offer the shelves. */}
      {products.length === 0 && (
        <section className="mt-12">
          <h2 className="font-display text-h2 font-medium text-ink">
            Pick a shelf to compare
          </h2>
          <ul className="mt-6 flex flex-wrap gap-2">
            {categories.map((entry) => (
              <li key={entry.slug}>
                <Link
                  href={`/compare?category=${entry.slug}`}
                  className="block rounded-pill bg-surface-card px-4 py-2 text-small text-ink shadow-sm transition-shadow duration-200 hover:shadow-md"
                >
                  {entry.name}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* One product chosen: the table needs a second column to mean anything. */}
      {products.length === 1 && (
        <p className="mt-8 text-body text-ink-muted">
          Add at least one more product to see them side by side.
        </p>
      )}

      {products.length >= 2 && (
        <section className="mt-12">
          <h2 className="sr-only">Comparison</h2>
          {/* Wide content scrolls inside its own box; the page never does. */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-left">
              <caption className="sr-only">
                {products.map((p) => p.name).join(" compared with ")}
              </caption>
              <thead>
                <tr>
                  <th scope="col" className="w-40 p-4 align-bottom">
                    <span className="sr-only">Specification</span>
                  </th>
                  {products.map((product) => (
                    <th
                      key={product.slug}
                      scope="col"
                      className="p-4 align-bottom"
                    >
                      <Link href={`/product/${product.slug}`} className="block">
                        <span className="block rounded-xl bg-surface-well p-3">
                          <Image
                            src={product.image}
                            alt={`Illustration of the ${product.name}`}
                            width={400}
                            height={300}
                            sizes="200px"
                            className="h-auto w-full"
                            unoptimized={product.image.endsWith(".svg")}
                          />
                        </span>
                        <span className="mt-3 block text-body font-medium text-ink">
                          {product.name}
                        </span>
                        <span className="mt-1 block text-small text-ink-muted">
                          {product.brand}
                        </span>
                      </Link>
                      <div className="mt-2">
                        <PriceTag product={product} />
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="bg-surface-well">
                  <th scope="row" className="p-4 text-small text-ink-muted">
                    Availability
                  </th>
                  {products.map((product) => (
                    <td
                      key={product.slug}
                      className="p-4 text-small font-medium text-ink"
                    >
                      {product.inStock ? "In stock" : "Out of stock"}
                    </td>
                  ))}
                </tr>
                {labels.map((label, index) => (
                  <tr
                    key={label}
                    className={index % 2 === 0 ? "" : "bg-surface-well"}
                  >
                    <th scope="row" className="p-4 text-small text-ink-muted">
                      {label}
                    </th>
                    {products.map((product) => (
                      <td
                        key={product.slug}
                        className="p-4 text-small font-medium text-ink"
                      >
                        {valueFor(product.slug, label)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {category && candidates.length > 0 && products.length < MAX_COMPARE && (
        <section className="mt-12">
          <h2 className="font-display text-h3 font-medium text-ink">
            Add another {getCategory(category).name.toLowerCase()}
          </h2>
          <ul className="mt-6 flex flex-wrap gap-2">
            {candidates.map((product) => (
              <li key={product.slug}>
                <Link
                  href={hrefWith(products, product.slug)}
                  className="block rounded-pill bg-surface-card px-4 py-2 text-small text-ink shadow-sm transition-shadow duration-200 hover:shadow-md"
                >
                  {product.name}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {category && (
        <p className="mt-12 text-small text-ink-muted">
          <Link
            href={`/catalog/${category}`}
            className="rounded-sm font-medium text-accent transition-opacity hover:opacity-80"
          >
            Back to all {getCategory(category).name.toLowerCase()}
          </Link>
        </p>
      )}
    </div>
  );
}
