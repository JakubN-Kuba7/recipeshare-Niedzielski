import { describe, expect, it } from "vitest";

import {
  identifyRecipeImage,
  inspectRecipeImage,
  RecipeImageValidationError,
} from "./recipe-image";
import { MAX_RECIPE_IMAGE_BYTES } from "./validation";

const pngHeader = new Uint8Array([
  0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
]);

describe("recipe image validation", () => {
  it("recognizes supported image signatures", () => {
    expect(
      identifyRecipeImage(
        new Uint8Array([0xff, 0xd8, 0xff, 0x00]),
      ),
    ).toEqual({ contentType: "image/jpeg", extension: "jpg" });
    expect(identifyRecipeImage(pngHeader)).toEqual({
      contentType: "image/png",
      extension: "png",
    });
    expect(
      identifyRecipeImage(
        new Uint8Array([
          0x52, 0x49, 0x46, 0x46, 0x00, 0x00, 0x00, 0x00,
          0x57, 0x45, 0x42, 0x50,
        ]),
      ),
    ).toEqual({ contentType: "image/webp", extension: "webp" });
  });

  it("rejects a file whose MIME type does not match its actual contents", async () => {
    const file = new File(["not an image"], "image.png", {
      type: "image/png",
    });

    await expect(inspectRecipeImage(file)).rejects.toBeInstanceOf(
      RecipeImageValidationError,
    );
  });

  it("rejects an image over the configured size limit", async () => {
    const file = new File(
      [new Uint8Array(MAX_RECIPE_IMAGE_BYTES + 1)],
      "large.png",
      { type: "image/png" },
    );

    await expect(inspectRecipeImage(file)).rejects.toThrow(
      "3 MB or smaller",
    );
  });
});
