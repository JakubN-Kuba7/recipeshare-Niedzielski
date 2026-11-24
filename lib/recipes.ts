import "server-only";

import type { NewRecipe, Recipe, RecipeRating } from "./types";
import { createSupabaseAdminClient } from "./supabase/admin";
import type { RatingRow, RecipeRow } from "./supabase/database.types";

export class RecipeDatabaseError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = "RecipeDatabaseError";
  }
}

export async function getRecipes(): Promise<Recipe[]> {
  const supabase = createSupabaseAdminClient();
  const [recipeResult, ratingResult] = await Promise.all([
    supabase.from("recipes").select("*").order("created_at", { ascending: false }),
    supabase.from("ratings").select("*"),
  ]);

  if (recipeResult.error) {
    throw new RecipeDatabaseError("Recipes could not be loaded.", {
      cause: recipeResult.error,
    });
  }
  if (ratingResult.error) {
    throw new RecipeDatabaseError("Recipe ratings could not be loaded.", {
      cause: ratingResult.error,
    });
  }

  const ratingsByRecipe = groupRatings(ratingResult.data);
  return recipeResult.data.map((row) =>
    mapRecipe(row, ratingsByRecipe.get(row.id) ?? []),
  );
}

export async function getRecipeById(id: string): Promise<Recipe | undefined> {
  const supabase = createSupabaseAdminClient();
  const { data: row, error } = await supabase
    .from("recipes")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new RecipeDatabaseError("The recipe could not be loaded.", {
      cause: error,
    });
  }
  if (!row) {
    return undefined;
  }

  const { data: ratingRows, error: ratingsError } = await supabase
    .from("ratings")
    .select("*")
    .eq("recipe_id", id);

  if (ratingsError) {
    throw new RecipeDatabaseError("Recipe ratings could not be loaded.", {
      cause: ratingsError,
    });
  }

  return mapRecipe(row, ratingRows.map(mapRating));
}

export async function addRecipe(newRecipe: NewRecipe): Promise<Recipe> {
  const { data, error } = await createSupabaseAdminClient()
    .from("recipes")
    .insert({
      author_name: newRecipe.authorName,
      title: newRecipe.title,
      cuisine: newRecipe.cuisine,
      category: newRecipe.category,
      ingredients: newRecipe.ingredients,
      steps: newRecipe.steps,
      prep_time_minutes: newRecipe.prepTimeMinutes,
      image_url: newRecipe.imageUrl,
    })
    .select("*")
    .single();

  if (error) {
    throw new RecipeDatabaseError("The recipe could not be saved.", {
      cause: error,
    });
  }

  return mapRecipe(data, []);
}

export function mapRecipe(row: RecipeRow, ratings: RecipeRating[]): Recipe {
  return {
    id: row.id,
    authorName: row.author_name,
    title: row.title,
    cuisine: row.cuisine,
    category: row.category,
    ingredients: row.ingredients,
    steps: row.steps,
    prepTimeMinutes: row.prep_time_minutes,
    imageUrl: row.image_url,
    createdAt: row.created_at,
    ratings,
  };
}

function groupRatings(rows: RatingRow[]): Map<string, RecipeRating[]> {
  const ratingsByRecipe = new Map<string, RecipeRating[]>();

  for (const row of rows) {
    const ratings = ratingsByRecipe.get(row.recipe_id) ?? [];
    ratings.push(mapRating(row));
    ratingsByRecipe.set(row.recipe_id, ratings);
  }

  return ratingsByRecipe;
}

function mapRating(row: RatingRow): RecipeRating {
  if (!isRatingValue(row.value)) {
    throw new RecipeDatabaseError("A stored recipe rating is invalid.");
  }

  return {
    id: row.id,
    recipeId: row.recipe_id,
    value: row.value,
    createdAt: row.created_at,
  };
}

function isRatingValue(value: number): value is RecipeRating["value"] {
  return Number.isInteger(value) && value >= 1 && value <= 5;
}
