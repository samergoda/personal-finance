import type { AppSettings } from "../../types";
import { STORAGE_KEYS, DEFAULT_SETTINGS, load, save } from "./common";
import { supabase } from "../../lib/supabase";

export const settingsStorage = {
  get(): AppSettings {
    return load<AppSettings>(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
  },
  save(settings: AppSettings): void {
    save(STORAGE_KEYS.SETTINGS, settings);
    void syncSettingsToSupabase(settings);
  },
  update(patch: Partial<AppSettings>): AppSettings {
    const current = settingsStorage.get();
    const updated = { ...current, ...patch };
    settingsStorage.save(updated);
    return updated;
  },
};

async function syncSettingsToSupabase(settings: AppSettings): Promise<void> {
  if (!supabase) return;

  const { error } = await supabase.from("settings").upsert(
    {
      id: "default",
      currency: settings.currency,
      currency_symbol: settings.currencySymbol,
      locale: settings.locale,
      seed_data_loaded: settings.seedDataLoaded,
    },
    { onConflict: "id" },
  );

  if (error) {
    console.error("Supabase settings sync failed:", error.message);
  }
}
