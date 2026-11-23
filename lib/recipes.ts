import { randomUUID } from "node:crypto";

import { SAMPLE_RECIPES } from "./sample-data";
import type { NewRecipe, Recipe, RecipeRating } from "./types";

let recipes: Recipe[] = [...SAMPLE_RECIPES];

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

export function getRecipes(): Recipe[] {
  return [...recipes];
}

export function getRecipeById(id: string): Recipe | undefined {
  return recipes.find((recipe) => recipe.id === id);
}

export function addRecipe(newRecipe: NewRecipe): Recipe {
  const recipe: Recipe = {
    ...newRecipe,
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    ratings: [],
  };

  recipes = [recipe, ...recipes];
  return recipe;
}
