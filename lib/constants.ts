export const CUISINES = [
  "American",
  "Arabic",
  "Chinese",
  "European",
  "German",
  "Indian",
  "Iranian",
  "Italian",
  "Japanese",
  "Mexican",
  "Other",
] as const;

export const CATEGORIES = [
  "Breakfast",
  "Main Dish",
  "Fast Food",
  "Soup",
  "Salad",
  "Dessert",
  "Snack",
  "Drink",
] as const;

export type Cuisine = (typeof CUISINES)[number];
export type Category = (typeof CATEGORIES)[number];

export function isCuisine(value: string): value is Cuisine {
  return CUISINES.some((cuisine) => cuisine === value);
}

export function isCategory(value: string): value is Category {
  return CATEGORIES.some((category) => category === value);
}
