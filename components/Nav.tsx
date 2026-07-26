import Link from "next/link";
import { categories } from "@/lib/categories";

/**
 * The six categories, straight in the header.
 *
 * The row wraps onto a second line when it runs out of width. It used to
 * scroll sideways with the scrollbar hidden, which measured badly at 375px:
 * the six pills need 487px against 327px of window, so "Smart Home" was cut
 * mid-word and "Accessories" sat off-screen entirely, reachable only by a
 * swipe with nothing to suggest it existed. The comment here used to claim
 * the scroller kept every category one tap away. It did not.
 *
 * Wrapping costs a second line of header on a phone and nothing on desktop,
 * where six pills fit on one line and the wrap never triggers. It also keeps
 * this a server component: a burger menu would need open/closed state, and
 * therefore "use client".
 */
export default function Nav() {
  return (
    <nav aria-label="Categories" className="min-w-0">
      <ul className="flex flex-wrap items-center gap-1">
        {categories.map((category) => (
          <li key={category.slug}>
            <Link
              href={`/catalog/${category.slug}`}
              className="block rounded-pill px-3 py-2 text-small whitespace-nowrap text-ink-muted transition-colors hover:bg-surface-well hover:text-ink"
            >
              {category.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
