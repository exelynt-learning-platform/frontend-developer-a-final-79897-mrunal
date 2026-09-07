import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface ToastInfo {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toastSubject = new Subject<ToastInfo>();
  toastState$ = this.toastSubject.asObservable();

  showSuccess(message: string) {
    this.toastSubject.next({ type: 'success', message });
  }

  showError(message: string) {
    this.toastSubject.next({ type: 'error', message });
  }

  showWarning(message: string) {
    this.toastSubject.next({ type: 'warning', message });
  }

  showInfo(message: string) {
    this.toastSubject.next({ type: 'info', message });
  }
}
