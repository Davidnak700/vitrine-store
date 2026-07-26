import Link from "next/link";
import { categories, type Category } from "@/lib/categories";

/**
 * Category selection, as links rather than state.
 *
 * This is why the component is not a client component: which category is
 * active comes from the URL, so the page already knows it and passes it down.
 * Every choice is a real address that can be shared, bookmarked and stepped
 * back out of with the browser's own back button.
 *
 * `basePath` is "/catalog" now and "/sale" from stage 5, since the deals
 * section mirrors the same category tree.
 */
export default function CategoryFilter({
  basePath,
  current,
  allLabel = "Everything",
}: {
  basePath: string;
  current?: Category;
  allLabel?: string;
}) {
  const pill =
    "flex min-h-11 items-center rounded-pill px-4 text-small transition-colors whitespace-nowrap";
  const active = "bg-accent-tint font-medium text-accent";
  const idle = "bg-surface-card text-ink-muted hover:text-ink";

  return (
    <nav aria-label="Categories">
      <ul className="flex flex-wrap gap-2">
        <li>
          <Link
            href={basePath}
            aria-current={current === undefined ? "page" : undefined}
            className={`${pill} ${current === undefined ? active : idle}`}
          >
            {allLabel}
          </Link>
        </li>
        {categories.map((category) => (
          <li key={category.slug}>
            <Link
              href={`${basePath}/${category.slug}`}
              aria-current={current === category.slug ? "page" : undefined}
              className={`${pill} ${current === category.slug ? active : idle}`}
            >
              {category.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
