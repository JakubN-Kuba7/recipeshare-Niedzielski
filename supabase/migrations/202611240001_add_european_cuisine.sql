alter table public.recipes
  drop constraint if exists recipes_cuisine_check;

alter table public.recipes
  add constraint recipes_cuisine_check check (cuisine in (
    'American', 'Arabic', 'Chinese', 'European', 'German', 'Indian',
    'Iranian', 'Italian', 'Japanese', 'Mexican', 'Other'
  ));
