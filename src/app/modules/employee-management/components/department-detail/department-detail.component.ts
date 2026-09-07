import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DepartmentService } from '../department/department.service';
import { ToastService } from '../../../../core/services/toast.service';
import { IDepartment } from '../../../../interfaces/department.interface';

@Component({
  selector: 'app-department-detail',
  templateUrl: './department-detail.component.html'
})
export class DepartmentDetailComponent implements OnInit {

  department?: IDepartment;
  departmentForm!: FormGroup;
  isLoading = true;
  isSaving = false;
  error = '';
  submitError = '';
  successMessage = '';
  isAddMode = false;
  isEditMode = false;
  isViewMode = false;
  
  statusOptions = [
    'Active',
    'Inactive'
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private departmentService: DepartmentService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  
    const routePath = this.route.snapshot.routeConfig?.path;
    const idParam = this.route.snapshot.paramMap.get('id');

    this.isAddMode = routePath === 'departments/add';
    this.isEditMode = routePath === 'departments/edit/:id';
    this.isViewMode = routePath === 'departments/view/:id';

    if (this.isAddMode) {
      this.isLoading = false;
      return;
    }

    const id = idParam ? idParam : null;
    if (id && (this.isEditMode || this.isViewMode)) {
      this.loadDepartmentForEdit(id);
      return;
    }

    if (id) {
      this.loadDepartment(id);
      return;
    }

    this.error = 'Department route is invalid.';
    this.isLoading = false;
  }

  initializeForm(): void {
    this.departmentForm = this.fb.group({
      departmentName: ['', Validators.required],
      departmentCode: ['', Validators.required],
      headOfDepartment: ['', Validators.required],
      totalEmployees: [0, [Validators.required, Validators.min(0)]],
      status: ['Active', Validators.required]
    });
  }

  loadDepartmentForEdit(id: string): void {
    this.isLoading = true;
    this.departmentService.getDepartmentById(id).subscribe({
      next: (dept) => {
        this.department = dept;
        this.departmentForm.patchValue(dept);
        this.isLoading = false;
      },
      error: () => {
        this.error = 'Failed to load department details.';
        this.isLoading = false;
      }
    });
  }

  loadDepartment(id: string): void {
    this.isLoading = true;
    this.departmentService.getDepartmentById(id).subscribe({
      next: (dept) => {
        this.department = dept;
        this.isLoading = false;
      },
      error: () => {
        this.error = 'Failed to load department details.';
        this.isLoading = false;
      }
    });
  }

  get f() {
    return this.departmentForm.controls;
  }

  isInvalid(controlName: string): boolean {
    const control = this.departmentForm.get(controlName);
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  cancel(): void {
    this.router.navigate(['/employee-management/departments']);
  }

  onSubmit(): void {
    if (this.departmentForm.invalid) {
      this.departmentForm.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    this.submitError = '';
    this.successMessage = '';

    const departmentPayload: IDepartment = {
      ...this.departmentForm.value,
      totalEmployees: Number(this.departmentForm.value.totalEmployees)
    };

    if (this.isEditMode && this.department?.id) {
      this.departmentService.updateDepartment(this.department.id, departmentPayload).subscribe({
        next: () => {
          this.isSaving = false;
          this.toastService.showSuccess('Department updated successfully.');
          this.router.navigate(['/employee-management/departments']);
        },
        error: () => {
          this.isSaving = false;
          this.toastService.showError('Failed to update department. Please try again.');
        }
      });
      return;
    }

    if (this.isAddMode) {
      this.departmentService.addDepartment(departmentPayload).subscribe({
        next: () => {
          this.isSaving = false;
          this.toastService.showSuccess('Department created successfully.');
          this.router.navigate(['/employee-management/departments']);
        },
        error: () => {
          this.isSaving = false;
          this.toastService.showError('Failed to create department. Please try again.');
        }
      });
      return;
    }

    this.submitError = 'Form cannot be submitted in view mode.';
    this.isSaving = false;
  }

  goBack(): void {
    this.router.navigate(['/employee-management/departments']);
  }

  editDepartment(): void {
    if (this.department?.id) {
      this.router.navigate(['/employee-management/departments/edit', this.department.id]);
    }
  }
}
