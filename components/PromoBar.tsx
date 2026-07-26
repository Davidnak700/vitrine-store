import Link from "next/link";

/** The current offer, above the header on every page. */
export default function PromoBar() {
  return (
    <div className="bg-ink text-surface-card">
      <div className="mx-auto flex max-w-page flex-wrap items-center justify-center gap-x-2 px-6 text-small">
        <span className="py-2">Free next-day delivery on everything this week.</span>
        <Link
          href="/sale"
          className="flex min-h-11 items-center rounded-sm font-medium underline underline-offset-4 transition-opacity hover:opacity-80"
        >
          See the deals
        </Link>
      </div>
    </div>
  );
}
