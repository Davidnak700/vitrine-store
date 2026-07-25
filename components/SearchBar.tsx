import Link from "next/link";

/**
 * Stage 1 stub: appearance only, no search logic.
 *
 * It is a link rather than a text input on purpose — an input that does not
 * do anything yet would lie to anyone who typed into it. In stage 8 this
 * becomes a real field posting to /search?q=…
 */
export default function SearchBar() {
  return (
    <Link
      href="/search"
      className="flex items-center gap-2 rounded-pill bg-surface-well px-4 py-2 text-small text-ink-muted transition-colors hover:text-ink"
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 20 20"
        fill="none"
        className="size-4 shrink-0"
      >
        <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.7" />
        <path
          d="m13.5 13.5 3 3"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
        />
      </svg>
      <span className="hidden lg:inline">Search</span>
      <span className="sr-only lg:hidden">Search</span>
    </Link>
  );
}
