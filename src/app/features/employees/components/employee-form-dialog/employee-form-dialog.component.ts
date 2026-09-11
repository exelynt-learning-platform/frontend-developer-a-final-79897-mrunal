import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Subject, filter, takeUntil } from 'rxjs';
import { Employee, EmployeeFormData } from '../../../../core/models/employee.model';
import { EmployeeFormComponent } from '../employee-form/employee-form.component';
import { selectAllCountries, selectCountriesLoading } from '../../../../store/countries/country.selectors';
import { selectActionInProgress } from '../../../../store/employees/employee.selectors';
import {
  createEmployee,
  createEmployeeSuccess,
  createEmployeeFailure,
  updateEmployee,
  updateEmployeeSuccess,
  updateEmployeeFailure
} from '../../../../store/employees/employee.actions';

export interface FormDialogData {
  employee?: Employee;
}

@Component({
  selector: 'app-employee-form-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
    EmployeeFormComponent
  ],
  templateUrl: './employee-form-dialog.component.html',
  styleUrls: ['./employee-form-dialog.component.scss']
})
export class EmployeeFormDialogComponent implements OnInit, OnDestroy {
  countries$ = this.store.select(selectAllCountries);
  countriesLoading$ = this.store.select(selectCountriesLoading);
  submitting$ = this.store.select(selectActionInProgress);

  private destroy$ = new Subject<void>();
  private submitted = false;
  private requestId: string | null = null;

  constructor(
    public dialogRef: MatDialogRef<EmployeeFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: FormDialogData,
    private store: Store,
    private actions$: Actions
  ) {}

  ngOnInit(): void {
    this.submitted = false;

    this.actions$.pipe(
      ofType(createEmployeeSuccess, updateEmployeeSuccess),
      filter((action) => this.submitted && action.requestId === this.requestId),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.submitted = false;
      this.requestId = null;
      this.dialogRef.close(true);
    });

    this.actions$.pipe(
      ofType(createEmployeeFailure, updateEmployeeFailure),
      filter((action) => this.submitted && action.requestId === this.requestId),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.submitted = false;
    });
  }

  ngOnDestroy(): void {
    this.submitted = false;
    this.requestId = null;
    this.destroy$.next();
    this.destroy$.complete();
  }

  get isEdit(): boolean {
    return !!this.data?.employee;
  }

  onSubmit(formData: EmployeeFormData): void {
    if (this.submitted) {
      return;
    }

    this.submitted = true;
    this.requestId = `${Date.now()}-${Math.random()}`;
    if (this.isEdit && this.data.employee) {
      this.store.dispatch(
        updateEmployee({
          id: this.data.employee.id,
          changes: formData,
          requestId: this.requestId
        })
      );
    } else {
      this.store.dispatch(createEmployee({ employee: formData, requestId: this.requestId }));
    }
  }

  onCancel(): void {
    this.submitted = false;
    this.requestId = null;
    this.dialogRef.close(false);
  }
}
