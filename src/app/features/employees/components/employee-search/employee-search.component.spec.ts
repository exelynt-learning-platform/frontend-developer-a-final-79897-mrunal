import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { EmployeeSearchComponent } from './employee-search.component';

describe('EmployeeSearchComponent', () => {
  let component: EmployeeSearchComponent;
  let fixture: ComponentFixture<EmployeeSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeSearchComponent, NoopAnimationsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(EmployeeSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should emit search event with trimmed value when search is invoked', () => {
    spyOn(component.search, 'emit');
    component.searchControl.setValue('8');
    component.onSearch();

    expect(component.search.emit).toHaveBeenCalledWith('8');
  });

  it('should not emit search when input is empty or whitespace', () => {
    spyOn(component.search, 'emit');
    component.searchControl.setValue('   ');
    component.onSearch();

    expect(component.search.emit).not.toHaveBeenCalled();
  });

  it('should reset control and emit clear event on onClear', () => {
    spyOn(component.clear, 'emit');
    component.searchControl.setValue('8');
    component.onClear();

    expect(component.searchControl.value).toBe('');
    expect(component.clear.emit).toHaveBeenCalled();
  });

  it('should trigger onSearch when Enter key is pressed', () => {
    spyOn(component, 'onSearch');
    const event = new KeyboardEvent('keydown', { key: 'Enter' });
    component.onKeyDown(event);

    expect(component.onSearch).toHaveBeenCalled();
  });
});
