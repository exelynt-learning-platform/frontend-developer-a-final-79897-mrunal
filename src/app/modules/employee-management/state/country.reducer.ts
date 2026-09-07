import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { ICountry } from '../../../interfaces/country.interface';
import * as CountryActions from './country.actions';

export const countryFeatureKey = 'countries';

export interface CountryState extends EntityState<ICountry> {
  loading: boolean;
  error: string | null;
}

export const countryAdapter = createEntityAdapter<ICountry>({
  selectId: (country) => country.id ?? country.name
});

export const initialState: CountryState = countryAdapter.getInitialState({
  loading: false,
  error: null
});

export const countryReducer = createReducer(
  initialState,
  on(CountryActions.loadCountries, (state) => ({ ...state, loading: true, error: null })),
  on(CountryActions.loadCountriesSuccess, (state, { countries }) =>
    countryAdapter.setAll(countries, { ...state, loading: false })
  ),
  on(CountryActions.loadCountriesFailure, (state, { error }) => ({ ...state, loading: false, error }))
);
