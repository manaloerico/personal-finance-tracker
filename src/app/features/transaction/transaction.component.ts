import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';

import { Dialog } from '@angular/cdk/dialog';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Category } from '../../core/services/category/category.service';
import {
  Transaction,
  TransactionSearchFilter,
} from '../../core/services/transaction.service';
import { LoaderComponent } from '../../shared/components/loader/loader.component';
import { SearchFilterPipe } from '../../shared/pipe/search-filter/search-filter.pipe';
import { TransactionStoreService } from './store/transaction.store';
@Component({
  selector: 'app-transaction',
  standalone: true,
  templateUrl: './transaction.component.html',
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    SearchFilterPipe,
    MatProgressSpinnerModule,
    LoaderComponent,
  ],

  styleUrls: ['./transaction.component.scss'],
  providers: [TransactionStoreService],
})
export class TransactionComponent implements OnInit {
  private transactionStoreService = inject(TransactionStoreService);
  readonly dialog = inject(Dialog);

  protected fb = inject(FormBuilder);
  protected transactionSearchForm = this.fb.group({
    startDate: [''],
    endDate: [''],
    transactionSearchField: [''],
  });

  transactions$ = this.transactionStoreService.transactionList$;
  isLoading$ = this.transactionStoreService.isLoading$;
  // category$ = this.tx.categories$.pipe(
  //   map((list) => {
  //     const map = new Map<string, string>();
  //     list.forEach((c) => map.set(c.id!, c.categoryName));
  //     console.log(map);
  //     return map;
  //   })
  // );
  categoryList: Category[] | undefined = [];

  ngOnInit() {
    // this.seedTransactions();
    this.transactionStoreService.getTransactionList(undefined);
  }

  searchTransactionList(): void {
    this.transactionStoreService.getTransactionList(
      this.transactionSearchForm.value as Partial<TransactionSearchFilter>
    );
  }

  addDemo() {
    //   this.openDialog('add');
  }
  // private openDialog(
  //   action?: 'add' | 'update',
  //   currentData?: Transaction
  // ): void {
  //   const dialogRef = this.dialog.open<{
  //     action: 'add' | 'update';
  //     data: Transaction;
  //   }>(TransactionFormComponent, {
  //     data: { categoryList: this.categoryList, action, currentData },
  //     width: '400px',
  //     height: '600px',
  //     hasBackdrop: true,
  //     disableClose: false,
  //     closeOnNavigation: true,
  //   });

  //   dialogRef.closed.subscribe((result) => {
  //     console.log('The dialog was closed', result);
  //     if (result !== undefined) {
  //       const { data, action } = result;
  //       if (action === 'update' && currentData?.id) {
  //         this.tx.update(currentData.id, {
  //           ...data,
  //           categoryId: data.categoryId,
  //         });
  //         this.tx.getTransactionsWithCategories();
  //         return;
  //       }
  //       this.tx.add(result.data);
  //       this.tx.getTransactionsWithCategories();
  //     }
  //   });
  // }

  deleteTransaction(id?: string) {
    if (id) {
      //     this.tx.remove(id);
      //     this.tx.getTransactionsWithCategories();
    }
  }
  updateTransaction(tx: Transaction) {
    console.log('Update', tx);
    //   this.openDialog('update', tx);
  }

  private seedTransactions() {
    const sampleTransactions = [
      {
        amount: 2500,
        transactionTypeId: 'income',
        category: 'Salary / Wages',
        subcategory: null,
        note: 'Monthly salary',
        date: '2025-09-01T09:00:00Z',
      },
      {
        amount: 120,
        transactionTypeId: 'expense',
        category: 'Food & Dining',
        subcategory: 'Restaurants',
        note: 'Dinner with family',
        date: '2025-09-03T19:30:00Z',
      },
      {
        amount: 60,
        transactionTypeId: 'expense',
        category: 'Transportation',
        subcategory: 'Fuel / Gas',
        note: 'Car refuel',
        date: '2025-09-05T08:00:00Z',
      },
      {
        amount: 300,
        transactionTypeId: 'savings',
        category: 'Savings & Investments',
        subcategory: 'Retirement',
        note: '401k contribution',
        date: '2025-09-07T12:00:00Z',
      },
      {
        amount: 100,
        transactionTypeId: 'giving',
        category: 'Giving & Donations',
        subcategory: 'Charity',
        note: 'Donation to local NGO',
        date: '2025-09-08T14:00:00Z',
      },
      {
        amount: 400,
        transactionTypeId: 'debt',
        category: 'Debt & Loans',
        subcategory: 'Credit Card Payments',
        note: 'Visa bill payment',
        date: '2025-09-09T16:00:00Z',
      },
    ];

    this.transactionStoreService.seedTransactions(sampleTransactions);
  }
}
