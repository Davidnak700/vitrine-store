const MagnifyingGlass = () => (
  <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className="size-4">
    <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.7" />
    <path
      d="m13.5 13.5 3 3"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
    />
  </svg>
);

/**
 * Search entry.
 *
 * A plain GET form. Submitting navigates to /search?q=…, which is exactly the
 * URL-driven behaviour we want — shareable, bookmarkable, back button works —
 * and the browser does all of it. No client component, no JavaScript, no state.
 *
 * In the header the field is left empty rather than reflecting the current
 * query: it sits on every page, and a server component in the header cannot
 * read another page's search params. The search page renders its own, prefilled.
 */
export default function SearchBar({
  defaultValue,
  size = "compact",
}: {
  defaultValue?: string;
  size?: "compact" | "full";
}) {
  const full = size === "full";
  const id = full ? "search-page" : "search-header";

  return (
    <form
      action="/search"
      method="get"
      role="search"
      className={
        full
          ? "flex items-center gap-2 rounded-pill bg-surface-card py-2 pl-5 pr-2 shadow-sm"
          : "flex items-center gap-1 rounded-pill bg-surface-well pl-3 pr-1"
      }
    >
      <label htmlFor={id} className="sr-only">
        Search products by name or brand
      </label>

      {full && (
        <span className="text-ink-muted">
          <MagnifyingGlass />
        </span>
      )}

      <input
        id={id}
        type="search"
        name="q"
        defaultValue={defaultValue}
        placeholder="Search"
        className={
          full
            ? "min-w-0 flex-1 bg-transparent py-2 text-body text-ink outline-none placeholder:text-ink-muted"
            : "w-24 min-w-0 bg-transparent py-2 text-small text-ink outline-none placeholder:text-ink-muted lg:w-32"
        }
      />

      {/* In the compact form the magnifying glass is the submit control, so
          there is no invisible-but-focusable button in the tab order. */}
      <button
        type="submit"
        className={
          full
            ? "flex min-h-11 items-center rounded-pill bg-ink px-5 text-small font-medium text-surface-card transition-opacity hover:opacity-90"
            : "flex size-11 items-center justify-center rounded-pill text-ink-muted transition-colors hover:text-accent"
        }
      >
        {full ? (
          "Search"
        ) : (
          <>
            <MagnifyingGlass />
            <span className="sr-only">Search</span>
          </>
        )}
      </button>
    </form>
  );
}
