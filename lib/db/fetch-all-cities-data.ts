import { db } from "@/drizzle.config";
import { costOfLivingCities } from "@/lib/db/schema";

/**
 * Fetches paginated and grouped cost of living data for cities, sorted alphabetically by city.
 *
 * @param {number} currentPage - The current page number.
 * @param {number} rowsPerPage - The number of cities per page.
 * @returns {Promise<{ data: [string, { item: string; price: number }[]][]; totalRows: number }>}
 */
export async function fetchPaginatedGroupedCitiesData(
  currentPage: number,
  rowsPerPage: number
): Promise<{
  data: [string, { item: string; price: number }[]][];
  totalRows: number;
}> {
  // Fetch all rows sorted alphabetically by city
  const rawData = await db
    .select()
    .from(costOfLivingCities)
    .orderBy(costOfLivingCities.city);

  // Ensure `price` is a number
  const parsedData = rawData.map((row) => ({
    ...row,
    price: Number(row.price), // Convert `price` from string to number
  }));

  // Group data by city
  const groupedData = parsedData.reduce((acc, row) => {
    const { city, item, price } = row;
    if (!acc[city]) acc[city] = [];
    acc[city].push({ item, price });
    return acc;
  }, {} as Record<string, { item: string; price: number }[]>);

  // Convert grouped data into an array of [city, items]
  const allGroupedData = Object.entries(groupedData);

  // Apply pagination to the grouped data
  const totalRows = allGroupedData.length; // Total number of cities
  const paginatedData = allGroupedData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return { data: paginatedData, totalRows };
}
