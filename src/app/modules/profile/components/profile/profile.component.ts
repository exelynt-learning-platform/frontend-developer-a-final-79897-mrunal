import { Component, OnInit } from '@angular/core';

import { finalize } from 'rxjs/operators';
import { ProfileService } from '../../services/profile.service';
import { IEmployee } from '../../../../interfaces/employee.interface';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  profile: IEmployee | null = null;
  isLoading = true;
  loadError = false;

  activeTab: string = 'overview';
  tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'documents', label: 'Documents' },
    { id: 'attendance', label: 'Attendance' },
    { id: 'leave', label: 'Leave' },
    { id: 'payroll', label: 'Payroll' }
  ];

  isViewMode = true;

  constructor(
    private profileService: ProfileService
  ) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.isLoading = true;
    this.loadError = false;
 
    const employeeId = '21';

    this.profileService.getProfile(employeeId)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (data) => {
          this.profile = data;
        },
        error: (err) => {
          console.error('Failed to load profile', err);
          this.loadError = true;
        }
      });
  }

  selectTab(tabId: string): void {
    this.activeTab = tabId;
  }

  get initials(): string {
    if (!this.profile) return '';
    return `${this.profile.firstName?.charAt(0) || ''}${this.profile.lastName?.charAt(0) || ''}`.toUpperCase();
  }

  formatCurrency(amount: number): string {
    if (amount == null) return '-';
    return amount.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
  }

  retry(): void {
    this.loadProfile();
  }
}
