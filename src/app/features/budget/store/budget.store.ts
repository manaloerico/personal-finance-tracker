import { Dialog } from '@angular/cdk/dialog';
import { inject, Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { combineLatest, forkJoin, Observable, switchMap, tap } from 'rxjs';
import {
  Budget,
  BudgetService,
} from '../../../core/services/budgets/budget.service';
import { Category } from '../../../core/services/category/category.service';
import { BudgetFormComponent } from '../component/budget-form/budget-form.component';
import { BudgetState } from '../models/budget.state';

@Injectable()
export class BudgetStoreService extends ComponentStore<BudgetState> {
  protected budgetService = inject(BudgetService);
  protected readonly dialog = inject(Dialog);

  public readonly budgetList$ = this.select((state) => state.budgetList);

  constructor() {
    super({
      budgetList: [],
      isListLoading: false,
    });
  }

  readonly setBudgetList = this.updater((state, budgetList: Budget[]) => ({
    ...state,
    budgetList,
  }));

  getBudgetList = this.effect(
    (
      trigger$: Observable<
        Partial<{
          year: number;
          month: number;
        }>
      >
    ) => {
      return trigger$.pipe(
        switchMap((trigger) =>
          this.budgetService.getBudgetList(
            trigger as unknown as {
              year: number;
              month: number;
            }
          )
        ),
        tap((budgetList) => {
          console.log('get', budgetList);
          this.setBudgetList(budgetList);
        })
      );
    }
  );

  showBudgetForm = this.effect(
    (
      trigger$: Observable<{
        action?: 'add' | 'update';
        currentData?: any;
      }>
    ) => {
      return combineLatest([trigger$]).pipe(
        tap(([trigger]) => {
          console.log('Open dialog from store', trigger);
        }),
        switchMap(([trigger]) => {
          const dialogRef = this.dialog.open<{
            action: 'add' | 'update';
            data: Category;
          }>(BudgetFormComponent, {
            data: {
              action: trigger.action,
              currentData: trigger.currentData,
            },
            width: '400px',
            height: '600px',
            hasBackdrop: true,
            disableClose: false,
            closeOnNavigation: true,
            panelClass: 'finance-dialog-container',
          });

          return dialogRef.closed.pipe(
            tap((result) => {
              console.log('The dialog was closed', result);
              if (result !== undefined) {
                const { data, action } = result;
                if (action === 'update' && trigger.currentData?.id) {
                  // this.categoryService.updateCategory(trigger.currentData?.id, {
                  //   ...data,
                  //   transactionTypeId: data.transactionTypeId,
                  // });
                  // this.getCategoryList();
                  return;
                }
                // this.addCategory(data);
              }
            })
          );
        })
      );
    }
  );

  seedBudget = this.effect((trigger$: Observable<Budget[]>) => {
    return trigger$.pipe(
      switchMap((catList: Budget[]) => {
        const a = catList.map((cat) => {
          cat = { ...cat };
          return this.budgetService.addbudget(cat);
        });

        return forkJoin(a);
      })
    );
  });
}
