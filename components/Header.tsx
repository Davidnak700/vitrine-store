import Link from "next/link";
import Nav from "@/components/Nav";
import SearchBar from "@/components/SearchBar";
import CartButton from "@/components/CartButton";

export default function Header() {
  return (
    <header className="bg-surface-card shadow-sm">
      <div className="mx-auto max-w-page px-6">
        {/* Row 1: wordmark, then search and cart on the right */}
        <div className="flex h-16 items-center gap-4">
          <Link
            href="/"
            className="flex min-h-11 items-center rounded-md font-display text-h3 font-medium tracking-tight text-ink"
          >
            Vitrine
          </Link>

          {/* From lg up the categories sit inline with the wordmark */}
          <div className="ml-4 hidden min-w-0 flex-1 lg:block">
            <Nav />
          </div>

          <div className="ml-auto flex items-center gap-2 lg:ml-0">
            <SearchBar />
            <CartButton />
          </div>
        </div>

        {/* Below lg the categories get their own scrollable row */}
        <div className="pb-2 lg:hidden">
          <Nav />
        </div>
      </div>
    </header>
  );
}
