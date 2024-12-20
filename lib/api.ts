import { Country } from '@/types/country';

const RESTCOUNTRIES_BASE_URL = 'https://restcountries.com/v3.1';
const NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org';

export async function getCountries() {
  try {
    const response = await fetch(
      `${RESTCOUNTRIES_BASE_URL}/all?fields=name,cca3,flags,capital,region,population,translations`,
      {
        cache: 'force-cache',
        next: {
          revalidate: 604800,
          tags: ['countries'],
        },
      }
    );
    if (!response.ok)
      throw new Error(`Failed to fetch countries. Status: ${response.status}`);

    const countries = await response.json();

    return countries
      .map((country: Country) => ({
        ...country,
        name: {
          common: country.translations?.eng?.common || country.name.common,
        },
      }))
      .sort((a: Country, b: Country) =>
        a.name.common.localeCompare(b.name.common)
      );
  } catch (error) {
    console.error('Error fetching countries:', error);
    return [];
  }
}

export async function getCountryByCode(code: string) {
  try {
    const response = await fetch(`${RESTCOUNTRIES_BASE_URL}/alpha/${code}`, {
      cache: 'force-cache',
      next: {
        revalidate: 604800,
        tags: [`country-${code}`],
      },
    });
    if (!response.ok) throw new Error('Failed to fetch country');
    const [country] = await response.json();
    return country;
  } catch (error) {
    console.error('Error fetching country:', error);
    return null;
  }
}

export async function searchCities(query: string) {
  try {
    const response = await fetch(
      `${NOMINATIM_BASE_URL}/search?format=json&q=${encodeURIComponent(query)}`,
      {
        next: {
          revalidate: 300,
        },
        headers: {
          'User-Agent': 'CountryExplorer/1.0',
        },
      }
    );
    if (!response.ok) throw new Error('Failed to search cities');
    return response.json();
  } catch (error) {
    console.error('Error searching cities:', error);
    return [];
  }
}

export async function searchCountries(query: string) {
  try {
    const response = await fetch(
      `${RESTCOUNTRIES_BASE_URL}/name/${encodeURIComponent(query)}`
    );
    if (!response.ok) throw new Error('Failed to search countries');
    return await response.json();
  } catch (error) {
    console.error('Error searching countries:', error);
    return [];
  }
}

export async function getCityDetails(lat: number, lon: number) {
  try {
    const response = await fetch(
      `${NOMINATIM_BASE_URL}/reverse?format=json&lat=${lat}&lon=${lon}&accept-language=en`
    );
    if (!response.ok) throw new Error('Failed to fetch city details');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching city details:', error);
    return null;
  }
}

export async function revalidateCountryData(code?: string) {
  try {
    if (code) {
      // Revalidate specific country
      await fetch(`/api/revalidate?tag=country-${code}`);
    } else {
      // Revalidate all countries
      await fetch('/api/revalidate?tag=countries');
    }
  } catch (error) {
    console.error('Revalidation failed:', error);
  }
}
