import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import {
  Transaction,
  TransactionsService,
} from '../../core/services/transaction.service';

import { Dialog } from '@angular/cdk/dialog';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { map } from 'rxjs';
import { Category } from '../../core/services/category/category.service';
import { SearchFilterPipe } from '../../shared/pipe/search-filter/search-filter.pipe';
import { TransactionFormComponent } from './components/transaction-form/transaction-form.component';
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
  ],

  styleUrls: ['./transaction.component.scss'],
})
export class TransactionComponent implements OnInit {
  private tx = inject(TransactionsService);
  readonly dialog = inject(Dialog);

  protected fb = inject(FormBuilder);
  protected transactionSearchForm = this.fb.group({
    transactionStartDate: [''],
    transactionEndDate: [''],
    transactionSearchField: [''],
  });

  transactions$ = this.tx.transactions$;
  category$ = this.tx.categories$.pipe(
    map((list) => {
      const map = new Map<string, string>();
      list.forEach((c) => map.set(c.id!, c.categoryName));
      console.log(map);
      return map;
    })
  );
  categoryList: Category[] | undefined = [];

  async ngOnInit() {
    this.tx.getTransactionsWithCategories();
    this.categoryList = await this.tx.categoryList();
  }

  addDemo() {
    this.openDialog('add');
  }
  private openDialog(
    action?: 'add' | 'update',
    currentData?: Transaction
  ): void {
    const dialogRef = this.dialog.open<{
      action: 'add' | 'update';
      data: Transaction;
    }>(TransactionFormComponent, {
      data: { categoryList: this.categoryList, action, currentData },
      width: '400px',
      height: '600px',
      hasBackdrop: true,
      disableClose: false,
      closeOnNavigation: true,
    });

    dialogRef.closed.subscribe((result) => {
      console.log('The dialog was closed', result);
      if (result !== undefined) {
        const { data, action } = result;
        if (action === 'update' && currentData?.id) {
          this.tx.update(currentData.id, {
            ...data,
            categoryId: data.categoryId,
          });
          this.tx.getTransactionsWithCategories();
          return;
        }
        this.tx.add(result.data);
        this.tx.getTransactionsWithCategories();
      }
    });
  }

  deleteTransaction(id?: string) {
    if (id) {
      this.tx.remove(id);
      this.tx.getTransactionsWithCategories();
    }
  }
  updateTransaction(tx: Transaction) {
    this.openDialog('update', tx);
  }
}
