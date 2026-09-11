import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { CountryService } from './country.service';
import { environment } from '../../../environments/environment';
import { CountryDto } from '../models/country.model';

describe('CountryService', () => {
  let service: CountryService;
  let httpMock: HttpTestingController;
  const baseUrl = environment.apiUrl + environment.endpoints.countries;

  const mockCountryDtos: CountryDto[] = [
    { id: '1', country: 'India', flag: 'https://flag.png' },
    { id: '2', country: 'Singapore', flag: 'https://flag2.png' }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CountryService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(CountryService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should fetch countries and map country field to name', () => {
    service.getCountries().subscribe((countries) => {
      expect(countries.length).toBe(2);
      expect(countries[0].id).toBe('1');
      expect(countries[0].name).toBe('India');
      expect(countries[1].id).toBe('2');
      expect(countries[1].name).toBe('Singapore');
    });

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockCountryDtos);
  });

  it('should handle country API error', () => {
    service.getCountries().subscribe({
      next: () => fail('Expected error'),
      error: (error) => {
        expect(error.status).toBe(500);
      }
    });

    const req = httpMock.expectOne(baseUrl);
    req.flush('Error loading countries', { status: 500, statusText: 'Error' });
  });
});
