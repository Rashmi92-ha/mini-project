import { Routes } from '@angular/router';
import { EmployeeComponent } from './👨‍💼employee/employee.component';
import { EmployeeDetailsComponent } from './👨‍💼employee/👨‍💼employee-details/employee-details.component';
import { LoginComponent } from './🔐login/login.component';
import { DashboardComponent } from './📊dashboard/dashboard.component';
import { RegisterComponent } from './📝register/register.component';
import { authGuard } from '../app/🛡️auths/auth.guard';
import { LayoutComponent } from './🖥️layout/layout.component';

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
        path: 'employee/:id',
        component: EmployeeDetailsComponent,
      },
    ],
  },
];
