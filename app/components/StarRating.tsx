"use client";

import { useActionState } from "react";

import { submitRecipeRatingAction } from "../recipes/[id]/actions";
import type { RatingFormState } from "../../lib/ratings";

const INITIAL_RATING_STATE: RatingFormState = {};

export function StarRating({ recipeId }: { recipeId: string }) {
  const [state, formAction, isPending] = useActionState(
    submitRecipeRatingAction,
    INITIAL_RATING_STATE,
  );

  return (
    <section
      className="mt-8 rounded-xl border border-zinc-200 bg-zinc-50 p-5"
      aria-labelledby="rating-heading"
    >
      <h2 id="rating-heading" className="text-xl font-semibold text-zinc-900">
        Rate this recipe
      </h2>
      <form action={formAction} className="mt-4">
        <input type="hidden" name="recipeId" value={recipeId} />
        <fieldset>
          <legend className="text-sm font-medium text-zinc-700">
            Choose 1 to 5 stars
          </legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {[1, 2, 3, 4, 5].map((value) => (
              <label
                key={value}
                className="cursor-pointer rounded-lg border border-zinc-300 bg-white px-3 py-2 text-amber-500 hover:border-emerald-700 has-[:checked]:border-emerald-700 has-[:checked]:bg-emerald-50"
              >
                <input
                  className="sr-only"
                  type="radio"
                  name="rating"
                  value={value}
                  required
                />
                {"★".repeat(value)}
                <span className="sr-only">{value} star{value === 1 ? "" : "s"}</span>
              </label>
            ))}
          </div>
        </fieldset>
        <button
          type="submit"
          disabled={isPending}
          className="mt-4 rounded-lg bg-emerald-800 px-4 py-2 font-semibold text-white transition-colors hover:bg-emerald-900 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? "Submitting..." : "Submit rating"}
        </button>
      </form>
      {state.error && (
        <p role="alert" className="mt-3 text-sm text-red-700">
          {state.error}
        </p>
      )}
      {state.success && (
        <p role="status" className="mt-3 text-sm font-medium text-emerald-800">
          {state.success}
        </p>
      )}
    </section>
  );
}
