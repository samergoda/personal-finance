export { transactionStorage } from "./storage/transactions";
export { categoryStorage } from "./storage/categories";
export { budgetStorage } from "./storage/budgets";
export { settingsStorage } from "./storage/settings";
export { ensureDefaultCategories } from "./storage/common";

import { ensureDefaultCategories } from "./storage/common";
import { settingsStorage } from "./storage/settings";
import { transactionStorage } from "./storage/transactions";
import { SEED_TRANSACTIONS } from "../data/seedTransactions";
import { hasSupabaseConfig, supabase } from "../lib/supabase";

async function hydrateFromSupabase(): Promise<void> {
  if (!supabase) return;

  const [transactionsResult, categoriesResult, budgetsResult, settingsResult] = await Promise.all([
    supabase.from("transactions").select("*").order("date", { ascending: false }),
    supabase.from("categories").select("*"),
    supabase.from("budgets").select("*"),
    supabase.from("settings").select("*").eq("id", "default").maybeSingle(),
  ]);

  if (transactionsResult.data) {
    localStorage.setItem(
      "finance_transactions",
      JSON.stringify(
        transactionsResult.data.map((row: any) => ({
          id: row.id,
          type: row.type,
          amount: Number(row.amount ?? 0),
          categoryId: row.category_id,
          description: row.description ?? "",
          date: row.date,
          createdAt: row.created_at ?? new Date().toISOString(),
        })),
      ),
    );
  }

  if (categoriesResult.data) {
    localStorage.setItem(
      "finance_categories",
      JSON.stringify(
        categoriesResult.data.map((row: any) => ({
          id: row.id,
          name: row.name,
          type: row.type,
          isDefault: Boolean(row.is_default),
        })),
      ),
    );
  }

  if (budgetsResult.data) {
    localStorage.setItem(
      "finance_budgets",
      JSON.stringify(
        budgetsResult.data.map((row: any) => ({
          id: row.id,
          month: row.month,
          totalBudget: row.total_budget,
          categoryBudgets: Array.isArray(row.category_budgets) ? row.category_budgets : [],
        })),
      ),
    );
  }

  if (settingsResult.data) {
    localStorage.setItem(
      "finance_settings",
      JSON.stringify({
        currency: settingsResult.data.currency ?? "EGP",
        currencySymbol: settingsResult.data.currency_symbol ?? "EGP",
        locale: settingsResult.data.locale ?? "en-EG",
        seedDataLoaded: Boolean(settingsResult.data.seed_data_loaded),
      }),
    );
  }
}

export function initializeStorage(): void {
  if (hasSupabaseConfig()) {
    // Supabase is the primary source of truth when configured.
    // Local storage is only a mirrored cache for offline behavior.
    void hydrateFromSupabase();
    return;
  }

  ensureDefaultCategories();

  const settings = settingsStorage.get();
  if (!settings.seedDataLoaded) {
    const existing = transactionStorage.getAll();
    if (existing.length === 0) {
      transactionStorage.save(SEED_TRANSACTIONS);
    }
    settingsStorage.update({ seedDataLoaded: true });
  }
}
