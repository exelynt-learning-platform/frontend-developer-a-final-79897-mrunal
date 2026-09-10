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
    component.searchControl.setValue(null);
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

  it('should synchronize the search control when searchId changes', () => {
    component.searchId = '42';
    expect(component.searchControl.value).toBe('42');

    component.searchId = null;
    expect(component.searchControl.value).toBe('');
  });

  it('should not rewrite the control when searchId matches its current value', () => {
    component.searchControl.setValue('42');
    const setValue = spyOn(component.searchControl, 'setValue');

    component.searchId = '42';

    expect(setValue).not.toHaveBeenCalled();
  });

  it('should invalidate control and not emit search when non-numeric input is provided', () => {
    spyOn(component.search, 'emit');
    component.searchControl.setValue('abc');
    expect(component.searchControl.valid).toBeFalse();
    expect(component.searchControl.hasError('pattern')).toBeTrue();

    component.onSearch();
    expect(component.search.emit).not.toHaveBeenCalled();
  });

  it('should reject IDs longer than 20 digits', () => {
    component.searchControl.setValue('1'.repeat(21));

    expect(component.searchControl.hasError('maxlength')).toBeTrue();
    expect(component.searchControl.valid).toBeFalse();
  });
});
