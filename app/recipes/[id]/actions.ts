"use server";

import { revalidatePath } from "next/cache";

import {
  addRecipeRating,
  isRatingValue,
  RatingDatabaseError,
  ratingValueFromFormData,
} from "../../../lib/ratings";
import type { RatingFormState } from "../../../lib/ratings";

export async function submitRecipeRatingAction(
  _previousState: RatingFormState,
  formData: FormData,
): Promise<RatingFormState> {
  const recipeId = formData.get("recipeId");
  const value = ratingValueFromFormData(formData);

  if (typeof recipeId !== "string" || !recipeId) {
    return { error: "The recipe could not be found." };
  }

  if (!isRatingValue(value)) {
    return { error: "Choose a rating from 1 to 5 stars." };
  }

  try {
    await addRecipeRating(recipeId, value);
  } catch (error) {
    if (error instanceof RatingDatabaseError) {
      return { error: "The rating could not be saved. Please try again." };
    }
    throw error;
  }

  revalidatePath("/");
  revalidatePath("/recipes/[id]", "page");
  return { success: "Rating submitted." };
}
