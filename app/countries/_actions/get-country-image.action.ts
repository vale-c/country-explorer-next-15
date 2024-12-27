"use server";

import { unstable_cacheLife as cacheLife } from "next/cache";
import { unstable_cacheTag as cacheTag } from "next/cache";
import { getCountryByName } from "./get-country-by-name.action";

export async function getCountryImage(countryName: string) {
  // Enable caching for this function
  "use cache";

  // Set cache revalidation time to 1 hour (3600 seconds)
  cacheLife("default");

  // Define a unique cache tag based on the country name
  cacheTag(`country-image-${countryName}`);

  try {
    // Fetch country data to use the flag as a fallback image
    const country = await getCountryByName(countryName);
    const fallbackImage = country?.flags?.svg || "/images/placeholder.jpg";

    // Check if the Pexels API key is available
    if (!process.env.NEXT_PUBLIC_PEXELS_API_KEY) {
      console.warn("Pexels API key is missing. Using fallback image.");
      return fallbackImage;
    }

    // Construct the Pexels API URL with the desired query
    const query = `${countryName} architecture streets skyline`;
    const response = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(
        query
      )}&per_page=1`,
      {
        headers: {
          Authorization: process.env.NEXT_PUBLIC_PEXELS_API_KEY,
        },
      }
    );

    // If the response is not OK, return the fallback image
    if (!response.ok) {
      console.error(
        `Pexels API error for ${countryName}: ${response.statusText}`
      );
      return fallbackImage;
    }

    // Parse the JSON response
    const data = await response.json();

    // Extract the image URL from the Pexels response
    const imageUrl = data.photos?.[0]?.src?.large || fallbackImage;

    return imageUrl;
  } catch (error) {
    // Log any unexpected errors and return the fallback image
    console.error(`Error fetching image for ${countryName}:`, error);
    return "/images/placeholder.jpg";
  }
}
