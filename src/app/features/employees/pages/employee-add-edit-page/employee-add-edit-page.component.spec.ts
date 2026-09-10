import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, ParamMap, Router, provideRouter } from '@angular/router';
import { provideStore, Store, Action } from '@ngrx/store';
import { Actions } from '@ngrx/effects';
import { Subject } from 'rxjs';
import { EmployeeAddEditPageComponent } from './employee-add-edit-page.component';
import { employeeReducer } from '../../../../store/employees/employee.reducer';
import { countryReducer } from '../../../../store/countries/country.reducer';
import { EmployeeFormData } from '../../../../core/models/employee.model';
import * as EmployeeActions from '../../../../store/employees/employee.actions';

describe('EmployeeAddEditPageComponent', () => {
  let component: EmployeeAddEditPageComponent;
  let fixture: ComponentFixture<EmployeeAddEditPageComponent>;
  let router: Router;
  let store: Store;
  let actions$: Subject<Action>;
  let routeParamMap: jasmine.SpyObj<ParamMap>;

  const validFormData: EmployeeFormData = {
    name: 'Rohit Sharma',
    email: 'rohit@cricket.in',
    mobile: '9876543210',
    country: 'India',
    state: 'Maharashtra',
    district: 'Mumbai'
  };

  beforeEach(async () => {
    actions$ = new Subject<Action>();
    routeParamMap = jasmine.createSpyObj<ParamMap>('ParamMap', ['get']);
    routeParamMap.get.and.returnValue(null);

    await TestBed.configureTestingModule({
      imports: [EmployeeAddEditPageComponent, NoopAnimationsModule],
      providers: [
        provideRouter([]),
        provideStore({
          employees: employeeReducer,
          countries: countryReducer
        }),
        { provide: Actions, useValue: actions$ },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: routeParamMap
            }
          }
        }
      ]
    }).compileComponents();

    router = TestBed.inject(Router);
    store = TestBed.inject(Store);
    spyOn(router, 'navigate');
    spyOn(store, 'dispatch').and.callThrough();

    fixture = TestBed.createComponent(EmployeeAddEditPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should initialize in add mode when no id route parameter is present', () => {
    expect(component.isEdit).toBeFalse();
    expect(component.employeeId).toBeNull();
  });

  it('should dispatch createEmployee action when submitting in add mode', () => {
    component.onSubmit(validFormData);
    expect(store.dispatch).toHaveBeenCalledWith(
      EmployeeActions.createEmployee({ employee: validFormData })
    );
  });

  it('should navigate back to /employees when cancel is clicked', () => {
    component.onCancel();
    expect(router.navigate).toHaveBeenCalledWith(['/employees']);
  });

  it('should dispatch updateEmployee action when submitting in edit mode', () => {
    component.isEdit = true;
    component.employeeId = '42';
    component.onSubmit(validFormData);
    expect(store.dispatch).toHaveBeenCalledWith(
      EmployeeActions.updateEmployee({
        id: '42',
        changes: validFormData
      })
    );
  });

  it('should clean up on ngOnDestroy', () => {
    expect(() => component.ngOnDestroy()).not.toThrow();
  });

  it('should navigate to /employees when actions$ emits success and form was submitted', () => {
    component.onSubmit(validFormData);
    actions$.next(
      EmployeeActions.createEmployeeSuccess({
        employee: { id: '1', ...validFormData }
      })
    );
    expect(router.navigate).toHaveBeenCalledWith(['/employees']);
  });

  it('should initialize edit mode, load the employee, and retain it from the store', () => {
    routeParamMap.get.and.returnValue('42');
    component.ngOnDestroy();
    component.ngOnInit();

    expect(component.isEdit).toBeTrue();
    expect(component.employeeId).toBe('42');
    expect(store.dispatch).toHaveBeenCalledWith(EmployeeActions.loadEmployeeById({ id: '42' }));

    const employee = { id: '42', ...validFormData };
    store.dispatch(EmployeeActions.loadEmployeeByIdSuccess({ employee }));

    expect(component.employee).toEqual(employee);
  });

  it('should dispatch loadEmployeeById when onRetry is invoked in edit mode', () => {
    component.employeeId = '42';
    component.onRetry();
    expect(store.dispatch).toHaveBeenCalledWith(EmployeeActions.loadEmployeeById({ id: '42' }));
  });

  it('should not dispatch loadEmployeeById when onRetry is invoked without employeeId', () => {
    component.employeeId = null;
    (store.dispatch as jasmine.Spy).calls.reset();
    component.onRetry();
    expect(store.dispatch).not.toHaveBeenCalled();
  });
});
