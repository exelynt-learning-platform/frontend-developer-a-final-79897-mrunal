import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AttendanceService } from '../../attendance.service';
import { DepartmentService } from '../department/department.service';
import { ToastService } from '../../../../core/services/toast.service';
import { Attendance } from '../../../../interfaces/attendance.interface';
import { IDepartment } from '../../../../interfaces/department.interface';

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.css']
})
export class AttendanceComponent implements OnInit {
  attendances: Attendance[] = [];
  filteredAttendances: Attendance[] = [];
  displayedAttendances: Attendance[] = [];
  departments: IDepartment[] = [];
  
  isLoading = true;
  error = '';
  
  searchTerm = '';
  statusFilter = '';
  departmentFilter = '';
  dateFilter = '';
  
  // Pagination
  page = 1;
  pageSize = 10;
  total = 0;
  
  // Delete modal
  showDeleteModal = false;
  attendanceToDelete: string | null = null;
  isDeleting = false;

  constructor(
    private attendanceService: AttendanceService,
    private departmentService: DepartmentService,
    private router: Router,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadDepartments();
    this.loadAttendances();
  }

  loadDepartments(): void {
    this.departmentService.getDepartments().subscribe({
      next: (data) => {
        this.departments = data;
      },
      error: (err) => {
        console.error('Failed to load departments', err);
      }
    });
  }

  loadAttendances(): void {
    this.isLoading = true;
    this.attendanceService.getAttendance().subscribe({
      next: (data) => {
        // Sort latest records first (assuming by date descending or id descending)
        // We'll sort by ID descending assuming ID is stringly incremental or date descending
        this.attendances = data.sort((a, b) => {
          if (a.date === b.date) {
            return (b.id || '').localeCompare(a.id || '');
          }
          const dateA = a.date ? new Date(a.date).getTime() : 0;
          const dateB = b.date ? new Date(b.date).getTime() : 0;
          return (isNaN(dateB) ? 0 : dateB) - (isNaN(dateA) ? 0 : dateA);
        });
        this.applyFilters();
        this.isLoading = false;
      },
      error: () => {
        this.error = 'Failed to load attendance records.';
        this.toastService.showError(this.error);
        this.isLoading = false;
      }
    });
  }

  onSearch(event: any): void {
    this.searchTerm = event.target.value.toLowerCase();
    this.page = 1;
    this.applyFilters();
  }

  onFilterChange(): void {
    this.page = 1;
    this.applyFilters();
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.statusFilter = '';
    this.departmentFilter = '';
    this.dateFilter = '';
    this.page = 1;
    this.applyFilters();
  }

  applyFilters(): void {
    this.filteredAttendances = this.attendances.filter(a => {
      const matchSearch = !this.searchTerm || 
        (a.employeeName && a.employeeName.toLowerCase().includes(this.searchTerm)) ||
        (a.employeeId && a.employeeId.toLowerCase().includes(this.searchTerm));
        
      const matchStatus = !this.statusFilter || 
        (a.status && a.status.toLowerCase() === this.statusFilter.toLowerCase());
        
      const matchDepartment = !this.departmentFilter || 
        (a.department && a.department === this.departmentFilter);
        
      const matchDate = !this.dateFilter || 
        (a.date && new Date(a.date).toDateString() === new Date(this.dateFilter).toDateString());
        
      return matchSearch && matchStatus && matchDepartment && matchDate;
    });
    
    this.total = this.filteredAttendances.length;
    this.updatePagination();
  }

  updatePagination(): void {
    const start = (this.page - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.displayedAttendances = this.filteredAttendances.slice(start, end);
  }

  get startItem(): number {
    return (this.page - 1) * this.pageSize + 1;
  }

  get endItem(): number {
    return Math.min(this.page * this.pageSize, this.total);
  }

  get totalPages(): number {
    return Math.ceil(this.total / this.pageSize);
  }

  get pageNumbers(): number[] {
    return Array(this.totalPages).fill(0).map((_, i) => i + 1);
  }

  onPageChange(newPage: number): void {
    if (newPage >= 1 && newPage <= this.totalPages) {
      this.page = newPage;
      this.updatePagination();
    }
  }

  addAttendance(): void {
    this.router.navigate(['/employee-management/attendance/add']);
  }

  viewAttendance(id?: string): void {
    if(id) this.router.navigate(['/employee-management/attendance/view', id]);
  }

  editAttendance(id?: string): void {
    if(id) this.router.navigate(['/employee-management/attendance/edit', id]);
  }

  deleteAttendance(id?: string): void {
    if (id) {
      this.attendanceToDelete = id;
      this.showDeleteModal = true;
    }
  }

  confirmDelete(): void {
    if (!this.attendanceToDelete) return;
    
    this.isDeleting = true;
    this.attendanceService.deleteAttendance(this.attendanceToDelete).subscribe({
      next: () => {
        this.toastService.showSuccess('Attendance record deleted successfully');
        this.isDeleting = false;
        this.showDeleteModal = false;
        this.attendanceToDelete = null;
        this.loadAttendances();
      },
      error: () => {
        this.toastService.showError('Failed to delete attendance record');
        this.isDeleting = false;
        this.showDeleteModal = false;
      }
    });
  }

  cancelDelete(): void {
    this.showDeleteModal = false;
    this.attendanceToDelete = null;
  }
}
