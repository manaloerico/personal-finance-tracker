import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { JsonPipe, NgFor } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Category } from '../../../../core/services/category/category.service';
import { TransactionType } from '../../../../core/services/transaction-type/transaction-type.service';
@Component({
    selector: 'app-category-form',
    imports: [
        NgFor,
        ReactiveFormsModule,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatButtonModule,
        JsonPipe,
    ],
    templateUrl: './category-form.component.html',
    styleUrls: ['./category-form.component.scss']
})
export class CategoryFormComponent implements OnInit {
  protected data: {
    transactionTypeList: TransactionType[];
    action: 'add' | 'update';
    currentData: Category;
  } = inject(DIALOG_DATA);

  dialogRef = inject<DialogRef<unknown>>(DialogRef<unknown>);
  get transactionTypeList() {
    return this.data.transactionTypeList;
  }
  protected fb = inject(FormBuilder);
  protected categoryForm = this.fb.group({
    categoryName: [''],
    transactionTypeId: [''],
  });

  constructor() {
    console.log('');
  }

  ngOnInit() {
    if (this.data.action === 'update' && this.data.currentData) {
      this.categoryForm.patchValue({
        categoryName: this.data.currentData.categoryName,
        transactionTypeId: this.data.currentData.transactionTypeId,
      });
    }
  }

  onSubmit() {
    console.log(this.categoryForm.value);
    this.dialogRef.close({
      action: this.data.action,
      data: this.categoryForm.value,
    });
  }
}
