'use server';

import { unstable_cache } from 'next/cache';

export async function getCountryByName(name: string) {
  return unstable_cache(
    async () => {
      try {
        const response = await fetch(
          `https://restcountries.com/v3.1/name/${encodeURIComponent(
            name
          )}?fields=name,flags`
        );

        if (!response.ok) return null;

        const data = await response.json();
        return data[0] || null;
      } catch (error) {
        console.error(`Error fetching country data for ${name}:`, error);
        return null;
      }
    },
    [`country-data-${name}`],
    {
      revalidate: 86400, // Cache for 24 hours
    }
  )();
}
