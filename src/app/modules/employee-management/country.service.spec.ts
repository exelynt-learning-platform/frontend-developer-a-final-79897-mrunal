import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../../environments/environment';
import { CountryService } from './country.service';

describe('CountryService', () => {
  let service: CountryService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule] });
    service = TestBed.inject(CountryService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('normalizes country API records for the form', () => {
    service.getCountries().subscribe((countries) => {
      expect(countries).toEqual([
        { id: '1', name: 'India', code: 'IN' },
        { id: '2', name: 'United States', code: undefined }
      ]);
    });

    const request = httpMock.expectOne(environment.countryApiUrl);
    expect(request.request.method).toBe('GET');
    request.flush([
      { id: '1', countryName: 'India', code: 'IN' },
      { id: '2', name: 'United States' },
      { id: '3', name: '' }
    ]);
  });
});
