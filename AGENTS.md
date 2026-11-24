# RecipeShare Agent Instructions

## Purpose

Build RecipeShare, a deployed recipe-sharing website where visitors can browse, open, add, search, filter, and rate recipes.

Treat `docs/spec.md` as the source of truth for product behavior and acceptance criteria. Build Must features M1-M7 before working on Should or Could features.

## Stack

- Next.js
- React
- Supabase for hosted PostgreSQL database
- Supabase Auth for Google sign-in
- Supabase Storage for recipe photo uploads
- Vercel for deployment
- GitHub Actions for CI
- Vitest and React Testing Library for automated tests

Prefer simple, maintainable implementations over unnecessary abstractions.

## Setup and commands

Install dependencies:

```bash
npm install
```

Start the local development server:

```bash
npm run dev
```

Run the automated test suite:

```bash
npm test
```

Create a production build:

```bash
npm run build
```

Run lint checks:

```bash
npm run lint
```

## Environment variables

Read secrets only from environment variables.

- Never write credentials, database keys, passwords, OAuth secrets, or service-role keys into source files.
- Never commit `.env` or `.env.local`.
- Never include secret values in prompts, logs, screenshots, commits, or documentation.
- Add only variable names and placeholder descriptions to `.env.example`.
- Use the hosting provider's environment settings for production secrets.
- Use the Supabase publishable/anon key only where appropriate for browser-side access, and never expose the Supabase service-role key in client code.

## Development workflow

1. Read `docs/spec.md` before planning or changing code.
2. Implement small features one at a time.
3. Check the feature in the browser against its acceptance criterion.
4. Add or update an automated test as soon as that feature works.
5. Run tests and the build before committing.
6. Commit changes with clear, focused commit messages.
7. Push small, working increments rather than large end-of-project commits.

## Testing

- Add a test for each feature once it works.
- Include at least the filter behavior, average rating calculation, and required-field validation tests.
- Tests must run with one command: `npm test`.
- Test user-visible behavior and important server-side validation.
- Do not add tests that merely check framework behavior or implementation constants.

## Coding conventions

- Use clear, descriptive file and variable names.
- Keep React components small and focused.
- Use TypeScript with strict typing; avoid `any` and unsafe casts.
- Keep fixed cuisine and category values in one shared source and render them as dropdown choices.
- Validate required fields on both the form and server side.
- Use server-side/database constraints where practical.
- Keep database access out of presentation-only components.
- Use accessible form labels, buttons, and error messages.
- Format code consistently with the project's configured formatter.
- Add comments only for logic that is not self-explanatory.

## Product behavior

- Store all recipes and ratings in Supabase.
- Recipe photos are uploaded to the public Supabase Storage `recipe-images` bucket. Accept JPEG, PNG, and WebP files up to 3 MB, and require users to confirm they may share the food photo.
- Keep the Supabase secret/service-role key server-only. Never fetch arbitrary image URLs from new recipe submissions.
- Existing external recipe image URLs can be copied into Storage with `npm run migrate:recipe-images -- --confirm-rights`; the migration checks HTTPS, public DNS addresses, redirects, file type, and size.
- Implement M1-M7 before Should features.
- Implement S1 before S2 and S3 because those features depend on accounts.
- Protect author edit/delete operations and user ratings on the server, not just in the UI.
- Keep the app responsive and usable on mobile.

## Deployment and CI

- The app must deploy on Vercel's free plan.
- Main-branch pushes must trigger automatic deployment.
- GitHub Actions must install dependencies, run tests, and create a production build on every push and pull request.
- The README must contain the live URL, local setup instructions, test commands, and a checklist for M, S, and Could features.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
