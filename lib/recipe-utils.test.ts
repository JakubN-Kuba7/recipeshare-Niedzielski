import { describe, expect, it } from "vitest";

import { SAMPLE_RECIPES } from "./sample-data";
import { filterRecipes } from "./recipe-utils";

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
