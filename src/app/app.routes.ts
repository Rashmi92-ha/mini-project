import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';
import { LayoutComponent } from './core/🖥️layout/layout.component';
import { APP_ROUTES } from './shared/constants/routes.constants';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login-page',
    pathMatch: 'full',
  },
  {
    path: APP_ROUTES.LOGIN,
    loadComponent: () =>
      import('./features/authentication/🔐login/login.component').then(
        (m) => m.LoginComponent,
      ),
  },
  {
    path: APP_ROUTES.REGISTER,
    loadComponent: () =>
      import('./features/authentication/📝register/register.component').then(
        (m) => m.RegisterComponent,
      ),
  },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: APP_ROUTES.DASHBOARD,
        loadComponent: () =>
          import('./features/📊dashboard/dashboard.component').then(
            (m) => m.DashboardComponent,
          ),
      },

      {
        path: APP_ROUTES.EMPLOYEES,
        loadChildren: () =>
          import('./features/👨‍💼employee/employee.routes').then(
            (m) => m.EMPLOYEE_ROUTES,
          ),
      },
      {
        path: APP_ROUTES.USERS,
        loadComponent: () =>
          import('./features/👥user/user/user.component').then(
            (m) => m.UserComponent,
          ),
        canActivate: [adminGuard],
      },
    ],
  },
];
