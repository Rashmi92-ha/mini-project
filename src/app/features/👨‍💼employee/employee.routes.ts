import { Routes } from '@angular/router';

export const EMPLOYEE_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./employee.component').then((m) => m.EmployeeComponent),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./👨‍💼employee-details/employee-details.component').then(
        (m) => m.EmployeeDetailsComponent,
      ),
  },
];
