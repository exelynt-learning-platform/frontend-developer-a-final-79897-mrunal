import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { EmployeeFormComponent } from './employee-form.component';
import { Employee } from '../../../../core/models/employee.model';

describe('EmployeeFormComponent', () => {
  let component: EmployeeFormComponent;
  let fixture: ComponentFixture<EmployeeFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeFormComponent, NoopAnimationsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(EmployeeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should initialize empty form with invalid state by default', () => {
    expect(component.employeeForm).toBeDefined();
    expect(component.employeeForm.valid).toBeFalse();
  });

  it('should require all mandatory fields', () => {
    const form = component.employeeForm;
    expect(form.get('name')?.hasError('required')).toBeTrue();
    expect(form.get('email')?.hasError('required')).toBeTrue();
    expect(form.get('mobile')?.hasError('required')).toBeTrue();
    expect(form.get('country')?.hasError('required')).toBeTrue();
    expect(form.get('state')?.hasError('required')).toBeTrue();
    expect(form.get('district')?.hasError('required')).toBeTrue();
  });

  it('should validate email format properly', () => {
    const emailControl = component.employeeForm.get('email');

    emailControl?.setValue('invalid-email');
    expect(emailControl?.hasError('invalidEmail')).toBeTrue();

    emailControl?.setValue('user@example.com');
    expect(emailControl?.hasError('invalidEmail')).toBeFalse();
  });

  it('should validate mobile number to only contain valid numeric digits (7-15 length)', () => {
    const mobileControl = component.employeeForm.get('mobile');

    mobileControl?.setValue('abcdef');
    expect(mobileControl?.hasError('invalidMobile')).toBeTrue();

    mobileControl?.setValue('123'); // Too short
    expect(mobileControl?.hasError('invalidMobile')).toBeTrue();

    mobileControl?.setValue('9876543210'); // Valid 10 digit number
    expect(mobileControl?.hasError('invalidMobile')).toBeFalse();
  });

  it('should reject whitespace-only values in name and locations', () => {
    const nameControl = component.employeeForm.get('name');
    nameControl?.setValue('     ');
    expect(nameControl?.hasError('whitespaceOnly')).toBeTrue();

    const stateControl = component.employeeForm.get('state');
    stateControl?.setValue('   ');
    expect(stateControl?.hasError('whitespaceOnly')).toBeTrue();
  });

  it('should not emit formSubmit when form is invalid and should mark controls touched', () => {
    spyOn(component.formSubmit, 'emit');
    component.onSubmit();

    expect(component.formSubmit.emit).not.toHaveBeenCalled();
    expect(component.employeeForm.get('name')?.touched).toBeTrue();
    expect(component.employeeForm.get('email')?.touched).toBeTrue();
  });

  it('should emit formSubmit with trimmed values when form is valid', () => {
    spyOn(component.formSubmit, 'emit');

    component.employeeForm.setValue({
      name: '  Ananya Sharma  ',
      email: 'ananya@example.com',
      mobile: '9876543210',
      country: 'India',
      state: 'Karnataka',
      district: 'Bengaluru'
    });

    expect(component.employeeForm.valid).toBeTrue();
    component.onSubmit();

    expect(component.formSubmit.emit).toHaveBeenCalledWith({
      name: 'Ananya Sharma',
      email: 'ananya@example.com',
      mobile: '9876543210',
      country: 'India',
      state: 'Karnataka',
      district: 'Bengaluru'
    });
  });

  it('should pre-populate form fields in edit mode when employee is passed', () => {
    const editEmployee: Employee = {
      id: '12',
      name: 'Suresh Raina',
      email: 'suresh@cricket.in',
      mobile: '9876543219',
      country: 'India',
      state: 'Uttar Pradesh',
      district: 'Ghaziabad'
    };

    component.employee = editEmployee;
    component.ngOnChanges({
      employee: {
        currentValue: editEmployee,
        previousValue: null,
        firstChange: true,
        isFirstChange: () => true
      }
    });

    expect(component.employeeForm.value.name).toBe('Suresh Raina');
    expect(component.employeeForm.value.email).toBe('suresh@cricket.in');
    expect(component.employeeForm.value.mobile).toBe('9876543219');
  });
});
