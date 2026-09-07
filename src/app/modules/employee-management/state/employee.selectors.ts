import { createFeatureSelector, createSelector } from '@ngrx/store';
import { employeeAdapter, employeeFeatureKey, EmployeeState } from './employee.reducer';

export const selectEmployeeState = createFeatureSelector<EmployeeState>(employeeFeatureKey);

const { selectAll, selectEntities } = employeeAdapter.getSelectors(selectEmployeeState);

export const selectAllEmployees = selectAll;
export const selectEmployeeEntities = selectEntities;
export const selectEmployeesLoading = createSelector(selectEmployeeState, (state) => state.loading);
export const selectEmployeesSaving = createSelector(selectEmployeeState, (state) => state.saving);
export const selectEmployeesError = createSelector(selectEmployeeState, (state) => state.error);
