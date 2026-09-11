import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-loading-state',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule],
  templateUrl: './loading-state.component.html',
  styleUrls: ['./loading-state.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoadingStateComponent {
  @Input() message = 'Loading employee data...';
  @Input() mode: 'spinner' | 'table-skeleton' = 'table-skeleton';
  @Input() rows = 5;

  get skeletonRows(): number[] {
    return Array.from({ length: this.rows }, (_, i) => i);
  }
}
