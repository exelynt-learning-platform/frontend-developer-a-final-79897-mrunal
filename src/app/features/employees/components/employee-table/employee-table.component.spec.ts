import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { EmployeeTableComponent } from './employee-table.component';
import { Employee } from '../../../../core/models/employee.model';

describe('EmployeeTableComponent', () => {
  let component: EmployeeTableComponent;
  let fixture: ComponentFixture<EmployeeTableComponent>;

  const mockEmployees: Employee[] = [
    {
      id: '1',
      name: 'Pooja Hegde',
      email: 'pooja@example.com',
      mobile: '9876543210',
      country: 'India',
      state: 'Karnataka',
      district: 'Udupi'
    },
    {
      id: '2',
      name: 'Vikram Seth',
      email: 'vikram@example.com',
      mobile: '9876543211',
      country: 'United Kingdom',
      state: 'England',
      district: 'London'
    }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeTableComponent, NoopAnimationsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(EmployeeTableComponent);
    component = fixture.componentInstance;
    component.employees = mockEmployees;
    fixture.detectChanges();
  });

  it('should render table rows for employees in desktop view', () => {
    const rows = fixture.nativeElement.querySelectorAll('.desktop-table tr.table-row');
    expect(rows.length).toBe(2);
  });

  it('should render mobile card items for responsive view', () => {
    const cards = fixture.nativeElement.querySelectorAll('.mobile-card-list .emp-card');
    expect(cards.length).toBe(2);
  });

  it('should emit edit event when edit button is clicked', () => {
    spyOn(component.edit, 'emit');
    component.onEdit(mockEmployees[0]);
    expect(component.edit.emit).toHaveBeenCalledWith(mockEmployees[0]);
  });

  it('should emit delete event when delete button is clicked', () => {
    spyOn(component.delete, 'emit');
    component.onDelete(mockEmployees[1]);
    expect(component.delete.emit).toHaveBeenCalledWith(mockEmployees[1]);
  });
});
