import { HiOutlinePencilSquare, HiOutlineTrash } from "react-icons/hi2";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatCurrency } from "@/utils/formatting";
import { formatShortDate } from "@/utils/dates";
import type { Category } from "@/types/category";
import type { Transaction } from "@/types/transaction";

interface TransactionTableProps {
  transactions: Transaction[];
  categories: Category[];
  currency: string;
  locale: string;
  onEdit: (tx: Transaction) => void;
  onDelete: (tx: Transaction) => void;
  onAdd: () => void;
}

export function TransactionTable({ transactions, categories, currency, locale, onEdit, onDelete, onAdd }: TransactionTableProps) {
  if (transactions.length === 0) {
    return (
      <EmptyState
        title="No transactions found"
        description="Try adjusting your filters or add a new transaction."
        actionLabel="Add transaction"
        onAction={onAdd}
      />
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-left">
            <th className="pb-3 pr-4 font-semibold text-muted-foreground text-xs uppercase tracking-wide">Date</th>
            <th className="pb-3 pr-4 font-semibold text-muted-foreground text-xs uppercase tracking-wide">Description</th>
            <th className="pb-3 pr-4 font-semibold text-muted-foreground text-xs uppercase tracking-wide hidden sm:table-cell">Category</th>
            <th className="pb-3 pr-4 font-semibold text-muted-foreground text-xs uppercase tracking-wide hidden md:table-cell">Type</th>
            <th className="pb-3 pr-4 font-semibold text-muted-foreground text-xs uppercase tracking-wide text-right">Amount</th>
            <th className="pb-3 font-semibold text-muted-foreground text-xs uppercase tracking-wide text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {transactions.map((tx) => {
            const cat = categories.find((c) => c.id === tx.categoryId);
            return (
              <tr key={tx.id} className="hover:bg-muted/40 transition-colors group">
                <td className="py-3 pr-4 text-muted-foreground whitespace-nowrap">{formatShortDate(tx.date)}</td>
                <td className="py-3 pr-4 max-w-xs">
                  <p className="font-medium truncate">{tx.description}</p>
                </td>
                <td className="py-3 pr-4 hidden sm:table-cell">
                  <span className="text-muted-foreground">{cat?.name ?? "—"}</span>
                </td>
                <td className="py-3 pr-4 hidden md:table-cell">
                  <Badge variant={tx.type === "income" ? "income" : "expense"}>{tx.type}</Badge>
                </td>
                <td className="py-3 pr-4 text-right whitespace-nowrap">
                  <span className={`font-semibold ${tx.type === "income" ? "text-emerald-600" : ""}`}>
                    {tx.type === "income" ? "+" : "-"}
                    {formatCurrency(tx.amount, { currency, locale })}
                  </span>
                </td>
                <td className="py-3 text-right">
                  <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onEdit(tx)} aria-label="Edit">
                      <HiOutlinePencilSquare className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-red-500 hover:text-red-600 hover:bg-red-50"
                      onClick={() => onDelete(tx)}
                      aria-label="Delete">
                      <HiOutlineTrash className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
