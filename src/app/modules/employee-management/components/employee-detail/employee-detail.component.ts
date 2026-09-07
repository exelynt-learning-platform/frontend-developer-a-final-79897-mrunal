import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmployeeService } from '../../employee.service';
import { ToastService } from '../../../../core/services/toast.service';

import { IEmployee } from '../../../../interfaces/employee.interface';
import { IDepartment } from '../../../../interfaces/department.interface';
import { DepartmentService } from '../department/department.service';
import { CountryFacade } from '../../state/country.facade';
import { EmployeeFacade } from '../../state/employee.facade';
import { ICountry } from '../../../../interfaces/country.interface';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-employee-detail',
  templateUrl: './employee-detail.component.html',
  styleUrls: ['./employee-detail.component.css']
})
export class EmployeeDetailComponent implements OnInit, OnDestroy {
  employee?: IEmployee;
  employeeForm!: FormGroup;
  departments: IDepartment[] = [];
  countries: ICountry[] = [];
  isLoading = true;
  isSaving = false;
  error = '';
  submitError = '';
  successMessage = '';
  isAddMode = false;
  isEditMode = false;
  isViewMode = false;
  isDepartmentsLoading = false;
  departmentsLoadingError = '';
  imagePreview: string | null = null;
statusOptions = [
  'Active',
  'On Leave',
  'Probation',
  'Terminated'
];

genderOptions = [
  'Male',
  'Female',
  'Other'
];

employmentTypeOptions = [
  'Full Time',
  'Part Time',
  'Contract',
  'Intern'
];

departmentsMap: { [key: number]: string } = {
  1: 'Engineering',
  2: 'Sales',
  3: 'Design',
  4: 'Operations',
  5: 'Finance',
  6: 'HR'
};
  private readonly destroy$ = new Subject<void>();
  

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private toastService: ToastService,
    private departmentService: DepartmentService,
    private countryFacade: CountryFacade,
    private employeeFacade: EmployeeFacade
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadDepartments();
    this.countryFacade.countries$
      .pipe(takeUntil(this.destroy$))
      .subscribe((countries) => this.countries = countries);
    this.countryFacade.loadCountries();
  

    const routePath = this.route.snapshot.routeConfig?.path;
    const idParam = this.route.snapshot.paramMap.get('id');

    this.isAddMode = routePath === 'employees/add';
    
    if (routePath === 'employees/edit/:id') {
      this.isEditMode = true ;
    }

    if (routePath === 'employees/view/:id') {
      this.isViewMode = true ;
    }

    if (this.isAddMode) {
      this.isLoading = false;
      return;
    }
    const id = idParam ? Number(idParam) : null;
  if (id && (this.isEditMode || this.isViewMode)) {
      this.loadEmployeeForEdit(id);
      return;
    }

    if (id) {
      this.loadEmployee(id);
      return;
    }

    this.error = 'Employee route is invalid.';
    this.isLoading = false;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  initializeForm(): void {
    this.employeeForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.maxLength(50)]],
      lastName: ['', [Validators.required, Validators.maxLength(50)]],
      dateOfBirth: [''],
      gender: [''],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(254)]],
      phoneNumber: ['', [Validators.required, Validators.maxLength(15), Validators.pattern(/^[0-9()+\-\s]*$/)]],
      status: ['Active', Validators.required],
      departmentId: ['', Validators.required],
      position: ['', Validators.required],
      salary: [0, [Validators.required, Validators.min(0)]],
      hireDate: ['', Validators.required],
      employmentType: ['Full Time'],
      address: [''],
      city: [''],
      state: ['', Validators.maxLength(50)],
      district: ['', Validators.maxLength(50)],
      country: ['', Validators.maxLength(80)],
      pincode: [''],
      notes: [''],
      profileImage: ['']
    });
  }

  loadDepartments(): void {
    this.isDepartmentsLoading = true;
    this.departmentsLoadingError = '';

    this.departmentService.getDepartments().subscribe({
      next: (data) => {
        this.departments = data;
        this.isDepartmentsLoading = false;
      },
      error: (err) => {
        console.error('Department load failed:', err);
        this.departmentsLoadingError = 'Failed to load departments. Please refresh or try again later.';
        this.isDepartmentsLoading = false;
      }
    });
  }

  loadEmployeeForEdit(id: any): void {
    this.isLoading = true;
    this.employeeService.getEmployeeById(id.toString()).subscribe({
      next: (emp) => {
        this.employee = emp;
        this.employeeForm.patchValue({
          ...emp,
          departmentId: emp.departmentId != null ? emp.departmentId.toString() : ''
        });
  
        this.imagePreview = emp.profileImage ?? null;
        this.isLoading = false;
      },
      error: () => {
        this.error = 'Failed to load employee details.';
        this.isLoading = false;
      }
    });
  }

  loadEmployee(id: number): void {
    this.isLoading = true;
    this.employeeService.getEmployeeById(id.toString()).subscribe({
      next: (emp) => {
        this.employee = emp;
        this.isLoading = false;
      },
      error: () => {
        this.error = 'Failed to load employee details.';
        this.isLoading = false;
      }
    });
  }

  get f() {
    return this.employeeForm.controls;
  }

  isInvalid(controlName: string): boolean {
    const control = this.employeeForm.get(controlName);
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      return;
    }

    const file = input.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === 'string') {
        this.imagePreview = result;
        this.employeeForm.patchValue({ profileImage: result });
      }
    };
    reader.readAsDataURL(file);
  }

  cancel(): void {
    this.router.navigate(['/employee-management/employees']);
  }

  onSubmit(): void {
    if (this.employeeForm.invalid) {
      this.employeeForm.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    this.submitError = '';
    this.successMessage = '';

    const employeePayload: IEmployee = {
      ...this.employeeForm.value,
      departmentId: Number(this.employeeForm.value.departmentId)
    };

    if (this.isEditMode && this.employee?.id) {
      this.employeeService.updateEmployee(this.employee.id, employeePayload).subscribe({
        next: (updatedEmployee) => {
          this.isSaving = false;
          this.employeeFacade.syncEmployee(updatedEmployee);
          this.toastService.showSuccess('Employee updated successfully.');
          this.router.navigate(['/employee-management/employees']);
        },
        error: () => {
          this.isSaving = false;
          this.toastService.showError('Failed to update employee. Please try again.');
        }
      });
      return;
    }

    if (this.isAddMode) {
      this.employeeService.createEmployee(employeePayload).subscribe({
        next: (createdEmployee) => {
          this.isSaving = false;
          this.employeeFacade.syncEmployee(createdEmployee);
          this.toastService.showSuccess('Employee created successfully.');
          this.router.navigate(['/employee-management/employees']);
        },
        error: () => {
          this.isSaving = false;
          this.toastService.showError('Failed to create employee. Please try again.');
        }
      });
      return;
    }

    this.submitError = 'Form cannot be submitted in view mode.';
    this.isSaving = false;
  }

  goBack(): void {
    this.router.navigate(['/employee-management/employees']);
  }
getDepartmentName(): string {
  const departmentId = this.employeeForm.get('departmentId')?.value;

  const department = this.departments.find(
    d => d.id?.toString() === departmentId?.toString()
  );

  return department?.departmentName || '';
}

  editEmployee(): void {
    if (this.employee?.id) {
      this.router.navigate(['/employee-management/employees/edit', this.employee.id]);
    }
  }
}
