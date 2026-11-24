import "server-only";

import { randomUUID } from "node:crypto";

import { createSupabaseAdminClient } from "./supabase/admin";
import {
  RECIPE_IMAGES_BUCKET,
  type RecipeImageFormat,
} from "./recipe-image";

export class RecipeImageStorageError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = "RecipeImageStorageError";
  }
}

export async function uploadRecipeImage(
  bytes: Uint8Array,
  format: RecipeImageFormat,
): Promise<{ imageUrl: string; storagePath: string }> {
  const supabase = createSupabaseAdminClient();
  const storagePath = `${randomUUID()}.${format.extension}`;
  const { error } = await supabase.storage
    .from(RECIPE_IMAGES_BUCKET)
    .upload(storagePath, bytes, {
      cacheControl: "31536000",
      contentType: format.contentType,
      upsert: false,
    });

  if (error) {
    throw new RecipeImageStorageError(
      "The image could not be uploaded to Supabase Storage.",
      { cause: error },
    );
  }

  const { data } = supabase.storage
    .from(RECIPE_IMAGES_BUCKET)
    .getPublicUrl(storagePath);

  return { imageUrl: data.publicUrl, storagePath };
}

export async function deleteRecipeImage(storagePath: string): Promise<void> {
  const { error } = await createSupabaseAdminClient()
    .storage.from(RECIPE_IMAGES_BUCKET)
    .remove([storagePath]);

  if (error) {
    throw new RecipeImageStorageError(
      "The uploaded image could not be removed.",
      { cause: error },
    );
  }
}
