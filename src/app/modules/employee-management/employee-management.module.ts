import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { EmployeeManagementRoutingModule } from './employee-management-routing.module';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { employeeFeatureKey, employeeReducer } from './state/employee.reducer';
import { EmployeeEffects } from './state/employee.effects';
import { countryFeatureKey, countryReducer } from './state/country.reducer';
import { CountryEffects } from './state/country.effects';
import { EmployeeFacade } from './state/employee.facade';
import { CountryFacade } from './state/country.facade';

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
    EmployeeManagementRoutingModule,
    StoreModule.forFeature(employeeFeatureKey, employeeReducer),
    StoreModule.forFeature(countryFeatureKey, countryReducer),
    EffectsModule.forFeature([EmployeeEffects, CountryEffects])
  ],
  providers: [EmployeeFacade, CountryFacade]
})
export class EmployeeManagementModule { }
