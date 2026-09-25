import { useState, useCallback, useMemo, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import type { Transaction, TransactionFormData } from "../types";
import { transactionStorage } from "../services/storage";
import { filterByMonth } from "../utils/calculations";
import { hasSupabaseConfig, supabase } from "../lib/supabase";

const mapTransaction = (row: any): Transaction => ({
  id: row.id,
  type: row.type,
  amount: Number(row.amount ?? 0),
  categoryId: row.category_id,
  description: row.description ?? "",
  date: row.date,
  createdAt: row.created_at ?? new Date().toISOString(),
});

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>(() => transactionStorage.getAll());

  useEffect(() => {
    if (!hasSupabaseConfig() || !supabase) return;

    void supabase
      .from("transactions")
      .select("*")
      .order("date", { ascending: false })
      .then(({ data, error }) => {
        if (error) {
          console.error("Failed to load transactions from Supabase:", error.message);
          return;
        }

        const rows = (data ?? []).map(mapTransaction);
        setTransactions(rows);
        transactionStorage.save(rows);
      });
  }, []);

  // ─── CRUD ────────────────────────────────────────────────────────────────────

  const addTransaction = useCallback((data: TransactionFormData) => {
    const newTx: Transaction = {
      ...data,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
    };

    const optimistic = [newTx, ...transactionStorage.getAll()];
    setTransactions(optimistic);
    transactionStorage.save(optimistic);

    if (hasSupabaseConfig() && supabase) {
      void supabase
        .from("transactions")
        .upsert(
          [
            {
              id: newTx.id,
              type: newTx.type,
              amount: newTx.amount,
              category_id: newTx.categoryId,
              description: newTx.description,
              date: newTx.date,
              created_at: newTx.createdAt,
            },
          ],
          { onConflict: "id" },
        )
        .then(({ error }) => {
          if (error) {
            console.error("Supabase transaction insert failed:", error.message);
          }
        });
    }

    return newTx;
  }, []);

  const updateTransaction = useCallback((id: string, data: TransactionFormData) => {
    const existing = transactionStorage.getAll().find((t) => t.id === id);
    if (!existing) return;

    const next = { ...existing, ...data };
    const updated = transactionStorage.getAll().map((t) => (t.id === id ? next : t));
    setTransactions(updated);
    transactionStorage.save(updated);

    if (hasSupabaseConfig() && supabase) {
      void supabase
        .from("transactions")
        .upsert(
          [
            {
              id: next.id,
              type: next.type,
              amount: next.amount,
              category_id: next.categoryId,
              description: next.description,
              date: next.date,
              created_at: next.createdAt,
            },
          ],
          { onConflict: "id" },
        )
        .then(({ error }) => {
          if (error) {
            console.error("Supabase transaction update failed:", error.message);
          }
        });
    }
  }, []);

  const deleteTransaction = useCallback((id: string) => {
    const updated = transactionStorage.getAll().filter((t) => t.id !== id);
    setTransactions(updated);
    transactionStorage.save(updated);

    if (hasSupabaseConfig() && supabase) {
      void supabase
        .from("transactions")
        .delete()
        .eq("id", id)
        .then(({ error }) => {
          if (error) {
            console.error("Supabase transaction delete failed:", error.message);
          }
        });
    }
  }, []);

  const deleteTransactions = useCallback((ids: string[]) => {
    const updated = transactionStorage.getAll().filter((t) => !ids.includes(t.id));
    setTransactions(updated);
    transactionStorage.save(updated);

    if (hasSupabaseConfig() && supabase) {
      void supabase
        .from("transactions")
        .delete()
        .in("id", ids)
        .then(({ error }) => {
          if (error) {
            console.error("Supabase bulk transaction delete failed:", error.message);
          }
        });
    }
  }, []);

  // ─── Derived helpers ─────────────────────────────────────────────────────────

  const getByMonth = useCallback((monthKey: string) => filterByMonth(transactions, monthKey), [transactions]);

  const getById = useCallback((id: string) => transactions.find((t) => t.id === id), [transactions]);

  /** Sorted by date descending (newest first) */
  const sortedTransactions = useMemo(() => [...transactions].sort((a, b) => b.date.localeCompare(a.date)), [transactions]);

  return {
    transactions,
    sortedTransactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    deleteTransactions,
    getByMonth,
    getById,
  };
}
