import { Injectable, inject } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private snackBar = inject(MatSnackBar);

  private baseConfig: MatSnackBarConfig = {
    duration: 4000,
    horizontalPosition: 'right',
    verticalPosition: 'top'
  };

  success(message: string, action = 'Close'): void {
    this.snackBar.open(message, action, {
      ...this.baseConfig,
      panelClass: ['ems-snackbar-success']
    });
  }

  error(message: string, action = 'Dismiss'): void {
    this.snackBar.open(message, action, {
      ...this.baseConfig,
      duration: 6000,
      panelClass: ['ems-snackbar-error']
    });
  }

  info(message: string, action = 'OK'): void {
    this.snackBar.open(message, action, {
      ...this.baseConfig,
      panelClass: ['ems-snackbar-info']
    });
  }
}
