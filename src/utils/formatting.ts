import type { AppSettings } from '../types';

/**
 * Format a number as currency.
 * Default: "35,000 EGP"
 */
export function formatCurrency(
  amount: number,
  settings?: Pick<AppSettings, 'currency' | 'locale'>,
): string {
  const locale   = settings?.locale   ?? 'en-EG';
  const currency = settings?.currency ?? 'EGP';

  try {
    return new Intl.NumberFormat(locale, {
      style:                 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    // Fallback for unknown locale/currency combos
    return `${amount.toLocaleString()} ${currency}`;
  }
}

/**
 * Format a percentage with one decimal place.
 * e.g.  25.3%
 */
export function formatPercent(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Format a signed percentage change for display.
 * e.g. +8%  /  -12%
 */
export function formatChangePercent(value: number): string {
  const sign = value > 0 ? '+' : '';
  return `${sign}${Math.round(value)}%`;
}

/**
 * Truncate a string to a maximum length, appending "…" if cut.
 */
export function truncate(str: string, max = 40): string {
  return str.length <= max ? str : `${str.slice(0, max - 1)}…`;
}
