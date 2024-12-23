'use server';

import { db } from '@/drizzle.config';
import { costOfLiving } from '@/lib/db/schema';
import { sql } from 'drizzle-orm';

interface GlobalStatistics {
  averageRentCityCenter: number;
  averageInternetSpeed: number;
  averageCoffeePrice: number;
  totalCountries: number;
}

export async function getGlobalStatistics(): Promise<GlobalStatistics> {
  try {
    const coffeeQuery = await db
      .select({
        items: sql<string[]>`ARRAY_AGG(DISTINCT item)`,
      })
      .from(costOfLiving)
      .where(sql`item ILIKE '%cappuccino%' OR item ILIKE '%coffee%'`);

    const coffeeItemName =
      coffeeQuery.length > 0 && coffeeQuery[0].items.length > 0
        ? coffeeQuery[0].items[0]
        : 'Cappuccino (Regular)';

    const results = await db
      .select({
        rentAvg: sql<string>`ROUND(AVG(CASE WHEN item = 'Apartment (1 bedroom) in City Centre' THEN price::numeric END)::numeric, 2)`,
        internetAvg: sql<string>`ROUND(AVG(CASE WHEN item = 'Internet (60 Mbps or More, Unlimited Data, Cable/ADSL)' THEN price::numeric END)::numeric, 2)`,
        coffeeAvg: sql<string>`ROUND(AVG(CASE WHEN item = ${coffeeItemName} THEN price::numeric END)::numeric, 2)`,
        countryCount: sql<number>`COUNT(DISTINCT country)`,
      })
      .from(costOfLiving);

    const stats = results[0];

    const rentAvg = parseFloat(stats.rentAvg || '0');
    const internetAvg = parseFloat(stats.internetAvg || '0');
    const coffeeAvg = parseFloat(stats.coffeeAvg || '0');

    return {
      averageRentCityCenter: Math.round(rentAvg),
      averageInternetSpeed: Math.round(internetAvg),
      averageCoffeePrice: Number(coffeeAvg.toFixed(2)),
      totalCountries: stats.countryCount || 0,
    };
  } catch (error) {
    console.error('Error fetching global statistics:', error);
    return {
      averageRentCityCenter: 0,
      averageInternetSpeed: 0,
      averageCoffeePrice: 0,
      totalCountries: 0,
    };
  }
}
