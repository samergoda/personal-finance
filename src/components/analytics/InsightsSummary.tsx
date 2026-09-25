import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { formatCurrency, formatPercent } from "@/utils/formatting";
import type { CategoryExpense } from "@/types/analytics";

interface InsightsSummaryProps {
  totalIncome: number;
  totalExpenses: number;
  savings: number;
  savingsRate: number;
  avgDailySpending: number;
  avgMonthlySpending: number;
  topCategory: CategoryExpense | undefined;
  largestExpenseAmount: number;
  incomeChange: number;
  expensesChange: number;
  currency: string;
  locale: string;
}

function ChangeChip({ value }: { value: number }) {
  const positive = value > 0;
  return (
    <Badge variant={positive ? "expense" : "income"} className="text-xs">
      {value > 0 ? "+" : ""}
      {Math.round(value)}%
    </Badge>
  );
}

export function InsightsSummary({
  totalIncome,
  totalExpenses,
  savings,
  savingsRate,
  avgDailySpending,
  avgMonthlySpending,
  topCategory,
  largestExpenseAmount,
  incomeChange,
  expensesChange,
  currency,
  locale,
}: InsightsSummaryProps) {
  const fmt = (n: number) => formatCurrency(n, { currency, locale });

  const rows = [
    { label: "Total Income", value: fmt(totalIncome), extra: <ChangeChip value={incomeChange} /> },
    { label: "Total Expenses", value: fmt(totalExpenses), extra: <ChangeChip value={expensesChange} /> },
    { label: "Savings", value: fmt(savings), extra: null },
    { label: "Savings Rate", value: formatPercent(savingsRate), extra: null },
    { label: "Avg Daily Spending", value: fmt(avgDailySpending), extra: null },
    { label: "Avg Monthly Spending", value: fmt(avgMonthlySpending), extra: null },
    {
      label: "Highest Spending Category",
      value: topCategory?.categoryName ?? "—",
      extra: topCategory ? <span className="text-xs text-muted-foreground">{fmt(topCategory.amount)}</span> : null,
    },
    { label: "Largest Single Expense", value: largestExpenseAmount > 0 ? fmt(largestExpenseAmount) : "—", extra: null },
  ];

  return (
    <Card className="border-white/10 bg-slate-950/70 shadow-[0_18px_50px_rgba(15,23,42,0.38)]">
      <CardHeader className="border-b border-white/10 bg-white/[0.02] pb-4">
        <CardTitle className="text-base text-white">Financial insights</CardTitle>
        <CardDescription className="text-slate-300">This month at a glance</CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <ul className="divide-y divide-white/10">
          {rows.map((row) => (
            <li key={row.label}>
              <div className="flex items-center justify-between gap-4 py-3.5">
                <span className="text-sm text-slate-300">{row.label}</span>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-sm font-semibold text-white">{row.value}</span>
                  {row.extra}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
