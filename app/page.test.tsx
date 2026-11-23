import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { SAMPLE_RECIPES } from "../lib/sample-data";
import { RecipeCard } from "./components/RecipeCard";
import Home from "./page";

describe("Home", () => {
  it("renders recipe cards with their photos, cuisine, category, and average ratings", () => {
    const html = renderToStaticMarkup(<Home />);

    expect(html).toContain("RecipeShare");
    expect(html).toContain("Share and discover recipes");
    expect(html).toContain('aria-label="Recipes"');
    expect(html).toContain('alt="Ghormeh Sabzi"');
    expect(html).toContain("Iranian");
    expect(html).toContain("Main Dish");
    expect(html).toContain('aria-label="Average rating: 5.0 out of 5"');
    expect(html).toContain("(1 rating)");
    expect(html).toContain('alt="Tiramisu"');
    expect(html).toContain("Italian");
    expect(html).toContain("Dessert");
    expect(html).toContain('aria-label="Average rating: 4.0 out of 5"');
  });

  it("renders a rating count and average for multiple ratings on a card", () => {
    const recipe = {
      ...SAMPLE_RECIPES[0],
      ratings: [
        ...SAMPLE_RECIPES[0].ratings,
        {
          id: "rating-ghormeh-2",
          recipeId: SAMPLE_RECIPES[0].id,
          value: 3 as const,
          createdAt: "2026-01-19T12:00:00.000Z",
        },
      ],
    };
    const html = renderToStaticMarkup(<RecipeCard recipe={recipe} />);

    expect(html).toContain('aria-label="Average rating: 4.0 out of 5"');
    expect(html).toContain("(2 ratings)");
  });

  it("shows a clear message when the recipe has no ratings", () => {
    const recipe = { ...SAMPLE_RECIPES[0], ratings: [] };
    const html = renderToStaticMarkup(<RecipeCard recipe={recipe} />);

    expect(html).toContain("No ratings yet");
  });
});
