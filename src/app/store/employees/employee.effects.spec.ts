import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of, throwError } from 'rxjs';
import { EmployeeEffects } from './employee.effects';
import * as EmployeeActions from './employee.actions';
import { EmployeeService } from '../../core/services/employee.service';
import { NotificationService } from '../../core/services/notification.service';
import { Employee, EmployeeFormData } from '../../core/models/employee.model';

describe('EmployeeEffects', () => {
  let actions$: Observable<any>;
  let effects: EmployeeEffects;
  let employeeServiceSpy: jasmine.SpyObj<EmployeeService>;
  let notificationServiceSpy: jasmine.SpyObj<NotificationService>;

  const mockEmployee: Employee = {
    id: '1',
    name: 'Test User',
    email: 'test@example.com',
    mobile: '9876543210',
    country: 'India',
    state: 'Maharashtra',
    district: 'Pune'
  };

  beforeEach(() => {
    employeeServiceSpy = jasmine.createSpyObj('EmployeeService', [
      'getEmployees',
      'getEmployeeById',
      'createEmployee',
      'updateEmployee',
      'deleteEmployee'
    ]);

    notificationServiceSpy = jasmine.createSpyObj('NotificationService', [
      'success',
      'error',
      'info'
    ]);

    TestBed.configureTestingModule({
      providers: [
        EmployeeEffects,
        provideMockActions(() => actions$),
        { provide: EmployeeService, useValue: employeeServiceSpy },
        { provide: NotificationService, useValue: notificationServiceSpy }
      ]
    });

    effects = TestBed.inject(EmployeeEffects);
  });

  it('should load employees and emit loadEmployeesSuccess on success', (done) => {
    actions$ = of(EmployeeActions.loadEmployees());
    employeeServiceSpy.getEmployees.and.returnValue(of([mockEmployee]));

    effects.loadEmployees$.subscribe((action) => {
      expect(action).toEqual(
        EmployeeActions.loadEmployeesSuccess({ employees: [mockEmployee] })
      );
      done();
    });
  });

  it('should emit loadEmployeesFailure on error', (done) => {
    actions$ = of(EmployeeActions.loadEmployees());
    employeeServiceSpy.getEmployees.and.returnValue(throwError(() => new Error('API Error')));

    effects.loadEmployees$.subscribe((action) => {
      expect(action.type).toBe(EmployeeActions.loadEmployeesFailure.type);
      done();
    });
  });

  it('should search employee by ID and emit loadEmployeeByIdSuccess on success', (done) => {
    actions$ = of(EmployeeActions.loadEmployeeById({ id: '1' }));
    employeeServiceSpy.getEmployeeById.and.returnValue(of(mockEmployee));

    effects.loadEmployeeById$.subscribe((action) => {
      expect(action).toEqual(
        EmployeeActions.loadEmployeeByIdSuccess({ employee: mockEmployee })
      );
      done();
    });
  });

  it('should create employee, show success toast, and emit createEmployeeSuccess', (done) => {
    const formData: EmployeeFormData = {
      name: 'New Person',
      email: 'new@example.com',
      mobile: '9876543210',
      country: 'India',
      state: 'Goa',
      district: 'Panaji'
    };
    actions$ = of(EmployeeActions.createEmployee({ employee: formData }));
    employeeServiceSpy.createEmployee.and.returnValue(of({ ...formData, id: '2' }));

    effects.createEmployee$.subscribe((action) => {
      expect(notificationServiceSpy.success).toHaveBeenCalledWith('Employee created successfully.');
      expect(action).toEqual(
        EmployeeActions.createEmployeeSuccess({ employee: { ...formData, id: '2' } })
      );
      done();
    });
  });

  it('should update employee, show toast, and emit updateEmployeeSuccess', (done) => {
    const changes: Partial<EmployeeFormData> = { name: 'Updated Name' };
    actions$ = of(EmployeeActions.updateEmployee({ id: '1', changes }));
    employeeServiceSpy.updateEmployee.and.returnValue(of({ ...mockEmployee, name: 'Updated Name' }));

    effects.updateEmployee$.subscribe((action) => {
      expect(notificationServiceSpy.success).toHaveBeenCalledWith('Employee updated successfully.');
      expect(action).toEqual(
        EmployeeActions.updateEmployeeSuccess({
          employee: { ...mockEmployee, name: 'Updated Name' }
        })
      );
      done();
    });
  });

  it('should delete employee, show toast, and emit deleteEmployeeSuccess', (done) => {
    actions$ = of(EmployeeActions.deleteEmployee({ id: '1' }));
    employeeServiceSpy.deleteEmployee.and.returnValue(of('1'));

    effects.deleteEmployee$.subscribe((action) => {
      expect(notificationServiceSpy.success).toHaveBeenCalledWith('Employee deleted successfully.');
      expect(action).toEqual(EmployeeActions.deleteEmployeeSuccess({ id: '1' }));
      done();
    });
  });
});
