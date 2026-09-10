import { countryReducer } from './country.reducer';
import { initialCountryState } from './country.models';
import * as CountryActions from './country.actions';
import { Country } from '../../core/models/country.model';

describe('CountryReducer', () => {
  it('should return initial state when action is unknown', () => {
    const action = { type: 'UNKNOWN' } as any;
    const state = countryReducer(undefined, action);
    expect(state).toEqual(initialCountryState);
  });

  it('should set loading to true on loadCountries when not loaded or forced', () => {
    const action = CountryActions.loadCountries({});
    const state = countryReducer(initialCountryState, action);
    expect(state.loading).toBeTrue();
    expect(state.error).toBeNull();

    const loadedState = { ...initialCountryState, loaded: true, loading: false };
    const nonForcedAction = CountryActions.loadCountries({});
    const state2 = countryReducer(loadedState, nonForcedAction);
    expect(state2.loading).toBeFalse();

    const forcedAction = CountryActions.loadCountries({ force: true });
    const state3 = countryReducer(loadedState, forcedAction);
    expect(state3.loading).toBeTrue();
  });

  it('should clear a previous error when loading already loaded countries without force', () => {
    const loadedState = { ...initialCountryState, loaded: true, error: 'Previous error' };

    const state = countryReducer(loadedState, CountryActions.loadCountries({ force: false }));

    expect(state.loading).toBeFalse();
    expect(state.error).toBeNull();
  });

  it('should populate countries on loadCountriesSuccess', () => {
    const mockCountries: Country[] = [
      { id: '1', name: 'India' },
      { id: '2', name: 'Germany' }
    ];
    const action = CountryActions.loadCountriesSuccess({ countries: mockCountries });
    const state = countryReducer(initialCountryState, action);

    expect(state.loading).toBeFalse();
    expect(state.loaded).toBeTrue();
    expect(state.ids.length).toBe(2);
    expect(state.entities['1']?.name).toBe('India');
  });

  it('should set error on loadCountriesFailure', () => {
    const action = CountryActions.loadCountriesFailure({ error: 'Network error' });
    const state = countryReducer(initialCountryState, action);

    expect(state.loading).toBeFalse();
    expect(state.loaded).toBeFalse();
    expect(state.error).toBe('Network error');
  });
});
