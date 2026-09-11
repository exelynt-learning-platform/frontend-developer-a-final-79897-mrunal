import { EntityState, createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { Employee } from '../../core/models/employee.model';

export interface EmployeeState extends EntityState<Employee> {
  selectedEmployeeId: string | null;
  searchTerm: string | null;
  loading: boolean;
  error: string | null;
  searchedEmployee: Employee | null;
  searchLoading: boolean;
  searchError: string | null;
  actionInProgress: boolean;
  actionError: string | null;
}

export const employeeAdapter: EntityAdapter<Employee> = createEntityAdapter<Employee>({
  selectId: (employee: Employee) => employee.id,
  // Numeric IDs sort descending; mixed or nonnumeric IDs sort alphabetically by name.
  sortComparer: compareEmployees
});

function compareEmployees(first: Employee, second: Employee): number {
  const firstId = Number(first.id);
  const secondId = Number(second.id);
  if (!Number.isNaN(firstId) && !Number.isNaN(secondId)) {
    return secondId - firstId;
  }
  return first.name.localeCompare(second.name);
}

export const initialEmployeeState: EmployeeState = employeeAdapter.getInitialState({
  selectedEmployeeId: null,
  searchTerm: null,
  loading: false,
  error: null,
  searchedEmployee: null,
  searchLoading: false,
  searchError: null,
  actionInProgress: false,
  actionError: null
});
