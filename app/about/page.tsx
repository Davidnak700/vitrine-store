import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About — Vitrine",
  description:
    "Who we are, how we choose what to stock, and an honest note about what this site actually is.",
};

const principles = [
  {
    title: "A small range, properly known",
    body: "Six products to a shelf, thirty-six in total. That is few enough that everyone here has handled all of them, so when you ask which one to buy you get an answer rather than a comparison table.",
  },
  {
    title: "No upselling",
    body: "If the cheaper one suits you, we will say so. Several of our product descriptions talk people out of the expensive option, which is bad for a single sale and good for the ten years afterwards.",
  },
  {
    title: "Plain language",
    body: "Specifications are on every product page for the people who want them, at the bottom, after the part that explains what the thing is actually like to live with.",
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-page px-6 py-12 md:py-24">
      <h1 className="font-display text-h1 font-medium text-ink">
        About Vitrine
      </h1>
      <p className="mt-6 max-w-xl text-body-lg text-ink-muted">
        We sell consumer electronics to people who do not enjoy shopping for
        consumer electronics.
      </p>

      <section className="mt-16">
        <h2 className="font-display text-h2 font-medium text-ink">
          How we choose what to stock
        </h2>
        <ul className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          {principles.map((item) => (
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

      <section className="mt-16 max-w-2xl">
        <h2 className="font-display text-h2 font-medium text-ink">
          An honest note
        </h2>
        <p className="mt-6 text-body text-ink-muted">
          Vitrine is not a real shop. It is a portfolio project: the brands, the
          products, the prices and the reviews are all invented, no order can be
          placed, and no payment is ever taken. The basket works, but it only
          ever holds imaginary things.
        </p>
        <p className="mt-4 text-body text-ink-muted">
          The product pictures are not photographs either. Every one of them was
          generated, from a single model and a single prompt, because a
          photograph of a product that does not exist is a contradiction we
          spent a long time failing to resolve.
        </p>
        <p className="mt-8">
          <Link
            href="/catalog"
            className="rounded-pill bg-ink px-6 py-3 text-body font-medium text-surface-card transition-opacity hover:opacity-90"
          >
            Have a look at the catalogue
          </Link>
        </p>
      </section>
    </div>
  );
}
