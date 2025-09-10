import { Dialog } from '@angular/cdk/dialog';
import { inject, Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { forkJoin, Observable, switchMap, tap } from 'rxjs';
import {
  Category,
  CategoryService,
} from '../../../core/services/category/category.service';
import {
  Transaction,
  TransactionSearchFilter,
  TransactionsService,
} from '../../../core/services/transaction.service';
import { TransactionState } from '../model/category.state.model';

@Injectable()
export class TransactionStoreService extends ComponentStore<TransactionState> {
  protected readonly dialog = inject(Dialog);

  protected categoryService = inject(CategoryService);

  protected transactionService = inject(TransactionsService);

  public readonly categoryList$ = this.select((state) => state.categoryList);
  public readonly transactionList$ = this.select(
    (state) => state.transactionList
  );
  public readonly isLoading$ = this.select((state) => state.isLoading);
  constructor() {
    super({ transactionList: [], categoryList: [], isLoading: false });
  }

  readonly setCategoryList = this.updater(
    (state, categoryList: Category[]) => ({
      ...state,
      categoryList,
    })
  );

  readonly setTransactionList = this.updater(
    (state, transactionList: Transaction[]) => ({
      ...state,
      transactionList,
    })
  );
  readonly setIsLoading = this.updater((state, isLoading: boolean) => ({
    ...state,
    isLoading,
  }));

  getTransactionList = this.effect(
    (trigger$: Observable<TransactionSearchFilter | undefined>) => {
      return trigger$.pipe(
        tap(() => this.setIsLoading(true)),
        switchMap((searchParam) => {
          return this.transactionService.getTransactionWithCategory(
            searchParam
          );
        }),
        tap((transactionList) => {
          console.log('get', transactionList);
          this.setTransactionList(transactionList);
          this.setIsLoading(false);
        })
      );
    }
  );

  getCategoryList = this.effect((trigger$) => {
    return trigger$.pipe(
      switchMap(() => this.categoryService.getCategoryWithTransactionType()),
      tap((categoryList) => {
        console.log('get', categoryList);
        this.setCategoryList(categoryList);
      })
    );
  });

  seedTransactions = this.effect((trigger$: Observable<Transaction[]>) => {
    return trigger$.pipe(
      switchMap((catList: Transaction[]) => {
        const a = catList.map((cat) => {
          cat = { ...cat, categoryId: 'U4IfWd4MkizMrJD9Kblb' };
          return this.transactionService.addTransaction(cat);
        });

        return forkJoin(a);
      })
    );
  });
}
