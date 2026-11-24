import Image from "next/image";
import Link from "next/link";

import { getRatingSummary } from "../../lib/recipe-utils";
import type { Recipe } from "../../lib/types";

type RecipeDetailProps = {
  recipe: Recipe;
};

export function RecipeDetail({ recipe }: RecipeDetailProps) {
  const rating = getRatingSummary(recipe.ratings);

  return (
    <article className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
      <div className="relative aspect-[16/9] bg-zinc-100">
        <Image
          src={recipe.imageUrl}
          alt={recipe.title}
          fill
          unoptimized
          loading="eager"
          sizes="(max-width: 896px) 100vw, 896px"
          className="object-cover"
        />
      </div>
      <div className="p-6 sm:p-10">
        <Link
          href="/"
          className="text-sm font-medium text-emerald-800 underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-700"
        >
          Back to all recipes
        </Link>
        <header className="mt-6">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-950">
            {recipe.title}
          </h1>
          <p className="mt-2 text-zinc-600">By {recipe.authorName}</p>
        </header>

        <dl className="mt-6 grid grid-cols-2 gap-4 rounded-xl bg-zinc-50 p-4 sm:grid-cols-4">
          <div>
            <dt className="text-sm text-zinc-500">Cuisine</dt>
            <dd className="mt-1 font-medium text-zinc-900">{recipe.cuisine}</dd>
          </div>
          <div>
            <dt className="text-sm text-zinc-500">Category</dt>
            <dd className="mt-1 font-medium text-zinc-900">
              {recipe.category}
            </dd>
          </div>
          <div>
            <dt className="text-sm text-zinc-500">Prep time</dt>
            <dd className="mt-1 font-medium text-zinc-900">
              {recipe.prepTimeMinutes} minutes
            </dd>
          </div>
          <div>
            <dt className="text-sm text-zinc-500">Average rating</dt>
            <dd className="mt-1 font-medium text-zinc-900">
              {rating.average === null
                ? "No ratings yet"
                : `${rating.average.toFixed(1)} out of 5 (${rating.count} ${
                    rating.count === 1 ? "rating" : "ratings"
                  })`}
            </dd>
          </div>
        </dl>

        <section className="mt-8">
          <h2 className="text-xl font-semibold text-zinc-900">Ingredients</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-zinc-700">
            {recipe.ingredients.map((ingredient) => (
              <li key={ingredient}>{ingredient}</li>
            ))}
          </ul>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold text-zinc-900">Steps</h2>
          <ol className="mt-3 list-decimal space-y-3 pl-5 text-zinc-700">
            {recipe.steps.map((step, index) => (
              <li key={`${recipe.id}-step-${index}`}>{step}</li>
            ))}
          </ol>
        </section>
      </div>
    </article>
  );
}
