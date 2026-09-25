import { useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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

const queryKey = ["transactions"] as const;

export function useTransactions() {
  const queryClient = useQueryClient();

  const { data: transactions = [] } = useQuery({
    queryKey,
    queryFn: async () => {
      if (!hasSupabaseConfig() || !supabase) {
        return transactionStorage.getAll();
      }

      const { data, error } = await supabase.from("transactions").select("*").order("date", { ascending: false });
      if (error) throw error;

      const rows = (data ?? []).map(mapTransaction);
      transactionStorage.save(rows);
      return rows;
    },
    initialData: () => transactionStorage.getAll(),
  });

  const addTransaction = useMutation({
    mutationFn: async (data: TransactionFormData): Promise<Transaction> => {
      const newTx: Transaction = {
        ...data,
        id: uuidv4(),
        createdAt: new Date().toISOString(),
      };

      if (!hasSupabaseConfig() || !supabase) {
        const rows = [newTx, ...transactionStorage.getAll()];
        transactionStorage.save(rows);
        return newTx;
      }

      const { error } = await supabase.from("transactions").upsert(
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
      );

      if (error) throw error;

      const rows = [newTx, ...transactionStorage.getAll()];
      transactionStorage.save(rows);
      return newTx;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  }).mutate;

  const updateTransaction = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: TransactionFormData }) => {
      const existing = transactionStorage.getAll().find((t) => t.id === id);
      if (!existing) return;

      const next = { ...existing, ...data };

      if (!hasSupabaseConfig() || !supabase) {
        const rows = transactionStorage.getAll().map((t) => (t.id === id ? next : t));
        transactionStorage.save(rows);
        return next;
      }

      const { error } = await supabase.from("transactions").upsert(
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
      );

      if (error) throw error;

      const rows = transactionStorage.getAll().map((t) => (t.id === id ? next : t));
      transactionStorage.save(rows);
      return next;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  }).mutate;

  const deleteTransaction = useMutation({
    mutationFn: async (id: string) => {
      if (!hasSupabaseConfig() || !supabase) {
        const rows = transactionStorage.getAll().filter((t) => t.id !== id);
        transactionStorage.save(rows);
        return id;
      }

      const { error } = await supabase.from("transactions").delete().eq("id", id);
      if (error) throw error;

      const rows = transactionStorage.getAll().filter((t) => t.id !== id);
      transactionStorage.save(rows);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  }).mutate;

  const deleteTransactions = useMutation({
    mutationFn: async (ids: string[]) => {
      if (!hasSupabaseConfig() || !supabase) {
        const rows = transactionStorage.getAll().filter((t) => !ids.includes(t.id));
        transactionStorage.save(rows);
        return ids;
      }

      const { error } = await supabase.from("transactions").delete().in("id", ids);
      if (error) throw error;

      const rows = transactionStorage.getAll().filter((t) => !ids.includes(t.id));
      transactionStorage.save(rows);
      return ids;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  }).mutate;

  const getByMonth = useMemo(() => (monthKey: string) => filterByMonth(transactions, monthKey), [transactions]);

  const getById = useMemo(() => (id: string) => transactions.find((t) => t.id === id), [transactions]);

  const sortedTransactions = useMemo(() => [...transactions].sort((a, b) => b.date.localeCompare(a.date)), [transactions]);

  return {
    transactions,
    sortedTransactions,
    addTransaction: (data: TransactionFormData) => addTransaction(data),
    updateTransaction: (id: string, data: TransactionFormData) => updateTransaction({ id, data }),
    deleteTransaction,
    deleteTransactions,
    getByMonth,
    getById,
  };
}
