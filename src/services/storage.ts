/**
 * Storage service — single access point for all LocalStorage reads/writes.
 * Swap this file's implementation to migrate to a real backend later.
 */

import type { AppSettings, Category, MonthlyBudget, Transaction } from '../types';
import { DEFAULT_CATEGORIES } from '../data/defaultCategories';
import { SEED_TRANSACTIONS } from '../data/seedTransactions';

// ─── Storage keys ─────────────────────────────────────────────────────────────
const KEYS = {
  TRANSACTIONS: 'finance_transactions',
  CATEGORIES:   'finance_categories',
  BUDGETS:      'finance_budgets',
  SETTINGS:     'finance_settings',
} as const;

// ─── Default settings ─────────────────────────────────────────────────────────
const DEFAULT_SETTINGS: AppSettings = {
  currency:       'EGP',
  currencySymbol: 'EGP',
  locale:         'en-EG',
  seedDataLoaded: false,
};

// ─── Generic helpers ──────────────────────────────────────────────────────────
function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function save<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

// ─── Transactions ─────────────────────────────────────────────────────────────
export const transactionStorage = {
  getAll(): Transaction[] {
    return load<Transaction[]>(KEYS.TRANSACTIONS, []);
  },
  save(transactions: Transaction[]): void {
    save(KEYS.TRANSACTIONS, transactions);
  },
  add(transaction: Transaction): Transaction[] {
    const all = transactionStorage.getAll();
    const updated = [transaction, ...all];
    transactionStorage.save(updated);
    return updated;
  },
  update(updated: Transaction): Transaction[] {
    const all = transactionStorage.getAll().map(t => (t.id === updated.id ? updated : t));
    transactionStorage.save(all);
    return all;
  },
  delete(id: string): Transaction[] {
    const all = transactionStorage.getAll().filter(t => t.id !== id);
    transactionStorage.save(all);
    return all;
  },
  deleteMany(ids: string[]): Transaction[] {
    const set = new Set(ids);
    const all = transactionStorage.getAll().filter(t => !set.has(t.id));
    transactionStorage.save(all);
    return all;
  },
};

// ─── Categories ───────────────────────────────────────────────────────────────
export const categoryStorage = {
  getAll(): Category[] {
    return load<Category[]>(KEYS.CATEGORIES, DEFAULT_CATEGORIES);
  },
  save(categories: Category[]): void {
    save(KEYS.CATEGORIES, categories);
  },
  add(category: Category): Category[] {
    const all = [...categoryStorage.getAll(), category];
    categoryStorage.save(all);
    return all;
  },
  update(updated: Category): Category[] {
    const all = categoryStorage.getAll().map(c => (c.id === updated.id ? updated : c));
    categoryStorage.save(all);
    return all;
  },
  delete(id: string): Category[] {
    const all = categoryStorage.getAll().filter(c => c.id !== id);
    categoryStorage.save(all);
    return all;
  },
};

// ─── Budgets ──────────────────────────────────────────────────────────────────
export const budgetStorage = {
  getAll(): MonthlyBudget[] {
    return load<MonthlyBudget[]>(KEYS.BUDGETS, []);
  },
  getByMonth(month: string): MonthlyBudget | undefined {
    return budgetStorage.getAll().find(b => b.month === month);
  },
  save(budgets: MonthlyBudget[]): void {
    save(KEYS.BUDGETS, budgets);
  },
  upsert(budget: MonthlyBudget): MonthlyBudget[] {
    const all = budgetStorage.getAll();
    const idx = all.findIndex(b => b.id === budget.id);
    const updated = idx === -1 ? [...all, budget] : all.map(b => (b.id === budget.id ? budget : b));
    budgetStorage.save(updated);
    return updated;
  },
  delete(id: string): MonthlyBudget[] {
    const all = budgetStorage.getAll().filter(b => b.id !== id);
    budgetStorage.save(all);
    return all;
  },
};

// ─── Settings ─────────────────────────────────────────────────────────────────
export const settingsStorage = {
  get(): AppSettings {
    return load<AppSettings>(KEYS.SETTINGS, DEFAULT_SETTINGS);
  },
  save(settings: AppSettings): void {
    save(KEYS.SETTINGS, settings);
  },
  update(patch: Partial<AppSettings>): AppSettings {
    const current = settingsStorage.get();
    const updated = { ...current, ...patch };
    settingsStorage.save(updated);
    return updated;
  },
};

// ─── Initialization ───────────────────────────────────────────────────────────
/**
 * Called once on app boot. Seeds default categories and demo transactions
 * if this is the first launch (seedDataLoaded === false).
 */
export function initializeStorage(): void {
  const settings = settingsStorage.get();

  // Always ensure default categories exist (e.g. after a category storage clear)
  const storedCategories = localStorage.getItem(KEYS.CATEGORIES);
  if (storedCategories === null) {
    categoryStorage.save(DEFAULT_CATEGORIES);
  }

  if (!settings.seedDataLoaded) {
    // Only seed if there are no transactions yet
    const existing = transactionStorage.getAll();
    if (existing.length === 0) {
      transactionStorage.save(SEED_TRANSACTIONS);
    }
    settingsStorage.update({ seedDataLoaded: true });
  }
}
