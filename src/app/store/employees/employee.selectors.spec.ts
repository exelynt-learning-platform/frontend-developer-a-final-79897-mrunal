import {
  selectAllEmployees,
  selectEmployeeEntities,
  selectEmployeeTotal,
  selectEmployeesLoading,
  selectEmployeesError,
  selectSearchedEmployee,
  selectSearchLoading,
  selectSearchError,
  selectActionInProgress,
  selectActionError,
  selectSelectedEmployeeId,
  selectSelectedEmployee,
  selectEmployeeById
} from './employee.selectors';
import { initialEmployeeState, EmployeeState, employeeAdapter } from './employee.models';
import { Employee } from '../../core/models/employee.model';

describe('Employee Selectors', () => {
  const sampleEmployee1: Employee = {
    id: '1',
    name: 'Aarav Kumar',
    email: 'aarav@example.com',
    mobile: '9876543210',
    country: 'India',
    state: 'Delhi',
    district: 'New Delhi'
  };

  const sampleEmployee2: Employee = {
    id: '2',
    name: 'Diya Sen',
    email: 'diya@example.com',
    mobile: '9876543211',
    country: 'India',
    state: 'West Bengal',
    district: 'Kolkata'
  };

  const mockState: { employees: EmployeeState } = {
    employees: employeeAdapter.setAll([sampleEmployee1, sampleEmployee2], {
      ...initialEmployeeState,
      loading: false,
      error: null,
      searchedEmployee: sampleEmployee1,
      searchLoading: false,
      searchError: null,
      actionInProgress: true,
      actionError: 'Action failed',
      selectedEmployeeId: '2'
    })
  };

  it('should select all employees', () => {
    const result = selectAllEmployees(mockState);
    expect(result.length).toBe(2);
    expect(result.map((e) => e.id)).toEqual(['2', '1']); // Sorted descending by ID
  });

  it('should select entities dictionary', () => {
    const result = selectEmployeeEntities(mockState);
    expect(result['1']?.name).toBe('Aarav Kumar');
    expect(result['2']?.name).toBe('Diya Sen');
  });

  it('should select total count', () => {
    const result = selectEmployeeTotal(mockState);
    expect(result).toBe(2);
  });

  it('should select loading and error states', () => {
    expect(selectEmployeesLoading(mockState)).toBeFalse();
    expect(selectEmployeesError(mockState)).toBeNull();
  });

  it('should select search states', () => {
    expect(selectSearchedEmployee(mockState)).toEqual(sampleEmployee1);
    expect(selectSearchLoading(mockState)).toBeFalse();
    expect(selectSearchError(mockState)).toBeNull();
    expect(selectSelectedEmployeeId(mockState)).toBe('2');
  });

  it('should select actionInProgress', () => {
    expect(selectActionInProgress(mockState)).toBeTrue();
    expect(selectActionError(mockState)).toBe('Action failed');
    expect(selectSelectedEmployee(mockState)).toEqual(sampleEmployee2);
  });

  it('should return null when no employee is selected or the selected entity is missing', () => {
    const noSelection = {
      employees: { ...mockState.employees, selectedEmployeeId: null }
    };
    const missingSelection = {
      employees: { ...mockState.employees, selectedEmployeeId: 'missing' }
    };

    expect(selectSelectedEmployee(noSelection)).toBeNull();
    expect(selectSelectedEmployee(missingSelection)).toBeNull();
  });

  it('should select employee by ID using parameterized selector', () => {
    const selector = selectEmployeeById('2');
    const result = selector(mockState);
    expect(result?.name).toBe('Diya Sen');
    expect(selectEmployeeById('missing')(mockState)).toBeNull();
  });

  it('should sort employees alphabetically when IDs are not numeric', () => {
    const state = {
      employees: employeeAdapter.setAll([
        { ...sampleEmployee1, id: 'alpha' },
        { ...sampleEmployee2, id: 'beta' }
      ], initialEmployeeState)
    };

    expect(selectAllEmployees(state).map((employee) => employee.id)).toEqual(['alpha', 'beta']);
  });
});
