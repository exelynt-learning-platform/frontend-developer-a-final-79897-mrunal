import { EntityState, createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { Country } from '../../core/models/country.model';

export interface CountryState extends EntityState<Country> {
  loading: boolean;
  loaded: boolean;
  error: string | null;
}

export const countryAdapter: EntityAdapter<Country> = createEntityAdapter<Country>({
  selectId: (country: Country) => country.id,
  sortComparer: (a: Country, b: Country) => a.name.localeCompare(b.name)
});

export const initialCountryState: CountryState = countryAdapter.getInitialState({
  loading: false,
  loaded: false,
  error: null
});
