import type { Spec } from "@/lib/products";

/**
 * The specification list on a product page.
 *
 * Rows are separated by alternating surface fill rather than by rules — the
 * design has no borders anywhere in the resting state, and striping reads as
 * cleanly for scanning across a row.
 *
 * A description list rather than a table: this is one product's label/value
 * pairs, not a grid of data. The comparison page in stage 6 needs a real
 * <table>, because there the columns carry meaning too.
 */
export default function SpecTable({ specs }: { specs: Spec[] }) {
  return (
    <dl className="overflow-hidden rounded-lg">
      {specs.map((spec, index) => (
        <div
          key={spec.label}
          className={`flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 px-4 py-3 ${
            index % 2 === 0 ? "bg-surface-well" : ""
          }`}
        >
          <dt className="text-small text-ink-muted">{spec.label}</dt>
          <dd className="text-small font-medium text-ink">{spec.value}</dd>
        </div>
      ))}
    </dl>
  );
}
