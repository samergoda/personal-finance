import type { Category } from "../../types";
import { DEFAULT_CATEGORIES } from "../../data/defaultCategories";
import { STORAGE_KEYS, load, save } from "./common";
import { supabase } from "../../lib/supabase";

export const categoryStorage = {
  getAll(): Category[] {
    return load<Category[]>(STORAGE_KEYS.CATEGORIES, DEFAULT_CATEGORIES);
  },
  save(categories: Category[]): void {
    save(STORAGE_KEYS.CATEGORIES, categories);
    void syncCategoriesToSupabase(categories);
  },
  add(category: Category): Category[] {
    const all = [...categoryStorage.getAll(), category];
    categoryStorage.save(all);
    return all;
  },
  update(updated: Category): Category[] {
    const all = categoryStorage.getAll().map((c) => (c.id === updated.id ? updated : c));
    categoryStorage.save(all);
    return all;
  },
  delete(id: string): Category[] {
    const all = categoryStorage.getAll().filter((c) => c.id !== id);
    categoryStorage.save(all);
    return all;
  },
};

async function syncCategoriesToSupabase(rows: Category[]): Promise<void> {
  if (!supabase) return;

  const { error } = await supabase.from("categories").upsert(
    rows.map((row) => ({
      id: row.id,
      name: row.name,
      type: row.type,
      is_default: Boolean(row.isDefault),
    })),
    { onConflict: "id" },
  );

  if (error) {
    console.error("Supabase categories sync failed:", error.message);
  }
}
