import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DepartmentService } from './department.service';
import { IDepartment } from '../../../../interfaces/department.interface';
import { ToastService } from '../../../../core/services/toast.service';

@Component({
  selector: 'app-department-list',
  templateUrl: './department.component.html'
})
export class DepartmentListComponent implements OnInit {
  departments: IDepartment[] = [];
  filteredDepartments: IDepartment[] = [];
  displayedDepartments: IDepartment[] = [];

  total = 0;
  page = 1;
  limit = 10;
  rowsPerPageOptions = [10, 20, 50];

  searchQuery = '';
  statusFilter = '';

  isLoading = false;
  error = '';
  
  showDeleteModal = false;
  departmentToDeleteId: string | null = null;
  isDeleting = false;

  constructor(
    private departmentService: DepartmentService,
    private router: Router,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadDepartments();
  }

  loadDepartments(): void {
    this.isLoading = true;
    this.error = '';

    this.departmentService.getDepartments().subscribe({
      next: (departments: IDepartment[]) => {
        this.departments = departments.sort((a, b) => Number(b.id) - Number(a.id));
        this.applyFilters();
        this.isLoading = false; 
      },
      error: (err) => {
        console.error(err);
        this.error = 'Failed to load departments';
        this.isLoading = false;
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

  applyFilters(): void {
    const searchTerm = this.searchQuery.toLowerCase().trim();
    const statusValue = this.statusFilter ? this.statusFilter.toLowerCase() : null;

    this.filteredDepartments = this.departments.filter((dept) => {
      const matchesStatus =
        statusValue === null || String(dept.status ?? '').toLowerCase() === statusValue;
      if (!matchesStatus) {
        return false;
      }

      if (!searchTerm) {
        return true;
      }

      const deptName = String(dept.departmentName ?? '').toLowerCase();
      const deptCode = String(dept.departmentCode ?? '').toLowerCase();
      const head = String(dept.headOfDepartment ?? '').toLowerCase();
      const id = String(dept.id ?? '');

      return (
        deptName.includes(searchTerm) ||
        deptCode.includes(searchTerm) ||
        head.includes(searchTerm) ||
        id.includes(searchTerm)
      );
    });

    this.total = this.filteredDepartments.length;
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
    this.displayedDepartments = this.filteredDepartments.slice(startIndex, startIndex + this.limit);
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

  deleteDepartment(id?: string): void {
    if (!id) {
      return;
    }
    this.departmentToDeleteId = id;
    this.showDeleteModal = true;
  }

  confirmDelete(): void {
    if (!this.departmentToDeleteId) return;
    
    this.isDeleting = true;
    this.departmentService.deleteDepartment(this.departmentToDeleteId).subscribe({
      next: () => {
        this.toastService.showSuccess('Department deleted successfully.');
        this.closeDeleteModal();
        this.loadDepartments();
      },
      error: (err) => {
        console.error(err);
        this.toastService.showError('Failed to delete department. Please try again.');
        this.closeDeleteModal();
      }
    });
  }

  cancelDelete(): void {
    this.closeDeleteModal();
  }

  private closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.departmentToDeleteId = null;
    this.isDeleting = false;
  }

  viewDepartment(id?: string): void {
    if (!id) {
      return;
    }
    this.router.navigate(['/employee-management/departments/view', id]);
  }

  editDepartment(id?: string): void {
    if (!id) {
      return;
    }
    this.router.navigate(['/employee-management/departments/edit', id]);
  }

  addDepartment(): void {
    this.router.navigate(['/employee-management/departments/add']);
  }

  exportData(): void {
    console.log(this.departments);
  }

  getInitials(name: string): string {
    if (!name) return 'D';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }
}

