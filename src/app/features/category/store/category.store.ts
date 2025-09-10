import { Dialog } from '@angular/cdk/dialog';
import { inject, Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { combineLatest, forkJoin, map, Observable, switchMap, tap } from 'rxjs';
import {
  Category,
  CategoryService,
} from '../../../core/services/category/category.service';
import {
  TransactionType,
  TransactionTypeService,
} from '../../../core/services/transaction-type/transaction-type.service';
import { CategoryFormComponent } from '../component/category-form/category-form.component';
import { CategoryState, GroupedCategory } from '../model/category.state.model';

@Injectable()
export class CategoryStoreService extends ComponentStore<CategoryState> {
  protected readonly dialog = inject(Dialog);

  protected categoryService = inject(CategoryService);

  protected transactionTypeService = inject(TransactionTypeService);

  public readonly categoryList$ = this.select((state) => state.categoryList);
  public readonly transactionTypeList$ = this.select(
    (state) => state.transactionTypeList
  );
  // .pipe(switchMap((list)=>{
  // const map = new Map<string, string>();
  //   list.forEach((c) => map.set(c.id!, c.name));
  //   return map;
  // }));
  constructor() {
    super({ categoryList: [], transactionTypeList: [], groupedCategory: {} });
  }

  readonly setCategoryList = this.updater(
    (state, categoryList: Category[]) => ({
      ...state,
      categoryList,
    })
  );

  readonly setTransactionTypeList = this.updater(
    (state, transactionTypeList: TransactionType[]) => ({
      ...state,
      transactionTypeList,
    })
  );

  readonly setGroupTransactionTypeList = this.updater(
    (state, groupTransactionTypeList: Record<string, GroupedCategory>) => ({
      ...state,
      groupedCategory: groupTransactionTypeList,
    })
  );

  getTransactionTypeList = this.effect((trigger$) => {
    return trigger$.pipe(
      switchMap(() => {
        return this.transactionTypeService.getTransactionTypeList();
      }),
      tap((transactionTypeList) => {
        this.setTransactionTypeList(transactionTypeList);
      })
    );
  });

  getCategoryList = this.effect((trigger$) => {
    return trigger$.pipe(
      switchMap(() => this.categoryService.getCategoryWithTransactionType()),
      tap((categoryList) => {
        console.log('get', categoryList);
        this.setCategoryList(categoryList);
      })
    );
  });

  deleteCategory = this.effect((id$: Observable<string>) => {
    return id$.pipe(
      map((id) => {
        return this.categoryService.deleteCategory(id);
      }),
      tap(() => {
        this.getCategoryList();
      })
    );
  });

  addCategory = this.effect(
    (category$: Observable<Omit<Category, 'id' | 'userId' | 'createdAt'>>) => {
      return category$.pipe(
        map((category) => {
          return this.categoryService.addCategory(category);
        }),
        tap(() => {
          this.getCategoryList();
        })
      );
    }
  );

  openDialog = this.effect(
    (
      trigger$: Observable<{
        action?: 'add' | 'update';
        currentData?: Category;
      }>
    ) => {
      return combineLatest([trigger$, this.transactionTypeList$]).pipe(
        tap(([trigger, transactionTypeList]) => {
          console.log('Open dialog from store', trigger, transactionTypeList);
        }),
        switchMap(([trigger, transactionTypeList]) => {
          const dialogRef = this.dialog.open<{
            action: 'add' | 'update';
            data: Category;
          }>(CategoryFormComponent, {
            data: {
              transactionTypeList,
              action: trigger.action,
              currentData: trigger.currentData,
            },
            width: '400px',
            height: '600px',
            hasBackdrop: true,
            disableClose: false,
            closeOnNavigation: true,
          });

          return dialogRef.closed.pipe(
            tap((result) => {
              console.log('The dialog was closed', result);
              if (result !== undefined) {
                const { data, action } = result;
                if (action === 'update' && trigger.currentData?.id) {
                  this.categoryService.updateCategory(trigger.currentData?.id, {
                    ...data,
                    transactionTypeId: data.transactionTypeId,
                  });
                  this.getCategoryList();
                  return;
                }
                this.addCategory(data);
              }
            })
          );
        })
      );
    }
  );

  seedCategories = this.effect((trigger$: Observable<Category[]>) => {
    return trigger$.pipe(
      switchMap((catList: Category[]) => {
        const a = catList.map((cat) => {
          cat = { ...cat, transactionTypeId: 'U4IfWd4MkizMrJD9Kblb' };
          return this.addCategory(cat);
        });

        return forkJoin(a);
      })
    );
  });
  seedTransactionType = this.effect(
    (trigger$: Observable<TransactionType[]>) => {
      return trigger$.pipe(
        switchMap((catList: TransactionType[]) => {
          const a = catList.map((cat) => {
            return this.transactionTypeService.addTransactionType(cat);
          });

          return forkJoin(a);
        })
      );
    }
  );
}
