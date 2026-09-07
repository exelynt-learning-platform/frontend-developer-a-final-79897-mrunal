import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Country, CountryDto, mapCountryDtoToCountry } from '../models/country.model';

@Injectable({
  providedIn: 'root'
})
export class CountryService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl + environment.endpoints.countries;

  getCountries(): Observable<Country[]> {
    return this.http.get<CountryDto[]>(this.baseUrl).pipe(
      map((dtos) => dtos.map(mapCountryDtoToCountry))
    );
  }
}
