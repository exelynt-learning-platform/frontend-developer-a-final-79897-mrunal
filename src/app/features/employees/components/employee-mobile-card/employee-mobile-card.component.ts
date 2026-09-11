import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Employee } from '../../../../core/models/employee.model';

@Component({
  selector: 'app-employee-mobile-card',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatTooltipModule],
  templateUrl: './employee-mobile-card.component.html',
  styleUrls: ['./employee-mobile-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmployeeMobileCardComponent {
  @Input({ required: true }) employee!: Employee;

  @Output() edit = new EventEmitter<Employee>();
  @Output() delete = new EventEmitter<Employee>();

  onEdit(): void {
    this.edit.emit(this.employee);
  }

  onDelete(): void {
    this.delete.emit(this.employee);
  }
}
