import { useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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

const queryKey = ["categories"] as const;

export function useCategories() {
  const queryClient = useQueryClient();

  const { data: categories = [] } = useQuery({
    queryKey,
    queryFn: async () => {
      if (!hasSupabaseConfig() || !supabase) {
        return categoryStorage.getAll();
      }

      const { data, error } = await supabase.from("categories").select("*");
      if (error) throw error;

      const rows = (data ?? []).map(mapCategory);
      categoryStorage.save(rows);
      return rows;
    },
    initialData: () => categoryStorage.getAll(),
  });

  const addCategory = useMutation({
    mutationFn: async (data: CategoryFormData): Promise<Category> => {
      const newCat: Category = { ...data, id: uuidv4(), isDefault: false };

      if (!hasSupabaseConfig() || !supabase) {
        const rows = [...categoryStorage.getAll(), newCat];
        categoryStorage.save(rows);
        return newCat;
      }

      const { error } = await supabase
        .from("categories")
        .upsert([{ id: newCat.id, name: newCat.name, type: newCat.type, is_default: false }], { onConflict: "id" });

      if (error) throw error;

      const rows = [...categoryStorage.getAll(), newCat];
      categoryStorage.save(rows);
      return newCat;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  }).mutate;

  const updateCategory = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: CategoryFormData }) => {
      const current = categoryStorage.getAll().find((c) => c.id === id);
      if (!current) return;

      const next = { ...current, ...data };

      if (!hasSupabaseConfig() || !supabase) {
        const rows = categoryStorage.getAll().map((c) => (c.id === id ? next : c));
        categoryStorage.save(rows);
        return next;
      }

      const { error } = await supabase
        .from("categories")
        .upsert([{ id: next.id, name: next.name, type: next.type, is_default: Boolean(next.isDefault) }], { onConflict: "id" });

      if (error) throw error;

      const rows = categoryStorage.getAll().map((c) => (c.id === id ? next : c));
      categoryStorage.save(rows);
      return next;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  }).mutate;

  const deleteCategory = useMutation({
    mutationFn: async (id: string) => {
      if (!hasSupabaseConfig() || !supabase) {
        const rows = categoryStorage.getAll().filter((c) => c.id !== id);
        categoryStorage.save(rows);
        return id;
      }

      const { error } = await supabase.from("categories").delete().eq("id", id);
      if (error) throw error;

      const rows = categoryStorage.getAll().filter((c) => c.id !== id);
      categoryStorage.save(rows);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  }).mutate;

  const getCategoryById = useMemo(() => (id: string) => categories.find((c) => c.id === id), [categories]);

  const expenseCategories = useMemo(() => categories.filter((c) => c.type === "expense"), [categories]);
  const incomeCategories = useMemo(() => categories.filter((c) => c.type === "income"), [categories]);

  return {
    categories,
    expenseCategories,
    incomeCategories,
    addCategory: (data: CategoryFormData) => addCategory(data),
    updateCategory: (id: string, data: CategoryFormData) => updateCategory({ id, data }),
    deleteCategory,
    getCategoryById,
  };
}
