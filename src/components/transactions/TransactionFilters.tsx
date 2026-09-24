import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { HiOutlineMagnifyingGlass, HiOutlineXMark } from "react-icons/hi2";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import type { Category } from "@/types/category";

export interface TransactionFilters {
  search: string;
  type: "" | "income" | "expense";
  categoryId: string;
  month: string;
  dateFrom: string;
  dateTo: string;
  sortBy: "date" | "amount";
  sortDir: "asc" | "desc";
}

export const DEFAULT_FILTERS: TransactionFilters = {
  search: "",
  type: "",
  categoryId: "",
  month: "",
  dateFrom: "",
  dateTo: "",
  sortBy: "date",
  sortDir: "desc",
};

interface TransactionFiltersProps {
  filters: TransactionFilters;
  onChange: (f: TransactionFilters) => void;
  categories: Category[];
}

export function TransactionFiltersBar({ filters, onChange, categories }: TransactionFiltersProps) {
  function set<K extends keyof TransactionFilters>(key: K, value: TransactionFilters[K]) {
    onChange({ ...filters, [key]: value });
  }

  const hasActive = filters.search || filters.type || filters.categoryId || filters.month || filters.dateFrom || filters.dateTo;

  return (
    <div className="space-y-3">
      <div className="relative">
        <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input className="pl-9" placeholder="Search transactions…" value={filters.search} onChange={(e) => set("search", e.target.value)} />
      </div>

      <div className="flex flex-wrap gap-2">
        <Select value={filters.type || "__all__"} onValueChange={(v) => set("type", v === "__all__" ? "" : (v as "income" | "expense"))}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder="All types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all__">All types</SelectItem>
            <SelectItem value="income">Income</SelectItem>
            <SelectItem value="expense">Expense</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filters.categoryId || "__all__"} onValueChange={(v) => set("categoryId", v === "__all__" ? "" : v)}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder="All categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all__">All categories</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Input type="month" className="w-40" value={filters.month} onChange={(e) => set("month", e.target.value)} />

        <Input type="date" className="w-38" value={filters.dateFrom} onChange={(e) => set("dateFrom", e.target.value)} placeholder="From" />

        <Input type="date" className="w-38" value={filters.dateTo} onChange={(e) => set("dateTo", e.target.value)} placeholder="To" />

        <Select
          value={`${filters.sortBy}-${filters.sortDir}`}
          onValueChange={(v) => {
            const [by, dir] = v.split("-") as ["date" | "amount", "asc" | "desc"];
            onChange({ ...filters, sortBy: by, sortDir: dir });
          }}>
          <SelectTrigger className="w-38">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date-desc">Newest first</SelectItem>
            <SelectItem value="date-asc">Oldest first</SelectItem>
            <SelectItem value="amount-desc">Highest amount</SelectItem>
            <SelectItem value="amount-asc">Lowest amount</SelectItem>
          </SelectContent>
        </Select>

        {hasActive && (
          <Button variant="ghost" size="sm" onClick={() => onChange(DEFAULT_FILTERS)}>
            <HiOutlineXMark className="h-4 w-4 mr-1" />
            Clear
          </Button>
        )}
      </div>
    </div>
  );
}
