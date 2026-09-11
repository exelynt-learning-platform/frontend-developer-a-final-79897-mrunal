import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { EmployeeMobileCardComponent } from './employee-mobile-card.component';
import { Employee } from '../../../../core/models/employee.model';

describe('EmployeeMobileCardComponent', () => {
  let component: EmployeeMobileCardComponent;
  let fixture: ComponentFixture<EmployeeMobileCardComponent>;
  const employee: Employee = {
    id: '5',
    name: 'Asha Rao',
    email: 'asha@example.com',
    mobile: '9876543210',
    country: 'India',
    state: 'Karnataka',
    district: 'Mysuru'
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeMobileCardComponent, NoopAnimationsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(EmployeeMobileCardComponent);
    component = fixture.componentInstance;
    component.employee = employee;
    fixture.detectChanges();
  });

  it('should emit the employee when edit is requested', () => {
    spyOn(component.edit, 'emit');

    component.onEdit();

    expect(component.edit.emit).toHaveBeenCalledWith(employee);
  });

  it('should emit the employee when delete is requested', () => {
    spyOn(component.delete, 'emit');

    component.onDelete();

    expect(component.delete.emit).toHaveBeenCalledWith(employee);
  });
});
