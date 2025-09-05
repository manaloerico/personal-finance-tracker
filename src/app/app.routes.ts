import { Routes } from '@angular/router';
import { canActivateAuth, canActivateUnAuth } from './core/auth/guards/auth.guard';
import { DashboardComponent } from './features/dashboard/dashboard.component';

export const routes: Routes = [
     { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  {
    path: '',
    loadComponent: () =>
      import('./features/authenticated/authenticated.component')
        .then(m => m.AuthenticatedComponent),
    canActivate: [canActivateAuth],
    children: [  { path: 'dashboard', component: DashboardComponent }, 
        { path: '', redirectTo: 'dashboard', pathMatch: 'full' }]
  },
  {
    path: 'auth',
    canActivate: [canActivateUnAuth],
    loadComponent: () =>
      import('./core/auth/pages/login-page/login-page.component')
        .then(m => m.LoginPageComponent),
  },
  { path: '**', redirectTo: '' },
];
