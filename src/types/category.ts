import type { TransactionType } from './transaction';

export interface Category {
  id: string;
  name: string;
  type: TransactionType;
  isDefault?: boolean;
}

export type CategoryFormData = Omit<Category, 'id' | 'isDefault'>;
