# RecipeShare Handoff

Updated: 2026-11-23

## Current state

- Step 10, **Load sample recipes (M7)** in `docs/plan.md`, is complete.
- Commit `ee5e102` (`Add Supabase recipe image storage`) is on `main` and was verified against `origin/main`.
- Production deployment is READY at <https://recipeshare-niedzielski.vercel.app/>.
- The Supabase schema migration was run successfully in the Supabase SQL Editor.
- The image migration reported `2 migrated, 0 skipped`; a second run reported `0 migrated, 2 skipped`.
- The two database records are the seeded sample recipes, Ghormeh Sabzi and Tiramisu. The previously submitted user recipe was not in `public.recipes` and was not recovered or migrated.

## Implementation

- Recipe and rating reads/writes use Supabase from server-only code.
- New recipe forms accept JPEG, PNG, or WebP images up to 3 MB, require a rights confirmation, and store images in the public `recipe-images` bucket.
- `scripts/migrate-recipe-images.ts` copies existing external image URLs to Storage after the explicit `--confirm-rights` flag. It rejects non-HTTPS URLs, non-public DNS addresses, redirects, unsupported formats, and oversized downloads.
- `.env.example` contains variable names/placeholders only. Never commit `.env.local` or share its secret values.

## Verification

- `npm test`: 26 tests passed.
- `npm run lint`: passed.
- `npm run build`: passed.
- Production deployment status: READY; the homepage smoke check passed.
- The Vercel error-log scan returned 0 records for the last 30 minutes. No drains or error-monitoring integration are configured; the user acknowledged this monitoring gap.
- `vercel curl` created an automation protection bypass during the smoke check. It was revoked and the project now reports zero bypass entries.

## Next steps

1. In the deployed app, test adding a recipe with a valid image; verify it appears in the list and remains available after reload/on another device. M3, M6, and S4 remain unchecked in the README until this is verified.
2. Continue with Step 11 in `docs/plan.md`: implement M5 ratings.
3. If the missing user recipe can be recovered, re-add it through the deployed upload flow after verifying its details and image.

## New-machine setup notes

- Link the clone to the Vercel project, then install dependencies with `npm install`.
- Vercel may redact sensitive environment values as `[SENSITIVE]` when running `vercel env pull`. Set the real `SUPABASE_URL` and `SUPABASE_SECRET_KEY` (or `SUPABASE_SERVICE_ROLE_KEY`) locally in the ignored `.env.local`; never paste them into chat or commit them.
- The Supabase SQL migration is already applied to the production project. Do not rerun it unless preparing a different database and first checking its existing schema.
- Run `npm test`, `npm run lint`, and `npm run build` before continuing.
