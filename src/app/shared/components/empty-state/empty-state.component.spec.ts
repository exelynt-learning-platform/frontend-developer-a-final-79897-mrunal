import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmptyStateComponent } from './empty-state.component';

describe('EmptyStateComponent', () => {
  let component: EmptyStateComponent;
  let fixture: ComponentFixture<EmptyStateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmptyStateComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(EmptyStateComponent);
    component = fixture.componentInstance;
  });

  it('should render title and message', () => {
    component.title = 'Custom Empty';
    component.message = 'No data available';
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent;
    expect(text).toContain('Custom Empty');
    expect(text).toContain('No data available');
  });

  it('should emit actionClick when action button is clicked', () => {
    spyOn(component.actionClick, 'emit');
    component.actionLabel = 'Create New';
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();

    component.onAction();
    expect(component.actionClick.emit).toHaveBeenCalled();
  });
});
