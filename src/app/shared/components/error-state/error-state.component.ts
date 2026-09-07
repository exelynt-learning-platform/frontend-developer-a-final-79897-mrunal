import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-error-state',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  templateUrl: './error-state.component.html',
  styleUrls: ['./error-state.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ErrorStateComponent {
  @Input() title = 'Unable to load employees';
  @Input() message = 'Something went wrong while communicating with the server.';
  @Input() retryLabel = 'Try Again';

  @Output() retry = new EventEmitter<void>();

  onRetry(): void {
    this.retry.emit();
  }
}
