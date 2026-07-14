import { Routes } from '@angular/router';
import { EmployeeComponent } from './features/👨‍💼employee/employee.component';
import { EmployeeDetailsComponent } from './features/👨‍💼employee/👨‍💼employee-details/employee-details.component';
import { LoginComponent } from './features/authentication/🔐login/login.component';
import { DashboardComponent } from './features/📊dashboard/dashboard.component';
import { RegisterComponent } from './features/authentication/📝register/register.component';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';
import { LayoutComponent } from './core/🖥️layout/layout.component';
import { UserComponent } from './features/👥user/user/user.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login-page',
    pathMatch: 'full',
  },
  {
    path: 'login-page',
    component: LoginComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
      },

      {
        path: 'employee',
        component: EmployeeComponent,
      },
      {
        path: 'users',
        component: UserComponent,
        canActivate: [adminGuard],
      },
      {
        path: 'employee/:id',
        component: EmployeeDetailsComponent,
      },
    ],
  },
];
