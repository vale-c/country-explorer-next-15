'use server';

import { Country } from '@/types/country';

export async function getCountryByCode(code: string): Promise<Country | null> {
  try {
    const response = await fetch(
      `https://restcountries.com/v3.1/alpha/${code}`,
      {
        cache: 'force-cache',
        next: {
          revalidate: 604800, // 1 week
          tags: [`country-${code}`],
        },
      }
    );
    if (!response.ok) throw new Error('Failed to fetch country');
    const [country] = await response.json();
    return country;
  } catch (error) {
    console.error('Error fetching country:', error);
    return null;
  }
}
