import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatCurrency } from "@/utils/formatting";
import type { DailySpendingPoint } from "@/types/analytics";

interface MonthlySpendingTrendChartProps {
  data: DailySpendingPoint[];
  currency: string;
  locale: string;
}

export function MonthlySpendingTrendChart({ data, currency, locale }: MonthlySpendingTrendChartProps) {
  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Monthly Spending Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <EmptyState title="No spending data for this month" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Monthly Spending Trend</CardTitle>
        <CardDescription>Daily expenses this month</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={data} margin={{ top: 4, right: 16, left: 8, bottom: 16 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="day" tick={{ fontSize: 11 }} label={{ value: "Day", position: "insideBottom", offset: -8, fontSize: 11 }} />
            <YAxis tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 11 }} />
            <Tooltip
              formatter={(v: unknown) => formatCurrency(typeof v === "number" ? v : 0, { currency, locale })}
              labelFormatter={(d) => `Day ${d}`}
            />
            <Line type="monotone" dataKey="amount" name="Spending" stroke="#6366f1" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
