import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { EmployeeService } from '../../employee-management/employee.service';
import { IEmployee } from '../../../interfaces/employee.interface';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  constructor(private employeeService: EmployeeService) {}

  /**
   * Fetch all employees to calculate dashboard analytics
   */
  getAllEmployees(): Observable<IEmployee[]> {
    return this.employeeService.getEmployees().pipe(
      catchError(err => {
        console.error('Failed to load dashboard data', err);
        return of([] as IEmployee[]);
      })
    );
  }
}
