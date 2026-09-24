import type { AppSettings } from "../../types";
import { DEFAULT_CATEGORIES } from "../../data/defaultCategories";

export const STORAGE_KEYS = {
  TRANSACTIONS: "finance_transactions",
  CATEGORIES: "finance_categories",
  BUDGETS: "finance_budgets",
  SETTINGS: "finance_settings",
} as const;

export const DEFAULT_SETTINGS: AppSettings = {
  currency: "EGP",
  currencySymbol: "EGP",
  locale: "en-EG",
  seedDataLoaded: false,
};

export function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function save<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

export function ensureDefaultCategories(): void {
  const stored = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
  if (stored === null) {
    save(STORAGE_KEYS.CATEGORIES, DEFAULT_CATEGORIES);
  }
}
