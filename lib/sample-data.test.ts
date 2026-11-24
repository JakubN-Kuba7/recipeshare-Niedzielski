import { describe, expect, it } from "vitest";

import { CATEGORIES, CUISINES, isCuisine } from "./constants";
import { SAMPLE_RECIPES } from "./sample-data";

describe("RecipeShare shared data", () => {
  it("provides the exact cuisine and category choices from the specification", () => {
    expect(CUISINES).toEqual([
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
    ]);
    expect(CATEGORIES).toEqual([
      "Breakfast",
      "Main Dish",
      "Fast Food",
      "Soup",
      "Salad",
      "Dessert",
      "Snack",
      "Drink",
    ]);
    expect(isCuisine("European")).toBe(true);
  });

  it("provides at least two complete recipes with distinct cuisines and categories", () => {
    expect(SAMPLE_RECIPES.length).toBeGreaterThanOrEqual(2);
    expect(new Set(SAMPLE_RECIPES.map((recipe) => recipe.cuisine)).size).toBe(
      SAMPLE_RECIPES.length,
    );
    expect(new Set(SAMPLE_RECIPES.map((recipe) => recipe.category)).size).toBe(
      SAMPLE_RECIPES.length,
    );

    for (const recipe of SAMPLE_RECIPES) {
      expect(recipe.id).toBeTruthy();
      expect(recipe.authorName).toBeTruthy();
      expect(recipe.title).toBeTruthy();
      expect(recipe.ingredients.length).toBeGreaterThan(0);
      expect(recipe.steps.length).toBeGreaterThan(0);
      expect(recipe.prepTimeMinutes).toBeGreaterThan(0);
      expect(new URL(recipe.imageUrl).protocol).toBe("https:");
      expect(Number.isNaN(Date.parse(recipe.createdAt))).toBe(false);

      for (const rating of recipe.ratings) {
        expect(rating.recipeId).toBe(recipe.id);
        expect(rating.value).toBeGreaterThanOrEqual(1);
        expect(rating.value).toBeLessThanOrEqual(5);
      }
    }
  });
});
