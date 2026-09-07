import { createAction, props } from '@ngrx/store';
import { Employee, EmployeeFormData } from '../../core/models/employee.model';

export const loadEmployees = createAction('[Employee] Load Employees');
export const loadEmployeesSuccess = createAction(
  '[Employee] Load Employees Success',
  props<{ employees: Employee[] }>()
);
export const loadEmployeesFailure = createAction(
  '[Employee] Load Employees Failure',
  props<{ error: string }>()
);

export const loadEmployeeById = createAction(
  '[Employee] Load Employee By ID',
  props<{ id: string }>()
);
export const loadEmployeeByIdSuccess = createAction(
  '[Employee] Load Employee By ID Success',
  props<{ employee: Employee }>()
);
export const loadEmployeeByIdFailure = createAction(
  '[Employee] Load Employee By ID Failure',
  props<{ error: string }>()
);

export const clearEmployeeSearch = createAction('[Employee] Clear Search');

export const selectEmployee = createAction(
  '[Employee] Select Employee',
  props<{ id: string | null }>()
);

export const createEmployee = createAction(
  '[Employee] Create Employee',
  props<{ employee: EmployeeFormData }>()
);
export const createEmployeeSuccess = createAction(
  '[Employee] Create Employee Success',
  props<{ employee: Employee }>()
);
export const createEmployeeFailure = createAction(
  '[Employee] Create Employee Failure',
  props<{ error: string }>()
);

export const updateEmployee = createAction(
  '[Employee] Update Employee',
  props<{ id: string; changes: Partial<EmployeeFormData> }>()
);
export const updateEmployeeSuccess = createAction(
  '[Employee] Update Employee Success',
  props<{ employee: Employee }>()
);
export const updateEmployeeFailure = createAction(
  '[Employee] Update Employee Failure',
  props<{ error: string }>()
);

export const deleteEmployee = createAction(
  '[Employee] Delete Employee',
  props<{ id: string }>()
);
export const deleteEmployeeSuccess = createAction(
  '[Employee] Delete Employee Success',
  props<{ id: string }>()
);
export const deleteEmployeeFailure = createAction(
  '[Employee] Delete Employee Failure',
  props<{ error: string }>()
);
