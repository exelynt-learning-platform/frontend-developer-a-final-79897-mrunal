import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ICountry } from '../../interfaces/country.interface';

interface CountryApiRecord {
  id?: string;
  name?: string;
  countryName?: string;
  code?: string;
}

@Injectable({ providedIn: 'root' })
export class CountryService {
  constructor(private http: HttpClient) {}

  getCountries(): Observable<ICountry[]> {
    return this.http.get<CountryApiRecord[]>(environment.countryApiUrl).pipe(
      map((countries) => countries
        .map((country) => ({
          id: country.id,
          name: country.name || country.countryName || '',
          code: country.code
        }))
        .filter((country) => country.name.length > 0))
    );
  }
}
