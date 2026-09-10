import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CountryState, countryAdapter } from './country.models';

export const selectCountryState = createFeatureSelector<CountryState>('countries');

const { selectEntities, selectAll, selectTotal } = countryAdapter.getSelectors();

export const selectAllCountries = createSelector(
  selectCountryState,
  selectAll
);

export const selectCountryEntities = createSelector(
  selectCountryState,
  selectEntities
);

export const selectCountryTotal = createSelector(
  selectCountryState,
  selectTotal
);

export const selectCountriesLoading = createSelector(
  selectCountryState,
  (state) => state.loading
);

export const selectCountriesLoaded = createSelector(
  selectCountryState,
  (state) => state.loaded
);

export const selectCountriesError = createSelector(
  selectCountryState,
  (state) => state.error
);
