import Image from "next/image";
import { getProductsByCategory } from "@/lib/products";

/**
 * TEMPORARY — review page for the generated product art.
 *
 * Delete this whole route in stage 3, when the real ProductCard and
 * ProductGrid exist and /catalog/audio shows the same thing properly.
 *
 * The card markup here deliberately prefigures ProductCard: same tokens, same
 * radii, same grid steps. Prices are absent on purpose — formatting lives in
 * lib/format.ts, which does not exist until stage 3, and inlining a price here
 * would break the rule that says prices are formatted in exactly one place.
 */

export const metadata = {
  title: "Preview — audio illustrations",
};

export default function PreviewAudio() {
  const audio = getProductsByCategory("audio");

  return (
    <div className="mx-auto max-w-page px-6 py-12 md:py-24">
      <p className="text-label font-semibold uppercase text-ink-muted">
        Temporary preview
      </p>
      <h1 className="mt-4 font-display text-h1 font-medium text-ink">
        Audio illustrations
      </h1>
      <p className="mt-4 max-w-xl text-body text-ink-muted">
        The six generated drawings in the real card layout. Four columns on a
        wide screen, three at 1024px, two at 640px, one below that — resize the
        window to check the row stays level at every width.
      </p>

      <ul className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {audio.map((product) => (
          <li
            key={product.slug}
            className="rounded-lg bg-surface-card p-4 shadow-sm transition-shadow duration-200 hover:shadow-md"
          >
            <div className="rounded-xl bg-surface-well p-4">
              <Image
                src={product.image}
                alt={product.name}
                width={400}
                height={300}
                className="h-auto w-full"
                // SVG is served as-is: Next's optimiser refuses SVG by
                // default, and a vector has nothing to optimise anyway.
                unoptimized
              />
            </div>
            <h2 className="mt-4 text-body font-medium text-ink">
              {product.name}
            </h2>
            <p className="mt-1 text-small text-ink-muted">{product.brand}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
