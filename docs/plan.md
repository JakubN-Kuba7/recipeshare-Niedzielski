# RecipeShare Implementation Plan

This plan builds the Must features M1-M7 in small steps. It follows `docs/spec.md` as the source of truth and `AGENTS.md` for coding, testing, and security conventions.

## 1. Initialize the Next.js application

- **Files:** `package.json`, `next.config.*`, `tsconfig.json`, `app/layout.tsx`, `app/page.tsx`, `app/globals.css`, `.gitignore`, `.env.example`
- **Work:** Create the Next.js TypeScript application. Add a shared application layout and an initial home page.
- **Test:** Add a smoke test that verifies the home page renders.
- **Check:** Run `npm run dev`, open the local URL, and confirm the app loads.
- **Commit:** Commit the working base application before feature work.

## 2. Build the recipe data model and fixed choices

- **Files:** `lib/types.ts`, `lib/constants.ts`, `lib/sample-data.ts`
- **Work:** Define recipe and rating types. Create exactly the cuisine and category values in `docs/spec.md` and add at least two sample recipes with different cuisines and categories.
- **Test:** Add a test that verifies every fixed cuisine/category value and the required sample-data shape.
- **Check:** Confirm the constants and sample data compile, and no fixed values contain unexpected text options.
- **Commit:** Commit the shared types, constants, and sample data.

## 3. Build temporary in-memory recipe browsing (M1)

- **Files:** `app/page.tsx`, `app/components/RecipeCard.tsx`, `lib/recipes.ts`
- **Work:** Display recipe cards with image, title, cuisine, category, average rating, and rating count. Keep temporary data in memory until the database is connected.
- **Test:** Add a rendering test that verifies a recipe card shows all required M1 fields and calculated average rating.
- **Check:** Open the home page and confirm sample recipes appear as cards with the required information.
- **Commit:** Commit and push the working browse page.

## 4. Add the recipe detail page (M2)

- **Files:** `app/recipes/[id]/page.tsx`, `app/components/RecipeCard.tsx`, `lib/recipes.ts`
- **Work:** Add a dynamic detail route. Clicking a card opens all recipe fields, including the ingredients, steps, preparation time, image, cuisine, category, and author name.
- **Test:** Add a test that verifies a recipe card links to the detail route and the detail page renders every field.
- **Check:** Click each sample recipe and confirm its complete details and author name appear.
- **Commit:** Commit and push the detail page.

## 5. Build the add-recipe form (M3)

- **Files:** `app/recipes/new/page.tsx`, `app/components/RecipeForm.tsx`, `lib/validation.ts`, `lib/recipes.ts`
- **Work:** Add a form for author name, title, cuisine, category, ingredients, steps, prep time in minutes, and image URL. Use fixed dropdown values. Validate required fields and prevent saving or adding a recipe when any field is missing.
- **Test:** Add tests for successful submission and each required-field validation case.
- **Check:** Submit a complete recipe and confirm it appears on the home page. Submit empty or incomplete forms and confirm the missing field is identified and nothing is saved.
- **Commit:** Commit and push the form and validation.

## 6. Build cuisine and category filtering (M4)

- **Files:** `app/page.tsx`, `app/components/RecipeFilters.tsx`, `lib/recipes.ts`
- **Work:** Add cuisine and category dropdown filters. Combine both filters and support clearing both selections to show all recipes.
- **Test:** Add tests for combined cuisine/category filtering, clearing filters, and the `No recipes found` state.
- **Check:** Select Iranian and Main Dish. Confirm only matching recipes appear. Clear both choices and confirm all recipes return. Select a combination with no results and confirm the exact text `No recipes found`.
- **Commit:** Commit and push filtering.

## 7. Deploy the browsing, detail, add, and filter app to Vercel

- **Files:** `README.md`, `vercel.json` only if needed
- **Work:** Create a Vercel project, connect the GitHub repository, configure it for automatic main-branch deployments, and deploy the working M1-M4 implementation.
- **Test:** Run the complete test suite and production build before pushing.
- **Check:** Open the public Vercel URL. Verify M1-M4 work in the deployed app, not only locally.
- **Commit:** Commit and push a deployable state. Confirm the Vercel main-branch deployment succeeds.

## 8. Create the Supabase database schema

- **Files:** `supabase/migrations/*.sql`, `lib/supabase/server.ts`, `lib/supabase/client.ts`, `.env.example`
- **Work:** Create `recipes` and `ratings` tables plus needed indexes. Store the image URL, author name, title, cuisine, category, ingredients, steps, prep time, creation time, and rating data. Add environment-variable names to `.env.example` only.
- **Test:** Add a database-independent test for the recipe/rating data shape and migration query or schema checks if supported by the test setup.
- **Check:** Confirm the Supabase tables exist and required fields have appropriate constraints.
- **Commit:** Commit the migration and environment-variable names only. Never commit secret values.

## 9. Connect the app to Supabase (M6)

- **Files:** `lib/supabase/server.ts`, `lib/recipes.ts`, `app/page.tsx`, `app/recipes/[id]/page.tsx`, `app/recipes/new/page.tsx`
- **Work:** Replace temporary sample data and in-memory additions with Supabase reads and writes. Add server-side validation and return clear errors for invalid submissions.
- **Test:** Add integration or mocked-database tests for fetching recipes and persisting a valid recipe.
- **Check:** Configure local and Vercel environment variables. Add a recipe on one device and confirm it appears on another device and remains after redeployment.
- **Commit:** Commit and push Supabase integration.

## 10. Load sample recipes (M7)

- **Files:** `supabase/seed.sql`, `supabase/migrations/*.sql`, `lib/sample-data.ts`
- **Work:** Seed at least two recipes with different cuisines and categories into the live database.
- **Test:** Add a test that verifies at least two seed recipes and their different fixed cuisine/category combinations.
- **Check:** Open the live app and confirm at least two sample recipes exist; test filtering with one of their exact cuisine and category values.
- **Commit:** Commit the seed data and redeploy/push if needed.

## 11. Add recipe rating updates (M5)

- **Files:** `app/recipes/[id]/page.tsx`, `app/components/StarRating.tsx`, `app/api/ratings/route.ts` or a Supabase RPC/server action, `lib/ratings.ts`
- **Work:** Let visitors choose one to five stars. Persist ratings and calculate and return both average rating and rating count.
- **Test:** Add unit tests for the average-rating calculation and integration tests for rating creation/update behavior.
- **Check:** Submit ratings for a recipe and confirm the detail page and its card show the updated average and count.
- **Commit:** Commit and push ratings.

## 12. Review and complete automated tests

- **Files:** `package.json`, `vitest.config.*`, `test/**`, `app/**/*.test.ts`, `app/**/*.test.tsx`, `lib/**/*.test.ts`
- **Work:** Ensure at least three passing tests cover M3 required-field validation, M4 filtering, and M5 average rating. Keep tests added along the way and make them run with one command.
- **Test:** Run `npm test`, add missing focused tests, and confirm the suite passes.
- **Check:** Run `npm test` once and report the tests and features they verify.
- **Commit:** Commit the test suite.

## 13. Add GitHub Actions CI

- **Files:** `.github/workflows/ci.yml`, `package.json`
- **Work:** Configure GitHub Actions to install dependencies, run tests, and build the app on every push and pull request.
- **Test:** The workflow itself is verified by each CI run.
- **Check:** Open the GitHub Actions tab after a push and confirm the latest main-branch run has a green check.
- **Commit:** Commit and push the workflow.

## 14. Final deployed verification

- **Files:** `README.md`, `.env.example`
- **Work:** Update the README with the live Vercel URL, setup instructions, test/build commands, deployment information, and a checklist for M1-M7 and S/Could features.
- **Test:** Run `npm test` and `npm run build` locally, then run the CI workflow.
- **Check:** Recheck M1-M7 in the live app on a desktop and mobile browser. Verify no secrets are present in the repository or Git history.
- **Commit:** Commit and push the final README and deployed application state.
