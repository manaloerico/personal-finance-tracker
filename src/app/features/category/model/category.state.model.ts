import { Category } from '../../../core/services/category/category.service';
import { TransactionType } from '../../../core/services/transaction-type/transaction-type.service';

export interface CategoryState {
  categoryList: Category[];
  transactionTypeList: TransactionType[];

  groupedCategory: Record<string, GroupedCategory>;
}

export interface GroupedCategory {
  total: number;
  categories: Category[];
}
