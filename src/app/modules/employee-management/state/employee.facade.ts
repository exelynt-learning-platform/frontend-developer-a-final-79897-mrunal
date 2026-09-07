import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Actions, ofType } from '@ngrx/effects';
import { IEmployee } from '../../../interfaces/employee.interface';
import * as EmployeeActions from './employee.actions';
import * as EmployeeSelectors from './employee.selectors';

@Injectable()
export class EmployeeFacade {
  readonly employees$: Observable<IEmployee[]> = this.store.select(EmployeeSelectors.selectAllEmployees);
  readonly loading$: Observable<boolean> = this.store.select(EmployeeSelectors.selectEmployeesLoading);
  readonly saving$: Observable<boolean> = this.store.select(EmployeeSelectors.selectEmployeesSaving);
  readonly error$: Observable<string | null> = this.store.select(EmployeeSelectors.selectEmployeesError);
  readonly deleteSuccess$ = this.actions$.pipe(ofType(EmployeeActions.deleteEmployeeSuccess));
  readonly deleteFailure$ = this.actions$.pipe(ofType(EmployeeActions.deleteEmployeeFailure));

  constructor(private store: Store, private actions$: Actions) {}

  loadEmployees(): void {
    this.store.dispatch(EmployeeActions.loadEmployees());
  }

  createEmployee(employee: IEmployee): void {
    this.store.dispatch(EmployeeActions.createEmployee({ employee }));
  }

  updateEmployee(id: string, employee: IEmployee): void {
    this.store.dispatch(EmployeeActions.updateEmployee({ id, employee }));
  }

  syncEmployee(employee: IEmployee): void {
    this.store.dispatch(EmployeeActions.syncEmployee({ employee }));
  }

  deleteEmployee(id: string): void {
    this.store.dispatch(EmployeeActions.deleteEmployee({ id }));
  }
}
