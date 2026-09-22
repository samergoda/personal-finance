import { useState, useCallback } from 'react';
import type { AppSettings } from '../types';
import { settingsStorage } from '../services/storage';

export function useSettings() {
  const [settings, setSettings] = useState<AppSettings>(() => settingsStorage.get());

  const updateSettings = useCallback((patch: Partial<AppSettings>) => {
    const updated = settingsStorage.update(patch);
    setSettings(updated);
  }, []);

  return { settings, updateSettings };
}
