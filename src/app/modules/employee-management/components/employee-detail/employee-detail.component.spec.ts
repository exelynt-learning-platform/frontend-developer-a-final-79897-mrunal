import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from '../../../../core/services/toast.service';
import { DepartmentService } from '../department/department.service';
import { EmployeeService } from '../../employee.service';
import { CountryFacade } from '../../state/country.facade';
import { EmployeeFacade } from '../../state/employee.facade';
import { EmployeeDetailComponent } from './employee-detail.component';

describe('EmployeeDetailComponent form', () => {
  function createComponent(): EmployeeDetailComponent {
    const component = new EmployeeDetailComponent(
      {} as ActivatedRoute,
      {} as Router,
      new FormBuilder(),
      {} as EmployeeService,
      {} as ToastService,
      {} as DepartmentService,
      {} as CountryFacade,
      {} as EmployeeFacade
    );
    component.initializeForm();
    return component;
  }

  it('requires the core employee fields and a valid email', () => {
    const component = createComponent();
    const form = component.employeeForm;

    expect(form.invalid).toBeTrue();
    form.patchValue({
      firstName: 'Ada',
      lastName: 'Lovelace',
      email: 'not-an-email',
      phoneNumber: '1234567890',
      departmentId: '1',
      position: 'Engineer',
      salary: 100,
      hireDate: '2024-01-01'
    });

    expect(form.get('email')?.hasError('email')).toBeTrue();
    expect(form.invalid).toBeTrue();

    form.get('email')?.setValue('ada@example.com');
    expect(form.valid).toBeTrue();
  });

  it('rejects values longer than the supported field lengths', () => {
    const component = createComponent();

    component.employeeForm.get('firstName')?.setValue('a'.repeat(51));
    component.employeeForm.get('district')?.setValue('d'.repeat(51));

    expect(component.employeeForm.get('firstName')?.hasError('maxlength')).toBeTrue();
    expect(component.employeeForm.get('district')?.hasError('maxlength')).toBeTrue();
  });
});
