import { createAction, props } from '@ngrx/store';
import { IEmployee } from '../../../interfaces/employee.interface';

export const loadEmployees = createAction('[Employees] Load Employees');
export const loadEmployeesSuccess = createAction(
  '[Employees API] Load Employees Success',
  props<{ employees: IEmployee[] }>()
);
export const loadEmployeesFailure = createAction(
  '[Employees API] Load Employees Failure',
  props<{ error: string }>()
);
export const createEmployee = createAction(
  '[Employees] Create Employee',
  props<{ employee: IEmployee }>()
);
export const createEmployeeSuccess = createAction(
  '[Employees API] Create Employee Success',
  props<{ employee: IEmployee }>()
);
export const createEmployeeFailure = createAction(
  '[Employees API] Create Employee Failure',
  props<{ error: string }>()
);
export const updateEmployee = createAction(
  '[Employees] Update Employee',
  props<{ id: string; employee: IEmployee }>()
);
export const updateEmployeeSuccess = createAction(
  '[Employees API] Update Employee Success',
  props<{ employee: IEmployee }>()
);
export const updateEmployeeFailure = createAction(
  '[Employees API] Update Employee Failure',
  props<{ error: string }>()
);
export const deleteEmployee = createAction(
  '[Employees] Delete Employee',
  props<{ id: string }>()
);
export const deleteEmployeeSuccess = createAction(
  '[Employees API] Delete Employee Success',
  props<{ id: string }>()
);
export const deleteEmployeeFailure = createAction(
  '[Employees API] Delete Employee Failure',
  props<{ error: string }>()
);
export const syncEmployee = createAction(
  '[Employees] Sync Employee',
  props<{ employee: IEmployee }>()
);
