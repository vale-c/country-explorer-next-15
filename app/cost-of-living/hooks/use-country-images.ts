'use client';

import { useState, useEffect, useCallback } from 'react';
import { getCountryImage } from '@/lib/data';

export function useCountryImages(
  countries: string[],
  initialImageMap: Record<string, string>
) {
  const [images, setImages] = useState<Record<string, string>>(initialImageMap);
  const [isLoading, setIsLoading] = useState(false);

  // Memoize the image loading function
  const loadMissingImages = useCallback(async () => {
    const missingCountries = countries.filter((country) => !images[country]);

    if (missingCountries.length === 0) return;

    setIsLoading(true);
    const newImages: Record<string, string> = {};

    await Promise.all(
      missingCountries.map(async (country) => {
        const image = await getCountryImage(country);
        newImages[country] = image;
      })
    );

    setImages((prev) => ({ ...prev, ...newImages }));
    setIsLoading(false);
  }, [countries, images]);

  // Only load images when countries change or initialImageMap changes
  useEffect(() => {
    setImages(initialImageMap);
  }, [initialImageMap]);

  useEffect(() => {
    loadMissingImages();
  }, [loadMissingImages]);

  return { images, isLoading };
}
