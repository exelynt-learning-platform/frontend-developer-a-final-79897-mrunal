import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PayrollService } from '../../payroll.service';
import { Payroll } from '../../../../interfaces/payroll.interface';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-payroll',
  templateUrl: './payroll.component.html',
  styleUrls: ['./payroll.component.css']
})
export class PayrollComponent implements OnInit {

  payrolls: Payroll[] = [];
  filteredPayrolls: Payroll[] = [];
  
  // States
  isLoading = false;
  isDeleting = false;
  showDeleteModal = false;
  payrollToDelete: Payroll | null = null;
  toastMessage = '';

  // Filters
  searchTerm = '';
  statusFilter = 'All';
  monthFilter = '';
  
  // Sort
  sortColumn = 'month';
  sortAscending = false;

  // Pagination
  currentPage = 1;
  itemsPerPage = 10;
  totalItems = 0;

  constructor(
    private payrollService: PayrollService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadPayrolls();
  }

  loadPayrolls(): void {
    this.isLoading = true;
    this.payrollService.getPayrolls()
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (data) => {
          this.payrolls = data || [];
          this.applyFilters();
        },
        error: (err) => console.error('Error fetching payrolls', err)
      });
  }

  applyFilters(): void {
    let result = this.payrolls;

    // Search
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      result = result.filter(p => 
        (p.employeeName?.toLowerCase().includes(term)) ||
        (p.employeeId?.toLowerCase().includes(term)) ||
        (p.payrollId?.toLowerCase().includes(term))
      );
    }

    // Status
    if (this.statusFilter !== 'All') {
      result = result.filter(p => p.status === this.statusFilter);
    }

    // Month
    if (this.monthFilter) {
      result = result.filter(p => p.month === this.monthFilter);
    }

    // Sorting (Latest First by default)
    result.sort((a, b) => {
      const valA = a[this.sortColumn as keyof Payroll] || '';
      const valB = b[this.sortColumn as keyof Payroll] || '';
      
      if (valA < valB) return this.sortAscending ? -1 : 1;
      if (valA > valB) return this.sortAscending ? 1 : -1;
      return 0;
    });

    this.filteredPayrolls = result;
    this.totalItems = result.length;
    this.currentPage = 1;
  }

  get paginatedPayrolls(): Payroll[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredPayrolls.slice(start, start + this.itemsPerPage);
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  sort(column: string): void {
    if (this.sortColumn === column) {
      this.sortAscending = !this.sortAscending;
    } else {
      this.sortColumn = column;
      this.sortAscending = true;
    }
    this.applyFilters();
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.statusFilter = 'All';
    this.monthFilter = '';
    this.applyFilters();
  }

  navigateToAdd(): void {
    this.router.navigate(['/employee-management/payroll/add']);
  }

  exportData(): void {
    this.showToast('Exporting payroll data...');
    // In a real app, this would trigger a CSV/Excel download
  }

  viewPayroll(id: string | undefined): void {
    if (id) this.router.navigate(['/employee-management/payroll/view', id]);
  }

  editPayroll(id: string | undefined): void {
    if (id) this.router.navigate(['/employee-management/payroll/edit', id]);
  }

  // Delete
  confirmDelete(payroll: Payroll): void {
    this.payrollToDelete = payroll;
    this.showDeleteModal = true;
  }

  cancelDelete(): void {
    this.showDeleteModal = false;
    this.payrollToDelete = null;
  }

  deletePayroll(): void {
    if (!this.payrollToDelete?.id) return;
    
    this.isDeleting = true;
    this.payrollService.deletePayroll(this.payrollToDelete.id)
      .pipe(finalize(() => this.isDeleting = false))
      .subscribe({
        next: () => {
          this.showDeleteModal = false;
          this.payrollToDelete = null;
          this.showToast('Payroll record deleted successfully');
          this.loadPayrolls();
        },
        error: (err) => console.error('Error deleting payroll', err)
      });
  }

  // Toast
  showToast(msg: string): void {
    this.toastMessage = msg;
    setTimeout(() => this.toastMessage = '', 3000);
  }

  min(a: number, b: number): number {
    return Math.min(a, b);
  }
}
