import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { httpErrorInterceptor } from './http-error.interceptor';

describe('httpErrorInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([httpErrorInterceptor])),
        provideHttpClientTesting()
      ]
    });

    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should map network error status 0', (done) => {
    http.get('/test').subscribe({
      next: () => fail('Should have failed'),
      error: (err) => {
        expect(err.message).toContain('check your internet connection');
        done();
      }
    });

    httpMock.expectOne('/test').error(new ProgressEvent('error'), { status: 0 });
  });

  it('should map 400 Bad Request', (done) => {
    http.get('/test').subscribe({
      next: () => fail('Should have failed'),
      error: (err) => {
        expect(err.message).toContain('Invalid request');
        done();
      }
    });

    httpMock.expectOne('/test').flush('Bad Request', { status: 400, statusText: 'Bad Request' });
  });

  it('should map 401 Unauthorized', (done) => {
    http.get('/test').subscribe({
      next: () => fail('Should have failed'),
      error: (err) => {
        expect(err.message).toContain('Authentication required');
        done();
      }
    });

    httpMock.expectOne('/test').flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });
  });

  it('should map 403 Forbidden', (done) => {
    http.get('/test').subscribe({
      next: () => fail('Should have failed'),
      error: (err) => {
        expect(err.message).toContain('Access denied');
        done();
      }
    });

    httpMock.expectOne('/test').flush('Forbidden', { status: 403, statusText: 'Forbidden' });
  });

  it('should map 404 Not Found', (done) => {
    http.get('/test').subscribe({
      next: () => fail('Should have failed'),
      error: (err) => {
        expect(err.message).toContain('Requested resource was not found');
        done();
      }
    });

    httpMock.expectOne('/test').flush('Not Found', { status: 404, statusText: 'Not Found' });
  });

  it('should map 500 Server Error', (done) => {
    http.get('/test').subscribe({
      next: () => fail('Should have failed'),
      error: (err) => {
        expect(err.message).toContain('Server encountered an error');
        done();
      }
    });

    httpMock.expectOne('/test').flush('Server Error', { status: 500, statusText: 'Server Error' });
  });
});
