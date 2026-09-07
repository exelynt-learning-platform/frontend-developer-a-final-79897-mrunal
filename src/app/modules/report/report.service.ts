import { Injectable } from '@angular/core';
import { Observable, forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { IEmployee } from '../../interfaces/employee.interface';
import { IDepartment } from '../../interfaces/department.interface';
import { ILeave } from '../../interfaces/leave.interface';

// Import existing services
import { EmployeeService } from '../employee-management/employee.service';
import { DepartmentService } from '../employee-management/components/department/department.service';
import { LeaveService } from '../employee-management/leave.service';

export interface ReportData {
  employees: IEmployee[];
  departments: IDepartment[];
  leaves: ILeave[];
}

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  constructor(
    private employeeService: EmployeeService,
    private departmentService: DepartmentService,
    private leaveService: LeaveService
  ) {}

  getReportData(): Observable<ReportData> {
    
    // We add catchError(of([])) to each stream so if one mockAPI is down, the others still load
    const employees$ = this.employeeService.getEmployees().pipe(
      catchError(error => {
        console.error('Error fetching employees via EmployeeService:', error);
        return of([] as IEmployee[]);
      })
    );

    const departments$ = this.departmentService.getDepartments().pipe(
      catchError(error => {
        console.error('Error fetching departments via DepartmentService:', error);
        return of([] as IDepartment[]);
      })
    );

    const leaves$ = this.leaveService.getLeaves().pipe(
      catchError(error => {
        console.error('Error fetching leaves via LeaveService:', error);
        return of([] as ILeave[]);
      })
    );

    return forkJoin({
      employees: employees$,
      departments: departments$,
      leaves: leaves$
    });
  }
}
