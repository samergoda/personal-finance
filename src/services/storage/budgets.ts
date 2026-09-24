import type { MonthlyBudget, CategoryBudget } from "../../types";
import { STORAGE_KEYS, load, save } from "./common";
import { supabase } from "../../lib/supabase";

export const budgetStorage = {
  getAll(): MonthlyBudget[] {
    return load<MonthlyBudget[]>(STORAGE_KEYS.BUDGETS, []);
  },
  getByMonth(month: string): MonthlyBudget | undefined {
    return budgetStorage.getAll().find((b) => b.month === month);
  },
  save(budgets: MonthlyBudget[]): void {
    save(STORAGE_KEYS.BUDGETS, budgets);
    void syncBudgetsToSupabase(budgets);
  },
  upsert(budget: MonthlyBudget): MonthlyBudget[] {
    const all = budgetStorage.getAll();
    const idx = all.findIndex((b) => b.id === budget.id);
    const updated = idx === -1 ? [...all, budget] : all.map((b) => (b.id === budget.id ? budget : b));
    budgetStorage.save(updated);
    return updated;
  },
  delete(id: string): MonthlyBudget[] {
    const all = budgetStorage.getAll().filter((b) => b.id !== id);
    budgetStorage.save(all);
    return all;
  },
};

async function syncBudgetsToSupabase(rows: MonthlyBudget[]): Promise<void> {
  if (!supabase) return;

  const { error } = await supabase.from("budgets").upsert(
    rows.map((row) => ({
      id: row.id,
      month: row.month,
      total_budget: row.totalBudget,
      category_budgets: row.categoryBudgets as CategoryBudget[],
    })),
    { onConflict: "id" },
  );

  if (error) {
    console.error("Supabase budgets sync failed:", error.message);
  }
}
