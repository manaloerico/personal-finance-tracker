import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import {
  MatDatepicker,
  MatDatepickerModule,
} from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { SearchFilterPipe } from '../../shared/pipe/search-filter/search-filter.pipe';
import { BudgetStoreService } from './store/budget.store';

import {
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
  MomentDateAdapter,
} from '@angular/material-moment-adapter';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';

import * as _moment from 'moment';

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
    selector: 'app-budget',
    templateUrl: './budget.component.html',
    styleUrls: ['./budget.component.scss'],
    imports: [
        CommonModule,
        MatDialogModule,
        MatButtonModule,
        MatCardModule,
        MatTableModule,
        MatFormFieldModule,
        MatInputModule,
        FormsModule,
        ReactiveFormsModule,
        MatDatepickerModule,
        SearchFilterPipe,
    ],
    providers: [
        BudgetStoreService,
        {
            provide: DateAdapter,
            useClass: MomentDateAdapter,
            deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
        },
        { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    ]
})
export class BudgetComponent implements OnInit {
  protected fb = inject(FormBuilder);
  protected budgetSearchForm = this.fb.group({
    budgetSearchField: [''],
    month: moment().month() + 1,
    year: moment().year(),
  });

  ngOnInit(): void {
    // this.seedBudget();
    this.getBudgetList();
  }

  getBudgetList() {
    this.budgetStoreService.getBudgetList(
      this.budgetSearchForm.value as Partial<{ month: number; year: number }>
    );
  }
  protected readonly budgetStoreService = inject(BudgetStoreService);
  budgetList$ = this.budgetStoreService.budgetList$;
  showBudgetForm(): void {
    this.budgetStoreService.showBudgetForm({ action: 'add' });
  }

  addbudget() {
    throw new Error('Method not implemented.');
  }
  deleteBudget(arg0: any) {
    throw new Error('Method not implemented.');
  }
  updateEdit(_t62: any) {
    throw new Error('Method not implemented.');
  }

  setMonthAndYear(
    normalizedMonthAndYear: _moment.Moment,
    datepicker: MatDatepicker<_moment.Moment>
  ) {
    const ctrl = this.budgetSearchForm.controls;
    ctrl.month.setValue(normalizedMonthAndYear.month() + 1);
    ctrl.year.setValue(normalizedMonthAndYear.year());

    datepicker.close();
  }

  private seedBudget() {
    const sampleBudgets = [
      {
        categoryId: 'UIi03FCOzYcN8WUR7mVt', // replace with actual Firestore doc id
        amount: 300,
        month: 9,
        year: 2025,
      },
      {
        categoryId: 'hvme6qeXsj6Du0yKoEtM',
        amount: 150,
        month: 9,
        year: 2025,
      },
      {
        categoryId: 'qpGHSz1u74iHTncHJOcL',
        amount: 200,
        month: 9,
        year: 2025,
      },
    ];
    // this.budgetStoreService.seedBudget(sampleBudgets);
  }
}
