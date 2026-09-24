import { useState, useCallback, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { Category, CategoryFormData } from '../types';
import { categoryStorage } from '../services/storage';

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>(() =>
    categoryStorage.getAll(),
  );

  // ─── CRUD ────────────────────────────────────────────────────────────────────

  const addCategory = useCallback((data: CategoryFormData): Category => {
    const newCat: Category = { ...data, id: uuidv4(), isDefault: false };
    const updated = categoryStorage.add(newCat);
    setCategories(updated);
    return newCat;
  }, []);

  const updateCategory = useCallback((id: string, data: CategoryFormData) => {
    const existing = categoryStorage.getAll().find(c => c.id === id);
    if (!existing) return;
    const updated = categoryStorage.update({ ...existing, ...data });
    setCategories(updated);
  }, []);

  /**
   * Deletes a category. If transactions use it, they must be reassigned first.
   * Returns false if the category is protected (built-in + still in use externally).
   */
  const deleteCategory = useCallback((id: string) => {
    const updated = categoryStorage.delete(id);
    setCategories(updated);
  }, []);

  // ─── Derived helpers ─────────────────────────────────────────────────────────

  const getCategoryById = useCallback(
    (id: string) => categories.find(c => c.id === id),
    [categories],
  );

  const expenseCategories = useMemo(
    () => categories.filter(c => c.type === 'expense'),
    [categories],
  );

  const incomeCategories = useMemo(
    () => categories.filter(c => c.type === 'income'),
    [categories],
  );

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
