import type { Recipe } from "./types";

export const SAMPLE_RECIPES = [
  {
    id: "iranian-ghormeh-sabzi",
    authorName: "RecipeShare Kitchen",
    title: "Ghormeh Sabzi",
    cuisine: "Iranian",
    category: "Main Dish",
    ingredients: [
      "Fresh parsley",
      "Fresh cilantro",
      "Kidney beans",
      "Dried limes",
      "Onion",
    ],
    steps: [
      "Chop and saute the herbs with the onion.",
      "Add beans, dried limes, and water, then simmer until tender.",
      "Serve warm with rice.",
    ],
    prepTimeMinutes: 90,
    imageUrl:
      "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=80",
    createdAt: "2026-01-15T12:00:00.000Z",
    ratings: [
      {
        id: "rating-ghormeh-1",
        recipeId: "iranian-ghormeh-sabzi",
        value: 5,
        createdAt: "2026-01-16T12:00:00.000Z",
      },
    ],
  },
  {
    id: "italian-tiramisu",
    authorName: "RecipeShare Kitchen",
    title: "Tiramisu",
    cuisine: "Italian",
    category: "Dessert",
    ingredients: [
      "Ladyfinger biscuits",
      "Espresso",
      "Mascarpone",
      "Eggs",
      "Cocoa powder",
    ],
    steps: [
      "Dip the biscuits briefly in espresso.",
      "Layer the biscuits with a mixture of mascarpone and eggs.",
      "Chill, then dust with cocoa powder before serving.",
    ],
    prepTimeMinutes: 30,
    imageUrl:
      "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=1200&q=80",
    createdAt: "2026-01-17T12:00:00.000Z",
    ratings: [
      {
        id: "rating-tiramisu-1",
        recipeId: "italian-tiramisu",
        value: 4,
        createdAt: "2026-01-18T12:00:00.000Z",
      },
    ],
  },
] satisfies Recipe[];
