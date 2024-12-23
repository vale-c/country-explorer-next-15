'use server';

import { unstable_cache } from 'next/cache';

const FALLBACK_IMAGES: Record<string, string> = {
  default: '/images/placeholder.jpg',
};

export async function getCountryImage(countryName: string) {
  const cacheKey = `country-image-${countryName}`;

  return unstable_cache(
    async () => {
      if (!process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY) {
        console.error('Missing Unsplash API key');
        return FALLBACK_IMAGES.default;
      }

      try {
        const response = await fetch(
          `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
            countryName
          )} landscape nature&per_page=1`,
          {
            headers: {
              Authorization: `Client-ID ${process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY}`,
              'Accept-Version': 'v1',
            },
            cache: 'force-cache',
            next: {
              revalidate: 3600, // 1 hour
              tags: [cacheKey],
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch image: ${response.statusText}`);
        }

        const data = await response.json();
        const imageUrl = data.results?.[0]?.urls?.regular;

        if (!imageUrl) {
          throw new Error('No image found');
        }

        // Cache the actual image too
        await fetch(imageUrl, {
          cache: 'force-cache',
          next: { revalidate: 3600 },
        });

        return imageUrl;
      } catch (error) {
        console.error(`Error fetching image for ${countryName}:`, error);
        return FALLBACK_IMAGES.default;
      }
    },
    [cacheKey],
    {
      revalidate: 3600,
      tags: [cacheKey],
    }
  )();
}
