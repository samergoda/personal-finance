import { useState, useCallback, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { Transaction, TransactionFormData } from '../types';
import { transactionStorage } from '../services/storage';
import { filterByMonth } from '../utils/calculations';

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>(() =>
    transactionStorage.getAll(),
  );

  // ─── CRUD ────────────────────────────────────────────────────────────────────

  const addTransaction = useCallback((data: TransactionFormData) => {
    const newTx: Transaction = {
      ...data,
      id:        uuidv4(),
      createdAt: new Date().toISOString(),
    };
    const updated = transactionStorage.add(newTx);
    setTransactions(updated);
    return newTx;
  }, []);

  const updateTransaction = useCallback((id: string, data: TransactionFormData) => {
    const existing = transactionStorage.getAll().find(t => t.id === id);
    if (!existing) return;
    const updated = transactionStorage.update({ ...existing, ...data });
    setTransactions(updated);
  }, []);

  const deleteTransaction = useCallback((id: string) => {
    const updated = transactionStorage.delete(id);
    setTransactions(updated);
  }, []);

  const deleteTransactions = useCallback((ids: string[]) => {
    const updated = transactionStorage.deleteMany(ids);
    setTransactions(updated);
  }, []);

  // ─── Derived helpers ─────────────────────────────────────────────────────────

  const getByMonth = useCallback(
    (monthKey: string) => filterByMonth(transactions, monthKey),
    [transactions],
  );

  const getById = useCallback(
    (id: string) => transactions.find(t => t.id === id),
    [transactions],
  );

  /** Sorted by date descending (newest first) */
  const sortedTransactions = useMemo(
    () => [...transactions].sort((a, b) => b.date.localeCompare(a.date)),
    [transactions],
  );

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
