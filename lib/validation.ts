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
  image: File | null;
  imageRights: boolean;
};

export type RecipeInputField = keyof RecipeInput;
export type RecipeInputErrors = Partial<Record<RecipeInputField, string>>;
export type RecipeFormState = {
  errors: RecipeInputErrors;
  formError?: string;
};

export const INITIAL_RECIPE_FORM_STATE: RecipeFormState = { errors: {} };
export const MAX_RECIPE_IMAGE_BYTES = 3 * 1024 * 1024;
export const ALLOWED_RECIPE_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;
const allowedRecipeImageTypes = new Set<string>(ALLOWED_RECIPE_IMAGE_TYPES);

export const RECIPE_INPUT_FIELDS: RecipeInputField[] = [
  "authorName",
  "title",
  "cuisine",
  "category",
  "ingredients",
  "steps",
  "prepTimeMinutes",
  "image",
  "imageRights",
];

export const RECIPE_FIELD_LABELS: Record<RecipeInputField, string> = {
  authorName: "Author name",
  title: "Title",
  cuisine: "Cuisine",
  category: "Category",
  ingredients: "Ingredients",
  steps: "Steps",
  prepTimeMinutes: "Prep time",
  image: "Food image",
  imageRights: "Image permission",
};

export type RecipeValidationResult =
  | { success: true; data: Omit<NewRecipe, "imageUrl"> }
  | { success: false; errors: RecipeInputErrors };

export function recipeInputFromFormData(formData: FormData): RecipeInput {
  const imageValue = formData.get("image");

  return {
    authorName: getStringValue(formData, "authorName"),
    title: getStringValue(formData, "title"),
    cuisine: getStringValue(formData, "cuisine"),
    category: getStringValue(formData, "category"),
    ingredients: getStringValue(formData, "ingredients"),
    steps: getStringValue(formData, "steps"),
    prepTimeMinutes: getStringValue(formData, "prepTimeMinutes"),
    image:
      imageValue instanceof File && imageValue.size > 0 ? imageValue : null,
    imageRights: formData.get("imageRights") === "on",
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

  if (!input.image) {
    errors.image = "Choose a food image file.";
  } else if (!allowedRecipeImageTypes.has(input.image.type)) {
    errors.image = "Choose a JPEG, PNG, or WebP image.";
  } else if (input.image.size > MAX_RECIPE_IMAGE_BYTES) {
    errors.image = "Choose an image that is 3 MB or smaller.";
  }

  if (!input.imageRights) {
    errors.imageRights =
      "Confirm that you can use this food photo.";
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
