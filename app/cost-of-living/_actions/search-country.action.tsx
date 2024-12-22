"use server";

import { db } from "@/drizzle.config";
import { costOfLiving } from "@/lib/db/schema";

export async function searchCountry(query: string) {
  try {
    const normalizedQuery = query.toLowerCase().trim();
    const countries = await db.select().from(costOfLiving).execute();

    const filteredCountries = countries.filter((country) =>
      country.country.toLowerCase().includes(normalizedQuery)
    );

    // Group and map the filtered results
    const groupedData = filteredCountries.reduce((acc, row) => {
      const { country, item, price } = row;
      if (!acc[country]) acc[country] = [];
      acc[country].push({ item, price: Number(price) });
      return acc;
    }, {} as Record<string, { item: string; price: number }[]>);

    return Object.entries(groupedData); // Return as [country, items][] format
  } catch (error) {
    console.error("Error searching countries in the database:", error);
    return [];
  }
}
