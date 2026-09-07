import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IEmployee } from '../../../../interfaces/employee.interface';
import { ToastService } from '../../../../core/services/toast.service';
import { DepartmentService } from '../department/department.service';
import { IDepartment } from '../../../../interfaces/department.interface';
import { EmployeeFacade } from '../../state/employee.facade';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-list',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.css']
})
export class EmployeeListComponent implements OnInit, OnDestroy {
  employees: IEmployee[] = [];
  filteredEmployees: IEmployee[] = [];
  displayedEmployees: IEmployee[] = [];

  total = 0;
  page = 1;
  limit = 10;
  rowsPerPageOptions = [10, 20, 50];

  searchQuery = '';
  departmentFilter = '';
  statusFilter = '';

  isLoading = true;
  error = '';
  isDepartmentsLoading = true;
  departmentsLoadingError = '';
  
  showDeleteModal = false;
  employeeToDeleteId: string | null = null;
  isDeleting = false;

  // populated from the Department API at runtime
  departmentsMap: { [key: number]: string } = {};
  departments: IDepartment[] = [];
  private readonly destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private toastService: ToastService
    , private departmentService: DepartmentService,
    private employeeFacade: EmployeeFacade
  ) {}

  ngOnInit(): void {
    this.employeeFacade.employees$
      .pipe(takeUntil(this.destroy$))
      .subscribe((employees) => {
        this.employees = [...employees].sort((a, b) => Number(b.id) - Number(a.id));
        this.applyFilters();
      });
    this.employeeFacade.loading$
      .pipe(takeUntil(this.destroy$))
      .subscribe((loading) => this.isLoading = loading);
    this.employeeFacade.error$
      .pipe(takeUntil(this.destroy$))
      .subscribe((error) => this.error = error || '');

    this.loadDepartments();
    this.employeeFacade.loadEmployees();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadDepartments(): void {
    this.isDepartmentsLoading = true;
    this.departmentsLoadingError = '';

    this.departmentService.getDepartments().subscribe({
      next: (depts: IDepartment[]) => {
        this.departments = depts;
        // build map: numeric key -> departmentName
        this.departmentsMap = {};
        for (const d of depts) {
          const key = Number(d.id);
          if (!isNaN(key)) {
            this.departmentsMap[key] = d.departmentName;
          }
        }
        this.isDepartmentsLoading = false;
      },
      error: (err) => {
        console.error('Failed to load departments', err);
        this.departments = [];
        this.departmentsMap = {};
        this.departmentsLoadingError = 'Failed to load departments.';
        this.isDepartmentsLoading = false;
        // Employees remain independently available when departments fail.
      }
    });
  }

  onSearch(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchQuery = target.value.toLowerCase().trim();
    this.resetPage();
    this.applyFilters();
  }

  onFilterChange(): void {
    this.resetPage();
    this.applyFilters();
  }

  onRowsPerPageChange(event: Event): void {
    const selectedRows = Number((event.target as HTMLSelectElement).value);
    this.limit = selectedRows || 10;
    this.resetPage();
    this.updatePagination();
  }

  applyFilters(): void {
    const searchTerm = this.searchQuery.toLowerCase().trim();
    const departmentId = this.departmentFilter ? Number(this.departmentFilter) : null;
    const statusValue = this.statusFilter ? this.statusFilter.toLowerCase() : null;

    this.filteredEmployees = this.employees.filter((emp) => {
      const matchesDepartment =
        departmentId === null || emp.departmentId === departmentId;
      if (!matchesDepartment) {
        return false;
      }

      const matchesStatus =
        statusValue === null || String(emp.status ?? '').toLowerCase() === statusValue;
      if (!matchesStatus) {
        return false;
      }

      if (!searchTerm) {
        return true;
      }

      const fullName = `${emp.firstName ?? ''} ${emp.lastName ?? ''}`.toLowerCase();
      const email = String(emp.email ?? '').toLowerCase();
      const position = String(emp.position ?? '').toLowerCase();
      const id = String(emp.id ?? '');

      return (
        fullName.includes(searchTerm) ||
        email.includes(searchTerm) ||
        position.includes(searchTerm) ||
        id.includes(searchTerm)
      );
    });

    this.total = this.filteredEmployees.length;
    this.updatePagination();
  }

  updatePagination(): void {
    const totalPages = this.totalPages;
    if (this.page > totalPages) {
      this.page = totalPages;
    }
    if (this.page < 1) {
      this.page = 1;
    }

    const startIndex = (this.page - 1) * this.limit;
    this.displayedEmployees = this.filteredEmployees.slice(startIndex, startIndex + this.limit);
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.total / this.limit));
  }

  get pageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, index) => index + 1);
  }

  get startItem(): number {
    return this.total === 0 ? 0 : (this.page - 1) * this.limit + 1;
  }

  get endItem(): number {
    return Math.min(this.total, this.page * this.limit);
  }

  resetPage(): void {
    this.page = 1;
  }

  onPageChange(page: number): void {
    if (page < 1 || page > this.totalPages) {
      return;
    }

    this.page = page;
    this.updatePagination();
  }

  deleteEmployee(id?: string): void {
    if (!id) {
      return;
    }
    this.employeeToDeleteId = id;
    this.showDeleteModal = true;
  }

  confirmDelete(): void {
    if (!this.employeeToDeleteId) return;
    
    this.isDeleting = true;
    this.employeeFacade.deleteEmployee(this.employeeToDeleteId);
    this.toastService.showSuccess('Employee deleted successfully.');
    this.closeDeleteModal();
  }

  cancelDelete(): void {
    this.closeDeleteModal();
  }

  private closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.employeeToDeleteId = null;
    this.isDeleting = false;
  }

  viewEmployee(id?: string): void {
    if (!id) {
      return;
    }
    this.router.navigate(['/employee-management/employees/view', id]);
  }

  editEmployee(id?: string): void {
    if (!id) {
      return;
    }
    this.router.navigate(['/employee-management/employees/edit', id]);
  }

  addEmployee(): void {
    this.router.navigate(['/employee-management/employees/add']);
  }

  exportData(): void {
    console.log(this.employees);
  }

  getInitials(firstName: string, lastName: string): string {
    return (
      (firstName?.charAt(0) || '') +
      (lastName?.charAt(0) || '')
    ).toUpperCase();
  }

  getStatusClass(status: string): string {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'status-active';
      case 'on leave':
        return 'status-on-leave';
      case 'probation':
        return 'status-probation';
      default:
        return 'status-inactive';
    }
  }
}
