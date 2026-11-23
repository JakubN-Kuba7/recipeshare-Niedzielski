export const CUISINES = [
  "American",
  "Arabic",
  "Chinese",
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
