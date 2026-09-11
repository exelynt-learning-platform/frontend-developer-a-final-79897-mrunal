import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'dashboard'
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./features/dashboard/pages/dashboard-page/dashboard-page.component').then(
        (m) => m.DashboardPageComponent
      )
  },
  {
    path: 'employees',
    loadComponent: () =>
      import('./features/employees/pages/employee-page/employee-page.component').then(
        (m) => m.EmployeePageComponent
      )
  },
  {
    path: 'employees/add',
    loadComponent: () =>
      import(
        './features/employees/pages/employee-add-edit-page/employee-add-edit-page.component'
      ).then((m) => m.EmployeeAddEditPageComponent)
  },
  {
    path: 'employees/edit/:id',
    loadComponent: () =>
      import(
        './features/employees/pages/employee-add-edit-page/employee-add-edit-page.component'
      ).then((m) => m.EmployeeAddEditPageComponent)
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];
