import Link from "next/link";
import { categories } from "@/lib/categories";

/**
 * Home page — stage 1.
 *
 * Hero, category tiles and the trust block are finished. The two product rows
 * (bestsellers, new arrivals) are shown as empty wells: there is no product
 * data until stage 2 and no ProductGrid until stage 3. Both rows are replaced
 * by the real <ProductGrid /> then, and PlaceholderRow is deleted.
 */

const trust = [
  {
    title: "Two-year warranty",
    body: "Every product is covered for two years. If it breaks, we sort it out — you do not deal with the manufacturer.",
  },
  {
    title: "Free next-day delivery",
    body: "Order before 6pm and it arrives tomorrow. Delivery is free on everything, with no minimum basket.",
  },
  {
    title: "Thirty days to change your mind",
    body: "Send anything back within thirty days, for any reason at all. We pay the return postage.",
  },
];

function PlaceholderRow() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {[0, 1, 2, 3].map((slot) => (
        <div
          key={slot}
          className="rounded-xl bg-surface-well"
          style={{ aspectRatio: "4 / 5" }}
        />
      ))}
    </div>
  );
}

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="mx-auto max-w-page px-6 py-12 md:py-24">
        <span className="inline-block rounded-pill bg-accent-tint px-3 py-1 text-label font-semibold uppercase text-accent">
          New this month
        </span>

        <h1 className="mt-6 max-w-3xl font-display text-display font-medium text-ink">
          Good electronics, explained properly.
        </h1>

        <p className="mt-6 max-w-xl text-body-lg text-ink-muted">
          We stock a small range and we know all of it. No wall of numbers, no
          upselling — just a plain answer about which one suits you.
        </p>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            href="/catalog"
            className="rounded-pill bg-ink px-6 py-3 text-body font-medium text-surface-card transition-opacity hover:opacity-90"
          >
            Browse the catalogue
          </Link>
          <Link
            href="/sale"
            className="rounded-pill bg-surface-card px-6 py-3 text-body font-medium text-ink shadow-sm transition-shadow duration-200 hover:shadow-md"
          >
            This week&rsquo;s deals
          </Link>
        </div>
      </section>

      {/* Bestsellers — real products arrive in stage 3 */}
      <section className="mx-auto max-w-page px-6 py-12 md:py-24">
        <div className="flex flex-wrap items-baseline justify-between gap-4">
          <h2 className="font-display text-h2 font-medium text-ink">
            What people actually buy
          </h2>
          <Link
            href="/catalog"
            className="rounded-sm text-small font-medium text-accent transition-opacity hover:opacity-80"
          >
            See everything
          </Link>
        </div>
        <div className="mt-8">
          <PlaceholderRow />
        </div>
      </section>

      {/* Category tiles */}
      <section className="mx-auto max-w-page px-6 py-12 md:py-24">
        <h2 className="font-display text-h2 font-medium text-ink">
          Start with a shelf
        </h2>
        <ul className="mt-8 grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-6">
          {categories.map((category) => (
            <li key={category.slug}>
              <Link
                href={`/catalog/${category.slug}`}
                className="group block rounded-lg bg-surface-card p-4 shadow-sm transition-shadow duration-200 hover:shadow-md"
              >
                {/* Category artwork lands here once the images do */}
                <div
                  className="rounded-md bg-surface-well"
                  style={{ aspectRatio: "1 / 1" }}
                />
                <span className="mt-3 block text-small font-medium text-ink transition-colors group-hover:text-accent">
                  {category.name}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Deals — the second navigation axis, since Deals is not in the header.
          Real products arrive in stage 3, the /sale routes in stage 5. */}
      <section className="mx-auto max-w-page px-6 py-12 md:py-24">
        <div className="flex flex-wrap items-baseline justify-between gap-4">
          <h2 className="font-display text-h2 font-medium text-ink">
            Reduced this week
          </h2>
          <Link
            href="/sale"
            className="rounded-sm text-small font-medium text-accent transition-opacity hover:opacity-80"
          >
            All deals
          </Link>
        </div>
        <div className="mt-8">
          <PlaceholderRow />
        </div>
      </section>

      {/* New arrivals — real products arrive in stage 3 */}
      <section className="mx-auto max-w-page px-6 py-12 md:py-24">
        <h2 className="font-display text-h2 font-medium text-ink">
          Just landed
        </h2>
        <div className="mt-8">
          <PlaceholderRow />
        </div>
      </section>

      {/* Trust block */}
      <section className="mx-auto max-w-page px-6 py-12 md:py-24">
        <ul className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {trust.map((item) => (
            <li
              key={item.title}
              className="rounded-lg bg-surface-card p-8 shadow-sm"
            >
              <h3 className="font-display text-h3 font-medium text-ink">
                {item.title}
              </h3>
              <p className="mt-3 text-body text-ink-muted">{item.body}</p>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
