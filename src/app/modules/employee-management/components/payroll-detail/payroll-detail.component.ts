import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { PayrollService } from '../../payroll.service';
import { EmployeeService } from '../../employee.service';

import { IEmployee } from '../../../../interfaces/employee.interface';

@Component({
  selector: 'app-payroll-detail',
  templateUrl: './payroll-detail.component.html',
  styleUrls: ['./payroll-detail.component.css']
})
export class PayrollDetailComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription = new Subscription();
  payrollForm!: FormGroup;
  isViewMode = false;
  isEditMode = false;
  isLoading = false;
  isSaving = false;
  payrollId: string | null = null;
  employees: IEmployee[] = [];
  selectedEmployee: IEmployee | null = null;
  statusOptions = ['Paid', 'Pending', 'Processing'];

  constructor(
    private fb: FormBuilder,
    private payrollService: PayrollService,
    private employeeService: EmployeeService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadEmployees();
    this.checkRouteAndMode();
  }

  private initForm(): void {
    this.payrollForm = this.fb.group({
      payrollId: [{ value: 'PAY' + Math.floor(Math.random() * 10000), disabled: true }],
      employeeId: ['', Validators.required],
      employeeName: ['', Validators.required],
      department: ['', Validators.required],
      designation: ['', Validators.required],
      month: ['', Validators.required],
      basicSalary: [0, [Validators.required, Validators.min(0)]],
      allowance: [0, [Validators.min(0)]],
      bonus: [0, [Validators.min(0)]],
      deduction: [0, [Validators.min(0)]],
      netSalary: [{ value: 0, disabled: true }],
      status: ['Pending', Validators.required],
      remarks: ['']
    });

    // Auto-calculate Net Salary on value changes
    this.subscriptions.add(this.payrollForm.valueChanges.subscribe(() => {
      if (!this.isViewMode) {
        this.calculateNetSalary();
      }
    }));
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private calculateNetSalary(): void {
    const basic = Number(this.payrollForm.get('basicSalary')?.value || 0);
    const allowance = Number(this.payrollForm.get('allowance')?.value || 0);
    const bonus = Number(this.payrollForm.get('bonus')?.value || 0);
    const deduction = Number(this.payrollForm.get('deduction')?.value || 0);
    const net = (basic + allowance + bonus) - deduction;
    
    // Only patch if different to prevent infinite loops
    if (this.payrollForm.get('netSalary')?.value !== net) {
      this.payrollForm.patchValue({ netSalary: net }, { emitEvent: false });
    }
  }

  private loadEmployees(): void {
    this.employeeService.getEmployees().subscribe(data => {
      this.employees = data;
    });
  }

  onEmployeeSelect(event: any): void {
    const empId = event.target.value;
    if (!empId) {
      this.selectedEmployee = null;
      this.payrollForm.patchValue({
        employeeName: '',
        department: '',
        designation: '',
        basicSalary: 0
      });
      return;
    }

    const emp = this.employees.find(e => e.id === empId);
    if (emp) {
      this.selectedEmployee = emp;
      this.payrollForm.patchValue({
        employeeName: `${emp.firstName} ${emp.lastName}`,
        department: emp.departmentId.toString(),
        designation: emp.position,
        basicSalary: emp.salary || 0
      });
    }
  }

  private checkRouteAndMode(): void {
    const url = this.router.url;
    this.payrollId = this.route.snapshot.paramMap.get('id');

    if (url.includes('/view/')) {
      this.isViewMode = true;
      if (this.payrollId) this.loadPayroll(this.payrollId);
    } else if (url.includes('/edit/')) {
      this.isEditMode = true;
      if (this.payrollId) this.loadPayroll(this.payrollId);
    }
  }

  private loadPayroll(id: string): void {
    this.isLoading = true;
    this.payrollService.getPayrollById(id)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (data) => {
          this.payrollForm.patchValue({
            ...data,
            payrollId: data.payrollId || data.id // MockAPI mapping fallback
          }, { emitEvent: false });
          // Ensure calculation runs once loaded
          this.calculateNetSalary();
        },
        error: (err) => console.error('Error fetching payroll', err)
      });
  }

  onSubmit(): void {
    if (this.payrollForm.invalid || this.isViewMode) {
      this.payrollForm.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    // Extract raw value to get disabled fields (netSalary, payrollId)
    const formData = this.payrollForm.getRawValue();

    if (this.isEditMode && this.payrollId) {
      this.payrollService.updatePayroll(this.payrollId, formData)
        .pipe(finalize(() => this.isSaving = false))
        .subscribe(() => {
          this.router.navigate(['/employee-management/payroll']);
        });
    } else {
      this.payrollService.addPayroll(formData)
        .pipe(finalize(() => this.isSaving = false))
        .subscribe(() => {
          this.router.navigate(['/employee-management/payroll']);
        });
    }
  }

  cancel(): void {
    this.router.navigate(['/employee-management/payroll']);
  }
}
