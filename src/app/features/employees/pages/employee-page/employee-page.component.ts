import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Observable, BehaviorSubject } from 'rxjs';

import { Employee } from '../../../../core/models/employee.model';
import { EmployeeTableComponent } from '../../components/employee-table/employee-table.component';
import { EmployeeSearchComponent } from '../../components/employee-search/employee-search.component';
import { LoadingStateComponent } from '../../../../shared/components/loading-state/loading-state.component';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { ErrorStateComponent } from '../../../../shared/components/error-state/error-state.component';
import { EmployeeDeleteDialogComponent } from '../../../../shared/components/employee-delete-dialog/employee-delete-dialog.component';
import { EmployeeFormDialogComponent } from '../../components/employee-form-dialog/employee-form-dialog.component';

import {
  loadEmployees,
  loadEmployeeById,
  clearEmployeeSearch,
  deleteEmployee
} from '../../../../store/employees/employee.actions';
import {
  selectAllEmployees,
  selectEmployeeTotal,
  selectEmployeesLoading,
  selectEmployeesError,
  selectSearchedEmployee,
  selectSearchLoading,
  selectSearchError,
  selectActionInProgress
} from '../../../../store/employees/employee.selectors';
import {
  selectCountryTotal
} from '../../../../store/countries/country.selectors';
import { loadCountries } from '../../../../store/countries/country.actions';

@Component({
  selector: 'app-employee-page',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatDialogModule,
    EmployeeTableComponent,
    EmployeeSearchComponent,
    LoadingStateComponent,
    EmptyStateComponent,
    ErrorStateComponent
  ],
  templateUrl: './employee-page.component.html',
  styleUrls: ['./employee-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmployeePageComponent implements OnInit {
  employees$ = this.store.select(selectAllEmployees);
  totalEmployees$ = this.store.select(selectEmployeeTotal);
  loading$ = this.store.select(selectEmployeesLoading);
  error$ = this.store.select(selectEmployeesError);

  searchedEmployee$ = this.store.select(selectSearchedEmployee);
  searchLoading$ = this.store.select(selectSearchLoading);
  searchError$ = this.store.select(selectSearchError);
  actionInProgress$ = this.store.select(selectActionInProgress);

  totalCountries$ = this.store.select(selectCountryTotal);
  currentSearchTerm: string | null = null;

  // Single source of truth for search active state
  private searchActiveSubject = new BehaviorSubject<boolean>(false);
  readonly isSearching$: Observable<boolean> = this.searchActiveSubject.asObservable();

  constructor(
    private store: Store,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.store.dispatch(loadEmployees());
    this.store.dispatch(loadCountries({}));
  }

  onRefresh(): void {
    this.currentSearchTerm = null;
    this.searchActiveSubject.next(false);
    this.store.dispatch(clearEmployeeSearch());
    this.store.dispatch(loadEmployees());
    this.store.dispatch(loadCountries({ force: true }));
  }

  onSearch(id: string): void {
    this.currentSearchTerm = id;
    this.searchActiveSubject.next(true);
    this.store.dispatch(loadEmployeeById({ id }));
  }

  onClearSearch(): void {
    this.currentSearchTerm = null;
    this.searchActiveSubject.next(false);
    this.store.dispatch(clearEmployeeSearch());
  }

  onAddEmployee(): void {
    this.dialog.open(EmployeeFormDialogComponent, {
      width: '640px',
      maxWidth: '95vw',
      disableClose: true,
      data: {}
    });
  }

  onEditEmployee(employee: Employee): void {
    this.dialog.open(EmployeeFormDialogComponent, {
      width: '640px',
      maxWidth: '95vw',
      disableClose: true,
      data: { employee }
    });
  }

  onDeleteEmployee(employee: Employee): void {
    const dialogRef = this.dialog.open(EmployeeDeleteDialogComponent, {
      width: '460px',
      maxWidth: '95vw',
      data: { employee }
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.store.dispatch(deleteEmployee({ id: employee.id }));
      }
    });
  }
}
