"use server";

import { db } from "@/drizzle.config";
import { costOfLivingCities } from "@/lib/db/schema";
import { ilike } from "drizzle-orm";

export async function searchCity(searchTerm: string) {
  const cities = await db
    .select({
      city: costOfLivingCities.city,
      item: costOfLivingCities.item,
      price: costOfLivingCities.price,
    })
    .from(costOfLivingCities)
    .where(ilike(costOfLivingCities.city, `%${searchTerm}%`))
    .groupBy(
      costOfLivingCities.city,
      costOfLivingCities.item,
      costOfLivingCities.price
    );

  // Group data by city
  const groupedCities = cities.reduce((acc, { city, item, price }) => {
    if (!acc[city]) {
      acc[city] = [];
    }
    acc[city].push({
      item,
      price: parseFloat(price as string), // Explicitly cast price to a number
    });
    return acc;
  }, {} as Record<string, { item: string; price: number }[]>);

  return Object.entries(groupedCities);
}
