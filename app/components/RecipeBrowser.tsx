"use client";

import { useState } from "react";

import { RecipeCard } from "./RecipeCard";
import { RecipeFilters } from "./RecipeFilters";
import { filterRecipes } from "../../lib/recipe-utils";
import type { Category, Cuisine } from "../../lib/constants";
import type { Recipe } from "../../lib/types";

type RecipeBrowserProps = {
  recipes: Recipe[];
};

export function RecipeBrowser({ recipes }: RecipeBrowserProps) {
  const [cuisine, setCuisine] = useState<Cuisine | "">("");
  const [category, setCategory] = useState<Category | "">("");
  const filteredRecipes = filterRecipes(recipes, cuisine, category);

  return (
    <>
      <section aria-label="Recipe filters">
        <RecipeFilters
          cuisine={cuisine}
          category={category}
          onCuisineChange={setCuisine}
          onCategoryChange={setCategory}
          onClear={() => {
            setCuisine("");
            setCategory("");
          }}
        />
      </section>
      {filteredRecipes.length === 0 ? (
        <p role="status" className="py-12 text-center text-zinc-600">
          No recipes found
        </p>
      ) : (
        <section
          aria-label="Recipes"
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {filteredRecipes.map((recipe, index) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              eagerImage={index === 0}
            />
          ))}
        </section>
      )}
    </>
  );
}
