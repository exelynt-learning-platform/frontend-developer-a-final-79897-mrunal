import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LeaveService } from '../../leave.service';
import { ILeave } from '../../../../interfaces/leave.interface';
import { ToastService } from '../../../../core/services/toast.service';

@Component({
  selector: 'app-leave',
  templateUrl: './leave.component.html',
  styleUrls: ['./leave.component.css']
})
export class LeaveManagementComponent implements OnInit {
  leaves: ILeave[] = [];
  filteredLeaves: ILeave[] = [];
  displayedLeaves: ILeave[] = [];

  total = 0;
  page = 1;
  limit = 10;
  rowsPerPageOptions = [10, 20, 50];

  searchQuery = '';
  leaveTypeFilter = '';
  statusFilter = '';

  isLoading = false;
  error = '';
  
  showDeleteModal = false;
  leaveToDeleteId: string | null = null;
  isDeleting = false;

  constructor(
    private leaveService: LeaveService,
    private router: Router,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadLeaves();
  }

  loadLeaves(): void {
    this.isLoading = true;
    this.error = '';

    this.leaveService.getLeaves().subscribe({
      next: (leaves: ILeave[]) => {
        this.leaves = leaves.sort((a, b) => Number(b.id) - Number(a.id));
        this.applyFilters();
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.error = 'Failed to load leaves';
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

  onRowsPerPageChange(event: Event): void {
    const selectedRows = Number((event.target as HTMLSelectElement).value);
    this.limit = selectedRows || 10;
    this.resetPage();
    this.updatePagination();
  }

  applyFilters(): void {
    const searchTerm = this.searchQuery.toLowerCase().trim();
    const leaveTypeValue = this.leaveTypeFilter ? this.leaveTypeFilter.toLowerCase() : null;
    const statusValue = this.statusFilter ? this.statusFilter.toLowerCase() : null;

    this.filteredLeaves = this.leaves.filter((leave) => {
      const matchesLeaveType =
        leaveTypeValue === null || String(leave.leaveType ?? '').toLowerCase() === leaveTypeValue;
      if (!matchesLeaveType) {
        return false;
      }

      const matchesStatus =
        statusValue === null || String(leave.status ?? '').toLowerCase() === statusValue;
      if (!matchesStatus) {
        return false;
      }

      if (!searchTerm) {
        return true;
      }

      const empName = String(leave.employeeName ?? '').toLowerCase();
      const empId = String(leave.employeeId ?? '').toLowerCase();

      return (
        empName.includes(searchTerm) ||
        empId.includes(searchTerm)
      );
    });

    this.total = this.filteredLeaves.length;
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
    this.displayedLeaves = this.filteredLeaves.slice(startIndex, startIndex + this.limit);
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

  deleteLeave(id?: string): void {
    if (!id) {
      return;
    }
    this.leaveToDeleteId = id;
    this.showDeleteModal = true;
  }

  confirmDelete(): void {
    if (!this.leaveToDeleteId) return;
    
    this.isDeleting = true;
    this.leaveService.deleteLeave(this.leaveToDeleteId).subscribe({
      next: () => {
        this.toastService.showSuccess('Leave deleted successfully.');
        this.closeDeleteModal();
        this.loadLeaves();
      },
      error: (err) => {
        console.error(err);
        this.toastService.showError('Failed to delete leave. Please try again.');
        this.closeDeleteModal();
      }
    });
  }

  cancelDelete(): void {
    this.closeDeleteModal();
  }

  private closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.leaveToDeleteId = null;
    this.isDeleting = false;
  }

  viewLeave(id?: string): void {
    if (!id) return;
    this.router.navigate(['/employee-management/leave/view', id]);
  }

  editLeave(id?: string): void {
    if (!id) return;
    this.router.navigate(['/employee-management/leave/edit', id]);
  }

  addLeave(): void {
    this.router.navigate(['/employee-management/leave/add']);
  }

  exportData(): void {
    console.log(this.leaves);
  }

  getInitials(name: string): string {
    if (!name) return '';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
    }
    return name.charAt(0).toUpperCase();
  }

  getStatusClass(status: string): string {
    switch (status?.toLowerCase()) {
      case 'approved':
        return 'status-active';
      case 'pending':
        return 'status-probation';
      case 'rejected':
        return 'status-inactive';
      default:
        return 'status-inactive';
    }
  }
}
