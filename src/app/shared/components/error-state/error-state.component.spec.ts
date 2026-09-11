import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ErrorStateComponent } from './error-state.component';

describe('ErrorStateComponent', () => {
  let component: ErrorStateComponent;
  let fixture: ComponentFixture<ErrorStateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ErrorStateComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ErrorStateComponent);
    component = fixture.componentInstance;
  });

  it('should render error message and emit retry on button click', () => {
    spyOn(component.retry, 'emit');
    component.message = 'Failed to fetch data';
    component.title = 'Custom Error Title';
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Failed to fetch data');
    expect(fixture.nativeElement.textContent).toContain('Custom Error Title');
    component.onRetry();
    expect(component.retry.emit).toHaveBeenCalled();
  });
});
