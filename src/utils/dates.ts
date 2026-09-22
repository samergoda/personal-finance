import {
  format,
  parseISO,
  startOfMonth,
  endOfMonth,
  isWithinInterval,
  subMonths,
  addMonths,
  getDaysInMonth,
  getDate,
} from 'date-fns';

// ─── Month key helpers ─────────────────────────────────────────────────────────

/** Returns the current month key in YYYY-MM format. */
export function currentMonthKey(): string {
  return format(new Date(), 'yyyy-MM');
}

/** Returns a YYYY-MM key for any Date. */
export function toMonthKey(date: Date): string {
  return format(date, 'yyyy-MM');
}

/** Parses a YYYY-MM key back to the first day of that month as a Date. */
export function monthKeyToDate(key: string): Date {
  return parseISO(`${key}-01`);
}

/** Returns the display label for a month key, e.g. "September 2026". */
export function formatMonthLabel(monthKey: string): string {
  return format(monthKeyToDate(monthKey), 'MMMM yyyy');
}

/** Navigate to the previous month. */
export function prevMonth(monthKey: string): string {
  return toMonthKey(subMonths(monthKeyToDate(monthKey), 1));
}

/** Navigate to the next month. */
export function nextMonth(monthKey: string): string {
  return toMonthKey(addMonths(monthKeyToDate(monthKey), 1));
}

// ─── Date range helpers ────────────────────────────────────────────────────────

/** Returns the start and end Date objects for a given YYYY-MM key. */
export function monthRange(monthKey: string): { start: Date; end: Date } {
  const d = monthKeyToDate(monthKey);
  return { start: startOfMonth(d), end: endOfMonth(d) };
}

/** Returns true if an ISO date string falls within the given month. */
export function isInMonth(dateStr: string, monthKey: string): boolean {
  const { start, end } = monthRange(monthKey);
  return isWithinInterval(parseISO(dateStr), { start, end });
}

/** Returns true if an ISO date string falls within an inclusive date range. */
export function isInRange(dateStr: string, from: string, to: string): boolean {
  return isWithinInterval(parseISO(dateStr), {
    start: parseISO(from),
    end:   parseISO(to),
  });
}

// ─── Display helpers ───────────────────────────────────────────────────────────

/** Short display date, e.g. "Sep 22". */
export function formatShortDate(dateStr: string): string {
  return format(parseISO(dateStr), 'MMM d');
}

/** Full display date, e.g. "September 22, 2026". */
export function formatFullDate(dateStr: string): string {
  return format(parseISO(dateStr), 'MMMM d, yyyy');
}

/** Input-compatible value: YYYY-MM-DD. */
export function formatInputDate(dateStr: string): string {
  return format(parseISO(dateStr), 'yyyy-MM-dd');
}

/** Today as YYYY-MM-DD. */
export function todayISO(): string {
  return format(new Date(), 'yyyy-MM-dd');
}

// ─── Analytics helpers ─────────────────────────────────────────────────────────

/**
 * Returns the number of days elapsed in a month so far (capped at total days).
 * Used for average daily spending calculations.
 */
export function daysElapsedInMonth(monthKey: string): number {
  const now = new Date();
  const monthDate = monthKeyToDate(monthKey);

  // If the selected month is in the future, return 1 to avoid division by zero
  if (monthDate > now) return 1;

  // If the selected month is in the past, return full days
  const nowKey = toMonthKey(now);
  if (monthKey < nowKey) return getDaysInMonth(monthDate);

  // Current month — return today's day-of-month
  return getDate(now);
}

/**
 * Returns an array of the last N month keys (including current), oldest first.
 */
export function lastNMonths(n: number, from?: string): string[] {
  const base = from ? monthKeyToDate(from) : new Date();
  const keys: string[] = [];
  for (let i = n - 1; i >= 0; i--) {
    keys.push(toMonthKey(subMonths(base, i)));
  }
  return keys;
}
