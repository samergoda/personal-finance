import { useMemo } from "react";
import { useAppContext } from "@/hooks/useAppContext";
import { PageHeader } from "@/components/layout/PageHeader";
import { MonthNavigator } from "@/components/ui/MonthNavigator";
import { AlertBanner } from "@/components/ui/AlertBanner";
import { IncomeExpenseTrendChart } from "@/components/analytics/IncomeExpenseTrendChart";
import { MonthlyBarChart } from "@/components/analytics/MonthlyBarChart";
import { CategoryBreakdownChart } from "@/components/analytics/CategoryBreakdownChart";
import { MonthlySpendingTrendChart } from "@/components/analytics/MonthlySpendingTrendChart";
import { InsightsSummary } from "@/components/analytics/InsightsSummary";
import { SmartInsightsPanel } from "@/components/analytics/SmartInsightsPanel";
import {
  calculateMonthSummary,
  calculateMonthComparison,
  calculateCategoryExpenses,
  calculateMonthlyChartData,
  calculateDailySpending,
  calculateAverageMonthlySpending,
  calculateSavings,
  calculateSavingsRate,
  filterByMonth,
  findHighestSpendingCategory,
  generateInsights,
} from "@/utils/calculations";
import { prevMonth, currentMonthKey, lastNMonths } from "@/utils/dates";

export function Analytics() {
  const { selectedMonth, setSelectedMonth, transactions, categories, getBudgetForMonth, settings } = useAppContext();

  const nowMonth = currentMonthKey();
  const prevMon = prevMonth(selectedMonth);
  const last12 = useMemo(() => lastNMonths(12, selectedMonth), [selectedMonth]);
  const last6 = useMemo(() => lastNMonths(6, selectedMonth), [selectedMonth]);

  const summary = useMemo(() => calculateMonthSummary(transactions, selectedMonth), [transactions, selectedMonth]);
  const comparison = useMemo(() => calculateMonthComparison(transactions, selectedMonth, prevMon), [transactions, selectedMonth, prevMon]);
  const monthlyTx = useMemo(() => filterByMonth(transactions, selectedMonth), [transactions, selectedMonth]);
  const catExpenses = useMemo(() => calculateCategoryExpenses(monthlyTx, categories), [monthlyTx, categories]);
  const dailyData = useMemo(() => calculateDailySpending(transactions, selectedMonth), [transactions, selectedMonth]);
  const trendData12 = useMemo(() => calculateMonthlyChartData(transactions, last12), [transactions, last12]);
  const trendData6 = useMemo(() => calculateMonthlyChartData(transactions, last6), [transactions, last6]);
  const savings = calculateSavings(monthlyTx);
  const savingsRate = calculateSavingsRate(monthlyTx);
  const avgMonthly = useMemo(() => calculateAverageMonthlySpending(transactions, last12), [transactions, last12]);
  const topCategory = useMemo(() => findHighestSpendingCategory(monthlyTx, categories), [monthlyTx, categories]);
  const budget = getBudgetForMonth(selectedMonth);
  const warnings = useMemo(
    () => generateInsights(transactions, categories, selectedMonth, prevMon, budget),
    [transactions, categories, selectedMonth, prevMon, budget],
  );

  return (
    <div className="flex flex-col min-h-full">
      <PageHeader title="Analytics" subtitle="Detailed financial analysis">
        <MonthNavigator month={selectedMonth} onChange={setSelectedMonth} maxMonth={nowMonth} />
      </PageHeader>

      <div className="flex-1 space-y-6 p-4 md:p-6">
        {warnings.length > 0 && <AlertBanner warnings={warnings} className="border-cyan-500/30 bg-cyan-500/5 text-cyan-100" />}

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.35fr_0.65fr]">
          <SmartInsightsPanel
            totalIncome={summary.totalIncome}
            totalExpenses={summary.totalExpenses}
            balance={summary.balance}
            savingsRate={savingsRate}
            avgDailySpending={summary.avgDailySpending}
            topCategory={topCategory ? { categoryName: topCategory.categoryName, amount: topCategory.amount } : undefined}
            warnings={warnings}
            incomeChange={comparison.incomeChange}
            expensesChange={comparison.expensesChange}
            currency={settings.currency}
            locale={settings.locale}
          />
          <InsightsSummary
            totalIncome={summary.totalIncome}
            totalExpenses={summary.totalExpenses}
            savings={savings}
            savingsRate={savingsRate}
            avgDailySpending={summary.avgDailySpending}
            avgMonthlySpending={avgMonthly}
            topCategory={topCategory}
            largestExpenseAmount={summary.largestExpense}
            incomeChange={comparison.incomeChange}
            expensesChange={comparison.expensesChange}
            currency={settings.currency}
            locale={settings.locale}
          />
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900/70 p-1 shadow-[0_18px_50px_rgba(15,23,42,0.35)]">
            <CategoryBreakdownChart data={catExpenses} currency={settings.currency} locale={settings.locale} />
          </div>
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900/70 p-1 shadow-[0_18px_50px_rgba(15,23,42,0.35)]">
            <IncomeExpenseTrendChart data={trendData12} currency={settings.currency} locale={settings.locale} />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900/70 p-1 shadow-[0_18px_50px_rgba(15,23,42,0.35)]">
            <MonthlyBarChart data={trendData6} currency={settings.currency} locale={settings.locale} />
          </div>
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900/70 p-1 shadow-[0_18px_50px_rgba(15,23,42,0.35)]">
            <MonthlySpendingTrendChart data={dailyData} currency={settings.currency} locale={settings.locale} />
          </div>
        </div>
      </div>
    </div>
  );
}
