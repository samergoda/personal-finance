import { useState, useMemo } from "react";
import { HiOutlinePlus } from "react-icons/hi2";
import { useAppContext } from "@/hooks/useAppContext";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { TransactionForm } from "@/components/transactions/TransactionForm";
import { TransactionFiltersBar, DEFAULT_FILTERS } from "@/components/transactions/TransactionFilters";
import { TransactionTable } from "@/components/transactions/TransactionTable";
import { isInRange } from "@/utils/dates";
import type { TransactionFilters } from "@/components/transactions/TransactionFilters";
import type { Transaction, TransactionFormData } from "@/types/transaction";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";

export function Transactions() {
  const { sortedTransactions, categories, addTransaction, updateTransaction, deleteTransaction, settings } = useAppContext();

  const [filters, setFilters] = useState<TransactionFilters>(DEFAULT_FILTERS);
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState<Transaction | undefined>();
  const [deleteTarget, setDeleteTarget] = useState<Transaction | undefined>();

  const filtered = useMemo(() => {
    let list = [...sortedTransactions];
    if (filters.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(
        (t) =>
          t.description.toLowerCase().includes(q) ||
          categories
            .find((c) => c.id === t.categoryId)
            ?.name.toLowerCase()
            .includes(q),
      );
    }
    if (filters.type) list = list.filter((t) => t.type === filters.type);
    if (filters.categoryId) list = list.filter((t) => t.categoryId === filters.categoryId);
    if (filters.month) list = list.filter((t) => t.date.startsWith(filters.month));
    if (filters.dateFrom && filters.dateTo) {
      list = list.filter((t) => isInRange(t.date, filters.dateFrom, filters.dateTo));
    } else if (filters.dateFrom) {
      list = list.filter((t) => t.date >= filters.dateFrom);
    } else if (filters.dateTo) {
      list = list.filter((t) => t.date <= filters.dateTo);
    }
    list.sort((a, b) => {
      const dir = filters.sortDir === "asc" ? 1 : -1;
      return filters.sortBy === "amount" ? (a.amount - b.amount) * dir : a.date.localeCompare(b.date) * dir;
    });
    return list;
  }, [sortedTransactions, filters, categories]);

  function openAdd() {
    setEditTarget(undefined);
    setShowForm(true);
  }
  function openEdit(tx: Transaction) {
    setEditTarget(tx);
    setShowForm(true);
  }
  function closeForm() {
    setShowForm(false);
    setEditTarget(undefined);
  }

  function handleSubmit(data: TransactionFormData) {
    if (editTarget) updateTransaction(editTarget.id, data);
    else addTransaction(data);
    closeForm();
  }

  function handleDelete() {
    if (deleteTarget) {
      deleteTransaction(deleteTarget.id);
      setDeleteTarget(undefined);
    }
  }

  return (
    <div className="flex flex-col min-h-full">
      <PageHeader
        title="Transactions"
        subtitle={`${filtered.length} of ${sortedTransactions.length} transactions`}
        action={
          <Button size="sm" onClick={openAdd}>
            <HiOutlinePlus className="h-4 w-4" />
            Add Transaction
          </Button>
        }
      />

      <div className="flex-1 p-6 space-y-4">
        <Card>
          <CardContent className="pt-5">
            <TransactionFiltersBar filters={filters} onChange={setFilters} categories={categories} />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <p className="text-sm text-muted-foreground mb-4">
              Showing <span className="font-medium text-foreground">{filtered.length}</span> transactions
            </p>
            <TransactionTable
              transactions={filtered}
              categories={categories}
              currency={settings.currency}
              locale={settings.locale}
              onEdit={openEdit}
              onDelete={setDeleteTarget}
              onAdd={openAdd}
            />
          </CardContent>
        </Card>
      </div>

      {/* Add / Edit */}
      <Dialog open={showForm} onOpenChange={(open) => !open && closeForm()}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editTarget ? "Edit Transaction" : "Add Transaction"}</DialogTitle>
          </DialogHeader>
          <TransactionForm categories={categories} initial={editTarget} onSubmit={handleSubmit} onCancel={closeForm} />
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(undefined)}
        onConfirm={handleDelete}
        title="Delete Transaction"
        message={deleteTarget ? `Delete "${deleteTarget.description}"? This cannot be undone.` : ""}
        confirmLabel="Delete"
      />
    </div>
  );
}
