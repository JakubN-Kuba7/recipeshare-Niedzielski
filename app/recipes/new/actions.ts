"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { addRecipe } from "../../../lib/recipes";
import {
  recipeInputFromFormData,
  validateRecipeInput,
} from "../../../lib/validation";
import type { RecipeFormState } from "../../../lib/validation";

export async function createRecipeAction(
  _previousState: RecipeFormState,
  formData: FormData,
): Promise<RecipeFormState> {
  const result = validateRecipeInput(recipeInputFromFormData(formData));

  if (!result.success) {
    return { errors: result.errors };
  }

  addRecipe(result.data);
  revalidatePath("/");
  revalidatePath("/recipes/[id]", "page");
  redirect("/");
}
