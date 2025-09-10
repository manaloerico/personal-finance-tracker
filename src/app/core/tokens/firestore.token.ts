import { InjectionToken } from '@angular/core';
import { CollectionReference, DocumentData } from 'firebase/firestore';
import { TransactionType } from '../services/transaction-type/transaction-type.service';

export const CATEGORY_COLLECTION = new InjectionToken<
  CollectionReference<DocumentData>
>('CategoryCollection');
export const TRANSACTION_COLLECTION = new InjectionToken<
  CollectionReference<DocumentData>
>('TransactionCollection');

export const TRANSACTION_TYPE_COLLECTION = new InjectionToken<
  CollectionReference<DocumentData>
>('TransactionTypeCollection');

export const BUDGET_COLLECTION = new InjectionToken<
  CollectionReference<DocumentData>
>('BudgetCollection');

export const TRANSACTION_TYPE_MAP = new InjectionToken<
  Record<string, Partial<TransactionType>>
>('TransactionTypeMap');
