import type { Category, Cuisine } from "./constants";
import type { Recipe, RecipeRating } from "./types";

export type RatingSummary = {
  average: number | null;
  count: number;
};

export function getRatingSummary(
  ratings: readonly RecipeRating[],
): RatingSummary {
  if (ratings.length === 0) {
    return { average: null, count: 0 };
  }

  const total = ratings.reduce((sum, rating) => sum + rating.value, 0);

  return {
    average: total / ratings.length,
    count: ratings.length,
  };
}

export function filterRecipes(
  recipes: readonly Recipe[],
  cuisine: Cuisine | "",
  category: Category | "",
): Recipe[] {
  return recipes.filter(
    (recipe) =>
      (!cuisine || recipe.cuisine === cuisine) &&
      (!category || recipe.category === category),
  );
}
