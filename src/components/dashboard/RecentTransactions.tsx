import { useNavigate } from "react-router-dom";
import { HiOutlineArrowTrendingUp, HiOutlineArrowTrendingDown } from "react-icons/hi2";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatCurrency } from "@/utils/formatting";
import { formatShortDate } from "@/utils/dates";
import type { Category } from "@/types/category";
import type { Transaction } from "@/types/transaction";

interface RecentTransactionsProps {
  transactions: Transaction[];
  categories: Category[];
  currency: string;
  locale: string;
}

export function RecentTransactions({ transactions, categories, currency, locale }: RecentTransactionsProps) {
  const navigate = useNavigate();
  const recent = transactions.slice(0, 8);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base">Recent Transactions</CardTitle>
        <Button variant="ghost" size="sm" onClick={() => navigate("/transactions")}>
          View all
        </Button>
      </CardHeader>
      <CardContent className="pt-0">
        {recent.length === 0 ? (
          <EmptyState
            title="No transactions yet"
            description="Add your first transaction to get started."
            actionLabel="Add transaction"
            onAction={() => navigate("/transactions")}
          />
        ) : (
          <ul className="divide-y">
            {recent.map((tx) => {
              const cat = categories.find((c) => c.id === tx.categoryId);
              return (
                <li key={tx.id} className="flex items-center gap-3 py-2.5">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      tx.type === "income" ? "bg-emerald-50" : "bg-red-50"
                    }`}>
                    {tx.type === "income" ? (
                      <HiOutlineArrowTrendingUp className="h-4 w-4 text-emerald-600" />
                    ) : (
                      <HiOutlineArrowTrendingDown className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{tx.description}</p>
                    <p className="text-xs text-muted-foreground">{cat?.name ?? "Unknown"}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className={`text-sm font-semibold ${tx.type === "income" ? "text-emerald-600" : "text-foreground"}`}>
                      {tx.type === "income" ? "+" : "-"}
                      {formatCurrency(tx.amount, { currency, locale })}
                    </p>
                    <p className="text-xs text-muted-foreground">{formatShortDate(tx.date)}</p>
                  </div>
                  <Badge variant={tx.type === "income" ? "income" : "expense"} className="hidden sm:inline-flex">
                    {tx.type}
                  </Badge>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
