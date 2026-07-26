import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import AddToCart from "@/components/AddToCart";
import PriceTag from "@/components/PriceTag";
import SpecTable from "@/components/SpecTable";
import { getCategory } from "@/lib/categories";
import { compareHref } from "@/lib/compare";
import { formatSaving, productImageAlt } from "@/lib/format";
import { getProduct, products } from "@/lib/products";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return {};
  return {
    title: `${product.name} — Vitrine`,
    description: product.shortDescription,
  };
}

export default async function ProductPage({ params }: Params) {
  const { slug } = await params;
  const product = getProduct(slug);

  if (!product) notFound();

  const category = getCategory(product.category);
  const onSale = product.oldPrice !== undefined;

  return (
    <div className="mx-auto max-w-page px-6 py-12 md:py-24">
      <Link
        href={`/catalog/${category.slug}`}
        className="rounded-sm text-small font-medium text-accent transition-opacity hover:opacity-80"
      >
        &larr; All {category.name.toLowerCase()}
      </Link>

      <div className="mt-8 grid gap-10 lg:grid-cols-[3fr_2fr] lg:gap-16">
        {/* The illustration, at the size it was drawn for */}
        <div className="rounded-xl bg-surface-well p-8 md:p-12">
          <Image
            src={product.image}
            alt={productImageAlt(product)}
            width={400}
            height={300}
            className="h-auto w-full"
            sizes="(min-width: 1024px) 600px, 90vw"
            priority
            unoptimized={product.image.endsWith(".svg")}
          />
        </div>

        <div>
          <p className="text-label font-semibold uppercase text-ink-muted">
            {product.brand}
          </p>
          <h1 className="mt-3 font-display text-h1 font-medium text-ink">
            {product.name}
          </h1>
          <p className="mt-4 text-body-lg text-ink-muted">
            {product.shortDescription}
          </p>

          <div className="mt-8">
            <PriceTag product={product} />
            {onSale && (
              <p className="mt-2 inline-block rounded-pill bg-accent-tint px-3 py-1 text-label font-semibold uppercase text-accent">
                Save {formatSaving(product.price, product.oldPrice!)}
              </p>
            )}
          </div>

          <div className="mt-8">
            {product.inStock ? (
              // The only client component on this page. The page itself stays
              // a server component.
              <AddToCart slug={product.slug} name={product.name} />
            ) : (
              <p className="rounded-pill bg-surface-well px-6 py-3 text-body text-ink-muted inline-block">
                Out of stock — back soon
              </p>
            )}
          </div>

          <p className="mt-4">
            <Link
              href={compareHref([product.slug])}
              className="rounded-sm text-small font-medium text-accent transition-opacity hover:opacity-80"
            >
              Compare with other {category.name.toLowerCase()}
            </Link>
          </p>

          <p className="mt-10 text-body text-ink-muted">{product.description}</p>
        </div>
      </div>

      <section className="mt-16 max-w-2xl">
        <h2 className="font-display text-h2 font-medium text-ink">
          Specifications
        </h2>
        <div className="mt-6">
          <SpecTable specs={product.specs} />
        </div>
      </section>
    </div>
  );
}
