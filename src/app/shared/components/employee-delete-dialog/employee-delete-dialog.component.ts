import { Component, Inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Employee } from '../../../core/models/employee.model';

export interface DeleteDialogData {
  employee: Employee;
}

@Component({
  selector: 'app-employee-delete-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  templateUrl: './employee-delete-dialog.component.html',
  styleUrls: ['./employee-delete-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmployeeDeleteDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<EmployeeDeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DeleteDialogData
  ) {}

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }
}
