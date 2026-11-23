import Link from "next/link";

import { RecipeForm } from "../../components/RecipeForm";

export default function NewRecipePage() {
  return (
    <main className="min-h-screen bg-zinc-50 px-6 py-10 sm:px-10">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/"
          className="text-sm font-medium text-emerald-800 underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-700"
        >
          Back to all recipes
        </Link>
        <header className="mb-8 mt-6">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-950">
            Add a recipe
          </h1>
          <p className="mt-2 text-zinc-600">
            Share a recipe for others to try.
          </p>
        </header>
        <RecipeForm />
      </div>
    </main>
  );
}
