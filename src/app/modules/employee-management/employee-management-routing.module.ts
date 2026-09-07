import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Employee Components
import { EmployeeListComponent } from './components/employees/employees.component';
import { EmployeeDetailComponent } from './components/employee-detail/employee-detail.component';

// Department Components
import { DepartmentListComponent } from './components/department/department.component';
import { DepartmentDetailComponent } from './components/department-detail/department-detail.component';

// Other Components
import { AttendanceComponent } from './components/attendance/attendance.component';
import { AttendanceDetailComponent } from './components/attendance-detail/attendance-detail.component';
import { LeaveManagementComponent } from './components/leave/leave.component';
import { LeaveDetailComponent } from './components/leave-detail/leave-detail.component';
import { PayrollComponent } from './components/payroll/payroll.component';
import { PayrollDetailComponent } from './components/payroll-detail/payroll-detail.component';
import { SettingsComponent } from './components/settings/settings.component';

const routes: Routes = [
  { path: 'employees', component: EmployeeListComponent },
  { path: 'employees/add', component: EmployeeDetailComponent },
  { path: 'employees/edit/:id', component: EmployeeDetailComponent },
  { path: 'employees/view/:id', component: EmployeeDetailComponent },

  { path: 'departments', component: DepartmentListComponent },
  { path: 'departments/add', component: DepartmentDetailComponent },
  { path: 'departments/edit/:id', component: DepartmentDetailComponent },
  { path: 'departments/view/:id', component: DepartmentDetailComponent },

  { path: 'attendance', component: AttendanceComponent },
  { path: 'attendance/add', component: AttendanceDetailComponent },
  { path: 'attendance/edit/:id', component: AttendanceDetailComponent },
  { path: 'attendance/view/:id', component: AttendanceDetailComponent },
  { path: 'leave', component: LeaveManagementComponent },
  { path: 'leave/add', component: LeaveDetailComponent },
  { path: 'leave/edit/:id', component: LeaveDetailComponent },
  { path: 'leave/view/:id', component: LeaveDetailComponent },
  { path: 'payroll', component: PayrollComponent },
  { path: 'payroll/add', component: PayrollDetailComponent },
  { path: 'payroll/edit/:id', component: PayrollDetailComponent },
  { path: 'payroll/view/:id', component: PayrollDetailComponent },
  { path: 'settings', component: SettingsComponent },

  { path: '', redirectTo: 'employees', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeeManagementRoutingModule { }
