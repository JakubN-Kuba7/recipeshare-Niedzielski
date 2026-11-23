"use client";

import { useActionState, useState } from "react";
import type { FormEvent } from "react";

import { CATEGORIES, CUISINES } from "../../lib/constants";
import {
  INITIAL_RECIPE_FORM_STATE,
  RECIPE_FIELD_LABELS,
  RECIPE_INPUT_FIELDS,
  recipeInputFromFormData,
  validateRecipeInput,
} from "../../lib/validation";
import type {
  RecipeInputErrors,
  RecipeInputField,
} from "../../lib/validation";
import { createRecipeAction } from "../recipes/new/actions";

export function RecipeForm() {
  const [state, formAction, isPending] = useActionState(
    createRecipeAction,
    INITIAL_RECIPE_FORM_STATE,
  );
  const [clientErrors, setClientErrors] = useState<RecipeInputErrors>({});
  const errors = { ...state.errors, ...clientErrors };
  const fieldsWithErrors = RECIPE_INPUT_FIELDS.filter((field) => errors[field]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    const result = validateRecipeInput(
      recipeInputFromFormData(new FormData(event.currentTarget)),
    );

    if (!result.success) {
      event.preventDefault();
      setClientErrors(result.errors);
      return;
    }

    setClientErrors({});
  }

  function handleFieldChange(field: RecipeInputField) {
    setClientErrors((currentErrors) => {
      if (!(field in currentErrors)) {
        return currentErrors;
      }

      const nextErrors = { ...currentErrors };
      delete nextErrors[field];
      return nextErrors;
    });
  }

  function fieldError(field: RecipeInputField) {
    return errors[field] ? `${field}-error` : undefined;
  }

  return (
    <form
      action={formAction}
      onSubmit={handleSubmit}
      noValidate
      className="space-y-6 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8"
    >
      {fieldsWithErrors.length > 0 && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800"
        >
          <p className="font-semibold">Please fix the following fields:</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            {fieldsWithErrors.map((field) => (
              <li key={field}>
                {RECIPE_FIELD_LABELS[field]}: {errors[field]}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <label
          htmlFor="authorName"
          className="mb-2 block text-sm font-medium text-zinc-800"
        >
          Author name
        </label>
        <input
          id="authorName"
          name="authorName"
          type="text"
          autoComplete="name"
          required
          aria-invalid={Boolean(errors.authorName)}
          aria-describedby={fieldError("authorName")}
          onChange={() => handleFieldChange("authorName")}
          className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/20"
        />
        {errors.authorName && (
          <p id="authorName-error" className="mt-1 text-sm text-red-700">
            {errors.authorName}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="title"
          className="mb-2 block text-sm font-medium text-zinc-800"
        >
          Recipe title
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          aria-invalid={Boolean(errors.title)}
          aria-describedby={fieldError("title")}
          onChange={() => handleFieldChange("title")}
          className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/20"
        />
        {errors.title && (
          <p id="title-error" className="mt-1 text-sm text-red-700">
            {errors.title}
          </p>
        )}
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label
            htmlFor="cuisine"
            className="mb-2 block text-sm font-medium text-zinc-800"
          >
            Cuisine
          </label>
          <select
            id="cuisine"
            name="cuisine"
            defaultValue=""
            required
            aria-invalid={Boolean(errors.cuisine)}
            aria-describedby={fieldError("cuisine")}
            onChange={() => handleFieldChange("cuisine")}
            className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900 outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/20"
          >
            <option value="">Choose a cuisine</option>
            {CUISINES.map((cuisine) => (
              <option key={cuisine} value={cuisine}>
                {cuisine}
              </option>
            ))}
          </select>
          {errors.cuisine && (
            <p id="cuisine-error" className="mt-1 text-sm text-red-700">
              {errors.cuisine}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="category"
            className="mb-2 block text-sm font-medium text-zinc-800"
          >
            Category
          </label>
          <select
            id="category"
            name="category"
            defaultValue=""
            required
            aria-invalid={Boolean(errors.category)}
            aria-describedby={fieldError("category")}
            onChange={() => handleFieldChange("category")}
            className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900 outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/20"
          >
            <option value="">Choose a category</option>
            {CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          {errors.category && (
            <p id="category-error" className="mt-1 text-sm text-red-700">
              {errors.category}
            </p>
          )}
        </div>
      </div>

      <div>
        <label
          htmlFor="ingredients"
          className="mb-2 block text-sm font-medium text-zinc-800"
        >
          Ingredients
        </label>
        <textarea
          id="ingredients"
          name="ingredients"
          rows={5}
          required
          aria-invalid={Boolean(errors.ingredients)}
          aria-describedby={fieldError("ingredients")}
          onChange={() => handleFieldChange("ingredients")}
          className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/20"
          placeholder="Enter one ingredient per line"
        />
        {errors.ingredients && (
          <p id="ingredients-error" className="mt-1 text-sm text-red-700">
            {errors.ingredients}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="steps"
          className="mb-2 block text-sm font-medium text-zinc-800"
        >
          Steps
        </label>
        <textarea
          id="steps"
          name="steps"
          rows={6}
          required
          aria-invalid={Boolean(errors.steps)}
          aria-describedby={fieldError("steps")}
          onChange={() => handleFieldChange("steps")}
          className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/20"
          placeholder="Enter one step per line"
        />
        {errors.steps && (
          <p id="steps-error" className="mt-1 text-sm text-red-700">
            {errors.steps}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="prepTimeMinutes"
          className="mb-2 block text-sm font-medium text-zinc-800"
        >
          Prep time in minutes
        </label>
        <input
          id="prepTimeMinutes"
          name="prepTimeMinutes"
          type="number"
          min="1"
          step="1"
          required
          aria-invalid={Boolean(errors.prepTimeMinutes)}
          aria-describedby={fieldError("prepTimeMinutes")}
          onChange={() => handleFieldChange("prepTimeMinutes")}
          className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/20"
        />
        {errors.prepTimeMinutes && (
          <p id="prepTimeMinutes-error" className="mt-1 text-sm text-red-700">
            {errors.prepTimeMinutes}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="imageUrl"
          className="mb-2 block text-sm font-medium text-zinc-800"
        >
          Image URL
        </label>
        <input
          id="imageUrl"
          name="imageUrl"
          type="url"
          inputMode="url"
          required
          aria-invalid={Boolean(errors.imageUrl)}
          aria-describedby={fieldError("imageUrl")}
          onChange={() => handleFieldChange("imageUrl")}
          className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/20"
          placeholder="https://example.com/recipe.jpg"
        />
        {errors.imageUrl && (
          <p id="imageUrl-error" className="mt-1 text-sm text-red-700">
            {errors.imageUrl}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="rounded-lg bg-emerald-800 px-5 py-3 font-semibold text-white transition-colors hover:bg-emerald-900 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Adding recipe..." : "Add recipe"}
      </button>
    </form>
  );
}
