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

  it('should use the fallback message when loading employees fails without a message', (done) => {
    actions$ = of(EmployeeActions.loadEmployees());
    employeeServiceSpy.getEmployees.and.returnValue(throwError(() => ({})));

    effects.loadEmployees$.subscribe((action) => {
      expect(action).toEqual(
        EmployeeActions.loadEmployeesFailure({ error: 'Unable to load employees. Please try again.' })
      );
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

  it('should emit loadEmployeeByIdFailure on search error', (done) => {
    actions$ = of(EmployeeActions.loadEmployeeById({ id: '99' }));
    employeeServiceSpy.getEmployeeById.and.returnValue(throwError(() => new Error('Not found')));

    effects.loadEmployeeById$.subscribe((action) => {
      expect(action.type).toBe(EmployeeActions.loadEmployeeByIdFailure.type);
      done();
    });
  });

  it('should return a not-found message for a 404 search error', (done) => {
    actions$ = of(EmployeeActions.loadEmployeeById({ id: '99' }));
    employeeServiceSpy.getEmployeeById.and.returnValue(throwError(() => ({ status: 404 })));

    effects.loadEmployeeById$.subscribe((action) => {
      expect(action).toEqual(
        EmployeeActions.loadEmployeeByIdFailure({ error: 'No employee found with ID 99.' })
      );
      done();
    });
  });

  it('should recognize a not-found error nested in the original error', (done) => {
    actions$ = of(EmployeeActions.loadEmployeeById({ id: '98' }));
    employeeServiceSpy.getEmployeeById.and.returnValue(
      throwError(() => ({ originalError: { status: 404 } }))
    );

    effects.loadEmployeeById$.subscribe((action) => {
      expect(action).toEqual(
        EmployeeActions.loadEmployeeByIdFailure({ error: 'No employee found with ID 98.' })
      );
      done();
    });
  });

  it('should use the search fallback message for an unknown search error', (done) => {
    actions$ = of(EmployeeActions.loadEmployeeById({ id: '97' }));
    employeeServiceSpy.getEmployeeById.and.returnValue(throwError(() => ({})));

    effects.loadEmployeeById$.subscribe((action) => {
      expect(action).toEqual(
        EmployeeActions.loadEmployeeByIdFailure({ error: 'Unable to load employee with ID 97.' })
      );
      done();
    });
  });

  it('should emit createEmployeeFailure on creation error', (done) => {
    actions$ = of(EmployeeActions.createEmployee({ employee: {} as any }));
    employeeServiceSpy.createEmployee.and.returnValue(throwError(() => new Error('Creation failed')));

    effects.createEmployee$.subscribe((action) => {
      expect(notificationServiceSpy.error).toHaveBeenCalled();
      expect(action.type).toBe(EmployeeActions.createEmployeeFailure.type);
      done();
    });
  });

  it('should use the create fallback message when the error has no message', (done) => {
    actions$ = of(EmployeeActions.createEmployee({ employee: {} as EmployeeFormData }));
    employeeServiceSpy.createEmployee.and.returnValue(throwError(() => ({})));

    effects.createEmployee$.subscribe((action) => {
      expect(notificationServiceSpy.error).toHaveBeenCalledWith('Unable to create employee.');
      expect(action).toEqual(
        EmployeeActions.createEmployeeFailure({ error: 'Unable to create employee.' })
      );
      done();
    });
  });

  it('should emit updateEmployeeFailure on update error', (done) => {
    actions$ = of(EmployeeActions.updateEmployee({ id: '1', changes: {} }));
    employeeServiceSpy.updateEmployee.and.returnValue(throwError(() => new Error('Update failed')));

    effects.updateEmployee$.subscribe((action) => {
      expect(notificationServiceSpy.error).toHaveBeenCalled();
      expect(action.type).toBe(EmployeeActions.updateEmployeeFailure.type);
      done();
    });
  });

  it('should use the update fallback message when the error has no message', (done) => {
    actions$ = of(EmployeeActions.updateEmployee({ id: '1', changes: {} }));
    employeeServiceSpy.updateEmployee.and.returnValue(throwError(() => ({})));

    effects.updateEmployee$.subscribe((action) => {
      expect(notificationServiceSpy.error).toHaveBeenCalledWith('Unable to update employee.');
      expect(action).toEqual(
        EmployeeActions.updateEmployeeFailure({ error: 'Unable to update employee.' })
      );
      done();
    });
  });

  it('should emit deleteEmployeeFailure on delete error', (done) => {
    actions$ = of(EmployeeActions.deleteEmployee({ id: '1' }));
    employeeServiceSpy.deleteEmployee.and.returnValue(throwError(() => new Error('Delete failed')));

    effects.deleteEmployee$.subscribe((action) => {
      expect(notificationServiceSpy.error).toHaveBeenCalled();
      expect(action.type).toBe(EmployeeActions.deleteEmployeeFailure.type);
      done();
    });
  });

  it('should use the delete fallback message when the error has no message', (done) => {
    actions$ = of(EmployeeActions.deleteEmployee({ id: '1' }));
    employeeServiceSpy.deleteEmployee.and.returnValue(throwError(() => ({})));

    effects.deleteEmployee$.subscribe((action) => {
      expect(notificationServiceSpy.error).toHaveBeenCalledWith('Unable to delete employee.');
      expect(action).toEqual(
        EmployeeActions.deleteEmployeeFailure({ error: 'Unable to delete employee.' })
      );
      done();
    });
  });
});
