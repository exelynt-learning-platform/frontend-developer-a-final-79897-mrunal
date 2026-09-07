import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ReportService, ReportData } from './report.service';
import { IEmployee } from '../../interfaces/employee.interface';
import { IDepartment } from '../../interfaces/department.interface';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit, OnDestroy {
  reportForm!: FormGroup;
  isLoading = true;
  error = '';
  private dataSub!: Subscription;
  private formSub!: Subscription;

  // Raw Data
  allEmployees: IEmployee[] = [];
  departments: IDepartment[] = [];

  // Filtered Data
  filteredEmployees: IEmployee[] = [];

  // Summary Metrics
  totalEmployees = 0;
  activeEmployees = 0;
  totalDepartments = 0;
  totalLeaves = 0;
  monthlyPayroll = 0;
  newJoinees = 0;

  constructor(
    private fb: FormBuilder,
    private reportService: ReportService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadData();
  }

  private initForm(): void {
    this.reportForm = this.fb.group({
      departmentId: ['all'],
      status: ['all'],
      reportType: ['detailed']
    });

    this.formSub = this.reportForm.valueChanges.subscribe(() => {
      this.applyFilters();
    });
  }

  private loadData(): void {
    this.isLoading = true;
    this.error = '';
    this.dataSub = this.reportService.getReportData().subscribe({
      next: (data: ReportData) => {
        this.allEmployees = data.employees;
        this.departments = data.departments;
        this.totalDepartments = data.departments.length;
        this.totalLeaves = data.leaves.length;
        
        this.calculateMetrics();
        this.applyFilters();
        this.isLoading = false;
      },
      error: () => {
        this.error = 'Failed to load report data. Please try again later.';
        this.isLoading = false;
      }
    });
  }

  private calculateMetrics(): void {
    this.totalEmployees = this.allEmployees.length;
    this.activeEmployees = this.allEmployees.filter(e => e.status === 'Active').length;
    
    this.monthlyPayroll = this.allEmployees.reduce((sum, emp) => {
      return sum + (Number(emp.salary) || 0);
    }, 0);

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    this.newJoinees = this.allEmployees.filter(e => {
      if (!e.hireDate) return false;
      const joinDate = new Date(e.hireDate);
      return joinDate.getMonth() === currentMonth && joinDate.getFullYear() === currentYear;
    }).length;
  }

  private applyFilters(): void {
    const filters = this.reportForm.value;
    let filtered = [...this.allEmployees];

    if (filters.departmentId !== 'all') {
      filtered = filtered.filter(e => String(e.departmentId) === String(filters.departmentId));
    }

    if (filters.status !== 'all') {
      filtered = filtered.filter(e => e.status === filters.status);
    }

    this.filteredEmployees = filtered;
  }

  getDepartmentName(deptId: number): string {
    const dept = this.departments.find(d => String(d.id) === String(deptId));
    return dept ? dept.departmentName : 'Unknown';
  }

  refreshData(): void {
    this.loadData();
  }

  exportToCSV(): void {
    if (!this.filteredEmployees.length) return;
    
    const headers = ['Employee ID', 'Name', 'Department', 'Position', 'Status', 'Salary', 'Joining Date'];
    const rows = this.filteredEmployees.map(emp => [
      emp.id || '',
      `${emp.firstName} ${emp.lastName}`,
      this.getDepartmentName(emp.departmentId),
      emp.position || '',
      emp.status || '',
      emp.salary || '',
      emp.hireDate || ''
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(r => r.join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', 'employee_report.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  printReport(): void {
    window.print();
  }

  ngOnDestroy(): void {
    if (this.dataSub) this.dataSub.unsubscribe();
    if (this.formSub) this.formSub.unsubscribe();
  }
}
