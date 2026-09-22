import type { Transaction } from '../types';

/**
 * Realistic seed data covering July, August, and September 2026.
 * These are clearly separated from user data via the SEED_TRANSACTION_IDS set.
 * To remove all seed data, delete every transaction whose id starts with "seed-".
 */

function tx(
  id: string,
  type: Transaction['type'],
  amount: number,
  categoryId: string,
  description: string,
  date: string,
): Transaction {
  return { id, type, amount, categoryId, description, date, createdAt: `${date}T08:00:00.000Z` };
}

// ─── July 2026 ────────────────────────────────────────────────────────────────
const july: Transaction[] = [
  tx('seed-jul-01', 'income',  35000, 'cat-salary',        'Monthly Salary',           '2026-07-01'),
  tx('seed-jul-02', 'income',   4500, 'cat-freelance',     'Web design project',       '2026-07-05'),
  tx('seed-jul-03', 'expense',  5000, 'cat-rent',          'Apartment rent',           '2026-07-01'),
  tx('seed-jul-04', 'expense',   800, 'cat-bills',         'Electricity & water',      '2026-07-03'),
  tx('seed-jul-05', 'expense',   450, 'cat-food',          'Weekly groceries',         '2026-07-04'),
  tx('seed-jul-06', 'expense',   200, 'cat-transport',     'Metro & Uber',             '2026-07-05'),
  tx('seed-jul-07', 'expense',   350, 'cat-food',          'Restaurant dinner',        '2026-07-07'),
  tx('seed-jul-08', 'expense',  1200, 'cat-shopping',      'Clothing & accessories',   '2026-07-09'),
  tx('seed-jul-09', 'expense',   500, 'cat-entertainment', 'Cinema & outings',         '2026-07-10'),
  tx('seed-jul-10', 'expense',   300, 'cat-subscriptions', 'Netflix, Spotify',         '2026-07-11'),
  tx('seed-jul-11', 'expense',   480, 'cat-food',          'Weekly groceries',         '2026-07-11'),
  tx('seed-jul-12', 'expense',   150, 'cat-transport',     'Taxi rides',               '2026-07-13'),
  tx('seed-jul-13', 'expense',   600, 'cat-health',        'Doctor & pharmacy',        '2026-07-14'),
  tx('seed-jul-14', 'expense',   900, 'cat-family',        'Family support',           '2026-07-15'),
  tx('seed-jul-15', 'expense',   420, 'cat-food',          'Weekly groceries',         '2026-07-18'),
  tx('seed-jul-16', 'expense',   250, 'cat-transport',     'Bus & Uber',               '2026-07-20'),
  tx('seed-jul-17', 'expense',   700, 'cat-education',     'Online courses',           '2026-07-21'),
  tx('seed-jul-18', 'expense',   380, 'cat-food',          'Dining out',               '2026-07-24'),
  tx('seed-jul-19', 'expense',   200, 'cat-entertainment', 'Books & hobbies',          '2026-07-25'),
  tx('seed-jul-20', 'expense',  1500, 'cat-travel',        'Day trip to Alexandria',   '2026-07-26'),
  tx('seed-jul-21', 'expense',   460, 'cat-food',          'Weekly groceries',         '2026-07-25'),
  tx('seed-jul-22', 'expense',   120, 'cat-other-exp',     'Miscellaneous',            '2026-07-28'),
];

// ─── August 2026 ──────────────────────────────────────────────────────────────
const august: Transaction[] = [
  tx('seed-aug-01', 'income',  35000, 'cat-salary',        'Monthly Salary',           '2026-08-01'),
  tx('seed-aug-02', 'income',   2000, 'cat-bonus',         'Performance bonus',        '2026-08-10'),
  tx('seed-aug-03', 'expense',  5000, 'cat-rent',          'Apartment rent',           '2026-08-01'),
  tx('seed-aug-04', 'expense',   750, 'cat-bills',         'Electricity & water',      '2026-08-03'),
  tx('seed-aug-05', 'expense',   500, 'cat-food',          'Weekly groceries',         '2026-08-02'),
  tx('seed-aug-06', 'expense',   180, 'cat-transport',     'Metro & Uber',             '2026-08-04'),
  tx('seed-aug-07', 'expense',   280, 'cat-food',          'Restaurant lunch',         '2026-08-06'),
  tx('seed-aug-08', 'expense',   800, 'cat-shopping',      'Electronics accessories',  '2026-08-08'),
  tx('seed-aug-09', 'expense',   350, 'cat-entertainment', 'Movie & bowling',          '2026-08-09'),
  tx('seed-aug-10', 'expense',   300, 'cat-subscriptions', 'Netflix, Spotify',         '2026-08-11'),
  tx('seed-aug-11', 'expense',   440, 'cat-food',          'Weekly groceries',         '2026-08-09'),
  tx('seed-aug-12', 'expense',   120, 'cat-transport',     'Taxi rides',               '2026-08-11'),
  tx('seed-aug-13', 'expense',   200, 'cat-health',        'Pharmacy',                 '2026-08-13'),
  tx('seed-aug-14', 'expense',   900, 'cat-family',        'Family gathering expense', '2026-08-14'),
  tx('seed-aug-15', 'expense',   380, 'cat-food',          'Weekly groceries',         '2026-08-16'),
  tx('seed-aug-16', 'expense',   200, 'cat-transport',     'Bus & Uber',               '2026-08-18'),
  tx('seed-aug-17', 'expense',   420, 'cat-food',          'Dining out with friends',  '2026-08-20'),
  tx('seed-aug-18', 'expense',   150, 'cat-entertainment', 'Books',                    '2026-08-22'),
  tx('seed-aug-19', 'expense',   460, 'cat-food',          'Weekly groceries',         '2026-08-23'),
  tx('seed-aug-20', 'expense',   100, 'cat-other-exp',     'Miscellaneous',            '2026-08-27'),
  tx('seed-aug-21', 'income',    800, 'cat-investment',    'Stock dividends',          '2026-08-28'),
];

// ─── September 2026 ───────────────────────────────────────────────────────────
const september: Transaction[] = [
  tx('seed-sep-01', 'income',  35000, 'cat-salary',        'Monthly Salary',           '2026-09-01'),
  tx('seed-sep-02', 'income',   6000, 'cat-freelance',     'Mobile app consulting',    '2026-09-07'),
  tx('seed-sep-03', 'expense',  5000, 'cat-rent',          'Apartment rent',           '2026-09-01'),
  tx('seed-sep-04', 'expense',   800, 'cat-bills',         'Electricity & water',      '2026-09-02'),
  tx('seed-sep-05', 'expense',   450, 'cat-food',          'Weekly groceries',         '2026-09-03'),
  tx('seed-sep-06', 'expense',   100, 'cat-transport',     'Metro card',               '2026-09-04'),
  tx('seed-sep-07', 'expense',   320, 'cat-food',          'Restaurant dinner',        '2026-09-05'),
  tx('seed-sep-08', 'expense',  1500, 'cat-shopping',      'Back-to-school supplies',  '2026-09-06'),
  tx('seed-sep-09', 'expense',   600, 'cat-entertainment', 'Concerts & events',        '2026-09-08'),
  tx('seed-sep-10', 'expense',   300, 'cat-subscriptions', 'Netflix, Spotify',         '2026-09-10'),
  tx('seed-sep-11', 'expense',   480, 'cat-food',          'Weekly groceries',         '2026-09-10'),
  tx('seed-sep-12', 'expense',   200, 'cat-transport',     'Uber rides',               '2026-09-12'),
  tx('seed-sep-13', 'expense',   400, 'cat-health',        'Dentist visit',            '2026-09-13'),
  tx('seed-sep-14', 'expense',   700, 'cat-family',        'Family support',           '2026-09-14'),
  tx('seed-sep-15', 'expense',   500, 'cat-food',          'Weekly groceries',         '2026-09-17'),
  tx('seed-sep-16', 'expense',   180, 'cat-transport',     'Bus & taxi',               '2026-09-18'),
  tx('seed-sep-17', 'expense',   900, 'cat-education',     'Programming bootcamp',     '2026-09-19'),
  tx('seed-sep-18', 'expense',   250, 'cat-food',          'Café & snacks',            '2026-09-20'),
  tx('seed-sep-19', 'expense',   350, 'cat-entertainment', 'Weekend activities',       '2026-09-21'),
  tx('seed-sep-20', 'expense',   420, 'cat-food',          'Weekly groceries',         '2026-09-22'),
  tx('seed-sep-21', 'expense',   120, 'cat-other-exp',     'Miscellaneous',            '2026-09-22'),
];

export const SEED_TRANSACTIONS: Transaction[] = [...july, ...august, ...september];

/** Set of all seed transaction IDs for easy identification and removal */
export const SEED_TRANSACTION_IDS = new Set(SEED_TRANSACTIONS.map(t => t.id));
