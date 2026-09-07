import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should authenticate with the demo credentials', () => {
    service.loginWithApi('admin@gmail.com', '123456').subscribe();

    const request = httpMock.expectOne((req) => req.url.includes('/users'));
    request.flush([{
      id: '1',
      name: 'Admin',
      email: 'admin@gmail.com',
      password: '123456',
      role: 'Admin'
    }]);

    expect(service.isAuthenticated()).toBeTrue();
    expect(service.getCurrentUser()?.email).toBe('admin@gmail.com');
  });

  it('should reject invalid credentials', () => {
    let requestError: Error | undefined;
    service.loginWithApi('wrong@test.com', 'pwd').subscribe({
      error: (error: Error) => requestError = error
    });

    const request = httpMock.expectOne((req) => req.url.includes('/users'));
    request.flush([{
      id: '1',
      name: 'Admin',
      email: 'admin@gmail.com',
      password: '123456'
    }]);

    expect(requestError?.message).toBe('Invalid email or password');
    expect(service.isAuthenticated()).toBeFalse();
  });
});
