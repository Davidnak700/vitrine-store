import Link from "next/link";

/**
 * Organised by customer task, not by product type. Deals and About live here
 * because they were deliberately kept out of the header.
 *
 * Entries whose page is not in the planned route list are plain text for now,
 * not links to nowhere. They become links as those pages are built.
 */

type FooterItem = { label: string; href?: string };

type FooterColumn = { heading: string; items: FooterItem[] };

const columns: FooterColumn[] = [
  {
    heading: "Deals",
    items: [
      { label: "All deals", href: "/sale" },
      { label: "Laptop deals", href: "/sale/laptops" },
      { label: "Phone deals", href: "/sale/phones" },
      { label: "Audio deals", href: "/sale/audio" },
    ],
  },
  {
    heading: "Orders & Shipping",
    items: [
      { label: "Delivery options" },
      { label: "Track an order" },
      { label: "Returns" },
      { label: "Order status" },
    ],
  },
  {
    heading: "Payment",
    items: [
      { label: "Ways to pay" },
      { label: "Paying in instalments" },
      { label: "Gift cards" },
      { label: "Invoices" },
    ],
  },
  {
    heading: "Support",
    items: [
      { label: "Help centre" },
      { label: "Contact us" },
      { label: "Warranty" },
      { label: "Set-up guides" },
    ],
  },
  {
    heading: "About",
    items: [
      { label: "About Vitrine", href: "/about" },
      { label: "Compare products", href: "/compare" },
      { label: "Full catalogue", href: "/catalog" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-surface-card">
      <div className="mx-auto max-w-page px-6 py-12 md:py-24">
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-3 lg:grid-cols-5">
          {columns.map((column) => (
            <div key={column.heading}>
              <h2 className="text-label font-semibold uppercase text-ink-muted">
                {column.heading}
              </h2>
              <ul className="mt-4 space-y-3">
                {column.items.map((item) => (
                  <li key={item.label} className="text-small">
                    {item.href ? (
                      <Link
                        href={item.href}
                        className="rounded-sm text-ink transition-colors hover:text-accent"
                      >
                        {item.label}
                      </Link>
                    ) : (
                      <span className="text-ink-muted">{item.label}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p className="mt-12 text-small text-ink-muted">
          Vitrine is a portfolio project. Nothing here is for sale and no order
          can be placed.
        </p>
      </div>
    </footer>
  );
}
