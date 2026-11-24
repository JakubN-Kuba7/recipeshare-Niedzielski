"use client";

import { useState } from "react";

import { RecipeCard } from "./RecipeCard";
import { RecipeFilters } from "./RecipeFilters";
import { filterRecipes, sortRecipes } from "../../lib/recipe-utils";
import type { RecipeSort } from "../../lib/recipe-utils";
import type { Category, Cuisine } from "../../lib/constants";
import type { Recipe } from "../../lib/types";

type RecipeBrowserProps = {
  recipes: Recipe[];
};

export function RecipeBrowser({ recipes }: RecipeBrowserProps) {
  const [cuisine, setCuisine] = useState<Cuisine | "">("");
  const [category, setCategory] = useState<Category | "">("");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<RecipeSort>("newest");
  const filteredRecipes = sortRecipes(
    filterRecipes(recipes, cuisine, category, query),
    sort,
  );

  return (
    <>
      <section aria-label="Recipe filters">
        <RecipeFilters
          cuisine={cuisine}
          category={category}
          query={query}
          sort={sort}
          onCuisineChange={setCuisine}
          onCategoryChange={setCategory}
          onQueryChange={setQuery}
          onSortChange={setSort}
          onClear={() => {
            setCuisine("");
            setCategory("");
            setQuery("");
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
