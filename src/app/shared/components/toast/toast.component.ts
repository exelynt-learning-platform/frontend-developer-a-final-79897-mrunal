import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ToastService, ToastInfo } from '../../../core/services/toast.service';

interface Toast extends ToastInfo {
  id: number;
}

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.css']
})
export class ToastComponent implements OnInit, OnDestroy {
  toasts: Toast[] = [];
  private subscription!: Subscription;
  private idCounter = 0;

  constructor(private toastService: ToastService) {}

  ngOnInit(): void {
    this.subscription = this.toastService.toastState$.subscribe((toastInfo: ToastInfo) => {
      const toast: Toast = { ...toastInfo, id: this.idCounter++ };
      this.toasts.push(toast);
      
      // Auto remove after 4 seconds
      setTimeout(() => this.removeToast(toast.id), 4000);
    });
  }

  removeToast(id: number) {
    this.toasts = this.toasts.filter(t => t.id !== id);
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
