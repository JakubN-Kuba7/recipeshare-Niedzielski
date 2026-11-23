import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import Home from "./page";

describe("Home", () => {
  it("renders the RecipeShare landing page", () => {
    const html = renderToStaticMarkup(<Home />);

    expect(html).toContain("RecipeShare");
    expect(html).toContain("Share and discover recipes");
  });
});
