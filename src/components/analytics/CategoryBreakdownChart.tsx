import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { EmptyState } from "../ui/EmptyState";
import { formatCurrency } from "@/utils/formatting";
import type { CategoryExpense } from "@/types/analytics";

const PIE_COLORS = [
  "#6366f1",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#06b6d4",
  "#ec4899",
  "#84cc16",
  "#f97316",
  "#14b8a6",
  "#a855f7",
  "#64748b",
];

interface CategoryBreakdownChartProps {
  data: CategoryExpense[];
  currency: string;
  locale: string;
}

export function CategoryBreakdownChart({ data, currency, locale }: CategoryBreakdownChartProps) {
  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Expenses by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <EmptyState title="No expenses for this month" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Expenses by Category</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="shrink-0">
            <ResponsiveContainer width={220} height={220}>
              <PieChart>
                <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={95} dataKey="amount" nameKey="categoryName">
                  {data.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v: unknown) => formatCurrency(typeof v === "number" ? v : 0, { currency, locale })} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <ul className="flex-1 w-full space-y-2">
            {data.map((item, i) => (
              <li key={item.categoryId} className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }} />
                <span className="flex-1 text-sm truncate text-muted-foreground">{item.categoryName}</span>
                <span className="text-sm font-medium whitespace-nowrap">{formatCurrency(item.amount, { currency, locale })}</span>
                <span className="text-xs text-muted-foreground w-12 text-right">{item.percentage.toFixed(1)}%</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
