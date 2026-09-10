import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { EmployeeService } from '../../core/services/employee.service';
import { NotificationService } from '../../core/services/notification.service';
import * as EmployeeActions from './employee.actions';

@Injectable()
export class EmployeeEffects {
  private actions$ = inject(Actions);
  private employeeService = inject(EmployeeService);
  private notificationService = inject(NotificationService);

  loadEmployees$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EmployeeActions.loadEmployees),
      mergeMap(() =>
        this.employeeService.getEmployees().pipe(
          map((employees) => EmployeeActions.loadEmployeesSuccess({ employees })),
          catchError((error) =>
            of(
              EmployeeActions.loadEmployeesFailure({
                error: error.message || 'Unable to load employees. Please try again.'
              })
            )
          )
        )
      )
    )
  );

  loadEmployeeById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EmployeeActions.loadEmployeeById),
      mergeMap(({ id }) =>
        this.employeeService.getEmployeeById(id).pipe(
          map((employee) => EmployeeActions.loadEmployeeByIdSuccess({ employee })),
          catchError((error) => {
            const is404 = error.status === 404 || error?.originalError?.status === 404;
            const message = is404
              ? `No employee found with ID ${id}.`
              : (error.message || `Unable to load employee with ID ${id}.`);
            return of(EmployeeActions.loadEmployeeByIdFailure({ error: message }));
          })
        )
      )
    )
  );

  createEmployee$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EmployeeActions.createEmployee),
      mergeMap(({ employee }) =>
        this.employeeService.createEmployee(employee).pipe(
          map((created) => {
            this.notificationService.success('Employee created successfully.');
            return EmployeeActions.createEmployeeSuccess({ employee: created });
          }),
          catchError((error) => {
            this.notificationService.error(error.message || 'Unable to create employee.');
            return of(
              EmployeeActions.createEmployeeFailure({
                error: error.message || 'Unable to create employee.'
              })
            );
          })
        )
      )
    )
  );

  updateEmployee$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EmployeeActions.updateEmployee),
      mergeMap(({ id, changes }) =>
        this.employeeService.updateEmployee(id, changes).pipe(
          map((updated) => {
            this.notificationService.success('Employee updated successfully.');
            return EmployeeActions.updateEmployeeSuccess({ employee: updated });
          }),
          catchError((error) => {
            this.notificationService.error(error.message || 'Unable to update employee.');
            return of(
              EmployeeActions.updateEmployeeFailure({
                error: error.message || 'Unable to update employee.'
              })
            );
          })
        )
      )
    )
  );

  deleteEmployee$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EmployeeActions.deleteEmployee),
      mergeMap(({ id }) =>
        this.employeeService.deleteEmployee(id).pipe(
          map(() => {
            this.notificationService.success('Employee deleted successfully.');
            return EmployeeActions.deleteEmployeeSuccess({ id });
          }),
          catchError((error) => {
            this.notificationService.error(error.message || 'Unable to delete employee.');
            return of(
              EmployeeActions.deleteEmployeeFailure({
                error: error.message || 'Unable to delete employee.'
              })
            );
          })
        )
      )
    )
  );
}
