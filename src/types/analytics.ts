export interface MonthSummary {
  month: string;
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
  incomeChange: number;
  expensesChange: number;
  balanceChange: number;
}

export type InsightSeverity = 'info' | 'warning' | 'danger';

export type InsightType =
  | 'category_spike'
  | 'budget_warning'
  | 'budget_exceeded'
  | 'negative_balance';

export interface InsightWarning {
  id: string;
  type: InsightType;
  message: string;
  severity: InsightSeverity;
}

export interface MonthlyChartPoint {
  month: string;
  monthKey: string;
  income: number;
  expenses: number;
  balance: number;
}

export interface DailySpendingPoint {
  day: number;
  amount: number;
}
