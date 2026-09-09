import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideStore } from '@ngrx/store';
import { SidebarComponent } from './sidebar.component';
import { employeeReducer } from '../../store/employees/employee.reducer';

describe('SidebarComponent', () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarComponent],
      providers: [
        provideRouter([]),
        provideStore({
          employees: employeeReducer
        })
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create sidebar component', () => {
    expect(component).toBeTruthy();
  });

  it('should emit navigate event on onItemClick', () => {
    spyOn(component.navigate, 'emit');
    component.onItemClick();
    expect(component.navigate.emit).toHaveBeenCalled();
  });
});
