import { parseISO, getDate } from 'date-fns';
import type {
  BudgetStatus,
  Category,
  CategoryExpense,
  InsightWarning,
  MonthComparison,
  MonthlyBudget,
  MonthSummary,
  Transaction,
} from '../types';

// Re-export so consumers can import chart-specific types from one place
export type { CategoryExpense } from '../types';
import { isInMonth, daysElapsedInMonth, monthKeyToDate } from './dates';

// ─── Basic filters ─────────────────────────────────────────────────────────────

export function filterByMonth(transactions: Transaction[], monthKey: string): Transaction[] {
  return transactions.filter(t => isInMonth(t.date, monthKey));
}

export function filterByType(
  transactions: Transaction[],
  type: Transaction['type'],
): Transaction[] {
  return transactions.filter(t => t.type === type);
}

// ─── Totals ────────────────────────────────────────────────────────────────────

export function calculateTotalIncome(transactions: Transaction[]): number {
  return transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
}

export function calculateTotalExpenses(transactions: Transaction[]): number {
  return transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
}

export function calculateBalance(transactions: Transaction[]): number {
  return calculateTotalIncome(transactions) - calculateTotalExpenses(transactions);
}

// ─── Savings ───────────────────────────────────────────────────────────────────

export function calculateSavings(transactions: Transaction[]): number {
  return calculateBalance(transactions);
}

export function calculateSavingsRate(transactions: Transaction[]): number {
  const income = calculateTotalIncome(transactions);
  if (income === 0) return 0;
  return (calculateSavings(transactions) / income) * 100;
}

// ─── Averages ──────────────────────────────────────────────────────────────────

export function calculateAverageDailySpending(
  transactions: Transaction[],
  monthKey: string,
): number {
  const expenses = calculateTotalExpenses(filterByMonth(transactions, monthKey));
  const days = daysElapsedInMonth(monthKey);
  return days > 0 ? expenses / days : 0;
}

export function calculateAverageMonthlySpending(
  transactions: Transaction[],
  monthKeys: string[],
): number {
  if (monthKeys.length === 0) return 0;
  const total = monthKeys.reduce(
    (sum, mk) => sum + calculateTotalExpenses(filterByMonth(transactions, mk)),
    0,
  );
  return total / monthKeys.length;
}

// ─── Category breakdown ────────────────────────────────────────────────────────

export function calculateCategoryExpenses(
  transactions: Transaction[],
  categories: Category[],
): CategoryExpense[] {
  const expenses = transactions.filter(t => t.type === 'expense');
  const total = expenses.reduce((sum, t) => sum + t.amount, 0);

  const grouped = new Map<string, number>();
  for (const t of expenses) {
    grouped.set(t.categoryId, (grouped.get(t.categoryId) ?? 0) + t.amount);
  }

  const result: CategoryExpense[] = [];
  for (const [categoryId, amount] of grouped) {
    const cat = categories.find(c => c.id === categoryId);
    result.push({
      categoryId,
      categoryName: cat?.name ?? 'Unknown',
      amount,
      percentage: total > 0 ? (amount / total) * 100 : 0,
    });
  }

  return result.sort((a, b) => b.amount - a.amount);
}

// ─── Month summary ─────────────────────────────────────────────────────────────

export function calculateMonthSummary(
  transactions: Transaction[],
  monthKey: string,
): MonthSummary {
  const monthly = filterByMonth(transactions, monthKey);
  const expenses = monthly.filter(t => t.type === 'expense');

  const totalIncome   = calculateTotalIncome(monthly);
  const totalExpenses = calculateTotalExpenses(monthly);
  const balance       = totalIncome - totalExpenses;
  const largestExpense = expenses.length > 0 ? Math.max(...expenses.map(t => t.amount)) : 0;
  const avgDailySpending = calculateAverageDailySpending(transactions, monthKey);

  return {
    month: monthKey,
    totalIncome,
    totalExpenses,
    balance,
    transactionCount: monthly.length,
    largestExpense,
    avgDailySpending,
  };
}

// ─── Month-over-month comparison ───────────────────────────────────────────────

function pctChange(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
}

export function calculateMonthComparison(
  transactions: Transaction[],
  currentMonth: string,
  previousMonth: string,
): MonthComparison {
  const curr = calculateMonthSummary(transactions, currentMonth);
  const prev = calculateMonthSummary(transactions, previousMonth);

  return {
    incomeChange:   pctChange(curr.totalIncome,   prev.totalIncome),
    expensesChange: pctChange(curr.totalExpenses, prev.totalExpenses),
    balanceChange:  pctChange(curr.balance,       prev.balance),
  };
}

// ─── Monthly chart data ────────────────────────────────────────────────────────

export interface MonthlyChartPoint {
  month: string;   // display label e.g. "Sep"
  monthKey: string;
  income: number;
  expenses: number;
  balance: number;
}

export function calculateMonthlyChartData(
  transactions: Transaction[],
  monthKeys: string[],
): MonthlyChartPoint[] {
  return monthKeys.map(mk => {
    const { totalIncome, totalExpenses, balance } = calculateMonthSummary(transactions, mk);
    const label = monthKeyToDate(mk).toLocaleString('default', { month: 'short' });
    return { month: label, monthKey: mk, income: totalIncome, expenses: totalExpenses, balance };
  });
}

// ─── Daily spending trend ──────────────────────────────────────────────────────

export interface DailySpendingPoint {
  day: number;
  amount: number;
}

export function calculateDailySpending(
  transactions: Transaction[],
  monthKey: string,
): DailySpendingPoint[] {
  const monthly = filterByMonth(transactions, monthKey).filter(t => t.type === 'expense');
  const grouped = new Map<number, number>();

  for (const t of monthly) {
    const day = getDate(parseISO(t.date));
    grouped.set(day, (grouped.get(day) ?? 0) + t.amount);
  }

  const points: DailySpendingPoint[] = [];
  for (const [day, amount] of grouped) {
    points.push({ day, amount });
  }
  return points.sort((a, b) => a.day - b.day);
}

// ─── Budget status ─────────────────────────────────────────────────────────────

export function calculateBudgetStatus(
  transactions: Transaction[],
  categories: Category[],
  budget: MonthlyBudget,
  monthKey: string,
): BudgetStatus[] {
  const monthly = filterByMonth(transactions, monthKey).filter(t => t.type === 'expense');

  return budget.categoryBudgets.map(cb => {
    const cat     = categories.find(c => c.id === cb.categoryId);
    const spent   = monthly
      .filter(t => t.categoryId === cb.categoryId)
      .reduce((sum, t) => sum + t.amount, 0);
    const remaining     = cb.amount - spent;
    const percentageUsed = cb.amount > 0 ? (spent / cb.amount) * 100 : 0;

    return {
      categoryId:    cb.categoryId,
      categoryName:  cat?.name ?? 'Unknown',
      budgeted:      cb.amount,
      spent,
      remaining,
      percentageUsed,
    };
  });
}

// ─── Insights & warnings ───────────────────────────────────────────────────────

export function generateInsights(
  transactions: Transaction[],
  categories: Category[],
  currentMonth: string,
  previousMonth: string,
  budget?: MonthlyBudget,
): InsightWarning[] {
  const warnings: InsightWarning[] = [];

  const currExpByCategory = calculateCategoryExpenses(
    filterByMonth(transactions, currentMonth),
    categories,
  );
  const prevExpByCategory = calculateCategoryExpenses(
    filterByMonth(transactions, previousMonth),
    categories,
  );

  // Category spending spikes (>30% increase)
  for (const curr of currExpByCategory) {
    const prev = prevExpByCategory.find(p => p.categoryId === curr.categoryId);
    if (prev && prev.amount > 0) {
      const change = ((curr.amount - prev.amount) / prev.amount) * 100;
      if (change >= 30) {
        warnings.push({
          id:       `spike-${curr.categoryId}`,
          type:     'category_spike',
          message:  `You spent ${Math.round(change)}% more on ${curr.categoryName} this month than last month.`,
          severity: change >= 60 ? 'danger' : 'warning',
        });
      }
    }
  }

  // Budget warnings
  if (budget) {
    const statuses = calculateBudgetStatus(transactions, categories, budget, currentMonth);
    for (const s of statuses) {
      if (s.percentageUsed >= 100) {
        warnings.push({
          id:       `exceeded-${s.categoryId}`,
          type:     'budget_exceeded',
          message:  `${s.categoryName} budget exceeded! Spent ${Math.round(s.percentageUsed)}% of budget.`,
          severity: 'danger',
        });
      } else if (s.percentageUsed >= 80) {
        warnings.push({
          id:       `warning-${s.categoryId}`,
          type:     'budget_warning',
          message:  `${s.categoryName} is at ${Math.round(s.percentageUsed)}% of its budget.`,
          severity: 'warning',
        });
      }
    }
  }

  // Negative balance
  const balance = calculateBalance(filterByMonth(transactions, currentMonth));
  if (balance < 0) {
    warnings.push({
      id:       'negative-balance',
      type:     'negative_balance',
      message:  'Your expenses exceed your income this month.',
      severity: 'danger',
    });
  }

  return warnings;
}

// ─── Largest expense ───────────────────────────────────────────────────────────

export function findLargestExpense(transactions: Transaction[]): Transaction | undefined {
  const expenses = transactions.filter(t => t.type === 'expense');
  if (expenses.length === 0) return undefined;
  return expenses.reduce((max, t) => (t.amount > max.amount ? t : max));
}

export function findHighestSpendingCategory(
  transactions: Transaction[],
  categories: Category[],
): CategoryExpense | undefined {
  const breakdown = calculateCategoryExpenses(transactions, categories);
  return breakdown[0];
}
