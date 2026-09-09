import { Component, OnInit, ChangeDetectionStrategy, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { Store } from '@ngrx/store';
import { Observable, map } from 'rxjs';

import { Employee } from '../../../../core/models/employee.model';
import {
  selectAllEmployees,
  selectEmployeeTotal,
  selectEmployeesLoading
} from '../../../../store/employees/employee.selectors';
import {
  selectAllCountries,
  selectCountryTotal,
  selectCountriesLoading
} from '../../../../store/countries/country.selectors';
import { loadEmployees } from '../../../../store/employees/employee.actions';
import { loadCountries } from '../../../../store/countries/country.actions';
import { LoadingStateComponent } from '../../../../shared/components/loading-state/loading-state.component';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    LoadingStateComponent
  ],
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardPageComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);

  totalEmployees$ = this.store.select(selectEmployeeTotal).pipe(takeUntilDestroyed(this.destroyRef));
  totalCountries$ = this.store.select(selectCountryTotal).pipe(takeUntilDestroyed(this.destroyRef));
  employeesLoading$ = this.store.select(selectEmployeesLoading).pipe(takeUntilDestroyed(this.destroyRef));
  countriesLoading$ = this.store.select(selectCountriesLoading).pipe(takeUntilDestroyed(this.destroyRef));

  // Recently added employees (top 5 sorted by id or createdAt)
  recentEmployees$: Observable<Employee[]> = this.store.select(selectAllEmployees).pipe(
    map((employees) => employees.slice(0, 5)),
    takeUntilDestroyed(this.destroyRef)
  );

  // Country presence list
  countries$ = this.store.select(selectAllCountries).pipe(takeUntilDestroyed(this.destroyRef));

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.store.dispatch(loadEmployees());
    this.store.dispatch(loadCountries({}));
  }
}
