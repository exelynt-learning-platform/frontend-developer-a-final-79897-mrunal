import {
  selectAllCountries,
  selectCountryEntities,
  selectCountryTotal,
  selectCountriesLoading,
  selectCountriesLoaded,
  selectCountriesError
} from './country.selectors';
import { countryAdapter, CountryState, initialCountryState } from './country.models';
import { Country } from '../../core/models/country.model';

describe('Country Selectors', () => {
  const countries: Country[] = [
    { id: '1', name: 'India' },
    { id: '2', name: 'Germany' }
  ];
  const state: { countries: CountryState } = {
    countries: countryAdapter.setAll(countries, {
      ...initialCountryState,
      loading: true,
      loaded: true,
      error: 'Previous error'
    })
  };

  it('should select countries, entities, and total', () => {
    expect(selectAllCountries(state).map((country) => country.name)).toEqual(['Germany', 'India']);
    expect(selectCountryEntities(state)['1']?.name).toBe('India');
    expect(selectCountryTotal(state)).toBe(2);
  });

  it('should select loading, loaded, and error state', () => {
    expect(selectCountriesLoading(state)).toBeTrue();
    expect(selectCountriesLoaded(state)).toBeTrue();
    expect(selectCountriesError(state)).toBe('Previous error');
  });
});
