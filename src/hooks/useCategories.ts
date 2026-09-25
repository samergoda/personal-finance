import { useState, useCallback, useMemo, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import type { Category, CategoryFormData } from "../types";
import { categoryStorage } from "../services/storage";
import { hasSupabaseConfig, supabase } from "../lib/supabase";

const mapCategory = (row: any): Category => ({
  id: row.id,
  name: row.name,
  type: row.type,
  isDefault: Boolean(row.is_default),
});

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>(() => categoryStorage.getAll());

  useEffect(() => {
    if (!hasSupabaseConfig() || !supabase) return;

    void supabase
      .from("categories")
      .select("*")
      .then(({ data, error }) => {
        if (error) {
          console.error("Failed to load categories from Supabase:", error.message);
          return;
        }

        const rows = (data ?? []).map(mapCategory);
        setCategories(rows);
        categoryStorage.save(rows);
      });
  }, []);

  // ─── CRUD ────────────────────────────────────────────────────────────────────

  const addCategory = useCallback((data: CategoryFormData): Category => {
    const newCat: Category = { ...data, id: uuidv4(), isDefault: false };
    const optimistic = [...categoryStorage.getAll(), newCat];
    setCategories(optimistic);
    categoryStorage.save(optimistic);

    if (hasSupabaseConfig() && supabase) {
      void supabase
        .from("categories")
        .upsert(
          [
            {
              id: newCat.id,
              name: newCat.name,
              type: newCat.type,
              is_default: false,
            },
          ],
          { onConflict: "id" },
        )
        .then(({ error }) => {
          if (error) {
            console.error("Supabase category insert failed:", error.message);
          }
        });
    }

    return newCat;
  }, []);

  const updateCategory = useCallback((id: string, data: CategoryFormData) => {
    const existing = categoryStorage.getAll().find((c) => c.id === id);
    if (!existing) return;

    const next = { ...existing, ...data };
    const updated = categoryStorage.getAll().map((c) => (c.id === id ? next : c));
    setCategories(updated);
    categoryStorage.save(updated);

    if (hasSupabaseConfig() && supabase) {
      void supabase
        .from("categories")
        .upsert(
          [
            {
              id: next.id,
              name: next.name,
              type: next.type,
              is_default: Boolean(next.isDefault),
            },
          ],
          { onConflict: "id" },
        )
        .then(({ error }) => {
          if (error) {
            console.error("Supabase category update failed:", error.message);
          }
        });
    }
  }, []);

  /**
   * Deletes a category. If transactions use it, they must be reassigned first.
   */
  const deleteCategory = useCallback((id: string) => {
    const updated = categoryStorage.getAll().filter((c) => c.id !== id);
    setCategories(updated);
    categoryStorage.save(updated);

    if (hasSupabaseConfig() && supabase) {
      void supabase
        .from("categories")
        .delete()
        .eq("id", id)
        .then(({ error }) => {
          if (error) {
            console.error("Supabase category delete failed:", error.message);
          }
        });
    }
  }, []);

  // ─── Derived helpers ─────────────────────────────────────────────────────────

  const getCategoryById = useCallback((id: string) => categories.find((c) => c.id === id), [categories]);

  const expenseCategories = useMemo(() => categories.filter((c) => c.type === "expense"), [categories]);

  const incomeCategories = useMemo(() => categories.filter((c) => c.type === "income"), [categories]);

  return {
    categories,
    expenseCategories,
    incomeCategories,
    addCategory,
    updateCategory,
    deleteCategory,
    getCategoryById,
  };
}
