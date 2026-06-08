import { Routes } from '@angular/router';
import { EmployeeComponent } from './employee/employee.component';
import { EmployeeDetailsComponent } from './employee-details/employee-details.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'employee',
    pathMatch: 'full',
  },
  {
    path: 'employee',
    component: EmployeeComponent,
  },
  {
    path: 'employee/:id',
    component: EmployeeDetailsComponent,
  }
];
