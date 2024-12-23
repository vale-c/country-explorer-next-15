'use server';

import { unstable_cache } from 'next/cache';

const FALLBACK_IMAGES: Record<string, string> = {
  default: '/images/placeholder.jpg',
  // Add some default images for common countries if needed
  // 'United States': '/images/countries/usa.jpg',
};

export async function getCountryImage(countryName: string) {
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
            next: {
              revalidate: 86400, // 24 hours
              tags: [`country-image-${countryName}`],
            },
          }
        );

        // Handle rate limiting
        const remaining = response.headers.get('X-Ratelimit-Remaining');
        if (remaining && parseInt(remaining) < 10) {
          console.warn(
            `Unsplash API rate limit warning: ${remaining} requests remaining`
          );
        }

        if (response.status === 403) {
          console.error(
            'Unsplash API authorization failed - check your API key'
          );
          return FALLBACK_IMAGES.default;
        }

        if (!response.ok) {
          console.error(
            `Failed to fetch image for ${countryName}: ${response.status} ${response.statusText}`
          );
          return FALLBACK_IMAGES[countryName] || FALLBACK_IMAGES.default;
        }

        const data = await response.json();
        const imageUrl = data.results?.[0]?.urls?.regular;

        if (!imageUrl) {
          console.warn(`No image found for ${countryName}`);
          return FALLBACK_IMAGES[countryName] || FALLBACK_IMAGES.default;
        }

        return imageUrl;
      } catch (error) {
        console.error(`Error fetching image for ${countryName}:`, error);
        return FALLBACK_IMAGES[countryName] || FALLBACK_IMAGES.default;
      }
    },
    [`country-image-${countryName}`],
    {
      revalidate: 86400,
      tags: [`country-image-${countryName}`],
    }
  )();
}
