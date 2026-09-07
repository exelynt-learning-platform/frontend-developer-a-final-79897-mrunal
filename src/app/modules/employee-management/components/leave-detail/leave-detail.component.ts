import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { LeaveService } from '../../leave.service';
import { ToastService } from '../../../../core/services/toast.service';
import { ILeave } from '../../../../interfaces/leave.interface';
import { EmployeeService } from '../../employee.service';
import { IEmployee } from '../../../../interfaces/employee.interface';

@Component({
  selector: 'app-leave-detail',
  templateUrl: './leave-detail.component.html',
  styleUrls: ['./leave-detail.component.css']
})
export class LeaveDetailComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription = new Subscription();
  leave?: ILeave;
  leaveForm!: FormGroup;
  employees: IEmployee[] = [];
  
  isLoading = true;
  isSaving = false;
  error = '';
  submitError = '';
  
  isAddMode = false;
  isEditMode = false;
  isViewMode = false;
  
  isEmployeesLoading = false;
  employeesLoadingError = '';

  leaveTypeOptions = [
    'Sick Leave',
    'Casual Leave',
    'Annual Leave',
    'Maternity Leave',
    'Emergency Leave',
    'Work From Home'
  ];

  statusOptions = [
    'Pending',
    'Approved',
    'Rejected'
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private leaveService: LeaveService,
    private employeeService: EmployeeService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadEmployees();

    const routePath = this.route.snapshot.routeConfig?.path;
    const idParam = this.route.snapshot.paramMap.get('id');

    this.isAddMode = routePath === 'leave/add';
    this.isEditMode = routePath === 'leave/edit/:id';
    this.isViewMode = routePath === 'leave/view/:id';

    if (this.isAddMode) {
      this.isLoading = false;
      return;
    }

    const id = idParam ? idParam : null;
    if (id && (this.isEditMode || this.isViewMode)) {
      this.loadLeaveForEdit(id);
      return;
    }

    if (id) {
      this.loadLeave(id);
      return;
    }

    this.error = 'Leave route is invalid.';
    this.isLoading = false;
  }

  dateRangeValidator(group: AbstractControl): ValidationErrors | null {
    const start = group.get('startDate')?.value;
    const end = group.get('endDate')?.value;

    if (start && end && new Date(end) < new Date(start)) {
      return { dateRange: true };
    }
    return null;
  }

  initializeForm(): void {
    this.leaveForm = this.fb.group({
      employeeId: ['', Validators.required], // Actually holds the selected employee's ID from dropdown
      employeeName: [''], // Auto filled
      leaveType: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      reason: ['', [Validators.required, Validators.minLength(5)]],
      status: ['Pending', Validators.required]
    }, { validators: this.dateRangeValidator });

    // When employeeId changes, auto-fill employeeName
    this.subscriptions.add(this.leaveForm.get('employeeId')?.valueChanges.subscribe(id => {
      const emp = this.employees.find(e => String(e.id) === String(id));
      if (emp) {
        const fullName = `${emp.firstName ?? ''} ${emp.lastName ?? ''}`.trim();
        this.leaveForm.patchValue({ employeeName: fullName }, { emitEvent: false });
      } else {
        this.leaveForm.patchValue({ employeeName: '' }, { emitEvent: false });
      }
    }));
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  loadEmployees(): void {
    this.isEmployeesLoading = true;
    this.employeesLoadingError = '';

    this.employeeService.getEmployees().subscribe({
      next: (data) => {
        this.employees = data;
        this.isEmployeesLoading = false;
      },
      error: (err) => {
        console.error('Employee load failed:', err);
        this.employeesLoadingError = 'Failed to load employees.';
        this.isEmployeesLoading = false;
      }
    });
  }

  loadLeaveForEdit(id: string): void {
    this.isLoading = true;
    this.leaveService.getLeaveById(id).subscribe({
      next: (leave) => {
        this.leave = leave;
        this.leaveForm.patchValue({
          ...leave,
          // Format dates to YYYY-MM-DD for input[type="date"]
          startDate: leave.startDate ? new Date(leave.startDate).toISOString().split('T')[0] : '',
          endDate: leave.endDate ? new Date(leave.endDate).toISOString().split('T')[0] : ''
        });
        this.isLoading = false;
      },
      error: () => {
        this.error = 'Failed to load leave details.';
        this.isLoading = false;
      }
    });
  }

  loadLeave(id: string): void {
    this.isLoading = true;
    this.leaveService.getLeaveById(id).subscribe({
      next: (leave) => {
        this.leave = leave;
        this.isLoading = false;
      },
      error: () => {
        this.error = 'Failed to load leave details.';
        this.isLoading = false;
      }
    });
  }

  get f() {
    return this.leaveForm.controls;
  }

  isInvalid(controlName: string): boolean {
    const control = this.leaveForm.get(controlName);
    if (!control) return false;
    
    let isFieldInvalid = control.invalid && (control.dirty || control.touched);
    
    if (controlName === 'endDate') {
      const hasDateRangeError = this.leaveForm.hasError('dateRange');
      const startControl = this.leaveForm.get('startDate');
      const isDateTouched = (control.dirty || control.touched) || (startControl?.dirty || startControl?.touched);
      isFieldInvalid = isFieldInvalid || (!!hasDateRangeError && !!isDateTouched);
    }
    
    return isFieldInvalid;
  }

  cancel(): void {
    this.router.navigate(['/employee-management/leave']);
  }

  onSubmit(): void {
    if (this.leaveForm.invalid) {
      this.leaveForm.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    this.submitError = '';

    const leavePayload: ILeave = {
      ...this.leaveForm.value
    };

    if (this.isEditMode && this.leave?.id) {
      this.leaveService.updateLeave(this.leave.id, leavePayload).subscribe({
        next: () => {
          this.isSaving = false;
          this.toastService.showSuccess('Leave updated successfully.');
          this.router.navigate(['/employee-management/leave']);
        },
        error: () => {
          this.isSaving = false;
          this.toastService.showError('Failed to update leave. Please try again.');
        }
      });
      return;
    }

    if (this.isAddMode) {
      this.leaveService.createLeave(leavePayload).subscribe({
        next: () => {
          this.isSaving = false;
          this.toastService.showSuccess('Leave created successfully.');
          this.router.navigate(['/employee-management/leave']);
        },
        error: () => {
          this.isSaving = false;
          this.toastService.showError('Failed to create leave. Please try again.');
        }
      });
      return;
    }

    this.submitError = 'Form cannot be submitted in view mode.';
    this.isSaving = false;
  }

  goBack(): void {
    this.router.navigate(['/employee-management/leave']);
  }
getEmployeeName(): string {
  const employeeId = this.leaveForm.get('employeeId')?.value;

  const employee = this.employees.find(
    emp => emp.id?.toString() === employeeId?.toString()
  );

  return employee
    ? `${employee.firstName} ${employee.lastName}`
    : '';
}
  editLeave(): void {
    if (this.leave?.id) {
      this.router.navigate(['/employee-management/leave/edit', this.leave.id]);
    }
  }
}
