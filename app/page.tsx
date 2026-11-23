import Link from "next/link";

import { RecipeBrowser } from "./components/RecipeBrowser";
import { getRecipes } from "../lib/recipes";

export default function Home() {
  const recipes = getRecipes();

  return (
    <main className="min-h-screen bg-zinc-50 px-6 py-12 sm:px-10">
      <div className="mx-auto max-w-6xl">
        <header className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-zinc-950">
              RecipeShare
            </h1>
            <p className="mt-3 text-lg text-zinc-600">
              Share and discover recipes from around the world
            </p>
          </div>
          <Link
            href="/recipes/new"
            className="inline-flex w-fit items-center justify-center rounded-lg bg-emerald-800 px-5 py-3 font-semibold text-white transition-colors hover:bg-emerald-900 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-700"
          >
            Add a recipe
          </Link>
        </header>
        <RecipeBrowser recipes={recipes} />
      </div>
    </main>
  );
}
