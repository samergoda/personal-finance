import { useState, useMemo } from "react";
import { useAppContext } from "@/hooks/useAppContext";
import { PageHeader } from "@/components/layout/PageHeader";
import { MonthNavigator } from "@/components/ui/MonthNavigator";
import { EmptyState } from "@/components/ui/EmptyState";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { calculateBudgetStatus, filterByMonth } from "@/utils/calculations";
import { formatCurrency } from "@/utils/formatting";
import { currentMonthKey } from "@/utils/dates";

export function Budgets() {
  const {
    selectedMonth,
    setSelectedMonth,
    transactions,
    categories,
    getBudgetForMonth,
    setTotalBudget,
    setCategoryBudget,
    removeCategoryBudget,
    settings,
  } = useAppContext();

  const nowMonth = currentMonthKey();
  const budget = getBudgetForMonth(selectedMonth);
  const totalBudget = budget?.totalBudget ?? null;

  const [totalInput, setTotalInput] = useState("");
  const [catInputs, setCatInputs] = useState<Record<string, string>>({});
  const [editingTotal, setEditingTotal] = useState(false);
  const [editingCatId, setEditingCatId] = useState<string | null>(null);

  const fmt = (n: number) => formatCurrency(n, { currency: settings.currency, locale: settings.locale });

  const expenseCategories = useMemo(() => categories.filter((c) => c.type === "expense"), [categories]);
  const monthlyExpenses = useMemo(
    () => filterByMonth(transactions, selectedMonth).filter((t) => t.type === "expense"),
    [transactions, selectedMonth],
  );
  const totalSpent = monthlyExpenses.reduce((s, t) => s + t.amount, 0);
  const totalPct = totalBudget && totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;
  const budgetStatuses = useMemo(() => {
    if (!budget || budget.categoryBudgets.length === 0) return [];
    return calculateBudgetStatus(transactions, categories, budget, selectedMonth);
  }, [budget, transactions, categories, selectedMonth]);

  function saveTotal() {
    const val = parseFloat(totalInput);
    if (!isNaN(val) && val > 0) setTotalBudget(selectedMonth, val);
    else if (totalInput === "") setTotalBudget(selectedMonth, null);
    setEditingTotal(false);
  }

  function saveCat(catId: string) {
    const val = parseFloat(catInputs[catId] ?? "");
    if (!isNaN(val) && val > 0) setCategoryBudget(selectedMonth, catId, val);
    else if ((catInputs[catId] ?? "") === "") removeCategoryBudget(selectedMonth, catId);
    setEditingCatId(null);
  }

  return (
    <div className="flex flex-col min-h-full">
      <PageHeader title="Budgets" subtitle="Set and track spending limits">
        <MonthNavigator month={selectedMonth} onChange={setSelectedMonth} maxMonth={nowMonth} />
      </PageHeader>

      <div className="flex-1 p-6 space-y-6">
        {/* Monthly total */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base">Monthly Budget</CardTitle>
            {!editingTotal ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setTotalInput(totalBudget !== null ? String(totalBudget) : "");
                  setEditingTotal(true);
                }}>
                {totalBudget !== null ? "Edit" : "Set Budget"}
              </Button>
            ) : (
              <div className="flex gap-2 items-center">
                <Input
                  type="number"
                  min="0"
                  step="100"
                  placeholder="Amount"
                  value={totalInput}
                  onChange={(e) => setTotalInput(e.target.value)}
                  className="w-32 h-8"
                />
                <Button size="sm" onClick={saveTotal}>
                  Save
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setEditingTotal(false)}>
                  Cancel
                </Button>
              </div>
            )}
          </CardHeader>
          <CardContent>
            {totalBudget !== null ? (
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Spent</span>
                  <span className={`font-semibold ${totalPct >= 100 ? "text-red-600" : totalPct >= 80 ? "text-amber-600" : ""}`}>
                    {fmt(totalSpent)} / {fmt(totalBudget)}
                  </span>
                </div>
                <Progress
                  value={Math.min(totalPct, 100)}
                  className={totalPct >= 100 ? "[&>div]:bg-red-500" : totalPct >= 80 ? "[&>div]:bg-amber-500" : ""}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Remaining: {fmt(Math.max(0, totalBudget - totalSpent))}</span>
                  <span>{Math.round(totalPct)}% used</span>
                </div>
                {totalPct >= 100 && <p className="text-sm text-red-600 font-medium">⚠️ You have exceeded your monthly budget.</p>}
                {totalPct >= 80 && totalPct < 100 && (
                  <p className="text-sm text-amber-600 font-medium">⚠️ You are at {Math.round(totalPct)}% of your monthly budget.</p>
                )}
              </div>
            ) : (
              <EmptyState
                title="No monthly budget set"
                description="Set an overall spending limit for this month."
                actionLabel="Set Budget"
                onAction={() => {
                  setTotalInput("");
                  setEditingTotal(true);
                }}
              />
            )}
          </CardContent>
        </Card>

        {/* Category budgets */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Category Budgets</CardTitle>
          </CardHeader>
          <CardContent>
            {expenseCategories.length === 0 ? (
              <EmptyState title="No expense categories" description="Add expense categories first." />
            ) : (
              <div className="space-y-1">
                {expenseCategories.map((cat, i) => {
                  const existing = budget?.categoryBudgets.find((cb) => cb.categoryId === cat.id);
                  const status = budgetStatuses.find((s) => s.categoryId === cat.id);
                  const spent = monthlyExpenses.filter((t) => t.categoryId === cat.id).reduce((s, t) => s + t.amount, 0);
                  const isEditing = editingCatId === cat.id;
                  const pct = existing ? (spent / existing.amount) * 100 : 0;

                  return (
                    <div key={cat.id}>
                      {i > 0 && <Separator className="my-3" />}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium">{cat.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {existing ? `${fmt(spent)} / ${fmt(existing.amount)}` : `Spent: ${fmt(spent)}`}
                            </p>
                          </div>
                          {isEditing ? (
                            <div className="flex gap-2 items-center flex-shrink-0">
                              <Input
                                type="number"
                                min="0"
                                step="100"
                                placeholder="Budget"
                                value={catInputs[cat.id] ?? ""}
                                onChange={(e) => setCatInputs((p) => ({ ...p, [cat.id]: e.target.value }))}
                                className="w-28 h-8"
                              />
                              <Button size="sm" onClick={() => saveCat(cat.id)}>
                                Save
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => setEditingCatId(null)}>
                                Cancel
                              </Button>
                            </div>
                          ) : (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="flex-shrink-0"
                              onClick={() => {
                                setCatInputs((p) => ({ ...p, [cat.id]: existing ? String(existing.amount) : "" }));
                                setEditingCatId(cat.id);
                              }}>
                              {existing ? "Edit" : "Set"}
                            </Button>
                          )}
                        </div>
                        {existing && status && (
                          <>
                            <Progress
                              value={Math.min(pct, 100)}
                              className={pct >= 100 ? "[&>div]:bg-red-500" : pct >= 80 ? "[&>div]:bg-amber-500" : ""}
                            />
                            {pct >= 100 && <p className="text-xs text-red-600">⚠️ Budget exceeded ({Math.round(pct)}%)</p>}
                            {pct >= 80 && pct < 100 && <p className="text-xs text-amber-600">⚠️ At {Math.round(pct)}% of budget</p>}
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
