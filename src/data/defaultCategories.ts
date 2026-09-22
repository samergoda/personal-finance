import type { Category } from '../types';

export const DEFAULT_EXPENSE_CATEGORIES: Category[] = [
  { id: 'cat-food',           name: 'Food',           type: 'expense', isDefault: true },
  { id: 'cat-transport',      name: 'Transportation', type: 'expense', isDefault: true },
  { id: 'cat-shopping',       name: 'Shopping',       type: 'expense', isDefault: true },
  { id: 'cat-bills',          name: 'Bills',          type: 'expense', isDefault: true },
  { id: 'cat-rent',           name: 'Rent',           type: 'expense', isDefault: true },
  { id: 'cat-entertainment',  name: 'Entertainment',  type: 'expense', isDefault: true },
  { id: 'cat-health',         name: 'Health',         type: 'expense', isDefault: true },
  { id: 'cat-education',      name: 'Education',      type: 'expense', isDefault: true },
  { id: 'cat-subscriptions',  name: 'Subscriptions',  type: 'expense', isDefault: true },
  { id: 'cat-family',         name: 'Family',         type: 'expense', isDefault: true },
  { id: 'cat-travel',         name: 'Travel',         type: 'expense', isDefault: true },
  { id: 'cat-other-exp',      name: 'Other',          type: 'expense', isDefault: true },
];

export const DEFAULT_INCOME_CATEGORIES: Category[] = [
  { id: 'cat-salary',         name: 'Salary',         type: 'income', isDefault: true },
  { id: 'cat-freelance',      name: 'Freelance',      type: 'income', isDefault: true },
  { id: 'cat-bonus',          name: 'Bonus',          type: 'income', isDefault: true },
  { id: 'cat-investment',     name: 'Investment',     type: 'income', isDefault: true },
  { id: 'cat-other-inc',      name: 'Other',          type: 'income', isDefault: true },
];

export const DEFAULT_CATEGORIES: Category[] = [
  ...DEFAULT_INCOME_CATEGORIES,
  ...DEFAULT_EXPENSE_CATEGORIES,
];
