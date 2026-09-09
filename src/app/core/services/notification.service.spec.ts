import { TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationService } from './notification.service';

describe('NotificationService', () => {
  let service: NotificationService;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;

  beforeEach(() => {
    snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);

    TestBed.configureTestingModule({
      providers: [
        NotificationService,
        { provide: MatSnackBar, useValue: snackBarSpy }
      ]
    });

    service = TestBed.inject(NotificationService);
  });

  it('should open success snackbar with correct configuration', () => {
    service.success('Operation successful');
    expect(snackBarSpy.open).toHaveBeenCalledWith('Operation successful', 'Close', {
      duration: 4000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: ['ems-snackbar-success']
    });
  });

  it('should open error snackbar with correct configuration', () => {
    service.error('Operation failed');
    expect(snackBarSpy.open).toHaveBeenCalledWith('Operation failed', 'Dismiss', {
      duration: 6000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: ['ems-snackbar-error']
    });
  });

  it('should open info snackbar with correct configuration', () => {
    service.info('Information notice');
    expect(snackBarSpy.open).toHaveBeenCalledWith('Information notice', 'OK', {
      duration: 4000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: ['ems-snackbar-info']
    });
  });
});
