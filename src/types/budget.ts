export interface CategoryBudget {
  categoryId: string;
  amount: number;
}

export interface MonthlyBudget {
  id: string;
  month: string;           // YYYY-MM
  totalBudget: number | null;
  categoryBudgets: CategoryBudget[];
}

export interface BudgetStatus {
  categoryId: string;
  categoryName: string;
  budgeted: number;
  spent: number;
  remaining: number;
  percentageUsed: number;
}
