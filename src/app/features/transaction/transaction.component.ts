import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { Transaction, TransactionsService } from '../../core/services/transaction.service';

import {
  MatDialogModule,
} from '@angular/material/dialog';
import { TransactionFormComponent } from './components/transaction-form/transaction-form.component';
import { map } from 'rxjs';
import { Category } from 'src/app/core/services/category/category.service';
import { Dialog } from '@angular/cdk/dialog';
@Component({
  selector: 'app-transaction',standalone: true,
  templateUrl: './transaction.component.html',
  imports: [CommonModule, MatTableModule, MatButtonModule,MatDialogModule],
  styleUrls: ['./transaction.component.scss']
})
export class TransactionComponent implements OnInit {
private tx = inject(TransactionsService);
  readonly dialog = inject(Dialog);
  transactions$ = this.tx.transactions$;
  category$ = this.tx.categories$.pipe(map((list) => {
    const map = new Map<string, string>();
    list.forEach((c) => map.set(c.id!, c.categoryName));
    console.log(map)
    return map;
  }));
  categoryList: Category[] | undefined = [];

async  ngOnInit() {
    this.tx.initRealtime();
    this.categoryList = await this.tx.categoryList(); 
  }

  addDemo() { 
    this.openDialog()
  } 
  openDialog(): void {
    const dialogRef = this.dialog.open<Transaction>(TransactionFormComponent, { 
     data: {categoryList:this.categoryList},
     width: '400px',
     height: '600px',
     hasBackdrop: true,
     disableClose: false,
     closeOnNavigation: true
    });

    dialogRef.closed.subscribe(result => {
        console.log('The dialog was closed',result);
      if (result !== undefined) {
       console.log(result)
       this.tx.add(result);
      }
    });
  }
}
