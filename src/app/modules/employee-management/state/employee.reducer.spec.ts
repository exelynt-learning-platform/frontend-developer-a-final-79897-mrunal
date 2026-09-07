import { IEmployee } from '../../../interfaces/employee.interface';
import * as EmployeeActions from './employee.actions';
import { employeeReducer, initialState } from './employee.reducer';

const employee: IEmployee = {
  id: '1',
  firstName: 'Ada',
  lastName: 'Lovelace',
  email: 'ada@example.com',
  phoneNumber: '1234567890',
  departmentId: 1,
  position: 'Engineer',
  hireDate: '2024-01-01',
  salary: 100000,
  status: 'Active'
};

describe('employeeReducer', () => {
  it('stores loaded employees in the entity state', () => {
    const state = employeeReducer(initialState, EmployeeActions.loadEmployeesSuccess({ employees: [employee] }));

    expect(state.ids).toEqual(['1']);
    expect(state.entities['1']).toEqual(employee);
    expect(state.loading).toBeFalse();
  });

  it('upserts successful mutations into the entity state', () => {
    const state = employeeReducer(initialState, EmployeeActions.syncEmployee({ employee }));

    expect(state.entities['1']).toEqual(employee);
  });

  it('removes a deleted employee from the entity state', () => {
    const loadedState = employeeReducer(initialState, EmployeeActions.loadEmployeesSuccess({ employees: [employee] }));
    const state = employeeReducer(loadedState, EmployeeActions.deleteEmployeeSuccess({ id: '1' }));

    expect(state.ids).toEqual([]);
  });
});
