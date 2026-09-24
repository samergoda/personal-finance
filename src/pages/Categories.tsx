import { useState, useMemo } from "react";
import { HiOutlinePlus, HiOutlinePencilSquare, HiOutlineTrash } from "react-icons/hi2";
import { useAppContext } from "@/hooks/useAppContext";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { EmptyState } from "@/components/ui/EmptyState";
import { CategoryForm } from "@/components/categories/CategoryForm";
import { ReassignCategoryModal } from "@/components/categories/ReassignCategoryModal";
import { transactionStorage } from "@/services/storage";
import type { Category, CategoryFormData } from "@/types/category";

export function Categories() {
  const { categories, addCategory, updateCategory, deleteCategory, updateTransaction } = useAppContext();

  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState<Category | undefined>();
  const [deleteTarget, setDeleteTarget] = useState<Category | undefined>();
  const [reassignTarget, setReassignTarget] = useState<Category | undefined>();
  const [activeType, setActiveType] = useState<"all" | "expense" | "income">("all");

  const usageCounts = useMemo(() => {
    const map = new Map<string, number>();
    for (const t of transactionStorage.getAll()) {
      map.set(t.categoryId, (map.get(t.categoryId) ?? 0) + 1);
    }
    return map;
  }, [categories]);

  const filtered = useMemo(
    () => (activeType === "all" ? categories : categories.filter((c) => c.type === activeType)),
    [categories, activeType],
  );

  const expCount = categories.filter((c) => c.type === "expense").length;
  const incCount = categories.filter((c) => c.type === "income").length;

  function handleSubmit(data: CategoryFormData) {
    if (editTarget) updateCategory(editTarget.id, data);
    else addCategory(data);
    setShowForm(false);
    setEditTarget(undefined);
  }

  function handleDeleteRequest(cat: Category) {
    const count = usageCounts.get(cat.id) ?? 0;
    if (count > 0) setReassignTarget(cat);
    else setDeleteTarget(cat);
  }

  function handleReassign(newCategoryId: string) {
    if (!reassignTarget) return;
    for (const t of transactionStorage.getAll()) {
      if (t.categoryId === reassignTarget.id) {
        updateTransaction(t.id, { ...t, categoryId: newCategoryId });
      }
    }
    deleteCategory(reassignTarget.id);
    setReassignTarget(undefined);
  }

  const tabs = [
    { key: "all" as const, label: `All (${categories.length})` },
    { key: "expense" as const, label: `Expenses (${expCount})` },
    { key: "income" as const, label: `Income (${incCount})` },
  ];

  return (
    <div className="flex flex-col min-h-full">
      <PageHeader
        title="Categories"
        subtitle="Organise your transactions"
        action={
          <Button
            size="sm"
            onClick={() => {
              setEditTarget(undefined);
              setShowForm(true);
            }}>
            <HiOutlinePlus className="h-4 w-4" />
            New Category
          </Button>
        }
      />

      <div className="flex-1 p-6 space-y-4">
        {/* Tab filter */}
        <div className="flex gap-1 bg-muted p-1 rounded-lg w-fit">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveType(t.key)}
              className={[
                "px-4 py-1.5 rounded-md text-sm font-medium transition-colors",
                activeType === t.key ? "bg-background shadow-sm" : "text-muted-foreground hover:text-foreground",
              ].join(" ")}>
              {t.label}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <EmptyState
                title="No categories found"
                description="Create your first category to organise transactions."
                actionLabel="New Category"
                onAction={() => {
                  setEditTarget(undefined);
                  setShowForm(true);
                }}
              />
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {filtered.map((cat) => {
              const count = usageCounts.get(cat.id) ?? 0;
              return (
                <Card key={cat.id}>
                  <CardContent className="pt-5">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-semibold">{cat.name}</p>
                        <div className="flex items-center gap-1.5 mt-1.5">
                          <Badge variant={cat.type === "income" ? "income" : "expense"}>{cat.type}</Badge>
                          {cat.isDefault && <Badge variant="neutral">default</Badge>}
                        </div>
                      </div>
                      <div className="flex gap-1 flex-shrink-0">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => {
                            setEditTarget(cat);
                            setShowForm(true);
                          }}
                          aria-label="Edit">
                          <HiOutlinePencilSquare className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-red-500 hover:text-red-600 hover:bg-red-50"
                          onClick={() => handleDeleteRequest(cat)}
                          aria-label="Delete">
                          <HiOutlineTrash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-3">
                      {count} transaction{count !== 1 ? "s" : ""}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      <Dialog
        open={showForm}
        onOpenChange={(open) => {
          if (!open) {
            setShowForm(false);
            setEditTarget(undefined);
          }
        }}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>{editTarget ? "Edit Category" : "New Category"}</DialogTitle>
          </DialogHeader>
          <CategoryForm
            initial={editTarget}
            onSubmit={handleSubmit}
            onCancel={() => {
              setShowForm(false);
              setEditTarget(undefined);
            }}
          />
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(undefined)}
        onConfirm={() => {
          if (deleteTarget) {
            deleteCategory(deleteTarget.id);
            setDeleteTarget(undefined);
          }
        }}
        title="Delete Category"
        message={deleteTarget ? `Delete "${deleteTarget.name}"? This cannot be undone.` : ""}
        confirmLabel="Delete"
      />

      {reassignTarget && (
        <ReassignCategoryModal
          isOpen
          onClose={() => setReassignTarget(undefined)}
          onConfirm={handleReassign}
          deletingCategory={reassignTarget}
          alternatives={categories.filter((c) => c.id !== reassignTarget.id && c.type === reassignTarget.type)}
          transactionCount={usageCounts.get(reassignTarget.id) ?? 0}
        />
      )}
    </div>
  );
}
