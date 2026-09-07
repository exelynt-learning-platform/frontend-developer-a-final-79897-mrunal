import { Component, OnInit, OnDestroy } from '@angular/core';
import { DashboardService } from './services/dashboard.service';
import { AuthService } from '../../core/services/auth.service';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { Subscription } from 'rxjs';
import { IEmployee } from '../../interfaces/employee.interface';
import { DepartmentService } from '../employee-management/components/department/department.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  isLoading = true;
  error = '';
  private dataSub!: Subscription;

  loggedInUserName = 'Alex'; // Default fallback

  // Analytics
  totalEmployees = 0;
  activeEmployees = 0;
  activePercentage = 0;
  totalDepartments = 0;
  newEmployees = 0;

  recentEmployees: IEmployee[] = [];
  upcomingBirthdays: IEmployee[] = [];

  // Departments Mapping
  departmentsMap: { [id: string]: string } = {};

  // Charts
  // 1. Department Distribution (Doughnut)
  public deptChartType: ChartType = 'doughnut';
  public deptChartData: ChartData<'doughnut'> = { labels: [], datasets: [] };
  public deptChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'right', labels: { usePointStyle: true, boxWidth: 8 } }
    }
  };

  // 2. Employee Growth (Line)
  public growthChartType: ChartType = 'line';
  public growthChartData: ChartData<'line'> = { labels: [], datasets: [] };
  public growthChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    elements: {
      line: { tension: 0.4 },
      point: { radius: 0, hitRadius: 10, hoverRadius: 4 }
    },
    scales: {
      x: { grid: { display: false } },
      y: { grid: { color: '#f3f4f6' }, beginAtZero: true }
    },
    plugins: {
      legend: { display: false }
    }
  };

  constructor(
    private dashboardService: DashboardService,
    private authService: AuthService,
    private departmentService: DepartmentService
  ) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (user && user.name) {
      this.loggedInUserName = user.name.split(' ')[0]; // First name
    }

    this.fetchDashboardData();
  }

  private fetchDashboardData(): void {
    // Fetch departments first to build the map, then fetch employees
    this.dataSub = this.departmentService.getDepartments().subscribe({
      next: (depts) => {
        depts.forEach(d => {
          this.departmentsMap[d.id] = d.departmentName;
        });
        
        this.dashboardService.getAllEmployees().subscribe({
          next: (employees) => {
            this.processAnalytics(employees);
            this.processCharts(employees);
            this.isLoading = false;
          },
          error: () => {
            this.error = 'Failed to load dashboard analytics.';
            this.isLoading = false;
          }
        });
      },
      error: () => {
        // Fallback if departments API fails
        this.dashboardService.getAllEmployees().subscribe({
          next: (employees) => {
            this.processAnalytics(employees);
            this.processCharts(employees);
            this.isLoading = false;
          }
        });
      }
    });
  }

  getDepartmentName(deptId: number | string | undefined): string {
    if (!deptId) return 'Unknown';
    return this.departmentsMap[String(deptId)] || 'Unknown';
  }

  private processAnalytics(employees: IEmployee[]): void {
    this.totalEmployees = employees.length;
    
    this.activeEmployees = employees.filter(e => e.status === 'Active').length;
    this.activePercentage = this.totalEmployees > 0 ? Math.round((this.activeEmployees / this.totalEmployees) * 100) : 0;
    
    // Departments can come from the API length if available, else derive
    this.totalDepartments = Object.keys(this.departmentsMap).length;
    if (this.totalDepartments === 0) {
      const depts = new Set(employees.map(e => String(e.departmentId)).filter(d => d !== 'undefined'));
      this.totalDepartments = depts.size;
    }

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    this.newEmployees = employees.filter(e => {
      if (!e.hireDate) return false;
      const joinDate = new Date(e.hireDate);
      return joinDate.getMonth() === currentMonth && joinDate.getFullYear() === currentYear;
    }).length;

    // Recent employees (last 5 based on joining date or ID)
    this.recentEmployees = [...employees]
      .sort((a, b) => {
        const dateA = a.hireDate ? new Date(a.hireDate).getTime() : 0;
        const dateB = b.hireDate ? new Date(b.hireDate).getTime() : 0;
        return dateB - dateA; // Descending
      })
      .slice(0, 5);

    // Upcoming birthdays (simulate with mock data if dob not present, or hide)
    // The requirement says: "If dateOfBirth is unavailable in API: Hide this section gracefully."
    this.upcomingBirthdays = employees.filter(e => {
      // In IEmployee interface we might not have dateOfBirth.
      // We will check if any arbitrary property exists if they map it later.
      return (e as any).dateOfBirth || (e as any).dob;
    }).slice(0, 3);
  }

  getInitials(firstName?: string, lastName?: string): string {
    const first = firstName ? firstName.charAt(0) : '';
    const last = lastName ? lastName.charAt(0) : '';
    return (first + last).toUpperCase();
  }

  getBirthdayStatus(dateStr: string): string {
    if (!dateStr) return '';
    const dob = new Date(dateStr);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (dob.getMonth() === today.getMonth() && dob.getDate() === today.getDate()) return 'Today';
    if (dob.getMonth() === tomorrow.getMonth() && dob.getDate() === tomorrow.getDate()) return 'Tomorrow';
    return 'Upcoming';
  }

  private processCharts(employees: IEmployee[]): void {
    // 1. Department Distribution (Doughnut)
    const deptCounts: { [key: string]: number } = {};
    employees.forEach(e => {
      const deptName = this.getDepartmentName(e.departmentId);
      deptCounts[deptName] = (deptCounts[deptName] || 0) + 1;
    });

    const sortedDepts = Object.entries(deptCounts).sort((a, b) => b[1] - a[1]);
    const topDepts = sortedDepts.slice(0, 6);
    
    this.deptChartData = {
      labels: topDepts.map(d => d[0]),
      datasets: [{
        data: topDepts.map(d => d[1]),
        backgroundColor: ['#3b82f6', '#8b5cf6', '#10b981', '#ec4899', '#f97316', '#22c55e'],
        borderWidth: 0,
        hoverOffset: 4
      }]
    };

    // 2. Employee Growth (Line)
    const months = ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];
    const growthData = new Array(12).fill(0);
    
    // Distribute employees
    employees.forEach(e => {
      if (e.hireDate) {
        const d = new Date(e.hireDate);
        if (!isNaN(d.getTime())) {
          // Map to the trailing 12 months for visual
          const monthIndex = d.getMonth();
          growthData[monthIndex]++;
        }
      }
    });

    // Make it cumulative for "Growth"
    let cumulative = 0;
    const cumulativeData = growthData.map(count => {
      cumulative += count;
      return cumulative;
    });

    this.growthChartData = {
      labels: months,
      datasets: [{
        label: 'Headcount',
        data: cumulativeData,
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        borderWidth: 2
      }]
    };
  }

  ngOnDestroy(): void {
    if (this.dataSub) this.dataSub.unsubscribe();
  }
}
