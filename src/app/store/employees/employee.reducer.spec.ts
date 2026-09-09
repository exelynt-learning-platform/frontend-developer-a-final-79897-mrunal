import { employeeReducer } from './employee.reducer';
import { initialEmployeeState, EmployeeState } from './employee.models';
import * as EmployeeActions from './employee.actions';
import { Employee, EmployeeFormData } from '../../core/models/employee.model';

describe('Employee Reducer', () => {
  const sampleEmployee: Employee = {
    id: '1',
    name: 'Rahul Sharma',
    email: 'rahul@example.com',
    mobile: '9876543210',
    country: 'India',
    state: 'Maharashtra',
    district: 'Pune'
  };

  const sampleEmployee2: Employee = {
    id: '2',
    name: 'Sneha Patel',
    email: 'sneha@example.com',
    mobile: '9876543211',
    country: 'India',
    state: 'Gujarat',
    district: 'Ahmedabad'
  };

  it('should return initial state for unknown action', () => {
    const action = { type: 'UNKNOWN_ACTION' } as any;
    const state = employeeReducer(initialEmployeeState, action);
    expect(state).toBe(initialEmployeeState);
  });

  it('should set loading=true on loadEmployees', () => {
    const action = EmployeeActions.loadEmployees();
    const state = employeeReducer(initialEmployeeState, action);
    expect(state.loading).toBeTrue();
    expect(state.error).toBeNull();
  });

  it('should populate entities and set loading=false on loadEmployeesSuccess', () => {
    const action = EmployeeActions.loadEmployeesSuccess({
      employees: [sampleEmployee, sampleEmployee2]
    });
    const state = employeeReducer(initialEmployeeState, action);
    expect(state.loading).toBeFalse();
    expect(state.ids.length).toBe(2);
    expect(state.entities['1']?.name).toBe('Rahul Sharma');
    expect(state.entities['2']?.name).toBe('Sneha Patel');
  });

  it('should set error on loadEmployeesFailure', () => {
    const action = EmployeeActions.loadEmployeesFailure({ error: 'Server error' });
    const state = employeeReducer(initialEmployeeState, action);
    expect(state.loading).toBeFalse();
    expect(state.error).toBe('Server error');
  });

  it('should set searchLoading=true on loadEmployeeById', () => {
    const action = EmployeeActions.loadEmployeeById({ id: '1' });
    const state = employeeReducer(initialEmployeeState, action);
    expect(state.searchLoading).toBeTrue();
    expect(state.searchedEmployee).toBeNull();
    expect(state.searchError).toBeNull();
  });

  it('should set searchedEmployee and upsert entity on loadEmployeeByIdSuccess', () => {
    const action = EmployeeActions.loadEmployeeByIdSuccess({ employee: sampleEmployee });
    const state = employeeReducer(initialEmployeeState, action);
    expect(state.searchLoading).toBeFalse();
    expect(state.searchedEmployee).toEqual(sampleEmployee);
    expect(state.entities['1']).toEqual(sampleEmployee);
  });

  it('should set searchError on loadEmployeeByIdFailure', () => {
    const action = EmployeeActions.loadEmployeeByIdFailure({
      error: 'No employee found with ID 99.'
    });
    const state = employeeReducer(initialEmployeeState, action);
    expect(state.searchLoading).toBeFalse();
    expect(state.searchError).toBe('No employee found with ID 99.');
    expect(state.searchedEmployee).toBeNull();
  });

  it('should clear search state on clearEmployeeSearch', () => {
    const preState: EmployeeState = {
      ...initialEmployeeState,
      searchedEmployee: sampleEmployee,
      searchError: 'some error',
      searchLoading: false
    };
    const action = EmployeeActions.clearEmployeeSearch();
    const state = employeeReducer(preState, action);
    expect(state.searchedEmployee).toBeNull();
    expect(state.searchError).toBeNull();
  });

  it('should set actionInProgress=true on createEmployee', () => {
    const newEmpData: EmployeeFormData = {
      name: 'John Doe',
      email: 'john@example.com',
      mobile: '9876543210',
      country: 'USA',
      state: 'California',
      district: 'San Jose'
    };
    const action = EmployeeActions.createEmployee({ employee: newEmpData });
    const state = employeeReducer(initialEmployeeState, action);
    expect(state.actionInProgress).toBeTrue();
    expect(state.actionError).toBeNull();
  });

  it('should add entity to store on createEmployeeSuccess', () => {
    const action = EmployeeActions.createEmployeeSuccess({ employee: sampleEmployee });
    const state = employeeReducer(initialEmployeeState, action);
    expect(state.actionInProgress).toBeFalse();
    expect(state.entities['1']).toEqual(sampleEmployee);
    expect(state.ids).toContain('1');
  });

  it('should update entity in store on updateEmployeeSuccess', () => {
    const preState = employeeReducer(
      initialEmployeeState,
      EmployeeActions.loadEmployeesSuccess({ employees: [sampleEmployee] })
    );

    const updatedEmp: Employee = {
      ...sampleEmployee,
      name: 'Rahul Updated'
    };
    const action = EmployeeActions.updateEmployeeSuccess({ employee: updatedEmp });
    const state = employeeReducer(preState, action);
    expect(state.actionInProgress).toBeFalse();
    expect(state.entities['1']?.name).toBe('Rahul Updated');
  });

  it('should remove entity from store on deleteEmployeeSuccess', () => {
    const preState = employeeReducer(
      initialEmployeeState,
      EmployeeActions.loadEmployeesSuccess({ employees: [sampleEmployee, sampleEmployee2] })
    );
    expect(preState.ids.length).toBe(2);

    const action = EmployeeActions.deleteEmployeeSuccess({ id: '1' });
    const state = employeeReducer(preState, action);
    expect(state.ids.length).toBe(1);
    expect(state.entities['1']).toBeUndefined();
    expect(state.entities['2']).toBeDefined();
  });

  it('should set selectedEmployeeId on selectEmployee', () => {
    const action = EmployeeActions.selectEmployee({ id: '5' });
    const state = employeeReducer(initialEmployeeState, action);
    expect(state.selectedEmployeeId).toBe('5');
  });

  it('should handle createEmployeeFailure', () => {
    const action = EmployeeActions.createEmployeeFailure({ error: 'Create failed' });
    const state = employeeReducer(initialEmployeeState, action);
    expect(state.actionInProgress).toBeFalse();
    expect(state.actionError).toBe('Create failed');
  });

  it('should handle updateEmployee and updateEmployeeFailure', () => {
    const startAction = EmployeeActions.updateEmployee({ id: '1', changes: {} });
    const startState = employeeReducer(initialEmployeeState, startAction);
    expect(startState.actionInProgress).toBeTrue();
    expect(startState.actionError).toBeNull();

    const failAction = EmployeeActions.updateEmployeeFailure({ error: 'Update failed' });
    const failState = employeeReducer(startState, failAction);
    expect(failState.actionInProgress).toBeFalse();
    expect(failState.actionError).toBe('Update failed');
  });

  it('should update searchedEmployee if its id matches updated employee', () => {
    const preState: EmployeeState = {
      ...initialEmployeeState,
      searchedEmployee: sampleEmployee
    };
    const updated = { ...sampleEmployee, name: 'Updated In Search' };
    const action = EmployeeActions.updateEmployeeSuccess({ employee: updated });
    const state = employeeReducer(preState, action);
    expect(state.searchedEmployee?.name).toBe('Updated In Search');
  });

  it('should handle deleteEmployee and deleteEmployeeFailure', () => {
    const startAction = EmployeeActions.deleteEmployee({ id: '1' });
    const startState = employeeReducer(initialEmployeeState, startAction);
    expect(startState.actionInProgress).toBeTrue();
    expect(startState.actionError).toBeNull();

    const failAction = EmployeeActions.deleteEmployeeFailure({ error: 'Delete failed' });
    const failState = employeeReducer(startState, failAction);
    expect(failState.actionInProgress).toBeFalse();
    expect(failState.actionError).toBe('Delete failed');
  });

  it('should reset searchedEmployee if deleted employee matches searchedEmployee', () => {
    const preState: EmployeeState = {
      ...initialEmployeeState,
      searchedEmployee: sampleEmployee
    };
    const action = EmployeeActions.deleteEmployeeSuccess({ id: sampleEmployee.id });
    const state = employeeReducer(preState, action);
    expect(state.searchedEmployee).toBeNull();
  });
});
