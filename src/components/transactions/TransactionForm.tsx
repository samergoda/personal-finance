import { useState, type FormEvent } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import { todayISO } from "@/utils/dates";
import type { Category } from "@/types/category";
import type { Transaction, TransactionFormData } from "@/types/transaction";

interface FormErrors {
  amount?: string;
  categoryId?: string;
  description?: string;
  date?: string;
}

interface TransactionFormProps {
  categories: Category[];
  initial?: Transaction;
  onSubmit: (data: TransactionFormData) => void;
  onCancel: () => void;
  loading?: boolean;
}

export function TransactionForm({ categories, initial, onSubmit, onCancel, loading = false }: TransactionFormProps) {
  const [type, setType] = useState<"income" | "expense">(initial?.type ?? "expense");
  const [amount, setAmount] = useState(initial ? String(initial.amount) : "");
  const [categoryId, setCategoryId] = useState(initial?.categoryId ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [date, setDate] = useState(initial?.date ?? todayISO());
  const [errors, setErrors] = useState<FormErrors>({});

  const filteredCategories = categories.filter((c) => c.type === type);

  function handleTypeChange(newType: "income" | "expense") {
    setType(newType);
    setCategoryId("");
  }

  function validate(): boolean {
    const errs: FormErrors = {};
    const num = parseFloat(amount);
    if (!amount || isNaN(num) || num <= 0) errs.amount = "Amount must be greater than 0";
    if (!categoryId) errs.categoryId = "Category is required";
    if (!description.trim()) errs.description = "Description is required";
    if (!date) errs.date = "Date is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({ type, amount: parseFloat(amount), categoryId, description: description.trim(), date });
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      {/* Type toggle */}
      <div>
        <p className="text-sm font-medium mb-1.5">Type</p>
        <div className="flex rounded-md border overflow-hidden">
          {(["expense", "income"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => handleTypeChange(t)}
              className={[
                "flex-1 py-2 text-sm font-medium transition-colors",
                type === t
                  ? t === "income"
                    ? "bg-emerald-600 text-white"
                    : "bg-red-600 text-white"
                  : "bg-background text-muted-foreground hover:bg-muted",
              ].join(" ")}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <FormField label="Amount (EGP)" htmlFor="amount" error={errors.amount}>
        <Input
          id="amount"
          type="number"
          min="0.01"
          step="0.01"
          placeholder="0.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </FormField>

      <FormField label="Category" htmlFor="category" error={errors.categoryId}>
        <Select value={categoryId} onValueChange={setCategoryId}>
          <SelectTrigger id="category">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {filteredCategories.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormField>

      <FormField label="Description" htmlFor="description" error={errors.description}>
        <Input
          id="description"
          type="text"
          placeholder="e.g. Monthly rent, Restaurant dinner…"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </FormField>

      <FormField label="Date" htmlFor="date" error={errors.date}>
        <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      </FormField>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Saving…" : initial ? "Save Changes" : "Add Transaction"}
        </Button>
      </div>
    </form>
  );
}
