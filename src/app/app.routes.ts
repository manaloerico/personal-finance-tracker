import { Routes } from '@angular/router';
import {
  canActivateAuth,
  canActivateUnAuth,
} from './core/auth/guards/auth.guard';
import { CategoryService } from './core/services/category/category.service';
import { TransactionTypeService } from './core/services/transaction-type/transaction-type.service';
import { TransactionsService } from './core/services/transaction.service';
import { BudgetComponent } from './features/budget/budget.component';
import { CategoryComponent } from './features/category/category.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { TransactionComponent } from './features/transaction/transaction.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  {
    path: '',
    loadComponent: () =>
      import('./features/authenticated/authenticated.component').then(
        (m) => m.AuthenticatedComponent
      ),
    canActivate: [canActivateAuth],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      {
        path: 'transactions',
        component: TransactionComponent,

        providers: [
          CategoryService,
          TransactionsService,
          TransactionTypeService,
        ],
      },
      {
        path: 'categories',
        component: CategoryComponent,
        providers: [CategoryService, TransactionTypeService],
      },
      {
        path: 'budget',
        component: BudgetComponent,
        providers: [CategoryService, TransactionTypeService],
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
  {
    path: 'auth',
    canActivate: [canActivateUnAuth],
    loadComponent: () =>
      import('./core/auth/pages/login-page/login-page.component').then(
        (m) => m.LoginPageComponent
      ),
  },
  { path: '**', redirectTo: '' },
];
