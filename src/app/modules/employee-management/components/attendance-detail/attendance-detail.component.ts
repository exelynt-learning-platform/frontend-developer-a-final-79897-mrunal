import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AttendanceService } from '../../attendance.service';
import { EmployeeService } from '../../employee.service';
import { DepartmentService } from '../department/department.service';
import { ToastService } from '../../../../core/services/toast.service';
import { IEmployee } from '../../../../interfaces/employee.interface';
import { IDepartment } from '../../../../interfaces/department.interface';
import { Attendance } from '../../../../interfaces/attendance.interface';

@Component({
  selector: 'app-attendance-detail',
  templateUrl: './attendance-detail.component.html',
  styleUrls: ['./attendance-detail.component.css']
})
export class AttendanceDetailComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription = new Subscription();
  attendanceForm!: FormGroup;
  employees: IEmployee[] = [];
  departments: IDepartment[] = [];
  
  isLoading = false;
  isSaving = false;
  isAddMode = false;
  isEditMode = false;
  isViewMode = false;
  submitError = '';
  successMessage = '';

  statusOptions = [
    'Present',
    'Absent',
    'Half Day',
    'Leave'
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private attendanceService: AttendanceService,
    private employeeService: EmployeeService,
    private departmentService: DepartmentService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    const routePath = this.route.snapshot.routeConfig?.path;
    this.isAddMode = routePath === 'attendance/add';
    this.isEditMode = routePath === 'attendance/edit/:id';
    this.isViewMode = routePath === 'attendance/view/:id';

    this.initializeForm();
    this.loadEmployeesAndDepartments();

    const id = this.route.snapshot.paramMap.get('id');
    if (id && (this.isEditMode || this.isViewMode)) {
      this.loadAttendance(id);
    }
    
    // Subscribe to time changes to calculate working hours
    this.subscriptions.add(this.attendanceForm.get('checkIn')?.valueChanges.subscribe(() => this.calculateWorkingHours()));
    this.subscriptions.add(this.attendanceForm.get('checkOut')?.valueChanges.subscribe(() => this.calculateWorkingHours()));
    this.subscriptions.add(this.attendanceForm.get('status')?.valueChanges.subscribe((status) => {
      if (status === 'Absent' || status === 'Leave') {
        this.attendanceForm.patchValue({ workingHours: '0h' });
      } else {
        this.calculateWorkingHours();
      }
    }));
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  initializeForm(): void {
    this.attendanceForm = this.fb.group({
      selectedEmployee: ['', Validators.required],
      employeeId: [{ value: '', disabled: true }],
      employeeName: [{ value: '', disabled: true }],
      department: [{ value: '', disabled: true }],
      date: ['', Validators.required],
      checkIn: [''],
      checkOut: [''],
      workingHours: [{ value: '0h', disabled: true }],
      status: ['Present', Validators.required],
      remarks: ['']
    });

    if (this.isViewMode) {
      // Form is handled via readonly attributes in HTML to maintain styling
    }
  }

  loadEmployeesAndDepartments(): void {
    this.isLoading = true;
    this.employeeService.getEmployees().subscribe({
      next: (emps) => {
        this.employees = emps;
        this.departmentService.getDepartments().subscribe({
          next: (depts) => {
            this.departments = depts;
            this.isLoading = false;
          },
          error: (err) => {
            console.error('Error loading departments', err);
            this.isLoading = false;
          }
        });
      },
      error: (err) => {
        console.error('Error loading employees', err);
        this.isLoading = false;
      }
    });
  }

  loadAttendance(id: string): void {
    this.isLoading = true;
    this.attendanceService.getAttendanceById(id).subscribe({
      next: (data) => {
        // Extract original numeric employee ID if possible from formatted EMP-XXX
        let empSelect = '';
        const empIdStr = String(data.employeeId || '');
        if (empIdStr.startsWith('EMP-')) {
          empSelect = parseInt(empIdStr.replace('EMP-', ''), 10).toString();
        } else {
          empSelect = empIdStr;
        }

        this.attendanceForm.patchValue({
          selectedEmployee: empSelect,
          employeeId: data.employeeId,
          employeeName: data.employeeName,
          department: data.department,
          date: data.date,
          checkIn: data.checkIn,
          checkOut: data.checkOut,
          workingHours: data.workingHours,
          status: data.status,
          remarks: data.remarks
        });
        this.isLoading = false;
      },
      error: () => {
        this.submitError = 'Failed to load attendance details.';
        this.toastService.showError(this.submitError);
        this.isLoading = false;
      }
    });
  }

  onEmployeeSelect(event: any): void {
    const empId = event.target.value;
    const selectedEmp = this.employees.find(e => e.id && e.id.toString() === empId);
    
    if (selectedEmp) {
      const empName = `${selectedEmp.firstName} ${selectedEmp.lastName}`;
      const dept = this.departments.find(d => d.id && selectedEmp.departmentId && d.id.toString() === selectedEmp.departmentId.toString());
      const deptName = dept ? dept.departmentName : 'Unknown';
      const formattedEmpId = selectedEmp.id ? `EMP-${selectedEmp.id.toString().padStart(4, '0')}` : '';

      this.attendanceForm.patchValue({
        employeeId: formattedEmpId,
        employeeName: empName,
        department: deptName
      });
    } else {
      this.attendanceForm.patchValue({
        employeeId: '',
        employeeName: '',
        department: ''
      });
    }
  }

  calculateWorkingHours(): void {
    const status = this.attendanceForm.get('status')?.value;
    if (status === 'Absent' || status === 'Leave') {
      this.attendanceForm.patchValue({ workingHours: '0h' });
      return;
    }

    const checkIn = this.attendanceForm.get('checkIn')?.value;
    const checkOut = this.attendanceForm.get('checkOut')?.value;

    if (checkIn && checkOut) {
      const [inH, inM] = checkIn.split(':').map(Number);
      const [outH, outM] = checkOut.split(':').map(Number);
      
      let inMinutes = inH * 60 + inM;
      let outMinutes = outH * 60 + outM;

      if (outMinutes > inMinutes) {
        const diff = outMinutes - inMinutes;
        const hours = Math.floor(diff / 60);
        const mins = diff % 60;
        this.attendanceForm.patchValue({ workingHours: `${hours}h ${mins.toString().padStart(2, '0')}m` });
      } else {
        this.attendanceForm.patchValue({ workingHours: '0h 00m' });
      }
    }
  }

  get f() { return this.attendanceForm.controls; }

  isInvalid(controlName: string): boolean {
    const control = this.attendanceForm.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  onSubmit(): void {
    if (this.attendanceForm.invalid) {
      Object.keys(this.attendanceForm.controls).forEach(key => {
        this.attendanceForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.isSaving = true;
    this.submitError = '';
    
    const rawData = this.attendanceForm.getRawValue();
    
    const formData: Attendance = {
      employeeId: rawData.employeeId,
      employeeName: rawData.employeeName,
      department: rawData.department,
      date: rawData.date,
      checkIn: rawData.checkIn,
      checkOut: rawData.checkOut,
      workingHours: rawData.workingHours,
      status: rawData.status,
      remarks: rawData.remarks
    };

    const formId = this.route.snapshot.paramMap.get('id');

    if (this.isEditMode && formId) {
      this.attendanceService.updateAttendance(formId, formData).subscribe({
        next: () => {
          this.toastService.showSuccess('Attendance updated successfully.');
          this.router.navigate(['/employee-management/attendance']);
        },
        error: () => {
          this.submitError = 'Failed to update attendance.';
          this.isSaving = false;
        }
      });
    } else {
      this.attendanceService.addAttendance(formData).subscribe({
        next: () => {
          this.toastService.showSuccess('Attendance added successfully.');
          this.router.navigate(['/employee-management/attendance']);
        },
        error: () => {
          this.submitError = 'Failed to add attendance.';
          this.isSaving = false;
        }
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/employee-management/attendance']);
  }
}
