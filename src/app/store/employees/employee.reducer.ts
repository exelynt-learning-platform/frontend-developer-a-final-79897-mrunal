import { createReducer, on } from '@ngrx/store';
import { employeeAdapter, initialEmployeeState } from './employee.models';
import * as EmployeeActions from './employee.actions';

export const employeeReducer = createReducer(
  initialEmployeeState,

  on(EmployeeActions.loadEmployees, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(EmployeeActions.loadEmployeesSuccess, (state, { employees }) =>
    employeeAdapter.setAll(employees, {
      ...state,
      loading: false,
      error: null
    })
  ),
  on(EmployeeActions.loadEmployeesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  on(EmployeeActions.loadEmployeeById, (state) => ({
    ...state,
    searchLoading: true,
    searchError: null,
    searchedEmployee: null
  })),
  on(EmployeeActions.loadEmployeeByIdSuccess, (state, { employee }) =>
    employeeAdapter.upsertOne(employee, {
      ...state,
      searchLoading: false,
      searchError: null,
      searchedEmployee: employee
    })
  ),
  on(EmployeeActions.loadEmployeeByIdFailure, (state, { error }) => ({
    ...state,
    searchLoading: false,
    searchError: error,
    searchedEmployee: null
  })),
  on(EmployeeActions.clearEmployeeSearch, (state) => ({
    ...state,
    searchedEmployee: null,
    searchLoading: false,
    searchError: null
  })),

  on(EmployeeActions.selectEmployee, (state, { id }) => ({
    ...state,
    selectedEmployeeId: id
  })),

  on(EmployeeActions.createEmployee, (state) => ({
    ...state,
    actionInProgress: true,
    actionError: null
  })),
  on(EmployeeActions.createEmployeeSuccess, (state, { employee }) =>
    employeeAdapter.addOne(employee, {
      ...state,
      actionInProgress: false,
      actionError: null
    })
  ),
  on(EmployeeActions.createEmployeeFailure, (state, { error }) => ({
    ...state,
    actionInProgress: false,
    actionError: error
  })),

  on(EmployeeActions.updateEmployee, (state) => ({
    ...state,
    actionInProgress: true,
    actionError: null
  })),
  on(EmployeeActions.updateEmployeeSuccess, (state, { employee }) =>
    employeeAdapter.updateOne(
      { id: employee.id, changes: employee },
      {
        ...state,
        actionInProgress: false,
        actionError: null,
        searchedEmployee: state.searchedEmployee?.id === employee.id ? employee : state.searchedEmployee
      }
    )
  ),
  on(EmployeeActions.updateEmployeeFailure, (state, { error }) => ({
    ...state,
    actionInProgress: false,
    actionError: error
  })),

  on(EmployeeActions.deleteEmployee, (state) => ({
    ...state,
    actionInProgress: true,
    actionError: null
  })),
  on(EmployeeActions.deleteEmployeeSuccess, (state, { id }) =>
    employeeAdapter.removeOne(id, {
      ...state,
      actionInProgress: false,
      actionError: null,
      searchedEmployee: state.searchedEmployee?.id === id ? null : state.searchedEmployee
    })
  ),
  on(EmployeeActions.deleteEmployeeFailure, (state, { error }) => ({
    ...state,
    actionInProgress: false,
    actionError: error
  }))
);
