'use server';

import { unstable_cache } from 'next/cache';
import { getCountryByName } from './get-country-by-name.action';

export async function getCountryImage(countryName: string) {
  const cacheKey = `country-image-${countryName}`;

  return unstable_cache(
    async () => {
      try {
        // First try to get the country data to have the flag as fallback
        const country = await getCountryByName(countryName);
        const fallbackImage = country?.flags?.svg || '/images/placeholder.jpg';

        if (!process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY) {
          return fallbackImage;
        }

        const response = await fetch(
          `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
            countryName
          )} landscape nature&per_page=1`,
          {
            headers: {
              Authorization: `Client-ID ${process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY}`,
              'Accept-Version': 'v1',
            },
          }
        );

        if (!response.ok) {
          return fallbackImage;
        }

        const data = await response.json();
        return data.results?.[0]?.urls?.regular || fallbackImage;
      } catch (error) {
        console.error(`Error fetching image for ${countryName}:`, error);
        return '/images/placeholder.jpg';
      }
    },
    [cacheKey],
    {
      revalidate: 3600,
      tags: [cacheKey],
    }
  )();
}
