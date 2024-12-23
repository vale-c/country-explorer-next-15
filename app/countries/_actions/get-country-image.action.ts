'use server';

import { unstable_cache } from 'next/cache';

export async function getCountryImage(countryName: string) {
  return unstable_cache(
    async () => {
      try {
        const response = await fetch(
          `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
            countryName
          )} landscape`,
          {
            headers: {
              Authorization: `Client-ID ${process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY}`,
            },
            next: {
              revalidate: 86400, // 24 hours
              tags: [`country-image-${countryName}`],
            },
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch image');
        }

        const data = await response.json();
        return data.results[0]?.urls?.regular || '/images/placeholder.jpg';
      } catch (error) {
        console.error('Error fetching image:', error);
        return '/images/placeholder.jpg';
      }
    },
    [`country-image-${countryName}`],
    {
      revalidate: 86400,
      tags: [`country-image-${countryName}`],
    }
  )();
}
