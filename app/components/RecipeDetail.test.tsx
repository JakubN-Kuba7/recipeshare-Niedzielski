import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { SAMPLE_RECIPES } from "../../lib/sample-data";
import { RecipeDetail } from "./RecipeDetail";

describe("RecipeDetail", () => {
  it("renders all recipe information and the author's name", () => {
    const html = renderToStaticMarkup(
      <RecipeDetail recipe={SAMPLE_RECIPES[0]} />,
    );

    expect(html).toContain('alt="Ghormeh Sabzi"');
    expect(html).toContain("Ghormeh Sabzi");
    expect(html).toContain("By RecipeShare Kitchen");
    expect(html).toContain("Iranian");
    expect(html).toContain("Main Dish");
    expect(html).toContain("90 minutes");
    expect(html).toContain("Fresh parsley");
    expect(html).toContain("Fresh cilantro");
    expect(html).toContain("Chop and saute the herbs with the onion.");
    expect(html).toContain("Serve warm with rice.");
    expect(html).toContain("5.0 out of 5 (1 rating)");
    expect(html).toContain("Back to all recipes");
  });
});
