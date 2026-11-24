"use client";

import { CATEGORIES, CUISINES, isCategory, isCuisine } from "../../lib/constants";
import type { Category, Cuisine } from "../../lib/constants";
import type { RecipeSort } from "../../lib/recipe-utils";

type RecipeFiltersProps = {
  cuisine: Cuisine | "";
  category: Category | "";
  query: string;
  sort: RecipeSort;
  onCuisineChange: (cuisine: Cuisine | "") => void;
  onCategoryChange: (category: Category | "") => void;
  onQueryChange: (query: string) => void;
  onSortChange: (sort: RecipeSort) => void;
  onClear: () => void;
};

export function RecipeFilters({
  cuisine,
  category,
  query,
  sort,
  onCuisineChange,
  onCategoryChange,
  onQueryChange,
  onSortChange,
  onClear,
}: RecipeFiltersProps) {
  return (
    <div className="mb-6 grid gap-4 rounded-xl border border-zinc-200 bg-white p-4 sm:grid-cols-2 lg:grid-cols-4 lg:items-end">
      <div>
        <label
          htmlFor="recipe-search"
          className="mb-2 block text-sm font-medium text-zinc-800"
        >
          Search recipes
        </label>
        <input
          id="recipe-search"
          type="search"
          value={query}
          onChange={(event) => onQueryChange(event.currentTarget.value)}
          placeholder="Name or ingredient"
          className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/20"
        />
      </div>

      <div className="flex-1">
        <label
          htmlFor="cuisine-filter"
          className="mb-2 block text-sm font-medium text-zinc-800"
        >
          Cuisine
        </label>
        <select
          id="cuisine-filter"
          value={cuisine}
          onChange={(event) =>
            onCuisineChange(
              isCuisine(event.currentTarget.value)
                ? event.currentTarget.value
                : "",
            )
          }
          className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900 outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/20"
        >
          <option value="">All cuisines</option>
          {CUISINES.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <div className="flex-1">
        <label
          htmlFor="category-filter"
          className="mb-2 block text-sm font-medium text-zinc-800"
        >
          Category
        </label>
        <select
          id="category-filter"
          value={category}
          onChange={(event) =>
            onCategoryChange(
              isCategory(event.currentTarget.value)
                ? event.currentTarget.value
                : "",
            )
          }
          className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900 outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/20"
        >
          <option value="">All categories</option>
          {CATEGORIES.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor="recipe-sort"
          className="mb-2 block text-sm font-medium text-zinc-800"
        >
          Sort recipes
        </label>
        <select
          id="recipe-sort"
          value={sort}
          onChange={(event) => {
            const value = event.currentTarget.value;
            onSortChange(
              value === "highest-rated" ? "highest-rated" : "newest",
            );
          }}
          className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900 outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/20"
        >
          <option value="newest">Newest</option>
          <option value="highest-rated">Highest rated</option>
        </select>
      </div>

      {(cuisine || category || query) && (
        <button
          type="button"
          onClick={onClear}
          className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}
