import {
  ALLOWED_RECIPE_IMAGE_TYPES,
  MAX_RECIPE_IMAGE_BYTES,
} from "./validation";

export const RECIPE_IMAGES_BUCKET = "recipe-images";

export type RecipeImageFormat = {
  contentType: (typeof ALLOWED_RECIPE_IMAGE_TYPES)[number];
  extension: "jpg" | "png" | "webp";
};

export class RecipeImageValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "RecipeImageValidationError";
  }
}

export function identifyRecipeImage(bytes: Uint8Array): RecipeImageFormat | null {
  if (
    bytes.length >= 3 &&
    bytes[0] === 0xff &&
    bytes[1] === 0xd8 &&
    bytes[2] === 0xff
  ) {
    return { contentType: "image/jpeg", extension: "jpg" };
  }

  if (
    bytes.length >= 8 &&
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47 &&
    bytes[4] === 0x0d &&
    bytes[5] === 0x0a &&
    bytes[6] === 0x1a &&
    bytes[7] === 0x0a
  ) {
    return { contentType: "image/png", extension: "png" };
  }

  if (
    bytes.length >= 12 &&
    bytes[0] === 0x52 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x46 &&
    bytes[8] === 0x57 &&
    bytes[9] === 0x45 &&
    bytes[10] === 0x42 &&
    bytes[11] === 0x50
  ) {
    return { contentType: "image/webp", extension: "webp" };
  }

  return null;
}

export async function inspectRecipeImage(file: File): Promise<{
  bytes: Uint8Array;
  format: RecipeImageFormat;
}> {
  if (file.size > MAX_RECIPE_IMAGE_BYTES) {
    throw new RecipeImageValidationError(
      "Choose an image that is 3 MB or smaller.",
    );
  }

  if (
    !ALLOWED_RECIPE_IMAGE_TYPES.some((contentType) => contentType === file.type)
  ) {
    throw new RecipeImageValidationError("Choose a JPEG, PNG, or WebP image.");
  }

  const bytes = new Uint8Array(await file.arrayBuffer());
  const format = identifyRecipeImage(bytes);

  if (!format || format.contentType !== file.type) {
    throw new RecipeImageValidationError(
      "The selected file is not a supported image.",
    );
  }

  return { bytes, format };
}
