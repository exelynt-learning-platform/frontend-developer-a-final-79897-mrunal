import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { provideStore } from '@ngrx/store';
import { DashboardPageComponent } from './dashboard-page.component';
import { employeeReducer } from '../../../../store/employees/employee.reducer';
import { countryReducer } from '../../../../store/countries/country.reducer';

describe('DashboardPageComponent', () => {
  let component: DashboardPageComponent;
  let fixture: ComponentFixture<DashboardPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardPageComponent, NoopAnimationsModule],
      providers: [
        provideRouter([]),
        provideStore({
          employees: employeeReducer,
          countries: countryReducer
        })
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create dashboard page component', () => {
    expect(component).toBeTruthy();
  });

  it('should select recent employees and country streams', (done) => {
    component.recentEmployees$.subscribe((recent) => {
      expect(Array.isArray(recent)).toBeTrue();
      done();
    });
  });
});
