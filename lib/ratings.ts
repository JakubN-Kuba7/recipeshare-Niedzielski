import "server-only";

import type { RatingValue } from "./types";
import { createSupabaseAdminClient } from "./supabase/admin";

export type RatingFormState = {
  error?: string;
  success?: string;
};

export class RatingDatabaseError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = "RatingDatabaseError";
  }
}

export function isRatingValue(value: unknown): value is RatingValue {
  return typeof value === "number" && Number.isInteger(value) && value >= 1 && value <= 5;
}

export function ratingValueFromFormData(formData: FormData): unknown {
  const rawValue = formData.get("rating");
  if (typeof rawValue !== "string") {
    return undefined;
  }

  const value = Number(rawValue);
  return Number.isInteger(value) ? value : undefined;
}

export async function addRecipeRating(
  recipeId: string,
  value: RatingValue,
): Promise<void> {
  if (!recipeId) {
    throw new RatingDatabaseError("A recipe is required.");
  }

  if (!isRatingValue(value)) {
    throw new RatingDatabaseError("Choose a rating from 1 to 5 stars.");
  }

  const { error } = await createSupabaseAdminClient()
    .from("ratings")
    .insert({ recipe_id: recipeId, value })
    .select("id")
    .single();

  if (error) {
    throw new RatingDatabaseError("The rating could not be saved.", {
      cause: error,
    });
  }
}
