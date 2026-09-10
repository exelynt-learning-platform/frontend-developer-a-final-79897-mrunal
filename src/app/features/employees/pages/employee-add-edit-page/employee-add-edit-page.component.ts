import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Observable, Subject, takeUntil, map, filter, take } from 'rxjs';
import { Employee, EmployeeFormData } from '../../../../core/models/employee.model';
import { EmployeeFormComponent } from '../../components/employee-form/employee-form.component';
import { LoadingStateComponent } from '../../../../shared/components/loading-state/loading-state.component';
import { ErrorStateComponent } from '../../../../shared/components/error-state/error-state.component';
import { selectAllCountries, selectCountriesLoading } from '../../../../store/countries/country.selectors';
import { loadCountries } from '../../../../store/countries/country.actions';
import {
  createEmployee,
  createEmployeeSuccess,
  updateEmployee,
  updateEmployeeSuccess,
  loadEmployeeById
} from '../../../../store/employees/employee.actions';
import {
  selectEmployeeById,
  selectActionInProgress,
  selectSearchLoading,
  selectSearchError
} from '../../../../store/employees/employee.selectors';

@Component({
  selector: 'app-employee-add-edit-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    EmployeeFormComponent,
    LoadingStateComponent,
    ErrorStateComponent
  ],
  templateUrl: './employee-add-edit-page.component.html',
  styleUrls: ['./employee-add-edit-page.component.scss']
})
export class EmployeeAddEditPageComponent implements OnInit, OnDestroy {
  isEdit = false;
  employeeId: string | null = null;
  employee: Employee | null = null;

  countries$ = this.store.select(selectAllCountries);
  countriesLoading$ = this.store.select(selectCountriesLoading);
  submitting$ = this.store.select(selectActionInProgress);
  loading$ = this.store.select(selectSearchLoading);
  error$ = this.store.select(selectSearchError);

  private destroy$ = new Subject<void>();
  private submitted = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store,
    private actions$: Actions
  ) {}

  ngOnInit(): void {
    this.store.dispatch(loadCountries({}));

    this.employeeId = this.route.snapshot.paramMap.get('id');
    this.isEdit = !!this.employeeId;

    if (this.isEdit && this.employeeId) {
      this.store.dispatch(loadEmployeeById({ id: this.employeeId }));
      this.store
        .select(selectEmployeeById(this.employeeId))
        .pipe(
          filter((emp): emp is Employee => !!emp),
          take(1),
          takeUntil(this.destroy$)
        )
        .subscribe((emp) => {
          this.employee = emp;
        });
    }

    this.actions$.pipe(
      ofType(createEmployeeSuccess, updateEmployeeSuccess),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      if (this.submitted) {
        this.router.navigate(['/employees']);
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSubmit(formData: EmployeeFormData): void {
    this.submitted = true;
    if (this.isEdit && this.employeeId) {
      this.store.dispatch(
        updateEmployee({
          id: this.employeeId,
          changes: formData
        })
      );
    } else {
      this.store.dispatch(createEmployee({ employee: formData }));
    }
  }

  onCancel(): void {
    this.router.navigate(['/employees']);
  }

  onRetry(): void {
    if (this.employeeId) {
      this.store.dispatch(loadEmployeeById({ id: this.employeeId }));
    }
  }
}
