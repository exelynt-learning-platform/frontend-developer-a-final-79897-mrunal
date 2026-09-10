import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { provideStore, ScannedActionsSubject, Store } from '@ngrx/store';
import { EmployeeFormDialogComponent, FormDialogData } from './employee-form-dialog.component';
import { employeeReducer } from '../../../../store/employees/employee.reducer';
import { countryReducer } from '../../../../store/countries/country.reducer';
import { Employee, EmployeeFormData } from '../../../../core/models/employee.model';
import * as EmployeeActions from '../../../../store/employees/employee.actions';

describe('EmployeeFormDialogComponent', () => {
  let component: EmployeeFormDialogComponent;
  let fixture: ComponentFixture<EmployeeFormDialogComponent>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<EmployeeFormDialogComponent>>;
  let store: Store;
  let actionsSubject: ScannedActionsSubject;

  const mockEmployee: Employee = {
    id: '7',
    name: 'MS Dhoni',
    email: 'dhoni@cricket.in',
    mobile: '9876543210',
    country: 'India',
    state: 'Jharkhand',
    district: 'Ranchi'
  };

  const validFormData: EmployeeFormData = {
    name: 'MS Dhoni',
    email: 'dhoni@cricket.in',
    mobile: '9876543210',
    country: 'India',
    state: 'Jharkhand',
    district: 'Ranchi'
  };

  beforeEach(async () => {
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      imports: [EmployeeFormDialogComponent, NoopAnimationsModule],
      providers: [
        provideStore({
          employees: employeeReducer,
          countries: countryReducer
        }),
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: MAT_DIALOG_DATA, useValue: { employee: mockEmployee } as FormDialogData }
      ]
    }).compileComponents();

    store = TestBed.inject(Store);
    actionsSubject = TestBed.inject(ScannedActionsSubject);
    spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(EmployeeFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should detect edit mode when employee is passed in dialog data', () => {
    expect(component.isEdit).toBeTrue();
  });

  it('should dispatch updateEmployee action on submit in edit mode', () => {
    component.onSubmit(validFormData);
    expect(store.dispatch).toHaveBeenCalledWith(
      EmployeeActions.updateEmployee({ id: '7', changes: validFormData })
    );
  });

  it('should close dialog on cancel', () => {
    component.onCancel();
    expect(dialogRefSpy.close).toHaveBeenCalledWith(false);
  });

  it('should dispatch createEmployee action on submit in add mode', () => {
    (component as any).data = {};
    component.onSubmit(validFormData);
    expect(store.dispatch).toHaveBeenCalledWith(
      EmployeeActions.createEmployee({ employee: validFormData })
    );
  });

  it('should clean up subscriptions on ngOnDestroy', () => {
    expect(() => component.ngOnDestroy()).not.toThrow();
  });

  it('should close only after a submitted form succeeds', () => {
    actionsSubject.next(EmployeeActions.createEmployeeSuccess({ employee: mockEmployee }));
    expect(dialogRefSpy.close).not.toHaveBeenCalled();

    component.onSubmit(validFormData);
    actionsSubject.next(EmployeeActions.updateEmployeeSuccess({ employee: mockEmployee }));

    expect(dialogRefSpy.close).toHaveBeenCalledWith(true);
  });
});
