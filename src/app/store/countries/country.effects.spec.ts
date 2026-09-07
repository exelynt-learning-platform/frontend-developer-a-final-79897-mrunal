import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideStore } from '@ngrx/store';
import { Observable, of, throwError } from 'rxjs';
import { CountryEffects } from './country.effects';
import * as CountryActions from './country.actions';
import { countryReducer } from './country.reducer';
import { CountryService } from '../../core/services/country.service';
import { Country } from '../../core/models/country.model';

describe('CountryEffects', () => {
  let actions$: Observable<any>;
  let effects: CountryEffects;
  let countryServiceSpy: jasmine.SpyObj<CountryService>;

  const mockCountries: Country[] = [
    { id: '1', name: 'India' },
    { id: '2', name: 'Singapore' }
  ];

  beforeEach(() => {
    countryServiceSpy = jasmine.createSpyObj('CountryService', ['getCountries']);

    TestBed.configureTestingModule({
      providers: [
        CountryEffects,
        provideMockActions(() => actions$),
        provideStore({ countries: countryReducer }),
        { provide: CountryService, useValue: countryServiceSpy }
      ]
    });

    effects = TestBed.inject(CountryEffects);
  });

  it('should load countries and emit loadCountriesSuccess', (done) => {
    actions$ = of(CountryActions.loadCountries({ force: true }));
    countryServiceSpy.getCountries.and.returnValue(of(mockCountries));

    effects.loadCountries$.subscribe((action) => {
      expect(action).toEqual(
        CountryActions.loadCountriesSuccess({ countries: mockCountries })
      );
      done();
    });
  });

  it('should emit loadCountriesFailure on service error', (done) => {
    actions$ = of(CountryActions.loadCountries({ force: true }));
    countryServiceSpy.getCountries.and.returnValue(throwError(() => new Error('Country Error')));

    effects.loadCountries$.subscribe((action) => {
      expect(action.type).toBe(CountryActions.loadCountriesFailure.type);
      done();
    });
  });
});
