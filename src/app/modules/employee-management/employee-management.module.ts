import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { EmployeeManagementRoutingModule } from './employee-management-routing.module';

// Employee Components
import { EmployeeListComponent } from './components/employees/employees.component';
import { EmployeeDetailComponent } from './components/employee-detail/employee-detail.component';

// Department Components
import { DepartmentListComponent } from './components/department/department.component';
import { DepartmentDetailComponent } from './components/department-detail/department-detail.component';
import { AttendanceComponent } from './components/attendance/attendance.component';
import { AttendanceDetailComponent } from './components/attendance-detail/attendance-detail.component';
import { LeaveManagementComponent } from './components/leave/leave.component';
import { LeaveDetailComponent } from './components/leave-detail/leave-detail.component';
import { PayrollComponent } from './components/payroll/payroll.component';
import { PayrollDetailComponent } from './components/payroll-detail/payroll-detail.component';
import { SettingsComponent } from './components/settings/settings.component';

@NgModule({
  declarations: [
    EmployeeListComponent,
    EmployeeDetailComponent,
    DepartmentListComponent,
    DepartmentDetailComponent,
    AttendanceComponent,
    AttendanceDetailComponent,
    LeaveManagementComponent,
    LeaveDetailComponent,
    PayrollComponent,
    PayrollDetailComponent,
    SettingsComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    EmployeeManagementRoutingModule
  ]
})
export class EmployeeManagementModule { }
