import { createFeatureSelector, createSelector } from '@ngrx/store';
import { countryAdapter, countryFeatureKey, CountryState } from './country.reducer';

export const selectCountryState = createFeatureSelector<CountryState>(countryFeatureKey);
const { selectAll } = countryAdapter.getSelectors(selectCountryState);

export const selectAllCountries = selectAll;
export const selectCountriesLoading = createSelector(selectCountryState, (state) => state.loading);
export const selectCountriesError = createSelector(selectCountryState, (state) => state.error);
