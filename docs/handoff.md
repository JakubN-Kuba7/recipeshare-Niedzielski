# RecipeShare Handoff

Updated: 2026-11-24

## Current state

- Step 10, **Load sample recipes (M7)** in `docs/plan.md`, is complete.
- M7 was verified on the live app: Ghormeh Sabzi (Iranian, Main Dish) and Tiramisu (Italian, Dessert) are available, and combined filtering works.
- M5 ratings are deployed and the user confirmed the live rating flow works.
- Step 12, **Review and complete automated tests**, is complete: `npm test` runs 28 tests across 7 test files.
- Step 13, **Add GitHub Actions CI**, is complete. The workflow at `.github/workflows/ci.yml` runs tests and a production build on pushes and pull requests.
- The user confirmed the M6 test recipe appears on another device. It also remained visible after reload and in a fresh browser page; persistence across a subsequent redeployment still needs verification.
- Commit `ee5e102` (`Add Supabase recipe image storage`) is on `main` and was verified against `origin/main`.
- Production deployment is READY at <https://recipeshare-niedzielski.vercel.app/>.
- The Supabase schema migration was run successfully in the Supabase SQL Editor.
- The image migration reported `2 migrated, 0 skipped`; a second run reported `0 migrated, 2 skipped`.
- The seeded database records are Ghormeh Sabzi and Tiramisu. A clearly labeled M6 test recipe, `M6 Persistence Test - 2026-11-24`, was also added and remains publicly visible. The previously submitted user recipe was not in `public.recipes` and was not recovered or migrated.

## Implementation

- Recipe and rating reads/writes use Supabase from server-only code.
- New recipe forms accept JPEG, PNG, or WebP images up to 3 MB, require a rights confirmation, and store images in the public `recipe-images` bucket.
- `scripts/migrate-recipe-images.ts` copies existing external image URLs to Storage after the explicit `--confirm-rights` flag. It rejects non-HTTPS URLs, non-public DNS addresses, redirects, unsupported formats, and oversized downloads.
- `.env.example` contains variable names/placeholders only. Never commit `.env.local` or share its secret values.

## Verification

- `npm test`: 28 tests passed across 7 test files.
- `npm run lint`: passed.
- `npm run build`: passed.
- GitHub Actions run 45442266449 passed on `main`, including dependency installation, tests, and production build. It used the current Node 24-compatible action versions without the earlier deprecation warning.
- Production deployment status: READY; the homepage smoke check passed.
- The Vercel error-log scan returned 0 records for the last 30 minutes. No drains or error-monitoring integration are configured; the user acknowledged this monitoring gap.
- `vercel curl` created an automation protection bypass during the smoke check. It was revoked and the project now reports zero bypass entries.

## Next steps

1. Continue with Step 14 in `docs/plan.md`: finish the README feature checklist and perform final desktop/mobile acceptance checks.
2. Verify that the M6 test recipe remains available after a fresh deployment before marking M6 complete in the README.
3. If the missing user recipe can be recovered, re-add it through the deployed upload flow after verifying its details and image.

## New-machine setup notes

- Link the clone to the Vercel project, then install dependencies with `npm install`.
- Vercel may redact sensitive environment values as `[SENSITIVE]` when running `vercel env pull`. Set the real `SUPABASE_URL` and `SUPABASE_SECRET_KEY` (or `SUPABASE_SERVICE_ROLE_KEY`) locally in the ignored `.env.local`; never paste them into chat or commit them.
- The Supabase SQL migration is already applied to the production project. Do not rerun it unless preparing a different database and first checking its existing schema.
- Run `npm test`, `npm run lint`, and `npm run build` before continuing.
