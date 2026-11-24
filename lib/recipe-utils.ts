import type { Category, Cuisine } from "./constants";
import type { Recipe, RecipeRating } from "./types";

export type RatingSummary = {
  average: number | null;
  count: number;
};

export type RecipeSort = "newest" | "highest-rated";

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
  query = "",
): Recipe[] {
  const normalizedQuery = query.trim().toLowerCase();

  return recipes.filter(
    (recipe) =>
      (!cuisine || recipe.cuisine === cuisine) &&
      (!category || recipe.category === category) &&
      (!normalizedQuery ||
        recipe.title.toLowerCase().includes(normalizedQuery) ||
        recipe.ingredients.some((ingredient) =>
          ingredient.toLowerCase().includes(normalizedQuery),
        )),
  );
}

export function sortRecipes(
  recipes: readonly Recipe[],
  sort: RecipeSort,
): Recipe[] {
  return [...recipes].sort((first, second) => {
    if (sort === "highest-rated") {
      const firstAverage = getRatingSummary(first.ratings).average;
      const secondAverage = getRatingSummary(second.ratings).average;

      if (firstAverage === null && secondAverage !== null) return 1;
      if (firstAverage !== null && secondAverage === null) return -1;
      if (
        firstAverage !== null &&
        secondAverage !== null &&
        firstAverage !== secondAverage
      ) {
        return secondAverage - firstAverage;
      }
    }

    return Date.parse(second.createdAt) - Date.parse(first.createdAt);
  });
}
