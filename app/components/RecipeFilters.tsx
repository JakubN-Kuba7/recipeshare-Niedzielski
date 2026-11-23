"use client";

import { CATEGORIES, CUISINES, isCategory, isCuisine } from "../../lib/constants";
import type { Category, Cuisine } from "../../lib/constants";

type RecipeFiltersProps = {
  cuisine: Cuisine | "";
  category: Category | "";
  onCuisineChange: (cuisine: Cuisine | "") => void;
  onCategoryChange: (category: Category | "") => void;
  onClear: () => void;
};

export function RecipeFilters({
  cuisine,
  category,
  onCuisineChange,
  onCategoryChange,
  onClear,
}: RecipeFiltersProps) {
  return (
    <div className="mb-6 flex flex-col gap-4 rounded-xl border border-zinc-200 bg-white p-4 sm:flex-row sm:items-end">
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

      {(cuisine || category) && (
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
