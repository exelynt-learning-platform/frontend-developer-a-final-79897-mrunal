import { EntityState, createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { Employee } from '../../core/models/employee.model';

export interface EmployeeState extends EntityState<Employee> {
  selectedEmployeeId: string | null;
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
  sortComparer: (a: Employee, b: Employee) => {
    const numA = Number(a.id);
    const numB = Number(b.id);
    if (!isNaN(numA) && !isNaN(numB)) {
      return numB - numA;
    }
    return a.name.localeCompare(b.name);
  }
});

export const initialEmployeeState: EmployeeState = employeeAdapter.getInitialState({
  selectedEmployeeId: null,
  loading: false,
  error: null,
  searchedEmployee: null,
  searchLoading: false,
  searchError: null,
  actionInProgress: false,
  actionError: null
});
