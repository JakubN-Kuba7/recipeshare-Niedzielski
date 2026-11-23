import type { RecipeRating } from "./types";

export type RatingSummary = {
  average: number | null;
  count: number;
};

export function getRatingSummary(ratings: readonly RecipeRating[]): RatingSummary {
  if (ratings.length === 0) {
    return { average: null, count: 0 };
  }

  const total = ratings.reduce((sum, rating) => sum + rating.value, 0);

  return {
    average: total / ratings.length,
    count: ratings.length,
  };
}
