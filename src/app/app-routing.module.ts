import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

import { LayoutComponent } from './shared/components/layout/layout.component';

const routes: Routes = [
  // Redirect root to login
  { path: '', redirectTo: '/login', pathMatch: 'full' },

  // Auth Module (Lazy Loaded)
  {
    path: 'login',
    loadChildren: () => import('./modules/auth/auth.module').then(m => m.AuthModule)
  },

  // Main App Shell
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'home',
        loadChildren: () => import('./modules/home/home.module').then(m => m.HomeModule)
      },
      {
        path: 'employee-management',
        loadChildren: () => import('./modules/employee-management/employee-management.module').then(m => m.EmployeeManagementModule)
      },
      {
        path: 'profile',
        loadChildren: () => import('./modules/profile/profile.module').then(m => m.ProfileModule)
      },
      {
        path: 'report',
        loadChildren: () => import('./modules/report/report.module').then(m => m.ReportModule)
      },
      { path: '', redirectTo: 'home', pathMatch: 'full' }
    ]
  },

  // Wildcard Route - Must be last
  { path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    enableTracing: false, // Set to true for debugging
    useHash: false,
    scrollPositionRestoration: 'top',
    initialNavigation: 'enabledBlocking'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
