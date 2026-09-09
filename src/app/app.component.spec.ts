import { TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { provideStore } from '@ngrx/store';
import { AppComponent } from './app.component';
import { employeeReducer } from './store/employees/employee.reducer';
import { countryReducer } from './store/countries/country.reducer';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent, NoopAnimationsModule],
      providers: [
        provideRouter([]),
        provideStore({
          employees: employeeReducer,
          countries: countryReducer
        })
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
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const app = fixture.componentInstance;
    const drawerCloseSpy = spyOn(app.drawer, 'close');

    // Simulate isHandset$ returning true
    (app as any).isHandset$ = {
      subscribe: (fn: (val: boolean) => void) => {
        fn(true);
        return { unsubscribe: () => {} };
      }
    };

    app.onSideNavNavigate();
    expect(drawerCloseSpy).toHaveBeenCalled();
  });
});
