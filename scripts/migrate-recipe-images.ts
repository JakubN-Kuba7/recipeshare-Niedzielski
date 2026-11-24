import { randomUUID } from "node:crypto";
import { createClient } from "@supabase/supabase-js";

import { downloadExternalRecipeImage } from "../lib/external-image";
import { RECIPE_IMAGES_BUCKET } from "../lib/recipe-image";
import type { Database } from "../lib/supabase/database.types";

async function main(): Promise<void> {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseSecretKey =
    process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!process.argv.includes("--confirm-rights")) {
    throw new Error(
      "Pass --confirm-rights only after confirming you may copy and share the existing food images.",
    );
  }
  if (!supabaseUrl || !supabaseSecretKey) {
    throw new Error(
      "SUPABASE_URL and SUPABASE_SECRET_KEY must be configured in .env.local.",
    );
  }

  const supabase = createClient<Database>(supabaseUrl, supabaseSecretKey, {
    auth: {
      autoRefreshToken: false,
      detectSessionInUrl: false,
      persistSession: false,
    },
  });

  const { data: recipes, error: listError } = await supabase
    .from("recipes")
    .select("id,image_url")
    .order("created_at", { ascending: true });

  if (listError) {
    throw new Error("Could not read recipes for image migration.", {
      cause: listError,
    });
  }

  let migrated = 0;
  let skipped = 0;

  for (const recipe of recipes) {
    if (isStoredRecipeImage(recipe.image_url, supabaseUrl)) {
      skipped += 1;
      continue;
    }

    const { bytes, format } = await downloadExternalRecipeImage(
      recipe.image_url,
    );
    const storagePath = `migrated/${recipe.id}-${randomUUID()}.${format.extension}`;
    const { error: uploadError } = await supabase.storage
      .from(RECIPE_IMAGES_BUCKET)
      .upload(storagePath, Buffer.from(bytes), {
        cacheControl: "31536000",
        contentType: format.contentType,
        upsert: false,
      });

    if (uploadError) {
      throw new Error(`Could not store image for recipe ${recipe.id}.`, {
        cause: uploadError,
      });
    }

    const publicUrl = supabase.storage
      .from(RECIPE_IMAGES_BUCKET)
      .getPublicUrl(storagePath).data.publicUrl;
    const { data: updatedRecipe, error: updateError } = await supabase
      .from("recipes")
      .update({ image_url: publicUrl })
      .eq("id", recipe.id)
      .eq("image_url", recipe.image_url)
      .select("id")
      .maybeSingle();

    if (updateError || !updatedRecipe) {
      const { error: cleanupError } = await supabase.storage
        .from(RECIPE_IMAGES_BUCKET)
        .remove([storagePath]);
      if (cleanupError) {
        throw new Error(
          `Recipe ${recipe.id} was not updated and its uploaded image could not be cleaned up.`,
          { cause: cleanupError },
        );
      }
      if (updateError) {
        throw new Error(`Could not update recipe ${recipe.id}.`, {
          cause: updateError,
        });
      }
      skipped += 1;
      continue;
    }

    migrated += 1;
  }

  console.log(
    `Image migration complete: ${migrated} migrated, ${skipped} skipped.`,
  );
}

main().catch((error: unknown) => {
  console.error("Recipe image migration failed.", error);
  process.exitCode = 1;
});

function isStoredRecipeImage(imageUrl: string, projectUrl: string): boolean {
  try {
    const image = new URL(imageUrl);
    const project = new URL(projectUrl);
    return (
      image.origin === project.origin &&
      image.pathname.startsWith(
        `/storage/v1/object/public/${RECIPE_IMAGES_BUCKET}/`,
      )
    );
  } catch {
    return false;
  }
}
