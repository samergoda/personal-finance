import { useMemo, useState } from "react";
import {
  HiOutlinePlus,
  HiOutlineArrowTrendingUp,
  HiOutlineArrowTrendingDown,
  HiOutlineCreditCard,
  HiOutlineClipboardDocumentList,
  HiOutlineExclamationTriangle,
  HiOutlineCalendarDays,
} from "react-icons/hi2";
import { useAppContext } from "@/hooks/useAppContext";
import { PageHeader } from "@/components/layout/PageHeader";
import { MonthNavigator } from "@/components/ui/MonthNavigator";
import { StatCard } from "@/components/ui/StatCard";
import { Button } from "@/components/ui/Button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { RecentTransactions } from "@/components/dashboard/RecentTransactions";
import { IncomeExpenseChart } from "@/components/dashboard/IncomeExpenseChart";
import { CategoryDonutChart } from "@/components/dashboard/CategoryDonutChart";
import { DailySpendingChart } from "@/components/dashboard/DailySpendingChart";
import { TransactionForm } from "@/components/transactions/TransactionForm";
import {
  calculateMonthSummary,
  calculateMonthComparison,
  calculateCategoryExpenses,
  calculateMonthlyChartData,
  calculateDailySpending,
  filterByMonth,
  generateInsights,
} from "@/utils/calculations";
import { formatCurrency } from "@/utils/formatting";
import { prevMonth, currentMonthKey, lastNMonths } from "@/utils/dates";
import { AlertBanner } from "@/components/ui/AlertBanner";
import type { TransactionFormData } from "@/types/transaction";

export function Dashboard() {
  const { selectedMonth, setSelectedMonth, transactions, sortedTransactions, categories, getBudgetForMonth, settings, addTransaction } =
    useAppContext();
  const [showForm, setShowForm] = useState(false);

  const nowMonth = currentMonthKey();
  const prevMon = prevMonth(selectedMonth);

  const summary = useMemo(() => calculateMonthSummary(transactions, selectedMonth), [transactions, selectedMonth]);
  const comparison = useMemo(() => calculateMonthComparison(transactions, selectedMonth, prevMon), [transactions, selectedMonth, prevMon]);
  const catExpenses = useMemo(
    () => calculateCategoryExpenses(filterByMonth(transactions, selectedMonth), categories),
    [transactions, selectedMonth, categories],
  );
  const monthlyData = useMemo(() => calculateMonthlyChartData(transactions, lastNMonths(6, selectedMonth)), [transactions, selectedMonth]);
  const dailyData = useMemo(() => calculateDailySpending(transactions, selectedMonth), [transactions, selectedMonth]);
  const budget = getBudgetForMonth(selectedMonth);
  const warnings = useMemo(
    () => generateInsights(transactions, categories, selectedMonth, prevMon, budget),
    [transactions, categories, selectedMonth, prevMon, budget],
  );
  const recentMonthly = useMemo(
    () => sortedTransactions.filter((t) => t.date.startsWith(selectedMonth)),
    [sortedTransactions, selectedMonth],
  );

  const fmt = (n: number) => formatCurrency(n, { currency: settings.currency, locale: settings.locale });

  function openAddTransaction() {
    setShowForm(true);
  }

  function handleAddTransaction(data: TransactionFormData) {
    addTransaction(data);
    setShowForm(false);
  }

  return (
    <div className="flex flex-col min-h-full">
      <PageHeader
        title="Dashboard"
        subtitle="Your financial overview"
        action={
          <Button size="sm" onClick={openAddTransaction}>
            <HiOutlinePlus className="h-4 w-4" />
            Add Transaction
          </Button>
        }>
        <MonthNavigator month={selectedMonth} onChange={setSelectedMonth} maxMonth={nowMonth} />
      </PageHeader>

      <div className="flex-1 p-6 space-y-6">
        {warnings.length > 0 && <AlertBanner warnings={warnings} />}

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <StatCard
            title="Income"
            value={fmt(summary.totalIncome)}
            change={comparison.incomeChange}
            valueColor="text-emerald-600"
            iconBg="bg-emerald-50"
            icon={<HiOutlineArrowTrendingUp className="h-5 w-5 text-emerald-600" />}
          />
          <StatCard
            title="Expenses"
            value={fmt(summary.totalExpenses)}
            change={comparison.expensesChange}
            valueColor="text-red-600"
            iconBg="bg-red-50"
            icon={<HiOutlineArrowTrendingDown className="h-5 w-5 text-red-500" />}
          />
          <StatCard
            title="Balance"
            value={fmt(summary.balance)}
            change={comparison.balanceChange}
            valueColor={summary.balance >= 0 ? "text-indigo-600" : "text-red-600"}
            iconBg="bg-indigo-50"
            icon={<HiOutlineCreditCard className="h-5 w-5 text-indigo-600" />}
          />
          <StatCard
            title="Transactions"
            value={String(summary.transactionCount)}
            iconBg="bg-purple-50"
            icon={<HiOutlineClipboardDocumentList className="h-5 w-5 text-purple-600" />}
          />
          <StatCard
            title="Largest Expense"
            value={summary.largestExpense > 0 ? fmt(summary.largestExpense) : "—"}
            iconBg="bg-amber-50"
            icon={<HiOutlineExclamationTriangle className="h-5 w-5 text-amber-600" />}
          />
          <StatCard
            title="Avg Daily Spend"
            value={fmt(summary.avgDailySpending)}
            iconBg="bg-sky-50"
            icon={<HiOutlineCalendarDays className="h-5 w-5 text-sky-600" />}
          />
        </div>

        {/* Charts row 1 */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <IncomeExpenseChart data={monthlyData} currency={settings.currency} locale={settings.locale} />
          <CategoryDonutChart data={catExpenses} currency={settings.currency} locale={settings.locale} />
        </div>

        {/* Charts row 2 + Recent */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <DailySpendingChart data={dailyData} currency={settings.currency} locale={settings.locale} />
          <RecentTransactions transactions={recentMonthly} categories={categories} currency={settings.currency} locale={settings.locale} />
        </div>
      </div>

      <Dialog open={showForm} onOpenChange={(open) => !open && setShowForm(false)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Add Transaction</DialogTitle>
          </DialogHeader>
          <TransactionForm categories={categories} onSubmit={handleAddTransaction} onCancel={() => setShowForm(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
