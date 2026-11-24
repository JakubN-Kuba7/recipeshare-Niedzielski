create table if not exists public.recipes (
  id text primary key default gen_random_uuid()::text,
  author_name text not null,
  title text not null,
  cuisine text not null check (cuisine in (
    'American', 'Arabic', 'Chinese', 'German', 'Indian',
    'Iranian', 'Italian', 'Japanese', 'Mexican', 'Other'
  )),
  category text not null check (category in (
    'Breakfast', 'Main Dish', 'Fast Food', 'Soup',
    'Salad', 'Dessert', 'Snack', 'Drink'
  )),
  ingredients text[] not null check (cardinality(ingredients) > 0),
  steps text[] not null check (cardinality(steps) > 0),
  prep_time_minutes integer not null check (prep_time_minutes > 0),
  image_url text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.ratings (
  id text primary key default gen_random_uuid()::text,
  recipe_id text not null references public.recipes(id) on delete cascade,
  value smallint not null check (value between 1 and 5),
  created_at timestamptz not null default now()
);

create index if not exists recipes_created_at_idx
  on public.recipes (created_at desc);
create index if not exists ratings_recipe_id_idx
  on public.ratings (recipe_id);

alter table public.recipes enable row level security;
alter table public.ratings enable row level security;
grant all on public.recipes to service_role;
grant all on public.ratings to service_role;

insert into public.recipes (
  id, author_name, title, cuisine, category, ingredients, steps,
  prep_time_minutes, image_url, created_at
) values
  (
    'iranian-ghormeh-sabzi',
    'RecipeShare Kitchen',
    'Ghormeh Sabzi',
    'Iranian',
    'Main Dish',
    array['Fresh parsley', 'Fresh cilantro', 'Kidney beans', 'Dried limes', 'Onion'],
    array[
      'Chop and saute the herbs with the onion.',
      'Add beans, dried limes, and water, then simmer until tender.',
      'Serve warm with rice.'
    ],
    90,
    'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=80',
    '2026-01-15T12:00:00Z'
  ),
  (
    'italian-tiramisu',
    'RecipeShare Kitchen',
    'Tiramisu',
    'Italian',
    'Dessert',
    array['Ladyfinger biscuits', 'Espresso', 'Mascarpone', 'Eggs', 'Cocoa powder'],
    array[
      'Dip the biscuits briefly in espresso.',
      'Layer the biscuits with a mixture of mascarpone and eggs.',
      'Chill, then dust with cocoa powder before serving.'
    ],
    30,
    'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=1200&q=80',
    '2026-01-17T12:00:00Z'
  )
on conflict (id) do nothing;

insert into public.ratings (id, recipe_id, value, created_at) values
  ('rating-ghormeh-1', 'iranian-ghormeh-sabzi', 5, '2026-01-16T12:00:00Z'),
  ('rating-tiramisu-1', 'italian-tiramisu', 4, '2026-01-18T12:00:00Z')
on conflict (id) do nothing;

insert into storage.buckets (
  id, name, public, file_size_limit, allowed_mime_types
) values (
  'recipe-images',
  'recipe-images',
  true,
  3145728,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public can read recipe images" on storage.objects;
create policy "Public can read recipe images"
  on storage.objects for select
  to public
  using (bucket_id = 'recipe-images');
