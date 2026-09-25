import { useState } from "react";
import { HiOutlineCheckCircle } from "react-icons/hi2";
import { useAppContext } from "@/hooks/useAppContext";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import { FormField } from "@/components/ui/FormField";
import { transactionStorage, categoryStorage, settingsStorage } from "@/services/storage";
import { DEFAULT_CATEGORIES } from "@/data/defaultCategories";
import { SEED_TRANSACTIONS } from "@/data/seedTransactions";

const CURRENCY_OPTIONS = [
  { value: "EGP", label: "EGP – Egyptian Pound", symbol: "EGP", locale: "en-EG" },
  { value: "USD", label: "USD – US Dollar", symbol: "$", locale: "en-US" },
  { value: "EUR", label: "EUR – Euro", symbol: "€", locale: "de-DE" },
  { value: "GBP", label: "GBP – British Pound", symbol: "£", locale: "en-GB" },
  { value: "SAR", label: "SAR – Saudi Riyal", symbol: "SAR", locale: "ar-SA" },
  { value: "AED", label: "AED – UAE Dirham", symbol: "AED", locale: "ar-AE" },
];

export function Settings() {
  const { settings, updateSettings } = useAppContext();

  const [showClear, setShowClear] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [savedMsg, setSavedMsg] = useState("");

  function handleCurrencyChange(code: string) {
    const opt = CURRENCY_OPTIONS.find((o) => o.value === code);
    if (!opt) return;
    updateSettings({ currency: opt.value, currencySymbol: opt.symbol, locale: opt.locale });
    setSavedMsg("Currency updated.");
    setTimeout(() => setSavedMsg(""), 3000);
  }

  function handleClear() {
    transactionStorage.save([]);
    settingsStorage.update({ seedDataLoaded: false });
    setShowClear(false);
    window.location.reload();
  }

  function handleReset() {
    transactionStorage.save(SEED_TRANSACTIONS);
    categoryStorage.save(DEFAULT_CATEGORIES);
    settingsStorage.update({ seedDataLoaded: true });
    setShowReset(false);
    window.location.reload();
  }

  return (
    <div className="flex flex-col min-h-full">
      <PageHeader title="Settings" subtitle="Configure your preferences" />

      <div className="flex-1 p-6 space-y-6 max-w-2xl">
        {/* Currency */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Currency</CardTitle>
            <CardDescription>Choose how amounts are displayed throughout the app</CardDescription>
          </CardHeader>
          <CardContent>
            <FormField label="Currency" htmlFor="currency-select">
              <Select value={settings.currency} onValueChange={handleCurrencyChange}>
                <SelectTrigger id="currency-select" className="max-w-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CURRENCY_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>
            {savedMsg && (
              <div className="flex items-center gap-1.5 mt-2 text-sm text-emerald-600">
                <HiOutlineCheckCircle className="h-4 w-4" />
                {savedMsg}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Data management */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Data Management</CardTitle>
            <CardDescription>Manage your stored transaction data</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start justify-between gap-4 p-4 rounded-lg bg-muted/50">
              <div>
                <p className="text-sm font-medium">Reset to Demo Data</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Restore sample transactions and default categories. Your current data will be replaced.
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={() => setShowReset(true)}>
                Reset
              </Button>
            </div>
            <Separator />
            <div className="flex items-start justify-between gap-4 p-4 rounded-lg bg-red-50">
              <div>
                <p className="text-sm font-medium text-red-900">Clear All Transactions</p>
                <p className="text-xs text-red-600 mt-0.5">Permanently delete all transactions. Cannot be undone.</p>
              </div>
              <Button variant="destructive" size="sm" onClick={() => setShowClear(true)}>
                Clear
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* About */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">About</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-2 text-sm">
              {[
                ["App", "MoneyTrack"],
                ["Version", "1.0.0"],
                ["Storage", "Supabase"],
                ["Currency", settings.currency],
              ].map(([k, v]) => (
                <div key={k} className="flex gap-2">
                  <dt className="text-muted-foreground w-24">{k}</dt>
                  <dd className="font-medium">{v}</dd>
                </div>
              ))}
            </dl>
          </CardContent>
        </Card>
      </div>

      <ConfirmDialog
        isOpen={showClear}
        onClose={() => setShowClear(false)}
        onConfirm={handleClear}
        title="Clear All Transactions"
        message="This will permanently delete all transactions. This cannot be undone."
        confirmLabel="Clear All"
      />
      <ConfirmDialog
        isOpen={showReset}
        onClose={() => setShowReset(false)}
        onConfirm={handleReset}
        title="Reset to Demo Data"
        message="This will replace all your current transactions and categories with sample data."
        confirmLabel="Reset"
        variant="default"
      />
    </div>
  );
}
