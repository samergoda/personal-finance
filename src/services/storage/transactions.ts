import type { Transaction } from "../../types";
import { STORAGE_KEYS, load, save } from "./common";
import { supabase } from "../../lib/supabase";

export const transactionStorage = {
  getAll(): Transaction[] {
    return load<Transaction[]>(STORAGE_KEYS.TRANSACTIONS, []);
  },
  save(transactions: Transaction[]): void {
    save(STORAGE_KEYS.TRANSACTIONS, transactions);
    void syncTransactionsToSupabase(transactions);
  },
  add(transaction: Transaction): Transaction[] {
    const all = transactionStorage.getAll();
    const updated = [transaction, ...all];
    transactionStorage.save(updated);
    return updated;
  },
  update(updated: Transaction): Transaction[] {
    const all = transactionStorage.getAll().map((t) => (t.id === updated.id ? updated : t));
    transactionStorage.save(all);
    return all;
  },
  delete(id: string): Transaction[] {
    const all = transactionStorage.getAll().filter((t) => t.id !== id);
    transactionStorage.save(all);
    return all;
  },
  deleteMany(ids: string[]): Transaction[] {
    const set = new Set(ids);
    const all = transactionStorage.getAll().filter((t) => !set.has(t.id));
    transactionStorage.save(all);
    return all;
  },
};

async function syncTransactionsToSupabase(rows: Transaction[]): Promise<void> {
  if (!supabase) return;

  const { error } = await supabase.from("transactions").upsert(
    rows.map((row) => ({
      id: row.id,
      type: row.type,
      amount: row.amount,
      category_id: row.categoryId,
      description: row.description,
      date: row.date,
      created_at: row.createdAt,
    })),
    { onConflict: "id" },
  );

  if (error) {
    console.error("Supabase transactions sync failed:", error.message);
  }
}
