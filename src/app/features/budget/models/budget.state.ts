import { Budget } from '../../../core/services/budgets/budget.service';

export interface BudgetState {
  budgetList: Budget[];
  isListLoading: boolean;
}
