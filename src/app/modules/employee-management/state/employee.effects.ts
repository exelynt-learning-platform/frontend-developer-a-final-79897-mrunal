import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, exhaustMap, mergeMap, of } from 'rxjs';
import { EmployeeService } from '../employee.service';
import * as EmployeeActions from './employee.actions';

@Injectable()
export class EmployeeEffects {
  loadEmployees$ = createEffect(() => this.actions$.pipe(
    ofType(EmployeeActions.loadEmployees),
    exhaustMap(() => this.employeeService.getEmployees().pipe(
      map((employees) => EmployeeActions.loadEmployeesSuccess({ employees })),
      catchError((error: Error) => of(EmployeeActions.loadEmployeesFailure({ error: error.message || 'Failed to load employees' })))
    ))
  ));

  createEmployee$ = createEffect(() => this.actions$.pipe(
    ofType(EmployeeActions.createEmployee),
    exhaustMap(({ employee }) => this.employeeService.createEmployee(employee).pipe(
      map((createdEmployee) => EmployeeActions.createEmployeeSuccess({ employee: createdEmployee })),
      catchError((error: Error) => of(EmployeeActions.createEmployeeFailure({ error: error.message || 'Failed to create employee' })))
    ))
  ));

  updateEmployee$ = createEffect(() => this.actions$.pipe(
    ofType(EmployeeActions.updateEmployee),
    exhaustMap(({ id, employee }) => this.employeeService.updateEmployee(id, employee).pipe(
      map((updatedEmployee) => EmployeeActions.updateEmployeeSuccess({ employee: updatedEmployee })),
      catchError((error: Error) => of(EmployeeActions.updateEmployeeFailure({ error: error.message || 'Failed to update employee' })))
    ))
  ));

  deleteEmployee$ = createEffect(() => this.actions$.pipe(
    ofType(EmployeeActions.deleteEmployee),
    mergeMap(({ id }) => this.employeeService.deleteEmployee(id).pipe(
      map(() => EmployeeActions.deleteEmployeeSuccess({ id })),
      catchError((error: Error) => of(EmployeeActions.deleteEmployeeFailure({ error: error.message || 'Failed to delete employee' })))
    ))
  ));

  constructor(private actions$: Actions, private employeeService: EmployeeService) {}
}
