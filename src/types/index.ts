// ─── Core domain types ────────────────────────────────────────────────────────

export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  categoryId: string;
  description: string;
  date: string;       // ISO date string  YYYY-MM-DD
  createdAt: string;  // ISO datetime string
}

export interface Category {
  id: string;
  name: string;
  type: TransactionType;
  isDefault?: boolean; // marks seed/built-in categories
}

// ─── Budget types ─────────────────────────────────────────────────────────────

export interface CategoryBudget {
  categoryId: string;
  amount: number;
}

export interface MonthlyBudget {
  id: string;
  month: string;         // YYYY-MM
  totalBudget: number | null;
  categoryBudgets: CategoryBudget[];
}

// ─── Settings ─────────────────────────────────────────────────────────────────

export interface AppSettings {
  currency: string;    // default "EGP"
  currencySymbol: string;
  locale: string;      // e.g. "en-EG"
  seedDataLoaded: boolean;
}

// ─── Analytics / derived types ────────────────────────────────────────────────

export interface MonthSummary {
  month: string; // YYYY-MM
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  transactionCount: number;
  largestExpense: number;
  avgDailySpending: number;
}

export interface CategoryExpense {
  categoryId: string;
  categoryName: string;
  amount: number;
  percentage: number;
}

export interface MonthComparison {
  incomeChange: number;      // percentage change, e.g. 8 means +8%
  expensesChange: number;
  balanceChange: number;
}

export interface InsightWarning {
  id: string;
  type: 'category_spike' | 'budget_warning' | 'budget_exceeded' | 'negative_balance';
  message: string;
  severity: 'info' | 'warning' | 'danger';
}

export interface BudgetStatus {
  categoryId: string;
  categoryName: string;
  budgeted: number;
  spent: number;
  remaining: number;
  percentageUsed: number;
}

// ─── Form types ───────────────────────────────────────────────────────────────

export type TransactionFormData = Omit<Transaction, 'id' | 'createdAt'>;
export type CategoryFormData = Omit<Category, 'id' | 'isDefault'>;
