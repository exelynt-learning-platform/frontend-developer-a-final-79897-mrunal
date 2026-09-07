import { TestBed } from '@angular/core/testing';

import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthService);
  });

  it('should authenticate with the demo credentials', () => {
    expect(service.login('admin@gmail.com', '123456')).toBeTrue();
    expect(service.isAuthenticated()).toBeTrue();
    expect(service.getCurrentUser()?.email).toBe('admin@gmail.com');
  });

  it('should reject invalid credentials', () => {
    expect(service.login('wrong@test.com', 'pwd')).toBeFalse();
    expect(service.isAuthenticated()).toBeFalse();
  });
});
