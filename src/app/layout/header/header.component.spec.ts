import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideStore } from '@ngrx/store';
import { HeaderComponent } from './header.component';
import { employeeReducer } from '../../store/employees/employee.reducer';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [
        provideStore({
          employees: employeeReducer
        })
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create header component', () => {
    expect(component).toBeTruthy();
  });

  it('should emit toggleSidebar event on onToggle', () => {
    spyOn(component.toggleSidebar, 'emit');
    component.onToggle();
    expect(component.toggleSidebar.emit).toHaveBeenCalled();
  });
});
