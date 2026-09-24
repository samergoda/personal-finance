import { useState, type FormEvent } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import type { Category, CategoryFormData } from "@/types/category";

interface FormErrors {
  name?: string;
}

interface CategoryFormProps {
  initial?: Category;
  onSubmit: (data: CategoryFormData) => void;
  onCancel: () => void;
  loading?: boolean;
}

export function CategoryForm({ initial, onSubmit, onCancel, loading = false }: CategoryFormProps) {
  const [name, setName] = useState(initial?.name ?? "");
  const [type, setType] = useState<"income" | "expense">(initial?.type ?? "expense");
  const [errors, setErrors] = useState<FormErrors>({});

  function validate(): boolean {
    const errs: FormErrors = {};
    if (!name.trim()) errs.name = "Category name is required";
    if (name.trim().length > 40) errs.name = "Name must be 40 characters or fewer";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({ name: name.trim(), type });
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <FormField label="Category Name" htmlFor="cat-name" error={errors.name}>
        <Input
          id="cat-name"
          type="text"
          placeholder="e.g. Groceries, Side Income…"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </FormField>

      <FormField label="Type" htmlFor="cat-type">
        <Select value={type} onValueChange={(v) => setType(v as "income" | "expense")}>
          <SelectTrigger id="cat-type">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="expense">Expense</SelectItem>
            <SelectItem value="income">Income</SelectItem>
          </SelectContent>
        </Select>
      </FormField>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Saving…" : initial ? "Save Changes" : "Create Category"}
        </Button>
      </div>
    </form>
  );
}
