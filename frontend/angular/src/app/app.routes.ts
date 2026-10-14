import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { AuthComponent } from './pages/auth/auth.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';

export const routes: Routes = [
  {
    path: 'login',
    component: AuthComponent,
    data: { mode: 'login' }
  },
  {
    path: 'register',
    component: AuthComponent,
    data: { mode: 'register' }
  },
  {
    path: '',
    component: DashboardComponent,
    canActivate: [authGuard]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
