export interface Country {
  id: string;
  name: string;
  flag?: string;
  createdAt?: string;
}

export interface CountryDto {
  id: string | number;
  country: string;
  flag?: string;
  createdAt?: string;
}

export function mapCountryDtoToCountry(dto: CountryDto): Country {
  return {
    id: String(dto.id),
    name: dto.country ? dto.country.trim() : '',
    flag: dto.flag,
    createdAt: dto.createdAt
  };
}
