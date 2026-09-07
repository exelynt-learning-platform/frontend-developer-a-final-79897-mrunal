import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, Router, provideRouter } from '@angular/router';
import { provideStore, Store } from '@ngrx/store';
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

  const validFormData: EmployeeFormData = {
    name: 'Rohit Sharma',
    email: 'rohit@cricket.in',
    mobile: '9876543210',
    country: 'India',
    state: 'Maharashtra',
    district: 'Mumbai'
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeAddEditPageComponent, NoopAnimationsModule],
      providers: [
        provideRouter([]),
        provideStore({
          employees: employeeReducer,
          countries: countryReducer
        }),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: (key: string) => (key === 'id' ? null : null)
              }
            }
          }
        }
      ]
    }).compileComponents();

    router = TestBed.inject(Router);
    store = TestBed.inject(Store);
    spyOn(router, 'navigate');
    spyOn(store, 'dispatch');

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
});
