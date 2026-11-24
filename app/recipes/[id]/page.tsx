import { Suspense } from "react";
import { notFound } from "next/navigation";
import { connection } from "next/server";

import { RecipeDetail } from "../../components/RecipeDetail";
import { getRecipeById } from "../../../lib/recipes";
import { SAMPLE_RECIPES } from "../../../lib/sample-data";

export function generateStaticParams() {
  return SAMPLE_RECIPES.map((recipe) => ({ id: recipe.id }));
}

export default function RecipePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-zinc-50 px-6 py-10 sm:px-10">
          <div className="mx-auto max-w-4xl rounded-2xl bg-white p-8 text-zinc-600 shadow-sm">
            Loading recipe...
          </div>
        </main>
      }
    >
      {params.then(({ id }) => <RecipeContent id={id} />)}
    </Suspense>
  );
}

async function RecipeContent({ id }: { id: string }) {
  await connection();
  const recipe = await getRecipeById(id);

  if (!recipe) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-zinc-50 px-6 py-10 sm:px-10">
      <div className="mx-auto max-w-4xl">
        <RecipeDetail recipe={recipe} />
      </div>
    </main>
  );
}
