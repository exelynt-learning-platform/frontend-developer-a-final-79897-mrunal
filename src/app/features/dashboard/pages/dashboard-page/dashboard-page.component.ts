import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
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
  totalEmployees$ = this.store.select(selectEmployeeTotal);
  totalCountries$ = this.store.select(selectCountryTotal);
  employeesLoading$ = this.store.select(selectEmployeesLoading);
  countriesLoading$ = this.store.select(selectCountriesLoading);

  // Recently added employees (top 5 sorted by id or createdAt)
  recentEmployees$: Observable<Employee[]> = this.store.select(selectAllEmployees).pipe(
    map((employees) => employees.slice(0, 5))
  );

  // Country presence list
  countries$ = this.store.select(selectAllCountries);

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.store.dispatch(loadEmployees());
    this.store.dispatch(loadCountries());
  }
}
