import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  templateUrl: './empty-state.component.html',
  styleUrls: ['./empty-state.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmptyStateComponent {
  @Input() icon = 'person_off';
  @Input() title = 'No employees found';
  @Input() message = 'Start by adding your first employee.';
  @Input() actionLabel?: string;
  @Input() actionIcon?: string;

  @Output() actionClick = new EventEmitter<void>();

  onAction(): void {
    this.actionClick.emit();
  }
}
