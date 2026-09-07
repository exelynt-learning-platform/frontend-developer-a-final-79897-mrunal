import { Component, EventEmitter, Input, Output, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-employee-search',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './employee-search.component.html',
  styleUrls: ['./employee-search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmployeeSearchComponent implements OnInit {
  @Input() loading = false;
  @Input() set searchId(val: string | null) {
    if (val !== this.searchControl.value) {
      this.searchControl.setValue(val || '', { emitEvent: false });
    }
  }

  @Output() search = new EventEmitter<string>();
  @Output() clear = new EventEmitter<void>();

  searchControl = new FormControl('', [Validators.pattern('^[0-9]+$')]);

  ngOnInit(): void {}

  onSearch(): void {
    const value = (this.searchControl.value || '').trim();
    if (value) {
      this.search.emit(value);
    }
  }

  onClear(): void {
    this.searchControl.setValue('');
    this.clear.emit();
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.onSearch();
    }
  }
}
