import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

import { SAMPLE_RECIPES } from "../lib/sample-data";
import { RecipeCard } from "./components/RecipeCard";
import Home from "./page";

vi.mock("server-only", () => ({}));

describe("Home", () => {
  it("renders the home page and recipe loading state", () => {
    const html = renderToStaticMarkup(<Home />);

    expect(html).toContain("RecipeShare");
    expect(html).toContain("Share and discover recipes");
    expect(html).toContain('href="/recipes/new"');
    expect(html).toContain("Add a recipe");
    expect(html).toContain("Loading recipes...");
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
