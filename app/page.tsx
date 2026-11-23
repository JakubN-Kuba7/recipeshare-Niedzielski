import { RecipeCard } from "./components/RecipeCard";
import { SAMPLE_RECIPES } from "../lib/sample-data";

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-50 px-6 py-12 sm:px-10">
      <div className="mx-auto max-w-6xl">
        <header className="mb-10">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-950">
            RecipeShare
          </h1>
          <p className="mt-3 text-lg text-zinc-600">
            Share and discover recipes from around the world
          </p>
        </header>
        <section
          aria-label="Recipes"
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {SAMPLE_RECIPES.map((recipe, index) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              eagerImage={index === 0}
            />
          ))}
        </section>
      </div>
    </main>
  );
}
