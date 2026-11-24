"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { metric } from "@vercel/functions";

import { addRecipe, RecipeDatabaseError } from "../../../lib/recipes";
import {
  deleteRecipeImage,
  RecipeImageStorageError,
  uploadRecipeImage,
} from "../../../lib/recipe-image-storage";
import {
  inspectRecipeImage,
  RecipeImageValidationError,
} from "../../../lib/recipe-image";
import {
  recipeInputFromFormData,
  validateRecipeInput,
} from "../../../lib/validation";
import type { RecipeFormState } from "../../../lib/validation";

export async function createRecipeAction(
  _previousState: RecipeFormState,
  formData: FormData,
): Promise<RecipeFormState> {
  const input = recipeInputFromFormData(formData);
  const result = validateRecipeInput(input);

  if (!result.success) {
    return { errors: result.errors };
  }

  if (!input.image) {
    return { errors: { image: "Choose a food image file." } };
  }

  const startedAt = performance.now();
  let outcome: "success" | "error" = "error";

  try {
    const { bytes, format } = await inspectRecipeImage(input.image);
    const uploadStartedAt = performance.now();
    let uploadOutcome: "success" | "error" = "error";
    let storedImage: Awaited<ReturnType<typeof uploadRecipeImage>>;
    try {
      storedImage = await uploadRecipeImage(bytes, format);
      uploadOutcome = "success";
    } finally {
      metric("recipe.image_uploads", 1, { outcome: uploadOutcome });
      metric(
        "recipe.image_upload.duration_ms",
        performance.now() - uploadStartedAt,
      );
    }

    try {
      await addRecipe({ ...result.data, imageUrl: storedImage.imageUrl });
    } catch (error) {
      try {
        await deleteRecipeImage(storedImage.storagePath);
      } catch (cleanupError) {
        console.error(
          "Recipe image cleanup failed after the recipe could not be saved.",
          cleanupError,
        );
      }
      throw error;
    }

    outcome = "success";
  } catch (error) {
    if (error instanceof RecipeImageValidationError) {
      return { errors: { image: error.message } };
    }
    if (error instanceof RecipeImageStorageError) {
      return {
        errors: {
          image: "The image could not be stored. Check the Storage setup and try again.",
        },
      };
    }
    if (error instanceof RecipeDatabaseError) {
      return {
        errors: {},
        formError: "The recipe could not be saved. Please try again.",
      };
    }
    throw error;
  } finally {
    metric("recipe.submissions", 1, { outcome });
    metric("recipe.submission.duration_ms", performance.now() - startedAt);
  }

  revalidatePath("/");
  revalidatePath("/recipes/[id]", "page");
  redirect("/");
}
