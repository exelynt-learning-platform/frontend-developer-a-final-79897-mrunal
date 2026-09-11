import { createFeatureSelector, createSelector } from '@ngrx/store';
import { EmployeeState, employeeAdapter } from './employee.models';

export const selectEmployeeState = createFeatureSelector<EmployeeState>('employees');

const { selectEntities, selectAll, selectTotal } = employeeAdapter.getSelectors();

export const selectAllEmployees = createSelector(
  selectEmployeeState,
  selectAll
);

export const selectEmployeeEntities = createSelector(
  selectEmployeeState,
  selectEntities
);

export const selectEmployeeTotal = createSelector(
  selectEmployeeState,
  selectTotal
);

export const selectEmployeesLoading = createSelector(
  selectEmployeeState,
  (state) => state.loading
);

export const selectEmployeesError = createSelector(
  selectEmployeeState,
  (state) => state.error
);

export const selectSearchedEmployee = createSelector(
  selectEmployeeState,
  (state) => state.searchedEmployee
);

export const selectSearchLoading = createSelector(
  selectEmployeeState,
  (state) => state.searchLoading
);

export const selectSearchError = createSelector(
  selectEmployeeState,
  (state) => state.searchError
);

export const selectIsSearching = createSelector(
  selectEmployeeState,
  (state) => state.searchTerm !== null
);

export const selectActionInProgress = createSelector(
  selectEmployeeState,
  (state) => state.actionInProgress
);

export const selectActionError = createSelector(
  selectEmployeeState,
  (state) => state.actionError
);

export const selectSelectedEmployeeId = createSelector(
  selectEmployeeState,
  (state) => state.selectedEmployeeId
);

export const selectSelectedEmployee = createSelector(
  selectEmployeeEntities,
  selectSelectedEmployeeId,
  (entities, selectedId) => (selectedId ? entities[selectedId] || null : null)
);

export const selectEmployeeById = (id: string) =>
  createSelector(
    selectEmployeeEntities,
    (entities) => entities[id] || null
  );
