export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  categoryId: string;
  description: string;
  date: string;       // YYYY-MM-DD
  createdAt: string;  // ISO datetime
}

export type TransactionFormData = Omit<Transaction, 'id' | 'createdAt'>;
