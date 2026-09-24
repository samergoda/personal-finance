import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Separator } from "@/components/ui/separator";
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
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Financial Insights</CardTitle>
        <CardDescription>This month at a glance</CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <ul>
          {rows.map((row, i) => (
            <li key={row.label}>
              {i > 0 && <Separator />}
              <div className="flex items-center justify-between py-2.5 gap-4">
                <span className="text-sm text-muted-foreground">{row.label}</span>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-sm font-semibold">{row.value}</span>
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
