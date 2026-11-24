import { describe, expect, it } from "vitest";

import { SAMPLE_RECIPES } from "./sample-data";
import {
  filterRecipes,
  getRatingSummary,
  sortRecipes,
} from "./recipe-utils";

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

  it("searches titles and ingredients without ignoring the selected filters", () => {
    const riceRecipe = {
      ...SAMPLE_RECIPES[0],
      ingredients: [...SAMPLE_RECIPES[0].ingredients, "Rice"],
    };

    expect(filterRecipes([riceRecipe, ...SAMPLE_RECIPES], "", "", " RICE ")).toEqual([
      riceRecipe,
    ]);
    expect(filterRecipes(SAMPLE_RECIPES, "", "", "TIRAMISU")).toEqual([
      SAMPLE_RECIPES[1],
    ]);
    expect(filterRecipes(SAMPLE_RECIPES, "Italian", "Dessert", "rice")).toEqual(
      [],
    );
    expect(filterRecipes(SAMPLE_RECIPES, "Italian", "Dessert", "espresso")).toEqual([
      SAMPLE_RECIPES[1],
    ]);
  });
});

describe("sortRecipes", () => {
  it("sorts newest recipes first without mutating its input", () => {
    const recipes = [...SAMPLE_RECIPES];

    expect(sortRecipes(recipes, "newest").map((recipe) => recipe.id)).toEqual([
      "italian-tiramisu",
      "iranian-ghormeh-sabzi",
    ]);
    expect(recipes).toEqual(SAMPLE_RECIPES);
  });

  it("sorts by rating and places unrated recipes last", () => {
    const unratedRecipe = {
      ...SAMPLE_RECIPES[1],
      id: "unrated-tiramisu",
      ratings: [],
    };
    const recipes = [unratedRecipe, ...SAMPLE_RECIPES];

    expect(
      sortRecipes(recipes, "highest-rated").map((recipe) => recipe.id),
    ).toEqual([
      "iranian-ghormeh-sabzi",
      "italian-tiramisu",
      "unrated-tiramisu",
    ]);
  });
});
