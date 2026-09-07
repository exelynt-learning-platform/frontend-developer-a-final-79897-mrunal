import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { IEmployee } from '../../../interfaces/employee.interface';
import * as EmployeeActions from './employee.actions';

export const employeeFeatureKey = 'employees';

export interface EmployeeState extends EntityState<IEmployee> {
  loading: boolean;
  saving: boolean;
  error: string | null;
}

export const employeeAdapter = createEntityAdapter<IEmployee>({
  selectId: (employee) => employee.id ?? ''
});

export const initialState: EmployeeState = employeeAdapter.getInitialState({
  loading: false,
  saving: false,
  error: null
});

export const employeeReducer = createReducer(
  initialState,
  on(EmployeeActions.loadEmployees, (state) => ({ ...state, loading: true, error: null })),
  on(EmployeeActions.loadEmployeesSuccess, (state, { employees }) =>
    employeeAdapter.setAll(employees, { ...state, loading: false })
  ),
  on(EmployeeActions.loadEmployeesFailure, (state, { error }) => ({ ...state, loading: false, error })),
  on(EmployeeActions.createEmployee, EmployeeActions.updateEmployee, (state) => ({ ...state, saving: true, error: null })),
  on(EmployeeActions.createEmployeeSuccess, (state, { employee }) =>
    employeeAdapter.addOne(employee, { ...state, saving: false })
  ),
  on(EmployeeActions.updateEmployeeSuccess, (state, { employee }) =>
    employeeAdapter.upsertOne(employee, { ...state, saving: false })
  ),
  on(EmployeeActions.deleteEmployee, (state) => ({ ...state, saving: true, error: null })),
  on(EmployeeActions.deleteEmployeeSuccess, (state, { id }) =>
    employeeAdapter.removeOne(id, { ...state, saving: false })
  ),
  on(EmployeeActions.syncEmployee, (state, { employee }) =>
    employeeAdapter.upsertOne(employee, state)
  ),
  on(EmployeeActions.createEmployeeFailure, EmployeeActions.updateEmployeeFailure, EmployeeActions.deleteEmployeeFailure,
    (state, { error }) => ({ ...state, saving: false, error }))
);
