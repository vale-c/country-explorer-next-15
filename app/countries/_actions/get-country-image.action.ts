"use server";

import { getCountryByName } from "./get-country-by-name.action";

export async function getCountryImage(countryName: string) {
  try {
    const country = await getCountryByName(countryName);
    const fallbackImage = country?.flags?.svg || "/images/placeholder.jpg";

    if (!process.env.NEXT_PUBLIC_PEXELS_API_KEY) {
      return fallbackImage;
    }

    const response = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(
        countryName
      )} landscape architecture landmark&per_page=1`,
      {
        headers: {
          Authorization: process.env.NEXT_PUBLIC_PEXELS_API_KEY,
        },
      }
    );

    if (!response.ok) return fallbackImage;

    const data = await response.json();
    return data.photos?.[0]?.src?.large || fallbackImage;
  } catch (error) {
    console.error(error);
    return "/images/placeholder.jpg";
  }
}
