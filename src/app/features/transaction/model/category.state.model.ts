import { Category } from '../../../core/services/category/category.service';
import { Transaction } from '../../../core/services/transaction.service';

export interface TransactionState {
  isLoading: boolean;
  transactionList: Transaction[];
  categoryList: Category[];
}
