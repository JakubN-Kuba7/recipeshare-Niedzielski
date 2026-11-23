import Image from "next/image";
import Link from "next/link";

import { getRatingSummary } from "../../lib/recipe-utils";
import type { Recipe } from "../../lib/types";

type RecipeCardProps = {
  recipe: Recipe;
  eagerImage?: boolean;
};

export function RecipeCard({ recipe, eagerImage = false }: RecipeCardProps) {
  const rating = getRatingSummary(recipe.ratings);

  return (
    <Link
      href={`/recipes/${recipe.id}`}
      className="block rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-700"
    >
      <article className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition-shadow hover:shadow-md">
        <div className="relative aspect-[4/3] bg-zinc-100">
          <Image
            src={recipe.imageUrl}
            alt={recipe.title}
            fill
            loading={eagerImage ? "eager" : "lazy"}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover"
          />
        </div>
        <div className="p-5">
          <h2 className="text-xl font-semibold text-zinc-900">{recipe.title}</h2>
          <p className="mt-2 text-sm text-zinc-600">
            {recipe.cuisine} <span aria-hidden="true">·</span> {recipe.category}
          </p>
          {rating.average === null ? (
            <p className="mt-4 text-sm text-zinc-500">No ratings yet</p>
          ) : (
            <p
              className="mt-4 text-sm font-medium text-zinc-700"
              aria-label={`Average rating: ${rating.average.toFixed(1)} out of 5`}
            >
              <span className="text-amber-500" aria-hidden="true">
                ★
              </span>{" "}
              {rating.average.toFixed(1)}{" "}
              <span className="font-normal text-zinc-500">
                ({rating.count} {rating.count === 1 ? "rating" : "ratings"})
              </span>
            </p>
          )}
        </div>
      </article>
    </Link>
  );
}
