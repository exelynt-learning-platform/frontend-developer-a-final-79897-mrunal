import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  EmployeeDeleteDialogComponent,
  DeleteDialogData
} from './employee-delete-dialog.component';

describe('EmployeeDeleteDialogComponent', () => {
  let component: EmployeeDeleteDialogComponent;
  let fixture: ComponentFixture<EmployeeDeleteDialogComponent>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<EmployeeDeleteDialogComponent>>;

  const dialogData: DeleteDialogData = {
    employee: {
      id: '5',
      name: 'Rahul Dravid',
      email: 'rahul@cricket.in',
      mobile: '9876543210',
      country: 'India',
      state: 'Karnataka',
      district: 'Bengaluru'
    }
  };

  beforeEach(async () => {
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      imports: [EmployeeDeleteDialogComponent, NoopAnimationsModule],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: MAT_DIALOG_DATA, useValue: dialogData }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EmployeeDeleteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should display confirmation message with employee name and ID', () => {
    const textContent = fixture.nativeElement.textContent;
    expect(textContent).toContain('Rahul Dravid');
    expect(textContent).toContain('#5');
  });

  it('should close dialog with false on Cancel click', () => {
    component.onCancel();
    expect(dialogRefSpy.close).toHaveBeenCalledWith(false);
  });

  it('should close dialog with true on Delete click', () => {
    component.onConfirm();
    expect(dialogRefSpy.close).toHaveBeenCalledWith(true);
  });
});
