import { TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { provideStore } from '@ngrx/store';
import { BreakpointObserver } from '@angular/cdk/layout';
import { of } from 'rxjs';
import { AppComponent } from './app.component';
import { employeeReducer } from './store/employees/employee.reducer';
import { countryReducer } from './store/countries/country.reducer';

describe('AppComponent', () => {
  let breakpointObserver: jasmine.SpyObj<BreakpointObserver>;

  beforeEach(async () => {
    breakpointObserver = jasmine.createSpyObj('BreakpointObserver', ['observe']);
    breakpointObserver.observe.and.returnValue(of({ matches: false, breakpoints: {} }));

    await TestBed.configureTestingModule({
      imports: [AppComponent, NoopAnimationsModule],
      providers: [
        provideRouter([]),
        provideStore({
          employees: employeeReducer,
          countries: countryReducer
        }),
        { provide: BreakpointObserver, useValue: breakpointObserver }
      ]
    }).compileComponents();
  });

  it('should create the main application shell', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render header and navigation drawer', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-header')).toBeTruthy();
    expect(compiled.querySelector('app-sidebar')).toBeTruthy();
  });

  it('should toggle drawer when onToggleDrawer is called', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const app = fixture.componentInstance;
    const drawerSpy = spyOn(app.drawer, 'toggle');
    app.onToggleDrawer();
    expect(drawerSpy).toHaveBeenCalled();
  });

  it('should close drawer on side nav navigate if handset', () => {
    breakpointObserver.observe.and.returnValue(of({ matches: true, breakpoints: {} }));
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const app = fixture.componentInstance;
    const drawerCloseSpy = spyOn(app.drawer, 'close');

    app.onSideNavNavigate();
    expect(drawerCloseSpy).toHaveBeenCalled();
  });
});
