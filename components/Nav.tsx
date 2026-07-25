import Link from "next/link";
import { categories } from "@/lib/categories";

/**
 * The six categories, straight in the header.
 *
 * On narrow screens the row scrolls sideways instead of collapsing into a
 * burger menu. That keeps every category one tap away and keeps this a server
 * component — a burger would need open/closed state, and therefore "use client".
 */
export default function Nav() {
  return (
    <nav aria-label="Categories" className="min-w-0">
      <ul className="flex items-center gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
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
