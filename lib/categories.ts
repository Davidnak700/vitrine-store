/**
 * The six categories.
 *
 * `Category` is the union of slugs, so it is the type used by Product.category
 * and by the [category] route segment. `CategoryInfo` is the display record.
 *
 * `slug` and `name` are the same word in every case — `name` only restores the
 * capitals and the space that a URL cannot carry ("smart-home" → "Smart Home").
 * This is not the slug-to-label lookup table AGENTS.md forbids; that rule is
 * about a category having two different *names*, which none of these do.
 */

export type Category =
  | "laptops"
  | "phones"
  | "audio"
  | "tvs"
  | "smart-home"
  | "accessories";

export type CategoryInfo = {
  slug: Category;
  name: string;
};

export const categories: CategoryInfo[] = [
  { slug: "laptops", name: "Laptops" },
  { slug: "phones", name: "Phones" },
  { slug: "audio", name: "Audio" },
  { slug: "tvs", name: "TVs" },
  { slug: "smart-home", name: "Smart Home" },
  { slug: "accessories", name: "Accessories" },
];

/** Narrows an arbitrary URL segment to a Category. Used by the [category] routes. */
export function isCategory(value: string): value is Category {
  return categories.some((category) => category.slug === value);
}

export function getCategory(slug: Category): CategoryInfo {
  // Non-null: the argument is already narrowed to a slug that exists.
  return categories.find((category) => category.slug === slug)!;
}
