import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ICountry } from '../../../interfaces/country.interface';
import * as CountryActions from './country.actions';
import * as CountrySelectors from './country.selectors';

@Injectable()
export class CountryFacade {
  readonly countries$: Observable<ICountry[]> = this.store.select(CountrySelectors.selectAllCountries);
  readonly loading$: Observable<boolean> = this.store.select(CountrySelectors.selectCountriesLoading);
  readonly error$: Observable<string | null> = this.store.select(CountrySelectors.selectCountriesError);

  constructor(private store: Store) {}

  loadCountries(): void {
    this.store.dispatch(CountryActions.loadCountries());
  }
}
