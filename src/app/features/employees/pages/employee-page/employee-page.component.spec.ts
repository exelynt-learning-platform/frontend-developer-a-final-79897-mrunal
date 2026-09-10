import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { provideStore } from '@ngrx/store';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { EmployeePageComponent } from './employee-page.component';
import { employeeReducer } from '../../../../store/employees/employee.reducer';
import { countryReducer } from '../../../../store/countries/country.reducer';
import { Employee } from '../../../../core/models/employee.model';

describe('EmployeePageComponent', () => {
  let component: EmployeePageComponent;
  let fixture: ComponentFixture<EmployeePageComponent>;

  const mockEmployee: Employee = {
    id: '10',
    name: 'Kapil Dev',
    email: 'kapil@cricket.in',
    mobile: '9876543210',
    country: 'India',
    state: 'Haryana',
    district: 'Chandigarh'
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeePageComponent, NoopAnimationsModule],
      providers: [
        provideRouter([]),
        provideStore({
          employees: employeeReducer,
          countries: countryReducer
        })
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EmployeePageComponent);
    component = fixture.componentInstance;

    spyOn(component['dialog'], 'open').and.returnValue({
      afterClosed: () => of(true)
    } as any);

    fixture.detectChanges();
  });

  it('should create employee page component', () => {
    expect(component).toBeTruthy();
  });

  it('should render summary cards when the employee total is zero', () => {
    expect(fixture.nativeElement.querySelector('.summary-cards-row')).toBeTruthy();
  });

  it('should dispatch search action and update isSearching$ when onSearch is invoked', (done) => {
    component.onSearch('10');
    expect(component.currentSearchTerm).toBe('10');
    component.isSearching$.subscribe((isSearching) => {
      expect(isSearching).toBeTrue();
      done();
    });
  });

  it('should clear search and update isSearching$ when onClearSearch is invoked', (done) => {
    component.onSearch('10');
    component.onClearSearch();
    expect(component.currentSearchTerm).toBeNull();
    component.isSearching$.subscribe((isSearching) => {
      expect(isSearching).toBeFalse();
      done();
    });
  });

  it('should reset search and reload data on onRefresh', (done) => {
    component.currentSearchTerm = '10';
    component.onRefresh();
    expect(component.currentSearchTerm).toBeNull();
    component.isSearching$.subscribe((isSearching) => {
      expect(isSearching).toBeFalse();
      done();
    });
  });

  it('should open form dialog on onAddEmployee', () => {
    component.onAddEmployee();
    expect(component['dialog'].open).toHaveBeenCalled();
  });

  it('should open form dialog on onEditEmployee with employee data', () => {
    component.onEditEmployee(mockEmployee);
    expect(component['dialog'].open).toHaveBeenCalled();
  });

  it('should open delete confirmation dialog on onDeleteEmployee', () => {
    component.onDeleteEmployee(mockEmployee);
    expect(component['dialog'].open).toHaveBeenCalled();
  });
});
