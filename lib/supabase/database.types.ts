import type { Category, Cuisine } from "../constants";

export type RecipeRow = {
  id: string;
  author_name: string;
  title: string;
  cuisine: Cuisine;
  category: Category;
  ingredients: string[];
  steps: string[];
  prep_time_minutes: number;
  image_url: string;
  created_at: string;
};

export type RatingRow = {
  id: string;
  recipe_id: string;
  value: number;
  created_at: string;
};

export type Database = {
  public: {
    Tables: {
      recipes: {
        Row: RecipeRow;
        Insert: Omit<RecipeRow, "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<RecipeRow>;
        Relationships: [];
      };
      ratings: {
        Row: RatingRow;
        Insert: Omit<RatingRow, "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<RatingRow>;
        Relationships: [
          {
            foreignKeyName: "ratings_recipe_id_fkey";
            columns: ["recipe_id"];
            isOneToOne: false;
            referencedRelation: "recipes";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
