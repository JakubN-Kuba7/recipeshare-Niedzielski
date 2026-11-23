import { isCategory, isCuisine } from "./constants";
import type { NewRecipe } from "./types";

export type RecipeInput = {
  authorName: string;
  title: string;
  cuisine: string;
  category: string;
  ingredients: string;
  steps: string;
  prepTimeMinutes: string;
  imageUrl: string;
};

export type RecipeInputField = keyof RecipeInput;
export type RecipeInputErrors = Partial<Record<RecipeInputField, string>>;
export type RecipeFormState = { errors: RecipeInputErrors };

export const INITIAL_RECIPE_FORM_STATE: RecipeFormState = { errors: {} };

export const RECIPE_INPUT_FIELDS: RecipeInputField[] = [
  "authorName",
  "title",
  "cuisine",
  "category",
  "ingredients",
  "steps",
  "prepTimeMinutes",
  "imageUrl",
];

export const RECIPE_FIELD_LABELS: Record<RecipeInputField, string> = {
  authorName: "Author name",
  title: "Title",
  cuisine: "Cuisine",
  category: "Category",
  ingredients: "Ingredients",
  steps: "Steps",
  prepTimeMinutes: "Prep time",
  imageUrl: "Image URL",
};

export type RecipeValidationResult =
  | { success: true; data: NewRecipe }
  | { success: false; errors: RecipeInputErrors };

export function recipeInputFromFormData(formData: FormData): RecipeInput {
  return {
    authorName: getStringValue(formData, "authorName"),
    title: getStringValue(formData, "title"),
    cuisine: getStringValue(formData, "cuisine"),
    category: getStringValue(formData, "category"),
    ingredients: getStringValue(formData, "ingredients"),
    steps: getStringValue(formData, "steps"),
    prepTimeMinutes: getStringValue(formData, "prepTimeMinutes"),
    imageUrl: getStringValue(formData, "imageUrl"),
  };
}

export function validateRecipeInput(
  input: RecipeInput,
): RecipeValidationResult {
  const errors: RecipeInputErrors = {};
  const authorName = input.authorName.trim();
  const title = input.title.trim();
  const cuisine = input.cuisine.trim();
  const category = input.category.trim();
  const validCuisine = isCuisine(cuisine) ? cuisine : undefined;
  const validCategory = isCategory(category) ? category : undefined;
  const ingredients = splitLines(input.ingredients);
  const steps = splitLines(input.steps);
  const prepTimeText = input.prepTimeMinutes.trim();
  const imageUrl = input.imageUrl.trim();

  if (!authorName) errors.authorName = "Enter an author name.";
  if (!title) errors.title = "Enter a recipe title.";
  if (!cuisine) {
    errors.cuisine = "Choose a cuisine.";
  } else if (!validCuisine) {
    errors.cuisine = "Choose a cuisine from the list.";
  }
  if (!category) {
    errors.category = "Choose a category.";
  } else if (!validCategory) {
    errors.category = "Choose a category from the list.";
  }
  if (ingredients.length === 0) {
    errors.ingredients = "Enter at least one ingredient.";
  }
  if (steps.length === 0) errors.steps = "Enter at least one step.";

  const prepTimeMinutes = Number(prepTimeText);
  if (!prepTimeText) {
    errors.prepTimeMinutes = "Enter the prep time in minutes.";
  } else if (
    !Number.isInteger(prepTimeMinutes) ||
    prepTimeMinutes < 1
  ) {
    errors.prepTimeMinutes = "Enter a whole number greater than 0.";
  }

  if (!imageUrl) {
    errors.imageUrl = "Enter an image URL.";
  } else if (!isHttpUrl(imageUrl)) {
    errors.imageUrl = "Enter a valid HTTP or HTTPS image URL.";
  }

  if (Object.keys(errors).length > 0) {
    return { success: false, errors };
  }

  if (!validCuisine || !validCategory) {
    return {
      success: false,
      errors: {
        cuisine: "Choose a cuisine from the list.",
        category: "Choose a category from the list.",
      },
    };
  }

  return {
    success: true,
    data: {
      authorName,
      title,
      cuisine: validCuisine,
      category: validCategory,
      ingredients,
      steps,
      prepTimeMinutes,
      imageUrl,
    },
  };
}

function getStringValue(formData: FormData, name: string): string {
  const value = formData.get(name);
  return typeof value === "string" ? value : "";
}

function splitLines(value: string): string[] {
  return value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function isHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}
