import { createReducer, on } from '@ngrx/store';
import { countryAdapter, initialCountryState } from './country.models';
import * as CountryActions from './country.actions';

export const countryReducer = createReducer(
  initialCountryState,
  on(CountryActions.loadCountries, (state, action) => ({
    ...state,
    loading: Boolean(action.force) || !state.loaded,
    error: null
  })),
  on(CountryActions.loadCountriesSuccess, (state, { countries }) =>
    countryAdapter.setAll(countries, {
      ...state,
      loading: false,
      loaded: true,
      error: null
    })
  ),
  on(CountryActions.loadCountriesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    loaded: false,
    error
  }))
);
