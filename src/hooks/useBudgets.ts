import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { CategoryBudget, MonthlyBudget } from '../types';
import { budgetStorage } from '../services/storage';

export function useBudgets() {
  const [budgets, setBudgets] = useState<MonthlyBudget[]>(() =>
    budgetStorage.getAll(),
  );

  const getBudgetForMonth = useCallback(
    (monthKey: string): MonthlyBudget | undefined =>
      budgets.find(b => b.month === monthKey),
    [budgets],
  );

  // ─── Upsert (create or update) ────────────────────────────────────────────────

  const setTotalBudget = useCallback((monthKey: string, amount: number | null) => {
    const existing = budgetStorage.getByMonth(monthKey);
    const budget: MonthlyBudget = existing
      ? { ...existing, totalBudget: amount }
      : {
          id:              uuidv4(),
          month:           monthKey,
          totalBudget:     amount,
          categoryBudgets: [],
        };
    const updated = budgetStorage.upsert(budget);
    setBudgets(updated);
  }, []);

  const setCategoryBudget = useCallback(
    (monthKey: string, categoryId: string, amount: number) => {
      const existing = budgetStorage.getByMonth(monthKey);
      const base: MonthlyBudget = existing ?? {
        id:              uuidv4(),
        month:           monthKey,
        totalBudget:     null,
        categoryBudgets: [],
      };

      const catBudgets: CategoryBudget[] = base.categoryBudgets.some(
        cb => cb.categoryId === categoryId,
      )
        ? base.categoryBudgets.map(cb =>
            cb.categoryId === categoryId ? { ...cb, amount } : cb,
          )
        : [...base.categoryBudgets, { categoryId, amount }];

      const updated = budgetStorage.upsert({ ...base, categoryBudgets: catBudgets });
      setBudgets(updated);
    },
    [],
  );

  const removeCategoryBudget = useCallback((monthKey: string, categoryId: string) => {
    const existing = budgetStorage.getByMonth(monthKey);
    if (!existing) return;
    const updated = budgetStorage.upsert({
      ...existing,
      categoryBudgets: existing.categoryBudgets.filter(cb => cb.categoryId !== categoryId),
    });
    setBudgets(updated);
  }, []);

  const deleteBudget = useCallback((id: string) => {
    const updated = budgetStorage.delete(id);
    setBudgets(updated);
  }, []);

  return {
    budgets,
    getBudgetForMonth,
    setTotalBudget,
    setCategoryBudget,
    removeCategoryBudget,
    deleteBudget,
  };
}
