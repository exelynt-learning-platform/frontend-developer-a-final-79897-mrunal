import { Component, EventEmitter, Input, OnInit, OnChanges, Output, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Employee, EmployeeFormData } from '../../../../core/models/employee.model';
import { Country } from '../../../../core/models/country.model';
import { CustomValidators } from '../../../../core/validators/custom-validators';

const requiredFieldMessages: Record<string, string> = {
  name: 'Name is required.',
  email: 'Email is required.',
  mobile: 'Mobile number is required.',
  country: 'Country is required.',
  state: 'State is required.',
  district: 'District is required.'
};

const staticErrorMessages: Record<string, string> = {
  whitespaceOnly: 'Field cannot contain only whitespace.',
  invalidEmail: 'Please enter a valid email address.',
  invalidMobile: 'Please enter a valid mobile number (7-15 digits).'
};

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmployeeFormComponent implements OnInit, OnChanges {
  @Input() employee: Employee | null = null;
  @Input() countries: Country[] = [];
  @Input() countriesLoading = false;
  @Input() submitting = false;
  @Input() submitButtonLabel = 'Save Employee';

  @Output() formSubmit = new EventEmitter<EmployeeFormData>();
  @Output() formCancel = new EventEmitter<void>();

  employeeForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['employee'] && this.employeeForm) {
      if (this.employee) {
        this.employeeForm.patchValue({
          name: this.employee.name,
          email: this.employee.email,
          mobile: this.employee.mobile,
          country: this.employee.country,
          state: this.employee.state,
          district: this.employee.district
        });
      } else {
        this.employeeForm.reset();
      }
    }
  }

  private initForm(): void {
    this.employeeForm = this.fb.group({
      name: [
        this.employee?.name || '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50),
          CustomValidators.noWhitespaceOnly()
        ]
      ],
      email: [
        this.employee?.email || '',
        [
          Validators.required,
          Validators.maxLength(100),
          CustomValidators.email()
        ]
      ],
      mobile: [
        this.employee?.mobile || '',
        [
          Validators.required,
          CustomValidators.mobileNumber()
        ]
      ],
      country: [
        this.employee?.country || '',
        [Validators.required]
      ],
      state: [
        this.employee?.state || '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50),
          CustomValidators.noWhitespaceOnly()
        ]
      ],
      district: [
        this.employee?.district || '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50),
          CustomValidators.noWhitespaceOnly()
        ]
      ]
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const control = this.employeeForm.get(fieldName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  getFieldError(fieldName: string): string {
    const control = this.employeeForm.get(fieldName);
    if (!control || !control.errors) return '';

    const requiredMessage = this.getRequiredMessage(fieldName, control.errors);
    if (requiredMessage) {
      return requiredMessage;
    }

    for (const [errorKey, message] of Object.entries(staticErrorMessages)) {
      if (control.hasError(errorKey)) {
        return message;
      }
    }

    if (control.hasError('minlength')) {
      const min = control.errors['minlength'].requiredLength;
      return 'Minimum ' + min + ' characters required.';
    }

    if (control.hasError('maxlength')) {
      const max = control.errors['maxlength'].requiredLength;
      return 'Maximum ' + max + ' characters allowed.';
    }

    return 'Invalid input.';
  }

  private getRequiredMessage(fieldName: string, errors: ValidationErrors): string | null {
    if (!errors['required']) {
      return null;
    }

    return requiredFieldMessages[fieldName] || 'This field is required.';
  }

  onSubmit(): void {
    if (this.employeeForm.invalid) {
      this.employeeForm.markAllAsTouched();
      return;
    }

    const value = this.employeeForm.value;
    const formData: EmployeeFormData = {
      name: String(value.name || '').trim(),
      email: String(value.email || '').trim(),
      mobile: String(value.mobile || '').trim(),
      country: String(value.country || '').trim(),
      state: String(value.state || '').trim(),
      district: String(value.district || '').trim()
    };

    this.formSubmit.emit(formData);
  }

  onCancel(): void {
    this.formCancel.emit();
  }
}
