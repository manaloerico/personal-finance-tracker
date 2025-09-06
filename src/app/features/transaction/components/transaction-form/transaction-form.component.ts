import { NgFor } from '@angular/common';
import {
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { Category } from '../../../../core/services/category/category.service';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
@Component({
  selector: 'app-transaction-form',
  standalone: true,
  imports: [ NgFor,
    ReactiveFormsModule,
    FormsModule, 
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    
  ],
  templateUrl: './transaction-form.component.html',
  styleUrls: ['./transaction-form.component.scss'],
})
export class TransactionFormComponent implements OnInit {
  protected data: { categoryList: Category[] } = inject(DIALOG_DATA); 

    dialogRef = inject<DialogRef<unknown>>(DialogRef<unknown>); 
  get categoryList() {
    return this.data.categoryList;
  } 
  protected fb = inject(FormBuilder);
  protected transactionForm = this.fb.group({
    name: [''],
    amount: [0],
    type: ['expense'],
    categoryId: [''],
    date: [new Date().toISOString().substring(0, 10)],
    note: [''],
  });

  constructor() {
    console.log('');
  }

  ngOnInit() {
    console.log();
  }

  onSubmit() {
    console.log(this.transactionForm.value); 
    this.dialogRef.close(this.transactionForm.value);
  }
}
