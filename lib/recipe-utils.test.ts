import { describe, expect, it } from "vitest";

import { SAMPLE_RECIPES } from "./sample-data";
import { filterRecipes, getRatingSummary } from "./recipe-utils";

describe("getRatingSummary", () => {
  it("calculates the average and count of recipe ratings", () => {
    const ratings = [
      { ...SAMPLE_RECIPES[0].ratings[0], value: 5 as const },
      {
        id: "rating-test-2",
        recipeId: SAMPLE_RECIPES[0].id,
        value: 3 as const,
        createdAt: "2026-01-20T12:00:00.000Z",
      },
    ];

    expect(getRatingSummary(ratings)).toEqual({ average: 4, count: 2 });
  });

  it("returns no average for an unrated recipe", () => {
    expect(getRatingSummary([])).toEqual({ average: null, count: 0 });
  });
});

describe("filterRecipes", () => {
  it("applies cuisine and category choices together", () => {
    const recipes = filterRecipes(SAMPLE_RECIPES, "Iranian", "Main Dish");

    expect(recipes.map((recipe) => recipe.id)).toEqual([
      "iranian-ghormeh-sabzi",
    ]);
  });

  it("returns all recipes when both choices are cleared", () => {
    const recipes = filterRecipes(SAMPLE_RECIPES, "", "");

    expect(recipes.map((recipe) => recipe.id)).toEqual(
      SAMPLE_RECIPES.map((recipe) => recipe.id),
    );
  });

  it("returns no recipes when the selected choices do not match", () => {
    expect(filterRecipes(SAMPLE_RECIPES, "Japanese", "Main Dish")).toEqual([]);
  });
});
