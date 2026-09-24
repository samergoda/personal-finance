import { createContext, useContext, useState, type ReactNode } from 'react';
import { useTransactions } from './useTransactions';
import { useCategories } from './useCategories';
import { useBudgets } from './useBudgets';
import { useSettings } from './useSettings';
import { currentMonthKey } from '../utils/dates';
import type { AppSettings, Category, CategoryFormData, MonthlyBudget, Transaction, TransactionFormData } from '../types';

interface AppContextValue {
  // Selected month
  selectedMonth: string;
  setSelectedMonth: (month: string) => void;

  // Transactions
  transactions: Transaction[];
  sortedTransactions: Transaction[];
  addTransaction: (data: TransactionFormData) => Transaction;
  updateTransaction: (id: string, data: TransactionFormData) => void;
  deleteTransaction: (id: string) => void;
  deleteTransactions: (ids: string[]) => void;
  getByMonth: (monthKey: string) => Transaction[];
  getById: (id: string) => Transaction | undefined;

  // Categories
  categories: Category[];
  expenseCategories: Category[];
  incomeCategories: Category[];
  addCategory: (data: CategoryFormData) => Category;
  updateCategory: (id: string, data: CategoryFormData) => void;
  deleteCategory: (id: string) => void;
  getCategoryById: (id: string) => Category | undefined;

  // Budgets
  budgets: MonthlyBudget[];
  getBudgetForMonth: (monthKey: string) => MonthlyBudget | undefined;
  setTotalBudget: (monthKey: string, amount: number | null) => void;
  setCategoryBudget: (monthKey: string, categoryId: string, amount: number) => void;
  removeCategoryBudget: (monthKey: string, categoryId: string) => void;
  deleteBudget: (id: string) => void;

  // Settings
  settings: AppSettings;
  updateSettings: (patch: Partial<AppSettings>) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [selectedMonth, setSelectedMonth] = useState(currentMonthKey);

  const txHook       = useTransactions();
  const catHook      = useCategories();
  const budgetHook   = useBudgets();
  const settingsHook = useSettings();

  const value: AppContextValue = {
    selectedMonth,
    setSelectedMonth,
    ...txHook,
    ...catHook,
    ...budgetHook,
    ...settingsHook,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used inside <AppProvider>');
  return ctx;
}
