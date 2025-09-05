import { Routes } from '@angular/router';
import { canActivateAuth, canActivateUnAuth } from './core/auth/guards/auth.guard';

export const routes: Routes = [
     { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./features/dashboard/dashboard.component')
        .then(m => m.DashboardComponent),
    canActivate: [canActivateAuth],
  },
  {
    path: 'auth',
    canActivate: [canActivateUnAuth],
    loadComponent: () =>
      import('./core/auth/pages/login-page/login-page.component')
        .then(m => m.LoginPageComponent),
  },
  { path: '**', redirectTo: 'dashboard' },
];
