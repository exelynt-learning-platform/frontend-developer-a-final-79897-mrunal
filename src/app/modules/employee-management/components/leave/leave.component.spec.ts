import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { Router } from '@angular/router';

import { LeaveManagementComponent } from './leave.component';
import { LeaveService } from '../../leave.service';
import { ToastService } from '../../../../core/services/toast.service';
import { SharedModule } from '../../../../shared/shared.module';

describe('LeaveManagementComponent', () => {
  let component: LeaveManagementComponent;
  let fixture: ComponentFixture<LeaveManagementComponent>;

  beforeEach(() => {
    const leaveService = jasmine.createSpyObj('LeaveService', ['getLeaves']);
    leaveService.getLeaves.and.returnValue(of([]));

    TestBed.configureTestingModule({
      declarations: [LeaveManagementComponent],
      imports: [SharedModule],
      providers: [
        { provide: LeaveService, useValue: leaveService },
        { provide: Router, useValue: jasmine.createSpyObj('Router', ['navigate']) },
        { provide: ToastService, useValue: jasmine.createSpyObj('ToastService', ['showSuccess', 'showError']) }
      ]
    });
    fixture = TestBed.createComponent(LeaveManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
