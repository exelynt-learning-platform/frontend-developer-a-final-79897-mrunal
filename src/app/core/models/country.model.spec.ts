import { CountryDto, mapCountryDtoToCountry } from './country.model';

describe('CountryModel Mappings', () => {
  it('should map CountryDto to Country with trimmed name', () => {
    const dto: CountryDto = {
      id: 1,
      country: '  India  ',
      flag: 'https://flag.png',
      createdAt: '2026-01-01'
    };

    const country = mapCountryDtoToCountry(dto);

    expect(country).toEqual({
      id: '1',
      name: 'India',
      flag: 'https://flag.png',
      createdAt: '2026-01-01'
    });
  });

  it('should handle missing country name gracefully', () => {
    const dto: CountryDto = {
      id: '2',
      country: ''
    };

    const country = mapCountryDtoToCountry(dto);

    expect(country).toEqual({
      id: '2',
      name: '',
      flag: undefined,
      createdAt: undefined
    });
  });
});
