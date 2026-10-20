import { Routes } from '@angular/router';

export const DEPARTMENT_ROUTES: Routes = [
  {
    path: ':id',
    loadComponent: () =>
      import('././component/department/department.component').then(
        (m) => m.DepartmentComponent,
      ),
  },
];