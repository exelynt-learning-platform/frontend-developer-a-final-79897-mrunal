import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { Employee } from '../../../../core/models/employee.model';

@Component({
  selector: 'app-employee-table',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatChipsModule
  ],
  templateUrl: './employee-table.component.html',
  styleUrls: ['./employee-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmployeeTableComponent {
  @Input() employees: Employee[] = [];
  @Input() loading = false;

  @Output() edit = new EventEmitter<Employee>();
  @Output() delete = new EventEmitter<Employee>();

  displayedColumns: string[] = [
    'id',
    'name',
    'email',
    'mobile',
    'country',
    'location',
    'actions'
  ];

  trackByEmployeeId(index: number, employee: Employee): string {
    return employee.id;
  }

  onEdit(employee: Employee): void {
    this.edit.emit(employee);
  }

  onDelete(employee: Employee): void {
    this.delete.emit(employee);
  }
}
