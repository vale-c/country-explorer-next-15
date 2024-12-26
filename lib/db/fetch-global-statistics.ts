import { db } from "@/drizzle.config";
import { costOfLiving } from "@/lib/db/schema";

export async function fetchGlobalStatistics(): Promise<{
  avgRent: number;
  avgInternetSpeed: number;
  avgMealPrice: number;
}> {
  const rawData = await db.select().from(costOfLiving);

  const parsedData = rawData.map((row) => ({
    ...row,
    price: Number(row.price),
  }));

  const rentItems = [
    "Apartment (1 bedroom) in City Centre",
    "Apartment (1 bedroom) Outside of Centre",
    "Apartment (3 bedrooms) in City Centre",
    "Apartment (3 bedrooms) Outside of Centre",
  ];

  const internetItems = [
    "Internet (60 Mbps or More, Unlimited Data, Cable/ADSL)",
  ];

  // Filter rent prices and exclude outliers
  const rentPrices = parsedData
    .filter((row) => rentItems.includes(row.item))
    .map((row) => {
      // console.log(row); // Log each row
      return row.price;
    })
    .filter((price) => price > 0 && price <= 10000); // Exclude rents > $10,000

  const avgRent =
    rentPrices.length > 0
      ? rentPrices.reduce((sum, price) => sum + price, 0) / rentPrices.length
      : 0;

  // Filter internet speeds and exclude outliers
  const internetSpeeds = parsedData
    .filter((row) => internetItems.includes(row.item))
    .map((row) => row.price)
    .filter((speed) => speed > 0 && speed <= 200); // Exclude speeds > 200 Mbps

  const avgInternetSpeed =
    internetSpeeds.length > 0
      ? internetSpeeds.reduce((sum, speed) => sum + speed, 0) /
        internetSpeeds.length
      : 0;

  const mealPrices = parsedData
    .filter((row) => row.item === "Meal, Inexpensive Restaurant")
    .map((row) => row.price)
    .filter((price) => price > 0 && price <= 100); // Exclude prices > $100

  const avgMealPrice =
    mealPrices.length > 0
      ? mealPrices.reduce((sum, price) => sum + price, 0) / mealPrices.length
      : 0;

  return {
    avgRent: parseFloat(avgRent.toFixed(2)), // Round to 2 decimal places
    avgInternetSpeed: parseFloat(avgInternetSpeed.toFixed(2)), // Round to 2 decimal places
    avgMealPrice: parseFloat(avgMealPrice.toFixed(2)), // Round to 2 decimal places
  };
}
