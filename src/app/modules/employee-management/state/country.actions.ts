import { createAction, props } from '@ngrx/store';
import { ICountry } from '../../../interfaces/country.interface';

export const loadCountries = createAction('[Countries] Load Countries');
export const loadCountriesSuccess = createAction(
  '[Countries API] Load Countries Success',
  props<{ countries: ICountry[] }>()
);
export const loadCountriesFailure = createAction(
  '[Countries API] Load Countries Failure',
  props<{ error: string }>()
);
