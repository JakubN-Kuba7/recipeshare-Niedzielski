import { describe, expect, it } from "vitest";

import {
  validateRecipeInput,
  type RecipeInput,
  type RecipeInputField,
} from "./validation";

function validInput(): RecipeInput {
  return {
    authorName: "Test Cook",
    title: "Herb Rice",
    cuisine: "Iranian",
    category: "Main Dish",
    ingredients: "Rice\nFresh herbs",
    steps: "Rinse the rice\nCook with the herbs",
    prepTimeMinutes: "45",
    imageUrl: "https://example.com/herb-rice.jpg",
  };
}

describe("validateRecipeInput", () => {
  it("normalizes a complete recipe form into recipe data", () => {
    const result = validateRecipeInput(validInput());

    expect(result).toEqual({
      success: true,
      data: {
        authorName: "Test Cook",
        title: "Herb Rice",
        cuisine: "Iranian",
        category: "Main Dish",
        ingredients: ["Rice", "Fresh herbs"],
        steps: ["Rinse the rice", "Cook with the herbs"],
        prepTimeMinutes: 45,
        imageUrl: "https://example.com/herb-rice.jpg",
      },
    });
  });

  it.each<RecipeInputField>([
    "authorName",
    "title",
    "cuisine",
    "category",
    "ingredients",
    "steps",
    "prepTimeMinutes",
    "imageUrl",
  ])("reports a missing %s field", (field) => {
    const input = validInput();
    input[field] = " \n ";

    const result = validateRecipeInput(input);

    expect(result).toMatchObject({
      success: false,
      errors: { [field]: expect.any(String) },
    });
  });

  it("rejects values outside the cuisine and category choices", () => {
    const result = validateRecipeInput({
      ...validInput(),
      cuisine: "Persian",
      category: "Dinner",
    });

    expect(result).toMatchObject({
      success: false,
      errors: {
        cuisine: "Choose a cuisine from the list.",
        category: "Choose a category from the list.",
      },
    });
  });

  it("rejects invalid prep times and non-HTTP image URLs", () => {
    const result = validateRecipeInput({
      ...validInput(),
      prepTimeMinutes: "0",
      imageUrl: "javascript:alert(1)",
    });

    expect(result).toMatchObject({
      success: false,
      errors: {
        prepTimeMinutes: "Enter a whole number greater than 0.",
        imageUrl: "Enter a valid HTTP or HTTPS image URL.",
      },
    });
  });
});
