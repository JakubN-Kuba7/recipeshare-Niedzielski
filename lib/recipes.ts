import { randomUUID } from "node:crypto";

import { SAMPLE_RECIPES } from "./sample-data";
import type { NewRecipe, Recipe } from "./types";

let recipes: Recipe[] = [...SAMPLE_RECIPES];

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
