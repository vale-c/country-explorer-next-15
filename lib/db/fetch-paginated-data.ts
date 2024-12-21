import { db } from "@/drizzle.config";
import { costOfLiving } from "@/lib/db/schema";

/**
 * Fetches paginated and grouped cost of living data, sorted alphabetically by country.
 *
 * @param {number} currentPage - The current page number.
 * @param {number} rowsPerPage - The number of countries per page.
 * @returns {Promise<{ data: [string, { item: string; price: number }[]][]; totalRows: number }>}
 */
export async function fetchPaginatedGroupedData(
  currentPage: number,
  rowsPerPage: number
): Promise<{
  data: [string, { item: string; price: number }[]][];
  totalRows: number;
}> {
  // Fetch all rows sorted alphabetically by country
  const rawData = await db
    .select()
    .from(costOfLiving)
    .orderBy(costOfLiving.country);

  // Ensure `price` is a number
  const parsedData = rawData.map((row) => ({
    ...row,
    price: parseFloat(row.price as string),
  }));

  // Group data by country
  const groupedData = parsedData.reduce((acc, row) => {
    const { country, item, price } = row;
    if (!acc[country]) acc[country] = [];
    acc[country].push({ item, price });
    return acc;
  }, {} as Record<string, { item: string; price: number }[]>);

  // Convert grouped data into an array of [country, items]
  const allGroupedData = Object.entries(groupedData);

  // Apply pagination to the grouped data
  const totalRows = allGroupedData.length; // Total number of countries
  const paginatedData = allGroupedData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return { data: paginatedData, totalRows };
}
