'use server';

import { unstable_cache } from 'next/cache';

const FALLBACK_IMAGES: Record<string, string> = {
  default: '/images/placeholder.jpg',
};

// In-memory cache for development
const imageCache = new Map<string, { url: string; timestamp: number }>();
const CACHE_DURATION = 3600000; // 1 hour in milliseconds

export async function getCountryImage(countryName: string) {
  return unstable_cache(
    async () => {
      // Check memory cache first
      const cached = imageCache.get(countryName);
      if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        return cached.url;
      }

      if (!process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY) {
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
          }
        );

        if (!response.ok) {
          return FALLBACK_IMAGES.default;
        }

        const data = await response.json();
        const imageUrl = data.results?.[0]?.urls?.regular;

        if (imageUrl) {
          // Update memory cache
          imageCache.set(countryName, {
            url: imageUrl,
            timestamp: Date.now(),
          });
          return imageUrl;
        }

        return FALLBACK_IMAGES.default;
      } catch (error) {
        console.error(`Error fetching image for ${countryName}:`, error);
        return FALLBACK_IMAGES.default;
      }
    },
    [`country-image-${countryName}`],
    {
      revalidate: 3600, // 1 hour
      tags: [`country-image-${countryName}`],
    }
  )();
}
