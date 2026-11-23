import type { Category, Cuisine } from "./constants";

export type RatingValue = 1 | 2 | 3 | 4 | 5;

export type RecipeRating = {
  id: string;
  recipeId: string;
  value: RatingValue;
  createdAt: string;
};

export type Recipe = {
  id: string;
  authorName: string;
  title: string;
  cuisine: Cuisine;
  category: Category;
  ingredients: string[];
  steps: string[];
  prepTimeMinutes: number;
  imageUrl: string;
  createdAt: string;
  ratings: RecipeRating[];
};

export type NewRecipe = Omit<Recipe, "id" | "createdAt" | "ratings">;
