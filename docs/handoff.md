# RecipeShare Handoff

Updated: 2026-11-24

## Current state

- Step 10, **Load sample recipes (M7)** in `docs/plan.md`, is complete.
- M7 was verified on the live app: Ghormeh Sabzi (Iranian, Main Dish) and Tiramisu (Italian, Dessert) are available, and combined filtering works.
- M5 ratings are deployed and the user confirmed the live rating flow works.
- M3, M6, and S4 were verified with the production test recipe; its record and image persisted after reload and later deployments, and the user confirmed it appears on another device.
- S5 keyword search and S6 newest/highest-rated sorting are deployed and were verified live with the available recipes.
- Step 12, **Review and complete automated tests**, is complete: the current source suite runs 44 tests across 10 test files.
- Step 13, **Add GitHub Actions CI**, is complete. The workflow at `.github/workflows/ci.yml` runs tests and a production build on pushes and pull requests.
- The user confirmed the M6 test recipe appears on another device. It remained visible after reload, in a fresh browser page, and after later deployments.
- Commit `ee5e102` (`Add Supabase recipe image storage`) is on `main` and was verified against `origin/main`.
- European cuisine was added to the shared cuisine list and deployed. The production database constraint was updated; `supabase/migrations/202611240001_add_european_cuisine.sql` records the change.
- Step 14, **Final deployed verification**, is complete. The README now documents deployment from `main`, and M1-M7 were rechecked on desktop and mobile.
- Commits `4085f2a` (European cuisine) and `b692e08` (deployment documentation) are on `main`.
- S1 Google sign-in, S2 owner-only recipe editing/deletion, and S3 signed-in ratings have uncommitted local implementation changes. The user chose to skip Google Auth; these changes were not deployed and must not be staged or deployed unless requested.
- A Google OAuth client was created in Google Cloud, but Google was not enabled/saved as a Supabase provider. The auth/ownership SQL migration remains unapplied.
- Production deployment is READY at <https://recipeshare-niedzielski.vercel.app/>.
- The base schema migration and European cuisine constraint were applied successfully in the Supabase SQL Editor. The auth/ownership migration has not been applied.
- The image migration reported `2 migrated, 0 skipped`; a second run reported `0 migrated, 2 skipped`.
- The seeded database records are Ghormeh Sabzi and Tiramisu. A clearly labeled M6 test recipe, `M6 Persistence Test - 2026-11-24`, was also added and remains publicly visible. The previously submitted user recipe was not in `public.recipes` and was not recovered or migrated.

## Implementation

- Recipe and rating reads/writes use Supabase from server-only code.
- New recipe forms accept JPEG, PNG, or WebP images up to 3 MB, require a rights confirmation, and store images in the public `recipe-images` bucket.
- `scripts/migrate-recipe-images.ts` copies existing external image URLs to Storage after the explicit `--confirm-rights` flag. It rejects non-HTTPS URLs, non-public DNS addresses, redirects, unsupported formats, and oversized downloads.
- European is a fixed cuisine choice used by recipe forms and filters. Fresh databases need the base recipe migration followed by the European cuisine migration.
- `.env.example` contains variable names/placeholders only. Never commit `.env.local` or share its secret values.

## Verification

- `npm test`: 44 tests passed across 10 files, including direct server-action authorization checks and edit validation.
- `npm run lint`: passed.
- `npm run build`: passed.
- Latest GitHub Actions run `45472990340` passed on `main`, including dependency installation, tests, and production build.
- Vercel reported the deployment for `b692e08` completed successfully; the production URL is READY.
- M1-M7 were checked live at desktop (1280x800) and mobile (390x844): recipe cards/photos/ratings render; detail pages show author and recipe fields; the empty add form reports required-field errors; Iranian + Main Dish filtering returns Ghormeh Sabzi, European shows no matches, and clearing filters restores all three cards; detail pages show five rating controls and current averages/counts; the existing M6 test record remains after reload; and the two seeded recipes have different cuisines and categories. No recipe or rating was added during this verification.
- Mobile homepage content measured 375px wide in a 390px viewport, with no horizontal overflow.
- GitHub secret scanning and push protection are enabled; there are 0 open and 0 resolved secret-scanning alerts. `.env.example` has placeholder values only, and no `.env.local` is tracked.
- The Vercel error-log scan returned 0 records for the last 30 minutes. No drains or error-monitoring integration are configured; the user acknowledged this monitoring gap.
- `vercel curl` created an automation protection bypass during the smoke check. It was revoked and the project now reports zero bypass entries.

## Next steps

1. Step 14 is complete; there are no remaining steps in `docs/plan.md`.
2. S1-S3 remain unchecked. Google Auth was intentionally skipped by the user; do not configure the provider, apply the auth/ownership migration, or deploy the uncommitted auth-related work unless requested.
3. Continue with a new feature or task when requested. Preserve the unrelated uncommitted local changes.

## New-machine setup notes

- Link the clone to the Vercel project, then install dependencies with `npm install`.
- Vercel may redact sensitive environment values as `[SENSITIVE]` when running `vercel env pull`. Set the real `SUPABASE_URL` and `SUPABASE_SECRET_KEY` (or `SUPABASE_SERVICE_ROLE_KEY`) locally in the ignored `.env.local`; never paste them into chat or commit them.
- The base recipe/image migration and European cuisine migration are applied to production. The auth/ownership migration is intentionally deferred.
- The latest pushed commit is `b692e08`; local uncommitted S1-S3/auth-related files are not included in that commit.
- Run `npm test`, `npm run lint`, and `npm run build` before continuing.
