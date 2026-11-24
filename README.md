# RecipeShare

Live app: https://recipeshare-niedzielski.vercel.app/

RecipeShare lets visitors share, browse, filter, search, sort, and rate recipes. Recipe records are stored in Supabase; food images are stored in the public Supabase Storage bucket.

## Local setup

1. Install Node.js and dependencies:

   ```bash
   npm install
   ```

2. Link this repository to the Vercel project and pull its environment variables:

   ```bash
   vercel link
   vercel env pull .env.local
   ```

   Keep `.env.local` private; it is ignored by Git. See `.env.example` for the variable names. Vercel may write `[SENSITIVE]` placeholders instead of secret values; set `SUPABASE_URL` and `SUPABASE_SECRET_KEY` (or `SUPABASE_SERVICE_ROLE_KEY`) locally from Supabase. The secret key is server-only and must never be exposed in browser code.

3. If this Supabase project already has `public.recipes` or `public.ratings`, inspect those schemas before applying the migration; `CREATE TABLE IF NOT EXISTS` does not reconcile a different existing schema. Otherwise, in the Supabase SQL Editor, run `supabase/migrations/202611230001_recipe_persistence_and_images.sql`. It creates the recipe and rating tables, seeds the sample recipes, and creates the public `recipe-images` bucket.

4. Start the development server:

   ```bash
   npm run dev
   ```

   Open http://localhost:3000.

## Deployment

The production app is hosted at [recipeshare-niedzielski.vercel.app](https://recipeshare-niedzielski.vercel.app/). The GitHub repository is connected to Vercel, and each push to `main` triggers an automatic production deployment. GitHub Actions also runs tests and a production build on pushes and pull requests. Confirm the deployment is ready in Vercel before treating a change as live.

## Existing image migration

After running the SQL migration and pulling the Vercel environment variables, copy existing public image URLs into Supabase Storage with:

```bash
npm run migrate:recipe-images -- --confirm-rights
```

Only run this if you have permission to copy and share every existing food photo. The migration skips URLs already in the project bucket, accepts HTTPS images only, rejects non-public DNS addresses and redirects, and enforces the supported formats and 3 MB limit. If a previously submitted recipe existed only in a server's memory and is not in the `recipes` table, it cannot be migrated by this command.

## Tests and build

```bash
npm test
npm run lint
npm run build
```

## Feature checklist

Checked items have passed their deployed acceptance criteria. Recipe and rating data are stored in Supabase, and uploaded images are stored in its public Storage bucket.

### Must

- [x] M1 Browse recipe cards
- [x] M2 View recipe details
- [x] M3 Add recipes with required-field validation and a stored food image
- [x] M4 Filter by cuisine and category
- [x] M5 Rate recipes
- [x] M6 Persist recipes in Supabase
- [x] M7 Seed sample recipes

### Should

- [ ] S1 Google sign-in
- [ ] S2 Author edit/delete
- [ ] S3 Account-based ratings
- [x] S4 Store uploaded recipe images in Supabase Storage
- [x] S5 Keyword search
- [x] S6 Sort by newest or highest rated

### Could

- [ ] Comments
- [ ] Favorites
- [ ] Servings scaler
- [ ] Recipe video links
- [ ] Dietary tags
- [ ] Additional ideas
