import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { formatCurrency, formatPercent } from "@/utils/formatting";
import type { InsightWarning } from "@/types/analytics";

interface SmartInsightsPanelProps {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  savingsRate: number;
  avgDailySpending: number;
  topCategory?: {
    categoryName: string;
    amount: number;
  };
  warnings: InsightWarning[];
  incomeChange: number;
  expensesChange: number;
  currency: string;
  locale: string;
}

export function SmartInsightsPanel({
  totalIncome,
  totalExpenses,
  balance,
  savingsRate,
  avgDailySpending,
  topCategory,
  warnings,
  incomeChange,
  expensesChange,
  currency,
  locale,
}: SmartInsightsPanelProps) {
  const currencyFormatter = (value: number) => formatCurrency(value, { currency, locale });
  const statusTone = balance >= 0 ? "income" : "expense";

  const summaryCards = [
    {
      label: "Net balance",
      value: currencyFormatter(balance),
      tone: statusTone,
      hint: balance >= 0 ? "Cashflow is positive" : "Spending is outpacing income",
    },
    {
      label: "Savings rate",
      value: formatPercent(savingsRate),
      tone: savingsRate >= 20 ? "income" : "warning",
      hint: savingsRate >= 20 ? "Healthy reserve" : "Build a bigger buffer",
    },
    {
      label: "Avg daily spend",
      value: currencyFormatter(avgDailySpending),
      tone: "neutral",
      hint: "Daily cost baseline",
    },
    {
      label: "Top category",
      value: topCategory ? topCategory.categoryName : "No spend yet",
      tone: "secondary",
      hint: topCategory ? currencyFormatter(topCategory.amount) : "No category data",
    },
  ];

  const insightMessages =
    warnings.length > 0
      ? warnings.slice(0, 3).map((warning) => warning.message)
      : [
          `Income is ${incomeChange >= 0 ? "up" : "down"} ${Math.abs(Math.round(incomeChange))}% versus last month.`,
          `Expenses are ${expensesChange >= 0 ? "up" : "down"} ${Math.abs(Math.round(expensesChange))}% versus last month.`,
          "Your spending pattern is stable and ready for a stronger budget strategy.",
        ];

  return (
    <Card className="overflow-hidden border-white/10 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 shadow-[0_24px_70px_rgba(15,23,42,0.65)]">
      <CardHeader className="border-b border-white/10 bg-white/[0.02] pb-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle className="text-lg text-white">Smart insights</CardTitle>
            <CardDescription className="mt-1 text-slate-300">A quick pulse on your month</CardDescription>
          </div>
          <Badge variant="default" className="w-fit border border-cyan-400/30 bg-cyan-500/10 text-cyan-200">
            Finance pulse
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 p-5 md:p-6">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {summaryCards.map((card) => (
            <div key={card.label} className="rounded-2xl border border-white/10 bg-slate-900/70 p-4 shadow-inner shadow-slate-950/40">
              <p className="text-xs uppercase tracking-[0.14em] text-slate-400">{card.label}</p>
              <div className="mt-3 flex items-center justify-between gap-3">
                <span className="text-lg font-semibold text-white">{card.value}</span>
                <Badge variant={card.tone as "income" | "expense" | "warning" | "secondary" | "neutral"} className="text-[10px]">
                  {card.hint}
                </Badge>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h3 className="text-sm font-medium uppercase tracking-[0.18em] text-slate-300">Key takeaways</h3>
            <span className="text-xs text-slate-400">
              {currencyFormatter(totalIncome)} income / {currencyFormatter(totalExpenses)} spent
            </span>
          </div>
          <ul className="space-y-3">
            {insightMessages.map((message, index) => (
              <li
                key={`${message}-${index}`}
                className="flex items-start gap-3 rounded-xl border border-white/5 bg-white/[0.02] px-3 py-2 text-sm text-slate-200">
                <span className="mt-1 inline-flex h-2.5 w-2.5 shrink-0 rounded-full bg-cyan-400" />
                <span>{message}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
