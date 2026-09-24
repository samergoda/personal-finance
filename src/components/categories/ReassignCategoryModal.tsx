import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/Button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import { FormField } from "@/components/ui/FormField";
import type { Category } from "@/types/category";

interface ReassignCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (newCategoryId: string) => void;
  deletingCategory: Category;
  alternatives: Category[];
  transactionCount: number;
}

export function ReassignCategoryModal({
  isOpen,
  onClose,
  onConfirm,
  deletingCategory,
  alternatives,
  transactionCount,
}: ReassignCategoryModalProps) {
  const [selectedId, setSelectedId] = useState(alternatives[0]?.id ?? "");

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Reassign Transactions</DialogTitle>
          <DialogDescription>
            <strong>{transactionCount}</strong> transaction{transactionCount !== 1 ? "s" : ""} use <strong>{deletingCategory.name}</strong>.
            Choose a replacement before deleting.
          </DialogDescription>
        </DialogHeader>

        <FormField label="Move transactions to" htmlFor="reassign-cat">
          <Select value={selectedId} onValueChange={setSelectedId}>
            <SelectTrigger id="reassign-cat">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {alternatives.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>

        <DialogFooter className="gap-2 pt-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={() => onConfirm(selectedId)} disabled={!selectedId}>
            Reassign &amp; Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
