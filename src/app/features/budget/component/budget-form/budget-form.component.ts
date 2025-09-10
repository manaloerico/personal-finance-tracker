import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { NgFor } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Category } from 'src/app/core/services/category/category.service';
import { TransactionType } from 'src/app/core/services/transaction-type/transaction-type.service';

import {
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
  MomentDateAdapter,
} from '@angular/material-moment-adapter';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import {
  MatDatepicker,
  MatDatepickerModule,
} from '@angular/material/datepicker';

import * as _moment from 'moment';
import { Moment } from 'moment';

const moment = _moment;
export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};
@Component({
  selector: 'app-budget-form',
  standalone: true,
  imports: [
    NgFor,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatAutocompleteModule,
    MatDatepickerModule,
  ],
  templateUrl: './budget-form.component.html',
  styleUrls: ['./budget-form.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class BudgetFormComponent implements OnInit {
  options = ['One', 'Two', 'Three'];
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
    date: [moment()],
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

  setMonthAndYear(
    normalizedMonthAndYear: Moment,
    datepicker: MatDatepicker<Moment>
  ) {
    const date = this.categoryForm.controls['date'];
    const ctrlValue = date.value!;
    ctrlValue.month(normalizedMonthAndYear.month());
    ctrlValue.year(normalizedMonthAndYear.year());
    date.setValue(ctrlValue);
    datepicker.close();
  }

  onSubmit() {
    console.log(this.categoryForm.value);
    this.dialogRef.close({
      action: this.data.action,
      data: this.categoryForm.value,
    });
  }
}
